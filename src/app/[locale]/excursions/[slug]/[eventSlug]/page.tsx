import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVenues, getVenue, getAllDates } from '@/lib/clubtickets'
import { EventDetailPage } from '@/components/templates/EventDetailPage'

export const revalidate = 3600

interface Props {
  params: { slug: string; eventSlug: string; locale: string }
}

export async function generateStaticParams() {
  return [];
}

export default async function ExcursionEventDetailPage({ params }: Props) {
  const { slug, eventSlug, locale } = params
  
  const venues = await getVenues(locale)
  const venueRef = venues.find(v => v.slug === slug && v.type.slug === 'activities')
  if (!venueRef) notFound()
  
  const club = await getVenue(venueRef.id, locale)
  if (!club) notFound()

  const allDatesGlobal = await getAllDates(locale)
  const eventDates = allDatesGlobal.filter(d => d.venueSlug === slug && d.eventSlug === eventSlug)
  
  if (!eventDates || eventDates.length === 0) notFound()

  eventDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <EventDetailPage 
      club={club} 
      eventDates={eventDates} 
      eventSlug={eventSlug} 
      locale={locale} 
      basePath="excursions" 
    />
  )
}
