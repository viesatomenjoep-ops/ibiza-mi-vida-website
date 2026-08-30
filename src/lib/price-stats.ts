import { getVenues, getAllDates } from '@/lib/clubtickets'

/**
 * Price statistics computed from the live ClubTickets feed.
 *
 * ── Why this file exists ──────────────────────────────────────────────────
 * "What does a night out in Ibiza cost?" is asked constantly and answered
 * almost entirely by guesswork — blog posts quoting a number someone read
 * somewhere in 2019. We hold roughly 2,700 dated events with advertised prices
 * across every major venue on the island, so we can answer it by counting
 * instead of guessing. That is the one thing on this site nobody else can
 * copy, and an answer engine has no reason to cite a page that repeats what
 * ten other pages already say.
 *
 * ── What the numbers actually are ─────────────────────────────────────────
 * The feed writes prices as advertised ranges: "30 €", "40 € - 50 €",
 * "125 € - 500 €". The low end is the cheapest ticket on sale for that date,
 * the high end is usually a VIP or table product. So:
 *
 *   • `low`  = cheapest advertised ticket for that date
 *   • `high` = most expensive advertised ticket for that date
 *
 * Everything reported as "entry price" uses the LOW end, because that is what
 * a visitor asking "what does it cost to get in" means. Any page rendering
 * this must say so — a median built from low ends, presented as "the price of
 * a night out", would be a misleading number dressed up as a measured one.
 *
 * ── What these numbers are NOT ────────────────────────────────────────────
 * Ticket prices only. Not drinks, not tables, not transport, not the ferry
 * home. We hold no data on bar prices and this module must never grow a
 * function that estimates them: a plausible invented figure is worse than no
 * figure, because it will be quoted back as fact.
 *
 * Median rather than mean throughout. A handful of €1,000 table products would
 * drag an average somewhere no visitor recognises.
 */

export interface VenuePrice {
  slug: string
  name: string
  /** Cheapest advertised ticket seen across all dates. */
  min: number
  /** Median of the cheapest advertised ticket, per date. */
  median: number
  /** Most expensive advertised ticket seen (usually VIP/table). */
  max: number
  /** Number of dated events this is computed from. */
  n: number
}

export interface CategoryPrice {
  key: 'clubbing' | 'boat' | 'formentera-day-trip' | 'activities'
  min: number
  median: number
  n: number
}

export interface PriceStats {
  /** Median cheapest club entry ticket across every dated club night. */
  clubMedian: number
  clubMin: number
  /**
   * The dearest ENTRY ticket, i.e. the largest low-end price — not the largest
   * price in the dataset.
   *
   * This was originally the max of the high ends and produced the sentence
   * "club entry costs €15 to €1000". The €1000 is a table product for a group,
   * not the price of getting in, so the sentence was a misleading number
   * wearing a measured number's clothes — exactly what the header of this file
   * warns against. High-end prices still appear, but only in the per-venue
   * Range column where the label and the method note say what they are.
   */
  clubMax: number
  /** Interquartile range: half of all club nights sit between these. */
  clubQ1: number
  clubQ3: number
  /** Dated club events behind the figures above. */
  clubN: number
  /** Clubs with enough dates to report individually. */
  venues: VenuePrice[]
  /** Venues dropped for having too few dates to be meaningful. */
  venuesOmitted: number
  categories: CategoryPrice[]
  /** ISO date of the earliest and latest event in the dataset. */
  from: string
  to: string
  /** Total dated events with a price. */
  total: number
}

/** Minimum dated events before a venue gets its own row. Below this a median
 *  is just one or two nights wearing a statistic's clothing. */
const MIN_DATES = 10

function priceNumbers(raw: unknown): number[] {
  const m = String(raw ?? '').match(/\d+(?:[.,]\d+)?/g)
  if (!m) return []
  return m.map(s => parseFloat(s.replace(',', '.'))).filter(n => n > 0)
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0
  const s = [...xs].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

/** Nearest-rank quantile. Fine at these sample sizes and easy to explain. */
function quantile(xs: number[], q: number): number {
  if (xs.length === 0) return 0
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.min(s.length - 1, Math.max(0, Math.ceil(q * s.length) - 1))]
}

export async function getPriceStats(locale: string): Promise<PriceStats | null> {
  const [venues, dates] = await Promise.all([getVenues(locale), getAllDates(locale)])
  if (!venues.length || !dates.length) return null

  const typeOf = new Map(venues.map(v => [v.slug, (v as any).type?.slug || '']))
  const nameOf = new Map(venues.map(v => [v.slug, v.name]))

  const priced = dates
    .map(d => ({ d, p: priceNumbers(d.prices) }))
    .filter(x => x.p.length > 0)

  if (priced.length === 0) return null

  const days = priced.map(x => String(x.d.date || '').slice(0, 10)).filter(Boolean).sort()

  const clubs = priced.filter(x => typeOf.get(x.d.venueSlug || '') === 'clubbing')
  const clubLows = clubs.map(x => x.p[0])

  // Per-venue, clubs only. Ordered by median entry, most expensive first —
  // that is the order someone comparing venues actually wants to read.
  const byVenue = new Map<string, number[]>()
  const byVenueHigh = new Map<string, number[]>()
  for (const x of clubs) {
    const k = x.d.venueSlug || ''
    if (!k) continue
    ;(byVenue.get(k) ?? byVenue.set(k, []).get(k)!).push(x.p[0])
    ;(byVenueHigh.get(k) ?? byVenueHigh.set(k, []).get(k)!).push(x.p[x.p.length - 1])
  }

  const all = Array.from(byVenue.entries())
  const venueRows: VenuePrice[] = all
    .filter(([, v]) => v.length >= MIN_DATES)
    .map(([slug, lows]) => ({
      slug,
      name: nameOf.get(slug) || slug,
      min: Math.round(Math.min(...lows)),
      median: Math.round(median(lows)),
      max: Math.round(Math.max(...(byVenueHigh.get(slug) || lows))),
      n: lows.length,
    }))
    .sort((a, b) => b.median - a.median || a.name.localeCompare(b.name))

  const catOf = (key: CategoryPrice['key']): CategoryPrice | null => {
    const lows = priced.filter(x => typeOf.get(x.d.venueSlug || '') === key).map(x => x.p[0])
    if (lows.length < MIN_DATES) return null
    return { key, min: Math.round(Math.min(...lows)), median: Math.round(median(lows)), n: lows.length }
  }

  return {
    clubMedian: Math.round(median(clubLows)),
    clubMin: Math.round(Math.min(...clubLows)),
    clubMax: Math.round(Math.max(...clubLows)),
    clubQ1: Math.round(quantile(clubLows, 0.25)),
    clubQ3: Math.round(quantile(clubLows, 0.75)),
    clubN: clubs.length,
    venues: venueRows,
    venuesOmitted: all.length - venueRows.length,
    categories: (['clubbing', 'boat', 'formentera-day-trip', 'activities'] as const)
      .map(catOf)
      .filter((c): c is CategoryPrice => c !== null),
    from: days[0] || '',
    to: days[days.length - 1] || '',
    total: priced.length,
  }
}
