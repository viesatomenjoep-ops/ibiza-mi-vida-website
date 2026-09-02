import { permanentRedirect } from 'next/navigation'

/**
 * Samengevoegd met /boats. De inhoud staat in
 * src/components/boats/rental-guide/nl.tsx en wordt onderaan /boats
 * gerenderd. 308 en geen 404: deze URL stond in de sitemap en was intern en
 * extern gelinkt, dus de index en de inkomende links verhuizen mee.
 */
export default function Page({ params }: { params: { locale: string } }) {
  permanentRedirect(`/${params.locale}/boats`)
}
