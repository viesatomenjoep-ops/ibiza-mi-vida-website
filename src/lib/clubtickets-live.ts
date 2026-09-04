/**
 * Live prices, availability and line-up for a single ClubTickets event.
 *
 * The agenda JSON in `src/data` is refreshed once a night (05:20 UTC, the
 * `price-snapshot.yml` workflow). On the event detail page — the commercial
 * money page of the ticket route — that is too old: a tier sells out, a price
 * moves, a date is added between two syncs. This module fetches the volatile
 * fields live and the page overlays them on the static JSON.
 *
 * Rules, the same as `yacht-broker.ts`:
 *  - one source, server-side, cached 15 minutes;
 *  - any failure returns `null` — never an exception into the page, never half
 *    the data. The caller then renders the static JSON stand as it does today.
 *  - only volatile, low-markup fields. `description` / `requirements` stay from
 *    the JSON: the API ships them with injected CSS/JS that only the sync
 *    script's `deepCleanHtml` handles.
 *
 * Not wrapped in `React.cache`, matching `getLiveFleet` — Next already memoises
 * identical `fetch` calls within a render, and the post-fetch mapping is cheap.
 */
import { BASE_URL } from './clubtickets'
import { stripHtml } from './html-utils'

const REVALIDATE_SECONDS = 900 // 15 min — matches the boats page
const TIMEOUT_MS = 3500 // a slow partner must not hold up the revalidation render

/**
 * Why a log and not silence: the live layer falls away without anything looking
 * broken — the page renders on with the JSON stand. This also goes to Sentry so
 * a sustained outage is visible without reading Vercel logs; `check:event` is
 * the scheduled counterpart. The Sentry call is fire-and-forget and can never
 * throw into the fallback path.
 */
function warn(reason: string): void {
  console.warn(`[clubtickets-live] live event not used: ${reason}`)
  void import('@sentry/nextjs')
    .then((Sentry) => Sentry.captureMessage(`[clubtickets-live] ${reason}`, 'warning'))
    .catch(() => {})
}

export interface LiveEventDate {
  id: number
  /** YYYY-MM-DD. */
  date: string
  /** Plain text; the API ships this as `<p>…</p>`. */
  lineUp: string
  /** e.g. "85 € - 250 €"; `""` when every tier is sold out. */
  prices: string
  /** Cheapest in-stock tier; `null` when the date is sold out. */
  lowestAvailablePrice: number | null
  affLink: string
}

export interface LiveEvent {
  id: number
  startAt?: string
  endAt?: string
  dates: LiveEventDate[]
  /** Every date sold out. */
  soldOut: boolean
}

interface ApiResponse {
  data?: {
    id?: number
    startAt?: string
    endAt?: string
    dates?: unknown[]
  }
}

/**
 * Fetch the live event. `null` on any failure — the caller shows the static
 * JSON stand and nothing "live". Never throws, never returns partial data.
 */
export async function getLiveEvent(
  venueId: number,
  eventId: number,
  locale: string,
): Promise<LiveEvent | null> {
  if (!venueId || !eventId) return null

  try {
    const res = await fetch(`${BASE_URL}/venue/${venueId}/event/${eventId}?locale=${locale}`, {
      headers: {
        accept: 'application/json',
        'user-agent': 'ibizamivida.com partner integration',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS, tags: [`ct-event-${eventId}`] },
    })

    if (!res.ok) {
      warn(`HTTP ${res.status}`)
      return null
    }

    const json = (await res.json()) as ApiResponse | null
    const d = json?.data
    if (!d?.id || !Array.isArray(d.dates)) {
      warn('response without data.dates')
      return null
    }

    const dates: LiveEventDate[] = d.dates
      .map((raw): LiveEventDate | null => {
        const x = raw as Record<string, unknown>
        if (!x || typeof x.date !== 'string') return null
        return {
          id: Number(x.id),
          date: x.date.slice(0, 10),
          lineUp: stripHtml(typeof x.lineUp === 'string' ? x.lineUp : ''),
          prices: typeof x.prices === 'string' ? x.prices : '',
          lowestAvailablePrice:
            typeof x.lowestAvailablePrice === 'number' ? x.lowestAvailablePrice : null,
          affLink: typeof x.affLink === 'string' ? x.affLink : '',
        }
      })
      .filter((x): x is LiveEventDate => x !== null)

    return {
      id: Number(d.id),
      startAt: typeof d.startAt === 'string' && d.startAt ? d.startAt : undefined,
      endAt: typeof d.endAt === 'string' && d.endAt ? d.endAt : undefined,
      dates,
      soldOut:
        dates.length > 0 && dates.every((x) => x.prices === '' && x.lowestAvailablePrice == null),
    }
  } catch (e) {
    warn(e instanceof Error ? e.message : String(e))
    return null
  }
}
