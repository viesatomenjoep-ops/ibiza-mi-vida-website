import type { Locale } from '@/lib/seo'

/**
 * Tekst voor het boekblok onderaan een plaatspagina.
 *
 * Waarom dit bestaat: de 23 plaatspagina's hadden géén enkele vervolgstap in de
 * pagina zelf. De enige links in `<main>` waren "terug naar alle plaatsen" en
 * vier andere plaatspagina's — geen agenda, geen ticket, geen boot. Search
 * Console laat zien dat die pagina's vertoningen krijgen (es-canar 67,
 * playa-den-bossa 22), dus mensen komen binnen, lezen en kunnen vervolgens
 * niets. Dat is letterlijk de klacht "bezoekers dwalen".
 *
 * Wat hier NIET staat is even belangrijk: geen claim dat een club "vlakbij" is.
 * De ClubTickets-venues hebben geen adresveld, en de plaatsnaam komt maar bij 5
 * van de 21 plaatsen ergens in de venuetekst voor — voor Playa d'en Bossa zou
 * die match Ushuaïa en Hï juist missen. Een gegokte afstand stuurt iemand naar
 * de verkeerde kant van het eiland; dezelfde regel als bij de jetski-vertrekken.
 * Dus: wat er de komende dagen te doen is op het eiland, zonder afstandsbelofte.
 */

type T5 = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T5 => ({ nl, en, de, es, fr })

export interface PlaceNextStepCopy {
  /** Kop boven het blok, met de plaatsnaam erin. */
  heading: (plaats: string) => string
  /** Eén regel eronder: wat dit blok is, zonder nabijheid te beloven. */
  introIbiza: (n: number) => string
  introFormentera: string
  /** Label bij de entreeprijs. */
  from: string
  /** Knop op een avondkaart. */
  tickets: string
  /** Knop op een overtochtkaart. */
  crossing: string
  /** Links naar de bredere routes. */
  moreCalendar: string
  moreWeek: string
  moreBoats: string
  moreFerry: string
  /** Niets gepland in het venster — dan sturen we door in plaats van leeg te laten. */
  nothingScheduled: string
}

export const PLACE_NEXT_STEP_COPY: Record<Locale, PlaceNextStepCopy> = {
  nl: {
    heading: (p) => `Van ${p} naar een avond die geboekt is`,
    introIbiza: (n) =>
      `${n} avonden op Ibiza waarvoor we nu tickets verkopen, met de datum en de entreeprijs erbij. Niet per se in deze plaats — de clubs liggen verspreid over het eiland.`,
    introFormentera: 'Overtochten naar Formentera waarvoor we nu tickets verkopen, met datum en prijs.',
    from: 'vanaf',
    tickets: 'Tickets',
    crossing: 'Overtocht',
    moreCalendar: 'Hele clubagenda',
    moreWeek: 'Wat er deze week speelt',
    moreBoats: 'Privéboot huren',
    moreFerry: 'Ferry naar Formentera',
    nothingScheduled: 'Voor de komende dagen staat er niets in de agenda. In de volledige agenda staat wat er verderop in het seizoen is.',
  },
  en: {
    heading: (p) => `From ${p} to a night you have booked`,
    introIbiza: (n) =>
      `${n} nights on Ibiza we sell tickets for right now, with the date and the entry price. Not necessarily in this place — the clubs are spread across the island.`,
    introFormentera: 'Crossings to Formentera we sell tickets for right now, with date and price.',
    from: 'from',
    tickets: 'Tickets',
    crossing: 'Crossing',
    moreCalendar: 'Full club calendar',
    moreWeek: 'What is on this week',
    moreBoats: 'Private boat charter',
    moreFerry: 'Ferry to Formentera',
    nothingScheduled: 'Nothing is scheduled for the next few days. The full calendar shows what is on later in the season.',
  },
  de: {
    heading: (p) => `Von ${p} zu einem gebuchten Abend`,
    introIbiza: (n) =>
      `${n} Abende auf Ibiza, für die wir gerade Tickets verkaufen, mit Datum und Eintrittspreis. Nicht zwingend an diesem Ort — die Clubs liegen über die ganze Insel verteilt.`,
    introFormentera: 'Überfahrten nach Formentera, für die wir gerade Tickets verkaufen, mit Datum und Preis.',
    from: 'ab',
    tickets: 'Tickets',
    crossing: 'Überfahrt',
    moreCalendar: 'Ganzer Clubkalender',
    moreWeek: 'Was diese Woche läuft',
    moreBoats: 'Privatboot mieten',
    moreFerry: 'Fähre nach Formentera',
    nothingScheduled: 'Für die nächsten Tage steht nichts im Kalender. Der vollständige Kalender zeigt, was später in der Saison läuft.',
  },
  es: {
    heading: (p) => `De ${p} a una noche ya reservada`,
    introIbiza: (n) =>
      `${n} noches en Ibiza para las que vendemos entradas ahora mismo, con la fecha y el precio de entrada. No necesariamente en este lugar: los clubs están repartidos por toda la isla.`,
    introFormentera: 'Travesías a Formentera para las que vendemos billetes ahora mismo, con fecha y precio.',
    from: 'desde',
    tickets: 'Entradas',
    crossing: 'Travesía',
    moreCalendar: 'Agenda completa de clubs',
    moreWeek: 'Qué hay esta semana',
    moreBoats: 'Alquiler de barco privado',
    moreFerry: 'Ferry a Formentera',
    nothingScheduled: 'No hay nada programado para los próximos días. La agenda completa muestra qué hay más adelante en la temporada.',
  },
  fr: {
    heading: (p) => `De ${p} à une soirée réservée`,
    introIbiza: (n) =>
      `${n} soirées à Ibiza pour lesquelles nous vendons des billets en ce moment, avec la date et le prix d’entrée. Pas forcément dans ce lieu : les clubs sont répartis sur toute l’île.`,
    introFormentera: 'Traversées vers Formentera pour lesquelles nous vendons des billets en ce moment, avec date et prix.',
    from: 'à partir de',
    tickets: 'Billets',
    crossing: 'Traversée',
    moreCalendar: 'Calendrier complet des clubs',
    moreWeek: 'Ce qui se passe cette semaine',
    moreBoats: 'Location de bateau privé',
    moreFerry: 'Ferry pour Formentera',
    nothingScheduled: 'Rien n’est programmé pour les prochains jours. Le calendrier complet montre la suite de la saison.',
  },
}
