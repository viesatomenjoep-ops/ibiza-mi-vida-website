'use client'

import { FLEET } from '@/data/fleet'
import { HomeWorld, type WereldKaart } from './HomeWorld'

type L5 = Record<string, string>
const T = (nl: string, en: string, de: string, es: string, fr: string): L5 => ({ nl, en, de, es, fr })
const t = (m: L5, l: string) => m[l] || m.en

const L = {
  kicker: T('Alles op één eiland', 'Everything on one island', 'Alles auf einer Insel', 'Todo en una isla', 'Tout sur une île'),
  titel: T('Underwater Experience', 'Underwater Experience', 'Underwater Experience', 'Underwater Experience', 'Underwater Experience'),
  tekst: T(
    'Huur je eigen jacht of catamaran. Vaar langs Es Vedrà, anker in verborgen baaien en beleef Ibiza vanaf het water.',
    'Charter your own yacht or catamaran. Sail past Es Vedrà, anchor in hidden coves and see Ibiza from the water.',
    'Miete deine eigene Yacht oder einen Katamaran. Fahr an Es Vedrà vorbei, ankere in versteckten Buchten und erlebe Ibiza vom Wasser aus.',
    'Alquila tu propio yate o catamarán. Navega junto a Es Vedrà, fondea en calas escondidas y vive Ibiza desde el agua.',
    'Louez votre propre yacht ou catamaran. Naviguez le long d’Es Vedrà, mouillez dans des criques cachées et vivez Ibiza depuis l’eau.',
  ),
  knop: T('Bekijk de vloot', 'See the fleet', 'Flotte ansehen', 'Ver la flota', 'Voir la flotte'),
}

/**
 * Wereld 02: Underwater Experience — de eigen vloot.
 *
 * De waaier toont drie boten uit FLEET, gekozen op prijs zodat er een dure,
 * een middenklasser en een instapper naast elkaar staan. Vaste keuze, geen
 * willekeur: dezelfde build toont dezelfde boten, dus geen hydration-verschil.
 *
 * Alle drie de kaarten wijzen naar de vlootpagina en niet naar een PDF: de
 * filters, de live beschikbaarheid en het dossier staan daar allemaal bij
 * elkaar, en een PDF is een doodlopende steeg vanuit de homepage.
 */
export function HomeBoats({ locale = 'nl', base }: { locale?: string; base: string }) {
  const opPrijs = [...FLEET].filter(b => b.image).sort((a, b) => b.price.high - a.price.high)
  const midden = Math.floor(opPrijs.length / 2)
  const keuze = [opPrijs[0], opPrijs[midden], opPrijs[opPrijs.length - 1]].filter(Boolean)

  const kaarten: WereldKaart[] = keuze.map(b => ({
    href: `${base}/private-boat-charters`,
    image: b.image,
    alt: b.name ? `${b.model} ${b.name}` : b.model,
  }))

  return (
    <HomeWorld
      id="zone-water"
      nummer="02"
      kicker={t(L.kicker, locale)}
      titel={t(L.titel, locale)}
      tekst={t(L.tekst, locale)}
      knop={t(L.knop, locale)}
      href={`${base}/private-boat-charters`}
      kaarten={kaarten}
      className="bg-white"
    />
  )
}
