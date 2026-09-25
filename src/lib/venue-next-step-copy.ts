import type { Locale } from '@/lib/seo'

/**
 * Tekst voor het vervolgblok onderaan een venuepagina.
 *
 * Waarom dit bestaat: de venue- en artiestpagina's zijn het grootste
 * paginatype van de site (99 clubs, 34 activiteiten, 27 boottochten, 16
 * ferry's, plus tours en watersport) en ze liepen dood. Gemeten binnen
 * `<main>` — menu en footer staan op élke pagina en verbergen het probleem,
 * zie CLAUDE.md — had een clubpagina één of twee uitgaande links, en een
 * activiteitenpagina nul: alles wees naar de eigen avonden van die ene venue.
 * Wie via Google op "bibo park ibiza" binnenkwam, kon in de pagina zelf dus
 * nergens heen.
 *
 * Dit is dezelfde ingreep als `<PlaceNextStep>` op de plaatspagina's, en met
 * dezelfde terughoudendheid: geen nabijheidsclaim, geen verzonnen vergelijking
 * tussen venues. Alleen wat we écht verkopen, met datum en entreeprijs, en een
 * link naar onze eigen eventpagina.
 */

type T5 = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T5 => ({ nl, en, de, es, fr })

export interface VenueNextStepCopy {
  /** Kop boven het blok. `soort` is het sectielabel ("Clubs", "Boottochten"). */
  heading: (soort: string) => string
  /** Eén regel eronder, met het aantal kaarten dat er staat. */
  intro: (n: number, soort: string) => string
  from: string
  tickets: string
  /** Link terug naar de categoriepagina. */
  allOf: (soort: string) => string
  /** Link naar de hele agenda. */
  calendar: string
}

export const VENUE_NEXT_STEP_COPY: Record<Locale, VenueNextStepCopy> = {
  nl: {
    heading: (s) => `Andere ${s.toLowerCase()} met datums die wij verkopen`,
    intro: (n, s) => `${n} andere ${s.toLowerCase()} waarvoor we nu tickets verkopen, met de eerstvolgende datum en de entreeprijs.`,
    from: 'vanaf',
    tickets: 'Tickets',
    allOf: (s) => `Alle ${s.toLowerCase()}`,
    calendar: 'Hele agenda',
  },
  en: {
    heading: (s) => `Other ${s.toLowerCase()} with dates we sell`,
    intro: (n, s) => `${n} other ${s.toLowerCase()} we sell tickets for right now, with the next date and the entry price.`,
    from: 'from',
    tickets: 'Tickets',
    allOf: (s) => `All ${s.toLowerCase()}`,
    calendar: 'Full calendar',
  },
  de: {
    heading: (s) => `Weitere ${s} mit Terminen, die wir verkaufen`,
    intro: (n, s) => `${n} weitere ${s}, für die wir gerade Tickets verkaufen, mit dem nächsten Termin und dem Eintrittspreis.`,
    from: 'ab',
    tickets: 'Tickets',
    allOf: (s) => `Alle ${s}`,
    calendar: 'Ganzer Kalender',
  },
  es: {
    heading: (s) => `Otros ${s.toLowerCase()} con fechas que vendemos`,
    intro: (n, s) => `${n} ${s.toLowerCase()} más para los que vendemos entradas ahora mismo, con la próxima fecha y el precio de entrada.`,
    from: 'desde',
    tickets: 'Entradas',
    allOf: (s) => `Todos los ${s.toLowerCase()}`,
    calendar: 'Agenda completa',
  },
  fr: {
    heading: (s) => `Autres ${s.toLowerCase()} avec des dates que nous vendons`,
    intro: (n, s) => `${n} autres ${s.toLowerCase()} pour lesquels nous vendons des billets en ce moment, avec la prochaine date et le prix d’entrée.`,
    from: 'à partir de',
    tickets: 'Billets',
    allOf: (s) => `Tous les ${s.toLowerCase()}`,
    calendar: 'Agenda complet',
  },
}
