import type { Locale } from './seo'

/**
 * Copy voor de Es Vedrà + Formentera-dagtochtpagina (routekey 'es-vedra-trip').
 *
 * Elke feitelijke bewering hier is herleidbaar tot de Clubtickets-feed voor
 * dit event (venue excursiones-ibiza, event excursion-es-vedra-formentera):
 * vertrek 10:00 vanaf San Antonio, ±11 uur, terug rond zonsondergang,
 * inchecken 30 minuten vooraf bij de Excursiones Ibiza-balie op de boulevard,
 * ontbijt + paella + middagsnack + drankjes inbegrepen, gedeelde snorkel- en
 * paddleboardspullen, ankeren bij S'Espalmador, vrije tijd op Formentera,
 * kinderen 0–6 gratis. Prijzen en data staan NIET in deze copy — die rendert
 * de pagina live uit dezelfde feed, zodat ze nooit kunnen verouderen terwijl
 * de tekst blijft staan.
 *
 * Per taal geschreven, niet vertaald — zelfde regel als concierge-copy.ts.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export interface EsVedraTripCopy {
  kicker: T
  title: T
  intro: T
  introSecond: T
  includedHeading: T
  /** Volgorde = volgorde van de dag; alles komt letterlijk uit de feed. */
  included: T[]
  itineraryHeading: T
  itinerary: T[]
  practicalHeading: T
  practical: { label: T; value: T }[]
  datesHeading: T
  /** Getoond wanneer de feed geen komende afvaarten heeft (winter). */
  noDates: T
  bookCta: T
  detailLinkLabel: T
}

