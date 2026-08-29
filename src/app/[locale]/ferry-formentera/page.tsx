import type { Metadata } from 'next'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { SERVICE_COPY } from '@/lib/service-schema-copy'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'ferry-formentera')
}

import { getVenues, getAllDates } from '@/lib/clubtickets';
import { agendaCopy } from '@/lib/agenda-i18n';
import WaterAgendaClient, { WaterAgendaEvent, WaterAgendaVenue } from '@/components/boats/WaterAgendaClient';

export const revalidate = 3600;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const ferryVenues = allVenues.filter(v => v.type?.slug === 'formentera-day-trip');
  const ferrySlugs = new Set(ferryVenues.map(v => v.slug));

  const allDates = await getAllDates(params.locale);
  const todayStr = new Date().toISOString().split('T')[0];
  // PERF: only ship the next 31 days to the client - the full season (1000+ dates)
  // made the page payload huge and froze the browser.
  const windowEndStr = new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0];
  const events: WaterAgendaEvent[] = allDates
    .filter(d => d.venueSlug && ferrySlugs.has(d.venueSlug) && d.date >= todayStr && d.date <= windowEndStr)
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

  const venues: WaterAgendaVenue[] = ferryVenues.map(v => ({
    slug: v.slug,
    name: v.name,
    picture: v.picture,
    whitelogo: v.whitelogo,
    cover: v.cover,
    logo: (v as any).logo,
  }));

  const C = agendaCopy('ferry-formentera', params.locale);
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const sc = SERVICE_COPY['ferry-formentera']

  return (
    <>
    <ServiceSchema name={sc.name[l]} description={sc.description[l]} serviceType={sc.serviceType} path={`${l}/ferry-formentera`} />
    <WaterAgendaClient
      locale={params.locale}
      basePath="ferry-formentera"
      kicker={C.kicker}
      title={C.title}
      subtitle={C.subtitle}
      events={events}
      venues={venues}
    />
    </>
  );
}
