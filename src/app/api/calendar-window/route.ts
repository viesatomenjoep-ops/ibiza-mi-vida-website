import { NextResponse } from 'next/server'
import { calendarWindow } from '@/lib/calendar-window'
import { LOCALES, DEFAULT_LOCALE } from '@/lib/seo'

/**
 * De agenda voorbij de eerste twee weken.
 *
 * De pagina rendert veertien dagen in de HTML — genoeg voor de weergave waar
 * iedereen op binnenkomt, en genoeg voor een crawler die geen JavaScript draait
 * om te zien wat er deze en volgende week speelt. Wie naar 'maand' of 'jaar'
 * schakelt, haalt de rest hier op.
 *
 * Waarom niet /api/calendar-events, die al bestond: die leest uit Supabase,
 * terwijl de pagina uit de ClubTickets-JSON in de repo leest. Twee bronnen voor
 * één lijst is hoe je bijgeladen events krijgt die niet matchen met wat er al
 * stond. Deze route deelt de mapping met de pagina.
 */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
/** Ruim een seizoen. Voorkomt dat een verzonnen bereik de hele feed uitleest. */
const MAX_DAYS = 400

export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const localeRaw = searchParams.get('locale') || DEFAULT_LOCALE
  const locale = (LOCALES as readonly string[]).includes(localeRaw) ? localeRaw : DEFAULT_LOCALE
  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''

  if (!ISO_DATE.test(from) || !ISO_DATE.test(to) || to < from) {
    return NextResponse.json({ error: 'from and to must be YYYY-MM-DD, with to >= from' }, { status: 400 })
  }
  const spanDays = (Date.parse(to) - Date.parse(from)) / 86400000
  if (!Number.isFinite(spanDays) || spanDays > MAX_DAYS) {
    return NextResponse.json({ error: `range may not exceed ${MAX_DAYS} days` }, { status: 400 })
  }

  const events = await calendarWindow(locale, from, to)
  return NextResponse.json(
    { events },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  )
}
