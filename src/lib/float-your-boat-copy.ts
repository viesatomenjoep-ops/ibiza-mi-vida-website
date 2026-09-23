import type { Locale } from './seo'
import type { TripPageCopy } from '@/components/guides/TripCollectionGuide'

/**
 * Copy voor de Float Your Boat-merkpagina (routekey 'float-your-boat').
 *
 * Feed-gegrond, per event: Sunset Party Cruise (3 uur westkust vanaf San
 * Antonio, 2 welkomstdrankjes, DJ, O Beach-entree inbegrepen); Beach Cruise
 * Daytime/Sunset (6 uur, drankjes en eten aan boord, zwemstop en waterspeel-
 * goed, Cala Bassa & Cala Conta); Cala Salada Cruise (6 uur vanaf San
 * Antonio, drankjes en snack, zwemstop en snorkelen, Cap Blanc Aquarium en
 * Cala Salada).
 *
 * BEWUST NIET beweerd: hoe de O Beach-entree praktisch werkt (zelfde dag,
 * polsbandje) — staat niet in de feed; de tekst laat het bij "inbegrepen".
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const FLOAT_YOUR_BOAT: TripPageCopy = {
  routeKey: 'float-your-boat',
  pageKey: 'float-your-boat',
  bylineTopic: 'Float Your Boat cruises in Ibiza',
  title: L(
    'Float Your Boat Ibiza',
    'Float Your Boat Ibiza',
    'Float Your Boat Ibiza',
    'Float Your Boat Ibiza',
    'Float Your Boat Ibiza',
  ),
  intro: L(
    'Float Your Boat vaart vanuit San Antonio drie heel verschillende tochten: een sunset party cruise, een zesuurs beach cruise langs Cala Bassa en Cala Conta, en de rustigere Cala Salada-route noordwaarts. Zelfde rederij, drie snelheden — hieronder staan ze alle drie, met hun eigen agenda.',
    'Float Your Boat runs three very different trips out of San Antonio: a sunset party cruise, a six-hour beach cruise along Cala Bassa and Cala Conta, and the calmer Cala Salada route heading north. Same operator, three speeds — all three are below, each with its own calendar.',
    'Float Your Boat fährt ab San Antonio drei sehr unterschiedliche Touren: eine Sunset Party Cruise, eine sechsstündige Beach Cruise entlang Cala Bassa und Cala Conta und die ruhigere Cala-Salada-Route Richtung Norden. Gleiche Reederei, drei Geschwindigkeiten — unten stehen alle drei mit eigenem Kalender.',
    'Float Your Boat opera desde San Antonio tres salidas muy distintas: una sunset party cruise, una beach cruise de seis horas por Cala Bassa y Cala Conta, y la ruta más tranquila de Cala Salada hacia el norte. Misma naviera, tres ritmos — abajo están las tres, cada una con su agenda.',
    'Float Your Boat propose trois sorties très différentes depuis San Antonio : une sunset party cruise, une beach cruise de six heures le long de Cala Bassa et Cala Conta, et la route plus calme de Cala Salada vers le nord. Même compagnie, trois rythmes — les trois figurent ci-dessous, chacune avec son agenda.',
  ),
  events: [
    {
      eventSlug: 'ibiza-sunset-experience',
      body: L(
        'Drie uur party op zee langs de westkust terwijl de zon zakt, met twee welkomstdrankjes en een DJ aan boord — en entree voor O Beach inbegrepen.',
        'Three hours of party at sea along the west coast as the sun sets, with two welcome drinks and a DJ on board — and O Beach entry included.',
        'Drei Stunden Party auf See an der Westküste, während die Sonne untergeht, mit zwei Welcome Drinks und DJ an Bord — O-Beach-Eintritt inklusive.',
        'Tres horas de fiesta en el mar por la costa oeste mientras cae el sol, con dos bebidas de bienvenida y DJ a bordo — y entrada a O Beach incluida.',
        'Trois heures de fête en mer le long de la côte ouest au coucher du soleil, avec deux boissons de bienvenue et un DJ à bord — entrée à O Beach comprise.',
      ),
    },
    {
      eventSlug: 'beach-cruise-daytime',
      heading: L('FYB Beach Cruise (dag en sunset)', 'FYB Beach Cruise (daytime and sunset)', 'FYB Beach Cruise (Tag und Sunset)', 'FYB Beach Cruise (día y atardecer)', 'FYB Beach Cruise (journée et coucher de soleil)'),
      body: L(
        'Zes uur op het water met drankjes en eten aan boord, een zwemstop met waterspeelgoed en de baaien Cala Bassa en Cala Conta als decor. Vaart overdag én als sunset-editie — de sunset-agenda vind je via de detailpagina.',
        'Six hours on the water with drinks and food on board, a swim stop with water toys, and the bays of Cala Bassa and Cala Conta as the backdrop. Sails as a daytime and a sunset edition — the sunset calendar is on the detail page.',
        'Sechs Stunden auf dem Wasser mit Getränken und Essen an Bord, einem Badestopp mit Wasserspielzeug und den Buchten Cala Bassa und Cala Conta als Kulisse. Fährt tagsüber und als Sunset-Edition — den Sunset-Kalender findest du auf der Detailseite.',
        'Seis horas en el agua con bebidas y comida a bordo, una parada para el baño con juguetes acuáticos y las calas de Cala Bassa y Cala Conta como telón de fondo. Navega de día y en edición sunset — la agenda del atardecer está en la página de detalle.',
        'Six heures sur l’eau avec boissons et repas à bord, un arrêt baignade avec jeux aquatiques et les criques de Cala Bassa et Cala Conta en toile de fond. Existe en version journée et coucher de soleil — l’agenda sunset figure sur la page détail.',
      ),
    },
    {
      eventSlug: 'cala-salada-cruise',
      body: L(
        'De rustige noordroute: zes uur vanaf San Antonio met drankjes en een snack aan boord, een zwemstop met snorkelen, en onderweg het Cap Blanc Aquarium en Cala Salada.',
        'The calm northern route: six hours from San Antonio with drinks and a snack on board, a swim stop with snorkelling, and the Cap Blanc Aquarium and Cala Salada along the way.',
        'Die ruhige Nordroute: sechs Stunden ab San Antonio mit Getränken und Snack an Bord, einem Badestopp mit Schnorcheln und unterwegs dem Cap-Blanc-Aquarium und Cala Salada.',
        'La ruta tranquila del norte: seis horas desde San Antonio con bebidas y un tentempié a bordo, parada para nadar con snorkel, y por el camino el Acuario Cap Blanc y Cala Salada.',
        'La route calme du nord : six heures depuis San Antonio avec boissons et en-cas à bord, un arrêt baignade avec snorkeling, et en chemin l’aquarium de Cap Blanc et Cala Salada.',
      ),
    },
  ],
  datesHeading: L('Komende afvaarten', 'Upcoming departures', 'Kommende Abfahrten', 'Próximas salidas', 'Prochains départs'),
  noDates: L(
    'Op dit moment staan er geen afvaarten in de agenda. Zodra er nieuwe data in de feed staan, verschijnen ze hier automatisch.',
    'There are no departures in the calendar right now. As soon as new dates appear in the feed, they show up here automatically.',
    'Im Moment stehen keine Abfahrten im Kalender. Sobald neue Termine im Feed stehen, erscheinen sie hier automatisch.',
    'Ahora mismo no hay salidas en el calendario. En cuanto haya fechas nuevas en el feed, aparecerán aquí automáticamente.',
    'Aucun départ au calendrier pour le moment. Dès que de nouvelles dates arrivent dans le flux, elles s’affichent ici automatiquement.',
  ),
  bookCta: L('Bekijk prijzen en boek', 'See prices and book', 'Preise ansehen und buchen', 'Ver precios y reservar', 'Voir les prix et réserver'),
  detailLinkLabel: L(
    'Alle details en voorwaarden',
    'All details and conditions',
    'Alle Details und Bedingungen',
    'Todos los detalles y condiciones',
    'Tous les détails et conditions',
  ),
  linksHeading: L('Verder lezen', 'Keep exploring', 'Weiterlesen', 'Sigue explorando', 'Pour aller plus loin'),
  links: [
    {
      href: '/boat-party',
      label: L('Alle boat party’s op Ibiza', 'All boat parties in Ibiza', 'Alle Boat Partys auf Ibiza', 'Todas las boat parties de Ibiza', 'Toutes les boat parties d’Ibiza'),
    },
    {
      href: '/boat-trip',
      label: L('Alle boottochten op Ibiza', 'All boat trips in Ibiza', 'Alle Bootstouren auf Ibiza', 'Todas las excursiones en barco', 'Toutes les excursions en bateau'),
    },
  ],
}
