import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'boat-trip')
}

import { getDictionary } from '@/lib/dictionary'
import BoatTripClient from './BoatTripClient'

export default async function BoatTripPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BoatTripClient dict={dict} />
}
