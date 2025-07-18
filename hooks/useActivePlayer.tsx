import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useActivePlayerSync() {
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchActivePlayer = async () => {
      const { data, error } = await supabase
        .from("auction_state")
        .select("active_player_index")
        .eq("id", 1)
        .single();
      if (data) setActivePlayerIndex(data.active_player_index);
      setLoading(false);
    };
    fetchActivePlayer();

    // Subscribe to changes
    const subscription = supabase
      .channel("auction_state_channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "auction_state" },
        (payload) => {
          setActivePlayerIndex(payload.new.active_player_index);
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

  return { activePlayerIndex, setActivePlayerIndex: updateActivePlayerIndex, loading };
}
