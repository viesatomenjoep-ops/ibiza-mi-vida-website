import { getDictionary } from '@/lib/dictionary'
import BootfeestenClient from './BootfeestenClient'

export default async function BootfeestenPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await getDictionary(locale as any)

  return <BootfeestenClient dict={dict} />
}
