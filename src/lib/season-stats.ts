import { getVenues, getAllDates } from '@/lib/clubtickets'
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
}

export interface SeasonStats {
  venues: VenueSeason[]
  months: MonthCount[]
  /** Earliest and latest club night anywhere in the agenda. */
  from: string
  to: string
  /** Clubs with at least one night still to come. */
  openNow: number
  todayStr: string
}

export async function getSeasonStats(locale: string): Promise<SeasonStats | null> {
  const [venues, dates] = await Promise.all([getVenues(locale), getAllDates(locale)])
  if (!venues.length || !dates.length) return null

  const typeOf = new Map(venues.map(v => [v.slug, (v as any).type?.slug || '']))
  const nameOf = new Map(venues.map(v => [v.slug, v.name]))
  const logoOf = new Map(venues.map(v => [v.slug, (v as any).whitelogo || (v as any).picture || '']))
  const todayStr = ibizaToday()

  const nights = dates
    .map(d => ({ slug: d.venueSlug || '', day: String(d.date || '').slice(0, 10) }))
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

  const monthMap = new Map<string, { clubs: Set<string>; nights: number }>()
  for (const n of nights) {
    const m = n.day.slice(0, 7)
    const rec = monthMap.get(m) || { clubs: new Set<string>(), nights: 0 }
    rec.clubs.add(n.slug)
    rec.nights += 1
    monthMap.set(m, rec)
  }

  const allDays = nights.map(n => n.day).sort()

  return {
    venues: venueRows,
    months: Array.from(monthMap.entries())
      .map(([month, r]) => ({ month, clubs: r.clubs.size, nights: r.nights }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    from: allDays[0],
    to: allDays[allDays.length - 1],
    openNow: venueRows.filter(v => v.upcoming > 0).length,
    todayStr,
  }
}
