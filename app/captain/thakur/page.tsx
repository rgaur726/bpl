
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Home, Crown } from "lucide-react";

export default function ThakurCaptainPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const activePlayer = players[activePlayerIndex] || null;

  useEffect(() => {
    async function fetchPlayers() {
      const { data } = await import("@/lib/supabaseClient").then(
        (mod) => mod.supabase.from("Players").select("*")
      );
      setPlayers(data || []);
      setLoading(false);
    }
    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-white text-xl">Loading...</span>
      </div>
    );
  }

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
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-96">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex mb-6">
                  <div className="bg-gradient-to-br from-slate-700 to-slate-800 w-24 h-32 rounded-xl mr-4 flex flex-col items-center justify-center text-white text-xs shadow-lg border border-white/10">
                    <div className="text-center mb-2">Player Photo</div>
                  </div>
                  <div className="flex-1 text-white">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {activePlayer ? activePlayer.Name : "No Active Player"}
                    </h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Matches:</span>
                        <span>{activePlayer?.Matches ?? "-"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Batting Innings:</span>
                        <span>{activePlayer?.batting_innings ?? "-"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Runs:</span>
                        <span>{activePlayer?.runs ?? "-"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Average:</span>
                        <span>{activePlayer?.average ?? "-"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Bowling Innings:</span>
                        <span>{activePlayer?.bowling_innings ?? "-"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Wickets:</span>
                        <span>{activePlayer?.wickets ?? "-"}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                        <span className="text-blue-400 font-semibold">Economy:</span>
                        <span>{activePlayer?.economy ?? "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* No bid buttons for captain yet */}
              </CardContent>
            </Card>
          </div>
          {/* Middle - Thakur XI */}
          <div className="col-span-4">
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-[34rem] relative">
              <CardContent className="p-4 h-full">
                <h3 className="text-white text-xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  <span className="inline-flex items-center justify-center gap-2">
                    <img
                      src="/thakur1.png"
                      alt="Thakur XI Logo"
                      className="h-6 w-6 inline-block rounded-full border border-blue-400/50 mr-1"
                    />
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
                <div
                  className="bg-gradient-to-r from-slate-900 to-black text-white p-3 text-center rounded-lg border border-white/20"
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    right: "1rem",
                  }}
                >
                  <div className="font-semibold">Players 0/12</div>
                  <div className="text-sm text-green-400">Remaining: ₹50,000</div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Right - Gabbar XI */}
          <div className="col-span-4">
            <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-[34rem] relative">
              <CardContent className="p-4 h-full">
                <h3 className="text-white text-xl font-bold text-center mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  <span className="inline-flex items-center justify-center gap-2">
                    <img
                      src="/gabbar1.png"
                      alt="Gabbar XI Logo"
                      className="h-6 w-6 inline-block rounded-full border border-orange-400/50 mr-1"
                    />
                    Gabbar XI
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
                <div
                  className="bg-gradient-to-r from-slate-900 to-black text-white p-3 text-center rounded-lg border border-white/20"
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    right: "1rem",
                  }}
                >
                  <div className="font-semibold">Players 0/12</div>
                  <div className="text-sm text-green-400">Remaining: ₹50,000</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Bottom Section - Remaining Players Dynamic Grid */}
      <div className="w-full flex justify-center pb-6 pt-4">
        <Card className="bg-transparent bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl w-[90vw]">
          <CardContent className="p-4">
            <div className="grid grid-rows-3 gap-2">
              {[0, 1, 2].map((row) => (
                <div key={row} className="grid grid-cols-8 gap-2">
                  {Array.from({ length: 8 }).map((_, col) => {
                    const idx = row * 8 + col;
                    const player = players[idx];
                    // If player is sold, leave slot empty; if active, highlight
                    const isActive = idx === activePlayerIndex;
                    const isSold = player && player.sold;
                    return (
                      <div
                        key={player?.id || idx}
                        className={`bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-lg px-2 py-1 text-sm text-center flex flex-col items-center justify-center border border-white/10 min-w-[90px] h-8 ${
                          isActive
                            ? "text-blue-400 font-bold ring-2 ring-blue-400"
                            : "text-white"
                        } ${isSold ? "opacity-40" : ""}`}
                      >
                        {isSold || !player ? "" : player.Name}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
