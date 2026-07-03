import type { Metadata } from 'next'
import { getVenues, getAllDates } from '@/lib/clubtickets'
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

  // Fetch dates and venues statically from JSON
  const allDates = await getAllDates(params.locale);
  const venues = await getVenues(params.locale);
  const venuesMap = new Map(venues.map(v => [v.slug, v]));

  const formattedEvents = allDates
    .filter(d => d.date >= dateThreshold)
    .slice(0, 300) // Increase limits to render more options in memory
    .map(d => {
      const venueObj = d.venueSlug ? venuesMap.get(d.venueSlug) : undefined;
      return {
        id: String(d.id),
        provider_id: String(d.eventId || ''),
        name: d.name,
        date: d.date,
        prices: d.prices ? Number(parseFloat(d.prices.replace(/[^\d.,]/g, '').replace(',', '.'))) || 40 : 40,
        aff_link: d.affLink || null,
        ct_events: {
          name: d.eventName || '',
          slug: d.eventSlug || '',
          logo: d.eventLogo || '',
          cover: d.eventCover || ''
        },
        ct_venues: {
          name: d.venueName || '',
          slug: d.venueSlug || '',
          logo: venueObj?.picture || '',
          whitelogo: venueObj?.whitelogo || '',
          cover: venueObj?.cover || ''
        }
      };
    });

  return (
    <DealsOfTheDayClient initialEvents={formattedEvents as any} locale={params.locale} />
  );
}
