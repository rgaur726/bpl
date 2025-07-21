import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useActivePlayerSync() {
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(-1);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [lastBidder, setLastBidder] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchAuctionState = async () => {
      const { data, error } = await supabase
        .from("auction_state")
        .select("active_player_index, current_bid, last_bidder")
        .eq("id", 1)
        .single();
      if (data) {
        setActivePlayerIndex(data.active_player_index);
        setCurrentBid(data.current_bid ?? 0);
        setLastBidder(data.last_bidder ?? "");
      }
      setLoading(false);
    };
    fetchAuctionState();

    // Subscribe to changes
    const subscription = supabase
      .channel("auction_state_channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "auction_state" },
        (payload) => {
          setActivePlayerIndex(payload.new.active_player_index);
          setCurrentBid(payload.new.current_bid ?? 0);
          setLastBidder(payload.new.last_bidder ?? "");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Function to update active player index
  const updateActivePlayerIndex = async (newIndex: number) => {
    await supabase
      .from("auction_state")
      .update({ active_player_index: newIndex })
      .eq("id", 1);
    setActivePlayerIndex(newIndex);
  };

  // Function to update current bid and last bidder
  const updateCurrentBid = async (newBid: number, bidder: string) => {
    // Get team's current purse to validate bid
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("purse")
      .eq("team_name", bidder)
      .single();

    if (teamError) {
      console.error('Error fetching team purse:', teamError);
      alert('Error checking team purse. Please try again.');
      return;
    }

    const currentPurse = teamData?.purse ?? 50000;
    
    // Validate that the new bid doesn't exceed team's purse
    if (newBid > currentPurse) {
      alert(`Insufficient funds! ${bidder} has only ₹${currentPurse} remaining. Cannot bid ₹${newBid}.`);
      return;
    }

    await supabase
      .from("auction_state")
      .update({ current_bid: newBid, last_bidder: bidder })
      .eq("id", 1);
    setCurrentBid(newBid);
    setLastBidder(bidder);
    
    // Broadcast the bid update to all pages
    const broadcastChannel = supabase.channel('player_updates_broadcast');
    await broadcastChannel.subscribe();
    await broadcastChannel.send({
      type: 'broadcast',
      event: 'bid_update',
      payload: { 
        newBid: newBid,
        bidder: bidder
      }
    });
    await supabase.removeChannel(broadcastChannel);
  };

  return { activePlayerIndex, setActivePlayerIndex: updateActivePlayerIndex, currentBid, setCurrentBid: updateCurrentBid, lastBidder, loading };
}
