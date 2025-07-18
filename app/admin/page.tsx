
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
  const { activePlayerIndex, setActivePlayerIndex, loading } = useActivePlayerSync();
  const activePlayer = players[activePlayerIndex] || null;
  // No loading screen; render main UI immediately

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
          <PlayerInfoCard activePlayer={activePlayer}>
            <div className="mt-auto space-y-3">
              <div className="flex gap-3 mb-2">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex-1 rounded-xl shadow-lg cursor-default">
                  Current Bid: <span className="text-purple-200">₹0</span>
                </Button>
              </div>
              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white flex-1 rounded-xl shadow-lg">Close Bid</Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-1 rounded-xl shadow-lg"
                  onClick={() => {
                    if (players.length === 0) return;
                    let nextIndex = activePlayerIndex;
                    while (nextIndex === activePlayerIndex && players.length > 1) {
                      nextIndex = Math.floor(Math.random() * players.length);
                    }
                    setActivePlayerIndex(nextIndex);
                  }}
                >
                  Next Player
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

