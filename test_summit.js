const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('ct_artists').update({ spotify_url: 'https://open.spotify.com/artist/7331Gn1ay40E3ZpYxjgBUP' }).ilike('name', '%John Summit%').select();
  if (error) console.error(error);
  else console.log(data);
}
run();
