import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'calendar')
}

import EventsExplorer from './EventsExplorer';
import { getVenues } from '@/lib/clubtickets';
import { calendarWindow, INITIAL_DAYS } from '@/lib/calendar-window';
import { ItemListJsonLd } from '@/components/seo/ItemListJsonLd';
import { eventBasePath } from '@/lib/event-path';
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { crumbLabel } from '@/lib/breadcrumb-labels'

export default async function CalendarPage({
  params,
}: {
  params: { locale: string },
}) {
  // De agenda komt uit één mapper, gedeeld met /api/calendar-window, zodat wat
  // hier gerenderd wordt en wat later bijgeladen wordt niet uit elkaar kan lopen.
  const venues = await getVenues(params.locale);

  // PERF: veertien dagen in de HTML, niet eenendertig.
  //
  // Eenendertig dagen waren 1566 events en bijna 1,5 MB pagina, en dat is wat
  // de Performance-score onderuit haalde. Veertien dekt precies de weergaven
  // waar iedereen op binnenkomt — de dagstrip loopt tot vandaag + 13, de week
  // valt er binnen — dus voor de standaardbezoeker verandert er niets, en een
  // crawler zonder JavaScript ziet nog steeds wie er deze en volgende week
  // speelt. 'Maand' en 'jaar' halen de rest op via de API-route.
  //
  // Dat is verantwoord omdat de kalender niet de canonieke kopie van een event
  // is: elk event heeft een eigen indexeerbare detailpagina, en die staan
  // allemaal in de sitemap.
  const todayStr = new Date().toISOString().split('T')[0];
  const windowEndStr = new Date(Date.now() + (INITIAL_DAYS - 1) * 86400000).toISOString().split('T')[0];
  const mappedEvents = await calendarWindow(params.locale, todayStr, windowEndStr);

  /** Type per venue-slug, voor de ItemList hieronder. Stond eerst in elk event. */
  const venueTypeBySlug = new Map(venues.map(v => [v.slug, v.type?.slug || '']));

  const lightVenues = venues.map(v => ({
    name: v.name,
    slug: v.slug,
    whitelogo: v.whitelogo || '',
    picture: v.picture || '',
    type_slug: v.type?.slug || '',
  }));

  // Structured data for the listing itself. Paths go through eventBasePath()
  // for the same reason the sitemap does: only 'clubbing' venues live under
  // /club-tickets, and pointing a boat event there is a guaranteed 404.
  const listEntries = mappedEvents
    .filter(e => e.ct_venues.slug && e.ct_events.slug)
    .map(e => ({
      name: `${e.ct_events.name || e.name} — ${e.ct_venues.name}`,
      path: `${params.locale}/${eventBasePath(venueTypeBySlug.get(e.ct_venues.slug || '') || '')}/${e.ct_venues.slug}/${e.ct_events.slug}`,
      date: e.date,
    }));

  return (
    <>
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[{ name: homeLabel(params.locale), path: '' }, { name: crumbLabel('calendar', params.locale) }]}
      />
      <ItemListJsonLd
        entries={listEntries}
        locale={params.locale}
        name="Ibiza event calendar"
      />
      <EventsExplorer
        events={mappedEvents}
        allVenues={lightVenues}
        locale={params.locale}
        loadedThrough={windowEndStr}
      />
    </>
  );
}
