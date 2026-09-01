import { NextResponse } from 'next/server'
import { FLEET } from '@/data/fleet'

/**
 * Bootdossiers (PDF) via ons eigen domein en onze eigen CDN.
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
 * De slug wordt tegen de vloot gevalideerd; dit is geen open proxy. Alleen
 * URLs die bij generatie van fleet.ts met een HEAD-request zijn geverifieerd
 * kunnen hier opgevraagd worden.
 */
export const revalidate = 604800 // een week — dossiers wijzigen per seizoen, niet per dag

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const boat = FLEET.find((b) => b.slug === params.slug)
  if (!boat?.pdf) return new NextResponse(null, { status: 404 })

  try {
    const res = await fetch(boat.pdf, {
      headers: { 'user-agent': 'ibizamivida.com partner integration' },
      next: { revalidate },
    })
    if (!res.ok) return new NextResponse(null, { status: 502 })
    const buf = await res.arrayBuffer()

    return new NextResponse(buf, {
      headers: {
        'content-type': 'application/pdf',
        // inline: openen in de browser, niet ongevraagd downloaden. De naam is
        // die van de boot, niet de interne bestandsnaam van de partner.
        'content-disposition': `inline; filename="${boat.name ?? boat.model} - Ibiza Mi Vida.pdf"`,
        'cache-control': 'public, s-maxage=604800, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse(null, { status: 502 })
  }
}
