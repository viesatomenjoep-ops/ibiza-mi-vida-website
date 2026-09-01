'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Anchor, ArrowRight, MapPin, Users } from 'lucide-react'
import { FLEET, type Boat } from '@/data/fleet'

type L5 = Record<string, string>

const KICKER: L5 = {
  nl: 'Op het water', en: 'On the water', de: 'Auf dem Wasser', es: 'En el agua', fr: 'Sur l’eau',
}
const TITLE: L5 = {
  nl: 'Kies uit onze 94 boten',
  en: 'Choose from our 94 boats',
  de: 'Wähle aus unseren 94 Booten',
  es: 'Elige entre nuestros 94 barcos',
  fr: 'Choisissez parmi nos 94 bateaux',
}
const SUB: L5 = {
  nl: 'Van een dagboot voor z’n tweeën tot een superjacht met crew — met live beschikbaarheid per dag. Dit is een greep; de hele vloot staat een klik verderop.',
  en: 'From a day boat for two to a crewed superyacht — with live availability per day. This is a taste; the full fleet is one click away.',
  de: 'Vom Tagesboot für zwei bis zur Superyacht mit Crew — mit Live-Verfügbarkeit pro Tag. Das ist eine Auswahl; die ganze Flotte ist einen Klick entfernt.',
  es: 'Desde una lancha para dos hasta un superyate con tripulación — con disponibilidad en vivo por día. Esto es una muestra; la flota completa está a un clic.',
  fr: 'Du day-boat pour deux au superyacht avec équipage — avec disponibilité en direct par jour. Voici un aperçu ; toute la flotte est à un clic.',
}
const CTA: L5 = {
  nl: 'Bekijk alle 94 boten', en: 'See all 94 boats', de: 'Alle 94 Boote ansehen',
  es: 'Ver los 94 barcos', fr: 'Voir les 94 bateaux',
}
const FROM: L5 = { nl: 'vanaf', en: 'from', de: 'ab', es: 'desde', fr: 'dès' }
const PER_DAY: L5 = { nl: '/ dag', en: '/ day', de: '/ Tag', es: '/ día', fr: '/ jour' }

/**
 * De selectie: bewust dure én goedkope boten door elkaar.
 *
 * Gesorteerd op prijs pakken we de vier duurste, de vier goedkoopste en vier
 * uit het midden, en vlechten die om en om — een Ferretti 920 naast een
 * dagboot van €680. Dat contrast is het verhaal: er is hier iets voor elke
 * groep en elke portemonnee, en dat vertelt een rij van twaalf gemengde
 * tegels beter dan welke tekst ook.
 *
 * Deterministisch, geen Math.random(): dezelfde build toont dezelfde rij,
 * anders geeft elke hydration een andere volgorde dan de server-HTML.
 */
function selectie(): Boat[] {
  const opPrijs = [...FLEET].sort((a, b) => b.price.high - a.price.high)
  const duur = opPrijs.slice(0, 4)
  const goedkoop = opPrijs.slice(-4).reverse()
  const midStart = Math.floor(opPrijs.length / 2) - 2
  const midden = opPrijs.slice(midStart, midStart + 4)
  const rij: Boat[] = []
  for (let i = 0; i < 4; i++) {
    rij.push(duur[i], goedkoop[i], midden[i])
  }
  return rij.filter(Boolean)
}

const fmt = (n: number, locale: string) =>
  n.toLocaleString(({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as L5)[locale] || 'en-GB')

/**
 * Tegel-carrousel met een greep uit de vloot, voor de homepage.
 *
 * Zelfde rail-patroon als de event-sliders (snap-x, hide-scrollbar) zodat het
 * als één familie voelt. Elke tegel linkt rechtstreeks naar het dossier van die boot —
 * op uitdrukkelijk verzoek: het plaatje van een advertentie hoort naar de
 * advertentie zelf te leiden. Vanaf het dossier is de vloot (met selectors en
 * live beschikbaarheid) één klik via de terugknop. De carrousel zelf toont alleen wat een voorbijganger
 * nodig heeft om te blijven hangen: foto, naam, haven en de vanafprijs.
 *
 * Staat NIET bij de eventsecties bovenaan: dit hoort in de bootzone van de
 * homepage, na de rentals-sectie.
 */
export function HomeFleetCarousel({ locale = 'nl' }: { locale?: string }) {
  const boten = selectie()
  if (boten.length === 0) return null
  const base = `/${locale}`

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4 px-4 md:px-8">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-ibiza-green">
              <Anchor size={13} /> {KICKER[locale] || KICKER.en}
            </span>
            <h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-neutral-900 md:text-5xl">
              {TITLE[locale] || TITLE.en}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
              {SUB[locale] || SUB.en}
            </p>
          </div>
          <Link
            href={`${base}/private-boat-charters`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-ibiza-green active:scale-[0.98]"
          >
            {CTA[locale] || CTA.en} <ArrowRight size={16} />
          </Link>
        </div>

        <div
          className="hide-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:gap-5 md:px-8"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {boten.map((b) => (
            <Link
              key={b.slug}
              href={`${base}/private-boat-charters/dossier/${b.slug}`}
              className="group relative w-[240px] shrink-0 snap-start overflow-hidden rounded-3xl border border-black/10 bg-neutral-50 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-ibiza-green hover:shadow-xl md:w-[280px]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={b.image}
                  alt={`${b.model} ${b.name ?? ''}`}
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm ring-1 ring-white/15">
                  <Users size={11} className="text-ibiza-green" /> {b.pax}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  <MapPin size={10} className="text-ibiza-green" /> {b.marina}
                </div>
                <h3 className="mt-0.5 truncate font-serif text-[15px] font-bold leading-tight text-neutral-900">
                  {b.model}{b.name && <span className="text-ibiza-green"> {b.name}</span>}
                </h3>
                <p className="mt-1.5 text-sm text-neutral-600">
                  <span className="text-xs">{FROM[locale] || FROM.en}</span>{' '}
                  <span className="font-serif text-lg font-black text-neutral-900">€{fmt(b.price.low, locale)}</span>{' '}
                  <span className="text-xs text-neutral-400">{PER_DAY[locale] || PER_DAY.en}</span>
                </p>
              </div>
            </Link>
          ))}
          <div className="w-4 shrink-0 md:w-8" />
        </div>
      </div>
    </section>
  )
}
