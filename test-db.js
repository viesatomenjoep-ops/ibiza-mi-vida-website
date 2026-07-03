const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  // Find Elrow
  let { data: artists } = await supabase.from('ct_artists').select('*').ilike('name', '%Elrow%');
  console.log("Artists named Elrow:", artists?.length);
  if (artists && artists.length > 0) {
    let artistId = artists[0].id;
    let { data: links } = await supabase.from('ct_date_artists').select('*').eq('artist_id', artistId);
    console.log("Date links for Elrow:", links?.length);
  }

  // Find Jamie Jones
  let { data: jj } = await supabase.from('ct_artists').select('*').ilike('name', '%Jamie Jones%');
  console.log("Artists named Jamie Jones:", jj?.length);
  if (jj && jj.length > 0) {
    let artistId = jj[0].id;
    let { data: links } = await supabase.from('ct_date_artists').select('*').eq('artist_id', artistId);
    console.log("Date links for Jamie Jones:", links?.length);
  }
}
run();
