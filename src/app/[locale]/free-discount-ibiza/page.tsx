import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'free-discount-ibiza', 'Free & Discount Ibiza')
}

import { getDictionary } from '@/lib/dictionary'
import FreeDiscountIbizaClient from './FreeDiscountIbizaClient'

export default async function FreeDiscountIbizaPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <FreeDiscountIbizaClient locale={locale} />
}
