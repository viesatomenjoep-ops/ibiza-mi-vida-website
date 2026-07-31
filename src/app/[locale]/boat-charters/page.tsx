import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'boat-charters', 'Boat Charters Ibiza')
}

import { getDictionary } from '@/lib/dictionary'
import BoatChartersClient from './BoatChartersClient'

export default async function BoatChartersPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BoatChartersClient dict={dict} />
}
