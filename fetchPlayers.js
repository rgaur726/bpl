const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and Key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  const { data, error } = await supabase.from('Players').select('player_id, Name');
  if (error) {
    console.error('Error fetching players:', error);
    process.exit(1);
  }
  console.log(data.map(player => ({ [player.player_id]: player.Name })));
})();
