'use client'

import { FLEET } from '@/data/fleet'
import { HomeCircleCollage, type CollageKaart } from './HomeCircleCollage'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  kicker: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  titel: T('Private Boat Rental', 'Private Boat Rental', 'Private Boat Rental', 'Private Boat Rental', 'Private Boat Rental'),
  tekst: T(
    '94 boten met live beschikbaarheid — van dagboot tot superjacht.',
    '94 boats with live availability — from day boat to superyacht.',
    '94 Boote mit Live-Verfügbarkeit — vom Tagesboot bis zur Superyacht.',
    '94 barcos con disponibilidad en vivo — de lancha a superyate.',
    '94 bateaux avec disponibilité en direct — du day-boat au superyacht.',
  ),
  knop: T('Bekijk de vloot', 'See the fleet', 'Flotte ansehen', 'Ver la flota', 'Voir la flotte'),
}

/**
 * Wereld 02: de eigen vloot, als collage met cirkel.
 *
 * Boten gesorteerd van goedkoop naar duur, zodat de carrousel je van de sloep
 * van 680 naar het superjacht draagt. Elke tegel draagt de dagprijs.
 */
export function HomeBoats({ locale = 'nl', base }: { locale?: string; base: string }) {
  const kaarten: CollageKaart[] = [...FLEET]
    .filter(b => b.image && b.price?.low)
    .sort((a, b) => a.price.low - b.price.low)
    .filter((b, i, a) => a.findIndex(x => x.image === b.image) === i)
    .slice(0, 12)
    .map(b => ({
      href: `${base}/private-boat-charters`,
      image: b.image,
      alt: b.name ? `${b.model} ${b.name}` : b.model,
      badge: `€${b.price.low.toLocaleString('nl-NL')}`,
    }))

  return (
    <HomeCircleCollage
      id="zone-water"
      kaarten={kaarten}
      titel={t(L.titel, locale)}
      kicker={t(L.kicker, locale)}
      tekst={t(L.tekst, locale)}
      knop={t(L.knop, locale)}
      href={`${base}/private-boat-charters`}
      kleur="#0E7C66"
      schaduw="rgba(14,124,102,.75)"
      className="bg-white"
    />
  )
}
