
"use client";

import { useEffect, useState } from "react";
import { useActivePlayerSync } from "@/hooks/useActivePlayer";
import { Button } from "@/components/ui/button";
import { PlayerInfoCard, TeamCard, RemainingPlayersCard } from "@/components/auction-cards";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Home, Crown } from "lucide-react";

export default function ThakurCaptainPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [purses, setPurses] = useState<Record<string, number>>({});
  const [teams, setTeams] = useState<Record<string, any>>({});
  const { activePlayerIndex, currentBid, setCurrentBid, lastBidder, loading } = useActivePlayerSync();
  const activePlayer = players[activePlayerIndex] || null;

  const fetchPlayersAndPurses = async () => {
    const { data } = await import("@/lib/supabaseClient").then(
      (mod) => mod.supabase.from("Players").select("*")
    );
    setPlayers(data || []);
    const { fetchTeamPurses, fetchTeamData } = await import("@/lib/teamPurse");
    const purseMap = await fetchTeamPurses();
    const teamDataMap = await fetchTeamData();
    setPurses(purseMap);
    setTeams(teamDataMap);
  };

  useEffect(() => {
    fetchPlayersAndPurses();

    // Subscribe to player changes for real-time updates
    const setupPlayerSubscription = async () => {
      const { supabase } = await import("@/lib/supabaseClient");
      
      // Try postgres_changes subscription
      const playerSubscription = supabase
        .channel("players_channel_thakur")
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
        .channel("teams_channel_thakur")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "teams" },
          async (payload) => {
            // Refresh team data when teams are updated
            await fetchPlayersAndPurses();
          }
        )
        .subscribe();

      // Also listen for broadcast messages from admin
      const broadcastSubscription = supabase
        .channel('player_updates_broadcast_thakur')
        .on('broadcast', { event: 'player_sold' }, async (payload) => {
          console.log("Thakur page - Received player_sold broadcast:", payload);
          await fetchPlayersAndPurses();
        })
        .on('broadcast', { event: 'next_player' }, async (payload) => {
          console.log("Thakur page - Received next_player broadcast:", payload);
          await fetchPlayersAndPurses();
        })
        .on('broadcast', { event: 'bid_update' }, async (payload) => {
          console.log("Thakur page - Received bid_update broadcast:", payload);
          await fetchPlayersAndPurses();
        })
        .subscribe();

      // Fallback: polling every 5 seconds
      const pollInterval = setInterval(async () => {
        await fetchPlayersAndPurses();
      }, 5000);

      return () => {
        supabase.removeChannel(playerSubscription);
        supabase.removeChannel(teamSubscription);
        supabase.removeChannel(broadcastSubscription);
        clearInterval(pollInterval);
      };
    };

    let cleanup: (() => void) | undefined;
    setupPlayerSubscription().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // No loading screen; render main UI immediately

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur-md border border-white/10 flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex items-center space-x-3 text-white">
            <Crown className="h-6 w-6 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Thakur XI Captain
            </h1>
          </div>
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
                <div className="flex gap-3 mb-2">
                  <Button className="bg-gradient-to-r from-green-600 to-green-700 text-white flex-1 rounded-xl shadow-lg cursor-default">
                    Your Purse: <span className="text-green-200">₹{teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000}</span>
                  </Button>
                </div>
                <div className="flex gap-3">
                                  <Button
                  className={`${(teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 100 : 500)) ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-blue-500 to-blue-700'} text-white flex-1 rounded-xl shadow-lg font-bold`}
                  onClick={() => setCurrentBid(currentBid + (currentBid < 5000 ? 100 : 500), 'Thakur XI')}
                  disabled={!activePlayer || (teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 100 : 500)) || ((teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) - currentBid) < (currentBid < 5000 ? 100 : 500)}
                >
                  {((teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 100 : 500)) || ((teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) - currentBid) < (currentBid < 5000 ? 100 : 500)) ? `₹${currentBid < 5000 ? 100 : 500} (Insufficient)` : `+ ₹${currentBid < 5000 ? 100 : 500}`}
                </Button>
                <Button
                  className={`${(teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 500 : 1000)) ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-purple-500 to-purple-700'} text-white flex-1 rounded-xl shadow-lg font-bold`}
                  onClick={() => setCurrentBid(currentBid + (currentBid < 5000 ? 500 : 1000), 'Thakur XI')}
                  disabled={!activePlayer || (teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 500 : 1000)) || ((teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) - currentBid) < (currentBid < 5000 ? 500 : 1000)}
                >
                  {((teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 500 : 1000)) || ((teams["Thakur XI"]?.purse !== undefined ? teams["Thakur XI"].purse : 50000) - currentBid) < (currentBid < 5000 ? 500 : 1000)) ? `₹${currentBid < 5000 ? 500 : 1000} (Insufficient)` : `+ ₹${currentBid < 5000 ? 500 : 1000}`}
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
            />
          </div>
        </div>
      </div>
      {/* Bottom Section - Remaining Players Dynamic Grid */}
      <div className="w-full flex justify-center pb-6 pt-4">
        {/* Only show remaining players grid, no bidding buttons */}
        {(() => {
          const unsoldPlayers = players.filter(p => !p.sold);
          const activeUnsoldIndex = unsoldPlayers.findIndex(p => p.player_id === (players[activePlayerIndex]?.player_id));
          return <RemainingPlayersCard players={players} activePlayerIndex={activeUnsoldIndex} />;
        })()}
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3); /* slate-800/30 */
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, rgba(51,65,85,0.7) 0%, rgba(71,85,105,0.7) 100%); /* slate-700/70 to slate-800/70 */
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, rgba(71,85,105,0.9) 0%, rgba(30,41,59,0.9) 100%);
        }
      `}</style>
    </div>
  );
}
