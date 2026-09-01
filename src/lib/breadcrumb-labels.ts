import type { Locale } from './seo'

/**
 * Kruimellabels voor de categoriepagina's.
 *
 * Search Console meldde twee geldige BreadcrumbList-items voor de hele site.
 * Nul fouten — het waren er gewoon bijna geen: tien categoriepagina's zonden
 * er helemaal geen uit. Zonder kruimelpad drukt Google de kale URL onder de
 * titel in het zoekresultaat af in plaats van een leesbaar "Home › Boten", en
 * een antwoordmachine mist het enige signaal dat zegt hoe een pagina zich tot
 * de rest van de site verhoudt.
 *
 * Eén plek, want dezelfde tekst hoort niet in tien bestanden opnieuw te worden
 * getypt en daar uit elkaar te lopen.
 */
type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

export const BREADCRUMB_LABELS: Record<string, T> = {
  boats: L('Boten', 'Boats', 'Boote', 'Barcos', 'Bateaux'),
  calendar: L('Agenda', 'Calendar', 'Kalender', 'Agenda', 'Calendrier'),
  clubs: L('Clubs', 'Clubs', 'Clubs', 'Clubs', 'Clubs'),
  artists: L('Artiesten', 'Artists', 'Künstler', 'Artistas', 'Artistes'),
  tips: L('Ibiza tips', 'Ibiza tips', 'Ibiza Tipps', 'Consejos Ibiza', 'Conseils Ibiza'),
  tours: L('Rondleidingen', 'Guided tours', 'Geführte Touren', 'Visitas guiadas', 'Visites guidées'),
  'boat-party': L('Boat party', 'Boat party', 'Boat Party', 'Boat party', 'Boat party'),
  'boat-trip': L('Boottochten', 'Boat trips', 'Bootstouren', 'Excursiones en barco', 'Sorties en bateau'),
  'water-sports': L('Watersport', 'Water sports', 'Wassersport', 'Deportes acuáticos', 'Sports nautiques'),
  faq: L('Veelgestelde vragen', 'FAQ', 'FAQ', 'Preguntas frecuentes', 'FAQ'),
}

/** Het label voor een route, met Engels als terugval. */
export function crumbLabel(route: string, locale: string): string {
  const entry = BREADCRUMB_LABELS[route]
  if (!entry) return route.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
  return entry[locale as Locale] ?? entry.en
}
