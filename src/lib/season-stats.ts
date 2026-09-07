import { getVenues, getAllDates } from '@/lib/clubtickets'
import { priceNumbers, median } from '@/lib/price-parse'
import { ibizaToday } from '@/lib/date-label'

/**
 * When each Ibiza club stops for the season, counted from the live agenda.
 *
 * "Is Pacha open in November?" and "when does Ibiza close?" get asked
 * constantly and answered almost entirely from memory. We hold the published
 * agenda for every major venue, so the closing night is something we can read
 * off rather than recall.
 *
 * ── The one claim this file must never make ───────────────────────────────
 * A venue's last scheduled date is the last night WE HAVE. That is not the
 * same as "closed after that". Clubs publish closing parties well in advance,
 * so in practice the two usually coincide — but a club that simply has not
 * released its final dates would look identical in this data. So every field
 * here is named for what it is (`lastScheduled`, not `closingDate`) and any
 * page rendering it has to carry that distinction into the wording. Telling a
 * visitor a club is shut when it is not is the one error that actually costs
 * someone their night out.
 */

export interface VenueSeason {
  slug: string
  name: string
  /** First night we hold for this venue. */
  first: string
  /** Last night we hold. NOT necessarily the closing party. */
  lastScheduled: string
  /** Nights still to come. */
  upcoming: number
  /**
   * The venue's official mark from the ClubTickets feed.
   *
   * `whitelogo` is a reversed-out file — white artwork on transparency — so it
   * is invisible on the light table this feeds. The page flattens it with
   * `brightness-0`, the same treatment ClubLogoSlider already uses, which
   * renders the official artwork as a silhouette rather than redrawing it.
   * `picture` is the fallback and is a photo, so it is only reached when a
   * venue has no mark at all.
   */
  logo?: string
}

export interface MonthCount {
  /** yyyy-mm */
  month: string
  /** Distinct clubs with at least one night that month. */
  clubs: number
  /** Total club nights that month. */
  nights: number
  /**
   * Goedkoopste en typische entreeprijs van die maand, of `null`.
   *
   * `null` zodra de maand minder dan MIN_PRIJZEN geprijsde avonden heeft. Een
   * mediaan over vier avonden is geen mediaan maar een toevallig getal, en op
   * een pagina die "wanneer is Ibiza het goedkoopst" beantwoordt is dat het
   * gevaarlijkste soort cijfer: het ziet er even hard uit als de rest.
   *
   * De tabel toont dan een streepje. Niet nul, niet "vanaf €0" — een leeg vak
   * is de eerlijke weergave van "hier meten we nog te weinig".
   */
  low: number | null
  median: number | null
  /** Aantal geprijsde clubavonden waarop low/median rusten. */
  priced: number
}

/**
 * Een aangekondigde closing party: één avond, met naam en datum uit de agenda.
 *
 * Dit is iets anders dan `VenueSeason.lastScheduled`, en het verschil is
 * precies waar dit bestand bovenaan voor waarschuwt. `lastScheduled` is de
 * laatste avond die WIJ hebben — dat kan ook betekenen dat een club zijn
 * slotdatums nog niet heeft vrijgegeven. Een closing party is een avond die de
 * club zélf zo heeft genoemd. Het eerste is een afleiding, het tweede een
 * aankondiging, en alleen het tweede mag je zonder voorbehoud opschrijven.
 */
export interface ClosingParty {
  venueSlug: string
  venueName: string
  /** De eventnaam zoals de club hem publiceert. */
  name: string
  date: string
  /** Slug van het event, voor de link naar de detailpagina. */
  eventSlug?: string
}

export interface SeasonStats {
  venues: VenueSeason[]
  /**
   * Aangekondigde closing parties die nog moeten komen, oplopend op datum.
   *
   * Leeg buiten het seizoen, en dat hoort zo: dan rendert de sectie niets in
   * plaats van een lijst met data uit het verleden.
   */
  closings: ClosingParty[]
  months: MonthCount[]
  /** Earliest and latest club night anywhere in the agenda. */
  from: string
  to: string
  /** Clubs with at least one night still to come. */
  openNow: number
  todayStr: string
}

