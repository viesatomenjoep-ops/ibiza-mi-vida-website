import { SITE_URL, type Locale } from '@/lib/seo'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { localesFor, pathFor, type RouteKey } from '@/lib/route-slugs'

/**
 * The people behind the business — single source of truth.
 *
 * This exists for E-E-A-T. Google's quality guidelines weigh "who is
 * responsible for this content" heavily, and until now the site spoke in an
 * anonymous brand voice, which is the weakest possible signal. A named person
 * with a stable @id, referenced as `founder` on the Organization and as
 * `author` on the commercial pages, ties the whole site to a real human.
 *
 * HARD RULE — everything in here must be verifiable.
 * We publish first name, role, that he is based on Ibiza, since when, the
 * languages he works in and the WhatsApp number. We deliberately do NOT
 * publish a surname, a founding year of the company, certifications or a
 * photo, because none of that has been confirmed. Inventing credentials to
 * look more authoritative is precisely the failure mode E-E-A-T is designed to
 * catch, and a fabricated `Person` in structured data is a misrepresentation.
 *
 * To strengthen this later, add — only once confirmed — a surname, a real
 * photo (`image`), a `sameAs` profile link, and a founding year.
 */

export const FOUNDER_ID = `${SITE_URL}/#simon`

/**
 * The year Simon moved to Ibiza. Confirmed by the owner on 2026-09-15 ("woont
 * al 5 jaar op het eiland"), i.e. since 2021.
 *
 * Store the YEAR, never the number of years: "5 years" is true for one season
 * and then quietly wrong forever, and a stale experience claim on an
 * about-page is exactly the kind of thing a quality rater notices. Every
 * sentence that mentions his time on the island derives it from this constant
 * via `yearsOnIbiza()`.
 */
export const ON_ISLAND_SINCE = 2021

/**
 * Whole years on the island, floored, never below 1. Server-rendered pages
 * compute this at render time; the value only changes once a year and the
 * pages revalidate hourly, so nothing can drift. Not for use in a hydrated
 * client component (server and browser could disagree around New Year).
 */
export function yearsOnIbiza(now: Date = new Date()): number {
  return Math.max(1, now.getUTCFullYear() - ON_ISLAND_SINCE)
}

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

/**
 * What Simon can credibly speak to. Rendered visibly on /about-us and emitted
 * as `knowsAbout` on both the Person and the Organization, so an answer
 * engine gets the same topic list from the entity as from the page. Keep this
 * to subjects the site actually has pages for: a `knowsAbout` that claims
 * "Ibiza real estate" while nothing on the site covers it is noise at best.
 */
export const KNOWS_ABOUT: { name: string; label: T; route?: RouteKey; path?: string }[] = [
  {
    name: 'Ibiza nightlife and club tickets',
    label: L('Ibiza-nachtleven en clubtickets', 'Ibiza nightlife and club tickets', 'Ibiza-Nachtleben und Club-Tickets', 'Vida nocturna y entradas de club en Ibiza', 'Vie nocturne et billets de club à Ibiza'),
    route: 'club-tickets-hub',
  },
  {
    name: 'Ibiza club guestlists and VIP tables',
    label: L('Gastenlijsten en VIP-tafels', 'Club guestlists and VIP tables', 'Gästelisten und VIP-Tische', 'Listas de invitados y mesas VIP', 'Guestlists et tables VIP'),
    path: 'guestlist',
  },
  {
    name: 'Boat rental and private boat charters in Ibiza',
    label: L('Boot huren en privécharters', 'Boat rental and private charters', 'Bootsverleih und Privatcharter', 'Alquiler de barcos y chárter privado', 'Location de bateaux et charters privés'),
    path: 'boats',
  },
  {
    name: 'Jet ski rental in Ibiza',
    label: L('Jetski huren', 'Jet ski rental', 'Jetski-Verleih', 'Alquiler de motos de agua', 'Location de jet ski'),
    route: 'jet-ski-rental',
  },
  {
    name: 'Car rental at Ibiza Airport',
    label: L('Autohuur op Ibiza Airport', 'Car rental at Ibiza Airport', 'Mietwagen am Flughafen Ibiza', 'Alquiler de coches en el aeropuerto de Ibiza', 'Location de voiture à l’aéroport d’Ibiza'),
    route: 'car-rental',
  },
  {
    name: 'Formentera ferries and day trips',
    label: L('Formentera-ferry en dagtochten', 'Formentera ferries and day trips', 'Formentera-Fähre und Tagesausflüge', 'Ferry y excursiones a Formentera', 'Ferry et excursions à Formentera'),
    path: 'ferry-formentera',
  },
  {
    name: 'Getting around Ibiza and airport transfers',
    label: L('Vervoer op Ibiza en luchthaventransfers', 'Getting around Ibiza and airport transfers', 'Fortbewegung auf Ibiza und Flughafentransfers', 'Cómo moverse por Ibiza y traslados', 'Se déplacer à Ibiza et transferts aéroport'),
    route: 'getting-around',
  },
]

