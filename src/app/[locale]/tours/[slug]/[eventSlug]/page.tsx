import { notFound } from 'next/navigation'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { EventDetailPage } from '@/components/templates/EventDetailPage'

export const revalidate = 3600

interface Props {
  params: { slug: string; eventSlug: string; locale: string }
}

export default async function EventPage({ params }: Props) {
  const venues = await getVenues(params.locale);
  const venue = venues.find(v => v.slug === params.slug && v.type.slug === 'activities');
  if (!venue) notFound();

  const allDates = await getAllDates(params.locale);
  const eventDates = allDates.filter(d => d.venueSlug === venue.slug && d.eventSlug === params.eventSlug);
  if (eventDates.length === 0) notFound();

  return (
    <EventDetailPage 
      eventDates={eventDates as any} 
      eventSlug={params.eventSlug}
      club={venue as any} 
      locale={params.locale} 
      basePath="tours"
    />
  )
}