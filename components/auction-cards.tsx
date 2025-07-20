
// Types
export interface Player {
  id?: string | number;
  Name?: string;
  Matches?: number;
  batting_innings?: number;
  runs?: number;
  average?: number;
  bowling_innings?: number;
  wickets?: number;
  economy?: number;
  sold?: boolean;
  team?: string;
  price?: number;
  sold_amount?: number;
}

interface PlayerInfoCardProps {
  activePlayer: Player | null;
  lastBidder?: string;
  children?: React.ReactNode;
}

interface TeamCardProps {
  team: string;
  logoSrc: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  players: Player[];
  purse: number;
  playerCount?: number;
}

interface RemainingPlayersCardProps {
  players: Player[];
  activePlayerIndex: number;
}

import { Card, CardContent } from "@/components/ui/card";

export function PlayerInfoCard({ activePlayer, lastBidder, children }: PlayerInfoCardProps) {
  return (
    <Card className="bg-transparent bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl h-96">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex mb-6">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 w-24 h-32 rounded-xl mr-4 flex flex-col items-center justify-center text-white text-xs shadow-lg border border-white/10">
            <div className="text-center mb-2">Player Photo</div>
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {activePlayer ? activePlayer.Name : "No Active Player"}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                <span className="text-purple-400 font-semibold">Matches:</span>
                <span>{activePlayer?.Matches ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                <span className="text-purple-400 font-semibold">Batting Innings:</span>
                <span>{activePlayer?.batting_innings ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                <span className="text-purple-400 font-semibold">Runs:</span>
                <span>{activePlayer?.runs ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                <span className="text-purple-400 font-semibold">Average:</span>
                <span>{activePlayer?.average ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                <span className="text-purple-400 font-semibold">Bowling Innings:</span>
                <span>{activePlayer?.bowling_innings ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                <span className="text-purple-400 font-semibold">Wickets:</span>
                <span>{activePlayer?.wickets ?? "-"}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-700/30 p-2 rounded-lg">
                <span className="text-purple-400 font-semibold">Economy:</span>
                <span>{activePlayer?.economy ?? "-"}</span>
              </div>
            </div>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function TeamCard({ team, logoSrc, gradientFrom, gradientTo, borderColor, players, purse, playerCount }: TeamCardProps) {
  const teamPlayers = players.filter(p => p.sold && p.team === team);
  // Use the playerCount from props if provided, otherwise fall back to calculated count
  const displayPlayerCount = playerCount !== undefined ? playerCount : teamPlayers.length;
  
  // Always show 12 slots, fill with placeholders if needed
  const slots = [...teamPlayers];
  while (slots.length < 12) slots.push({ id: undefined, Name: "-", sold_amount: undefined, sold: false });
  return (
    <Card className={`bg-transparent bg-gradient-to-br from-${gradientFrom} to-${gradientTo} backdrop-blur-md border border-${borderColor} shadow-2xl h-[34rem] relative`}>
      <CardContent className="p-4 h-full">
        <h3 className="text-white text-xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          <span className="inline-flex items-center justify-center gap-2">
            <img src={logoSrc} alt={`${team} Logo`} className="h-6 w-6 inline-block rounded-full border border-blue-400/50 mr-1" />
            {team}
          </span>
        </h3>
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-3 mb-2 rounded-lg border border-white/10">
          <div className="grid grid-cols-2 text-sm font-semibold text-white">
            <span>Name</span>
            <span>Price Sold</span>
          </div>
        </div>
        <div className="space-y-1 h-80 overflow-y-auto custom-scrollbar">
          {slots.map((player, index) => (
            <div key={player.id || index} className="bg-slate-700/30 backdrop-blur-sm p-2 grid grid-cols-2 text-sm text-white rounded-lg border border-white/5">
              <span>{player.Name}</span>
              <span>{player.sold_amount !== undefined ? `₹${player.sold_amount}` : '-'}</span>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-slate-900 to-black text-white p-3 text-center rounded-lg border border-white/20" style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem" }}>
          <div className="font-semibold">Players {displayPlayerCount} of 12</div>
          <div className="text-sm text-green-400">Remaining Purse: ₹{purse !== undefined ? purse : 50000}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RemainingPlayersCard({ players, activePlayerIndex }: RemainingPlayersCardProps) {
  // Only show unsold players, highlight active
  const unsoldPlayers = players.filter((p) => !p.sold);
  // Fill up to 24 slots with empty Player objects
  const gridPlayers = [...unsoldPlayers];
  const emptyPlayer: Player = { id: undefined, Name: "", sold: false };
  while (gridPlayers.length < 24) gridPlayers.push(emptyPlayer);
  return (
    <Card className="bg-transparent bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl w-[90vw]">
      <CardContent className="p-4">
        <div className="grid grid-rows-3 gap-2">
          {[0, 1, 2].map((row) => (
            <div key={row} className="grid grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, col) => {
                const idx = row * 8 + col;
                const player = gridPlayers[idx];
                const isActive = idx === activePlayerIndex;
                return (
                  <div
                    key={player?.id || idx}
                    className={`bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-lg px-2 py-1 text-sm text-center flex flex-col items-center justify-center border border-white/10 min-w-[90px] h-8${
                      isActive ? ' text-yellow-400 font-bold ring-2 ring-yellow-400' : ' text-white'
                    }`}
                  >
                    {player ? player.Name : ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
