import { FLEET } from '@/data/fleet'
import type { Locale } from './seo'

/**
 * "From" prices for the rental pages — the single place they are defined.
 *
 * ── Why prices live here and not in page copy ─────────────────────────────
 * A "from €X" figure appears in at least four places per page: the answer-first
 * opening paragraph, the price table, the meta description and the Product
 * Offer in JSON-LD. Written into the copy four times, they drift, and a schema
 * price that disagrees with the visible price is a structured-data violation on
 * top of being a customer complaint. One constant, four consumers.
 *
 * ── The null contract ─────────────────────────────────────────────────────
 * `null` means "we do not have a confirmed figure yet". It is not zero and not
 * a placeholder to be rendered. Every consumer must handle it:
 *
 *   • copy      → renders the sentence without the number, never "from €null"
 *                 and never an invented figure
 *   • schema    → SchemaMarkup emits the Product with NO Offer node
 *   • the table → shows "on request" and points at WhatsApp
 *
 * Filling one in is a one-line change here and it propagates everywhere.
 * Every null is listed in docs/content-todos.md for exactly that reason.
 *
 * HARD RULE: never replace a null with a guess to make a page look finished.
 * A wrong price is the most expensive kind of wrong on a booking site.
 */

export interface FromPrice {
  /** Amount in euros, or null when unconfirmed. */
  amount: number | null
  /** What the amount buys — rendered next to it, so it is never ambiguous. */
  unit: Record<Locale, string>
}

const U = (nl: string, en: string, de: string, es: string, fr: string): Record<Locale, string> =>
  ({ nl, en, de, es, fr })

/**
 * Bootprijzen komen uit de vloot, niet uit dit bestand.
 *
 * Ze stonden hier op `null` en de bootpagina zei zes keer "op aanvraag" —
 * terwijl `src/data/fleet.ts` de echte dagtarieven van eenendertig boten al
 * bevat en de homepage er zijn "vanaf €363" uit haalt. Twee plekken die
 * hetzelfde hadden moeten zeggen, zeiden iets anders.
 *
 * Afleiden in plaats van overtypen, om dezelfde reden als altijd: een boot
 * erbij of een tarief eraf verandert de vanaf-prijs, en een met de hand
 * gekopieerd getal loopt dan stil achter. Dit kan niet verouderen.
 *
 * `boatNoLicence` blijft null. Zonder vaarbewijs betekent maximaal 15 pk, en de
 * vloot legt geen vermogen vast — dus dat cijfer is hier niet af te leiden en
 * we verzinnen het niet.
 */
const lowestDayRate = (predicate: (b: (typeof FLEET)[number]) => boolean): number | null => {
  const rates = FLEET.filter((b) => predicate(b) && b?.price?.low).map((b) => b.price.low)
  return rates.length ? Math.min(...rates) : null
}

/**
 * Wat de partnervloot wél en niet publiceert.
 *
 * Nagevraagd op het endpoint van The Yacht Broker, niet aangenomen: over alle
 * 99 boten bestaan de velden partner, boat, model, port, pax, price {top,
 * high, mid, low}, priceBands, img, pdf en days. Verder niets. De woorden
 * "half", "skipper", "captain" en "licen" komen nul keer voor in het hele
 * antwoord.
 *
 * Daarom staan halve dagen, vaarbewijsvrije boten en schippertarieven hier op
 * null: die cijfers bestaan niet aan de bron, en een verzonnen tarief is op
 * een boekingssite de duurste soort fout. Wat er wél is, is de dagprijs per
 * boot -- en daar zijn deze vier waarden uit af te leiden.
 */
const MOTORBOOT_FROM = lowestDayRate((b) => b.category === 'motorboat')
const JACHT_FROM = lowestDayRate((b) => b.category === 'yacht')
const GROTE_GROEP_FROM = lowestDayRate((b) => b.pax >= 10)
/** Goedkoopste dagtarief in juli/augustus, over de hele vloot. */
const HOOGSEIZOEN_FROM = (() => {
  const rates = FLEET.filter((b) => b?.price?.high).map((b) => b.price.high)
  return rates.length ? Math.min(...rates) : null
})()
/** Goedkoopste boot die je zelf vaart. */
const SELF_DRIVE_FROM = lowestDayRate((b) => b.captainIncluded !== true)

