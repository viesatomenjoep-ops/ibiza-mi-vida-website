import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'boats')
}

import { getDictionary } from '@/lib/dictionary'
import BoatsClient from './BoatsClient'

export default async function BoatsPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BoatsClient dict={dict} />
}
