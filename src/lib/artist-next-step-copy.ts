import type { Locale } from '@/lib/seo'

/**
 * Tekst voor het vervolgblok onderaan een artiestpagina.
 *
 * Waarom dit bestaat: de 128 artiestpagina's zijn na de venuepagina's het
 * grootste paginatype van de site, en binnen `<main>` gemeten hadden ze twee
 * uitgaande links. Dat is dezelfde doodlopende weg als eerder bij de plaats- en
 * venuepagina's, en het is bovendien precies het profiel dat Google op
 * "ontdekt, momenteel niet geïndexeerd" zet: een pagina die bestaat, maar
 * nergens heen wijst en dus ook geen crawlbudget verdient.
 *
 * Wat hier NIET staat: geen vergelijking tussen artiesten en geen "vergelijkbare
 * muziek". De feed draagt geen genre per artiest, en de line-ups zijn niet te
 * ontleden tot losse namen (zie CLAUDE.md). Wat we wél waar kunnen maken is
 * simpel: wie speelt er binnenkort nog meer, wanneer, waar en wat kost het.
 */

type T5 = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T5 => ({ nl, en, de, es, fr })

export interface ArtistNextStepCopy {
  heading: string
  intro: (n: number) => string
  from: string
  tickets: string
  allArtists: string
  calendar: string
}

export const ARTIST_NEXT_STEP_COPY: Record<Locale, ArtistNextStepCopy> = {
  nl: {
    heading: 'Wie er binnenkort nog meer speelt',
    intro: (n) => `${n} andere namen op de agenda waarvoor we nu tickets verkopen, met de eerstvolgende datum, de club en de entreeprijs.`,
    from: 'vanaf',
    tickets: 'Tickets',
    allArtists: 'Alle artiesten',
    calendar: 'Hele agenda',
  },
  en: {
    heading: 'Who else is playing soon',
    intro: (n) => `${n} other names on the calendar we sell tickets for right now, with the next date, the club and the entry price.`,
    from: 'from',
    tickets: 'Tickets',
    allArtists: 'All artists',
    calendar: 'Full calendar',
  },
  de: {
    heading: 'Wer demnächst noch spielt',
    intro: (n) => `${n} weitere Namen im Kalender, für die wir gerade Tickets verkaufen, mit dem nächsten Termin, dem Club und dem Eintrittspreis.`,
    from: 'ab',
    tickets: 'Tickets',
    allArtists: 'Alle Künstler',
    calendar: 'Ganzer Kalender',
  },
  es: {
    heading: 'Quién más actúa próximamente',
    intro: (n) => `${n} nombres más en la agenda para los que vendemos entradas ahora mismo, con la próxima fecha, el club y el precio de entrada.`,
    from: 'desde',
    tickets: 'Entradas',
    allArtists: 'Todos los artistas',
    calendar: 'Agenda completa',
  },
  fr: {
    heading: 'Qui joue bientôt aussi',
    intro: (n) => `${n} autres noms à l’agenda pour lesquels nous vendons des billets en ce moment, avec la prochaine date, le club et le prix d’entrée.`,
    from: 'à partir de',
    tickets: 'Billets',
    allArtists: 'Tous les artistes',
    calendar: 'Agenda complet',
  },
}