export const RENTAL_PRICES = {
  /**
   * Dagcharter met schipper. Blijft null: de broker voert geen
   * schippertarief, en `captainIncluded` in onze eigen vloot is verouderd en
   * bij geen enkele boot gezet. Zie de toelichting hierboven.
   */
  boatWithSkipper: {
    amount: null,
    unit: U('per dag, met schipper', 'per day, skipper included', 'pro Tag, mit Skipper',
            'por día, con patrón', 'par jour, skipper inclus'),
  },
  /** Licence-free boat (max 15 hp), typically 4–6 people. */
  boatNoLicence: {
    amount: null,
    unit: U('per dag, zonder vaarbewijs', 'per day, no licence needed', 'pro Tag, ohne Führerschein',
            'por día, sin titulación', 'par jour, sans permis'),
  },
  /** Boat you drive yourself, licence required. */
  boatWithLicence: {
    amount: SELF_DRIVE_FROM,
    unit: U('per dag, eigen vaarbewijs', 'per day, your own licence', 'pro Tag, eigener Führerschein',
            'por día, con tu titulación', 'par jour, avec votre permis'),
  },
  /** Jet ski, the standard 30-minute slot. */
  jetSki30: {
    amount: null,
    unit: U('per 30 minuten', 'per 30 minutes', 'pro 30 Minuten', 'por 30 minutos', 'par 30 minutes'),
  },
  /** Car rental, per day, all-inclusive (Wiber). */
  carPerDay: {
    amount: null,
    unit: U('per dag, all-inclusive', 'per day, all-inclusive', 'pro Tag, all-inclusive',
            'por día, todo incluido', 'par jour, tout compris'),
  },
  /** Goedkoopste motorboot (20–50 ft), dagtarief laagseizoen. */
  motorboatDay: {
    amount: MOTORBOOT_FROM,
    unit: U('per dag, laagseizoen', 'per day, low season', 'pro Tag, Nebensaison',
            'por día, temporada baja', 'par jour, basse saison'),
  },
  /** Goedkoopste jacht (50 ft+), dagtarief laagseizoen. */
  yachtDay: {
    amount: JACHT_FROM,
    unit: U('per dag, laagseizoen', 'per day, low season', 'pro Tag, Nebensaison',
            'por día, temporada baja', 'par jour, basse saison'),
  },
  /** Goedkoopste boot die tien personen of meer meeneemt. */
  groupDay: {
    amount: GROTE_GROEP_FROM,
    unit: U('per dag, vanaf 10 personen', 'per day, 10 guests or more', 'pro Tag, ab 10 Personen',
            'por día, desde 10 personas', 'par jour, à partir de 10 personnes'),
  },
  /** Goedkoopste dagtarief in het hoogseizoen. */
  highSeasonDay: {
    amount: HOOGSEIZOEN_FROM,
    unit: U('per dag, juli & augustus', 'per day, July & August', 'pro Tag, Juli & August',
            'por día, julio y agosto', 'par jour, juillet & août'),
  },
  /** Boat party ticket, per person. */
  boatParty: {
    amount: null,
    unit: U('per persoon', 'per person', 'pro Person', 'por persona', 'par personne'),
  },
} satisfies Record<string, FromPrice>

export type PriceKey = keyof typeof RENTAL_PRICES

/** Formatted "€120" or null. Never returns a placeholder string. */
export function formatFrom(key: PriceKey): string | null {
  const p = RENTAL_PRICES[key]
  return typeof p.amount === 'number' ? `€${p.amount}` : null
}

/** The raw number for schema. null => caller must omit the Offer. */
export function priceAmount(key: PriceKey): number | null {
  return RENTAL_PRICES[key].amount
}

/** Every unconfirmed price, for the TODO doc and the content checks. */
export function unconfirmedPrices(): PriceKey[] {
  return (Object.keys(RENTAL_PRICES) as PriceKey[]).filter((k) => RENTAL_PRICES[k].amount === null)
}
