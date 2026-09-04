import { NextResponse } from 'next/server'
import { getLiveEvent } from '@/lib/clubtickets-live'
import { LOCALES, DEFAULT_LOCALE } from '@/lib/seo'

/**
 * Live event data as the site currently has it from the ClubTickets partner
 * feed — a health probe, mirroring /api/fleet-live.
 *
 * No page calls this: the event detail pages fetch `getLiveEvent` server-side
 * and render the overlay into the HTML. It exists so the failure — which is
 * silent, the page just falls back to the nightly JSON — can be seen. Open
 * /api/event-live/<venueId>/<eventId> in a browser: JSON with `dates` means the
 * link works, 503 means the feed is not usable right now. `npm run check:event`
 * is the scheduled counterpart.
 */
export const revalidate = 900

export async function GET(
  req: Request,
  { params }: { params: { venueId: string; eventId: string } },
) {
  const venueId = Number(params.venueId)
  const eventId = Number(params.eventId)
  if (!Number.isFinite(venueId) || !Number.isFinite(eventId)) {
    return NextResponse.json({ error: 'venueId and eventId must be numbers' }, { status: 400 })
  }

  const localeRaw = new URL(req.url).searchParams.get('locale') || DEFAULT_LOCALE
  const locale = (LOCALES as readonly string[]).includes(localeRaw) ? localeRaw : DEFAULT_LOCALE

  const live = await getLiveEvent(venueId, eventId, locale)
  if (!live) return new NextResponse(null, { status: 503 })

  return NextResponse.json(live, {
    headers: { 'cache-control': 'public, s-maxage=900, stale-while-revalidate=300' },
  })
}
