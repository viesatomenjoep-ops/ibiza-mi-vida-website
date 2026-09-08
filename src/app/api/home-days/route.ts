import { NextResponse } from 'next/server'
import { buildHomeDays } from '@/lib/home-days'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * Eén week aan dagen voor de vier homepage-werelden, vanaf een gevraagde datum.
 *
 * ── Waarom deze route bestaat ─────────────────────────────────────────────
 * De dagkiezer boven elke wereld toonde zeven dagen en daar hield het op. Wie
 * over twee weken op Ibiza is kon op de homepage niet zien wat er dan speelt.
 * Alle 28 dagen meesturen was het alternatief, maar dat is grofweg een kwart
 * megabyte extra bij élke bezoeker -- ook bij de meesten die alleen naar deze
 * week kijken. Nu kost het alleen iets bij wie doorbladert.
 *
 * De opbouw komt uit dezelfde functie als de eerste week (buildHomeDays), dus
 * een bijgeladen week kan er niet anders uitzien dan de week ervoor.
 *
 * ── Waarom geen datums in het verleden ────────────────────────────────────
 * getAllDates() filtert al op de lopende nacht, dus een oudere `from` levert
 * simpelweg lege dagen op. Dat is goed gedrag: de kiezer toont dan zeven lege
 * knoppen in plaats van een fout.
 */
export const revalidate = 900

const ISO = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gevraagd = searchParams.get('locale') || DEFAULT_LOCALE
  const locale: Locale = (LOCALES as readonly string[]).includes(gevraagd)
    ? (gevraagd as Locale)
    : DEFAULT_LOCALE

  const fromNight = searchParams.get('night') || ''
  const fromDay = searchParams.get('day') || fromNight

  if (!ISO.test(fromNight) || !ISO.test(fromDay)) {
    return NextResponse.json(
      { error: 'night en day moeten YYYY-MM-DD zijn' },
      { status: 400 },
    )
  }

  // Vast op zeven. De kiezer toont een week; een vrij instelbaar aantal zou
  // alleen een manier zijn om per ongeluk het hele seizoen op te vragen.
  const { clubDays, experienceDays } = await buildHomeDays(locale, fromNight, fromDay, 7)

  return NextResponse.json({ clubDays, experienceDays })
}
