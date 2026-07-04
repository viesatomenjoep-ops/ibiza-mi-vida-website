const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('ct_artists').select('name').limit(1000);
  if (error) console.error(error);
  else console.log(data.map(d => d.name).join(', '));
}
run();
