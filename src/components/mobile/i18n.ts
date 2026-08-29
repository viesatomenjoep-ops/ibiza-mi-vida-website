// Chrome labels for the app shell in the site's five locales.
// Same L() convention as src/lib/seo-pages.ts.

export type AppLocale = 'nl' | 'en' | 'de' | 'es' | 'fr'
export const APP_LOCALES: AppLocale[] = ['nl', 'en', 'de', 'es', 'fr']

const L = (nl: string, en: string, de: string, es: string, fr: string) =>
  ({ nl, en, de, es, fr }) as Record<AppLocale, string>

const MONTHS_SHORT: Record<AppLocale, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  fr: ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'],
}
const MONTHS_LONG: Record<AppLocale, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  nl: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
}
const WEEKDAYS_SHORT: Record<AppLocale, string[]> = {
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  nl: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  es: ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá'],
  fr: ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'],
}
export const monthShort = (locale: string, monthIndex: number) => (MONTHS_SHORT[locale as AppLocale] || MONTHS_SHORT.en)[monthIndex]
export const monthLong = (locale: string, monthIndex: number) => (MONTHS_LONG[locale as AppLocale] || MONTHS_LONG.en)[monthIndex]
export const weekdayShort = (locale: string, dayIndex: number) => (WEEKDAYS_SHORT[locale as AppLocale] || WEEKDAYS_SHORT.en)[dayIndex]

