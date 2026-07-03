import React from 'react'
import { supabase } from '@/lib/supabase/client'
import HomePageClient from './HomePageClient'

export const revalidate = 3600

export default async function Home({ params }: { params: { locale: string } }) {
  // Fetch top featured clubs (let's pick some big ones or just 4 active ones)
  const { data: featuredClubs } = await supabase
    .from('ct_venues')
    .select('name, slug, whitelogo, cover')
    .in('slug', ['hi-ibiza', 'ushuaia-ibiza', 'pacha-ibiza', 'amnesia-ibiza'])
    .limit(4);

  // Fetch upcoming dates
  const { data: upcomingDates } = await supabase
    .from('ct_dates')
    .select('*, ct_events(name, slug, logo, cover), ct_venues(name, slug)')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(10);

  return (
    <HomePageClient 
      locale={params.locale} 
      featuredClubs={featuredClubs || []}
      upcomingDates={upcomingDates || []}
    />
  )
}
