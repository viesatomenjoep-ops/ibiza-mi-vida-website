// Chrome labels for the app shell in the site's five locales.
// Same L() convention as src/lib/seo-pages.ts.

export type AppLocale = 'nl' | 'en' | 'de' | 'es' | 'fr'
export const APP_LOCALES: AppLocale[] = ['nl', 'en', 'de', 'es', 'fr']

const L = (nl: string, en: string, de: string, es: string, fr: string) =>
  ({ nl, en, de, es, fr }) as Record<AppLocale, string>

const LABELS = {
  tabAgenda: L('Agenda', 'Agenda', 'Agenda', 'Agenda', 'Agenda'),
  tabEvents: L('Events', 'Events', 'Events', 'Eventos', 'Événements'),
  tabSearch: L('Zoeken', 'Search', 'Suche', 'Buscar', 'Recherche'),
  tabMap: L('Kaart', 'Map', 'Karte', 'Mapa', 'Carte'),
  tabGuestlist: L('Guestlist', 'Guestlist', 'Guestlist', 'Guestlist', 'Guestlist'),

  viewCalendar: L('Kalender', 'Calendar', 'Kalender', 'Calendario', 'Calendrier'),
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

  guestlistTitle: L('Guestlist', 'Guestlist', 'Guestlist', 'Guestlist', 'Guestlist'),
  howItWorks: L('Hoe werkt de guestlist?', 'How guestlist works', 'So funktioniert die Guestlist', '¿Cómo funciona la guestlist?', 'Comment ça marche'),
  howItWorksBody: L(
    'Stuur ons je naam, het aantal personen en de club — wij zetten je op de lijst. Gratis of met korting entree vóór een bepaalde tijd, direct geregeld via WhatsApp.',
    'Send us your name, group size and the club — we put you on the list. Free or discounted entry before a set time, arranged directly via WhatsApp.',
    'Schick uns deinen Namen, die Gruppengröße und den Club — wir setzen dich auf die Liste. Freier oder ermäßigter Eintritt vor einer bestimmten Uhrzeit, direkt per WhatsApp.',
    'Envíanos tu nombre, número de personas y el club — te ponemos en la lista. Entrada gratis o con descuento antes de una hora fija, directo por WhatsApp.',
    "Envoyez-nous votre nom, la taille du groupe et le club — on vous met sur la liste. Entrée gratuite ou réduite avant une heure fixe, directement via WhatsApp.",
  ),
  joinGuestlist: L('Zet mij op de guestlist', 'Put me on the guestlist', 'Setz mich auf die Guestlist', 'Ponme en la guestlist', 'Mettez-moi sur la guestlist'),

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
} as const

export type AppLabels = { [K in keyof typeof LABELS]: string }

export function getLabels(locale: string): AppLabels {
  const l = (APP_LOCALES as string[]).includes(locale) ? (locale as AppLocale) : 'en'
  const out = {} as Record<keyof typeof LABELS, string>
  for (const k of Object.keys(LABELS) as (keyof typeof LABELS)[]) out[k] = LABELS[k][l]
  return out
}
