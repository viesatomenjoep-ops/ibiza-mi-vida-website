import { SITE_URL } from '@/lib/seo'

/**
 * BreadcrumbList structured data.
 *
 * Why this exists: the site has three-level-deep routes
 * (`/en/club-tickets/hi-ibiza/glitterbox`) and no breadcrumb markup at all, so
 * Google had nothing to build a hierarchy from and fell back to printing the
 * raw URL under the title in the SERP. A BreadcrumbList replaces that URL with
 * a readable "Home > Hï Ibiza > Glitterbox" trail, which also tells crawlers
 * how the detail page relates to its listing page.
 *
 * Two rules this component enforces:
 *
 * 1. The LAST crumb carries no `item` URL. Per Google's breadcrumb guidance the
 *    final entry is the page you are already on, so it is position-only: a
 *    `name` and a `position`, no link. Emitting a self-referential `item` there
 *    is a common source of "breadcrumb trail is a loop" style warnings.
 *
 * 2. URLs are absolute. Structured data is consumed out of page context (feeds,
 *    caches, answer engines), so a relative `/en/clubs` cannot be resolved back
 *    to a page. Every `item` is therefore built as SITE_URL + `/{locale}` +
 *    path, which also keeps the trail on the canonical www host regardless of
 *    which domain served the HTML.
 */

/** Localized "Home" label for the five supported locales. */
export function homeLabel(locale: string): string {
  const labels: Record<string, string> = {
    nl: 'Home',
    en: 'Home',
    de: 'Startseite',
    es: 'Inicio',
    fr: 'Accueil',
  }
  return labels[locale] || labels.en
}

/**
 * Localized label for an intermediate route segment (the listing page a detail
 * page hangs under). Falls back to a humanized version of the segment so an
 * unmapped path still produces a sane crumb rather than an empty one.
 */
export function sectionLabel(segment: string, locale: string): string {
  const map: Record<string, Record<string, string>> = {
    'club-tickets': { nl: 'Clubs', en: 'Clubs', de: 'Clubs', es: 'Clubs', fr: 'Clubs' },
    clubs: { nl: 'Clubs', en: 'Clubs', de: 'Clubs', es: 'Clubs', fr: 'Clubs' },
    artists: { nl: 'Artiesten', en: 'Artists', de: 'Künstler', es: 'Artistas', fr: 'Artistes' },
    locations: { nl: 'Locaties', en: 'Locations', de: 'Orte', es: 'Ubicaciones', fr: 'Lieux' },
    tours: { nl: 'Tours', en: 'Tours', de: 'Touren', es: 'Tours', fr: 'Excursions' },
    activities: { nl: 'Activiteiten', en: 'Activities', de: 'Aktivitäten', es: 'Actividades', fr: 'Activités' },
    'boat-trip': { nl: 'Boottochten', en: 'Boat trips', de: 'Bootstouren', es: 'Excursiones en barco', fr: 'Sorties en bateau' },
    'water-sports': { nl: 'Watersport', en: 'Water sports', de: 'Wassersport', es: 'Deportes acuáticos', fr: 'Sports nautiques' },
    'ferry-formentera': { nl: 'Ferry Formentera', en: 'Ferry Formentera', de: 'Fähre Formentera', es: 'Ferry Formentera', fr: 'Ferry Formentera' },
    'shuttle-ferry': { nl: 'Shuttle ferry', en: 'Shuttle ferry', de: 'Shuttle-Fähre', es: 'Ferry lanzadera', fr: 'Navette maritime' },
  }
  const entry = map[segment]
  if (entry) return entry[locale] || entry.en
  return segment.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
}

export interface BreadcrumbItem {
  name: string
  /**
   * Locale-agnostic path without the locale prefix, e.g. `clubs` or
   * `club-tickets/hi-ibiza`. Omit for the current page (the last crumb).
   */
  path?: string
}

/** Build the raw BreadcrumbList object (exported so pages with an existing
 *  `@graph` can drop it in as another node instead of a second <script>). */
export function breadcrumbListSchema(items: BreadcrumbItem[], locale: string) {
  const last = items.length - 1
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      // Last crumb = current page → position-only, no `item` URL.
      ...(i === last || item.path === undefined
        ? {}
        : { item: `${SITE_URL}/${locale}${item.path ? `/${item.path.replace(/^\//, '')}` : ''}` }),
    })),
  }
}

export function BreadcrumbJsonLd({ items, locale }: { items: BreadcrumbItem[]; locale: string }) {
  if (items.length < 2) return null
  const schema = {
    '@context': 'https://schema.org',
    ...breadcrumbListSchema(items, locale),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
