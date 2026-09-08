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
  tekst: T(
    'Jetski’s, catamarans, boottochten en de ferry naar Formentera — alles wat vaart, per dag te boeken.',
    'Jet skis, catamarans, boat trips and the ferry to Formentera — everything that floats, bookable by the day.',
    'Jetskis, Katamarane, Bootstouren und die Fähre nach Formentera — alles, was fährt, tageweise buchbar.',
    'Motos de agua, catamaranes, excursiones en barco y el ferry a Formentera — todo lo que navega, por día.',
    'Jet-skis, catamarans, sorties en bateau et le ferry pour Formentera — tout ce qui navigue, à la journée.',
  ),
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
      // Pantone Darkest Hour (20-0199 TPM) als accent. Het blad heeft drie
      // accenten voor vier werelden; die drie zijn alle drie fel en verdragen
      // elkaar slecht, dus een vierde felle kleur bijverzinnen zou het palet
      // juist verzwakken. Darkest Hour is de rustigste manier om deze wereld
      // een eigen gezicht te geven, en haalt met wit 13,97:1 -- veruit het
      // hoogste contrast van alle vier.
      //
      // Achtergrond: een warme neutrale tint. De andere drie werelden dragen
      // de kleur van hun accent; deze heeft Darkest Hour en dat kan niet als
      // achtergrond, dus een neutrale tint die duidelijk verschilt van de
      // oranje, violette en geelgroene buren.
      bg="var(--zone-bg-neutral)"
      accent="var(--pantone-darkest)"
      accentInk="#fff"
      kickerColor="var(--pantone-darkest)"
      glow={{ x: '15%', y: '20%', color: 'rgba(44,44,44,.06)' }}
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
