import type { Locale } from './seo'

// Shared copy for the simple "page-layout" content pages
// (guestlist, blog, drink-packages, car-scooter-rental, free-discount-ibiza, ibiza-tips).
type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const PL_GENERIC = {
  subtitle: L(
    'Ontdek het beste van Ibiza. Veilig en vertrouwd via Ibiza mi Vida.',
    'Discover the best of Ibiza. Safe and trusted via Ibiza mi Vida.',
    'Entdecke das Beste von Ibiza. Sicher und vertraut über Ibiza mi Vida.',
    'Descubre lo mejor de Ibiza. Seguro y de confianza vía Ibiza mi Vida.',
    'Découvrez le meilleur d’Ibiza. Sûr et fiable via Ibiza mi Vida.',
  ),
  searchPlaceholder: L('Zoeken…', 'Search…', 'Suchen…', 'Buscar…', 'Rechercher…'),
  emptyText: L(
    'Binnenkort vind je hier het volledige aanbod. Stel je vraag intussen via WhatsApp — wij regelen het direct voor je.',
    'The full offer is coming here soon. In the meantime, ask us on WhatsApp — we arrange it for you right away.',
    'Das vollständige Angebot findest du hier in Kürze. Frag uns solange per WhatsApp — wir kümmern uns sofort darum.',
    'Muy pronto encontrarás aquí toda la oferta. Mientras tanto, pregúntanos por WhatsApp — lo gestionamos al momento.',
    'L’offre complète arrive bientôt ici. En attendant, contactez-nous sur WhatsApp — nous nous en occupons tout de suite.',
  ),
  waTitle: L('Persoonlijk advies nodig?', 'Need personal advice?', 'Persönliche Beratung gewünscht?', '¿Necesitas consejo personal?', 'Besoin d’un conseil personnalisé ?'),
  waText: L(
    'Stuur ons een bericht en we regelen het direct voor je.',
    'Send us a message and we arrange it for you right away.',
    'Schreib uns eine Nachricht und wir kümmern uns sofort darum.',
    'Envíanos un mensaje y lo gestionamos al momento.',
    'Envoyez-nous un message et nous nous en occupons tout de suite.',
  ),
}

export interface PlPageCopy { title: T; tab: T }

export const PL_PAGES: Record<string, PlPageCopy> = {
  'drink-packages': {
    title: L('Drankpakketten', 'Drink Packages', 'Getränkepakete', 'Packs de Bebida', 'Forfaits Boissons'),
    tab: L('Drankpakketten', 'Drink Packages', 'Getränkepakete', 'Packs de Bebida', 'Forfaits Boissons'),
  },
  'car-scooter-rental': {
    title: L('Auto & Scooter Verhuur', 'Car & Scooter Rental', 'Auto- & Rollervermietung', 'Alquiler de Coches y Motos', 'Location Voiture & Scooter'),
    tab: L('Verhuur', 'Rental', 'Vermietung', 'Alquiler', 'Location'),
  },
}

export function plCopy(page: string, localeRaw: string) {
  const locale = (['nl', 'en', 'de', 'es', 'fr'] as const).includes(localeRaw as Locale) ? (localeRaw as Locale) : 'nl'
  const p = PL_PAGES[page]
  return {
    title: p.title[locale],
    tab: p.tab[locale],
    subtitle: PL_GENERIC.subtitle[locale],
    searchPlaceholder: PL_GENERIC.searchPlaceholder[locale],
    emptyText: PL_GENERIC.emptyText[locale],
    waTitle: PL_GENERIC.waTitle[locale],
    waText: PL_GENERIC.waText[locale],
  }
}
