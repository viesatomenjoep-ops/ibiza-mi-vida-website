import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllDates, getEvent } from '@/lib/clubtickets'
import { EventCheckoutClient } from './EventCheckoutClient'

export const revalidate = 3600

interface Props {
  params: { slug: string; eventSlug: string; locale: string }
  searchParams: { date?: string }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const allDates = await getAllDates(params.locale)
  const dateObj = allDates.find(d => 
    d.venueSlug === params.slug && 
    d.eventSlug === params.eventSlug && 
    (!searchParams.date || d.date === searchParams.date)
  )
  
  if (!dateObj) return { title: 'Event Not Found | Ibiza mi vida' }

  return {
    title: `${dateObj.eventName} Tickets | Ibiza mi vida`,
    description: `Buy tickets for ${dateObj.eventName} at ${dateObj.venueName}. Official partner for Ibiza tickets.`,
  }
}

export default async function EventPage({ params, searchParams }: Props) {
  const allDates = await getAllDates(params.locale)
  
  // Find all dates for this event slug
  const eventDates = allDates.filter(d => 
    d.venueSlug === params.slug && 
    d.eventSlug === params.eventSlug
  )
  
  if (eventDates.length === 0) {
    notFound()
  }

  // Find the specific date clicked, or default to the first upcoming date
  const targetDateStr = searchParams.date || eventDates[0].date
  const selectedDateObj = eventDates.find(d => d.date === targetDateStr) || eventDates[0]

  // Get full event details to get description/requirements
  const fullEvent = selectedDateObj.eventId ? await getEvent(selectedDateObj.eventId, params.locale) : undefined

  return (
    <EventCheckoutClient 
      selectedDateObj={selectedDateObj}
      allEventDates={eventDates}
      fullEvent={fullEvent}
      locale={params.locale}
    />
  )
}