/**
 * Full href (with locale prefix) for a KNOWS_ABOUT entry. Keyword routes have
 * a different slug per language, so the link goes through route-slugs; a
 * language the route is not published in links to the English page directly
 * rather than to a slug that would 301 — link value through a redirect
 * evaporates. Plain routes share one slug in every language.
 */
export function knowsAboutHref(k: (typeof KNOWS_ABOUT)[number], locale: Locale): string {
  if (k.route) {
    const target = localesFor(k.route).includes(locale) ? locale : 'en'
    return pathFor(k.route, target)
  }
  return `/${locale}/${k.path ?? ''}`
}

export const FOUNDER = {
  /** First name only — no surname has been confirmed. */
  name: 'Simon',
  id: FOUNDER_ID,
  role: L(
    'Oprichter — Ibiza Mi Vida',
    'Founder — Ibiza Mi Vida',
    'Gründer — Ibiza Mi Vida',
    'Fundador — Ibiza Mi Vida',
    'Fondateur — Ibiza Mi Vida',
  ),
  /** Schema.org jobTitle is a stable English label, independent of UI language. */
  jobTitle: 'Founder',
  languages: ['Nederlands', 'English', 'Deutsch', 'Español', 'Français'],
  /**
   * BCP-47 tags for `knowsLanguage`.
   *
   * Bewust geen LOCALES uit lib/seo, ook al staan er nu dezelfde vijf codes.
   * Dit gaat over welke talen Simon zelf spreekt, niet over welke talen de
   * site heeft. Kwam er een zesde sitetaal bij, dan zou hij die niet vanzelf
   * spreken -- en dan zou dit schema een onwaarheid publiceren.
   */
  languageTags: ['nl', 'en', 'de', 'es', 'fr'],
  bio: L(
    'Simon woont op Ibiza en regelt elke boeking persoonlijk via WhatsApp — boten, ferrytickets, clubtickets en package deals. Hij kent de marina’s, de promotors en wat er die avond echt speelt, en zegt het ook wanneer iets niet kan.',
    'Simon lives on Ibiza and arranges every booking personally over WhatsApp — boats, ferry tickets, club tickets and package deals. He knows the marinas, the promoters and what is actually on that night, and he will tell you when something is not possible.',
    'Simon lebt auf Ibiza und organisiert jede Buchung persönlich per WhatsApp — Boote, Fährtickets, Club-Tickets und Package Deals. Er kennt die Marinas, die Promoter und was an dem Abend wirklich läuft — und sagt auch, wenn etwas nicht geht.',
    'Simon vive en Ibiza y gestiona cada reserva personalmente por WhatsApp — barcos, billetes de ferry, entradas de club y package deals. Conoce las marinas, a los promotores y lo que de verdad hay esa noche, y también te dice cuándo algo no es posible.',
    'Simon vit à Ibiza et organise chaque réservation personnellement via WhatsApp — bateaux, billets de ferry, entrées en club et package deals. Il connaît les marinas, les promoteurs et ce qui se passe vraiment ce soir-là, et il vous dit aussi quand quelque chose n’est pas possible.',
  ),
} as const

/**
 * The experience sentence, localised, with the year count computed — never
 * typed. "Lives on Ibiza since 2021 — 5 years on the island." Used by the
 * byline, the about page and llms.txt, so all three always agree.
 */
export function founderExperience(l: Locale, now: Date = new Date()): string {
  const y = yearsOnIbiza(now)
  const s = ON_ISLAND_SINCE
  const t: T = L(
    `Woont sinds ${s} op Ibiza — ${y} jaar op het eiland, elk seizoen ter plaatse bij de marina’s en de clubs.`,
    `Lives on Ibiza since ${s} — ${y} years on the island, on the ground at the marinas and the clubs every season.`,
    `Lebt seit ${s} auf Ibiza — ${y} Jahre auf der Insel, jede Saison vor Ort an den Marinas und in den Clubs.`,
    `Vive en Ibiza desde ${s} — ${y} años en la isla, cada temporada a pie de marina y de club.`,
    `Vit à Ibiza depuis ${s} — ${y} ans sur l’île, chaque saison sur le terrain, dans les marinas et les clubs.`,
  )
  return t[l]
}

/**
 * `Person` node for Simon. Referenced by @id elsewhere, never redeclared with
 * different values: every emitter calls this function, so the entity is
 * identical on every page.
 */
export function founderNode(now: Date = new Date()) {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.jobTitle,
    // English is the entity language; the visible byline carries the locale.
    description: `${FOUNDER.bio.en} ${founderExperience('en', now)}`,
    url: `${SITE_URL}/en/about-us`,
    worksFor: { '@id': `${SITE_URL}/#organization` },
    homeLocation: {
      '@type': 'Place',
      name: 'Ibiza, Spain',
      address: { '@type': 'PostalAddress', addressRegion: 'Ibiza', addressCountry: 'ES' },
    },
    knowsAbout: KNOWS_ABOUT.map((k) => k.name),
    knowsLanguage: FOUNDER.languageTags,
    telephone: `+${WHATSAPP_NUMBER}`,
  }
}
