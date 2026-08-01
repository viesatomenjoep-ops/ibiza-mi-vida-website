import { NextResponse } from 'next/server'
import { getAllDates } from '@/lib/clubtickets'

export const dynamic = 'force-dynamic'

/**
 * Month-by-month agenda loader. The category pages only ship a 31-day window
 * server-side (perf); when a visitor browses further ahead, the client fetches
 * the extra month here: /api/agenda?locale=nl&month=2026-09&venues=a,b,c
 * Returns dates in the WaterAgendaEvent shape used by WaterAgendaClient.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || 'en'
  const month = searchParams.get('month') || ''
  const venuesParam = searchParams.get('venues') || ''

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'month must be YYYY-MM' }, { status: 400 })
  }
  const venueSlugs = new Set(venuesParam.split(',').map((s) => s.trim()).filter(Boolean))
  if (venueSlugs.size === 0) {
    return NextResponse.json({ error: 'venues parameter is required' }, { status: 400 })
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const monthStart = `${month}-01`
  const monthEnd = `${month}-31`
  const from = monthStart > todayStr ? monthStart : todayStr

  const allDates = await getAllDates(locale)
  const events = allDates
    .filter((d) => d.venueSlug && venueSlugs.has(d.venueSlug) && d.date >= from && d.date <= monthEnd)
    .map((d) => ({
      id: String(d.id),
      name: d.name,
      date: d.date,
      prices: String(d.prices ?? ''),
      lineUp: d.lineUp,
      eventName: d.eventName,
      eventSlug: d.eventSlug,
      eventCover: d.eventCover,
      eventLogo: d.eventLogo,
      venueName: d.venueName,
      venueSlug: d.venueSlug,
      venueCover: d.venueCover,
      venueLogo: d.venueLogo,
      affLink: d.affLink,
    }))

  return NextResponse.json(
    { events },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  )
}
