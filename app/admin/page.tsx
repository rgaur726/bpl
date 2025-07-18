"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(-1)
  const activePlayer = players[activePlayerIndex] || null;

  useEffect(() => {
    async function fetchPlayers() {
      const { data } = await supabase.from("Players").select("*")
      setPlayers(data || [])
    }
    fetchPlayers()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <a href="/">
            <Button className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur-md border border-white/10 flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </a>
        </div>
        {/* Main Content: Player Info, Thakur XI, Gabbar XI */}
        <div className="flex-1 grid grid-cols-12 gap-6">
          {/* Left Side - Player Info */}
          <div className="col-span-4 space-y-4">
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-96">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex mb-6">
                  <div className="bg-gradient-to-br from-slate-700 to-slate-800 w-24 h-32 rounded-xl mr-4 flex flex-col items-center justify-center text-white text-xs shadow-lg border border-white/10">
                    <div className="text-center mb-2">Player Photo</div>
                    <div className="text-xs text-purple-400">{activePlayer?.matches ?? '-'}</div>
                  </div>
                  <div className="flex-1 text-white">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {activePlayer ? activePlayer.Name : 'No Active Player'}
                    </h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-purple-400 font-semibold">Batting Innings:</span>
                        <span>{activePlayer?.batting_innings ?? '-'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-purple-400 font-semibold">Runs:</span>
                        <span>{activePlayer?.runs ?? '-'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-purple-400 font-semibold">Average:</span>
                        <span>{activePlayer?.average ?? '-'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-purple-400 font-semibold">Bowling Innings:</span>
                        <span>{activePlayer?.bowling_innings ?? '-'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-purple-400 font-semibold">Wickets:</span>
                        <span>{activePlayer?.wickets ?? '-'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-purple-400 font-semibold">Economy:</span>
                        <span>{activePlayer?.economy ?? '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* New: Current Bid and buttons */}
                <div className="mt-auto space-y-3">
                  <div className="flex gap-3 mb-2">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex-1 rounded-xl shadow-lg cursor-default">
                      Current Bid: <span className="text-purple-200">₹0</span>
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white flex-1 rounded-xl shadow-lg">Close Bid</Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-1 rounded-xl shadow-lg" onClick={() => setActivePlayerIndex((prev) => (prev + 1) % players.length)}>
                      Next Player
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Middle - Thakur XI */}
          <div className="col-span-4">
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-[34rem] relative">
              <CardContent className="p-4 h-full">
                <h3 className="text-white text-xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Thakur XI
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
                  <div className="text-sm text-green-400">Remaining: ₹35,00,000</div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right - Gabbar XI */}
          <div className="col-span-4">
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-[34rem] relative">
              <CardContent className="p-4 h-full">
                <h3 className="text-white text-xl font-bold text-center mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Gabbar XI
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
                  <div className="text-sm text-green-400">Remaining: ₹32,00,000</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Bottom Section - Remaining Players Marquee, fixed at bottom with gap */}
      <div className="w-full flex justify-center pb-6 pt-4">
        <Card className="bg-transparent bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-24 w-[90vw]">
          <CardContent className="p-4 h-full">
            <div className="relative h-full overflow-hidden">
              <div className="absolute inset-0 flex items-center animate-marquee whitespace-nowrap gap-4" style={{ width: '200%' }}>
                {[...players, ...players].map((player, i) => (
                  <div key={player.id ? `${player.id}-${i}` : i} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-xs text-center flex flex-col items-center justify-center border border-white/10 min-w-[120px]">
                    <div>{player.Name}</div>
                    <div className="text-xs text-purple-400">Base ₹100</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

