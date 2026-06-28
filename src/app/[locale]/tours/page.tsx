import { getDictionary } from '@/lib/dictionary'
import ToursClient from './ToursClient'

export default async function ToursPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <ToursClient dict={dict} />
}
