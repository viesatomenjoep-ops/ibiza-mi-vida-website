import type { Locale } from '@/lib/seo'
import type { FleetCategory } from '@/data/fleet'

/**
 * Tekst voor de bootpagina, in vijf talen.
 *
 * Passages met een cijfer erin zijn functies die de getallen als argument
 * krijgen — nooit vijf losse zinnen met het bedrag erin getypt. De vloot komt
 * uit een partner-API en wisselt; een overgetypt getal loopt dan in één taal
 * achter terwijl het in de andere vier meebeweegt (zie CLAUDE.md).
 *
 * De seizoens- en beschikbaarheidswoorden staan hier los van die in
 * FleetShowcase: dat is een client-component met één groot labelblok dat niets
 * exporteert. Verandert er een woord, verander het op allebei de plekken.
 */

type T5 = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T5 => ({ nl, en, de, es, fr })

export const CATEGORY_LABEL: Record<FleetCategory, T5> = {
  yacht: L('Jacht', 'Yacht', 'Yacht', 'Yate', 'Yacht'),
  motorboat: L('Motorboot', 'Motorboat', 'Motorboot', 'Lancha', 'Bateau à moteur'),
  catamaran: L('Catamaran', 'Catamaran', 'Katamaran', 'Catamarán', 'Catamaran'),
  jetski: L('Jetski', 'Jet ski', 'Jetski', 'Moto de agua', 'Jet-ski'),
  boat: L('Boot', 'Boat', 'Boot', 'Barco', 'Bateau'),
}

/**
 * "Dit jacht", "Diese Yacht", "Esta lancha" — het aanwijzend voornaamwoord
 * hoort bij het woord, niet bij de zin.
 *
 * De lead begon als `Deze ${soort.toLowerCase()} …` met één vast voornaamwoord.
 * Dat levert in het Nederlands "Deze jacht" op (jacht is een het-woord), in het
 * Duits "Diese Motorboot" (das Boot) en in het Spaans "Este lancha" (la
 * lancha) — fout in drie van de vijf talen, op een pagina die 94 keer bestaat.
 * Een taal waarin het geslacht per woord verschilt, lost dat niet op in de
 * zinsjabloon op; het staat hier per soort.
 */
export const CATEGORY_PHRASE: Record<FleetCategory, T5> = {
  yacht: L('Dit jacht', 'This yacht', 'Diese Yacht', 'Este yate', 'Ce yacht'),
  motorboat: L('Deze motorboot', 'This motorboat', 'Dieses Motorboot', 'Esta lancha', 'Ce bateau à moteur'),
  catamaran: L('Deze catamaran', 'This catamaran', 'Dieser Katamaran', 'Este catamarán', 'Ce catamaran'),
  jetski: L('Deze jetski', 'This jet ski', 'Dieser Jetski', 'Esta moto de agua', 'Ce jet-ski'),
  boat: L('Deze boot', 'This boat', 'Dieses Boot', 'Este barco', 'Ce bateau'),
}

export interface BoatDetailCopy {
  /**
   * Antwoord-eerst, met het dagtarief erin. `soort` is de complete aanwijzende
   * woordgroep uit CATEGORY_PHRASE ("Dit jacht"), niet het kale zelfstandig
   * naamwoord — zie de toelichting daar.
   */
  lead: (soort: string, pax: number, marina: string, prijs: string, seizoen: string) => string
  /** Eén regel onder de lead: wat er wél en niet vaststaat. */
  leadNote: string
  specs: string
  pax: string
  length: string
  marina: string
  type: string
  rates: string
  ratesNote: string
  perDay: string
  seasonLow: string
  seasonMid: string
  seasonHigh: string
  seasonLowNote: string
  seasonMidNote: string
  seasonHighNote: string
  /** Live stand van de partnerfeed, voor vandaag. */
  todayHeading: (datum: string) => string
  availFree: string
  availOption: string
  availBooked: string
  liveStamp: (tijd: string) => string
  noLive: string
  dossier: string
  book: string
  waMessage: (boot: string) => string
  backToFleet: string
  more: string
  moreNote: (marina: string) => string
}

