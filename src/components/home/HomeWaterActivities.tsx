'use client'

import { HomeCircleCollage, type CollageKaart } from './HomeCircleCollage'
import { isOpHetWater } from '@/lib/activity-split'

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
}

interface FeedItem {
  prices?: string
  ct_events?: { name?: string; slug?: string; cover?: string; logo?: string }
  ct_venues?: { name?: string; slug?: string; basePath?: string; typeSlug?: string }
  name?: string
}

/**
 * Wereld 04: alles wat vaart — jetski's, catamarans, boottochten, ferry's.
 *
 * De scheiding met de landwereld gebeurt per event en niet per aanbieder; zie
 * activity-split.ts voor waarom dat moet. Eén aanbieder per tegel, zodat er
 * niet vier keer dezelfde jetskiverhuurder naast elkaar staat.
 */
export function HomeWaterActivities({
  days,
  locale = 'nl',
  base,
}: {
  days: { date?: string; items: FeedItem[] }[]
  locale?: string
  base: string
}) {
  const kaarten: CollageKaart[] = []
  const venues = new Set<string>()
  for (const d of days) {
    for (const it of d.items || []) {
      const naam = it.ct_events?.name || it.name || ''
      if (!isOpHetWater(it.ct_venues?.typeSlug, naam)) continue
      const beeld = it.ct_events?.cover || it.ct_events?.logo || ''
      const venue = it.ct_venues?.slug || ''
      const slug = it.ct_events?.slug || ''
      if (!beeld || !venue || !slug || venues.has(venue)) continue
      venues.add(venue)
      kaarten.push({
        href: `${base}/${it.ct_venues?.basePath || 'boat-trip'}/${venue}/${slug}`,
        image: beeld,
        alt: naam,
        badge: (it.prices || '').split('-')[0].trim() || undefined,
      })
      if (kaarten.length === 10) break
    }
    if (kaarten.length === 10) break
  }

  return (
    <HomeCircleCollage
      id="zone-wateract"
      kaarten={kaarten}
      titel={t(L.titel, locale)}
      kicker={t(L.kicker, locale)}
      tekst={t(L.tekst, locale)}
      knop={t(L.knop, locale)}
      href={`${base}/activities-calendar`}
      kleur="#8D7BC4"
      schaduw="rgba(141,123,196,.75)"
      className="bg-neutral-50"
    />
  )
}
