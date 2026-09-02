import { NextResponse } from 'next/server'
import { getLiveFleet } from '@/lib/yacht-broker'

/**
 * Live vlootdata zoals de site ze op dit moment van de partner heeft.
 *
 * Dit wás de brug voor de client-side vlootweergave. Die haalt de live laag
 * niet meer op na mount — de charterpagina rendert hem server-side in de HTML
 * — dus geen enkele bezoeker raakt deze route nog aan.
 *
 * Hij blijft staan als controlepunt, en dat is geen restje: de live laag valt
 * stil weg als de partner eruit ligt (de pagina toont dan gewoon de statische
 * banden), dus er moet een manier zijn om te zíen wat we hebben. Open
 * /api/fleet-live in de browser: JSON met `generatedAt` en de boten betekent
 * dat de koppeling werkt, 503 betekent dat de feed op dit moment niet
 * bruikbaar is. `npm run check:fleet` doet hetzelfde rechtstreeks bij de
 * partner en legt het bovendien naast src/data/fleet.ts.
 */
export const revalidate = 900

export async function GET() {
  const live = await getLiveFleet()
  if (!live) return new NextResponse(null, { status: 503 })
  return NextResponse.json(live, {
    headers: { 'cache-control': 'public, s-maxage=900, stale-while-revalidate=300' },
  })
}
