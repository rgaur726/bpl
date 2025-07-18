import { supabase } from "@/lib/supabaseClient";

export async function fetchTeamPurses(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("teams").select("name, purse");
  if (error || !data) return {};
  const purseMap: Record<string, number> = {};
  for (const team of data) {
    purseMap[team.name] = team.purse;
  }
  return purseMap;
}
