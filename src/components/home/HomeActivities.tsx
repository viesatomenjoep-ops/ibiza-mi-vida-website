'use client'

import { HomeWorld, type WereldKaart } from './HomeWorld'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  kicker: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  titel: T('Op het water & activiteiten', 'On the water & activities', 'Auf dem Wasser & Aktivitäten', 'En el agua y actividades', 'Sur l’eau & activités'),
  tekst: T(
    'Boottochten, jetski’s, buggy’s, grotten en de ferry naar Formentera. Per dag te boeken, met de prijs zoals die nu in de agenda staat.',
    'Boat trips, jet skis, buggies, caves and the ferry to Formentera. Bookable per day, at the price as it stands in the agenda now.',
    'Bootstouren, Jetskis, Buggys, Höhlen und die Fähre nach Formentera. Pro Tag buchbar, zum aktuellen Preis aus dem Kalender.',
    'Excursiones en barco, motos de agua, buggies, cuevas y el ferry a Formentera. Reservable por día, al precio actual de la agenda.',
    'Sorties en bateau, jet-skis, buggys, grottes et le ferry pour Formentera. Réservable par jour, au prix actuel de l’agenda.',
  ),
  knop: T('Bekijk de activiteitenagenda', 'See the activities calendar', 'Zum Aktivitätenkalender', 'Ver la agenda de actividades', "Voir l'agenda des activités"),
}

interface FeedItem {
  ct_events?: { name?: string; slug?: string; cover?: string; logo?: string }
  ct_venues?: { name?: string; slug?: string; basePath?: string }
  name?: string
}

/**
 * Wereld 02: alles wat geen clubavond is.
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
      id="zone-water"
      nummer="02"
      kicker={t(L.kicker, locale)}
      titel={t(L.titel, locale)}
      tekst={t(L.tekst, locale)}
      knop={t(L.knop, locale)}
      href={`${base}/activities-calendar`}
      kaarten={kaarten}
      className="bg-white"
    />
  )
}
