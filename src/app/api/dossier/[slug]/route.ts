import { NextResponse } from 'next/server'
import { FLEET } from '@/data/fleet'

/**
 * Bootdossiers (PDF) via ons eigen domein en onze eigen CDN — live van de
 * partner, niet uit een lokale map.
 *
 * ── Waarom niet rechtstreeks naar de partner linken ───────────────────────
 * De kaarten linkten naar theyachtbroker.club/pdf/…. Dat werkt, maar elke
 * klik leunt dan op de bandbreedte en uptime van de partner, en de bezoeker
 * verlaat ons domein voor een document dat wij aanbieden.
 *
 * ── Waarom niet via Cloudinary ────────────────────────────────────────────
 * Geprobeerd: onze Cloudinary-cloud geeft 401 op PDF-fetch. Cloudinary
 * blokkeert PDF-levering standaard (beveiligingsinstelling) en uploaden
 * vereist API-sleutels die niet in dit project staan. Niet nodig ook: dit is
 * een GET met een s-maxage van een week, dus Vercels edge-cache doet
 * hetzelfde werk — na de eerste klik per regio komt het dossier van de CDN
 * en raakt de partner niet meer.
 *
 * ── Streamen, niet bufferen ───────────────────────────────────────────────
 * Eerst las de route het hele bestand in (`arrayBuffer()`) vóór de eerste
 * byte naar de bezoeker ging, en probeerde het via `next: { revalidate }`
 * in de datacache te zetten. Dat laatste kan niet: Next cachet geen
 * fetch-antwoord boven 2 MB, en de meeste dossiers zijn groter (tot 15,6 MB).
 * Dus elke klik wachtte op de volledige download bij de partner, hield die
 * megabytes in het geheugen van de functie, en werd tóch niet gecachet. Nu
 * stroomt het antwoord door zodra de eerste bytes binnen zijn en doet de
 * edge-cache (s-maxage) het bewaren — die heeft geen 2 MB-grens.
 *
 * De slug wordt tegen de vloot gevalideerd; dit is geen open proxy. Alleen
 * URLs die bij generatie van fleet.ts met een HEAD-request zijn geverifieerd
 * kunnen hier opgevraagd worden.
 */
export const dynamic = 'force-dynamic'

const EEN_WEEK = 604800 // dossiers wijzigen per seizoen, niet per dag

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const boat = FLEET.find((b) => b.slug === params.slug)
  if (!boat?.pdf) return new NextResponse(null, { status: 404 })

  try {
    const res = await fetch(boat.pdf, {
      headers: { 'user-agent': 'ibizamivida.com partner integration' },
      cache: 'no-store',
    })
    if (!res.ok || !res.body) return new NextResponse(null, { status: 502 })

    const headers: Record<string, string> = {
      'content-type': 'application/pdf',
      // inline: openen in de browser, niet ongevraagd downloaden. De naam is
      // die van de boot, niet de interne bestandsnaam van de partner.
      'content-disposition': `inline; filename="${boat.name ?? boat.model} - Ibiza Mi Vida.pdf"`,
      'cache-control': `public, s-maxage=${EEN_WEEK}, stale-while-revalidate=86400`,
    }
    // Lengte doorgeven als de partner hem meestuurt: dan toont de PDF-viewer
    // een voortgangsbalk in plaats van een spinner zonder einde.
    const len = res.headers.get('content-length')
    if (len) headers['content-length'] = len

    return new NextResponse(res.body, { headers })
  } catch {
    return new NextResponse(null, { status: 502 })
  }
}
