import { getDictionary } from '@/lib/dictionary'
import BlogClient from './BlogClient'

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BlogClient locale={locale} />
}
