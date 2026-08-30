import type { Locale } from './seo'

// ── Venue background, keyed by venue slug (5 locales) ─────────────────────
// Rendered on the venue detail template below the existing content. A sibling
// of ./sailing-routes.ts and ./page-faq.ts and bound by the same guardrails,
// plus one that matters especially here.
//
// HARD RULE — NO DATES. No founding years, no opening years, no "since 19xx",
// no former names unless the change is universally known, no capacities, no
// prices, no ownership claims we are not sure of. A wrong founding year is
// exactly the sort of statement an answer engine repeats forever, and the
// island's clubbing history is full of near-misses: venues that changed name,
// changed site, closed and reopened. Where a fact is genuinely well
// established it is stated plainly; where it is not, it is simply left out and
// the paragraph says something true instead.
//
// What IS safe and is what these paragraphs lean on: where a venue physically
// is, what kind of space it occupies (open-air, indoor, poolside, theatre),
// what it is known for musically or as an experience, and how it relates to
// the rest of the island. Those are stable and observable.
//
// Venues deliberately NOT covered: several clubbing venues in the data set are
// omitted because we could not write about them without guessing. Rendering
// nothing is correct — the component returns null for an unknown slug.
//
// Every entry carries one honest note, in the spirit of the sailing routes.
// Do not edit those out.

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export type ClubHistory = {
  /** What the venue is and where it sits. */
  what: T
  /** What it is known for. */
  known: T
  /** How it fits into the island as a whole. */
  fits: T
  /** One honest limitation or caveat. */
  note: T
}

export const HISTORY_HEADING: T = L(
  'De achtergrond van deze locatie',
  'The story behind this venue',
  'Die Geschichte dieser Location',
  'La historia de este local',
  'L’histoire de ce lieu',
)

export const HISTORY_LABELS = {
  known: L('Waar het om bekendstaat', 'What it is known for', 'Wofür es bekannt ist', 'Por lo que se conoce', 'Ce pour quoi il est connu'),
  fits: L('Plek op het eiland', 'Where it fits on the island', 'Rolle auf der Insel', 'Su lugar en la isla', 'Sa place sur l’île'),
  note: L('Eerlijk erbij', 'Honest note', 'Ehrlich dazu', 'Con honestidad', 'En toute franchise'),
}

export const HISTORY_DISCLAIMER: T = L(
  'Deze achtergrond is beschrijvend en bewust zonder jaartallen: programmering, openingsdagen en concepten veranderen per seizoen, en de actuele agenda hierboven is leidend. Wij zijn geen eigenaar van deze locatie.',
  'This background is descriptive and deliberately carries no years: programming, opening days and concepts change every season, and the live schedule above is what counts. We do not own or operate this venue.',
  'Dieser Hintergrund ist beschreibend und bewusst ohne Jahreszahlen: Programm, Öffnungstage und Konzepte ändern sich jede Saison, maßgeblich ist der Live-Kalender oben. Wir sind nicht Betreiber dieser Location.',
  'Este contexto es descriptivo y va deliberadamente sin años: la programación, los días de apertura y los conceptos cambian cada temporada, y manda la agenda en directo de arriba. No somos propietarios de este local.',
  'Ce contexte est descriptif et volontairement sans dates : la programmation, les jours d’ouverture et les concepts changent chaque saison, et c’est l’agenda en direct ci-dessus qui fait foi. Nous ne sommes pas l’exploitant de ce lieu.',
)

export const CLUB_HISTORY: Record<string, ClubHistory> = {}

/** Safe lookup used by the component — unknown slugs render nothing. */
export function clubHistory(slug?: string): ClubHistory | null {
  if (!slug) return null
  return CLUB_HISTORY[slug] ?? null
}
