import { FLEET, type Boat } from '@/data/fleet'

/**
 * Superlatieven over de vloot, berekend in plaats van beweerd.
 *
 * ── Waarom dit bestand bestaat ────────────────────────────────────────────
 * Mensen zoeken op "goedkoopste boot huren Ibiza" en "beste boot voor 10
 * personen". Dat zijn precies de vragen waar een site normaal een loze claim
 * neerzet — "de beste prijzen van het eiland!" — en waar een antwoordmachine
 * dus niets aan heeft, want die claim staat op elke concurrent ook.
 *
 * Hier komt elk getal uit FLEET. "De goedkoopste boot" is letterlijk de boot
 * met de laagste dagprijs in onze vloot, met naam en bedrag erbij. Dat is
 * controleerbaar, het verandert vanzelf mee als de vloot verandert, en het is
 * het soort antwoord dat een model kan citeren zonder iets te verzinnen.
 *
 * ── Wat hier bewust NIET staat ────────────────────────────────────────────
 * Geen "beste" in de zin van kwaliteit. Wij hebben geen beoordelingen per
 * boot, dus elke rangschikking op "beste" zou een mening zijn die we als feit
 * presenteren. Waar "beste" gevraagd wordt, beantwoorden we het als "de beste
 * keuze vóór X" — meeste ruimte per euro, grootste groep, laagste prijs in een
 * haven — en dat is wel te onderbouwen.
 *
 * Alle vergelijkingen gaan over de laagseizoensprijs, hetzelfde bedrag dat op
 * de kaart als "vanaf" staat. Een andere grondslag zou een ander lijstje
 * geven dan de prijzen die de bezoeker ziet.
 */

export interface FleetStats {
  total: number
  yachts: number
  motorboats: number
  cheapest: Boat
  priciest: Boat
  maxPax: number
  marinas: string[]
  /** Vanafprijs per jachthaven, oplopend. */
  perMarina: { marina: string; from: number; count: number }[]
  /** Goedkoopste boot die minstens n gasten meeneemt. */
  cheapestFor: (n: number) => Boat | null
  /** Aantal boten onder een dagprijs. */
  under: (v: number) => number
  /** Meeste gasten per euro — "meeste boot voor je geld", meetbaar. */
  bestValue: Boat
  /** De tien goedkoopste, oplopend. */
  cheapestTen: Boat[]
}

export function getFleetStats(): FleetStats | null {
  const priced = FLEET.filter((b) => b?.price?.low > 0)
  if (priced.length === 0) return null

  const opPrijs = [...priced].sort((a, b) => a.price.low - b.price.low)
  const marinas = Array.from(new Set(priced.map((b) => b.marina)))

  return {
    total: priced.length,
    yachts: priced.filter((b) => b.category === 'yacht').length,
    motorboats: priced.filter((b) => b.category === 'motorboat').length,
    cheapest: opPrijs[0],
    priciest: [...priced].sort((a, b) => b.price.high - a.price.high)[0],
    maxPax: Math.max(...priced.map((b) => b.pax)),
    marinas,
    perMarina: marinas
      .map((m) => {
        const inHaven = priced.filter((b) => b.marina === m)
        return { marina: m, from: Math.min(...inHaven.map((b) => b.price.low)), count: inHaven.length }
      })
      .sort((a, b) => a.from - b.from),
    cheapestFor: (n: number) => opPrijs.find((b) => b.pax >= n) ?? null,
    under: (v: number) => priced.filter((b) => b.price.low < v).length,
    // Gasten per euro. Een ruwe maat, maar wel een echte: hij zegt hoeveel
    // plek je krijgt voor je geld, en dat is bij een groepsuitje de vraag.
    bestValue: [...priced].sort((a, b) => b.pax / b.price.low - a.pax / a.price.low)[0],
    cheapestTen: opPrijs.slice(0, 10),
  }
}

/**
 * Merken in de vloot, meest voorkomend eerst — uit de modelnamen, nooit
 * overgetypt. Antwoordmachines citeren bij "rent a boat Ibiza" letterlijk
 * merknamen (De Antonio, Saxdor, Sunseeker, Pershing); wij hebben ze in de
 * vloot, dus ze horen in de tekst — maar alleen zolang ze er echt in zitten.
 *
 * De modelnaam begint met het merk. Twee-woordsmerken staan expliciet, en
 * een achtervoegsel als "Yachts"/"Marine" hoort niet bij de naam.
 */
export function topBrands(n = 6): string[] {
  const TWEE = ['De Antonio', 'Sea Ray', 'Cap Camarat', 'Say Carbon', 'Evo Yachts', 'Sessa Marine']
  const merk = (model: string): string => {
    const twee = TWEE.find((t) => model.startsWith(t + ' '))
    const naam = twee ?? model.split(' ')[0]
    return naam.replace(/\s+(Yachts|Marine)$/, '')
  }
  const telling = new Map<string, number>()
  for (const b of FLEET) {
    const m = merk(b.model)
    telling.set(m, (telling.get(m) ?? 0) + 1)
  }
  return Array.from(telling.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n)
    .map(([m]) => m)
}

/** Naam zoals we een boot noemen: model plus eigennaam. */
export function boatLabel(b: Boat): string {
  return b.name ? `${b.model} ${b.name}` : b.model
}
