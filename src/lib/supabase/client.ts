import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.placeholder'

// Automatically use the service role key on the server-side to bypass RLS
const isServer = typeof window === 'undefined'
const supabaseKey = (isServer && process.env.SUPABASE_SERVICE_ROLE_KEY) 
  ? process.env.SUPABASE_SERVICE_ROLE_KEY 
  : supabaseAnonKey

export const supabase = createClient(supabaseUrl, supabaseKey)
