import { getVenues, getAllDates } from '@/lib/clubtickets';
import WaterAgendaClient, { WaterAgendaEvent, WaterAgendaVenue } from '@/components/boats/WaterAgendaClient';

export const revalidate = 3600;

// Shuttle / water-taxi operators live under the ClubTickets "formentera-day-trip" type.
const SHUTTLE_MATCH = /aquabus|shuttle|santa eularia/i;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const shuttleVenues = allVenues.filter(
    v => v.type?.slug === 'formentera-day-trip' && SHUTTLE_MATCH.test(v.name)
  );
  const shuttleSlugs = new Set(shuttleVenues.map(v => v.slug));

  const allDates = await getAllDates(params.locale);
  const todayStr = new Date().toISOString().split('T')[0];
  const events: WaterAgendaEvent[] = allDates
    .filter(d => d.venueSlug && shuttleSlugs.has(d.venueSlug) && d.date >= todayStr)
    .map(d => ({
      id: String(d.id),
      name: d.name,
      date: d.date,
      prices: String(d.prices ?? ''),
      lineUp: d.lineUp,
      eventName: d.eventName,
      eventSlug: d.eventSlug,
      eventCover: d.eventCover,
      eventLogo: d.eventLogo,
      venueName: d.venueName,
      venueSlug: d.venueSlug,
      venueCover: d.venueCover,
      venueLogo: d.venueLogo,
      affLink: d.affLink,
    }));

  const venues: WaterAgendaVenue[] = shuttleVenues.map(v => ({
    slug: v.slug,
    name: v.name,
    picture: v.picture,
    whitelogo: v.whitelogo,
    cover: v.cover,
    logo: (v as any).logo,
  }));

  return (
    <WaterAgendaClient
      locale={params.locale}
      kicker={`Ibiza Shuttle ${new Date().getFullYear()}`}
      title="Shuttle Ferry"
      subtitle="Alle shuttle- en watertaxi-afvaarten langs de kust van Ibiza, per dag, week en maand — direct te boeken via ClubTickets."
      events={events}
      venues={venues}
    />
  );
}