/**
 * De naam van de avond, zoals de club hem publiceert, ontdaan van ruis.
 *
 * De feed heeft twee velden en welk van de twee iets zegt, verschilt per club.
 * `eventName` is meestal het feestmerk ("Candy Land", "Eden Presents") en
 * `name` de avond zelf ("Candy Land Closing Party", "Secret Sessions. Closing
 * Party") — maar bij O Beach staat de naam juist in `eventName` en bevat `name`
 * niets dan "Closing Party". Vast kiezen voor één veld gooide daar drie avonden
 * weg. Dus: allebei schoonmaken en de informatiefste houden.
 *
 * Twee dingen gaan eruit. "Closing Party" zelf, want dat staat al boven de
 * tabel en 25 keer herhalen leest als een stotter. En de clubnaam wanneer die
 * de hele naam is: "Hï Ibiza" in een rij waarvan de clubkolom al "Hï Ibiza"
 * zegt, voegt niets toe.
 *
 * Blijft er niets over, dan geeft deze functie een lege string terug en valt de
 * rij terug op een neutraal label. Nooit een half afgeknipte naam tonen.
 */
function partyLabel(naam: string, venue: string): string {
  const schoon = naam
    .replace(/closing\s*party/gi, ' ')
    // Leestekens die door het weghalen alleen zijn komen te staan.
    .replace(/\s*[.:;,\-–—]\s*$/g, '')
    .replace(/^\s*[.:;,\-–—]\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!schoon) return ''
  // Een label dat niets meer is dan de clubnaam voegt niets toe aan een rij
  // waarvan de clubkolom dat al zegt. Dat geldt ook voor een afkorting ervan:
  // "O Beach" naast "O Beach Ibiza".
  //
  // Maar niet andersom. "Ibiza Rocks Pool Party" begint óók met de clubnaam en
  // is wél een eigen avond — die regel viel er eerst uit. Alleen wat kórter of
  // gelijk is aan de clubnaam is een herhaling; wat langer is, voegt toe.
  const a = schoon.toLowerCase()
  const b = venue.toLowerCase()
  if (a === b || b.startsWith(a)) return ''
  return schoon
}

/** De informatiefste van de twee feedvelden, allebei schoongemaakt. */
function besteLabel(a: string, b: string, venue: string): string {
  const x = partyLabel(a, venue)
  const y = partyLabel(b, venue)
  return x.length >= y.length ? x : y
}

/**
 * Geprijsde avonden die een maand minstens moet hebben voor een eigen bedrag.
 *
 * Tien, hetzelfde getal als MIN_DATES in price-stats.ts, en om dezelfde reden:
 * daaronder is een mediaan één of twee avonden in de vermomming van een
 * statistiek. Aan het begin en het eind van het seizoen loopt de agenda daar
 * vanzelf doorheen — dan valt het bedrag weg en blijven de aantallen staan.
 */
const MIN_PRIJZEN = 10

