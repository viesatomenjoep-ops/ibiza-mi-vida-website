'use client'

import { HomeCircleCollage, type CollageKaart } from './HomeCircleCollage'
import { isOpHetLand } from '@/lib/activity-split'

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
 * Dezelfde vorm als wereld 01, gevoed uit dezelfde dagenlijst die de
 * ringcarrousel gebruikt. Drie verschillende aanbieders in de waaier, zodat
 * er niet drie keer dezelfde boot staat.
 */
export function HomeActivities({
  days,
  locale = 'nl',
  base,
}: {
  days: { date?: string; items: FeedItem[] }[]
  locale?: string
  base: string
}) {
  const kaarten: CollageKaart[] = []
  // Op event ontdubbelen en niet op aanbieder: er zijn maar zes
  // landaanbieders, en met een tegel per aanbieder had de carrousel niets te
  // draaien. Emove verkoopt buggy, quad en motocross -- dat zijn drie
  // verschillende dingen om te laten zien.
  const gezien = new Set<string>()
  for (const d of days) {
    for (const it of d.items || []) {
      // Alleen wat op het land gebeurt: grotten, buggy's, quads, jeepsafari's,
      // markten. Jetski's, boottochten en ferry's horen bij de waterwereld --
      // zie activity-split.ts, dat splitst per event en niet per aanbieder,
      // omdat twee aanbieders allebei verkopen.
      if (!isOpHetLand(it.ct_venues?.typeSlug, it.ct_events?.name || it.name || '')) continue
      const beeld = it.ct_events?.cover || it.ct_events?.logo || ''
      const venue = it.ct_venues?.slug || ''
      const slug = it.ct_events?.slug || ''
      if (!beeld || !venue || !slug || gezien.has(slug)) continue
      gezien.add(slug)
      kaarten.push({
        // eventBasePath zit al in de feed: een boottocht onder /club-tickets
        // zetten is een gegarandeerde 404.
        href: `${base}/${it.ct_venues?.basePath || 'boat-trip'}/${venue}/${slug}`,
        image: beeld,
        alt: it.ct_events?.name || it.name || '',
        badge: (it.prices || '').split('-')[0].trim() || undefined,
      })
      if (kaarten.length === 10) break
    }
    if (kaarten.length === 10) break
  }

  return (
    <HomeCircleCollage
      id="zone-island"
      kaarten={kaarten}
      titel={t(L.titel, locale)}
      kicker={t(L.kicker, locale)}
      tekst={t(L.tekst, locale)}
      knop={t(L.knop, locale)}
      href={`${base}/activities-calendar`}
      kleur="#C8A24A"
      schaduw="rgba(200,162,74,.7)"
      className="bg-neutral-50"
    />
  )
}
