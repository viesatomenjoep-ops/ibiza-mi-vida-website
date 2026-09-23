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
  // Alle feiten hieronder komen uit de Clubtickets-feed voor dit event
  // (excursion-es-vedra-formentera): vertrek 10:00 San Antonio, ±11 uur,
  // eten/drinken aan boord, S'Espalmador + Formentera. Zie es-vedra-trip-copy.ts.
  'es-vedra-trip': {
    serviceType: 'Boat tour',
    name: L(
      'Boottocht Es Vedrà + Formentera',
      'Es Vedrà + Formentera boat trip',
      'Bootstour Es Vedrà + Formentera',
      'Excursión Es Vedrà + Formentera',
      'Excursion en bateau Es Vedrà + Formentera',
    ),
    description: L(
      'Dagtocht van ongeveer 11 uur per traditionele Ibicenco-boot: om 10:00 vanuit San Antonio langs Es Vedrà, ankeren en zwemmen bij S’Espalmador en vrije tijd op Formentera, terug met de zonsondergang. Ontbijt, paella, middagsnack en drankjes aan boord inbegrepen.',
      'Full-day trip of around 11 hours on a traditional Ibizan boat: from San Antonio at 10:00 AM past Es Vedrà, an anchor-and-swim stop at S’Espalmador and free time on Formentera, returning with the sunset. Breakfast, paella, an afternoon snack and drinks on board included.',
      'Ganztagestour von rund 11 Stunden auf einem traditionellen ibizenkischen Boot: um 10:00 Uhr ab San Antonio vorbei an Es Vedrà, Anker- und Badestopp bei S’Espalmador und freie Zeit auf Formentera, zurück mit dem Sonnenuntergang. Frühstück, Paella, Nachmittagssnack und Getränke an Bord inklusive.',
      'Excursión de día completo de unas 11 horas en un barco tradicional ibicenco: a las 10:00 desde San Antonio frente a Es Vedrà, fondeo y baño en S’Espalmador y tiempo libre en Formentera, con vuelta al atardecer. Desayuno, paella, merienda y bebidas a bordo incluidos.',
      'Excursion à la journée d’environ 11 heures sur un bateau traditionnel ibicenco : départ de San Antonio à 10 h, passage devant Es Vedrà, mouillage et baignade à S’Espalmador et temps libre à Formentera, retour au coucher du soleil. Petit-déjeuner, paella, goûter et boissons à bord compris.',
    ),
  },
  // De vier entries hieronder horen bij de gap-plan-pagina's (stap 3–5); alle
  // feiten komen uit de feed-descriptions van de bijbehorende events.
  'calas-trip': {
    serviceType: 'Boat tour',
    name: L(
      'Boottocht Calas de Formentera',
      'Calas de Formentera boat trip',
      'Bootstour Calas de Formentera',
      'Excursión Calas de Formentera',
      'Excursion Calas de Formentera',
    ),
    description: L(
      'Dagtocht van maximaal 11,5 uur vanaf Playa d’en Bossa naar Formentera: ontbijt aan boord, zwemstop, vrije tijd op het eiland en een slotcruise langs Illetas en Espalmador met eten, drankjes en DJ aan boord.',
      'Full-day trip of up to 11.5 hours from Playa d’en Bossa to Formentera: breakfast on board, a swim stop, free time on the island and a final cruise along Illetas and Espalmador with food, drinks and a DJ on board.',
      'Ganztagestour von bis zu 11,5 Stunden ab Playa d’en Bossa nach Formentera: Frühstück an Bord, Badestopp, freie Zeit auf der Insel und eine Abschluss-Cruise entlang Illetas und Espalmador mit Essen, Getränken und DJ an Bord.',
      'Excursión de día completo de hasta 11,5 horas desde Playa d’en Bossa a Formentera: desayuno a bordo, parada para el baño, tiempo libre en la isla y crucero final por Illetas y Espalmador con comida, bebidas y DJ a bordo.',
      'Excursion à la journée jusqu’à 11 h 30 depuis Playa d’en Bossa vers Formentera : petit-déjeuner à bord, arrêt baignade, temps libre sur l’île et croisière finale le long d’Illetas et Espalmador avec repas, boissons et DJ à bord.',
    ),
  },
  'pukka-up': {
    serviceType: 'Boat tour',
    name: L(
      'Pukka Up boat party Ibiza',
      'Pukka Up boat party Ibiza',
      'Pukka Up Boat Party Ibiza',
      'Pukka Up boat party Ibiza',
      'Pukka Up boat party Ibiza',
    ),
    description: L(
      'Boat party vanuit San Antonio op dinsdag, donderdag en zaterdag: pre-party aan de kade, drie uur varen rond zonsondergang, drie drankjes, DJ en live performance aan boord. Ook als rustigere daytrip (A Day in Paradise) op woensdag, vrijdag en zondag.',
      'Boat party out of San Antonio on Tuesdays, Thursdays and Saturdays: a pre-party on the quay, three hours on the water around sunset, three drinks, a DJ and a live performance on board. Also runs as a calmer daytrip (A Day in Paradise) on Wednesdays, Fridays and Sundays.',
      'Boat Party ab San Antonio dienstags, donnerstags und samstags: Pre-Party am Kai, drei Stunden auf dem Wasser rund um den Sonnenuntergang, drei Getränke, DJ und Live-Performance an Bord. Auch als ruhigerer Daytrip (A Day in Paradise) mittwochs, freitags und sonntags.',
      'Boat party desde San Antonio los martes, jueves y sábados: pre-fiesta en el muelle, tres horas navegando alrededor de la puesta de sol, tres bebidas, DJ y actuación en directo a bordo. También como excursión tranquila de día (A Day in Paradise) los miércoles, viernes y domingos.',
      'Boat party au départ de San Antonio les mardis, jeudis et samedis : pré-soirée sur le quai, trois heures en mer autour du coucher du soleil, trois boissons, DJ et live à bord. Existe aussi en sortie plus calme en journée (A Day in Paradise) les mercredis, vendredis et dimanches.',
    ),
  },
  'float-your-boat': {
    serviceType: 'Boat tour',
    name: L(
      'Float Your Boat Ibiza',
      'Float Your Boat Ibiza',
      'Float Your Boat Ibiza',
      'Float Your Boat Ibiza',
      'Float Your Boat Ibiza',
    ),
    description: L(
      'Drie tochten vanuit San Antonio: een sunset party cruise met O Beach-entree inbegrepen, een zesuurs beach cruise langs Cala Bassa en Cala Conta met eten en drankjes aan boord, en de rustigere Cala Salada-route met snorkelstop en het Cap Blanc Aquarium.',
      'Three trips out of San Antonio: a sunset party cruise with O Beach entry included, a six-hour beach cruise along Cala Bassa and Cala Conta with food and drinks on board, and the calmer Cala Salada route with a snorkel stop and the Cap Blanc Aquarium.',
      'Drei Touren ab San Antonio: eine Sunset Party Cruise mit O-Beach-Eintritt, eine sechsstündige Beach Cruise entlang Cala Bassa und Cala Conta mit Essen und Getränken an Bord und die ruhigere Cala-Salada-Route mit Schnorchelstopp und dem Cap-Blanc-Aquarium.',
      'Tres salidas desde San Antonio: una sunset party cruise con entrada a O Beach incluida, una beach cruise de seis horas por Cala Bassa y Cala Conta con comida y bebidas a bordo, y la ruta más tranquila de Cala Salada con parada de snorkel y el Acuario Cap Blanc.',
      'Trois sorties depuis San Antonio : une sunset party cruise avec entrée à O Beach comprise, une beach cruise de six heures le long de Cala Bassa et Cala Conta avec repas et boissons à bord, et la route plus calme de Cala Salada avec arrêt snorkeling et l’aquarium de Cap Blanc.',
    ),
  },
  'cruise-crush': {
    serviceType: 'Boat tour',
    name: L(
      'Cruise Crush boat party Ibiza',
      'Cruise Crush boat party Ibiza',
      'Cruise Crush Boat Party Ibiza',
      'Cruise Crush boat party Ibiza',
      'Cruise Crush boat party Ibiza',
    ),
    description: L(
      'Boat party van drie uur vanaf Playa d’en Bossa met open bar en DJ aan boord, op maandag, vrijdag en zondagmiddag. Seizoen: eind mei tot en met oktober.',
      'A three-hour boat party from Playa d’en Bossa with an open bar and a DJ on board, on Monday, Friday and Sunday afternoons. Season: late May through October.',
      'Dreistündige Boat Party ab Playa d’en Bossa mit Open Bar und DJ an Bord, montags, freitags und sonntags am Nachmittag. Saison: Ende Mai bis Ende Oktober.',
      'Boat party de tres horas desde Playa d’en Bossa con barra libre y DJ a bordo, los lunes, viernes y domingos por la tarde. Temporada: de finales de mayo a octubre.',
      'Boat party de trois heures depuis Playa d’en Bossa avec open bar et DJ à bord, les lundis, vendredis et dimanches après-midi. Saison : de fin mai à octobre.',
    ),
  },
}

