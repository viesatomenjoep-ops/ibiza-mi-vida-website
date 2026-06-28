import { getDictionary } from '@/lib/dictionary'
import ShuttleFerryClient from './ShuttleFerryClient'

export default async function ShuttleFerryPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <ShuttleFerryClient dict={dict} />
}
