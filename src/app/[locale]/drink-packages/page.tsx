import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'drink-packages')
}

import { getDictionary } from '@/lib/dictionary'
import DrinkPackagesClient from './DrinkPackagesClient'

export default async function DrinkPackagesPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <DrinkPackagesClient locale={locale} />
}
