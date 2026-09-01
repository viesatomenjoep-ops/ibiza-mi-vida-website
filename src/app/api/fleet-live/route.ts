import { NextResponse } from 'next/server'
import { getLiveFleet } from '@/lib/yacht-broker'

/**
 * Live vlootdata voor de client-side vlootweergave.
 *
 * FleetShowcase is een client-component (zoeken, filters, lightbox) en kan de
 * serverfunctie niet rechtstreeks aanroepen. Deze route is de brug: één
 * gecachete serverfetch naar de partner, hoeveel bezoekers er ook kijken.
 *
 * 503 zonder body wanneer de partnerfeed niet te bereiken is. De client
 * behandelt dat als "geen live laag" — de statische prijsbanden blijven
 * gewoon staan en er wordt niets verzonnen.
 */
export const revalidate = 900

export async function GET() {
  const live = await getLiveFleet()
  if (!live) return new NextResponse(null, { status: 503 })
  return NextResponse.json(live, {
    headers: { 'cache-control': 'public, s-maxage=900, stale-while-revalidate=300' },
  })
}
