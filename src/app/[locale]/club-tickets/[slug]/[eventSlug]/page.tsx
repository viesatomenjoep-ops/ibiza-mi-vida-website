import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getAllDates } from '@/lib/clubtickets'
import { EventCheckoutClient } from './EventCheckoutClient'

export const revalidate = 3600

interface Props {
  params: { slug: string; eventSlug: string; locale: string }
}

async function fetchEventData(eventSlug: string) {
  // Try to find it in ct_events first
  const { data: eventGrp } = await supabase
    .from('ct_events')
    .select('*, ct_venues(*)')
    .eq('slug', eventSlug)
    .single();
    
  if (eventGrp) return eventGrp;

  // Sometimes the slug might be the old combination slug, so we fallback to ct_events
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await fetchEventData(params.eventSlug)
  
  if (!event) return { title: 'Event Not Found | Ibiza mi vida' }

  return {
    title: `${event.name} at ${event.ct_venues?.name} Tickets | Ibiza mi vida`,
    description: `Buy tickets for ${event.name} at ${event.ct_venues?.name}. Official partner for Ibiza tickets.`,
  }
}

export default async function EventPage({ params }: Props) {
  const eventGrp = await fetchEventData(params.eventSlug)
  if (!eventGrp) notFound()

  // Fetch all upcoming dates for this event group
  const { data: allDatesData } = await supabase
    .from('ct_dates')
    .select('*')
    .eq('event_id', eventGrp.id)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    
  const allDates = allDatesData || [];
  
  if (allDates.length === 0) {
    notFound(); // No upcoming dates
  }

  // Choose the first upcoming date as the selected date
  const selectedDateRow = allDates[0];

  // Supabase covers are sometimes empty → fall back to the ClubTickets feed (which has
  // a cover for every event) so the hero image never renders black.
  let ctImage = ''
  if (!eventGrp.cover && !eventGrp.logo) {
    try {
      const ctDates = await getAllDates(params.locale)
      const match = ctDates.find(d => d.eventSlug === eventGrp.slug || (d.venueSlug === eventGrp.ct_venues?.slug && d.eventName === eventGrp.name))
      ctImage = match?.eventCover || match?.eventLogo || match?.venueCover || ''
    } catch {}
  }
  const heroImage = eventGrp.cover || eventGrp.logo || ctImage || ''

  const mappedSelectedDate = {
    id: selectedDateRow.id,
    eventId: eventGrp.id,
    venueId: eventGrp.venue_id,
    venueSlug: eventGrp.ct_venues?.slug,
    venueName: eventGrp.ct_venues?.name,
    eventName: eventGrp.name,
    eventSlug: eventGrp.slug,
    date: selectedDateRow.date,
    prices: selectedDateRow.prices,
    lineUp: selectedDateRow.raw_lineup,
    affLink: selectedDateRow.aff_link,
    image: heroImage
  };

  const mappedAllDates = allDates.map(d => ({
    id: d.id,
    eventId: eventGrp.id,
    venueId: eventGrp.venue_id,
    venueSlug: eventGrp.ct_venues?.slug,
    venueName: eventGrp.ct_venues?.name,
    eventName: eventGrp.name,
    eventSlug: eventGrp.slug,
    date: d.date,
    prices: d.prices,
    lineUp: d.raw_lineup,
    affLink: d.aff_link,
    image: heroImage
  }));

  const fullEvent = {
    description: eventGrp.description,
    requirements: eventGrp.requirements,
    startAt: eventGrp.start_at,
    logo: eventGrp.logo || eventGrp.whitelogo
  };

  return (
    <EventCheckoutClient 
      selectedDateObj={mappedSelectedDate as any}
      allEventDates={mappedAllDates as any}
      fullEvent={fullEvent as any}
      locale={params.locale}
    />
  )
}
