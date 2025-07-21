import { supabase } from "@/lib/supabaseClient";

export interface TeamData {
  name: string;
  purse: number;
  player_count: number;
  captain_player_id?: number;
  captain_name?: string;
  captain_pin?: string;
}

export async function fetchTeamPurses(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("teams").select("team_name, purse");
  if (error || !data) return {};
  const purseMap: Record<string, number> = {};
  for (const team of data) {
    purseMap[team.team_name] = team.purse;
  }
  return purseMap;
}

export async function fetchTeamData(): Promise<Record<string, TeamData>> {
  const { data, error } = await supabase.from("teams").select("team_name, purse, player_count, captain_player_id, captain_name, captain_pin");
  if (error || !data) return {};
  const teamMap: Record<string, TeamData> = {};
  for (const team of data) {
    teamMap[team.team_name] = {
      name: team.team_name,
      purse: team.purse,
      player_count: team.player_count || 0,
      captain_player_id: team.captain_player_id,
      captain_name: team.captain_name,
      captain_pin: team.captain_pin
    };
  }
  return teamMap;
}

export async function updateTeamPurseAndCount(teamName: string, newPurse: number, playerCountIncrement: number = 0): Promise<void> {
  // First get current player count
  const { data: currentData, error: fetchError } = await supabase
    .from("teams")
    .select("player_count")
    .eq("team_name", teamName)
    .single();
  
  if (fetchError) {
    throw new Error(`Failed to fetch current team data: ${fetchError.message}`);
  }

  const newPlayerCount = (currentData?.player_count || 0) + playerCountIncrement;
  
  const { error } = await supabase
    .from("teams")
    .update({ 
      purse: newPurse, 
      player_count: newPlayerCount 
    })
    .eq("team_name", teamName);
  
  if (error) {
    throw new Error(`Failed to update team data: ${error.message}`);
  }
}

export async function resetTeamData(): Promise<void> {
  const { error } = await supabase
    .from("teams")
    .update({ 
      purse: 50000, 
      player_count: 0,
      captain_player_id: null,
      captain_name: null,
      captain_pin: null
    })
    .in("team_name", ["Thakur XI", "Gabbar XI"]);
  
  if (error) {
    throw new Error(`Failed to reset team data: ${error.message}`);
  }
  
  // Generate new PINs for all teams
  await generateTeamPins();
}

export async function assignCaptain(teamName: string, playerId: number, playerName: string): Promise<void> {
  // Start a transaction to update both teams and players tables
  const { error: teamError } = await supabase
    .from("teams")
    .update({ 
      captain_player_id: playerId,
      captain_name: playerName,
      player_count: 1
    })
    .eq("team_name", teamName);
  
  if (teamError) {
    throw new Error(`Failed to assign captain to team: ${teamError.message}`);
  }

  // Mark player as sold for ₹0 to the team
  const { error: playerError } = await supabase
    .from("Players")
    .update({ 
      sold: true,
      team: teamName,
      sold_amount: 0
    })
    .eq("player_id", playerId);
  
  if (playerError) {
    throw new Error(`Failed to update player data: ${playerError.message}`);
  }

  // Broadcast captain assignment to all connected clients
  const broadcastChannel = supabase.channel('captain_updates');
  await broadcastChannel.send({
    type: 'broadcast',
    event: 'captain_assigned',
    payload: { 
      teamName, 
      playerId, 
      playerName,
      timestamp: new Date().toISOString()
    }
  });
  
  // Ensure the broadcast is sent
  await new Promise(resolve => setTimeout(resolve, 100));
}

export async function removeCaptain(teamName: string): Promise<void> {
  // First get the current captain
  const { data: teamData, error: fetchError } = await supabase
    .from("teams")
    .select("captain_player_id")
    .eq("team_name", teamName)
    .single();
  
  if (fetchError) {
    throw new Error(`Failed to fetch team data: ${fetchError.message}`);
  }

  const captainId = teamData?.captain_player_id;

  // Remove captain from team
  const { error: teamError } = await supabase
    .from("teams")
    .update({ 
      captain_player_id: null,
      captain_name: null,
      player_count: 0
    })
    .eq("team_name", teamName);
  
  if (teamError) {
    throw new Error(`Failed to remove captain from team: ${teamError.message}`);
  }

  // Mark player as unsold if captain exists
  if (captainId) {
    const { error: playerError } = await supabase
      .from("Players")
      .update({ 
        sold: false,
        team: null,
        sold_amount: null
      })
      .eq("player_id", captainId);
    
    if (playerError) {
      throw new Error(`Failed to update player data: ${playerError.message}`);
    }
  }
}

// Generate a 6-digit PIN
export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate and save PINs for all teams
export async function generateTeamPins(): Promise<void> {
  const { data: teams, error: fetchError } = await supabase
    .from("teams")
    .select("team_name");
  
  if (fetchError || !teams) {
    throw new Error(`Failed to fetch teams: ${fetchError?.message}`);
  }

  // Generate different PINs for each team
  const generatedPins = new Set<string>(); // To ensure uniqueness
  
  for (const team of teams) {
    let pin: string;
    
    // Keep generating until we get a unique PIN
    do {
      pin = generatePin();
    } while (generatedPins.has(pin));
    
    generatedPins.add(pin);
    
    console.log(`Generating PIN for ${team.team_name}: ${pin}`);
    
    const { error: updateError } = await supabase
      .from("teams")
      .update({ captain_pin: pin })
      .eq("team_name", team.team_name);
    
    if (updateError) {
      throw new Error(`Failed to update PIN for ${team.team_name}: ${updateError.message}`);
    }
    
    console.log(`PIN successfully saved for ${team.team_name}`);
  }
  
  console.log('All team PINs generated successfully');
}
