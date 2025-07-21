"use client"

import { useEffect, useState } from "react"
import { useActivePlayerSync } from "@/hooks/useActivePlayer";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayerInfoCard, TeamCard, RemainingPlayersCard } from "@/components/auction-cards";
import { Home } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [purses, setPurses] = useState<Record<string, number>>({});
  const [teams, setTeams] = useState<Record<string, any>>({});
  const [captains, setCaptains] = useState<Record<string, { id: number; name: string } | null>>({});
  const { activePlayerIndex, setActivePlayerIndex, currentBid, lastBidder, loading } = useActivePlayerSync();
  const activePlayer = players[activePlayerIndex] || null;

  const fetchPlayersAndPurses = async () => {
    const { data } = await supabase.from("Players").select("*")
    setPlayers(data || [])
    const { fetchTeamPurses, fetchTeamData } = await import("@/lib/teamPurse");
    const purseMap = await fetchTeamPurses();
    const teamDataMap = await fetchTeamData();
    setPurses(purseMap);
    setTeams(teamDataMap);
    
    // Extract captain information from team data
    const captainMap: Record<string, { id: number; name: string } | null> = {};
    Object.entries(teamDataMap).forEach(([teamName, teamData]: [string, any]) => {
      if (teamData.captain_player_id && teamData.captain_name) {
        captainMap[teamName] = {
          id: teamData.captain_player_id,
          name: teamData.captain_name
        };
      } else {
        captainMap[teamName] = null;
      }
    });
    setCaptains(captainMap);
  };

  const handleCaptainSelect = async (teamName: string, playerId: number, playerName: string) => {
    try {
      const { assignCaptain } = await import("@/lib/teamPurse");
      await assignCaptain(teamName, playerId, playerName);
      
      // Update local state
      setCaptains(prev => ({
        ...prev,
        [teamName]: { id: playerId, name: playerName }
      }));
      
      // Refresh data to ensure consistency
      await fetchPlayersAndPurses();
      
      alert(`${playerName} has been assigned as captain of ${teamName}!`);
    } catch (error: any) {
      console.error('Error assigning captain:', error);
      alert('Error assigning captain: ' + error.message);
    }
  };

  useEffect(() => {
    fetchPlayersAndPurses()

    // Subscribe to player changes for real-time updates
    const playerSubscription = supabase
      .channel("players_channel_admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Players" },
        async (payload) => {
          // Refresh player data when any player is updated
          await fetchPlayersAndPurses();
        }
      )
      .subscribe();

    // Subscribe to team changes for real-time purse/count updates
    const teamSubscription = supabase
      .channel("teams_channel_admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "teams" },
        async (payload) => {
          // Refresh team data when teams are updated
          await fetchPlayersAndPurses();
        }
      )
      .subscribe();

    // Subscribe to captain assignment broadcasts
    const captainBroadcastSubscription = supabase
      .channel('captain_updates_admin')
      .on('broadcast', { event: 'captain_assigned' }, async (payload) => {
        console.log("Admin page - Received captain_assigned broadcast:", payload);
        await fetchPlayersAndPurses();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(playerSubscription);
      supabase.removeChannel(teamSubscription);
      supabase.removeChannel(captainBroadcastSubscription);
    };
  }, []);

  const refreshPlayerData = async () => {
    const { data } = await supabase.from("Players").select("*");
    setPlayers(data || []);
  };

  const refreshTeamData = async () => {
    const { fetchTeamPurses, fetchTeamData } = await import("@/lib/teamPurse");
    const purseMap = await fetchTeamPurses();
    const teamDataMap = await fetchTeamData();
    setPurses(purseMap);
    setTeams(teamDataMap);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <a href="/">
            <Button className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur-md border border-white/10 flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </a>
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <Button
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 shadow-lg"
            onClick={async () => {
              if (confirm('Are you sure you want to restart the auction? This will remove all players from teams and reset everything back to the beginning.')) {
                try {
                  const { resetTeamData } = await import("@/lib/teamPurse");
                  await resetTeamData();
                  // Reset all players
                  const resetPlayersUpdate = await supabase
                    .from("Players")
                    .update({ sold: false, team: null, sold_amount: null })
                    .neq("player_id", -1); // Update all players
                  if (resetPlayersUpdate.error) {
                    console.error('Players reset error:', resetPlayersUpdate.error);
                    alert('Error resetting players: ' + resetPlayersUpdate.error.message);
                    return;
                  }
                  // Reset auction state
                  const resetAuctionUpdate = await supabase
                    .from("auction_state")
                    .update({ active_player_index: -1, current_bid: 0, last_bidder: null })
                    .eq("id", 1);
                  if (resetAuctionUpdate.error) {
                    console.error('Auction state reset error:', resetAuctionUpdate.error);
                    alert('Error resetting auction state: ' + resetAuctionUpdate.error.message);
                    return;
                  }
                  // Refresh all data
                  await refreshPlayerData();
                  await refreshTeamData();
                  // Reset captain state
                  setCaptains({});
                  setActivePlayerIndex(-1);
                  alert('Auction reset successfully!');
                } catch (error: any) {
                  console.error('Reset error:', error);
                  alert('Error resetting auction: ' + error.message);
                }
              }
            }}
          >
            Reset Auction
          </Button>
        </div>
        {/* Main Content: Player Info, Thakur XI, Gabbar XI */}
        <div className="flex-1 grid grid-cols-12 gap-6">
          {/* Left Side - Player Info */}
          <div className="col-span-4 space-y-4">
          <PlayerInfoCard activePlayer={activePlayer} lastBidder={lastBidder}>
            <div className="mt-auto space-y-3">
              <div className="flex gap-3 mb-2">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex-1 rounded-xl shadow-lg cursor-default">
                  Current Bid: <span className="text-purple-200">₹{currentBid}</span> {lastBidder === 'Thakur XI' ? '(Thakur XI)' : lastBidder === 'Gabbar XI' ? '(Gabbar XI)' : ''}
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white flex-1 rounded-xl shadow-lg"
                  disabled={!activePlayer || !lastBidder || !currentBid}
                  onClick={async () => {
                    if (!activePlayer || !lastBidder || !currentBid) return;
                    // 1. Fetch auction_state to get active_player_index
                    const { data: auctionState, error: auctionStateError } = await supabase
                      .from("auction_state")
                      .select("active_player_index")
                      .eq("id", 1)
                      .single();
                    if (auctionStateError) {
                      console.error('Auction state fetch error:', auctionStateError);
                      alert('Error fetching auction state: ' + auctionStateError.message);
                      return;
                    }
                    // 2. Mark player as sold, assign team, and set sold amount
                    const playerObj = players[auctionState.active_player_index];
                    const playerId = playerObj?.player_id;
                    const teamName = lastBidder; // lastBidder is now already "Thakur XI" or "Gabbar XI"
                    const playerUpdate = await supabase
                      .from("Players")
                      .update({ sold: true, team: teamName, sold_amount: currentBid })
                      .eq("player_id", playerId);
                    if (playerUpdate.error) {
                      console.error('Player update error:', playerUpdate.error);
                      alert('Error updating player: ' + playerUpdate.error.message);
                    }
                    // 2. Subtract sold_amount from team's purse and increment player count
                    try {
                      const { updateTeamPurseAndCount } = await import("@/lib/teamPurse");
                      // Get current purse
                      const { data: teamData, error: teamFetchError } = await supabase
                        .from("teams")
                        .select("purse")
                        .eq("team_name", teamName)
                        .single();
                      if (teamFetchError) {
                        console.error('Team fetch error:', teamFetchError);
                        alert('Error fetching team purse: ' + teamFetchError.message);
                        return;
                      }
                      const newPurse = ((teamData as any)?.purse ?? 0) - currentBid;
                      await updateTeamPurseAndCount(teamName, newPurse, 1);
                      // Refresh team data to update UI
                      await refreshTeamData();
                      // Refresh player data to show updated team assignments
                      await refreshPlayerData();
                    } catch (error: any) {
                      console.error('Team update error:', error);
                      alert('Error updating team data: ' + error.message);
                      return;
                    }
                    // 3. Update auction_state table
                    const auctionUpdate = await supabase
                      .from("auction_state")
                      .update({ current_bid: 0, last_bidder: null })
                      .eq("id", 1);
                    if (auctionUpdate.error) {
                      console.error('Auction state update error:', auctionUpdate.error);
                      alert('Error updating auction state: ' + auctionUpdate.error.message);
                    }
                    setActivePlayerIndex(-1); // Set active player to none
                    // 6. Refresh players
                    const { data: refreshedPlayers, error: refreshError } = await supabase.from("Players").select("*");
                    if (refreshError) {
                      console.error('Player refresh error:', refreshError);
                      alert('Error refreshing players: ' + refreshError.message);
                    }
                    setPlayers(refreshedPlayers || []);
                    
                    // Broadcast the player sale to other pages
                    const broadcastChannel = supabase.channel('player_updates_broadcast');
                    await broadcastChannel.subscribe();
                    await broadcastChannel.send({
                      type: 'broadcast',
                      event: 'player_sold',
                      payload: { 
                        playerId: playerId, 
                        team: teamName, 
                        amount: currentBid 
                      }
                    });
                    await supabase.removeChannel(broadcastChannel);
                  }}
                >
                  Sell Player
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-1 rounded-xl shadow-lg"
                  disabled={(currentBid > 0 && !!lastBidder) || players.filter(p => !p.sold).length === 0}
                  onClick={async () => {
                    if (players.length === 0) return;
                    // Filter unsold players
                    const unsoldPlayers = players.filter(p => !p.sold);
                    if (unsoldPlayers.length === 0) {
                      alert('All players have been auctioned!');
                      return;
                    }
                    // Pick a random unsold player
                    const randomIdx = Math.floor(Math.random() * unsoldPlayers.length);
                    const randomPlayer = unsoldPlayers[randomIdx];
                    const newIndex = players.findIndex(p => p.player_id === randomPlayer.player_id);
                    
                    // Update auction_state table with new player and reset bid
                    const auctionUpdate = await supabase
                      .from("auction_state")
                      .update({ 
                        active_player_index: newIndex,
                        current_bid: 0,
                        last_bidder: null
                      })
                      .eq("id", 1);
                    
                    if (auctionUpdate.error) {
                      console.error('Auction state update error:', auctionUpdate.error);
                      alert('Error updating auction state: ' + auctionUpdate.error.message);
                      return;
                    }
                    
                    setActivePlayerIndex(newIndex);
                    
                    // Broadcast the next player event to all pages
                    const broadcastChannel = supabase.channel('player_updates_broadcast');
                    await broadcastChannel.subscribe();
                    await broadcastChannel.send({
                      type: 'broadcast',
                      event: 'next_player',
                      payload: { 
                        playerId: randomPlayer.player_id,
                        playerIndex: newIndex,
                        playerName: randomPlayer.player_name
                      }
                    });
                    await supabase.removeChannel(broadcastChannel);
                  }}
                >
                  Next Player
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white flex-1 rounded-xl shadow-lg"
                  onClick={async () => {
                    if (confirm('Reset the current bid to 0? This will clear the current bid and last bidder.')) {
                      try {
                        // Reset auction state for current player
                        const resetBidUpdate = await supabase
                          .from("auction_state")
                          .update({ current_bid: 0, last_bidder: null })
                          .eq("id", 1);
                        if (resetBidUpdate.error) {
                          console.error('Bid reset error:', resetBidUpdate.error);
                          alert('Error resetting bid: ' + resetBidUpdate.error.message);
                          return;
                        }
                        alert('Bid reset successfully!');
                      } catch (error: any) {
                        console.error('Reset bid error:', error);
                        alert('Error resetting bid: ' + error.message);
                      }
                    }
                  }}
                >
                  Reset Bid
                </Button>
              </div>
            </div>
          </PlayerInfoCard>
          </div>
          {/* Middle - Thakur XI */}
          <div className="col-span-4">
            <TeamCard
              team="Thakur XI"
              logoSrc="/thakur1.png"
              gradientFrom="slate-800/50"
              gradientTo="slate-900/50"
              borderColor="white/20"
              players={players}
              purse={teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000}
              playerCount={teams["Thakur XI"]?.player_count}
              isAdmin={true}
              onCaptainSelect={handleCaptainSelect}
              currentCaptain={captains["Thakur XI"]}
            />
          </div>
          {/* Right - Gabbar XI */}
          <div className="col-span-4">
            <TeamCard
              team="Gabbar XI"
              logoSrc="/gabbar1.png"
              gradientFrom="slate-800/50"
              gradientTo="slate-900/50"
              borderColor="white/20"
              players={players}
              purse={teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000}
              playerCount={teams["Gabbar XI"]?.player_count}
              isAdmin={true}
              onCaptainSelect={handleCaptainSelect}
              currentCaptain={captains["Gabbar XI"]}
            />
          </div>
        </div>
      </div>
      {/* Bottom Section - Remaining Players Dynamic Grid */}
      <div className="w-full flex justify-center pb-6 pt-4">
        {(() => {
          const unsoldPlayers = players.filter(p => !p.sold);
          const activeUnsoldIndex = unsoldPlayers.findIndex(p => p.player_id === (players[activePlayerIndex]?.player_id));
          return <RemainingPlayersCard players={players} activePlayerIndex={activeUnsoldIndex} />;
        })()}
      </div>
    </div>
  );
}
