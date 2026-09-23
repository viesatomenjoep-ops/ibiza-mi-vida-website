/**
 * Facts for the American-traveler cluster (/en/ibiza-for-americans and its
 * three spokes). One file, because every number in here ages and has to be
 * re-checked in one place rather than hunted down across four pages.
 *
 * Every entry carries an `asOf` or `announced` date and the copy prints it.
 * A US reader planning a 2027 trip will read these pages for a year; a fact
 * stated without its date reads as current when it may not be.
 *
 * ── Rules ──────────────────────────────────────────────────────────────────
 * - A nonstop route goes in US_NONSTOP only once an airline has announced it
 *   by name, with a start date. Status says whether it is on sale. Rumors do
 *   not go in; a page that says "United flies nonstop" while United does not
 *   is the kind of confident error an answer engine quotes verbatim.
 * - Dollar amounts are ESTIMATES from a published EUR/USD rate, shown with
 *   the rate and its date, never as a price we charge. Cards settle in euros.
 * - Government rules (ETIAS, EES, IDP) carry the date they were last checked.
 *   When ETIAS goes live, flip `ETIAS.live` and set `ETIAS.since`; the copy
 *   rewrites itself.
 */

export interface NonstopRoute {
  airline: string
  /** IATA of the US airport, plus the city as travelers say it. */
  from: { iata: string; city: string }
  /** ISO date of the first scheduled flight. */
  starts: string
  /** e.g. 'four times a week' — words, as the airline announced it. */
  frequency: string
  aircraft?: string
  /**
   * announced = press release, not yet bookable or pending approval;
   * on-sale   = bookable on the airline's site;
   * flying    = operating.
   */
  status: 'announced' | 'on-sale' | 'flying'
  /** ISO date the status above was last verified. */
  asOf: string
  /** Anything the reader should know, one sentence. */
  note?: string
}

/**
 * Nonstop US–Ibiza flights. Announced by United on 26 August 2026 (Newark to
 * Ibiza from 31 May 2027, four weekly, Airbus A321XLR), reported by Ibiza
 * Spotlight, DJ Mag, Euro Weekly News and others the same week; United's own
 * release says the route is subject to government approval. Verify on
 * united.com before changing `status`.
 */
export const US_NONSTOP: NonstopRoute[] = [
  {
    airline: 'United Airlines',
    from: { iata: 'EWR', city: 'Newark / New York' },
    starts: '2027-05-31',
    frequency: 'four times a week',
    aircraft: 'Airbus A321XLR',
    status: 'announced',
    asOf: '2026-09-15',
    note: 'Announced 26 August 2026 as a seasonal summer route, subject to US and Spanish government approval. The first nonstop between the United States and Ibiza.',
  },
]

/** Whether any nonstop is bookable or flying — the copy branches on this. */
export const nonstopBookable = () => US_NONSTOP.some((r) => r.status !== 'announced')

/**
 * The US gateways with a one-stop connection that works in one calendar day.
 * Hubs listed are the European airports with a short onward hop to IBZ; the
 * airlines are the ones that operate the transatlantic leg in summer, named
 * so a reader knows where to look, not as a schedule promise.
 */
export interface Gateway {
  iata: string
  city: string
  /** Total door-to-door hours, one connection, typical summer schedule. */
  hours: string
  via: string
  carriers: string
}

