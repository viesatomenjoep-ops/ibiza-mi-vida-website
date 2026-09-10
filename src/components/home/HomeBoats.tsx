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

  const weekVanaf = (vanaf: string): ZoneDay[] =>
    Array.from({ length: 7 }, (_, i) => ({ iso: addDays(vanaf, i), items }))

  const days = weekVanaf(todayStr)

  /**
   * De vloot kent geen agenda: dezelfde boten zijn elke dag te huur, en de
   * beschikbaarheid per datum komt pas bij de makelaar op de bootpagina zelf.
   * Doorbladeren naar een volgende week hoeft hier dus niets op te halen --
   * alleen de zeven knoppen opschuiven, zodat de kiezer zich hetzelfde
   * gedraagt als bij de drie werelden die wél een programma hebben.
   */
  const loadWeek = async (vanaf: string): Promise<ZoneDay[]> => weekVanaf(vanaf)

  return (
    <HomeZoneRail
      id="zone-water"
      locale={locale}
      // Blauw (#8A9DB1) als achtergrond -- de koelste kleur van het blad, en
      // de enige die bij water past zonder in het cliché van zeeblauw te
      // vallen.
      //
      // Dit is met afstand de donkerste van de vier sectietinten (luminantie
      // 0,327 tegen 0,529 tot 0,835). Donkere tekst haalt er 6,61:1 op, dus
      // ruim boven de norm, maar het is wel de enige sectie waar het accent
      // niet ver boven de achtergrond uitkomt: #2C2C2C haalt hier 5,01,
      // tegen 11,77 op blush.
      bg="var(--zone-bg-boats)"
      accent="var(--imv-ink)"
      accentInk="var(--ink-on-accent)"
      kickerColor="var(--imv-ink)"
      glow={{ x: '10%', y: '20%', color: 'rgba(20,20,20,.03)' }}
      roundedTop
      kicker={t(L.kicker, locale)}
      title={t(L.titel, locale)}
      ctaLabel={t(L.knop, locale)}
      ctaHref={`${base}/private-boat-charters`}
      days={days}
      loadWeek={loadWeek}
    />
  )
}
