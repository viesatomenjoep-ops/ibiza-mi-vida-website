import type { Metadata } from 'next'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import { SERVICE_COPY } from '@/lib/service-schema-copy'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'boat-party')
}

import { getVenues, getAllDates } from '@/lib/clubtickets';
import { agendaCopy } from '@/lib/agenda-i18n';
import WaterAgendaClient, { WaterAgendaEvent, WaterAgendaVenue } from '@/components/boats/WaterAgendaClient';

export const revalidate = 3600;

export default async function Page({ params }: { params: { locale: string } }) {
  const allVenues = await getVenues(params.locale);
  const catVenues = allVenues.filter(v => v.type?.slug === 'boat');
  const catSlugs = new Set(catVenues.map(v => v.slug));

  const allDates = await getAllDates(params.locale);
  const todayStr = new Date().toISOString().split('T')[0];
  // PERF: only ship the next 31 days to the client — the full season would
  // make the payload huge (see the other agenda pages).
  const windowEndStr = new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0];
  const events: WaterAgendaEvent[] = allDates
    .filter(d => d.venueSlug && catSlugs.has(d.venueSlug) && d.date >= todayStr && d.date <= windowEndStr)
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

  const venues: WaterAgendaVenue[] = catVenues.map(v => ({
    slug: v.slug,
    name: v.name,
    picture: v.picture,
    whitelogo: v.whitelogo,
    cover: v.cover,
    logo: (v as any).logo,
  }));

  const C = agendaCopy('boat-party', params.locale);
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const sc = SERVICE_COPY['boat-party']

  return (
    <>
    <ServiceSchema name={sc.name[l]} description={sc.description[l]} serviceType={sc.serviceType} path={`${l}/boat-party`} />
    <WaterAgendaClient
      locale={params.locale}
      basePath="boat-trip"
      kicker={C.kicker}
      title={C.title}
      subtitle={C.subtitle}
      events={events}
      venues={venues}
    />
    </>
  );
}
