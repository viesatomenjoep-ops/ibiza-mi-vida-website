import { getDictionary } from '@/dictionaries'
import BoatsClient from './BoatsClient'

export default async function BoatsPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BoatsClient dict={dict} />
}
