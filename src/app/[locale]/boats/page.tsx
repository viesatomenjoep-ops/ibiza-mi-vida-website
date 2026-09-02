import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'
import { getVenues } from '@/lib/clubtickets'
import { boatCategoryCovers } from '@/lib/boat-categories'
import BoatsHub from './BoatsHub'
import { BoatRentalPromo } from '@/components/hub/BoatRentalPromo'
import { PageFaq } from '@/components/seo/PageFaq'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { crumbLabel } from '@/lib/breadcrumb-labels'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'boats')
}

/**
 * Covers are resolved here, on the server, from the live venue feed — so the
 * photo on each card belongs to something the visitor will actually find behind
 * the link, and the whole grid is in the HTML for a crawler that runs no
 * JavaScript.
 */
export default async function BoatsPage({ params: { locale } }: { params: { locale: string } }) {
  const venues = await getVenues(locale)
  const covers = boatCategoryCovers(venues as any)
  // Hero: een echte boottocht uit de feed als die er is, anders onze eigen
  // vlootfoto — nooit een leeg vlak.
  const heroImage = covers['boat-trip'] || covers['boat-party'] || covers['private-boat-charters'] || '/fleet/cover.jpeg'

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[{ name: homeLabel(locale), path: '' }, { name: crumbLabel('boats', locale) }]}
      />
      <BoatsHub locale={locale} covers={covers} heroImage={heroImage} />
      <BoatRentalPromo locale={locale} />
      <PageFaq pageKey="boats" locale={locale} />
      <AuthorByline locale={locale} topic="boat trips in Ibiza" />
    </>
  )
}
