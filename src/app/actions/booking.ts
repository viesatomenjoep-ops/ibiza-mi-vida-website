'use server'

import { createClient } from '@supabase/supabase-js'
import type { BookingLeadInsert } from '@/types/booking'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function submitBookingLead(lead: BookingLeadInsert): Promise<{ error: string | null }> {
  try {
    const supabase = getClient()
    const { error } = await supabase.from('booking_leads').insert(lead)
    if (error) return { error: error.message }
    return { error: null }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }
}
