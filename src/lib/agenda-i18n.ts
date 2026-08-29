import type { Locale } from './seo'

// Localized header copy for the 5 category agenda pages (WaterAgendaClient).
type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface AgendaCopy { title: T; subtitle: T; kicker: T }

const YEAR = new Date().getFullYear()

export const AGENDA_COPY: Record<string, AgendaCopy> = {
  activities: {
    kicker: L(`Ibiza Activiteiten ${YEAR}`, `Ibiza Activities ${YEAR}`, `Ibiza Aktivitäten ${YEAR}`, `Actividades Ibiza ${YEAR}`, `Activités Ibiza ${YEAR}`),
    title: L('Activiteiten', 'Activities', 'Aktivitäten', 'Actividades', 'Activités'),
    subtitle: L(
      'Alle activiteiten in Ibiza per dag, week en maand — direct te boeken via ClubTickets.',
      'Every activity in Ibiza by day, week and month — book instantly via ClubTickets.',
      'Alle Aktivitäten auf Ibiza pro Tag, Woche und Monat — direkt buchbar über ClubTickets.',
      'Todas las actividades en Ibiza por día, semana y mes — reserva al instante vía ClubTickets.',
      'Toutes les activités à Ibiza par jour, semaine et mois — réservation immédiate via ClubTickets.',
    ),
  },
  tours: {
    kicker: L(`Ibiza Tours ${YEAR}`, `Ibiza Tours ${YEAR}`, `Ibiza Touren ${YEAR}`, `Tours Ibiza ${YEAR}`, `Tours Ibiza ${YEAR}`),
    title: L('Tours', 'Tours', 'Touren', 'Tours', 'Tours'),
    subtitle: L(
      'Alle tours en excursies in Ibiza per dag, week en maand — direct te boeken via ClubTickets.',
      'Every tour and excursion in Ibiza by day, week and month — book instantly via ClubTickets.',
      'Alle Touren und Ausflüge auf Ibiza pro Tag, Woche und Monat — direkt buchbar über ClubTickets.',
      'Todos los tours y excursiones en Ibiza por día, semana y mes — reserva al instante vía ClubTickets.',
      'Tous les tours et excursions à Ibiza par jour, semaine et mois — réservation immédiate via ClubTickets.',
    ),
  },
  'water-sports': {
    kicker: L(`Ibiza Watersport ${YEAR}`, `Ibiza Water Sports ${YEAR}`, `Ibiza Wassersport ${YEAR}`, `Deportes Acuáticos ${YEAR}`, `Sports Nautiques ${YEAR}`),
    title: L('Watersport', 'Water Sports', 'Wassersport', 'Deportes Acuáticos', 'Sports Nautiques'),
    subtitle: L(
      'Alle watersport-activiteiten in Ibiza per dag, week en maand — direct te boeken via ClubTickets.',
      'Every water sports activity in Ibiza by day, week and month — book instantly via ClubTickets.',
      'Alle Wassersport-Aktivitäten auf Ibiza pro Tag, Woche und Monat — direkt buchbar über ClubTickets.',
      'Todas las actividades acuáticas en Ibiza por día, semana y mes — reserva al instante vía ClubTickets.',
      'Toutes les activités nautiques à Ibiza par jour, semaine et mois — réservation immédiate via ClubTickets.',
    ),
  },
  'ferry-formentera': {
    kicker: L(`Ferry Formentera ${YEAR}`, `Formentera Ferry ${YEAR}`, `Formentera-Fähre ${YEAR}`, `Ferry Formentera ${YEAR}`, `Ferry Formentera ${YEAR}`),
    title: L('Ferry Ibiza — Formentera', 'Ferry Ibiza to Formentera', 'Fähre Ibiza — Formentera', 'Ferry Ibiza — Formentera', 'Ferry Ibiza — Formentera'),
    subtitle: L(
      'Bekijk alle afvaarten naar Formentera per dag, week en maand en boek direct via ClubTickets.',
      'See every crossing to Formentera by day, week and month and book instantly via ClubTickets.',
      'Alle Überfahrten nach Formentera pro Tag, Woche und Monat — direkt buchbar über ClubTickets.',
      'Consulta todas las salidas a Formentera por día, semana y mes y reserva al instante vía ClubTickets.',
      'Consultez toutes les traversées vers Formentera par jour, semaine et mois et réservez via ClubTickets.',
    ),
  },
  'boat-trip': {
    kicker: L(`Ibiza Boottochten ${YEAR}`, `Ibiza Boat Trips ${YEAR}`, `Ibiza Bootstouren ${YEAR}`, `Paseos en Barco ${YEAR}`, `Sorties en Bateau ${YEAR}`),
    title: L('Boottochten', 'Boat Trips', 'Bootstouren', 'Paseos en Barco', 'Sorties en Bateau'),
    subtitle: L(
      'Alle boottochten en excursies op Ibiza per dag, week en maand — direct te boeken via ClubTickets.',
      'Every boat trip and excursion in Ibiza by day, week and month — book instantly via ClubTickets.',
      'Alle Bootstouren und Ausflüge auf Ibiza pro Tag, Woche und Monat — direkt buchbar über ClubTickets.',
      'Todos los paseos y excursiones en barco en Ibiza por día, semana y mes — reserva al instante vía ClubTickets.',
      'Toutes les sorties et excursions en bateau à Ibiza par jour, semaine et mois — réservation via ClubTickets.',
    ),
  },
  'boat-party': {
    kicker: L(`Ibiza Boat Party ${YEAR}`, `Ibiza Boat Party ${YEAR}`, `Ibiza Boat Party ${YEAR}`, `Boat Party Ibiza ${YEAR}`, `Boat Party Ibiza ${YEAR}`),
    title: L('Boat Party Ibiza', 'Ibiza Boat Party', 'Boat Party Ibiza', 'Boat Party Ibiza', 'Boat Party Ibiza'),
    subtitle: L(
      'Alle boat parties en feesten op het water per dag, week en maand — met DJ, open bar en zwemstops. Direct te boeken.',
      'Every boat party on the water by day, week and month — with DJ, open bar and swim stops. Book instantly.',
      'Alle Boat Partys auf dem Wasser pro Tag, Woche und Monat — mit DJ, Open Bar und Badestopps. Direkt buchbar.',
      'Todas las boat parties por día, semana y mes — con DJ, barra libre y paradas para nadar. Reserva al instante.',
      'Toutes les boat parties par jour, semaine et mois — avec DJ, open bar et pauses baignade. Réservation immédiate.',
    ),
  },
  'shuttle-ferry': {
    kicker: L(`Shuttle Ferry ${YEAR}`, `Shuttle Ferry ${YEAR}`, `Shuttle-Fähre ${YEAR}`, `Shuttle Ferry ${YEAR}`, `Navette Ferry ${YEAR}`),
    title: L('Shuttle Ferry', 'Shuttle Ferry', 'Shuttle-Fähre', 'Shuttle Ferry', 'Navette Ferry'),
    subtitle: L(
      'Alle shuttle- en watertaxi-afvaarten langs de kust van Ibiza, per dag, week en maand — direct te boeken via ClubTickets.',
      'Every shuttle and water-taxi departure along the Ibiza coast, by day, week and month — book instantly via ClubTickets.',
      'Alle Shuttle- und Wassertaxi-Abfahrten entlang der Küste Ibizas, pro Tag, Woche und Monat — direkt buchbar.',
      'Todas las salidas de lanzadera y taxi acuático por la costa de Ibiza, por día, semana y mes — reserva al instante.',
      'Tous les départs de navettes et taxis de mer le long de la côte d’Ibiza, par jour, semaine et mois.',
    ),
  },
}

export function agendaCopy(page: string, localeRaw: string): { title: string; subtitle: string; kicker: string } {
  const locale = (['nl', 'en', 'de', 'es', 'fr'] as const).includes(localeRaw as Locale) ? (localeRaw as Locale) : 'nl'
  const c = AGENDA_COPY[page]
  return { title: c.title[locale], subtitle: c.subtitle[locale], kicker: c.kicker[locale] }
}
