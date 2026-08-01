import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getAllDates } from '@/lib/clubtickets'
import { EventCheckoutClient } from './EventCheckoutClient'
import { EventSchema } from '@/components/seo/EventSchema'
import { SITE_URL } from '@/lib/seo'

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

  const schemaPrice = String(selectedDateRow.prices || '').match(/\d+([.,]\d+)?/)
  const schemaLineup = String(selectedDateRow.raw_lineup || '')
    .replace(/<[^>]+>/g, ' ').split(/[-,]/).map(a => a.trim()).filter(Boolean).slice(0, 10)

  return (
    <>
    <EventSchema
      name={eventGrp.name}
      startDate={selectedDateRow.date}
      venueName={eventGrp.ct_venues?.name || 'Ibiza'}
      description={eventGrp.description ? String(eventGrp.description).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300) : undefined}
      priceFrom={schemaPrice ? parseFloat(schemaPrice[0].replace(',', '.')) : undefined}
      image={heroImage || undefined}
      lineup={schemaLineup}
      pageUrl={`${SITE_URL}/${params.locale}/club-tickets/${params.slug}/${params.eventSlug}`}
    />
    <EventCheckoutClient
      selectedDateObj={mappedSelectedDate as any}
      allEventDates={mappedAllDates as any}
      fullEvent={fullEvent as any}
      locale={params.locale}
    />
    </>
  )
}
