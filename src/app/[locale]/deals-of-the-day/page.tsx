import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'deals-of-the-day')
}

import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string }
}

// The standalone Deals of the Day page has been retired — deals now live on the
// homepage. Old links are sent there.
export default function DealsPage({ params }: Props) {
  redirect(`/${params.locale}`)
}
