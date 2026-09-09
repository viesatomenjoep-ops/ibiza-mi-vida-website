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
      // Blush (#F5E9E7) als achtergrond -- de lichtste kleur van het blad,
      // en de rustigste van de vier. Donkere tekst haalt er 15,52:1 op, het
      // hoogste van alle sectietinten.
      //
      // Deze wereld had als enige donkere tekst op het accent, omdat Sun
      // Glare geen wit verdroeg. Dat is nu overal gelijk: het accent is
      // #2C2C2C en draagt overal wit (13,97:1).
      bg="var(--zone-bg-island)"
      accent="var(--imv-ink)"
      accentInk="var(--ink-on-accent)"
      kickerColor="var(--imv-ink)"
      glow={{ x: '90%', y: '30%', color: 'rgba(117,111,93,.12)' }}
      roundedTop
      kicker={t(L.kicker, locale)}
      title={t(L.titel, locale)}
      ctaLabel={t(L.knop, locale)}
      // Niet /activities-calendar (de kale datumagenda) maar /activities: de
      // echte hub met alle activiteiten op een rij. Wie net drie kaarten met
      // een grot, een buggy en een quad heeft gezien wil eerst weten wát er
      // allemaal is, niet meteen een lege datumkalender.
      ctaHref={`${base}/activities`}
      days={days}
      loadWeek={loadWeek}
    />
  )
}
