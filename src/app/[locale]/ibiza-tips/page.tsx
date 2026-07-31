import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'ibiza-tips', 'Ibiza Tips')
}

import { getDictionary } from '@/lib/dictionary'
import IbizaTipsClient from './IbizaTipsClient'

export default async function IbizaTipsPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <IbizaTipsClient locale={locale} />
}