export async function getSeasonStats(locale: string): Promise<SeasonStats | null> {
  const [venues, dates] = await Promise.all([getVenues(locale), getAllDates(locale)])
  if (!venues.length || !dates.length) return null

  const typeOf = new Map(venues.map(v => [v.slug, (v as any).type?.slug || '']))
  const nameOf = new Map(venues.map(v => [v.slug, v.name]))
  const logoOf = new Map(venues.map(v => [v.slug, (v as any).whitelogo || (v as any).picture || '']))
  const todayStr = ibizaToday()

  const nights = dates
    .map(d => ({
      slug: d.venueSlug || '',
      day: String(d.date || '').slice(0, 10),
      // Het eerste getal in het prijsveld is de entreeprijs; de bovenkant van
      // het bereik is meestal een VIP- of tafelproduct. Dezelfde keuze als
      // price-stats.ts maakt, uit dezelfde parser, zodat /ibiza-season en
      // /ibiza-prices niet elk een eigen bedrag voor dezelfde avond krijgen.
      prijs: priceNumbers((d as any).prices)[0] ?? null,
    }))
    .filter(x => x.slug && /^\d{4}-\d{2}-\d{2}$/.test(x.day) && typeOf.get(x.slug) === 'clubbing')

  if (nights.length === 0) return null

  const byVenue = new Map<string, string[]>()
  for (const n of nights) {
    const g = byVenue.get(n.slug)
    if (g) g.push(n.day)
    else byVenue.set(n.slug, [n.day])
  }

  // Latest closing first: someone asking "what is still open" wants the clubs
  // that are still running at the top, not an alphabetical list.
  const venueRows: VenueSeason[] = Array.from(byVenue.entries())
    .map(([slug, days]) => {
      const sorted = [...days].sort()
      return {
        slug,
        name: nameOf.get(slug) || slug,
        first: sorted[0],
        lastScheduled: sorted[sorted.length - 1],
        upcoming: sorted.filter(d => d >= todayStr).length,
        logo: logoOf.get(slug) || undefined,
      }
    })
    .sort((a, b) => b.lastScheduled.localeCompare(a.lastScheduled) || a.name.localeCompare(b.name))

  const monthMap = new Map<string, { clubs: Set<string>; nights: number; prijzen: number[] }>()
  for (const n of nights) {
    const m = n.day.slice(0, 7)
    const rec = monthMap.get(m) || { clubs: new Set<string>(), nights: 0, prijzen: [] as number[] }
    rec.clubs.add(n.slug)
    rec.nights += 1
    if (n.prijs !== null) rec.prijzen.push(n.prijs)
    monthMap.set(m, rec)
  }

  const allDays = nights.map(n => n.day).sort()

  /**
   * Closing parties, herkend aan de naam die de club er zelf aan geeft.
   *
   * "Closing party" is een merknaam van het seizoen en staat in alle vijf de
   * taalversies van de feed onvertaald in de eventnaam — de clubs kondigen hem
   * zo aan. Daarom is een naammatch hier stabiel, en het is ook de enige
   * ingang: de feed heeft geen veld dat een avond als slotavond markeert.
   *
   * Alleen toekomstige avonden. Een closing party van vorige week is geen
   * antwoord op "wanneer is de closing", en op een pagina die het seizoen
   * beschrijft is een verstreken datum tonen erger dan niets tonen.
   */
  const closings: ClosingParty[] = dates
    .filter(d => {
      const slug = d.venueSlug || ''
      if (!slug || typeOf.get(slug) !== 'clubbing') return false
      const day = String(d.date || '').slice(0, 10)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < todayStr) return false
      return /closing\s*party/i.test(`${d.eventName ?? ''} ${(d as any).name ?? ''}`)
    })
    .map(d => {
      const venueName = nameOf.get(d.venueSlug || '') || d.venueSlug || ''
      return {
        venueSlug: d.venueSlug || '',
        venueName,
        name: besteLabel(String((d as any).name || ''), String(d.eventName || ''), venueName),
        date: String(d.date).slice(0, 10),
        eventSlug: d.eventSlug || undefined,
      }
    })
    .filter(c => c.venueName)
    .sort((a, b) => a.date.localeCompare(b.date) || a.venueName.localeCompare(b.venueName))

  return {
    venues: venueRows,
    closings,
    months: Array.from(monthMap.entries())
      .map(([month, r]) => ({
        month,
        clubs: r.clubs.size,
        nights: r.nights,
        priced: r.prijzen.length,
        low: r.prijzen.length >= MIN_PRIJZEN ? Math.round(Math.min(...r.prijzen)) : null,
        median: r.prijzen.length >= MIN_PRIJZEN ? Math.round(median(r.prijzen)) : null,
      }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    from: allDays[0],
    to: allDays[allDays.length - 1],
    openNow: venueRows.filter(v => v.upcoming > 0).length,
    todayStr,
  }
}
