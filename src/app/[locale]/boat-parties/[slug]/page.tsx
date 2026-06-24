import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVenues, getVenue, getAllDates, CTVenue } from '@/lib/clubtickets'
import { VenueDetailPage } from '@/components/templates/VenueDetailPage'

export const revalidate = 3600

interface Props {
  params: { slug: string; locale: string }
}

async function fetchVenueData(slug: string, locale: string): Promise<CTVenue | null> {
  const venues = await getVenues(locale);
  const venueRef = venues.find(v => v.slug === slug && v.type.slug === 'boat');
  if (!venueRef) return null;
  const fullVenue = await getVenue(venueRef.id, locale);
  return fullVenue || null;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const club = await fetchVenueData(params.slug, params.locale)
  if (!club) return { title: 'Boat Party Not Found | Ibiza mi vida' }

  return {
    title: `${club.name} Ibiza Boat Parties 2026`,
    description: club.description ? club.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Book ${club.name} boat party in Ibiza. Browse upcoming cruises at ${club.name}.`,
    openGraph: {
      title: `${club.name} Ibiza Boat Parties 2026 | Ibiza mi vida`,
      description: `Upcoming events and tickets for ${club.name} Ibiza.`,
      images: club.cover ? [{ url: club.cover, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function BoatPartyDetailPage({ params }: Props) {
  const club = await fetchVenueData(params.slug, params.locale)
  if (!club) notFound()

  const allDatesGlobal = await getAllDates(params.locale)
  const allDates = allDatesGlobal.filter(d => d.venueSlug === club.slug)
  
  allDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <VenueDetailPage 
      club={club} 
      allDates={allDates} 
      locale={params.locale} 
      basePath="boat-parties" 
    />
  )
}