export const ES_VEDRA_TRIP: EsVedraTripCopy = {
  kicker: L('Dagtocht per boot', 'Full-day boat trip', 'Ganztägige Bootstour', 'Excursión de día completo', 'Excursion à la journée'),
  title: L(
    'Boottocht Es Vedrà + Formentera',
    'Es Vedrà + Formentera boat trip',
    'Bootstour Es Vedrà + Formentera',
    'Excursión Es Vedrà + Formentera',
    'Excursion en bateau Es Vedrà + Formentera',
  ),
  intro: L(
    'Eén dag, de twee mooiste stukken zee rond Ibiza: langs de zuidwestkust naar de rots Es Vedrà, ankeren en zwemmen bij S’Espalmador, en vrije tijd op Formentera voordat je met de zonsondergang terugvaart. Je vaart op een traditionele Ibicenco-boot van Excursiones Ibiza, gebouwd op het eiland zelf.',
    'One day, the two finest stretches of sea around Ibiza: along the southwest coast to the rock of Es Vedrà, an anchor-and-swim stop at S’Espalmador, and free time on Formentera before sailing back with the sunset. You travel on a traditional Ibizan boat from Excursiones Ibiza, built on the island itself.',
    'Ein Tag, die zwei schönsten Seestücke rund um Ibiza: an der Südwestküste entlang zum Felsen Es Vedrà, Anker- und Badestopp bei S’Espalmador und freie Zeit auf Formentera, bevor es mit dem Sonnenuntergang zurückgeht. Du fährst auf einem traditionellen ibizenkischen Boot von Excursiones Ibiza, gebaut auf der Insel selbst.',
    'Un día, los dos tramos de mar más bonitos alrededor de Ibiza: por la costa suroeste hasta el islote de Es Vedrà, fondeo y baño en S’Espalmador y tiempo libre en Formentera antes de volver navegando con la puesta de sol. Viajas en un barco tradicional ibicenco de Excursiones Ibiza, construido en la propia isla.',
    'Une journée, les deux plus beaux pans de mer autour d’Ibiza : le long de la côte sud-ouest jusqu’au rocher d’Es Vedrà, mouillage et baignade à S’Espalmador, puis temps libre à Formentera avant de rentrer au coucher du soleil. Vous naviguez sur un bateau traditionnel ibicenco d’Excursiones Ibiza, construit sur l’île même.',
  ),
  introSecond: L(
    'Eten en drinken zijn aan boord geregeld: ontbijt na vertrek, paella die tijdens de tocht aan boord wordt bereid, en op de terugweg nog een middagsnack — drankjes horen er de hele dag bij. Snorkel- en paddleboardspullen liggen aan boord om te delen.',
    'Food and drink are handled on board: breakfast after departure, paella prepared on board during the trip, and an afternoon snack on the way back — with drinks included throughout the day. Shared snorkelling gear and paddle boards are on board too.',
    'Für Essen und Trinken ist an Bord gesorgt: Frühstück nach der Abfahrt, Paella, die während der Tour an Bord zubereitet wird, und auf der Rückfahrt noch ein Nachmittagssnack — Getränke gibt es den ganzen Tag dazu. Schnorchel- und Paddleboard-Ausrüstung zum Teilen liegt an Bord.',
    'La comida y la bebida van resueltas a bordo: desayuno tras la salida, paella preparada a bordo durante la travesía y una merienda en el viaje de vuelta — con bebidas incluidas todo el día. También hay equipo de snorkel y tablas de paddle para compartir.',
    'Repas et boissons sont prévus à bord : petit-déjeuner après le départ, paella préparée à bord pendant la traversée et goûter sur le retour — boissons comprises toute la journée. Du matériel de snorkeling et des paddles à partager sont également à bord.',
  ),
  includedHeading: L('Inbegrepen', 'What’s included', 'Inklusive', 'Qué incluye', 'Ce qui est inclus'),
  included: [
    L('Boottocht van ongeveer 11 uur', 'Boat trip of approximately 11 hours', 'Bootstour von rund 11 Stunden', 'Travesía de aproximadamente 11 horas', 'Sortie en bateau d’environ 11 heures'),
    L('Ontbijt aan boord: koffie, sap en gebak', 'Breakfast on board: coffee, juice and pastries', 'Frühstück an Bord: Kaffee, Saft und Gebäck', 'Desayuno a bordo: café, zumo y bollería', 'Petit-déjeuner à bord : café, jus et viennoiseries'),
    L('Lunch: paella, aan boord bereid', 'Lunch: paella prepared on board', 'Mittagessen: an Bord zubereitete Paella', 'Comida: paella preparada a bordo', 'Déjeuner : paella préparée à bord'),
    L('Middagsnack op de terugweg', 'Afternoon snack on the return journey', 'Nachmittagssnack auf der Rückfahrt', 'Merienda en el viaje de vuelta', 'Goûter sur le trajet du retour'),
    L('Drankjes gedurende de hele tocht', 'Drinks throughout the excursion', 'Getränke während der gesamten Tour', 'Bebidas durante toda la excursión', 'Boissons pendant toute l’excursion'),
    L('Gedeelde snorkel- en paddleboarduitrusting', 'Shared snorkelling and paddle board equipment', 'Schnorchel- und Paddleboard-Ausrüstung zum Teilen', 'Equipo compartido de snorkel y paddle surf', 'Matériel de snorkeling et paddle à partager'),
    L('Ankerstop met zwemmen bij S’Espalmador', 'Anchoring at S’Espalmador with a swim stop', 'Ankerstopp mit Badestopp bei S’Espalmador', 'Fondeo en S’Espalmador con parada para el baño', 'Mouillage à S’Espalmador avec baignade'),
  ],
  itineraryHeading: L('Zo ziet de dag eruit', 'How the day runs', 'So läuft der Tag', 'Así es el día', 'Le déroulé de la journée'),
  itinerary: [
    L(
      'Vertrek om 10:00 vanuit de haven van San Antonio, aan boord van een traditionele Ibicenco-boot.',
      'Departure at 10:00 AM from San Antonio Port, aboard a traditional Ibizan boat.',
      'Abfahrt um 10:00 Uhr vom Hafen von San Antonio, an Bord eines traditionellen ibizenkischen Boots.',
      'Salida a las 10:00 desde el puerto de San Antonio, a bordo de un barco tradicional ibicenco.',
      'Départ à 10 h du port de San Antonio, à bord d’un bateau traditionnel ibicenco.',
    ),
    L(
      'Langs de zuidwestkust van Ibiza, met het ontbijt aan boord.',
      'Along Ibiza’s southwest coast, with breakfast served on board.',
      'An Ibizas Südwestküste entlang, mit Frühstück an Bord.',
      'Por la costa suroeste de Ibiza, con el desayuno servido a bordo.',
      'Le long de la côte sud-ouest d’Ibiza, petit-déjeuner servi à bord.',
    ),
    L(
      'Voorbij Es Vedrà, de bekendste rots van Ibiza.',
      'Past Es Vedrà, Ibiza’s most iconic rock.',
      'Vorbei an Es Vedrà, Ibizas bekanntestem Felsen.',
      'Frente a Es Vedrà, el islote más icónico de Ibiza.',
      'Devant Es Vedrà, le rocher le plus emblématique d’Ibiza.',
    ),
    L(
      'Ankeren bij S’Espalmador: zwemmen in helder water, met de paella als lunch.',
      'Anchoring at S’Espalmador: a swim in clear water, with the paella for lunch.',
      'Ankern bei S’Espalmador: Schwimmen im klaren Wasser, mit der Paella als Mittagessen.',
      'Fondeo en S’Espalmador: baño en aguas cristalinas, con la paella de comida.',
      'Mouillage à S’Espalmador : baignade en eau claire, avec la paella au déjeuner.',
    ),
    L(
      'Panoramische tocht langs de kust van Formentera en aankomst in de haven — daarna vrije tijd op het eiland.',
      'A panoramic run along Formentera’s coastline and arrival at the port — then free time on the island.',
      'Panoramafahrt entlang der Küste Formenteras und Ankunft im Hafen — danach freie Zeit auf der Insel.',
      'Recorrido panorámico por la costa de Formentera y llegada al puerto — después, tiempo libre en la isla.',
      'Passage panoramique le long de la côte de Formentera et arrivée au port — puis temps libre sur l’île.',
    ),
    L(
      'Terugvaart naar Ibiza met de zonsondergang en de middagsnack aan boord.',
      'Return to Ibiza with the sunset and the afternoon snack on board.',
      'Rückfahrt nach Ibiza mit Sonnenuntergang und Nachmittagssnack an Bord.',
      'Vuelta a Ibiza con la puesta de sol y la merienda a bordo.',
      'Retour vers Ibiza au coucher du soleil, goûter servi à bord.',
    ),
  ],
  practicalHeading: L('Praktisch', 'Practical details', 'Praktisches', 'Datos prácticos', 'Infos pratiques'),
  practical: [
    {
      label: L('Vertrek', 'Departure', 'Abfahrt', 'Salida', 'Départ'),
      value: L(
        '10:00, haven van San Antonio',
        '10:00 AM, San Antonio Port',
        '10:00 Uhr, Hafen von San Antonio',
        '10:00, puerto de San Antonio',
        '10 h, port de San Antonio',
      ),
    },
    {
      label: L('Inchecken', 'Check-in', 'Check-in', 'Check-in', 'Enregistrement'),
      value: L(
        '30 minuten vóór vertrek, bij de balie van Excursiones Ibiza op de boulevard van San Antonio',
        '30 minutes before departure, at the Excursiones Ibiza desk on the San Antonio promenade',
        '30 Minuten vor Abfahrt, am Schalter von Excursiones Ibiza an der Promenade von San Antonio',
        '30 minutos antes de la salida, en el mostrador de Excursiones Ibiza en el paseo de San Antonio',
        '30 minutes avant le départ, au comptoir Excursiones Ibiza sur la promenade de San Antonio',
      ),
    },
    {
      label: L('Duur', 'Duration', 'Dauer', 'Duración', 'Durée'),
      value: L(
        'Ongeveer 11 uur; terug rond 21:00, afhankelijk van de zonsondergang',
        'Approximately 11 hours; back around 9:00 PM, depending on sunset time',
        'Rund 11 Stunden; zurück gegen 21:00 Uhr, je nach Sonnenuntergang',
        'Aproximadamente 11 horas; vuelta sobre las 21:00, según la puesta de sol',
        'Environ 11 heures ; retour vers 21 h, selon le coucher du soleil',
      ),
    },
    {
      label: L('Kinderen', 'Children', 'Kinder', 'Niños', 'Enfants'),
      value: L(
        'Van 0 t/m 6 jaar gratis',
        'Ages 0 to 6 travel free',
        'Von 0 bis 6 Jahren kostenlos',
        'De 0 a 6 años viajan gratis',
        'Gratuit de 0 à 6 ans',
      ),
    },
  ],
  datesHeading: L('Komende afvaarten', 'Upcoming departures', 'Kommende Abfahrten', 'Próximas salidas', 'Prochains départs'),
  // Seizoensvenster exact zoals de feed het zegt: "April (Wed/Fri/Sun) · May,
  // June & September every day except Monday · July & August every day" —
  // dus april t/m september, niet langer.
  noDates: L(
    'Op dit moment staan er geen afvaarten in de agenda — de tocht vaart in het seizoen (april t/m september). Zodra er nieuwe data zijn, verschijnen ze hier automatisch.',
    'There are no departures in the calendar right now — the trip runs in season (April to September). As soon as new dates are released, they appear here automatically.',
    'Im Moment stehen keine Abfahrten im Kalender — die Tour fährt in der Saison (April bis September). Sobald neue Termine freigegeben sind, erscheinen sie hier automatisch.',
    'Ahora mismo no hay salidas en el calendario — la excursión opera en temporada (de abril a septiembre). En cuanto haya fechas nuevas, aparecerán aquí automáticamente.',
    'Aucun départ au calendrier pour le moment — l’excursion navigue en saison (d’avril à septembre). Dès que de nouvelles dates sortent, elles s’affichent ici automatiquement.',
  ),
  bookCta: L('Bekijk prijzen en boek', 'See prices and book', 'Preise ansehen und buchen', 'Ver precios y reservar', 'Voir les prix et réserver'),
  detailLinkLabel: L(
    'Alle details en voorwaarden van deze tocht',
    'All details and conditions for this trip',
    'Alle Details und Bedingungen dieser Tour',
    'Todos los detalles y condiciones de esta excursión',
    'Tous les détails et conditions de cette excursion',
  ),
}
