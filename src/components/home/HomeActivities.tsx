'use client'

import { HomeZoneRail, type ZoneDay } from './HomeZoneRail'
import { isOpHetLand } from '@/lib/activity-split'
import { addDays } from '@/lib/date-label'
import { priceNumbers } from '@/lib/price-parse'
import { withDate } from '@/lib/event-date-param'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  kicker: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  titel: T('On the land activities', 'On the land activities', 'On the land activities', 'On the land activities', 'On the land activities'),
  tekst: T(
    'Buggy’s, quads, jeepsafari’s, grotten en hippiemarkten. Alles wat je op het eiland zelf doet, per dag te boeken.',
    'Buggies, quads, jeep safaris, caves and hippy markets. Everything you do on the island itself, bookable by the day.',
    'Buggys, Quads, Jeep-Safaris, Höhlen und Hippie-Märkte. Alles, was auf der Insel selbst stattfindet, tageweise buchbar.',
    'Buggies, quads, safaris en jeep, cuevas y mercadillos hippies. Todo lo que se hace en la isla, por día.',
    'Buggys, quads, safaris en jeep, grottes et marchés hippies. Tout ce qui se fait sur l’île même, à la journée.',
  ),
  knop: T('Bekijk het land', 'See the island', 'Aufs Land', 'Ver la isla', "Voir l'île"),
  tag: T('Op het eiland', 'On the island', 'Auf der Insel', 'En la isla', "Sur l'île"),
}

interface FeedItem {
  prices?: string
  ct_events?: { name?: string; slug?: string; cover?: string; logo?: string }
  ct_venues?: { name?: string; slug?: string; basePath?: string; typeSlug?: string }
  name?: string
}

/**
 * Wereld 03: On the land activities — alles wat geen clubavond en geen eigen boot is.
 *
 * Dezelfde `experienceDays`-reeks als de ringcarrousel, hier per dag gefilterd
 * op wat op het land gebeurt — zie activity-split.ts voor waarom dat per event
 * en niet per aanbieder moet.
 */
export function HomeActivities({
  days: experienceDays = [],
  todayStr,
  locale = 'nl',
  base,
}: {
  days?: { date?: string; items: FeedItem[] }[]
  todayStr: string
  locale?: string
  base: string
}) {
  /**
   * Van feedregels naar kaarten. Een functie voor de week die de server
   * meestuurde en voor elke week die de kiezer erbij haalt, zodat een
   * bijgeladen week er niet anders uit kan zien dan de week ervoor.
   */
  const naarDagen = (rijen: { date?: string; items: FeedItem[] }[], vanaf: string): ZoneDay[] => {
    const byDate = new Map(rijen.map(d => [d.date || '', d.items || []]))

    return Array.from({ length: 7 }, (_, i) => {
      const iso = addDays(vanaf, i)
      const raw = byDate.get(iso) || []
      const gezien = new Set<string>()
      const items = []
      for (const it of raw) {
        if (!isOpHetLand(it.ct_venues?.typeSlug, it.ct_events?.name || it.name || '')) continue
        const venue = it.ct_venues?.slug || ''
        const slug = it.ct_events?.slug || ''
        const image = it.ct_events?.cover || it.ct_events?.logo || ''
        if (!venue || !slug || !image || gezien.has(slug)) continue
        gezien.add(slug)
        const priceNum = priceNumbers(it.prices)[0]
        items.push({
          href: withDate(`${base}/${it.ct_venues?.basePath || 'activities'}/${venue}/${slug}`, iso),
          image,
          title: it.ct_events?.name || it.name || '',
          venue: it.ct_venues?.name || '',
          tag: t(L.tag, locale),
          price: priceNum ? `€${priceNum}` : undefined,
        })
        if (items.length === 14) break
      }
      return { iso, items }
    })
  }

  const days = naarDagen(experienceDays, todayStr)

  const loadWeek = async (vanaf: string): Promise<ZoneDay[]> => {
    const r = await fetch(`/api/home-days?locale=${encodeURIComponent(locale)}&night=${vanaf}&day=${vanaf}`)
    if (!r.ok) return []
    const json = await r.json()
    return naarDagen(json.experienceDays || [], vanaf)
  }

  return (
    <HomeZoneRail
      id="zone-island"
      locale={locale}
      bg="#EADFC0"
      accent="#C8A24A"
      kickerColor="#A07F2A"
      glow={{ x: '90%', y: '30%', color: 'rgba(200,162,74,.18)' }}
      roundedTop
      kicker={t(L.kicker, locale)}
      title={t(L.titel, locale)}
      text={t(L.tekst, locale)}
      ctaLabel={t(L.knop, locale)}
      ctaHref={`${base}/activities-calendar`}
      days={days}
      loadWeek={loadWeek}
    />
  )
}
