'use client'

import { HomeZoneRail, type ZoneDay } from './HomeZoneRail'
import { isOpHetWater } from '@/lib/activity-split'
import { addDays } from '@/lib/date-label'
import { priceNumbers } from '@/lib/price-parse'
import { withDate } from '@/lib/event-date-param'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  kicker: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  titel: T('On the water activities', 'On the water activities', 'On the water activities', 'On the water activities', 'On the water activities'),
  knop: T('Bekijk het water', 'See the water', 'Aufs Wasser', 'Ver el agua', "Voir l'eau"),
  tag: T('Op het water', 'On the water', 'Auf dem Wasser', 'En el agua', "Sur l'eau"),
}

interface FeedItem {
  prices?: string
  ct_events?: { name?: string; slug?: string; cover?: string; logo?: string }
  ct_venues?: { name?: string; slug?: string; basePath?: string; typeSlug?: string }
  name?: string
}

/**
 * Wereld 04: alles wat vaart. De scheiding met de landwereld gebeurt per event
 * en niet per aanbieder; zie activity-split.ts.
 */
export function HomeWaterActivities({
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
      const venues = new Set<string>()
      const items = []
      for (const it of raw) {
        const naam = it.ct_events?.name || it.name || ''
        if (!isOpHetWater(it.ct_venues?.typeSlug, naam)) continue
        const venue = it.ct_venues?.slug || ''
        const slug = it.ct_events?.slug || ''
        const image = it.ct_events?.cover || it.ct_events?.logo || ''
        if (!venue || !slug || !image || venues.has(venue)) continue
        venues.add(venue)
        const priceNum = priceNumbers(it.prices)[0]
        items.push({
          href: withDate(`${base}/${it.ct_venues?.basePath || 'boat-trip'}/${venue}/${slug}`, iso),
          image,
          title: naam,
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
      id="zone-wateract"
      locale={locale}
      // Grijs (#C1C0C2) als achtergrond -- de neutraalste kleur van het
      // blad. Donkere tekst haalt er 10,16:1 op.
      //
      // Olijf (#837D68) zou hier de logische vijfde kleur zijn, maar die kan
      // geen achtergrond dragen: met zwart 4,47 en met wit 4,12, allebei
      // onder de 4,5 van AA. Er is dus geen tekstkleur die erop mag. Olijf
      // staat daarom alleen in het menu, als streepje waar geen tekst op
      // ligt.
      bg="var(--zone-bg-water)"
      accent="var(--imv-ink)"
      accentInk="var(--ink-on-accent)"
      kickerColor="var(--imv-ink)"
      glow={{ x: '15%', y: '20%', color: 'rgba(180,225,230,.3)' }}
      roundedTop
      kicker={t(L.kicker, locale)}
      title={t(L.titel, locale)}
      ctaLabel={t(L.knop, locale)}
      ctaHref={`${base}/activities-calendar`}
      days={days}
      loadWeek={loadWeek}
    />
  )
}
