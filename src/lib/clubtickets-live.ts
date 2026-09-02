import { BASE_URL } from './clubtickets'

/**
 * De actuele stand van één event, rechtstreeks bij ClubTickets opgevraagd.
 *
 * ── Waarom dit bestaat ────────────────────────────────────────────────────
 * De rest van de site draait op een momentopname die drie keer per dag wordt
 * ververst. Voor een agenda is dat prima. Voor de pagina waar iemand op het
 * punt staat te klikken niet: tussen twee syncs door kan een avond uitverkocht
 * raken of van de kalender verdwijnen, en dan stuurt onze knop iemand naar een
 * winkel waar niets meer te halen valt. Dat is precies het moment waarop je
 * geen verouderde informatie wilt tonen.
 *
 * ── Wat ClubTickets wél en niet zegt ──────────────────────────────────────
 * Er is geen `soldOut`-veld. Nagevraagd op hun eigen endpoint: voor een
 * uitverkochte avond komt `lowestAvailablePrice: null` terug met een lege
 * `prices`. Verdwijnt een datum helemaal uit `dates[]`, dan gaat de avond niet
 * door of is hij verplaatst.
 *
 * Die eerste toestand is dubbelzinnig -- "uitverkocht" en "nog niet in de
 * verkoop" zien er identiek uit. Daar is één ding dat ze uit elkaar houdt, en
 * dat hebben we zelf: onze momentopname. Stond er in de laatste sync wél een
 * prijs en nu niet meer, dan is er iets verkocht. Stond er toen ook al niets,
 * dan is de verkoop nooit begonnen. Vandaar dat `liveStatus()` de opgeslagen
 * prijs als tweede argument wil -- zonder die vergelijking zouden we gokken.
 *
 * ── Wat dit nooit mag doen ────────────────────────────────────────────────
 * De pagina platleggen. Een storing bij ClubTickets, een trage verbinding, een
 * kapot antwoord: alles levert `null` op, en dan valt de pagina terug op de
 * opgeslagen gegevens zoals hij dat altijd al deed. Vandaar de harde deadline
 * van 2,5 seconde en de vangnetten om elke stap heen.
 */

/** Timeout op de call. Langer wachten dan dit is de pagina laten hangen. */
const DEADLINE_MS = 2500
/**
 * Eén minuut cache.
 *
 * Kort genoeg dat "uitverkocht" binnen een minuut zichtbaar is, lang genoeg
 * dat een pagina die honderd keer per minuut geopend wordt niet honderd keer
 * bij ClubTickets aanklopt.
 */
const REVALIDATE_SECONDS = 60

export type EventStatus =
  /** Kaarten te koop; `price` is de laagste. */
  | 'available'
  /** Stond eerder wel in de verkoop, nu niets meer beschikbaar. */
  | 'soldout'
  /** Nooit een prijs gehad: de verkoop is nog niet begonnen. */
  | 'notonsale'
  /** Deze datum staat niet meer in de agenda van ClubTickets. */
  | 'gone'
  /** Geen antwoord gekregen — toon gewoon wat we hadden. */
  | 'unknown'

export interface LiveDate {
  date: string
  prices: string
  lowestAvailablePrice: number | null
}

/**
 * Haal de actuele datums van een event op. Geeft `null` bij elke vorm van
 * mislukking; dat is een geldige uitkomst en geen fout.
 */
export async function getLiveEventDates(
  venueId: number,
  eventId: number,
  locale: string,
): Promise<LiveDate[] | null> {
  if (!venueId || !eventId) return null
  try {
    const res = await fetch(`${BASE_URL}/venue/${venueId}/event/${eventId}?locale=${locale}`, {
      signal: AbortSignal.timeout(DEADLINE_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) {
      console.warn(`[clubtickets-live] HTTP ${res.status} voor event ${eventId}`)
      return null
    }
    const json = await res.json()
    const rows = json?.data?.dates
    if (!Array.isArray(rows)) return null
    return rows.map((d: any): LiveDate => ({
      date: String(d?.date || '').slice(0, 10),
      prices: String(d?.prices || ''),
      lowestAvailablePrice:
        typeof d?.lowestAvailablePrice === 'number' ? d.lowestAvailablePrice : null,
    }))
  } catch (e) {
    // Netwerk, deadline, kapotte JSON — allemaal "we weten het niet".
    console.warn(`[clubtickets-live] niet gebruikt: ${e instanceof Error ? e.message : String(e)}`)
    return null
  }
}

/**
 * Wat is de stand voor één avond?
 *
 * @param live      Wat ClubTickets nu zegt, of null als we ze niet bereikten.
 * @param datum     De avond waar de bezoeker naar kijkt (yyyy-mm-dd).
 * @param opgeslagenPrijs De prijs uit onze laatste sync. Zie de kop van dit
 *                  bestand: zonder die vergelijking kunnen we "uitverkocht"
 *                  niet onderscheiden van "nog niet in de verkoop".
 */
export function liveStatus(
  live: LiveDate[] | null,
  datum: string,
  opgeslagenPrijs: string | null | undefined,
): { status: EventStatus; price: string | null } {
  if (!live) return { status: 'unknown', price: null }

  const regel = live.find(d => d.date === datum)
  if (!regel) return { status: 'gone', price: null }

  if (regel.lowestAvailablePrice !== null && regel.prices.trim()) {
    return { status: 'available', price: regel.prices }
  }

  const hadPrijs = Boolean((opgeslagenPrijs || '').trim())
  return { status: hadPrijs ? 'soldout' : 'notonsale', price: null }
}

/**
 * De hele keten in één aanroep, voor een detailpagina.
 *
 * Zoekt de gekozen avond op in de opgeslagen datums, vraagt ClubTickets naar de
 * actuele stand en vergelijkt. Geeft `undefined` als er niets te melden valt --
 * de pagina rendert dan precies zoals hij dat altijd deed.
 */
export async function liveVoorEvent(
  eventDates: { date?: string; prices?: string; venueId?: number; eventId?: number }[],
  selectedDate: string | undefined,
  locale: string,
): Promise<{ status: EventStatus; price: string | null } | undefined> {
  const gekozen =
    (selectedDate && eventDates.find(d => String(d.date || '').slice(0, 10) === selectedDate)) ||
    eventDates[0]
  if (!gekozen?.venueId || !gekozen?.eventId) return undefined

  const datum = String(gekozen.date || '').slice(0, 10)
  const live = await getLiveEventDates(gekozen.venueId, gekozen.eventId, locale)
  const uit = liveStatus(live, datum, gekozen.prices)
  // 'available' en 'unknown' zeggen de bezoeker niets nieuws: in het eerste
  // geval klopt de opgeslagen prijs, in het tweede weten we het niet. Alleen
  // afwijkingen zijn het melden waard.
  return uit.status === 'available' || uit.status === 'unknown' ? undefined : uit
}
