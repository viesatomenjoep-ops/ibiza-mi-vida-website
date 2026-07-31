import type { Metadata } from 'next'
import { staticMetadata } from '@/lib/seo-pages'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return staticMetadata(params.locale, 'blog')
}

import { getDictionary } from '@/lib/dictionary'
import BlogClient from './BlogClient'

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BlogClient locale={locale} />
}