const LABELS = {
  brandName: L('Ibiza Mi Vida', 'Ibiza Mi Vida', 'Ibiza Mi Vida', 'Ibiza Mi Vida', 'Ibiza Mi Vida'),

  tabAgenda: L('Agenda', 'Agenda', 'Agenda', 'Agenda', 'Agenda'),
  tabEvents: L('Events', 'Events', 'Events', 'Eventos', 'Événements'),
  tabBoats: L('Boten', 'Boats', 'Boote', 'Barcos', 'Bateaux'),
  tabSearch: L('Zoeken', 'Search', 'Suche', 'Buscar', 'Recherche'),
  tabMap: L('Kaart', 'Map', 'Karte', 'Mapa', 'Carte'),
  tabGuestlist: L('Package Deals', 'Package Deals', 'Package Deals', 'Package Deals', 'Package Deals'),

  // Renamed from the generic "Calendar" — this view opens on today's picks,
  // so a nightlife-native label ("what's on tonight") reads less like a
  // stock calendar widget and more like the app's own voice.
  viewCalendar: L('Vanavond', 'Tonight', 'Heute Nacht', 'Esta noche', 'Ce soir'),
  viewExplore: L('Ontdek', 'Explore', 'Entdecken', 'Explorar', 'Explorer'),
  viewUpcoming: L('Binnenkort', 'Upcoming', 'Demnächst', 'Próximos', 'À venir'),

  popularEvents: L('Populaire events', 'Popular events', 'Beliebte Events', 'Eventos populares', 'Événements populaires'),
  featuredEvents: L('Uitgelichte events', 'Featured events', 'Ausgewählte Events', 'Eventos destacados', 'Événements à la une'),
  trendingEvents: L('Trending events', 'Trending events', 'Trend-Events', 'Eventos en tendencia', 'Événements tendance'),
  allEvents: L('Alle events', 'All events', 'Alle Events', 'Todos los eventos', 'Tous les événements'),
  noEvents: L('Geen events op deze dag', 'No events on this day', 'Keine Events an diesem Tag', 'No hay eventos este día', "Pas d'événements ce jour"),
  today: L('Vandaag', 'Today', 'Heute', 'Hoy', "Aujourd'hui"),
  tomorrow: L('Morgen', 'Tomorrow', 'Morgen', 'Mañana', 'Demain'),
  events: L('events', 'events', 'Events', 'eventos', 'événements'),

  searchPlaceholder: L('Zoek event, club of artiest…', 'Search event, club or artist…', 'Event, Club oder Artist suchen…', 'Busca evento, club o artista…', 'Cherchez un événement, club ou artiste…'),
  clearSearch: L('Zoekopdracht wissen', 'Clear search', 'Suche löschen', 'Borrar búsqueda', 'Effacer la recherche'),
  noResults: L('Niets gevonden', 'Nothing found', 'Nichts gefunden', 'Nada encontrado', 'Aucun résultat'),

  selectDate: L('Kies een datum', 'Select date', 'Datum wählen', 'Elige fecha', 'Choisir une date'),
  price: L('Prijs', 'Price', 'Preis', 'Precio', 'Prix'),
  from: L('vanaf', 'from', 'ab', 'desde', 'dès'),
  lineup: L('Line-up', 'Lineup', 'Lineup', 'Lineup', 'Programmation'),
  tickets: L('Tickets', 'Tickets', 'Tickets', 'Entradas', 'Billets'),
  saveOnDrinks: L('Bespaar op drankjes', 'Save on drinks', 'Bei Drinks sparen', 'Ahorra en bebidas', 'Économisez sur les boissons'),
  close: L('Sluiten', 'Close', 'Schließen', 'Cerrar', 'Fermer'),
  back: L('Terug', 'Back', 'Zurück', 'Atrás', 'Retour'),

  dayClub: L('Day club', 'Day club', 'Day Club', 'Day club', 'Day club'),
  nightClub: L('Night club', 'Night club', 'Night Club', 'Night club', 'Night club'),
  dayClubs: L('Day clubs', 'Day clubs', 'Day Clubs', 'Day clubs', 'Day clubs'),
  nightClubs: L('Night clubs', 'Night clubs', 'Night Clubs', 'Night clubs', 'Night clubs'),
  upcomingAt: L('Aankomende events', 'Upcoming events', 'Kommende Events', 'Próximos eventos', 'Événements à venir'),

  guestlistTitle: L('Package Deals', 'Package Deals', 'Package Deals', 'Package Deals', 'Package Deals'),
  howItWorks: L('Hoe werkt het?', 'How it works', "So funktioniert's", '¿Cómo funciona?', 'Comment ça marche'),
  howItWorksBody: L(
    'Stuur ons je naam, het aantal personen en de club — wij zetten je op de lijst. Gratis of met korting entree vóór een bepaalde tijd, direct geregeld via WhatsApp.',
    'Send us your name, group size and the club — we put you on the list. Free or discounted entry before a set time, arranged directly via WhatsApp.',
    'Schick uns deinen Namen, die Gruppengröße und den Club — wir setzen dich auf die Liste. Freier oder ermäßigter Eintritt vor einer bestimmten Uhrzeit, direkt per WhatsApp.',
    'Envíanos tu nombre, número de personas y el club — te ponemos en la lista. Entrada gratis o con descuento antes de una hora fija, directo por WhatsApp.',
    "Envoyez-nous votre nom, la taille du groupe et le club — on vous met sur la liste. Entrée gratuite ou réduite avant une heure fixe, directement via WhatsApp.",
  ),
  joinGuestlist: L('Vraag een package deal aan', 'Request a package deal', 'Package Deal anfragen', 'Solicitar un package deal', 'Demander un package deal'),

  mapTitle: L('Clubs & venues', 'Clubs & venues', 'Clubs & Venues', 'Clubs y locales', 'Clubs & lieux'),
  officialPartner: L('Officiële ticketpartner', 'Official ticket partner', 'Offizieller Ticketpartner', 'Socio oficial de entradas', 'Partenaire officiel de billetterie'),
  concierge: L('VIP concierge', 'VIP concierge', 'VIP-Concierge', 'Concierge VIP', 'Conciergerie VIP'),
  conciergeBody: L(
    'Tafels, boten, villa’s of last-minute tickets — één appje en het is geregeld.',
    'Tables, boats, villas or last-minute tickets — one message and it is handled.',
    'Tische, Boote, Villen oder Last-Minute-Tickets — eine Nachricht genügt.',
    'Mesas, barcos, villas o entradas de última hora — un mensaje y está hecho.',
    'Tables, bateaux, villas ou billets de dernière minute — un message et c’est réglé.',
  ),
  openSite: L('Volledige website', 'Full website', 'Zur Website', 'Web completa', 'Site complet'),

  // Date picker
  pickDate: L('Kies je datum', 'Pick your date', 'Wähle dein Datum', 'Elige tu fecha', 'Choisis ta date'),
  done: L('Klaar', 'Done', 'Fertig', 'Listo', 'Terminé'),

  // Artist rail
  onDecks: L('Op de decks', 'On the decks', 'An den Decks', 'En las cabinas', 'Aux platines'),
  artistAt: L('speelt bij', 'plays at', 'spielt bei', 'toca en', 'joue à'),

  // Boats screen
  boatsTitle: L('Privéboten', 'Private boats', 'Privatboote', 'Barcos privados', 'Bateaux privés'),
  boatsSubtitle: L(
    'Charter een jacht of motorboot met of zonder kapitein.',
    'Charter a yacht or motorboat, with or without a captain.',
    'Chartere eine Yacht oder ein Motorboot, mit oder ohne Kapitän.',
    'Alquila un yate o una lancha, con o sin capitán.',
    'Louez un yacht ou un bateau à moteur, avec ou sans capitaine.',
  ),
  perDay: L('/dag', '/day', '/Tag', '/día', '/jour'),
  pax: L('pers.', 'guests', 'Pers.', 'pers.', 'pers.'),
  requestBoat: L('Vraag aan via WhatsApp', 'Request via WhatsApp', 'Per WhatsApp anfragen', 'Solicitar por WhatsApp', 'Demander via WhatsApp'),

  // Planner banner + entry
  plannerBanner: L('Trip Planner', 'Trip Planner', 'Trip Planner', 'Trip Planner', 'Trip Planner'),
  plannerBannerBody: L(
    'Bouw je perfecte Ibiza-programma in drie tikken.',
    'Build your perfect Ibiza itinerary in three taps.',
    'Erstelle dein perfektes Ibiza-Programm in drei Klicks.',
    'Crea tu itinerario perfecto en Ibiza en tres toques.',
    'Créez votre programme Ibiza parfait en trois clics.',
  ),
  openPlanner: L('Open de planner', 'Open the planner', 'Planer öffnen', 'Abrir el planificador', 'Ouvrir le planificateur'),

  // Planner modes — deliberately renamed away from generic "surprise me" /
  // "swipe mode" naming, kept in the app's VIP-concierge voice.
  modePlanner: L('Programma', 'Itinerary', 'Programm', 'Itinerario', 'Programme'),
  modeSurprise: L('Concierge kiest', 'Concierge picks', 'Concierge wählt', 'Elige el concierge', 'Le concierge choisit'),
  modeSwipe: L('Shortlist', 'Shortlist', 'Shortlist', 'Preselección', 'Présélection'),

  plannerTitle: L('Plan je Ibiza-trip', 'Plan your Ibiza trip', 'Plane deinen Ibiza-Trip', 'Planifica tu viaje a Ibiza', 'Planifiez votre séjour à Ibiza'),
  plannerDates: L('Kies je data', 'Choose your dates', 'Wähle deine Daten', 'Elige tus fechas', 'Choisissez vos dates'),
  plannerFrom: L('Van', 'From', 'Von', 'Desde', 'Du'),
  plannerTo: L('Tot', 'To', 'Bis', 'Hasta', 'Au'),
  buildItinerary: L('Stel programma samen', 'Build my itinerary', 'Programm erstellen', 'Crear itinerario', 'Créer le programme'),
  yourItinerary: L('Jouw programma', 'Your itinerary', 'Dein Programm', 'Tu itinerario', 'Votre programme'),
  editDates: L('Data wijzigen', 'Edit dates', 'Daten ändern', 'Editar fechas', 'Modifier les dates'),
  noPicksForDay: L('Geen aanrader gevonden voor deze dag', 'No pick found for this day', 'Kein Tipp für diesen Tag gefunden', 'No hay recomendación para este día', 'Aucune sélection pour ce jour'),

  surpriseIntro: L(
    'Eén tik. Wij kiezen het beste event van vanavond voor je uit — geselecteerd door onze concierge.',
    'One tap. We pick tonight’s best event for you — curated by our concierge.',
    'Ein Klick. Wir wählen das beste Event von heute Abend für dich aus — kuratiert von unserem Concierge.',
    'Un toque. Elegimos el mejor evento de esta noche por ti — seleccionado por nuestro concierge.',
    'Un clic. Nous choisissons le meilleur événement de ce soir pour vous — sélectionné par notre concierge.',
  ),
  revealPick: L('Onthul mijn pick', 'Reveal my pick', 'Meinen Tipp zeigen', 'Revelar mi elección', 'Révéler mon choix'),
  anotherPick: L('Nog een pick', 'Another pick', 'Noch einen Tipp', 'Otra elección', 'Un autre choix'),
  conciergesPick: L('De keuze van de concierge', "The concierge's pick", 'Die Wahl des Concierge', 'La elección del concierge', 'Le choix du concierge'),

  swipeIntro: L('Swipe rechts om te bewaren, links om over te slaan.', 'Swipe right to save, left to skip.', 'Wische rechts zum Speichern, links zum Überspringen.', 'Desliza a la derecha para guardar, a la izquierda para saltar.', 'Glissez à droite pour enregistrer, à gauche pour passer.'),
  skip: L('Overslaan', 'Skip', 'Überspringen', 'Saltar', 'Passer'),
  save: L('Bewaren', 'Save', 'Speichern', 'Guardar', 'Enregistrer'),
  swipeDone: L('Klaar voor nu', 'That’s everything for now', 'Das war’s erstmal', 'Eso es todo por ahora', 'C’est tout pour le moment'),
  swipeDoneBody: L(
    'Je shortlist staat klaar. Stuur hem door naar de concierge om te boeken.',
    'Your shortlist is ready. Send it to the concierge to book.',
    'Deine Shortlist ist fertig. Schick sie an den Concierge zum Buchen.',
    'Tu preselección está lista. Envíala al concierge para reservar.',
    'Votre présélection est prête. Envoyez-la au concierge pour réserver.',
  ),
  shortlistCount: L('op je shortlist', 'on your shortlist', 'auf deiner Shortlist', 'en tu preselección', 'dans votre présélection'),
  sendShortlist: L('Stuur shortlist naar concierge', 'Send shortlist to concierge', 'Shortlist an Concierge senden', 'Enviar preselección al concierge', 'Envoyer la présélection au concierge'),
} as const

export type AppLabels = { [K in keyof typeof LABELS]: string }

export function getLabels(locale: string): AppLabels {
  const l = (APP_LOCALES as string[]).includes(locale) ? (locale as AppLocale) : 'en'
  const out = {} as Record<keyof typeof LABELS, string>
  for (const k of Object.keys(LABELS) as (keyof typeof LABELS)[]) out[k] = LABELS[k][l]
  return out
}
