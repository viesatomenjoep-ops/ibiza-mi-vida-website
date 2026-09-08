import 'server-only'

/**
 * Leeslaag naar het partnerplatform (api.ibizamivida.com).
 *
 * ── Waarom hier geen Supabase-client staat ────────────────────────────────
 * Het platform deelt hetzelfde Supabase-project, dus rechtstreeks queryen zou
 * kunnen. Toch gaat alles via de publieke API met een API-sleutel: deze site
 * hoort niets te weten van tabelnamen, RLS-policies of het schema `partner`.
 * Verandert daar iets, dan verandert daar iets — niet hier.
 *
 * ── Waarom elke fetch getagd is ───────────────────────────────────────────
 * `next: { tags: [...] }` is wat /api/revalidate kan verlopen. Zonder tag is de
 * enige manier om nieuwe partnerdata te tonen wachten tot `revalidate` afloopt,
 * en dan is "live sync" een uur vertraging.
 *
 * ── Waarom een lege lijst geen fout is ────────────────────────────────────
 * Zolang er geen partner is aangesloten (of de API ligt eruit) geeft dit een
 * lege lijst terug en rendert de pagina zonder prijstabel. Dat is dezelfde
 * regel als bij `rental-prices.ts`: liever geen getal dan een verzonnen getal.
 */

const BASE = process.env.PARTNER_API_BASE_URL?.replace(/\/$/, '') ?? ''
const KEY = process.env.PARTNER_API_KEY ?? ''

/** Uur cache als bodem; de webhook verlaagt dat in de praktijk naar seconden. */
const REVALIDATE_SECONDS = 3600

export interface PartnerVehicle {
  id: string
  slug: string | null
  type: string
  display_name: string
  seats: number
  luggage: number
  features: string[]
  partner: { name: string; slug: string; badge?: 'verified' }
  media: Array<{ url: string; poster?: string; kind: 'photo' | 'video'; angle: string | null }>
}

export interface PartnerZone {
  slug: string
  name: string
}

export interface ZonePrice {
  price_eur: number
  bidirectional: boolean
  from: { slug: string; name: string } | null
  to: { slug: string; name: string } | null
}

export const partnerApiConfigured = () => Boolean(BASE && KEY)

async function get<T>(path: string, tags: string[]): Promise<T | null> {
  if (!partnerApiConfigured()) return null

  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'x-api-key': KEY },
      next: { tags, revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) {
      console.error(`[partner-api] GET ${path} → ${res.status}`)
      return null
    }
    return (await res.json()) as T
  } catch (e) {
    // Een partner die eruit ligt mag nooit een pagina van deze site meeslepen.
    console.error(`[partner-api] GET ${path} failed`, e)
    return null
  }
}

export async function getPartnerVehicles(): Promise<PartnerVehicle[]> {
  const body = await get<{ data: PartnerVehicle[] }>('/v1/vehicles', ['vehicles'])
  return body?.data ?? []
}

export async function getPartnerVehicle(
  slug: string,
): Promise<(PartnerVehicle & { zone_prices: ZonePrice[] }) | null> {
  const body = await get<{ data: PartnerVehicle & { zone_prices: ZonePrice[] } }>(
    `/v1/vehicles/${encodeURIComponent(slug)}`,
    ['vehicles', `vehicle_${slug}`],
  )
  return body?.data ?? null
}

export async function getPartnerZones(): Promise<PartnerZone[]> {
  const body = await get<{ data: PartnerZone[] }>('/v1/zones', ['zones'])
  return body?.data ?? []
}

/**
 * De vaste zoneprijzen vanaf de luchthaven, oplopend gesorteerd.
 *
 * Precies wat een bezoeker wil weten voordat hij boekt, en het enige stuk
 * partnerdata dat als prijs op deze site verschijnt. Komt er niets terug, dan
 * toont de pagina geen tabel — geen "vanaf"-bedrag, geen placeholder.
 */
export async function getAirportZonePrices(): Promise<ZonePrice[]> {
  const vehicles = await getPartnerVehicles()
  const first = vehicles.find(v => v.slug)
  if (!first?.slug) return []

  const detail = await getPartnerVehicle(first.slug)
  if (!detail) return []

  return detail.zone_prices
    .filter(p => p.from?.slug?.startsWith('airport') || p.to?.slug?.startsWith('airport'))
    .sort((a, b) => a.price_eur - b.price_eur)
}
