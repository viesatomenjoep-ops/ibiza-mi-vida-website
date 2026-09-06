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
  date: string
  /** Optioneel: ontbreekt als het veld leeg was. Zie de mapping onderaan. */
  name?: string
  prices?: string
  lineUp?: string
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
  // 120 en niet 150. De kaart kapt af op twee regels van twaalf pixels, en
  // daar passen ongeveer zeventig tekens in; alles daarboven werd wel
  // meegestuurd maar nooit getoond. Over 678 events was dat 79 kB aan tekst
  // waarvan de helft onzichtbaar bleef.
  return zin.length > 120 ? zin.slice(0, 117).trimEnd() + '…' : zin
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
      // Lege velden weglaten in plaats van als "" mee te sturen. Van de 678
      // events in een venster hebben er 587 geen line-up en 655 geen eigen
      // naam; die sleutels stonden allemaal wél in de HTML. Een leeg veld kost
      // niets om te tonen maar wel een sleutel om te versturen, twee keer:
      // eenmaal in de opmaak en eenmaal in de data waarmee de browser het
      // overneemt. De client leest ze al met `?.` en `|| ''`, dus ontbreken
      // gedraagt zich exact als leeg.
      const uit: CalendarEvent = {
        id: String(d.id),
        date: d.date,
        ct_events: {
          slug: d.eventSlug,
          cover: pickCover(d.eventCover, d.eventLogo, venueObj?.picture, d.venueCover),
        },
        ct_venues: { slug: d.venueSlug },
      }
      if (d.name) uit.name = d.name
      if (d.prices) uit.prices = d.prices
      if (d.lineUp) uit.lineUp = d.lineUp
      if (d.eventName) uit.ct_events.name = d.eventName
      if (d.venueName) uit.ct_venues.name = d.venueName
      const blurb = eersteZin(eventBlurbs.get(d.eventSlug || ''))
      // Alleen bij een lege line-up: de kaart toont de blurb uitsluitend als er
      // geen artiestenchips zijn, dus bij de andere 91 events was het tekst die
      // nooit in beeld kwam.
      if (blurb && !d.lineUp) uit.ct_events.blurb = blurb
      return uit
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

/**
 * Dagen die de pagina zelf rendert.
 *
 * Was 14. Dat leverde 678 events in de eerste laadbeurt op, samen goed voor
 * 404 kB aan gedupliceerde data in de HTML -- de agendapagina woog daarmee
 * 928 kB, waar een normale pagina rond de 100 kB zit. Voor iemand op een
 * telefoon met slecht bereik is dat het verschil tussen laden en wegklikken,
 * en Google crawlt trage pagina's minder diep.
 *
 * Acht is genoeg voor alles wat je meteen ziet. De kalender opent op 'week' en
 * die loopt van maandag tot zondag: vanaf vandaag geteld is dat in het
 * slechtste geval zeven dagen, plus een dag marge. Schakel je naar 'maand' of
 * blader je verder, dan haalt de client de rest op via /api/calendar-window --
 * dat mechanisme bestond al en verandert hier niet.
 */
export const INITIAL_DAYS = 8
