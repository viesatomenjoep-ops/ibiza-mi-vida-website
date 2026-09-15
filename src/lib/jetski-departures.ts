import type { Locale } from '@/lib/seo'

/**
 * Vanaf welk strand of welke haven een jetski-aanbieder vertrekt.
 *
 * Waarom dit bestaat: vier aanbieders op drie verschillende plekken is voor een
 * bezoeker geen keuze maar een puzzel. Wie in Playa d'en Bossa zit wil niet
 * naar San Antonio rijden voor een half uur op het water. Door op vertrekplaats
 * te groeperen wordt de dichtstbijzijnde de eerste die je ziet.
 *
 * ── Waar de plaats vandaan komt, in deze volgorde ─────────────────────────
 * 1. De eventnaam in de ClubTickets-feed. Drie van de vier dragen hem daar al
 *    ("Jet Ski in San Antonio - …", "Jet Ski - Playa d'en Bossa"). Dat is de
 *    beste bron: verandert de feed, dan verandert de site mee.
 * 2. `EXTRA_DEPARTURES` hieronder, voor een aanbieder wiens naam geen plaats
 *    noemt. Die waarden zijn overgenomen uit het veld `requirements` van de
 *    feed, waar het vertrekpunt in lopende tekst staat ("Meeting point:
 *    Departure points available: …"). Dat veld is HTML van de partner en per
 *    aanbieder anders opgemaakt, dus het wordt niet geparst maar één keer
 *    gelezen en hier vastgelegd — mét de datum waarop dat is gebeurd.
 * 3. Niets. Dan toont de kaart geen plaats. Een gegokte vertrekplaats is
 *    erger dan geen: iemand rijdt naar de verkeerde kant van het eiland.
 *
 * Controleer `EXTRA_DEPARTURES` bij elke vlootwissel tegen het
 * `requirements`-veld van de betreffende venue in `src/data/clubtickets_*.json`.
 */

/** De plaatsen die we herkennen, met hun label per taal. */
export interface Departure {
  key: string
  label: Record<Locale, string>
}

const DEPARTURES: Departure[] = [
  {
    key: 'san-antonio',
    label: {
      nl: 'San Antonio', en: 'San Antonio', de: 'San Antonio',
      es: 'Sant Antoni', fr: 'San Antonio',
    },
  },
  {
    key: 'playa-den-bossa',
    label: {
      nl: "Playa d'en Bossa", en: "Playa d'en Bossa", de: "Playa d'en Bossa",
      es: "Platja d'en Bossa", fr: "Playa d'en Bossa",
    },
  },
  {
    key: 'ibiza-town',
    label: {
      nl: 'Ibiza-stad (haven)', en: 'Ibiza Town (port)', de: 'Ibiza-Stadt (Hafen)',
      es: 'Ibiza ciudad (puerto)', fr: 'Ibiza-ville (port)',
    },
  },
]

const BY_KEY = new Map(DEPARTURES.map((d) => [d.key, d]))

/** Patronen die in een eventnaam naar een vertrekplaats wijzen. */
const NAME_PATTERNS: { key: string; re: RegExp }[] = [
  { key: 'san-antonio', re: /san\s*antoni(o)?|sant\s*antoni/i },
  { key: 'playa-den-bossa', re: /playa\s*d[’']?en\s*bossa|platja\s*d[’']?en\s*bossa/i },
  { key: 'ibiza-town', re: /ibiza\s*(town|port)|eivissa/i },
]

/**
 * Aanbieders wiens eventnaam geen plaats noemt. Gelezen uit het
 * `requirements`-veld van de feed op 2026-09-15.
 *
 * blue-coral-ibiza: "Departure points available: Ibiza Port, Blue Coral stand
 * at Playa d'en Bossa, in front of Hotel Garbi." — twee vertrekpunten, dus hij
 * hoort onder allebei thuis.
 */
const EXTRA_DEPARTURES: Record<string, string[]> = {
  'blue-coral-ibiza': ['playa-den-bossa', 'ibiza-town'],
}

/**
 * De vertrekplaatsen van één aanbieder, als lijst van sleutels.
 * Leeg betekent: onbekend, en dan toont de kaart geen plaats.
 */
export function departuresFor(venueSlug: string, eventNames: string[]): string[] {
  const found = new Set<string>()
  for (const name of eventNames) {
    for (const p of NAME_PATTERNS) if (p.re.test(name)) found.add(p.key)
  }
  for (const key of EXTRA_DEPARTURES[venueSlug] ?? []) found.add(key)
  // Vaste volgorde, zodat de pagina bij elke build hetzelfde rendert.
  return DEPARTURES.filter((d) => found.has(d.key)).map((d) => d.key)
}

export function departureLabel(key: string, locale: Locale): string | null {
  return BY_KEY.get(key)?.label[locale] ?? null
}

/** Alle plaatsen in vaste volgorde — de volgorde waarin ze op de pagina staan. */
export function departureOrder(): string[] {
  return DEPARTURES.map((d) => d.key)
}
