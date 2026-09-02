import { permanentRedirect } from 'next/navigation'

// This page was unfinished placeholder scaffolding; the real, fully translated
// private-charter page lives at /private-boat-charters.
export default function BoatChartersPage({ params }: { params: { locale: string } }) {
  permanentRedirect(`/${params.locale}/private-boat-charters`)
}
