import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'boats')
}

import { getDictionary } from '@/lib/dictionary'
import BoatsClient from './BoatsClient'
import { BoatRentalPromo } from '@/components/hub/BoatRentalPromo'
import { PageFaq } from '@/components/seo/PageFaq'
import { AuthorByline } from '@/components/seo/AuthorByline'

export default async function BoatsPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return (
    <>
      <BoatsClient locale={locale} dict={dict} />
      <BoatRentalPromo locale={locale} />
      <PageFaq pageKey="boats" locale={locale} />
      <AuthorByline locale={locale} topic="boat trips in Ibiza" />
    </>
  )
}
