import { BASE_URL, type CTEventDate } from './clubtickets'

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

const iso10 = (d: unknown): string => String(d ?? '').slice(0, 10)

export interface ReconciledEventDates {
  /**
   * De datums die de pagina toont: de opgeslagen rijen die ClubTickets nú nog
   * in de agenda heeft staan, met de prijs ververst uit de live-stand. Rijen
   * die uit de live-agenda verdwenen zijn (`gone`) vallen weg; uitverkochte
   * avonden blijven staan -- de knop blijft altijd bereikbaar, precies zoals
   * EventDetailPage dat al deed.
   */
  dates: CTEventDate[]
  /**
   * De stand van de avond die de URL vroeg (`?date=`), of -- zonder die
   * parameter -- van de eerstvolgende nog beschikbare avond. Vraagt de URL een
   * datum die niet meer in de live-agenda staat, dan is dit `gone` en toont
   * EventDetailPage de bijbehorende melding, ook al staat die datum niet meer
   * in `dates`.
   */
  selected: { status: EventStatus; price: string | null }
  /** `true` = ClubTickets antwoordde; `false` = teruggevallen op de snapshot. */
  live: boolean
}

/**
 * Legt de opgeslagen datums van een event naast de live-agenda van ClubTickets.
 *
 * ── Waarom dit de hele lijst raakt en niet één avond ──────────────────────
 * De opgeslagen momentopname wordt ~3x per dag ververst. Tussen twee syncs kan
 * een avond van de kalender verdwijnen (afgelast of verplaatst). `liveVoorEvent`
 * merkte dat alleen voor de ene gekozen avond op en liet de rest van de lijst
 * ongemoeid, dus de datumkiezer bleef een avond tonen die niet meer bestond.
 * Deze functie filtert de hele lijst op wat ClubTickets nú nog kent en geeft
 * daarnaast de stand van de gevraagde avond terug.
 *
 * ── Wat dit nooit mag doen ────────────────────────────────────────────────
 * De pagina laten hangen of leeg laten vallen bij een storing. Elke vorm van
 * mislukking -- geen `venueId`/`eventId`, time-out, kapot antwoord -- levert de
 * onbewerkte snapshot op met status `unknown`, exact het gedrag van vóór deze
 * functie.
 */
export async function reconcileEventDates(
  snapshotDates: CTEventDate[],
  requestedDate: string | undefined,
  locale: string,
): Promise<ReconciledEventDates> {
  const terugval = (): ReconciledEventDates => ({
    dates: snapshotDates,
    selected: { status: 'unknown', price: null },
    live: false,
  })

  // De id's zitten op de datumrijen (toegevoegd door het sync-script). Pak de
  // eerste rij die ze allebei heeft.
  const anker = snapshotDates.find(d => d.venueId && d.eventId) ?? snapshotDates[0]
  if (!anker?.venueId || !anker?.eventId) return terugval()

  const live = await getLiveEventDates(anker.venueId, anker.eventId, locale)
  if (!live) return terugval()

  const liveOpDatum = new Map(live.map(d => [d.date, d]))

  // Datums die de live-agenda kent maar de snapshot niet. We voegen ze niet toe
  // -- ClubTickets levert in de live-stand geen `affLink`, `lineUp` of `id`, dus
  // een rij die alleen daaruit komt zou geen werkende ticketknop hebben. Wel
  // loggen, zodat een structureel gat zichtbaar wordt.
  const extra = live.filter(d => !snapshotDates.some(s => iso10(s.date) === d.date))
  if (extra.length) {
    console.warn(
      `[clubtickets-live] live-agenda heeft ${extra.length} datum(s) buiten de snapshot voor event ${anker.eventId}: ${extra.map(d => d.date).join(', ')}`,
    )
  }

  // Snapshot-rij als basis (die draagt affLink/lineUp/id), weg met wat uit de
  // live-agenda verdween, en de prijs ververst uit de live-stand als die er is.
  const dates = snapshotDates
    .filter(d => liveOpDatum.has(iso10(d.date)))
    .map(d => {
      const l = liveOpDatum.get(iso10(d.date))!
      return l.prices.trim() ? { ...d, prices: l.prices } : d
    })

  // Doel: de gevraagde datum als die er is, anders de eerstvolgende nog
  // beschikbare avond -- zo toont een pagina zonder `?date=` nog steeds een
  // uitverkocht-melding voor de volgende avond, net als voorheen.
  const doel = requestedDate ?? iso10(dates[0]?.date)
  if (!doel) {
    // Geen gevraagde datum én niets meer beschikbaar: er valt niets te melden.
    return { dates, selected: { status: 'unknown', price: null }, live: true }
  }

  const opgeslagenPrijs = snapshotDates.find(d => iso10(d.date) === doel)?.prices
  const selected = liveStatus(live, doel, opgeslagenPrijs)

  return { dates, selected, live: true }
}
