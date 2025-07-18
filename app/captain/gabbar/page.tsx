"use client"

import { Button } from "@/components/ui/button"
import { PlayerInfoCard, TeamCard, RemainingPlayersCard } from "@/components/auction-cards";
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Home, Crown, DollarSign, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useActivePlayerSync } from "@/hooks/useActivePlayer";

export default function GabbarCaptainPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [purses, setPurses] = useState<Record<string, number>>({});
  const { activePlayerIndex, currentBid, setCurrentBid, lastBidder, loading } = useActivePlayerSync();
  // useActivePlayerSync already subscribes to changes, so currentBid and lastBidder will update automatically
  const activePlayer = players[activePlayerIndex] || null;

  useEffect(() => {
    async function fetchPlayersAndPurses() {
      const { data } = await import("@/lib/supabaseClient").then(mod => mod.supabase.from("Players").select("*"));
      setPlayers(data || []);
      const { fetchTeamPurses } = await import("@/lib/teamPurse");
      const purseMap = await fetchTeamPurses();
      setPurses(purseMap);
    }
    fetchPlayersAndPurses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 p-8">
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
              Gabbar XI Captain
            </h1>
          </div>
        </div>
        {/* Main Content: Player Info, My Team, Thakur XI */}
        <div className="flex-1 grid grid-cols-12 gap-6">
          {/* Left Side - Player Info */}
          <div className="col-span-4 space-y-4">
            <PlayerInfoCard activePlayer={activePlayer} lastBidder={lastBidder}>
              <div className="mt-auto space-y-3">
                <div className="flex gap-3 mb-2">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex-1 rounded-xl shadow-lg cursor-default">
                    Current Bid: <span className="text-purple-200">₹{currentBid}</span> {lastBidder === 'Thakur' ? '(Thakur)' : lastBidder === 'Gabbar' ? '(Gabbar)' : ''}
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white flex-1 rounded-xl shadow-lg font-bold" onClick={() => setCurrentBid(currentBid + 100, 'Gabbar')}>
                    + ₹100
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white flex-1 rounded-xl shadow-lg font-bold" onClick={() => setCurrentBid(currentBid + 500, 'Gabbar')}>
                    + ₹500
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
              purse={purses["Gabbar XI"] ?? 0}
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
              purse={purses["Thakur XI"] ?? 0}
            />
          </div>
        </div>
      </div>
      {/* Bottom Section - Remaining Players Static Grid */}
      <div className="w-full flex justify-center pb-6 pt-4">
        <Card className="bg-transparent bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl w-[90vw]">
          <CardContent className="p-4">
            <div className="grid grid-rows-3 gap-2">
              {[0, 1, 2].map(row => (
                <div key={row} className="grid grid-cols-8 gap-2">
                  {Array.from({ length: 8 }).map((_, col) => {
                    const idx = row * 8 + col;
                    const player = players[idx];
                    const isActive = idx === activePlayerIndex;
                    const isSold = player && player.sold;
                    return (
                      <div
                        key={player?.id || idx}
                        className={`bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-lg px-2 py-1 text-sm text-center flex flex-col items-center justify-center border border-white/10 min-w-[90px] h-8 ${isActive ? 'text-yellow-400 font-bold ring-2 ring-yellow-400' : 'text-white'} ${isSold ? 'opacity-40' : ''}`}
                      >
                        {isSold || !player ? '' : player.Name}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
  )
}
