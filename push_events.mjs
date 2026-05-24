import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log("Reading events_data.json...")
  const data = JSON.parse(fs.readFileSync('events_data.json', 'utf8'))
  console.log(`Found ${data.length} events. Starting upload...`)
  
  const chunkSize = 100
  let successCount = 0
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize)
    const { error } = await supabase
      .from('featured_events')
      .insert(chunk)
      
    if (error) {
      console.error(`Error inserting chunk ${i}-${i + chunkSize}:`, error)
    } else {
      successCount += chunk.length
      console.log(`Successfully uploaded ${successCount}/${data.length} events...`)
    }
  }
  
  console.log("Done! All events uploaded to Supabase featured_events.")
}

run()
