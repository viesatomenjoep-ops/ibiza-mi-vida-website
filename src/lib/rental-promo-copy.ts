import type { Locale } from './seo'

/**
 * Copy for the two rental promos, in one place.
 *
 * It used to live twice — once inside CarRentalPromo, once inside
 * BoatRentalPromo — and now three surfaces need it: those two standalone
 * blocks and the paired RentalsSection on the homepage. Three copies of five
 * languages is three chances for them to drift apart, so it lives here and the
 * components read it.
 *
 * Everything here has to hold for every date and every boat or car, because
 * none of it is checked per booking. The specifics that vary — which boat, what
 * it costs on your date — belong on the pages these blocks link to.
 */

type T = Record<Locale, string>
type L = Record<Locale, string[]>

export const RENTALS_SECTION: { eyebrow: T; heading: T; lead: T } = {
  eyebrow: {
    nl: 'Ook te huur',
    en: 'Also for hire',
    de: 'Ebenfalls mietbar',
    es: 'También en alquiler',
    fr: 'Également en location',
  },
  heading: {
    nl: 'Een boot op het water, een auto voor het eiland',
    en: 'A boat for the water, a car for the island',
    de: 'Ein Boot fürs Wasser, ein Auto für die Insel',
    es: 'Un barco para el mar, un coche para la isla',
    fr: 'Un bateau pour la mer, une voiture pour l’île',
  },
  lead: {
    nl: 'De twee dingen die een week Ibiza het meest veranderen. Wij boeken ze bij vaste partners en blijven bereikbaar zolang je ze hebt.',
    en: 'The two things that change a week in Ibiza most. We book both with regular partners and stay reachable for as long as you have them.',
    de: 'Die zwei Dinge, die eine Woche Ibiza am meisten verändern. Wir buchen beides bei festen Partnern und bleiben erreichbar.',
    es: 'Las dos cosas que más cambian una semana en Ibiza. Reservamos ambas con socios fijos y seguimos disponibles mientras las tengas.',
    fr: 'Les deux choses qui changent le plus une semaine à Ibiza. Nous réservons les deux chez des partenaires réguliers et restons joignables.',
  },
}

export const BOAT_PROMO: { kicker: T; heading: T; lead: T; readMore: T; cta: T; fromLabel: T; points: L } = {
  kicker: {
    nl: 'In samenwerking met Click&Boat',
    en: 'In partnership with Click&Boat',
    de: 'In Zusammenarbeit mit Click&Boat',
    es: 'En colaboración con Click&Boat',
    fr: 'En partenariat avec Click&Boat',
  },
  heading: {
    nl: 'Zelf een boot uitzoeken',
    en: 'Pick a boat yourself',
    de: 'Selbst ein Boot aussuchen',
    es: 'Elige tu propio barco',
    fr: 'Choisissez votre bateau',
  },
  lead: {
    nl: 'Met schipper, met eigen vaarbewijs, of zonder vaarbewijs tot 15 pk. Vertrek vanuit de jachthavens rond het eiland.',
    en: 'With a skipper, with your own licence, or licence-free up to 15 hp. Departures from marinas around the island.',
    de: 'Mit Skipper, mit eigenem Führerschein oder führerscheinfrei bis 15 PS. Ab Marinas rund um die Insel.',
    es: 'Con patrón, con tu titulación o sin ella hasta 15 CV. Salidas desde los puertos de la isla.',
    fr: 'Avec skipper, avec votre permis ou sans permis jusqu’à 15 ch. Départs des ports de l’île.',
  },
  readMore: {
    nl: 'Prijzen, regels en routes',
    en: 'Prices, rules and routes',
    de: 'Preise, Regeln und Routen',
    es: 'Precios, normas y rutas',
    fr: 'Prix, règles et itinéraires',
  },
  cta: {
    nl: 'Bekijk beschikbare boten',
    en: 'See available boats',
    de: 'Verfügbare Boote ansehen',
    es: 'Ver barcos disponibles',
    fr: 'Voir les bateaux disponibles',
  },
  fromLabel: {
    nl: 'per dag, onze eigen vloot',
    en: 'per day, from our own fleet',
    de: 'pro Tag, aus unserer Flotte',
    es: 'por día, de nuestra flota',
    fr: 'par jour, notre propre flotte',
  },
  points: {
    nl: ['Met schipper, zelf varen, of zonder vaarbewijs', 'Jachthavens rond het hele eiland', 'Wij checken vooraf wat bij je groep past'],
    en: ['With a skipper, drive yourself, or licence-free', 'Marinas all around the island', 'We check what suits your group before you book'],
    de: ['Mit Skipper, selbst fahren oder führerscheinfrei', 'Marinas rund um die ganze Insel', 'Wir prüfen vorab, was zu deiner Gruppe passt'],
    es: ['Con patrón, navegas tú, o sin titulación', 'Puertos por toda la isla', 'Comprobamos antes qué encaja con tu grupo'],
    fr: ['Avec skipper, en autonomie, ou sans permis', 'Des ports tout autour de l’île', 'Nous vérifions ce qui convient à votre groupe'],
  },
}

