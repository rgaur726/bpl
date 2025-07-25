
// Types
export interface Player {
  id?: string | number;
  player_id?: number;
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
  isAdmin?: boolean;
  onCaptainSelect?: (teamName: string, playerId: number, playerName: string) => void;
  currentCaptain?: { id: number; name: string } | null;
  isMyTeam?: boolean; // New prop to indicate if this is the captain's own team
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

export function TeamCard({ team, logoSrc, gradientFrom, gradientTo, borderColor, players, purse, playerCount, isAdmin = false, onCaptainSelect, currentCaptain, isMyTeam = false }: TeamCardProps) {
  // Get sold players for this team
  const soldPlayersForTeam = players.filter(p => p.sold && p.team === team);
  
  // Separate captains from regular players
  const captains = soldPlayersForTeam.filter(p => p.sold_amount === 0);
  const regularPlayers = soldPlayersForTeam.filter(p => p.sold_amount !== 0);
  
  // For regular players, maintain their original order from the players array
  // This ensures new players appear in the next available slot
  const teamPlayers = [...captains, ...regularPlayers];
    
  // Use the playerCount from props if provided, otherwise fall back to calculated count
  const displayPlayerCount = playerCount !== undefined ? playerCount : teamPlayers.length;
  
  // Get available players for captain selection (unsold players)
  const availablePlayers = players.filter(p => !p.sold);
  
  // Always show 12 slots, fill with placeholders if needed
  const slots = [...teamPlayers];
  while (slots.length < 12) slots.push({ id: undefined, Name: "", sold_amount: undefined, sold: false });
  
  const handleCaptainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const playerId = parseInt(event.target.value);
    
    if (playerId && onCaptainSelect) {
      // Try both id and player_id fields since we're not sure which one is used
      const selectedPlayer = availablePlayers.find(p => p.id === playerId || p.player_id === playerId);
      
      if (selectedPlayer) {
        onCaptainSelect(team, playerId, selectedPlayer.Name || '');
      }
    }
  };

  return (
    <Card className={`bg-transparent bg-gradient-to-br from-${gradientFrom} to-${gradientTo} backdrop-blur-md border border-${borderColor} shadow-2xl h-[34rem] relative flex flex-col`}>
      <CardContent className="p-4 h-full flex flex-col">
        <h3 className="text-white text-xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          <span className="inline-flex items-center justify-center gap-2">
            <img src={logoSrc} alt={`${team} Logo`} className="h-6 w-6 inline-block rounded-full border border-blue-400/50 mr-1" />
            {isMyTeam ? `My Team (${team})` : team}
          </span>
        </h3>
        
        {/* Captain Selection Dropdown - Only show in admin mode and when no captain is selected */}
        {isAdmin && !currentCaptain && (
          <div className="mb-4 flex-shrink-0">
            <div className="relative">
              <select
                value=""
                onChange={handleCaptainChange}
                className="w-full bg-slate-700 text-white border border-slate-500 rounded-lg px-4 py-3 text-sm font-medium shadow-lg hover:bg-slate-600 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 cursor-pointer appearance-none pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em'
                }}
              >
                <option value="" disabled hidden>Select Team Captain</option>
                {availablePlayers.map((player) => (
                  <option 
                    key={player.id || player.player_id} 
                    value={player.player_id || player.id}
                    style={{ backgroundColor: '#475569', color: '#ffffff' }}
                  >
                    {player.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-3 mb-2 rounded-lg border border-white/10 flex-shrink-0">
          <div className="grid text-sm font-semibold text-white" style={{ gridTemplateColumns: '12% 63% 25%' }}>
            <span>#</span>
            <span>Player Name</span>
            <span>Price</span>
          </div>
        </div>
        <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar min-h-0">
          {slots.map((player, index) => (
            <div key={player.id || index} className="bg-slate-700/30 backdrop-blur-sm p-2 grid text-sm text-white rounded-lg border border-white/5" style={{ gridTemplateColumns: '12% 63% 25%' }}>
              <span className="text-slate-400">{index + 1}.</span>
              <span className="truncate pr-2">
                {player.Name}
                {player.sold_amount === 0 && player.Name && (
                  <span className="ml-2 text-xs bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded">Captain</span>
                )}
              </span>
              <span>
                {player.sold_amount === 0 && player.Name ? 
                  'N/A' : 
                  (player.sold_amount !== undefined ? `₹${player.sold_amount}` : '')
                }
              </span>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-slate-900 to-black text-white p-3 text-center rounded-lg border border-white/20 flex-shrink-0 mt-2">
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
  
  // If no players remaining, show completion message
  if (unsoldPlayers.length === 0) {
    return (
      <Card className="bg-transparent bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl w-[90vw]">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              🎉 Auction Completed! 🎉
            </div>
            <div className="text-xl text-white font-semibold">
              No Players Remaining
            </div>
            <div className="text-sm text-gray-300 mt-2">
              All players have been successfully assigned to teams
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate dynamic rows needed (8 players per row, but remove empty rows)
  const playersPerRow = 8;
  const rowsNeeded = Math.ceil(unsoldPlayers.length / playersPerRow);
  
  // Create grid with only the needed rows
  const gridPlayers = [...unsoldPlayers];
  
  return (
    <Card className="bg-transparent bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-white/20 shadow-2xl w-[90vw]">
      <CardContent className="p-4">
        <div className="grid gap-2" style={{ gridTemplateRows: `repeat(${rowsNeeded}, minmax(0, 1fr))` }}>
          {Array.from({ length: rowsNeeded }).map((_, row) => (
            <div key={row} className="grid grid-cols-8 gap-2">
              {Array.from({ length: playersPerRow }).map((_, col) => {
                const idx = row * playersPerRow + col;
                const player = gridPlayers[idx];
                const isActive = idx === activePlayerIndex;
                
                // If no player for this slot, show empty cell
                if (!player) {
                  return (
                    <div
                      key={`empty-${row}-${col}`}
                      className="min-w-[90px] h-8"
                    />
                  );
                }
                
                return (
                  <div
                    key={player?.id || player?.player_id || `${row}-${col}`}
                    className={`bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-lg px-2 py-1 text-sm text-center flex flex-col items-center justify-center border border-white/10 min-w-[90px] h-8 ${
                      isActive ? 'text-yellow-400 font-bold ring-2 ring-yellow-400' : 'text-white'
                    }`}
                  >
                    {player.Name || ""}
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
