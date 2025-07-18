"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BPLLogo } from "@/components/bpl-logo"
import Link from "next/link"
import { Calendar, MapPin, Shield, Crown, Home as HomeIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 w-full">
          <div>
            <Link href="/">
              <Button className="bg-gradient-to-r from-slate-600/50 to-slate-700/50 text-white px-8 py-3 rounded-xl font-semibold shadow-lg backdrop-blur-sm border border-white/10 flex items-center">
                <HomeIcon className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          <div>
            <Link href="/admin">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg backdrop-blur-sm border border-white/10 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-3 gap-12 items-center">
          {/* Thakur XI */}
          <div className="flex flex-col items-center space-y-6">
            <Card className="group hover:scale-105 transition-all duration-500 bg-transparent bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-white/20 hover:border-blue-400/50 rounded-3xl shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-5xl shadow-xl">
                  🏏
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Thakur XI</h2>
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Crown className="h-4 w-4 text-blue-400" />
                  <span className="text-white/80">Captain Thakur</span>
                </div>
                <Link href="/captain/thakur">
                  <Button className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-white border border-blue-400/30 hover:border-blue-400/50 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm">
                    Enter Auction
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Center - BPL Logo */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl scale-150"></div>
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 rounded-full p-8 shadow-2xl flex items-center justify-center">
                <img src="/my-logo.png" alt="Logo" className="w-48 h-48 object-contain" />
              </div>
            </div>
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Bakchod Premier League
                </h1>
                <p className="text-xl text-white/60 mb-6">The Ultimate Cricket Auction</p>

                {/* Date, Time, Location */}
                <div className="flex justify-center items-center space-x-8 mb-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="font-semibold">Jan 20, 2025</div>
                      <div className="text-sm">7:00 PM IST</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="font-semibold">Mumbai</div>
                      <div className="text-sm">Cricket Ground</div>
                    </div>
                  </div>
                </div>

                {/* Cricket placeholder image removed */}
                <Link href="/viewer">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-24 py-7 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 mb-8">
                    Watch Live Auction
                  </Button>
                </Link>
              </div>
            </div>

          {/* Gabbar XI */}
          <div className="flex flex-col items-center space-y-6">
            <Card className="group hover:scale-105 transition-all duration-500 bg-transparent bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-md border border-white/20 hover:border-red-400/50 rounded-3xl shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-5xl shadow-xl">
                  🏏
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Gabbar XI</h2>
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Crown className="h-4 w-4 text-red-400" />
                  <span className="text-white/80">Captain Gabbar</span>
                </div>
                <Link href="/captain/gabbar">
                  <Button className="bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 text-white border border-red-400/30 hover:border-red-400/50 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm">
                    Enter Auction
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
