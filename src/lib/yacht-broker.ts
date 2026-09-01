/**
 * Live beschikbaarheid en prijzen van The Yacht Broker (affiliatepartner).
 *
 * ── Waarom dit mag en hoe het hoort ───────────────────────────────────────
 * theyachtbroker.club is de gecombineerde partnerkalender van onze
 * vlootleverancier: een open JSON-API zonder inlog, gebouwd zodat agenten de
 * actuele stand kunnen tonen. Wij zijn zo'n partner — de vlootdossiers in
 * src/data/fleet.ts komen rechtstreeks van hen. Dit is dus geen scrapen tegen
 * de zin van een site in, maar het gebruiken van een feed die daarvoor
 * bestaat. Toch gedragen we ons als gast:
 *  - één opgevraagde bron, serverside, met een cache van 15 minuten — de
 *    bezoekersaantallen van onze site raken hun server niet;
 *  - valt de feed uit, dan verdwijnt de live laag en blijven de statische
 *    prijsbanden staan. Er wordt NOOIT beschikbaarheid verzonnen of een oude
 *    stand als actueel gepresenteerd: elke consument krijgt `generatedAt` mee
 *    en de UI toont die tijd.
 *
 * ── De prijslogica is van hen overgenomen, niet bedacht ───────────────────
 * Hun kalender rekent zo, letterlijk uit hun frontend:
 *  1. boot met `priceBands`: de band waar de mm-dd van de datum in valt geeft
 *     de exacte dagprijs;
 *  2. boot met `price` (low/mid/high/top): de prijs is `price[season]`, waarbij
 *     de API het seizoen per opgevraagde maand zelf meegeeft.
 * Wij doen exact hetzelfde (zie priceForDate), zodat een prijs bij ons nooit
 * afwijkt van wat hun eigen kalender toont. Een dag zonder vermelding in
 * `days` is beschikbaar; 'booked' en 'option' staan er expliciet in.
 */

const BASE = 'https://theyachtbroker.club'
const REVALIDATE_SECONDS = 900 // 15 min — beschikbaarheid verandert per boeking, niet per seconde.

export type DayStatus = 'booked' | 'option'
export type Season = 'low' | 'mid' | 'high' | 'top'

interface ApiBoat {
  partner: string
  boat: string
  model: string
  port: string
  pax: number
  price: Partial<Record<Season, number>> | null
  priceBands: { from: string; to: string; price: number }[] | null
  days: Record<string, DayStatus>
}

interface ApiResponse {
  generatedAt: string
  rangeStart: string
  rangeEnd: string
  season: Season
  boats: ApiBoat[]
}

export interface LiveBoat {
  price: Partial<Record<Season, number>> | null
  priceBands: { from: string; to: string; price: number }[] | null
  days: Record<string, DayStatus>
}

export interface LiveFleet {
  generatedAt: string
  rangeStart: string
  rangeEnd: string
  season: Season
  /** brokerKey (genormaliseerde bootnaam) → live gegevens. */
  boats: Record<string, LiveBoat>
}

/** Zelfde normalisatie als bij het genereren van fleet.ts — moet dat blijven. */
function norm(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Haalt de live vloot op. `null` bij elke storing — nooit een exception naar
 * de pagina, nooit halve data. De aanroepende laag toont dan simpelweg geen
 * live informatie, wat de eerlijke weergave van "wij weten het nu niet" is.
 */
export async function getLiveFleet(): Promise<LiveFleet | null> {
  try {
    // Twee maanden vooruit: genoeg voor "kies een datum" op een charterpagina;
    // wie verder vooruit wil, komt bij Simon uit en dat is precies goed.
    const res = await fetch(`${BASE}/api/availability?months=2&start=0`, {
      headers: { 'user-agent': 'ibizamivida.com partner integration' },
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    const data = (await res.json()) as ApiResponse
    if (!data?.boats?.length || !data.generatedAt) return null

    const boats: Record<string, LiveBoat> = {}
    for (const b of data.boats) {
      boats[norm(b.boat)] = {
        price: b.price ?? null,
        priceBands: b.priceBands ?? null,
        days: b.days ?? {},
      }
    }
    return {
      generatedAt: data.generatedAt,
      rangeStart: data.rangeStart,
      rangeEnd: data.rangeEnd,
      season: data.season,
      boats,
    }
  } catch {
    return null
  }
}

/**
 * Dagprijs voor een datum, volgens de rekenregels van de broker zelf.
 * `null` wanneer er voor die datum niets te zeggen valt — dan toont de UI de
 * statische banden en niets "live".
 */
export function priceForDate(b: LiveBoat, iso: string, season: Season): number | null {
  if (b.priceBands?.length) {
    const mmdd = iso.slice(5, 10)
    for (const band of b.priceBands) {
      if (mmdd >= band.from && mmdd <= band.to) return band.price
    }
    return null
  }
  return b.price?.[season] ?? null
}

/** Beschikbaarheid voor een datum. Geen vermelding = beschikbaar. */
export function statusForDate(b: LiveBoat, iso: string): 'free' | DayStatus {
  return b.days[iso] ?? 'free'
}
