import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import DealsOfTheDayClient from './DealsOfTheDayClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Deals of the Day | Ibiza mi vida',
  description: 'Find the cheapest club tickets and best deals for Ibiza boat parties and events.',
}

export default async function DealsPage({ params }: { params: { locale: string } }) {
  // Use a slightly offset today threshold (yesterday) to account for timezones
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateThreshold = yesterday.toISOString().split('T')[0];

  const { data: dbEvents } = await supabase
    .from('ct_dates')
    .select('*, ct_events(name, slug, logo, cover), ct_venues(name, slug, logo, whitelogo, cover)')
    .gte('date', dateThreshold)
    .order('date', { ascending: true })
    .limit(150);

  const formattedEvents = (dbEvents || []).map(d => ({
    id: d.id,
    provider_id: d.provider_id,
    name: d.name,
    date: d.date,
    prices: d.prices ? Number(d.prices) : null,
    aff_link: d.aff_link,
    ct_events: d.ct_events,
    ct_venues: d.ct_venues
  }));

  return (
    <DealsOfTheDayClient initialEvents={formattedEvents} locale={params.locale} />
  );
}
