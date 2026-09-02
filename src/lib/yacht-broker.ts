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

// www-variant, zoals de partner hem zelf aanlevert. Getest: met en zonder www
// leveren byte-identieke JSON (58340 bytes), maar www is de canonieke host en
// scheelt een mogelijke redirect-hop op elke aanroep.
const BASE = 'https://www.theyachtbroker.club'
const REVALIDATE_SECONDS = 900 // 15 min — beschikbaarheid verandert per boeking, niet per seconde.
const TIMEOUT_MS = 3500 // zie getLiveFleet: een trage partner mag de pagina niet ophouden.

/**
 * Waarom een log en niet stilte: de live laag valt weg zónder dat er iets
 * kapot lijkt — de pagina rendert gewoon door met de statische banden. Precies
 * daarom merkte niemand het als de koppeling eruit lag. Deze regel staat in de
 * Vercel-logs; `npm run check:fleet` is de handmatige tegenhanger.
 */
function waarschuw(reden: string): void {
  console.warn(`[yacht-broker] live feed niet gebruikt: ${reden}`)
}

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
    // months=1 — dit is de aanroep die de partner voert. Hier stond months=2
    // met een redenering over een breder venster voor de datumkiezer; dat is
    // niet aan ons om te kiezen. Wij zijn te gast op deze feed en volgen de
    // aanroep die de broker zelf gebruikt, ook als dat een korter venster
    // oplevert. Wie verder vooruit wil plannen komt bij Simon uit.
    //
    // Het venster staat nergens hardgecodeerd: de UI leest `rangeStart` en
    // `rangeEnd` uit het antwoord zelf (de datumkiezer begrenst daarop, en
    // `dateInRange` in FleetShowcase bepaalt er de live regel mee). Een korter
    // venster past zichzelf dus aan — er is geen tweede plek om bij te werken.
    // TIMEOUT is niet optioneel meer. De charterpagina rendert deze fetch
    // server-side, dus een partner die blijft hangen hangt de paginarender
    // mee — en `fetch` heeft uit zichzelf geen deadline. Na TIMEOUT_MS breken
    // we af en valt de live laag weg; de statische prijsbanden staan er dan
    // gewoon. Een pagina zonder live regel is oneindig veel beter dan een
    // pagina die niet komt.
    const res = await fetch(`${BASE}/api/availability?months=1&start=0`, {
      headers: {
        'user-agent': 'ibizamivida.com partner integration',
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) {
      waarschuw(`HTTP ${res.status}`)
      return null
    }
    const data = (await res.json()) as ApiResponse
    if (!data?.boats?.length || !data.generatedAt) {
      waarschuw('antwoord zonder boats[] of generatedAt')
      return null
    }

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
  } catch (e) {
    waarschuw(e instanceof Error ? e.message : String(e))
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

/**
 * In welk seizoen valt een datum, volgens onze eigen banden.
 *
 * Juli en augustus zijn hoogseizoen — verder niets. Mei, juni, september en
 * oktober zijn tussenseizoen, de rest van het jaar laag.
 *
 * Let op waar dit WEL en NIET voor gebruikt wordt. Dit bepaalt welke van de
 * drie statische prijsbanden van een boot de kaart toont wanneer de live feed
 * niets over die datum zegt — een vanafprijs met een label, geen offerte. De
 * live dagprijs komt onveranderd uit priceForDate() met het seizoen dat de
 * partner-API zelf meegeeft; die rekent met de banden van de broker en daar
 * wijken wij niet vanaf (zie de kop van dit bestand). Het tussenseizoen houdt
 * daarom ook een voorzichtig bijschrift: het exacte venster verschilt per boot.
 */
export function seasonForDate(iso: string): 'low' | 'mid' | 'high' {
  const maand = Number(iso.slice(5, 7))
  if (maand === 7 || maand === 8) return 'high'
  if (maand === 5 || maand === 6 || maand === 9 || maand === 10) return 'mid'
  return 'low'
}

/** Beschikbaarheid voor een datum. Geen vermelding = beschikbaar. */
export function statusForDate(b: LiveBoat, iso: string): 'free' | DayStatus {
  return b.days[iso] ?? 'free'
}

/**
 * Vandaag als YYYY-MM-DD in Ibiza-tijd. De beschikbaarheid is per Ibiza-dag;
 * `toISOString()` gaf de UTC-dag, en die loopt 's avonds twee uur achter —
 * dan stond om 00:30 nog "vandaag" van gisteren voorgeselecteerd. Server en
 * client rekenen allebei hiermee, zodat de eerste render al klopt.
 */
export function ibizaToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}

/**
 * "HH:MM" van het feedtijdstip, in Ibiza-tijd. Vaste tijdzone en niet die van
 * het apparaat: de live laag wordt nu server-side gerenderd, en een server in
 * UTC die "08:15" schrijft waar de browser "10:15" verwacht is een
 * hydration-mismatch. Bovendien is de Ibiza-tijd hier de enige die klopt.
 */
export function liveStampTime(generatedAt: string, bcp47: string): string {
  return new Date(generatedAt).toLocaleTimeString(bcp47, {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid',
  })
}
