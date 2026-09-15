import { SITE_URL, SITE_NAME, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { HOME_DESC } from '@/lib/seo-pages'
import { FOUNDER, FOUNDER_ID, KNOWS_ABOUT, founderNode } from '@/lib/team'
import { sameAs } from '@/lib/profiles'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { breadcrumbListSchema, type BreadcrumbItem } from '@/components/seo/BreadcrumbJsonLd'

/**
 * The one JSON-LD component.
 *
 * Structured data used to arrive here as nine separate files, each emitting its
 * own <script type="application/ld+json">. A page that wanted Organization,
 * FAQPage and a breadcrumb shipped three disconnected graphs, which is why the
 * same business was declared several times per page with no @id linking the
 * copies together. This component emits ONE script containing ONE @graph, so
 * every node on a page can reference the others by @id and a consumer sees a
 * single connected description of the page.
 *
 * Add new schema types as a variant here. Do not add another file under
 * seo/ that renders its own <script> — that is the pattern being retired.
 *
 * ── The honesty constraints ───────────────────────────────────────────────
 * Two of these are non-negotiable and both have bitten this site before:
 *
 * 1. NO INVENTED PRICE. `product.price` accepts null, and null means the
 *    Product is emitted WITHOUT an Offer. A page whose "from" price is still a
 *    TODO placeholder must not publish that placeholder as a real offer —
 *    Google treats a price in Product markup as a commitment, and a wrong one
 *    is a rich-result penalty and a customer complaint.
 *
 * 2. NO INVENTED RATING. `reviews` takes data that a caller fetched from the
 *    live Google Business Profile and nothing else. There is no default
 *    rating, no default count, no sample review. Pass null (or omit) and no
 *    rating markup is emitted at all — which is the correct output when there
 *    is no real rating. See src/lib/google-reviews.ts for the full history:
 *    this site previously shipped invented reviews and a hardcoded
 *    AggregateRating, which is a Google spam-policy violation.
 */

/** Anything a caller may pass; nulls and empties are dropped, never faked. */
export interface ProductOffer {
  /** Product name as shown to a human, already localised. */
  name: string
  description?: string
  /** e.g. "Wiber Rent a Car" on the car page, "Click&Boat" on the boat pages. */
  brand?: string
  /**
   * "From" price in euros, or null when we do not have a confirmed figure yet.
   * null => the Product is emitted with no Offer node at all.
   */
  price?: number | null
  priceCurrency?: string
  /** Locale-agnostic path, e.g. 'boat-rental-ibiza'. */
  path: string
  image?: string
  /** ISO date until which the price is valid; Google warns when this is absent. */
  priceValidUntil?: string
}

export interface ReviewData {
  rating: number
  total: number
  url?: string
}

/**
 * A WebPage node for the current URL: who wrote it, who publishes it, when it
 * was last revised. `dateModified` comes from CONTENT_UPDATED via
 * `contentUpdated(PAGE_KEY)` — the same value the visible "last updated" stamp
 * shows — so schema and page can never disagree about the date.
 */
export interface PageInfo {
  /** Locale-agnostic path, e.g. 'jet-ski-rental-ibiza'; '' for the homepage. */
  path: string
  /** ISO date of the last genuine content revision; omitted when unknown. */
  dateModified?: string
  /** Defaults to WebPage. */
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'ItemPage'
  name?: string
  description?: string
}

export interface SchemaMarkupProps {
  locale: Locale | string
  /** Site-wide Organization node. Set on the root layout and the homepage. */
  organization?: boolean
  /** The Person node for Simon (founder, author). Emitted once per page. */
  founder?: boolean
  /** WebSite node with the sitelinks SearchAction. Homepage only. */
  website?: boolean
  /** TravelAgency/LocalBusiness node for the knowledge panel. Homepage only. */
  business?: boolean
  /** WebPage node: author, publisher, dateModified. Pass on every evergreen page. */
  page?: PageInfo
  /** Product + Offer, for a rental/commercial page. */
  product?: ProductOffer
  /**
   * The SAME array that renders the visible FAQ accordion. Passing a different
   * array is the failure this component exists to prevent: schema that claims
   * an answer the page does not show is a structured-data violation.
   */
  faqs?: { q: string; a: string }[]
  /** Breadcrumb trail; the last item is the current page and carries no URL. */
  breadcrumbs?: BreadcrumbItem[]
  /** REAL review data only — from the live Google Business Profile, or null. */
  reviews?: ReviewData | null
}

/**
 * The Organization — declared identically everywhere it appears.
 *
 * This is the entity an answer engine has to recognise as "Ibiza Mi Vida".
 * Every page that emits it calls this function, so the description, the
 * `sameAs` profiles, the founder, the languages and the service area are the
 * same on the homepage, the about page, the contact page and every pillar.
 * Three pages used to declare three slightly different Organizations; that is
 * three entities to a parser, not one.
 */
export function organizationNode(locale: Locale) {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Ibiza Mi Vida',
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-clean.png`,
    image: `${SITE_URL}/og-default.jpg`,
    description: HOME_DESC[locale] ?? HOME_DESC.en,
    areaServed: [
      {
        '@type': 'Place',
        name: 'Ibiza, Spain',
        address: { '@type': 'PostalAddress', addressRegion: 'Ibiza', addressCountry: 'ES' },
      },
      { '@type': 'Place', name: 'Formentera, Spain' },
    ],
    telephone: `+${WHATSAPP_NUMBER}`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: `+${WHATSAPP_NUMBER}`,
      availableLanguage: FOUNDER.languageTags,
      areaServed: ['ES'],
    },
    knowsLanguage: FOUNDER.languageTags,
    // Same list as the Person: the business knows what its founder knows.
    knowsAbout: KNOWS_ABOUT.map((k) => k.name),
    sameAs: sameAs(),
    founder: { '@id': FOUNDER_ID },
    employee: { '@id': FOUNDER_ID },
    inLanguage: locale,
  }
}

/** WebSite node — one per site, with the calendar search as SearchAction. */
export function websiteNode(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: locale,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/calendar?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * LocalBusiness (TravelAgency) node for the knowledge panel. No street
 * address on purpose: this is a service-area business with no walk-in office,
 * and a made-up address is the fastest way to a suspended Business Profile.
 */
export function businessNode(locale: Locale) {
  return {
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/og-default.jpg`,
    telephone: `+${WHATSAPP_NUMBER}`,
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ibiza',
      addressRegion: 'Balearic Islands',
      addressCountry: 'ES',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 38.9067, longitude: 1.4206 },
    areaServed: [
      { '@type': 'Place', name: 'Ibiza, Spain' },
      { '@type': 'Place', name: 'Formentera, Spain' },
    ],
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    description: HOME_DESC[locale] ?? HOME_DESC.en,
  }
}

