import { SITE_URL, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export interface ListEntry {
  /** Human-readable name of the thing being listed. */
  name: string
  /** Locale-prefixed path, e.g. `nl/club-tickets/hi-ibiza/black-coffee`. */
  path: string
  /** ISO yyyy-mm-dd — only for events, drives the `startDate` on the item. */
  date?: string
  image?: string
  /** Naam van de zaak. Alleen voor events; Google eist `location` op een Event. */
  venueName?: string
}

/**
 * ItemList structured data for listing pages.
 *
 * Why: the calendar is the site's highest-priority page and holds roughly two
 * thousand events, yet it emitted no structured data at all — search engines
 * and answer engines had to infer that it was a list of bookable events from
 * the markup. The club and artist indexes had the same gap. ItemList states it
 * outright and gives each entry a stable URL, which is what lets an answer
 * engine cite a specific night rather than "some page on that site".
 *
 * Deliberately capped. `maxItems` exists because a two-thousand-entry JSON-LD
 * blob would add hundreds of kilobytes to the HTML of the page we just spent
 * this much effort making fast — and Google does not reward exhaustiveness
 * here. The full set is still discoverable via the sitemap, which is the right
 * channel for it. `numberOfItems` reports the TRUE total, not the truncated
 * length, so the markup never misrepresents the page.
 */
export function ItemListJsonLd({
  entries,
  locale,
  name,
  maxItems = 50,
  /** True total, when `entries` has already been sliced by the caller. */
  totalCount,
}: {
  entries: ListEntry[]
  locale: string
  /** Name of the list itself, e.g. "Ibiza club calendar". */
  name: string
  maxItems?: number
  totalCount?: number
}) {
  if (!entries.length) return null
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE
  const shown = entries.slice(0, maxItems)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    inLanguage: l,
    numberOfItems: totalCount ?? entries.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    // Een ListItem met alleen een naam en een URL komt niet in aanmerking voor
    // Google's event-carrousel: die eist dat `item` een volledig Event is, met
    // minstens naam, startDate en location. Deze lijst gaf jarenlang alleen
    // labels door — de agenda, de belangrijkste pagina van de site, leverde dus
    // nul events aan de index. `date` en `image` stonden al in het type
    // beschreven en werden hier stil weggegooid.
    itemListElement: shown.map((e, i) => {
      const url = `${SITE_URL}/${e.path.replace(/^\//, '')}`
      return {
        '@type': 'ListItem',
        position: i + 1,
        ...(e.date
          ? {
              item: {
                '@type': 'MusicEvent',
                '@id': url,
                name: e.name,
                startDate: e.date,
                eventStatus: 'https://schema.org/EventScheduled',
                eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                url,
                ...(e.image ? { image: e.image } : {}),
                location: {
                  '@type': 'Place',
                  name: e.venueName || 'Ibiza',
                  address: { '@type': 'PostalAddress', addressLocality: 'Ibiza', addressCountry: 'ES' },
                },
              },
            }
          : { name: e.name, url }),
      }
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
