import type { Locale } from '@/lib/seo'

// Localized Service structured-data copy for the commercial category pages.
// Kept apart from the page components so all five locales stay visible in one
// place (same convention as seo-pages.ts) and can't silently diverge.
//
// Descriptions describe the SERVICE, not the page — that's what an answer
// engine quotes when asked "who charters boats in Ibiza". Claims here must
// match what the page actually says.

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface ServiceCopy {
  name: T
  description: T
  /** Stable English category label — schema.org consumers key off this, not the UI language. */
  serviceType: string
}

export const SERVICE_COPY: Record<string, ServiceCopy> = {
  concierge: {
    serviceType: 'Concierge service',
    name: L(
      'Concierge op Ibiza',
      'Concierge service in Ibiza',
      'Concierge auf Ibiza',
      'Servicio de conserjería en Ibiza',
      'Service de conciergerie à Ibiza',
    ),
    description: L(
      'Eén contactpersoon op Ibiza voor clubtickets en gastenlijst, een privéboot, luchthavenvervoer, een huurauto en een tafel in een restaurant. Geen bemiddelingstarief: wij verdienen commissie van de aanbieders. Bereikbaar via WhatsApp in vijf talen.',
      'One point of contact in Ibiza for club tickets and guestlist, a private boat, airport transport, a rental car and a restaurant table. No booking fee: we earn commission from the operators. Reachable over WhatsApp in five languages.',
      'Ein Ansprechpartner auf Ibiza für Clubtickets und Gästeliste, ein Privatboot, Flughafentransport, einen Mietwagen und einen Tisch im Restaurant. Keine Vermittlungsgebühr: Wir verdienen Provision von den Anbietern. Erreichbar per WhatsApp in fünf Sprachen.',
      'Un único interlocutor en Ibiza para entradas y lista de invitados, un barco privado, transporte del aeropuerto, un coche de alquiler y una mesa de restaurante. Sin tarifa de gestión: ganamos comisión de los operadores. Por WhatsApp en cinco idiomas.',
      'Un seul interlocuteur à Ibiza pour les billets de club et la guestlist, un bateau privé, le transport aéroport, une voiture de location et une table au restaurant. Sans frais de dossier : nous percevons une commission des prestataires. Sur WhatsApp en cinq langues.',
    ),
  },
  'private-boat-charters': {
    serviceType: 'Boat charter',
    name: L(
      'Privéboot huren op Ibiza',
      'Private boat charter in Ibiza',
      'Privatboot mieten auf Ibiza',
      'Alquiler de barco privado en Ibiza',
      'Location de bateau privé à Ibiza',
    ),
    description: L(
      'Huur een privéjacht of motorboot op Ibiza, met of zonder kapitein. Vertrek vanaf marina’s rond het eiland richting Formentera, Es Vedrà en verborgen baaien. Boeken en beschikbaarheid gaan via WhatsApp.',
      'Charter a private yacht or motorboat in Ibiza, with or without a captain. Departures from marinas around the island towards Formentera, Es Vedrà and hidden coves. Booking and availability are handled over WhatsApp.',
      'Miete eine private Yacht oder ein Motorboot auf Ibiza, mit oder ohne Kapitän. Abfahrten von Marinas rund um die Insel Richtung Formentera, Es Vedrà und versteckte Buchten. Buchung und Verfügbarkeit per WhatsApp.',
      'Alquila un yate o lancha privada en Ibiza, con o sin capitán. Salidas desde marinas de toda la isla hacia Formentera, Es Vedrà y calas escondidas. Reservas y disponibilidad por WhatsApp.',
      'Louez un yacht ou un bateau à moteur privé à Ibiza, avec ou sans capitaine. Départs des marinas de l’île vers Formentera, Es Vedrà et des criques cachées. Réservation et disponibilité via WhatsApp.',
    ),
  },
  'ferry-formentera': {
    serviceType: 'Ferry service',
    name: L(
      'Ferry Ibiza – Formentera',
      'Ferry Ibiza – Formentera',
      'Fähre Ibiza – Formentera',
      'Ferry Ibiza – Formentera',
      'Ferry Ibiza – Formentera',
    ),
    description: L(
      'Tickets voor de veerboot tussen Ibiza en Formentera, plus dagtrips naar de stranden van Formentera. Meerdere aanbieders en afvaarttijden per dag, online te boeken.',
      'Tickets for the ferry between Ibiza and Formentera, plus day trips to Formentera’s beaches. Several operators and departure times each day, bookable online.',
      'Tickets für die Fähre zwischen Ibiza und Formentera sowie Tagesausflüge zu den Stränden Formenteras. Mehrere Anbieter und Abfahrtszeiten pro Tag, online buchbar.',
      'Billetes para el ferry entre Ibiza y Formentera, además de excursiones de un día a las playas de Formentera. Varios operadores y horarios cada día, reservables online.',
      'Billets pour le ferry entre Ibiza et Formentera, ainsi que des excursions à la journée vers les plages de Formentera. Plusieurs opérateurs et horaires par jour, réservables en ligne.',
    ),
  },
  'boat-party': {
    serviceType: 'Boat party',
    name: L(
      'Boat party op Ibiza',
      'Ibiza boat party',
      'Boat Party auf Ibiza',
      'Boat party en Ibiza',
      'Boat party à Ibiza',
    ),
    description: L(
      'Tickets voor boat parties en feestboten op Ibiza, met dj’s aan boord, zwemstops en zonsondergangtochten. Dagelijkse afvaarten in het seizoen.',
      'Tickets for boat parties and party boats in Ibiza, with DJs on board, swim stops and sunset cruises. Daily departures in season.',
      'Tickets für Boat Partys und Partyboote auf Ibiza, mit DJs an Bord, Badestopps und Sunset-Törns. Tägliche Abfahrten in der Saison.',
      'Entradas para boat parties y barcos de fiesta en Ibiza, con DJs a bordo, paradas de baño y salidas al atardecer. Salidas diarias en temporada.',
      'Billets pour les boat parties et bateaux de fête à Ibiza, avec DJs à bord, arrêts baignade et sorties au coucher du soleil. Départs quotidiens en saison.',
    ),
  },
  guestlist: {
    serviceType: 'Nightclub guestlist',
    name: L(
      'Ibiza clubgastenlijst',
      'Ibiza club guestlist',
      'Ibiza Club-Gästeliste',
      'Lista de invitados de clubs de Ibiza',
      'Guestlist des clubs d’Ibiza',
    ),
    description: L(
      'Wij zetten je naam op de gastenlijst van clubs op Ibiza, geregeld via WhatsApp. Wat er die avond geldt — vrije entree, korting of alleen tickets — verschilt per club en per dag en wordt vooraf bevestigd.',
      'We put your name on Ibiza club guestlists, arranged over WhatsApp. What applies on the night — free entry, a reduced price or ticket-only — varies by club and by day, and is confirmed in advance.',
      'Wir setzen deinen Namen auf die Gästelisten der Clubs auf Ibiza, organisiert per WhatsApp. Was am jeweiligen Abend gilt — freier Eintritt, ermäßigter Preis oder nur mit Ticket — hängt vom Club und Tag ab und wird vorher bestätigt.',
      'Ponemos tu nombre en las listas de los clubs de Ibiza, gestionado por WhatsApp. Lo que aplica esa noche — entrada libre, precio reducido o solo con entrada — varía según el club y el día, y se confirma con antelación.',
      'Nous inscrivons votre nom sur les guestlists des clubs d’Ibiza, organisé via WhatsApp. Ce qui s’applique le soir même — entrée libre, tarif réduit ou billet uniquement — varie selon le club et le jour, et est confirmé à l’avance.',
    ),
  },
  'water-sports': {
    serviceType: 'Water sports',
    name: L(
      'Watersport op Ibiza',
      'Water sports in Ibiza',
      'Wassersport auf Ibiza',
      'Deportes acuáticos en Ibiza',
      'Sports nautiques à Ibiza',
    ),
    description: L(
      'Watersportactiviteiten en tours op Ibiza: jetski safaris naar Es Vedrà, parasailing vluchten, e-foil lessen en Seabob verhuur. Boekbaar via de agenda en direct via WhatsApp.',
      'Water sports activities and guided tours in Ibiza: jet ski safaris to Es Vedrà, panoramic parasailing, e-foil lessons and Seabob hire. Bookable via the calendar and directly over WhatsApp.',
      'Wassersport-Aktivitäten und geführte Touren auf Ibiza: Jetski-Safaris nach Es Vedrà, Parasailing-Flüge, E-Foil-Coaching und Seabob-Verleih. Buchbar über die Agenda und per WhatsApp.',
      'Actividades náuticas y excursiones en Ibiza: safaris en moto de agua a Es Vedrà, parasailing, clases de e-foil y alquiler de Seabob. Reservable en la agenda y por WhatsApp.',
      'Activités nautiques et excursions à Ibiza : safaris jet-ski vers Es Vedrà, parachute ascensionnel, cours d’e-foil et location de Seabob. Réservation dans l’agenda et via WhatsApp.',
    ),
  },
  'boat-trip': {
    serviceType: 'Boat tour',
    name: L(
      'Boottochten op Ibiza',
      'Boat trips in Ibiza',
      'Bootstouren auf Ibiza',
      'Excursiones en barco por Ibiza',
      'Excursions en bateau à Ibiza',
    ),
    description: L(
      'Georganiseerde boottochten en dagtrips op Ibiza en naar Formentera: kustcruises, snorkelstops in afgelegen baaien en zonsondergangtochten voor Es Vedrà. Boekbaar per afvaart of als privécharter.',
      'Organized boat excursions and day trips in Ibiza and towards Formentera: scenic coast cruises, snorkel swim stops in secluded coves and sunset sailings by Es Vedrà. Bookable by ticket or private charter.',
      'Organisierte Bootstouren und Tagesausflüge auf Ibiza und nach Formentera: Küstencruises, Schnorchelstopps in einsamen Buchten und Sunset-Törns vor Es Vedrà. Buchbar als Einzelticket oder Privatcharter.',
      'Excursiones organizadas en barco y salidas de un día en Ibiza y hacia Formentera: cruceros costeros, esnórquel en calas vírgenes y puestas de sol frente a Es Vedrà. En billete o chárter privado.',
      'Excursions en bateau organisées et sorties à la journée à Ibiza et vers Formentera : croisières côtières, snorkeling dans les criques et couchers de soleil face à Es Vedrà. En billet ou charter privé.',
    ),
  },
}

