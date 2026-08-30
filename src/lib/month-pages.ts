import { getAllDates, getVenues, getDataLastUpdated } from '@/lib/clubtickets'
import { eventBasePath } from '@/lib/event-path'
import type { Locale } from '@/lib/seo'

/**
 * "Ibiza in <month>" landing pages, generated from the live ClubTickets feed.
 *
 * Why these exist: travellers plan by month ("what's on in Ibiza in September"),
 * and the site had no page answering that — the calendar answers "what's on
 * tonight", which is a different question. Because every fact on the page is
 * derived from the feed, the pages restate themselves on each sync instead of
 * going stale, which matters disproportionately for Perplexity: it weights
 * recency more heavily than any other engine.
 *
 * Two deliberate constraints:
 *
 *  1. ONLY months that actually have a programme get a page. Generating all
 *     twelve would leave two-thirds of them empty out of season — thin pages
 *     that drag on domain quality, which is the exact failure mode a neglected
 *     blog produces. MIN_EVENTS is the floor.
 *  2. Nothing is asserted that is not in the data. No invented weather, no
 *     "average temperature", no claims about which parties are best. Counts,
 *     venue names, artist names and dates only.
 *
 * URLs use stable English month slugs with no year (`/ibiza-in/september`), so
 * the same URL keeps accruing authority season after season rather than
 * fragmenting into a new page every year.
 */

/** A month needs at least this many upcoming events to be worth a page. */
const MIN_EVENTS = 15

export const MONTH_SLUGS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
] as const

export type MonthSlug = (typeof MONTH_SLUGS)[number]

const LOCALE_TAG: Record<Locale, string> = {
  nl: 'nl-NL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR',
}

/**
 * Month name in the target language, capitalised only where the language
 * actually capitalises it. English and German do; Dutch, Spanish and French
 * write month names lowercase, so "Ibiza in September" is a spelling mistake in
 * three of our five locales when the word sits mid-sentence.
 */
const CAPITALISES_MONTHS = new Set<Locale>(['en', 'de'])

export function monthName(slug: MonthSlug, locale: Locale): string {
  const idx = MONTH_SLUGS.indexOf(slug)
  const d = new Date(Date.UTC(2026, idx, 1))
  const s = d.toLocaleDateString(LOCALE_TAG[locale] || 'en-GB', { month: 'long', timeZone: 'UTC' })
  return CAPITALISES_MONTHS.has(locale) ? s.charAt(0).toUpperCase() + s.slice(1) : s.toLowerCase()
}

export interface MonthVenue {
  slug: string
  name: string
  basePath: string
  eventCount: number
}

export interface MonthEvent {
  id: string
  name: string
  date: string
  path: string
  venueName: string
  price: number
}

export interface MonthData {
  slug: MonthSlug
  /** The calendar year this month's programme falls in. */
  year: number
  eventCount: number
  venues: MonthVenue[]
  /** Distinct artist/line-up names appearing that month, most frequent first. */
  artists: string[]
  events: MonthEvent[]
  lastUpdated?: Date
}

/**
 * Build the data for one month, or null if it has too little to justify a page.
 * `slug` has no year, so we resolve it against the feed: whichever upcoming
 * occurrence of that month actually has a programme.
 */
export async function getMonthData(slug: MonthSlug, locale: string): Promise<MonthData | null> {
  const monthIdx = MONTH_SLUGS.indexOf(slug)
  if (monthIdx < 0) return null

  const [dates, venues, lastUpdated] = await Promise.all([
    getAllDates(locale),
    getVenues(locale),
    getDataLastUpdated(locale),
  ])

  // getAllDates already drops past dates, so anything left is upcoming.
  const inMonth = dates.filter((d) => {
    if (!d.date || !/^\d{4}-\d{2}-\d{2}/.test(d.date)) return false
    return Number(d.date.slice(5, 7)) === monthIdx + 1
  })
  if (inMonth.length < MIN_EVENTS) return null

  const year = Number(inMonth[0].date.slice(0, 4))
  const typeBySlug = new Map<string, string>()
  const nameBySlug = new Map<string, string>()
  for (const v of venues) {
    if (!v.slug) continue
    typeBySlug.set(v.slug, eventBasePath((v as any).type?.slug))
    nameBySlug.set(v.slug, v.name)
  }

  const venueCounts = new Map<string, number>()
  const artistCounts = new Map<string, number>()
  const events: MonthEvent[] = []

  for (const d of inMonth) {
    const vs = d.venueSlug || ''
    if (vs) venueCounts.set(vs, (venueCounts.get(vs) || 0) + 1)

    // lineUp is a free-text list of names; split conservatively and keep it as
    // written rather than trying to normalise artist names we cannot verify.
    for (const raw of String(d.lineUp || '').split(/[,•|]/)) {
      const n = raw.trim()
      if (n.length > 2 && n.length < 40) artistCounts.set(n, (artistCounts.get(n) || 0) + 1)
    }

    if (vs && d.eventSlug) {
      const m = String(d.prices || '').match(/\d+([.,]\d+)?/)
      events.push({
        id: `${d.id}-${d.eventSlug}`,
        name: d.eventName || d.name || '',
        date: d.date,
        path: `${locale}/${typeBySlug.get(vs) || 'club-tickets'}/${vs}/${d.eventSlug}`,
        venueName: d.venueName || nameBySlug.get(vs) || '',
        price: m ? parseFloat(m[0].replace(',', '.')) : 0,
      })
    }
  }

  const monthVenues: MonthVenue[] = Array.from(venueCounts.entries())
    .map(([slug, eventCount]) => ({
      slug,
      name: nameBySlug.get(slug) || slug,
      basePath: typeBySlug.get(slug) || 'club-tickets',
      eventCount,
    }))
    .sort((a, b) => b.eventCount - a.eventCount)

  const artists = Array.from(artistCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([n]) => n)

  return {
    slug,
    year,
    eventCount: inMonth.length,
    venues: monthVenues,
    artists,
    events: events.sort((a, b) => a.date.localeCompare(b.date)),
    lastUpdated,
  }
}

/** Month slugs that currently have enough programme to warrant a page. */
export async function publishableMonths(locale = 'nl'): Promise<MonthSlug[]> {
  const dates = await getAllDates(locale)
  const counts = new Map<number, number>()
  for (const d of dates) {
    if (!d.date || !/^\d{4}-\d{2}-\d{2}/.test(d.date)) continue
    const m = Number(d.date.slice(5, 7))
    counts.set(m, (counts.get(m) || 0) + 1)
  }
  return MONTH_SLUGS.filter((_, i) => (counts.get(i + 1) || 0) >= MIN_EVENTS)
}
