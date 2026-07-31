import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'boat-party')
}

import { getDictionary } from '@/lib/dictionary'
import BoatPartyClient from './BoatPartyClient'

export default async function BoatPartyPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BoatPartyClient dict={dict} />
}
