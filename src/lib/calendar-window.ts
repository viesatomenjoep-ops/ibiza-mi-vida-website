import { getVenues, getAllDates } from '@/lib/clubtickets'
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
  ct_events: { name?: string; slug?: string; cover?: string }
  ct_venues: { name?: string; slug?: string }
}

export async function calendarWindow(
  locale: string,
  fromStr: string,
  toStr: string,
): Promise<CalendarEvent[]> {
  const [allDates, venues] = await Promise.all([getAllDates(locale), getVenues(locale)])
  const venuesMap = new Map(venues.map((v) => [v.slug, v]))

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
        },
        ct_venues: { name: d.venueName, slug: d.venueSlug },
      }
    })
}

/** Dagen die de pagina zelf rendert. Dekt de 'dag'-strip (vandaag + 13) en de week. */
export const INITIAL_DAYS = 14
