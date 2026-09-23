import type { Locale } from './seo'

/**
 * Redactionele uitlicht-blokken voor de water-agendapagina's
 * (component: src/components/water/FeaturedTrips.tsx).
 *
 * Waarom: de agenda's tonen alles wat de Clubtickets-feed die dag heeft, als
 * gelijke kaartjes. Een lezer die "welke boottocht moet ik nemen?" vraagt,
 * krijgt daar geen antwoord op — en een antwoordmachine ook niet. Dit blok
 * geeft per tocht één redactionele zin met wat hem onderscheidt.
 *
 * HARDE REGEL — als overal: elke bewering komt uit de (gestripte)
 * feed-description van het event. Prijzen en datums staan hier NIET in de
 * copy; het component rekent ze live uit de feed uit.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface FeaturedTrip {
  /** Eventslug in de feed — bron voor naam, prijzen en datums. */
  eventSlug: string
  /** Interne link (locale-onafhankelijk pad, of 'route:<RouteKey>' voor een gelokaliseerde route). */
  href: string
  blurb: T
}

export interface FeaturedTripsBlock {
  heading: T
  intro: T
  trips: FeaturedTrip[]
}

export const FEATURED_TRIPS: Record<string, FeaturedTripsBlock> = {
  'boat-trip': {
    heading: L('Er tussenuit springen', 'Trips that stand out', 'Touren, die herausstechen', 'Excursiones que destacan', 'Les sorties qui se démarquent'),
    intro: L(
      'De agenda hieronder toont alles wat er vaart. Dit zijn de tochten waar we zelf op wijzen, elk om een eigen reden.',
      'The calendar below shows everything that sails. These are the trips we point to ourselves, each for its own reason.',
      'Der Kalender unten zeigt alles, was fährt. Auf diese Touren weisen wir selbst hin — jede aus einem eigenen Grund.',
      'La agenda de abajo muestra todo lo que navega. Estas son las excursiones que nosotros mismos destacamos, cada una por su propia razón.',
      'L’agenda ci-dessous montre tout ce qui navigue. Voici les sorties que nous mettons nous-mêmes en avant, chacune pour une raison précise.',
    ),
    trips: [
      {
        eventSlug: 'salvador-boat-day-trip',
        href: '/boat-trip/salvador',
        blurb: L(
          'Drie uur westkust vanuit San Antonio — Cala Bassa, Cala Conta en de Islas Margaritas — met drankjes, vers fruit en snorkel-, kajak- en paddlespullen aan boord. Vaart ook als zonsondergangstocht.',
          'Three hours of west coast from San Antonio — Cala Bassa, Cala Conta and the Islas Margaritas — with drinks, fresh fruit and snorkel, kayak and paddle gear on board. Also sails as a sunset trip.',
          'Drei Stunden Westküste ab San Antonio — Cala Bassa, Cala Conta und die Islas Margaritas — mit Getränken, frischem Obst und Schnorchel-, Kajak- und Paddel-Ausrüstung an Bord. Fährt auch als Sonnenuntergangstour.',
          'Tres horas de costa oeste desde San Antonio — Cala Bassa, Cala Conta y las Islas Margaritas — con bebidas, fruta fresca y equipo de snorkel, kayak y paddle a bordo. También navega como salida al atardecer.',
          'Trois heures de côte ouest depuis San Antonio — Cala Bassa, Cala Conta et les Islas Margaritas — avec boissons, fruits frais et matériel de snorkeling, kayak et paddle à bord. Existe aussi en version coucher de soleil.',
        ),
      },
      {
        eventSlug: 'beach-hopper-daytime',
        href: '/boat-trip/the-beach-hopper',
        blurb: L(
          'Drie strandtrips in één dag: langs de Caves of Love, vrije tijd op Cala Bassa en Cala Conta, en een watersportstop bij Cala Tarida — met open bar en eten aan boord.',
          'Three beach trips in one day: past the Caves of Love, free time at Cala Bassa and Cala Conta, and a water sports stop at Cala Tarida — with open bar and food on board.',
          'Drei Strandausflüge an einem Tag: vorbei an den Caves of Love, freie Zeit an Cala Bassa und Cala Conta und ein Wassersportstopp an der Cala Tarida — mit Open Bar und Essen an Bord.',
          'Tres excursiones de playa en un día: frente a las Caves of Love, tiempo libre en Cala Bassa y Cala Conta, y una parada de deportes acuáticos en Cala Tarida — con barra libre y comida a bordo.',
          'Trois sorties plage en une journée : devant les Caves of Love, temps libre à Cala Bassa et Cala Conta, et un arrêt sports nautiques à Cala Tarida — avec open bar et repas à bord.',
        ),
      },
      {
        eventSlug: 'the-formentera-cruise',
        href: '/boat-trip/the-formentera-cruise',
        blurb: L(
          'De overtocht mét het dagje uit: tot zo’n negen uur op het water vanaf Playa d’en Bossa, met zwemstops bij Ses Illetes en Espalmador, open bar, lunch en vrije tijd op Formentera.',
          'The crossing with the day out built in: up to around nine hours on the water from Playa d’en Bossa, with swim stops at Ses Illetes and Espalmador, open bar, lunch and free time on Formentera.',
          'Die Überfahrt mit Tagesausflug in einem: bis zu rund neun Stunden auf dem Wasser ab Playa d’en Bossa, mit Badestopps an Ses Illetes und Espalmador, Open Bar, Mittagessen und freier Zeit auf Formentera.',
          'La travesía con el día completo incluido: hasta unas nueve horas en el agua desde Playa d’en Bossa, con paradas de baño en Ses Illetes y Espalmador, barra libre, comida y tiempo libre en Formentera.',
          'La traversée avec la journée complète incluse : jusqu’à environ neuf heures sur l’eau depuis Playa d’en Bossa, avec baignades à Ses Illetes et Espalmador, open bar, déjeuner et temps libre à Formentera.',
        ),
      },
    ],
  },
  'ferry-formentera': {
    heading: L('Liever een dagtrip dan een overtocht?', 'Rather a day trip than a crossing?', 'Lieber ein Tagesausflug als eine Überfahrt?', '¿Mejor una excursión que un simple trayecto?', 'Plutôt une excursion qu’une simple traversée ?'),
    intro: L(
      'De ferry brengt je heen en weer. Deze tochten maken er een dag van — eten, drankjes en zwemstops inbegrepen.',
      'The ferry gets you there and back. These trips make a day of it — food, drinks and swim stops included.',
      'Die Fähre bringt dich hin und zurück. Diese Touren machen einen Tag daraus — Essen, Getränke und Badestopps inklusive.',
      'El ferry te lleva y te trae. Estas excursiones lo convierten en un día completo — comida, bebidas y paradas para el baño incluidas.',
      'Le ferry vous emmène et vous ramène. Ces sorties en font une vraie journée — repas, boissons et baignades compris.',
    ),
    trips: [
      {
        eventSlug: 'excursion-calas-de-formentera',
        href: 'route:calas-trip',
        blurb: L(
          'De lange variant: een hele dag vanaf Playa d’en Bossa met ontbijt, diner en drankjes aan boord, een zwemstop onderweg en vrije tijd op Formentera.',
          'The long version: a full day from Playa d’en Bossa with breakfast, dinner and drinks on board, a swim stop along the way and free time on Formentera.',
          'Die lange Variante: ein ganzer Tag ab Playa d’en Bossa mit Frühstück, Abendessen und Getränken an Bord, einem Badestopp unterwegs und freier Zeit auf Formentera.',
          'La versión larga: un día entero desde Playa d’en Bossa con desayuno, cena y bebidas a bordo, una parada para el baño y tiempo libre en Formentera.',
          'La version longue : une journée entière depuis Playa d’en Bossa avec petit-déjeuner, dîner et boissons à bord, un arrêt baignade en chemin et du temps libre à Formentera.',
        ),
      },
      {
        eventSlug: 'crystal-waters',
        href: '/ferry-formentera/barco-a-formentera-ulises-cat/crystal-waters',
        blurb: L(
          'Tot zeven uur richting Formentera met eten aan boord, drankjes, zwemstops en vrije tijd op het eiland — de middenweg tussen ferry en privéboot.',
          'Up to seven hours towards Formentera with food on board, drinks, swim stops and free time on the island — the middle ground between ferry and private boat.',
          'Bis zu sieben Stunden Richtung Formentera mit Essen an Bord, Getränken, Badestopps und freier Zeit auf der Insel — der Mittelweg zwischen Fähre und Privatboot.',
          'Hasta siete horas hacia Formentera con comida a bordo, bebidas, paradas para el baño y tiempo libre en la isla — el punto medio entre el ferry y el barco privado.',
          'Jusqu’à sept heures vers Formentera avec repas à bord, boissons, baignades et temps libre sur l’île — l’entre-deux entre le ferry et le bateau privé.',
        ),
      },
      {
        eventSlug: 'brunch-on-the-boat',
        href: '/ferry-formentera/barco-a-formentera-ulises-cat/brunch-on-the-boat',
        blurb: L(
          'Drie uur brunchcruise vanaf Playa d’en Bossa: open bar met cava, mimosa’s en sangria, brunchgerechten, een DJ aan boord en een zwemstop. Alleen voor volwassenen.',
          'A three-hour brunch cruise from Playa d’en Bossa: open bar with cava, mimosas and sangria, brunch food, a DJ on board and a swim stop. Adults only.',
          'Drei Stunden Brunch-Cruise ab Playa d’en Bossa: Open Bar mit Cava, Mimosas und Sangria, Brunch-Gerichte, DJ an Bord und ein Badestopp. Nur für Erwachsene.',
          'Un crucero-brunch de tres horas desde Playa d’en Bossa: barra libre con cava, mimosas y sangría, comida de brunch, DJ a bordo y parada para el baño. Solo adultos.',
          'Trois heures de croisière-brunch depuis Playa d’en Bossa : open bar avec cava, mimosas et sangria, plats de brunch, DJ à bord et arrêt baignade. Réservé aux adultes.',
        ),
      },
      {
        eventSlug: 'aftersun',
        href: '/ferry-formentera/barco-a-formentera-ulises-cat/aftersun',
        blurb: L(
          'De zonsondergangsvariant: zo’n drie uur vanaf Playa d’en Bossa met open bar, DJ en een zwemstop op zee. Alleen voor volwassenen.',
          'The sunset version: around three hours from Playa d’en Bossa with an open bar, a DJ and a swim stop at sea. Adults only.',
          'Die Sonnenuntergangs-Variante: rund drei Stunden ab Playa d’en Bossa mit Open Bar, DJ und einem Badestopp auf See. Nur für Erwachsene.',
          'La versión al atardecer: unas tres horas desde Playa d’en Bossa con barra libre, DJ y una parada para el baño en el mar. Solo adultos.',
          'La version coucher de soleil : environ trois heures depuis Playa d’en Bossa avec open bar, DJ et un arrêt baignade en mer. Réservé aux adultes.',
        ),
      },
    ],
  },
}
