import { useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// You should set these in your .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export function useActivePlayer() {
  // Update the active player index in Supabase
  const setActivePlayerIndex = useCallback(async (index: number) => {
    const { error } = await supabase
      .from("auction_state")
      .update({ active_player_index: index })
      .eq("id", 1);
    if (error) {
      console.error("Failed to update active player index:", error.message);
    }
  }, []);

  return { setActivePlayerIndex };
}
