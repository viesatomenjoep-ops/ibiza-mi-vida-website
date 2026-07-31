import type { Metadata } from 'next'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { slug: string; eventSlug: string; locale: string } }): Promise<Metadata> {
  const venues = await getVenues(params.locale)
  const venue = venues.find(v => v.slug === params.slug && v.type.slug === 'activities')
  const dates = venue ? await getAllDates(params.locale) : []
  const ev = dates.find(d => d.venueSlug === params.slug && d.eventSlug === params.eventSlug)
  if (!ev || !venue) return staticMetadata(params.locale, 'activities')
  return detailMetadata(params.locale, `activities/${params.slug}/${params.eventSlug}`, ev.eventName || ev.name || venue.name, {
    description: (venue as any).cleanDescription || venue.description,
    image: ev.eventCover || ev.eventLogo || venue.cover || venue.picture,
    suffix: `— ${venue.name}`,
  })
}

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
      basePath="activities"
    />
  )
}