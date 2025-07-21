import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Users, Trophy } from "lucide-react"

export default function TeamsPage() {
  const teams = [
    {
      name: "Thakur XI",
      captain: "Captain Thakur",
      players: 12,
      budget: "₹50,00,000",
      color: "from-blue-500 to-cyan-500",
      logo: "/thakur1.png",
    },
    {
      name: "Gabbar XI",
      captain: "Captain Gabbar",
      players: 12,
      budget: "₹50,00,000",
      color: "from-red-500 to-orange-500",
      logo: "/gabbar1.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* BPL Logo only, no background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <img src="/bpl-logo.png" alt="BPL Logo" className="w-40 h-40 z-10" />
      </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-2 pb-6">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">BPL Auction</span>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 px-6"
              >
                Home
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 px-6 bg-white/10"
            >
              Teams
            </Button>
            <Link href="/admin">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 px-6"
              >
                Admin
              </Button>
            </Link>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Team Rosters
          </h1>
          <p className="text-xl text-gray-300">Current team compositions and budgets</p>
        </div>

        {/* Teams Grid - moved up and wider */}
        <div className="grid md:grid-cols-2 gap-8 mb-8" style={{ marginTop: '-40px' }}>
          {teams.map((team, index) => (
            <Card key={index} className={`bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl hover:border-white/40 transition-all duration-300`} style={{ width: 'calc(100% + 30px)', background: 'none' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-white">{team.name}</CardTitle>
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${team.color} flex items-center justify-center`}
                  >
                    <img src={team.logo} alt={team.name + " Logo"} className="h-10 w-10 object-contain" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Captain:</span>
                  <span className="text-white font-semibold">{team.captain}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Players:</span>
                  <span className="text-white font-semibold">{team.players}/15</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Budget:</span>
                  <span className="text-white font-semibold">{team.budget}</span>
                </div>
                <div className="pt-4">
                  <div className="text-sm text-gray-400 mb-2">Player List:</div>
                  <div className="text-gray-300 text-sm">Players will be displayed here after auction...</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
