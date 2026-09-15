import { SchemaMarkup } from '@/components/seo/SchemaMarkup'

/**
 * Homepage structured data: Organization + Person (founder) + WebSite (with
 * SearchAction) + TravelAgency, in ONE @graph so Google can build rich
 * results (sitelinks search box, knowledge panel, business info).
 *
 * This used to build its own graph with its own copy of the Organization and
 * its own `sameAs` list, next to the copy in SchemaMarkup and the copies on
 * /about-us and /contact — four declarations of the same business that had
 * already drifted apart. It is now a thin alias so the homepage emits the same
 * nodes as every other page. Kept as a named component only so the homepage
 * reads as "the home schema" rather than a bag of booleans.
 */
export function HomeJsonLd({ locale = 'en' }: { locale?: string }) {
  return <SchemaMarkup locale={locale} organization founder website business page={{ path: '' }} />
}
