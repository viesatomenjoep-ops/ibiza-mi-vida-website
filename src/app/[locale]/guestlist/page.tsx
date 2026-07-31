import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'guestlist')
}

import { getDictionary } from '@/lib/dictionary'
import GuestlistClient from './GuestlistClient'

export default async function GuestlistPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <GuestlistClient locale={locale} />
}
