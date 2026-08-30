import type { Locale } from '@/lib/seo'
import type { CTEventDate } from '@/lib/clubtickets'

/**
 * Search-result descriptions for venue pages, composed from the live agenda.
 *
 * Why this exists: venue pages used the raw ClubTickets venue blurb, hard-cut
 * at 160 characters. Search Console showed the result — 102 Ushuaïa queries,
 * 44 impressions on "ushuaia party" alone, and ZERO clicks across all of them.
 * The snippet Google printed read "Ushuaïa Ibiza informatie Ushuaïa Ibiza is
 * sinds de opening in 2011 de favoriete bestemming voor internationale
 * avonturiers die op het eiland aankomen. Met de gr" — the name twice, then a
 * sentence stopping mid-word. The page ranked; nobody wanted to click it.
 *
 * So the description now answers what those searchers are actually asking:
 * what is on, how much of it, and when the next one is. Those are also the
 * three things that change on every sync, which keeps the snippet fresh.
 *
 * Every number comes from the feed. If there are no upcoming dates we fall back
 * to the venue's own text rather than inventing a count.
 */

type Builder = (venue: string, count: number, next: string) => string

const TEMPLATES: Record<Locale, Builder> = {
  nl: (v, c, d) =>
    `Alle events van ${v} in de agenda: ${c} ${c === 1 ? 'feest' : 'feesten'} gepland, eerstvolgende op ${d}. Bekijk de line-ups en boek officiële tickets.`,
  en: (v, c, d) =>
    `Every ${v} event in one agenda: ${c} ${c === 1 ? 'night' : 'nights'} listed, next one on ${d}. See the line-ups and book official tickets.`,
  de: (v, c, d) =>
    `Alle Events von ${v} im Überblick: ${c} ${c === 1 ? 'Nacht' : 'Nächte'} geplant, die nächste am ${d}. Line-ups ansehen und offizielle Tickets buchen.`,
  es: (v, c, d) =>
    `Todos los eventos de ${v} en una agenda: ${c} ${c === 1 ? 'noche' : 'noches'} programadas, la próxima el ${d}. Consulta los line-ups y reserva entradas oficiales.`,
  fr: (v, c, d) =>
    `Tous les événements de ${v} dans un seul agenda : ${c} ${c === 1 ? 'soirée' : 'soirées'} programmées, la prochaine le ${d}. Line-ups et billets officiels.`,
}

const LOCALE_TAG: Record<Locale, string> = {
  nl: 'nl-NL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR',
}

/** Title suffix. Includes the words people actually search alongside a venue. */
export const VENUE_TITLE_SUFFIX: Record<Locale, string> = {
  nl: 'Agenda, Events & Tickets',
  en: 'Line-up, Events & Tickets',
  de: 'Programm, Events & Tickets',
  es: 'Agenda, Eventos y Entradas',
  fr: 'Agenda, Événements & Billets',
}

/**
 * Compose the description, or return null when there is nothing upcoming — the
 * caller then keeps the venue's own copy rather than claiming "0 events".
 */
export function venueMetaDescription(
  venueName: string,
  upcoming: CTEventDate[],
  locale: Locale,
): string | null {
  if (!upcoming.length) return null

  const dates = upcoming
    .map((d) => d.date)
    .filter((d): d is string => !!d && /^\d{4}-\d{2}-\d{2}/.test(d))
    .sort()
  if (!dates.length) return null

  const [y, m, day] = dates[0].split('-').map(Number)
  const next = new Date(Date.UTC(y, m - 1, day)).toLocaleDateString(LOCALE_TAG[locale], {
    day: 'numeric', month: 'long', timeZone: 'UTC',
  })

  return TEMPLATES[locale](venueName, dates.length, next)
}
