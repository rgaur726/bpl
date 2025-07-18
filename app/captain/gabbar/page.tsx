"use client"

import { Button } from "@/components/ui/button"
import { PlayerInfoCard, TeamCard, RemainingPlayersCard } from "@/components/auction-cards";
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Home, Crown, DollarSign, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export default function GabbarCaptainPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [currentBid, setCurrentBid] = useState(0);
  const activePlayer = players[activePlayerIndex] || null;

  const myTeamPlayers = [
    { name: "Player A", price: "₹2,20,000" },
    { name: "Player B", price: "₹1,90,000" },
    { name: "Player C", price: "₹2,80,000" },
    { name: "Player D", price: "₹1,60,000" },
  ]

  const opponentPlayers = [
    { name: "Player 1", price: "₹2,50,000" },
    { name: "Player 2", price: "₹1,80,000" },
    { name: "Player 3", price: "₹3,20,000" },
  ]

  useEffect(() => {
    async function fetchPlayers() {
      const { data } = await import("@/lib/supabaseClient").then(mod => mod.supabase.from("Players").select("*"));
      setPlayers(data || []);
    }
    fetchPlayers();
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
            <PlayerInfoCard activePlayer={activePlayer}>
              <div className="mt-auto space-y-3">
                <div className="flex gap-3 mb-2">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex-1 rounded-xl shadow-lg cursor-default">
                    Current Bid: <span className="text-purple-200">₹{currentBid}</span>
                  </Button>
                </div>
              </div>
            </PlayerInfoCard>
          </div>
          {/* Middle - My Team */}
          <div className="col-span-4">
            <Card className="bg-transparent bg-gradient-to-br from-red-800/30 to-red-900/30 backdrop-blur-md border border-red-400/30 shadow-2xl h-[34rem] relative">
              <CardContent className="p-4 h-full">
                <h3 className="text-white text-xl font-bold text-center mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  <span className="inline-flex items-center justify-center gap-2">
                    <img src="/gabbar1.png" alt="Gabbar XI Logo" className="h-6 w-6 inline-block rounded-full border border-orange-400/50 mr-1" />
                    My Team (Gabbar XI)
                  </span>
                </h3>
                <div className="bg-gradient-to-r from-red-700 to-red-800 p-3 mb-2 rounded-lg border border-red-400/20">
                  <div className="grid grid-cols-2 text-sm font-semibold text-white">
                    <span>Name</span>
                    <span>Price Sold</span>
                  </div>
                </div>
                <div className="space-y-1 h-80 overflow-y-auto custom-scrollbar">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-red-700/20 backdrop-blur-sm p-2 grid grid-cols-2 text-sm text-white rounded-lg border border-red-400/10"
                    >
                      <span>-</span>
                      <span>-</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-slate-900 to-black text-white p-3 text-center rounded-lg border border-red-400/30" style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                  <div className="font-semibold">Players 0/12</div>
                  <div className="text-sm text-green-400">Remaining: ₹50,000</div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right - Thakur XI */}
          <div className="col-span-4">
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-[34rem] relative">
              <CardContent className="p-4 h-full">
                <h3 className="text-white text-xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  <span className="inline-flex items-center justify-center gap-2">
                    <img src="/thakur1.png" alt="Thakur XI Logo" className="h-6 w-6 inline-block rounded-full border border-blue-400/50 mr-1" />
                    Thakur XI
                  </span>
                </h3>
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-3 mb-2 rounded-lg border border-white/10">
                  <div className="grid grid-cols-2 text-sm font-semibold text-white">
                    <span>Name</span>
                    <span>Price Sold</span>
                  </div>
                </div>
                <div className="space-y-1 h-80 overflow-y-auto custom-scrollbar">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 backdrop-blur-sm p-2 grid grid-cols-2 text-sm text-white rounded-lg border border-white/5"
                    >
                      <span>-</span>
                      <span>-</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-slate-900 to-black text-white p-3 text-center rounded-lg border border-white/20" style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                  <div className="font-semibold">Players 0/12</div>
                  <div className="text-sm text-green-400">Remaining: ₹50,000</div>
                </div>
              </CardContent>
            </Card>
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
