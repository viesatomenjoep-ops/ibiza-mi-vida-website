'use client'

import { HomeZoneRail, type ZoneDay } from './HomeZoneRail'
import { addDays } from '@/lib/date-label'
import { priceNumbers } from '@/lib/price-parse'
import { withDate } from '@/lib/event-date-param'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  kicker: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  titel: T('Events & Tickets', 'Events & Tickets', 'Events & Tickets', 'Eventos y entradas', 'Événements & billets'),
  tekst: T(
    'Elke clubnacht van het seizoen, met live prijzen en line-ups. Kies je avond en reken direct af via ClubTickets.',
    'Every club night of the season, with live prices and line-ups. Pick your night and check out via ClubTickets.',
    'Jede Clubnacht der Saison, mit Live-Preisen und Line-ups. Wähl deinen Abend und buche direkt über ClubTickets.',
    'Cada noche de club de la temporada, con precios y line-ups en vivo. Elige tu noche y reserva vía ClubTickets.',
    'Chaque soirée club de la saison, avec prix et line-ups en direct. Choisissez votre soirée et réservez via ClubTickets.',
  ),
  knop: T('Bekijk de agenda', 'See the calendar', 'Zum Kalender', 'Ver la agenda', "Voir l'agenda"),
  day: T('Dag', 'Day', 'Tag', 'Día', 'Jour'),
  night: T('Nacht', 'Night', 'Nacht', 'Noche', 'Nuit'),
}

interface ClubDayItem {
  name?: string
  prices?: string
  ct_events?: { name?: string; slug?: string; logo?: string; cover?: string }
  ct_venues?: { name?: string; slug?: string }
}

/**
 * Wereld 01: Events & Tickets. Hier landt de rode knop uit de hero.
 *
 * `clubDays` is dezelfde zeven-dagenreeks (vanaf `tonightStr`) die de agenda
 * elders al opbouwt — geen tweede databron, alleen een andere weergave. Een
 * dag zonder avonden krijgt toch zijn knop in de kiezer; de kaartrail toont
 * dan de lege-dag-tekst in plaats van de knop te laten verdwijnen.
 */
export function HomeEventsTickets({
  clubDays = [],
  tonightStr,
  allVenues = [],
  locale = 'nl',
  base,
}: {
  clubDays?: { date: string; items: ClubDayItem[] }[]
  tonightStr: string
  allVenues?: { slug: string; isDayClub?: boolean }[]
  locale?: string
  base: string
}) {
  const dayClubBySlug = new Map(allVenues.map(v => [v.slug, !!v.isDayClub]))
  const byDate = new Map(clubDays.map(d => [d.date, d.items]))

  const days: ZoneDay[] = Array.from({ length: 7 }, (_, i) => {
    const iso = addDays(tonightStr, i)
    const raw = byDate.get(iso) || []
    const items = raw
      .map(it => {
        const venue = it.ct_venues?.slug || ''
        const slug = it.ct_events?.slug || ''
        const image = it.ct_events?.cover || it.ct_events?.logo || ''
        if (!venue || !slug || !image) return null
        const priceNum = priceNumbers(it.prices)[0]
        return {
          href: withDate(`${base}/club-tickets/${venue}/${slug}`, iso),
          image,
          title: it.ct_events?.name || it.name || '',
          venue: it.ct_venues?.name || '',
          tag: dayClubBySlug.get(venue) ? t(L.day, locale) : t(L.night, locale),
          price: priceNum ? `€${priceNum}` : undefined,
        }
      })
      .filter((c): c is NonNullable<typeof c> => !!c)
      .slice(0, 14)
    return { iso, items }
  })

  return (
    <HomeZoneRail
      id="zone-events"
      locale={locale}
      bg="#F6E3E8"
      accent="#E14D68"
      kickerColor="#E14D68"
      glow={{ x: '85%', y: '10%', color: 'rgba(225,77,104,.12)' }}
      kicker={t(L.kicker, locale)}
      title={t(L.titel, locale)}
      text={t(L.tekst, locale)}
      ctaLabel={t(L.knop, locale)}
      ctaHref={`${base}/calendar`}
      days={days}
    />
  )
}