function pageNode(p: PageInfo, locale: Locale) {
  const clean = p.path.replace(/^\//, '')
  const url = `${SITE_URL}/${locale}${clean ? `/${clean}` : ''}`
  return {
    '@type': p.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    ...(p.name ? { name: p.name } : {}),
    ...(p.description ? { description: p.description } : {}),
    inLanguage: locale,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    // An AboutPage's main entity is the business itself; other page types
    // are about their own subject and only reference the organization.
    ...(p.type === 'AboutPage' ? { mainEntity: { '@id': `${SITE_URL}/#organization` } } : {}),
    author: { '@id': FOUNDER_ID },
    publisher: { '@id': `${SITE_URL}/#organization` },
    ...(p.dateModified ? { dateModified: p.dateModified } : {}),
  }
}

function productNode(p: ProductOffer, locale: Locale, reviews?: ReviewData | null) {
  const url = `${SITE_URL}/${locale}/${p.path.replace(/^\//, '')}`
  const hasPrice = typeof p.price === 'number' && Number.isFinite(p.price) && p.price > 0

  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
    ...(p.image ? { image: p.image.startsWith('http') ? p.image : `${SITE_URL}${p.image}` } : {}),
    url,
    // No confirmed price => no Offer. See the honesty constraints above.
    ...(hasPrice
      ? {
          offers: {
            '@type': 'Offer',
            price: p.price,
            priceCurrency: p.priceCurrency ?? 'EUR',
            availability: 'https://schema.org/InStock',
            url,
            ...(p.priceValidUntil ? { priceValidUntil: p.priceValidUntil } : {}),
            seller: { '@id': `${SITE_URL}/#organization` },
          },
        }
      : {}),
    // Ratings attach to the Product only when they are real.
    ...(reviews && reviews.total > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviews.rating,
            reviewCount: reviews.total,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }
}

function faqNode(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function SchemaMarkup({
  locale,
  organization,
  founder,
  website,
  business,
  page,
  product,
  faqs,
  breadcrumbs,
  reviews,
}: SchemaMarkupProps) {
  const l = (LOCALES as readonly string[]).includes(locale as string)
    ? (locale as Locale)
    : DEFAULT_LOCALE

  const graph: Record<string, unknown>[] = []

  if (organization) graph.push(organizationNode(l))
  if (founder) graph.push(founderNode())
  if (website) graph.push(websiteNode(l))
  if (business) graph.push(businessNode(l))
  if (page) graph.push(pageNode(page, l))
  if (product) graph.push(productNode(product, l, reviews))
  if (faqs && faqs.length) graph.push(faqNode(faqs))
  if (breadcrumbs && breadcrumbs.length >= 2) graph.push(breadcrumbListSchema(breadcrumbs, l))

  // An Organization-level rating, only when the caller handed us real data and
  // there is no Product on the page to carry it instead.
  if (reviews && reviews.total > 0 && !product) {
    graph.push({
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviews.rating,
        reviewCount: reviews.total,
        bestRating: 5,
        worstRating: 1,
      },
    })
  }

  if (!graph.length) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  )
}
