import { getVenues, getAllDates, getAllEvents } from '@/lib/clubtickets'
import { stripHtml } from '@/lib/html-utils'
import { pickCover } from '@/lib/blank-covers'

/**
 * Eén plek die een datumvenster van de agenda naar de vorm brengt die de
 * kalender-client verwacht.
 *
 * Hij bestaat omdat er nu twee ingangen zijn: de pagina rendert de eerste
 * veertien dagen server-side, de API-route levert de rest na als de bezoeker
 * naar 'maand' of 'jaar' schakelt. Twee keer dezelfde mapping schrijven is twee
 * keer de kans dat ze uit elkaar lopen — en dat merk je pas als de bijgeladen
 * events er nét anders uitzien dan de eerste veertien dagen.
 *
 * De velden zijn bewust smal. Logo, foto en type van een zaak zijn
 * eigenschappen van de venue, niet van de avond; die stuurt de pagina één keer
 * mee als venuelijst en zoekt de client op slug op.
 */
export interface CalendarEvent {
  id: string
  name: string
  date: string
  prices: string
  lineUp: string
  /**
   * `blurb` is de eerste zin uit de eventbeschrijving.
   *
   * Tien procent van de avonden heeft een line-up in de feed; bij de andere
   * negentig procent staat er letterlijk een leeg alineablokje. Die kaarten
   * toonden dus alleen een titel en een prijs. Een beschrijving hebben ze
   * allemaal wel -- geteld: 157 van de 157 events, in alle vijf de talen --
   * en daar staat in wat voor avond het is.
   */
  ct_events: { name?: string; slug?: string; cover?: string; blurb?: string }
  ct_venues: { name?: string; slug?: string }
}

/**
 * Eerste zin, zonder opmaak, hoogstens 150 tekens.
 *
 * De beschrijvingen zijn HTML en lopen soms over vijf alinea's. Op een
 * kaartje van vier centimeter hoog past een zin; die eerste zin zegt in deze
 * feed steevast wat voor avond het is ("Garage Nation brengt zeven weken
 * originele UK Garage naar Eden").
 */
function eersteZin(html?: string): string | undefined {
  const kaal = stripHtml(html || '').replace(/\s+/g, ' ').trim()
  if (kaal.length < 20) return undefined
  const punt = kaal.search(/[.!?](\s|$)/)
  const zin = punt > 30 ? kaal.slice(0, punt + 1) : kaal
  return zin.length > 150 ? zin.slice(0, 147).trimEnd() + '…' : zin
}

export async function calendarWindow(
  locale: string,
  fromStr: string,
  toStr: string,
): Promise<CalendarEvent[]> {
  const [allDates, venues, events] = await Promise.all([getAllDates(locale), getVenues(locale), getAllEvents(locale)])
  const venuesMap = new Map(venues.map((v) => [v.slug, v]))
  const eventBlurbs = new Map(events.map((e) => [e.slug, e.description]))

  return allDates
    .filter((d) => d.date >= fromStr && d.date <= toStr)
    .map((d) => {
      const venueObj = d.venueSlug ? venuesMap.get(d.venueSlug) : undefined
      return {
        id: String(d.id),
        name: d.name,
        date: d.date,
        prices: d.prices,
        lineUp: d.lineUp,
        ct_events: {
          name: d.eventName,
          slug: d.eventSlug,
          cover: pickCover(d.eventCover, d.eventLogo, venueObj?.picture, d.venueCover),
          blurb: eersteZin(eventBlurbs.get(d.eventSlug || '')),
        },
        ct_venues: { name: d.venueName, slug: d.venueSlug },
      }
    })
}

/**
 * Elke dag van het seizoen waarop iets te doen is, als yyyy-MM-dd.
 *
 * Het weekdock onderaan de agenda leidde zijn bereik af uit de events die
 * toevallig geladen waren, en dat zijn er veertien dagen. Gevolg: je kon niet
 * verder bladeren dan twee weken vooruit — begin september hield de agenda op
 * 15 september op, terwijl het seizoen tot ver in oktober loopt.
 *
 * Dit is bewust alleen een lijst datums en niet de events zelf: een seizoen
 * telt een paar honderd datums (een handvol kB) tegen duizenden events (ruim
 * een megabyte). Het dock heeft genoeg aan "op welke dagen valt er iets te
 * kiezen"; de events van een week komen pas als je die week opent.
 */
export async function seasonDates(locale: string, fromStr: string): Promise<string[]> {
  const allDates = await getAllDates(locale)
  const uniek = new Set<string>()
  for (const d of allDates) {
    const dag = String(d.date || '').slice(0, 10)
    if (dag >= fromStr) uniek.add(dag)
  }
  return Array.from(uniek).sort()
}

/** Dagen die de pagina zelf rendert. Dekt de 'dag'-strip (vandaag + 13) en de week. */
export const INITIAL_DAYS = 14