export const CAR_PROMO: { kicker: T; heading: T; lead: T; readMore: T; cta: T; fromLabel: T; points: L } = {
  kicker: {
    nl: 'In samenwerking met Wiber Rent a Car',
    en: 'In partnership with Wiber Rent a Car',
    de: 'In Zusammenarbeit mit Wiber Rent a Car',
    es: 'En colaboración con Wiber Rent a Car',
    fr: 'En partenariat avec Wiber Rent a Car',
  },
  heading: {
    nl: 'Auto huren bij Wiber',
    en: 'Car rental with Wiber',
    de: 'Mietwagen bei Wiber',
    es: 'Alquiler de coches con Wiber',
    fr: 'Location de voiture avec Wiber',
  },
  lead: {
    nl: 'All-in tarief met de verzekering erin, kantoor op vijf minuten van de luchthaven met gratis shuttle. Vanaf 21 jaar.',
    en: 'All-inclusive rate with the insurance in the price, an office five minutes from the airport with a free shuttle. From 21.',
    de: 'All-inclusive-Tarif mit Versicherung im Preis, Büro fünf Minuten vom Flughafen mit Gratis-Shuttle. Ab 21 Jahren.',
    es: 'Tarifa todo incluido con el seguro dentro, oficina a cinco minutos del aeropuerto con shuttle gratuito. Desde 21 años.',
    fr: 'Tarif tout compris avec l’assurance incluse, agence à cinq minutes de l’aéroport avec navette gratuite. Dès 21 ans.',
  },
  readMore: {
    nl: 'Voorwaarden, prijzen en tips',
    en: 'Conditions, prices and tips',
    de: 'Bedingungen, Preise und Tipps',
    es: 'Condiciones, precios y consejos',
    fr: 'Conditions, prix et conseils',
  },
  cta: {
    nl: 'Bekijk beschikbaarheid',
    en: 'Check availability',
    de: 'Verfügbarkeit prüfen',
    es: 'Consultar disponibilidad',
    fr: 'Voir les disponibilités',
  },
  fromLabel: {
    nl: 'per dag, all-in',
    en: 'per day, all-inclusive',
    de: 'pro Tag, all-inclusive',
    es: 'por día, todo incluido',
    fr: 'par jour, tout compris',
  },
  points: {
    nl: ['All-in prijs, geen verrassingen aan de balie', '5 minuten van Ibiza Airport, gratis shuttle', 'Contactloos ophalen na een late landing'],
    en: ['All-inclusive price, no surprises at the desk', 'Five minutes from Ibiza Airport, free shuttle', 'Contactless pick-up after a late landing'],
    de: ['All-inclusive-Preis, keine Überraschungen am Schalter', 'Fünf Minuten vom Flughafen Ibiza, Gratis-Shuttle', 'Kontaktlose Übernahme nach später Landung'],
    es: ['Precio todo incluido, sin sorpresas en el mostrador', 'A cinco minutos del aeropuerto, shuttle gratuito', 'Recogida sin contacto tras un aterrizaje tardío'],
    fr: ['Prix tout compris, pas de surprise au comptoir', 'À cinq minutes de l’aéroport, navette gratuite', 'Prise en charge sans contact après un vol tardif'],
  },
}
