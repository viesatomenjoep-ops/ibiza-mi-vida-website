import type { CTEventDate } from './clubtickets'
import type { LiveEvent } from './clubtickets-live'

/**
 * A nightly-JSON date row with the live overlay applied.
 *
 * `live` records whether the live feed carried this date, so the UI can show a
 * freshness cue. `lowestAvailablePrice` and `soldOut` are always present —
 * `null` / `false` when there is nothing live to say.
 */
export interface MergedEventDate extends CTEventDate {
  lowestAvailablePrice: number | null
  soldOut: boolean
  live: boolean
}

/** ClubTickets' sold-out contract: no in-stock tier left. */
const isSoldOut = (prices: string, low: number | null): boolean => prices === '' && low == null

const byDate = (a: MergedEventDate, b: MergedEventDate): number =>
  (a.date || '').localeCompare(b.date || '')

/**
 * Overlay the live event feed onto the nightly JSON date rows.
 *
 * The JSON is the source of truth for structure — which dates exist, their ids,
 * the venue. `clubtickets-live.ts` supplies the volatile fields: price,
 * sold-out state, line-up, per-date affiliate link.
 *
 *  - date in both      → overlay prices / lowestAvailablePrice / lineUp / affLink
 *  - date in JSON only  → passed through untouched, `live: false`
 *  - date in live only  → appended when it is `today` or later (a date that
 *                         went on sale since the last sync); older ones ignored
 *  - `live === null`    → every row passes through with `live: false`
 *
 * Pure — never mutates `staticDates`. `today` is an Ibiza-day string
 * (YYYY-MM-DD) from `ibizaToday()`.
 */
export function mergeEventDates(
  staticDates: CTEventDate[],
  live: LiveEvent | null,
  today: string,
): MergedEventDate[] {
  const passthrough = (d: CTEventDate): MergedEventDate => ({
    ...d,
    lowestAvailablePrice: d.lowestAvailablePrice ?? null,
    soldOut: false,
    live: false,
  })

  if (!live) return staticDates.map(passthrough).sort(byDate)

  const liveByDate = new Map(live.dates.map((l) => [l.date, l]))

  const merged: MergedEventDate[] = staticDates.map((d) => {
    const l = liveByDate.get((d.date || '').slice(0, 10))
    if (!l) return passthrough(d)
    return {
      ...passthrough(d),
      prices: l.prices,
      lineUp: l.lineUp || d.lineUp,
      affLink: l.affLink || d.affLink,
      lowestAvailablePrice: l.lowestAvailablePrice,
      soldOut: isSoldOut(l.prices, l.lowestAvailablePrice),
      live: true,
    }
  })

  const known = new Set(staticDates.map((d) => (d.date || '').slice(0, 10)))
  for (const l of live.dates) {
    if (known.has(l.date) || l.date < today) continue
    merged.push({
      id: l.id,
      name: '',
      date: l.date,
      lineUp: l.lineUp,
      prices: l.prices,
      affLink: l.affLink,
      lowestAvailablePrice: l.lowestAvailablePrice,
      soldOut: isSoldOut(l.prices, l.lowestAvailablePrice),
      live: true,
    })
  }

  return merged.sort(byDate)
}