export const GATEWAYS: Gateway[] = [
  { iata: 'JFK', city: 'New York', hours: '11–13', via: 'Madrid or Barcelona', carriers: 'Iberia, American, Delta, Air Europa, Level' },
  { iata: 'EWR', city: 'Newark', hours: '11–13', via: 'Madrid, Barcelona or Lisbon', carriers: 'United, TAP' },
  { iata: 'BOS', city: 'Boston', hours: '11–13', via: 'Madrid or Barcelona', carriers: 'Iberia, Delta, Level' },
  { iata: 'MIA', city: 'Miami', hours: '12–14', via: 'Madrid', carriers: 'Iberia, American, Air Europa' },
  { iata: 'ATL', city: 'Atlanta', hours: '12–14', via: 'Madrid or Barcelona', carriers: 'Delta' },
  { iata: 'IAD', city: 'Washington', hours: '12–14', via: 'Madrid or Barcelona', carriers: 'Iberia, United' },
  { iata: 'ORD', city: 'Chicago', hours: '13–15', via: 'Madrid or Barcelona', carriers: 'Iberia, American, United' },
  { iata: 'DFW', city: 'Dallas', hours: '13–15', via: 'Madrid', carriers: 'Iberia, American' },
  { iata: 'LAX', city: 'Los Angeles', hours: '15–18', via: 'Madrid or Barcelona', carriers: 'Iberia, Level, Delta' },
  { iata: 'SFO', city: 'San Francisco', hours: '15–18', via: 'Madrid or Barcelona', carriers: 'Iberia, United, Level' },
]

/**
 * ETIAS — the EU's pre-travel authorization for visa-exempt visitors, US
 * passports included. As of the date below it is NOT in force: the EU removed
 * its "last quarter of 2026" target in July 2026 and points to 2027, with a
 * transition period in which it is recommended before it becomes mandatory.
 * Fee and validity are from the EU's published rules.
 */
export const ETIAS = {
  live: false,
  /** Set when it starts, ISO date. */
  since: null as string | null,
  feeEur: 20,
  validityYears: 3,
  asOf: '2026-09-15',
  officialUrl: 'https://travel-europe.europa.eu/etias_en',
}

/**
 * Entry/Exit System — biometric registration (fingerprints and photo) at the
 * first Schengen border, replacing the passport stamp. Rolled out from
 * October 2025. The practical effect for a connecting passenger is a longer
 * passport-control queue in Madrid or Barcelona on the first trip.
 */
export const EES = { live: true, asOf: '2026-09-15' }

/**
 * EUR→USD reference rate for the estimates. Fallback only — getEurUsd()
 * fetches the ECB-based rate daily and falls back to this when the fetch
 * fails, printing whichever date applies. Update the fallback when you touch
 * this file; a fallback two years old is a wrong estimate with a date on it.
 */
export const EUR_USD_FALLBACK = { rate: 1.17, asOf: '2026-09-15', source: 'ECB reference rate (fallback)' }

export interface FxRate {
  rate: number
  asOf: string
  source: string
}

/**
 * Daily EUR/USD from frankfurter.app (ECB reference rates, no key). Times out
 * after three seconds so a slow third party can never hold the page render,
 * and logs when the live rate is unavailable so the fallback does not go
 * unnoticed. Cached by Next for a day.
 */
export async function getEurUsd(): Promise<FxRate> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD', {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { date?: string; rates?: { USD?: number } }
    const rate = data?.rates?.USD
    if (typeof rate === 'number' && rate > 0.5 && rate < 2 && data.date) {
      return { rate, asOf: data.date, source: 'ECB reference rate via frankfurter.app' }
    }
    throw new Error('unexpected payload')
  } catch (err) {
    console.warn('[us-travel] live EUR/USD unavailable, using fallback:', (err as Error)?.message)
    return EUR_USD_FALLBACK
  }
}

/**
 * "€363 (about $425)". Rounds the dollar figure so it reads as the estimate
 * it is: to the nearest $5 under $500, nearest $10 under $5,000, nearest
 * $100 above. A dollar amount printed to the cent claims a precision the
 * exchange rate does not have.
 */
export function usd(eur: number, fx: FxRate): string {
  const raw = eur * fx.rate
  const step = raw < 500 ? 5 : raw < 5000 ? 10 : 100
  const rounded = Math.round(raw / step) * step
  return `$${rounded.toLocaleString('en-US')}`
}

export function eurUsd(eur: number, fx: FxRate): string {
  return `€${eur.toLocaleString('en-US')} (about ${usd(eur, fx)})`
}

/** Long US-style date from ISO: "May 31, 2027". */
export function usDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}
