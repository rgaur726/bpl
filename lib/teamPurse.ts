import { supabase } from "@/lib/supabaseClient";

export interface TeamData {
  name: string;
  purse: number;
  player_count: number;
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
  const { data, error } = await supabase.from("teams").select("team_name, purse, player_count");
  if (error || !data) return {};
  const teamMap: Record<string, TeamData> = {};
  for (const team of data) {
    teamMap[team.team_name] = {
      name: team.team_name,
      purse: team.purse,
      player_count: team.player_count || 0
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
      player_count: 0 
    })
    .in("team_name", ["Thakur XI", "Gabbar XI"]);
  
  if (error) {
    throw new Error(`Failed to reset team data: ${error.message}`);
  }
}
