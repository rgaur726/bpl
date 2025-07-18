"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Home, Square, SkipForward } from "lucide-react"

export default function AdminPage() {
  const [currentPlayer] = useState("Virat Kohli")
  const [basePrice] = useState("₹2,00,000")
  const [currentBid] = useState("₹3,50,000")

  const mockPlayers = [
    { name: "Player 1", price: "₹2,50,000" },
    { name: "Player 2", price: "₹1,80,000" },
    { name: "Player 3", price: "₹3,20,000" },
    { name: "Player 4", price: "₹1,50,000" },
    { name: "Player 5", price: "₹2,80,000" },
  ];
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-start items-center mb-6">
          <Link href="/">
            <Button className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur-md border border-white/10">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-12 gap-6">
          {/* Left Side - Player Info */}
          <div className="col-span-5 space-y-4">
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-96">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex mb-6">
                  <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-lg w-24 h-32 mr-4 flex flex-col items-center justify-center text-white text-xs shadow-lg border border-white/10">
                    <div className="text-center mb-2">Player Photo</div>
                    <div className="text-xs text-purple-400">156 Matches</div>
                  </div>
                  <div className="flex-1 text-white">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {currentPlayer}
                    </h2>

                    {/* Stats List */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Batting Innings:</span>
                        <span>45</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Runs:</span>
                        <span>1250</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Average:</span>
                        <span>27.8</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Bowling Innings:</span>
                        <span>32</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Wickets:</span>
                        <span>28</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Economy:</span>
                        <span>7.2</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                  <div className="flex gap-3">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex-1 rounded-xl shadow-lg">
                      Base: ₹100
                    </Button>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex-1 rounded-xl shadow-lg">
                      Current: {currentBid}
                    </Button>
                  </div>
                  <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white w-full rounded-xl shadow-lg">
                    <Square className="h-4 w-4 mr-2" />
                    Close Bid
                  </Button>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-full rounded-xl shadow-lg">
                    <SkipForward className="h-4 w-4 mr-2" />
                    Next Player
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Teams */}
          <div className="col-span-7 grid grid-cols-2 gap-4">
            {/* Team 1 */}
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-[34rem]">
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
                <div className="space-y-1 h-80 overflow-y-auto custom-scrollbar flex flex-col justify-start">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 backdrop-blur-sm p-2 grid grid-cols-2 text-sm text-white rounded-lg border border-white/5"
                    >
                      <span>{mockPlayers[index]?.name || `Player ${index + 1}`}</span>
                      <span>{mockPlayers[index]?.price || "-"}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-slate-900 to-black text-white p-3 mt-4 text-center rounded-lg border border-white/20" style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                  <div className="font-semibold">Players {mockPlayers.length}/12</div>
                  <div className="text-sm text-green-400">Remaining: ₹35,00,000</div>
                </div>
              </CardContent>
            </Card>

            {/* Team 2 */}
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-[34rem]">
              <CardContent className="p-4 h-full">
                <h3 className="text-white text-xl font-bold text-center mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  <span className="inline-flex items-center justify-center gap-2">
                    <img src="/gabbar1.png" alt="Gabbar XI Logo" className="h-6 w-6 inline-block rounded-full border border-orange-400/50 mr-1" />
                    Gabbar XI
                  </span>
                </h3>
                <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-3 mb-2 rounded-lg border border-white/10">
                  <div className="grid grid-cols-2 text-sm font-semibold text-white">
                    <span>Name</span>
                    <span>Price Sold</span>
                  </div>
                </div>
                <div className="space-y-1 h-80 overflow-y-auto custom-scrollbar flex flex-col justify-start">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 backdrop-blur-sm p-2 grid grid-cols-2 text-sm text-white rounded-lg border border-white/5"
                    >
                      <span>{mockPlayers[index]?.name || `Player ${index + 1}`}</span>
                      <span>{mockPlayers[index]?.price || "-"}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-slate-900 to-black text-white p-3 mt-4 text-center rounded-lg border border-white/20" style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
                  <div className="font-semibold">Players {mockPlayers.length}/12</div>
                  <div className="text-sm text-green-400">Remaining: ₹32,00,000</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Player Queue */}
        <Card className="bg-transparent bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl mt-4 h-24">
          <CardContent className="p-4 h-full">
            <div className="grid grid-cols-8 gap-2 h-12">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-lg p-1 text-white text-xs text-center flex flex-col items-center justify-center border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div>Player {i + 1}</div>
                  <div className="text-xs text-purple-400">₹100</div>
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
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  )
}
