import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data, error } = await supabase
    .from('page_contents')
    .update({ hero_img: '/fotos/Vanquish%201.jpg' })
    .eq('page_name', 'homepage')

  if (error) {
    console.error("Error updating:", error)
  } else {
    console.log("Updated DB successfully:", data)
  }
}

run()
