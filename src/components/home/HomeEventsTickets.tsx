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

  /**
   * Van feedregels naar kaarten. Eén functie voor de week die de server
   * meestuurde én voor elke week die de kiezer erbij haalt -- anders zou een
   * bijgeladen week er ongemerkt anders uit kunnen zien dan de week ervoor.
   */
  const naarDagen = (rijen: { date: string; items: ClubDayItem[] }[], vanaf: string): ZoneDay[] => {
    const byDate = new Map(rijen.map(d => [d.date, d.items]))
    return Array.from({ length: 7 }, (_, i) => {
      const iso = addDays(vanaf, i)
      const items = (byDate.get(iso) || [])
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
  }

  const days = naarDagen(clubDays, tonightStr)

  const loadWeek = async (vanaf: string): Promise<ZoneDay[]> => {
    const r = await fetch(`/api/home-days?locale=${encodeURIComponent(locale)}&night=${vanaf}&day=${vanaf}`)
    if (!r.ok) return []
    const json = await r.json()
    return naarDagen(json.clubDays || [], vanaf)
  }

  return (
    <HomeZoneRail
      id="zone-events"
      locale={locale}
      // Roze (#ECC5C6) als achtergrond van deze wereld -- de warmste kleur
      // van het blad, en dat past bij clubnachten. Donkere tekst haalt er
      // 11,73:1 op.
      //
      // Het accent is #2C2C2C en niet een diepere roze. Zie de kop van
      // globals.css: dit palet ligt te dicht bij neutraal om per sectie een
      // eigen accentkleur te dragen. Het onderscheid tussen de vier werelden
      // zit nu in de achtergrond; het accent is overal hetzelfde.
      bg="var(--zone-bg-events)"
      accent="var(--imv-ink)"
      accentInk="var(--ink-on-accent)"
      kickerColor="var(--imv-ink)"
      glow={{ x: '85%', y: '10%', color: 'rgba(250,215,222,.35)' }}
      kicker={t(L.kicker, locale)}
      title={t(L.titel, locale)}
      ctaLabel={t(L.knop, locale)}
      ctaHref={`${base}/calendar`}
      days={days}
      loadWeek={loadWeek}
    />
  )
}