export const BOAT_DETAIL_COPY: Record<Locale, BoatDetailCopy> = {
  nl: {
    lead: (soort, pax, marina, prijs, seizoen) =>
      `${soort} vaart voor maximaal ${pax} gasten vanuit ${marina} en kost vandaag €${prijs} per dag (${seizoen.toLowerCase()}). Je boekt hem via WhatsApp: Simon bevestigt de datum, de prijs en wat er bij het tarief inzit voordat je iets betaalt.`,
    leadNote: 'Wat er bij de prijs inzit — schipper, brandstof, btw — verschilt per boot en staat in het dossier hieronder.',
    specs: 'Specificaties',
    pax: 'Gasten',
    length: 'Lengte',
    marina: 'Haven',
    type: 'Soort',
    rates: 'Dagtarieven per seizoen',
    ratesNote: 'Terugvaltarieven uit de vlootlijst. De prijs voor een concrete datum komt live uit de agenda van de verhuurder en kan daarvan afwijken.',
    perDay: 'per dag',
    seasonLow: 'Laagseizoen',
    seasonMid: 'Tussenseizoen',
    seasonHigh: 'Hoogseizoen',
    seasonLowNote: 'Rest van het jaar',
    seasonMidNote: 'Venster verschilt per boot',
    seasonHighNote: 'Juli en augustus',
    todayHeading: (d) => `Beschikbaarheid op ${d}`,
    availFree: 'Beschikbaar',
    availOption: 'In optie',
    availBooked: 'Bezet',
    liveStamp: (t) => `Live stand, ${t}`,
    noLive: 'De agenda van de verhuurder is nu niet bereikbaar. Vraag de stand op via WhatsApp.',
    dossier: 'Bootdossier (PDF)',
    book: 'Boek deze boot via WhatsApp',
    waMessage: (b) => `Hoi Ibiza mi Vida! Ik wil de private boot ${b} graag boeken. Kunnen jullie de beschikbaarheid en de prijs bevestigen?`,
    backToFleet: 'Terug naar de hele vloot',
    more: 'Andere boten',
    moreNote: (m) => `Ook vanuit ${m} of in dezelfde klasse.`,
  },
  en: {
    lead: (soort, pax, marina, prijs, seizoen) =>
      `${soort} takes up to ${pax} guests out of ${marina} and costs €${prijs} per day today (${seizoen.toLowerCase()}). You book it over WhatsApp: Simon confirms the date, the price and what the rate includes before you pay anything.`,
    leadNote: 'What the rate includes — skipper, fuel, VAT — differs per boat and is set out in the dossier below.',
    specs: 'Specifications',
    pax: 'Guests',
    length: 'Length',
    marina: 'Marina',
    type: 'Type',
    rates: 'Day rates per season',
    ratesNote: 'Fallback rates from the fleet list. The price for a specific date comes live from the operator’s own calendar and can differ.',
    perDay: 'per day',
    seasonLow: 'Low season',
    seasonMid: 'Shoulder season',
    seasonHigh: 'High season',
    seasonLowNote: 'Rest of the year',
    seasonMidNote: 'Window differs per boat',
    seasonHighNote: 'July and August',
    todayHeading: (d) => `Availability on ${d}`,
    availFree: 'Available',
    availOption: 'On option',
    availBooked: 'Booked',
    liveStamp: (t) => `Live status, ${t}`,
    noLive: 'The operator’s calendar is unreachable right now. Ask us for the current status over WhatsApp.',
    dossier: 'Boat dossier (PDF)',
    book: 'Book this boat over WhatsApp',
    waMessage: (b) => `Hi Ibiza mi Vida! I would like to book the private boat ${b}. Could you confirm availability and the price?`,
    backToFleet: 'Back to the full fleet',
    more: 'Other boats',
    moreNote: (m) => `Also out of ${m}, or in the same class.`,
  },
  de: {
    lead: (soort, pax, marina, prijs, seizoen) =>
      `${soort} fährt für maximal ${pax} Gäste ab ${marina} und kostet heute €${prijs} pro Tag (${seizoen.toLowerCase()}). Gebucht wird per WhatsApp: Simon bestätigt Datum, Preis und Leistungsumfang, bevor du etwas zahlst.`,
    leadNote: 'Was im Preis enthalten ist — Skipper, Kraftstoff, MwSt. — unterscheidet sich je Boot und steht im Dossier unten.',
    specs: 'Technische Daten',
    pax: 'Gäste',
    length: 'Länge',
    marina: 'Hafen',
    type: 'Art',
    rates: 'Tagespreise pro Saison',
    ratesNote: 'Rückfallpreise aus der Flottenliste. Der Preis für ein konkretes Datum kommt live aus dem Kalender des Vermieters und kann abweichen.',
    perDay: 'pro Tag',
    seasonLow: 'Nebensaison',
    seasonMid: 'Zwischensaison',
    seasonHigh: 'Hauptsaison',
    seasonLowNote: 'Rest des Jahres',
    seasonMidNote: 'Zeitraum je Boot verschieden',
    seasonHighNote: 'Juli und August',
    todayHeading: (d) => `Verfügbarkeit am ${d}`,
    availFree: 'Verfügbar',
    availOption: 'Auf Option',
    availBooked: 'Belegt',
    liveStamp: (t) => `Live-Stand, ${t}`,
    noLive: 'Der Kalender des Vermieters ist gerade nicht erreichbar. Frag den Stand per WhatsApp ab.',
    dossier: 'Bootsdossier (PDF)',
    book: 'Dieses Boot per WhatsApp buchen',
    waMessage: (b) => `Hallo Ibiza mi Vida! Ich möchte das Privatboot ${b} buchen. Können Sie Verfügbarkeit und Preis bestätigen?`,
    backToFleet: 'Zurück zur ganzen Flotte',
    more: 'Andere Boote',
    moreNote: (m) => `Auch ab ${m} oder in derselben Klasse.`,
  },
  es: {
    lead: (soort, pax, marina, prijs, seizoen) =>
      `${soort} navega para un máximo de ${pax} personas desde ${marina} y hoy cuesta €${prijs} al día (${seizoen.toLowerCase()}). Se reserva por WhatsApp: Simon confirma la fecha, el precio y lo que incluye la tarifa antes de que pagues nada.`,
    leadNote: 'Lo que incluye la tarifa — patrón, combustible, IVA — varía según el barco y está en el dossier de abajo.',
    specs: 'Características',
    pax: 'Personas',
    length: 'Eslora',
    marina: 'Puerto',
    type: 'Tipo',
    rates: 'Tarifas diarias por temporada',
    ratesNote: 'Tarifas de referencia de la lista de flota. El precio de una fecha concreta llega en vivo del calendario del operador y puede variar.',
    perDay: 'al día',
    seasonLow: 'Temporada baja',
    seasonMid: 'Temporada media',
    seasonHigh: 'Temporada alta',
    seasonLowNote: 'Resto del año',
    seasonMidNote: 'La ventana varía por barco',
    seasonHighNote: 'Julio y agosto',
    todayHeading: (d) => `Disponibilidad el ${d}`,
    availFree: 'Disponible',
    availOption: 'En opción',
    availBooked: 'Ocupado',
    liveStamp: (t) => `Estado en vivo, ${t}`,
    noLive: 'El calendario del operador no responde ahora mismo. Pregúntanos el estado por WhatsApp.',
    dossier: 'Dossier del barco (PDF)',
    book: 'Reserva este barco por WhatsApp',
    waMessage: (b) => `¡Hola Ibiza mi Vida! Quiero reservar el barco privado ${b}. ¿Podéis confirmar la disponibilidad y el precio?`,
    backToFleet: 'Volver a toda la flota',
    more: 'Otros barcos',
    moreNote: (m) => `También desde ${m} o de la misma clase.`,
  },
  fr: {
    lead: (soort, pax, marina, prijs, seizoen) =>
      `${soort} navigue pour ${pax} invités au maximum au départ de ${marina} et coûte aujourd’hui €${prijs} par jour (${seizoen.toLowerCase()}). La réservation se fait par WhatsApp : Simon confirme la date, le tarif et ce qu’il comprend avant tout paiement.`,
    leadNote: 'Ce que le tarif comprend — skipper, carburant, TVA — varie selon le bateau et figure dans le dossier ci-dessous.',
    specs: 'Caractéristiques',
    pax: 'Invités',
    length: 'Longueur',
    marina: 'Port',
    type: 'Type',
    rates: 'Tarifs journaliers par saison',
    ratesNote: 'Tarifs de repli issus de la liste de flotte. Le prix d’une date précise vient en direct du calendrier du loueur et peut différer.',
    perDay: 'par jour',
    seasonLow: 'Basse saison',
    seasonMid: 'Moyenne saison',
    seasonHigh: 'Haute saison',
    seasonLowNote: 'Reste de l’année',
    seasonMidNote: 'La fenêtre varie selon le bateau',
    seasonHighNote: 'Juillet et août',
    todayHeading: (d) => `Disponibilité le ${d}`,
    availFree: 'Disponible',
    availOption: 'En option',
    availBooked: 'Réservé',
    liveStamp: (t) => `État en direct, ${t}`,
    noLive: 'Le calendrier du loueur est injoignable pour le moment. Demandez-nous l’état par WhatsApp.',
    dossier: 'Dossier du bateau (PDF)',
    book: 'Réserver ce bateau par WhatsApp',
    waMessage: (b) => `Bonjour Ibiza mi Vida ! Je souhaite réserver le bateau privé ${b}. Pouvez-vous confirmer la disponibilité et le tarif ?`,
    backToFleet: 'Retour à toute la flotte',
    more: 'Autres bateaux',
    moreNote: (m) => `Aussi au départ de ${m}, ou de la même classe.`,
  },
}
