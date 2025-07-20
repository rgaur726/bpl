"use client";

import { useEffect, useState } from "react";
import { useActivePlayerSync } from "@/hooks/useActivePlayer";
import { Button } from "@/components/ui/button";
import { PlayerInfoCard, TeamCard, RemainingPlayersCard } from "@/components/auction-cards";
import Link from "next/link";
import { Home, Eye } from "lucide-react";

export default function ViewerPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [purses, setPurses] = useState<Record<string, number>>({});
  const [teams, setTeams] = useState<Record<string, any>>({});
  const { activePlayerIndex, currentBid, lastBidder, loading } = useActivePlayerSync();
  const activePlayer = players[activePlayerIndex] || null;

  const fetchPlayersAndPurses = async () => {
    console.log("Viewer page - Fetching players and purses...");
    const { data } = await import("@/lib/supabaseClient").then(
      (mod) => mod.supabase.from("Players").select("*")
    );
    setPlayers(data || []);
    console.log("Viewer page - Players fetched:", data?.length || 0);
    const { fetchTeamPurses, fetchTeamData } = await import("@/lib/teamPurse");
    const purseMap = await fetchTeamPurses();
    const teamDataMap = await fetchTeamData();
    setPurses(purseMap);
    setTeams(teamDataMap);
    console.log("Viewer page - Teams fetched:", teamDataMap);
  };

  useEffect(() => {
    fetchPlayersAndPurses();

    // Subscribe to player changes for real-time updates
    const setupPlayerSubscription = async () => {
      const { supabase } = await import("@/lib/supabaseClient");
      
      // Try postgres_changes subscription
      const playerSubscription = supabase
        .channel("players_channel_viewer")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "Players" },
          async (payload) => {
            console.log("Viewer page - Player data changed:", payload);
            // Refresh player data when any player is updated
            await fetchPlayersAndPurses();
          }
        )
        .subscribe();

      // Subscribe to team changes for real-time purse/count updates
      const teamSubscription = supabase
        .channel("teams_channel_viewer")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "teams" },
          async (payload) => {
            console.log("Viewer page - Team data changed:", payload);
            // Refresh team data when teams are updated
            await fetchPlayersAndPurses();
          }
        )
        .subscribe();

      // Also listen for broadcast messages from admin
      const broadcastSubscription = supabase
        .channel('player_sold_broadcast_viewer')
        .on('broadcast', { event: 'player_sold' }, async (payload) => {
          console.log("Viewer page - Received broadcast:", payload);
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
          <div className="flex items-center space-x-2 text-white/80">
            <Eye className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-semibold">Live Auction View</span>
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
      {/* Bottom Section - Remaining Players Static Grid */}
      <div className="w-full flex justify-center pb-6 pt-4">
        <RemainingPlayersCard players={players} activePlayerIndex={activePlayerIndex} />
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
