'use client'

import { HomeWorld, type WereldKaart } from './HomeWorld'
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
  knop: T('Bekijk de activiteitenagenda', 'See the activities calendar', 'Zum Aktivitätenkalender', 'Ver la agenda de actividades', "Voir l'agenda des activités"),
}

interface FeedItem {
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
  const kaarten: WereldKaart[] = []
  const venues = new Set<string>()
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
      if (!beeld || !venue || !slug || venues.has(venue)) continue
      venues.add(venue)
      kaarten.push({
        // eventBasePath zit al in de feed: een boottocht onder /club-tickets
        // zetten is een gegarandeerde 404.
        href: `${base}/${it.ct_venues?.basePath || 'boat-trip'}/${venue}/${slug}`,
        image: beeld,
        alt: it.ct_events?.name || it.name || '',
      })
      if (kaarten.length === 3) break
    }
    if (kaarten.length === 3) break
  }

  return (
    <HomeWorld
      id="zone-island"
      nummer="03"
      kicker={t(L.kicker, locale)}
      titel={t(L.titel, locale)}
      tekst={t(L.tekst, locale)}
      knop={t(L.knop, locale)}
      href={`${base}/activities-calendar`}
      kaarten={kaarten}
      className="bg-neutral-50"
    />
  )
}
