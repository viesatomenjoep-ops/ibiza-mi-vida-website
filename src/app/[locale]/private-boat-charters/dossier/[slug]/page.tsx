import { notFound, permanentRedirect } from 'next/navigation'
import { FLEET, dossierHref } from '@/data/fleet'

/**
 * Oude dossierroute — nu alleen nog een doorverwijzing naar het dossier zelf.
 *
 * Hier stond een pagina in eigen huisstijl die de PDF inbedde. De aanleiding
 * was goed (de kale PDF is een doodlopende steeg zonder weg terug), maar het
 * middel niet: op desktop kreeg je de PDF-werkbalk van de browser ingeklemd in
 * onze eigen kop en actiebalk, twee schermranden om elkaar heen. Een dossier
 * is een document, en een document hoort in de weergave van de browser — die
 * kan zoeken, printen, opslaan en pagina's overslaan, en dat kan onze pagina
 * niet nadoen. Het terugpijltje van de browser brengt je gewoon terug naar de
 * kaart waar je vandaan kwam.
 *
 * 308 en geen 307: deze URL is definitief vervangen. Hij stond in verstuurde
 * WhatsApp-berichten en in gedeelde links, dus hij mag geen 404 worden.
 *
 * Geen generateMetadata meer: een route die alleen doorverwijst serveert nooit
 * een titel, en een titel op een URL die niet bestaat concurreert alleen maar
 * met de pagina die de zoekintentie wél draagt.
 */
export default function DossierRedirect({ params }: { params: { slug: string } }) {
  const boat = FLEET.find((b) => b.slug === params.slug)
  if (!boat) notFound()
  permanentRedirect(dossierHref(boat.slug))
}
