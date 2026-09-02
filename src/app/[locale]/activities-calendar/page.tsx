import type { Metadata } from 'next'
import EventsExplorer from '../calendar/EventsExplorer'
import { getVenues } from '@/lib/clubtickets'
import { calendarWindow, seasonDates, INITIAL_DAYS } from '@/lib/calendar-window'
import { ItemListJsonLd } from '@/components/seo/ItemListJsonLd'
import { eventBasePath } from '@/lib/event-path'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { ibizaToday } from '@/lib/date-label'
import { pageMetadata, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

/**
 * Volledige agenda voor alles wat géén clubavond is.
 *
 * ── Waarom een tweede kalender en niet een filter op de eerste ────────────
 * /calendar toont alles door elkaar en heeft als kop "Ibiza Club Calendar".
 * Iemand die een buggytour of een katamaran zoekt komt daar binnen tussen de
 * clubavonden, en de pagina belooft in titel en metadata iets anders dan wat
 * hij wil. Twee zoekvragen, twee pagina's — dezelfde redenering als bij
 * guestlist en package deals.
 *
 * Beide pagina's delen de EventsExplorer en calendarWindow, dus wat je hier
 * ziet en wat je op /calendar ziet kan niet uit elkaar lopen.
 *
 * ── Wat er precies in zit ────────────────────────────────────────────────
 * Alles behalve venues van het type 'clubbing': boottochten, ferry's naar
 * Formentera, jetski's, buggy's, grotten, sunset cruises. Het filter draait op
 * venuetype en niet op een lijst namen, zodat een nieuwe aanbieder in de feed
 * er vanzelf bij komt.
 */
const TITLE: Record<Locale, string> = {
  nl: 'Agenda: activiteiten en boottochten op Ibiza',
  en: 'Calendar: activities and boat trips in Ibiza',
  de: 'Kalender: Aktivitäten und Bootstouren auf Ibiza',
  es: 'Agenda: actividades y excursiones en barco en Ibiza',
  fr: 'Agenda : activités et sorties en bateau à Ibiza',
}
const DESC: Record<Locale, string> = {
  nl: 'Alle boottochten, jetski’s, buggy’s, grotten en Formentera-trips op Ibiza, per dag, met de prijs zoals die nu in de agenda staat.',
  en: 'Every boat trip, jet ski, buggy tour, cave and Formentera crossing in Ibiza, day by day, with the price as it stands in the agenda now.',
  de: 'Alle Bootstouren, Jetskis, Buggys, Höhlen und Formentera-Trips auf Ibiza, Tag für Tag, mit dem aktuellen Preis aus der Agenda.',
  es: 'Todas las excursiones en barco, motos de agua, buggies, cuevas y viajes a Formentera en Ibiza, día a día, con el precio actual.',
  fr: 'Toutes les sorties en bateau, jet-skis, buggys, grottes et traversées vers Formentera à Ibiza, jour par jour, au prix actuel.',
}
const HEADING: Record<Locale, string> = {
  nl: 'Ibiza activiteitenagenda', en: 'Ibiza activities calendar', de: 'Ibiza Aktivitätenkalender',
  es: 'Agenda de actividades Ibiza', fr: 'Agenda des activités Ibiza',
}
const SUB: Record<Locale, string> = {
  nl: 'Boottochten, jetski’s, buggy’s, grotten en Formentera — schuif door de data en boek.',
  en: 'Boat trips, jet skis, buggies, caves and Formentera — slide through the dates and book.',
  de: 'Bootstouren, Jetskis, Buggys, Höhlen und Formentera — durch die Daten schieben und buchen.',
  es: 'Excursiones en barco, motos de agua, buggies, cuevas y Formentera — desliza y reserva.',
  fr: 'Sorties en bateau, jet-skis, buggys, grottes et Formentera — faites défiler et réservez.',
}
const CRUMB: Record<Locale, string> = {
  nl: 'Activiteitenagenda', en: 'Activities calendar', de: 'Aktivitätenkalender',
  es: 'Agenda de actividades', fr: 'Agenda des activités',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  return pageMetadata({ locale: l, path: 'activities-calendar', title: TITLE[l], description: DESC[l] })
}

export default async function ActivitiesCalendarPage({ params }: { params: { locale: string } }) {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const venues = await getVenues(params.locale)

  const todayStr = ibizaToday()
  const windowEndStr = new Date(Date.now() + (INITIAL_DAYS - 1) * 86400000).toISOString().split('T')[0]
  const alle = await calendarWindow(params.locale, todayStr, windowEndStr)
  const dockDates = await seasonDates(params.locale, todayStr)

  const typeBySlug = new Map(venues.map((v) => [v.slug, v.type?.slug || '']))
  const nietClub = (slug?: string) => (typeBySlug.get(slug || '') || '') !== 'clubbing'

  const mappedEvents = alle.filter((e) => nietClub(e.ct_venues.slug))
  const lightVenues = venues
    .filter((v) => (v.type?.slug || '') !== 'clubbing')
    .map((v) => ({
      name: v.name,
      slug: v.slug,
      whitelogo: v.whitelogo || '',
      picture: v.picture || '',
      type_slug: v.type?.slug || '',
    }))

  // eventBasePath() bepaalt het pad per venuetype: een boottocht onder
  // /club-tickets zetten is een gegarandeerde 404.
  const listEntries = mappedEvents
    .filter((e) => e.ct_venues.slug && e.ct_events.slug)
    .map((e) => ({
      name: `${e.ct_events.name || e.name} — ${e.ct_venues.name}`,
      path: `${params.locale}/${eventBasePath(typeBySlug.get(e.ct_venues.slug || '') || '')}/${e.ct_venues.slug}/${e.ct_events.slug}`,
      date: e.date,
      image: e.ct_events.cover || undefined,
      venueName: e.ct_venues.name,
    }))

  return (
    <>
      <BreadcrumbJsonLd
        locale={params.locale}
        items={[{ name: homeLabel(params.locale), path: '' }, { name: CRUMB[l] }]}
      />
      <ItemListJsonLd entries={listEntries} locale={params.locale} name={TITLE[l]} />
      <EventsExplorer
        events={mappedEvents}
        allVenues={lightVenues}
        locale={params.locale}
        loadedThrough={windowEndStr}
        seasonDates={dockDates}
        today={todayStr}
        heading={HEADING[l]}
        sub={SUB[l]}
      />
    </>
  )
}
