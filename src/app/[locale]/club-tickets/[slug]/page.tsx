import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { VenueDetailPage } from '@/components/templates/VenueDetailPage'

export const revalidate = 3600

interface Props {
  params: { slug: string; locale: string }
}

async function fetchVenueData(slug: string) {
  const { data: club } = await supabase
    .from('ct_venues')
    .select('*')
    .eq('slug', slug)
    .single();
  return club;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const club = await fetchVenueData(params.slug)
  if (!club) return { title: 'Venue Not Found | Ibiza mi vida' }

  return {
    title: `${club.name} Ibiza Tickets 2026`,
    description: club.description ? club.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Buy ${club.name} tickets in Ibiza. Browse upcoming events at ${club.name}.`,
    openGraph: {
      title: `${club.name} Ibiza Tickets 2026 | Ibiza mi vida`,
      description: `Upcoming events and tickets for ${club.name} Ibiza.`,
      images: club.cover ? [{ url: club.cover, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function ClubDetailPage({ params }: Props) {
  const club = await fetchVenueData(params.slug)
  if (!club) notFound()

  // Fetch all upcoming dates for this club
  const { data: dates } = await supabase
    .from('ct_dates')
    .select('*, ct_events(*)')
    .eq('venue_id', club.id)
    .gte('date', new Date().toISOString().split('T')[0]) // Today onwards
    .order('date', { ascending: true })

  return (
    <VenueDetailPage 
      club={club} 
      allDates={dates || []} 
      locale={params.locale} 
      basePath="club-tickets" 
    />
  )
}
