import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string }
}

// The standalone Deals of the Day page has been retired — deals now live on the
// homepage. Old links are sent there.
export default function DealsPage({ params }: Props) {
  redirect(`/${params.locale}`)
}
