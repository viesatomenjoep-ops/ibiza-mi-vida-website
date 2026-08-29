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
}
