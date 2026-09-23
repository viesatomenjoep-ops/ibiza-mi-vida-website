import type { Locale } from './seo'
import type { TripPageCopy } from '@/components/guides/TripCollectionGuide'

/**
 * Copy voor de Calas de Formentera-dagtochtpagina (routekey 'calas-trip').
 *
 * Elke feitelijke bewering is herleidbaar tot de Clubtickets-feed voor event
 * excursion-calas-de-formentera (venue Ulises Cat / Sea Experience): hele dag
 * vanaf Playa d'en Bossa, check-in 9:30–10:00 bij de Sea Experience-balie,
 * vertrek 10:30, terug rond 21:00, ontbijt aan boord, zwemstop, vrije tijd op
 * Formentera, slotcruise langs Illetas en Espalmador met eten, drankjes en DJ.
 * Prijzen en datums staan niet in de copy — die rendert de pagina live.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const CALAS_TRIP: TripPageCopy = {
  routeKey: 'calas-trip',
  pageKey: 'calas-trip',
  bylineTopic: 'the Calas de Formentera boat trip',
  title: L(
    'Boottocht Calas de Formentera',
    'Calas de Formentera boat trip',
    'Bootstour Calas de Formentera',
    'Excursión Calas de Formentera',
    'Excursion Calas de Formentera',
  ),
  // Per taal gemeten: 140–160 tekens (onpage-check).
  metaDescription: L(
    'Hele dag per boot van Playa d’en Bossa naar Formentera: ontbijt aan boord, zwemstop, vrije tijd en een slotcruise langs Illetas met eten en DJ.',
    'A full day by boat from Playa d’en Bossa to Formentera: breakfast on board, a swim stop, free time and a final cruise past Illetas with food and a DJ.',
    'Ein ganzer Tag per Boot von Playa d’en Bossa nach Formentera: Frühstück an Bord, Badestopp, freie Zeit und eine Abschluss-Cruise mit Essen und DJ.',
    'Un día entero en barco de Playa d’en Bossa a Formentera: desayuno a bordo, parada para el baño, tiempo libre y crucero final por Illetas con DJ.',
    'Une journée en bateau de Playa d’en Bossa à Formentera : petit-déjeuner à bord, baignade, temps libre et croisière finale le long d’Illetas avec DJ.',
  ),
  intro: L(
    'De uitgebreidste manier om Formentera te doen zonder eigen boot: een hele dag vanaf Playa d’en Bossa, met ontbijt aan boord op de heenweg, een zwemstop, vrije tijd op het eiland en als afsluiter een cruise langs de kust van Illetas en Espalmador — met eten, drankjes en een DJ aan boord.',
    'The most complete way to do Formentera without your own boat: a full day from Playa d’en Bossa, with breakfast on board on the way out, a swim stop, free time on the island and, to finish, a cruise along the coast of Illetas and Espalmador — with food, drinks and a DJ on board.',
    'Die umfassendste Art, Formentera ohne eigenes Boot zu erleben: ein ganzer Tag ab Playa d’en Bossa, mit Frühstück an Bord auf der Hinfahrt, einem Badestopp, freier Zeit auf der Insel und zum Abschluss einer Cruise entlang der Küste von Illetas und Espalmador — mit Essen, Getränken und DJ an Bord.',
    'La forma más completa de hacer Formentera sin barco propio: un día entero desde Playa d’en Bossa, con desayuno a bordo a la ida, parada para el baño, tiempo libre en la isla y, para terminar, un crucero por la costa de Illetas y Espalmador — con comida, bebidas y DJ a bordo.',
    'La façon la plus complète de découvrir Formentera sans bateau privé : une journée entière depuis Playa d’en Bossa, avec petit-déjeuner à bord à l’aller, un arrêt baignade, du temps libre sur l’île et, pour finir, une croisière le long des côtes d’Illetas et Espalmador — avec repas, boissons et DJ à bord.',
  ),
  events: [
    {
      eventSlug: 'excursion-calas-de-formentera',
      body: L(
        'Je checkt tussen 9:30 en 10:00 in bij de Sea Experience-balie op het vertrekpunt in Playa d’en Bossa; de boot vertrekt om 10:30 en is rond 21:00 terug op Ibiza — tot zo’n 11,5 uur onderweg.',
        'Check-in is between 9:30 and 10:00 AM at the Sea Experience stand at the departure point in Playa d’en Bossa; the boat leaves at 10:30 AM and is back on Ibiza around 9:00 PM — up to some 11.5 hours out.',
        'Der Check-in ist zwischen 9:30 und 10:00 Uhr am Sea-Experience-Stand am Abfahrtspunkt in Playa d’en Bossa; das Boot legt um 10:30 Uhr ab und ist gegen 21:00 Uhr zurück auf Ibiza — bis zu rund 11,5 Stunden unterwegs.',
        'El check-in es entre las 9:30 y las 10:00 en el mostrador de Sea Experience en el punto de salida de Playa d’en Bossa; el barco zarpa a las 10:30 y vuelve a Ibiza sobre las 21:00 — hasta unas 11,5 horas de excursión.',
        'L’enregistrement se fait entre 9 h 30 et 10 h au stand Sea Experience, au point de départ de Playa d’en Bossa ; le bateau part à 10 h 30 et revient à Ibiza vers 21 h — jusqu’à environ 11 h 30 de sortie.',
      ),
    },
  ],
  includedHeading: L('Inbegrepen', 'What’s included', 'Inklusive', 'Qué incluye', 'Ce qui est inclus'),
  included: [
    L('Ontbijt aan boord op de heenweg', 'Breakfast on board on the way out', 'Frühstück an Bord auf der Hinfahrt', 'Desayuno a bordo a la ida', 'Petit-déjeuner à bord à l’aller'),
    L('Zwemstop onderweg', 'A swim stop along the way', 'Badestopp unterwegs', 'Parada para el baño en el trayecto', 'Arrêt baignade en chemin'),
    L('Vrije tijd op Formentera', 'Free time on Formentera', 'Freie Zeit auf Formentera', 'Tiempo libre en Formentera', 'Temps libre à Formentera'),
    L('Slotcruise langs Illetas en Espalmador', 'A final cruise along Illetas and Espalmador', 'Abschluss-Cruise entlang Illetas und Espalmador', 'Crucero final por Illetas y Espalmador', 'Croisière finale le long d’Illetas et Espalmador'),
    L('Eten en drankjes aan boord', 'Food and drinks on board', 'Essen und Getränke an Bord', 'Comida y bebidas a bordo', 'Repas et boissons à bord'),
    L('DJ en muziek aan boord', 'DJ and music on board', 'DJ und Musik an Bord', 'DJ y música a bordo', 'DJ et musique à bord'),
  ],
  practicalHeading: L('Praktisch', 'Practical details', 'Praktisches', 'Datos prácticos', 'Infos pratiques'),
  practical: [
    {
      label: L('Vertrek', 'Departure', 'Abfahrt', 'Salida', 'Départ'),
      value: L('10:30, Playa d’en Bossa', '10:30 AM, Playa d’en Bossa', '10:30 Uhr, Playa d’en Bossa', '10:30, Playa d’en Bossa', '10 h 30, Playa d’en Bossa'),
    },
    {
      label: L('Inchecken', 'Check-in', 'Check-in', 'Check-in', 'Enregistrement'),
      value: L(
        'Tussen 9:30 en 10:00 bij de Sea Experience-balie op het vertrekpunt',
        'Between 9:30 and 10:00 AM at the Sea Experience stand at the departure point',
        'Zwischen 9:30 und 10:00 Uhr am Sea-Experience-Stand am Abfahrtspunkt',
        'Entre las 9:30 y las 10:00 en el mostrador de Sea Experience en el punto de salida',
        'Entre 9 h 30 et 10 h au stand Sea Experience, au point de départ',
      ),
    },
    {
      label: L('Duur', 'Duration', 'Dauer', 'Duración', 'Durée'),
      value: L(
        'Tot zo’n 11,5 uur; terug rond 21:00',
        'Up to some 11.5 hours; back around 9:00 PM',
        'Bis zu rund 11,5 Stunden; zurück gegen 21:00 Uhr',
        'Hasta unas 11,5 horas; vuelta sobre las 21:00',
        'Jusqu’à environ 11 h 30 ; retour vers 21 h',
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
    'Alle details en voorwaarden van deze tocht',
    'All details and conditions for this trip',
    'Alle Details und Bedingungen dieser Tour',
    'Todos los detalles y condiciones de esta excursión',
    'Tous les détails et conditions de cette excursion',
  ),
  linksHeading: L('Verder lezen', 'Keep exploring', 'Weiterlesen', 'Sigue explorando', 'Pour aller plus loin'),
  links: [
    {
      href: '/ferry-formentera',
      label: L('Alleen de overtocht? De ferry naar Formentera', 'Just the crossing? The Formentera ferry', 'Nur die Überfahrt? Die Fähre nach Formentera', '¿Solo el trayecto? El ferry a Formentera', 'Juste la traversée ? Le ferry pour Formentera'),
    },
    {
      href: '/boat-trip',
      label: L('Alle boottochten op Ibiza', 'All boat trips in Ibiza', 'Alle Bootstouren auf Ibiza', 'Todas las excursiones en barco', 'Toutes les excursions en bateau'),
    },
    {
      href: '/private-boat-charters',
      label: L('Liever een eigen boot? Privécharters', 'Rather have your own boat? Private charters', 'Lieber ein eigenes Boot? Privatcharter', '¿Prefieres barco propio? Chárter privado', 'Plutôt un bateau privé ? Nos charters'),
    },
  ],
  hasFaq: true,
}
