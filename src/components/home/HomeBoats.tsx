'use client'

import { FLEET } from '@/data/fleet'
import { HomeZoneRail, type ZoneCardData, type ZoneDay } from './HomeZoneRail'
import { addDays } from '@/lib/date-label'

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
  charter: T('Privéboot', 'Private charter', 'Privatcharter', 'Chárter privado', 'Charter privé'),
}

/**
 * Wereld 02: de eigen vloot.
 *
 * Boten zijn dagelijks beschikbaar — geen datumfilter zoals bij de clubavonden
 * — dus alle zeven dagen tonen dezelfde selectie, goedkoop naar duur. Alleen
 * de datumpil op de kaarten schuift mee met de gekozen dag.
 */
export function HomeBoats({ todayStr, locale = 'nl', base }: { todayStr: string; locale?: string; base: string }) {
  const items: ZoneCardData[] = [...FLEET]
    .filter(b => b.image && b.price?.low)
    .sort((a, b) => a.price.low - b.price.low)
    .filter((b, i, a) => a.findIndex(x => x.image === b.image) === i)
    .slice(0, 12)
    .map(b => ({
      href: `${base}/private-boat-charters#boat-${b.slug}`,
      image: b.image,
      title: b.name ? `${b.model} · ${b.name}` : b.model,
      venue: b.marina,
      tag: t(L.charter, locale),
      price: `€${b.price.low.toLocaleString('nl-NL')}`,
    }))

  const days: ZoneDay[] = Array.from({ length: 7 }, (_, i) => ({ iso: addDays(todayStr, i), items }))

  return (
    <HomeZoneRail
      id="zone-water"
      locale={locale}
      bg="#D5EAE2"
      accent="#0E7C66"
      kickerColor="#0E7C66"
      glow={{ x: '10%', y: '20%', color: 'rgba(14,124,102,.12)' }}
      roundedTop
      kicker={t(L.kicker, locale)}
      title={t(L.titel, locale)}
      text={t(L.tekst, locale)}
      ctaLabel={t(L.knop, locale)}
      ctaHref={`${base}/private-boat-charters`}
      days={days}
    />
  )
}
