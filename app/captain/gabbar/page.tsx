"use client";

import { useEffect, useState } from "react";
import { useActivePlayerSync } from "@/hooks/useActivePlayer";
import { Button } from "@/components/ui/button";
import { PlayerInfoCard, TeamCard, RemainingPlayersCard } from "@/components/auction-cards";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Home, Crown, Lock, Eye, EyeOff } from "lucide-react";

export default function GabbarCaptainPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [purses, setPurses] = useState<Record<string, number>>({});
  const [teams, setTeams] = useState<Record<string, any>>({});
  const [captainName, setCaptainName] = useState<string>("Gabbar XI Captain");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState("");
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
    
    // Update captain name
    const gabbarTeam = teamDataMap["Gabbar XI"];
    if (gabbarTeam?.captain_name) {
      setCaptainName(gabbarTeam.captain_name);
    } else {
      setCaptainName("Gabbar XI Captain");
    }
  };

  const handlePinSubmit = async () => {
    try {
      const { supabase } = await import("@/lib/supabaseClient");
      const { data: teamData, error } = await supabase
        .from("teams")
        .select("captain_pin")
        .eq("team_name", "Gabbar XI")
        .single();
      
      if (error) {
        setPinError("Error verifying PIN. Please try again.");
        return;
      }
      
      if (teamData?.captain_pin === pin) {
        setIsAuthenticated(true);
        setPinError("");
        setPin("");
      } else {
        setPinError("Invalid PIN. Please check with admin and try again.");
      }
    } catch (error) {
      setPinError("Error verifying PIN. Please try again.");
    }
  };

  useEffect(() => {
    fetchPlayersAndPurses();

    // Subscribe to player changes for real-time updates
    const setupPlayerSubscription = async () => {
      const { supabase } = await import("@/lib/supabaseClient");
      
      // Try postgres_changes subscription
      const playerSubscription = supabase
        .channel("players_channel_gabbar")
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
        .channel("teams_channel_gabbar")
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
        .channel('player_updates_broadcast_gabbar')
        .on('broadcast', { event: 'player_sold' }, async (payload) => {
          console.log("Gabbar page - Received player_sold broadcast:", payload);
          await fetchPlayersAndPurses();
        })
        .on('broadcast', { event: 'next_player' }, async (payload) => {
          console.log("Gabbar page - Received next_player broadcast:", payload);
          await fetchPlayersAndPurses();
        })
        .on('broadcast', { event: 'bid_update' }, async (payload) => {
          console.log("Gabbar page - Received bid_update broadcast:", payload);
          await fetchPlayersAndPurses();
        })
        .on('broadcast', { event: 'captain_assigned' }, async (payload) => {
          console.log("Gabbar page - Received captain_assigned broadcast:", payload);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 p-8 relative">
      {/* Login Popup Overlay */}
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md border border-red-400/30 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Captain Authentication
              </h2>
              <p className="text-gray-300 text-sm">
                Enter your PIN to access the Gabbar XI auction panel
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setPinError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePinSubmit();
                    }
                  }}
                  className="bg-slate-700/50 border-red-400/30 text-white placeholder:text-gray-400 rounded-xl pr-12 py-3 text-center text-lg font-mono tracking-wider"
                  maxLength={6}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {pinError && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-400/20 rounded-lg p-2">
                  {pinError}
                </div>
              )}
              
              <Button
                onClick={handlePinSubmit}
                disabled={pin.length === 0}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enter Auction
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Contact the admin if you don't have your PIN
              </p>
            </div>
          </div>
        </div>
      )}

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
            <Crown className="h-6 w-6 text-red-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              {captainName}
            </h1>
          </div>
        </div>
        {/* Main Content: Player Info, Gabbar XI, Thakur XI */}
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
                    Your Purse: <span className="text-green-200">₹{teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000}</span>
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button
                    className={`${(teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 100 : 500)) ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-blue-500 to-blue-700'} text-white flex-1 rounded-xl shadow-lg font-bold`}
                    onClick={() => setCurrentBid(currentBid + (currentBid < 5000 ? 100 : 500), 'Gabbar XI')}
                    disabled={!activePlayer || (teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 100 : 500)) || ((teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) - currentBid) < (currentBid < 5000 ? 100 : 500)}
                  >
                    {((teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 100 : 500)) || ((teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) - currentBid) < (currentBid < 5000 ? 100 : 500)) ? `₹${currentBid < 5000 ? 100 : 500} (Insufficient)` : `+ ₹${currentBid < 5000 ? 100 : 500}`}
                  </Button>
                  <Button
                    className={`${(teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 500 : 1000)) ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-purple-500 to-purple-700'} text-white flex-1 rounded-xl shadow-lg font-bold`}
                    onClick={() => setCurrentBid(currentBid + (currentBid < 5000 ? 500 : 1000), 'Gabbar XI')}
                    disabled={!activePlayer || (teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 500 : 1000)) || ((teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) - currentBid) < (currentBid < 5000 ? 500 : 1000)}
                  >
                    {((teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) < (currentBid + (currentBid < 5000 ? 500 : 1000)) || ((teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000) - currentBid) < (currentBid < 5000 ? 500 : 1000)) ? `₹${currentBid < 5000 ? 500 : 1000} (Insufficient)` : `+ ₹${currentBid < 5000 ? 500 : 1000}`}
                  </Button>
                </div>
              </div>
            </PlayerInfoCard>
          </div>
          {/* Middle - Gabbar XI */}
          <div className="col-span-4">
            <TeamCard
              team="Gabbar XI"
              logoSrc="/gabbar1.png"
              gradientFrom="red-800/30"
              gradientTo="red-900/30"
              borderColor="red-400/30"
              players={players}
              purse={teams["Gabbar XI"]?.purse !== undefined ? teams["Gabbar XI"].purse : 50000}
              playerCount={teams["Gabbar XI"]?.player_count}
              isMyTeam={true}
            />
          </div>
          {/* Right - Thakur XI */}
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
