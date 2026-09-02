import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MessageCircle, FileText, MapPin, Users } from 'lucide-react'
import { FLEET } from '@/data/fleet'
import { FavouriteButton } from '@/components/boats/FavouriteButton'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'

export const revalidate = 86400

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const BACK: T = L('Terug naar de vloot', 'Back to the fleet', 'Zurück zur Flotte', 'Volver a la flota', 'Retour à la flotte')
const DOSSIER: T = L('Bootdossier', 'Boat dossier', 'Bootsdossier', 'Dossier del barco', 'Dossier du bateau')
const OPEN_PDF: T = L('Open het dossier', 'Open the dossier', 'Dossier öffnen', 'Abrir el dossier', 'Ouvrir le dossier')
const PAGES: T = L('pagina’s', 'pages', 'Seiten', 'páginas', 'pages')
const TERMS: T = L(
  'In het dossier staan de foto’s, de afmetingen en de voorwaarden van deze boot. Wat er bij de prijs inzit — schipper, brandstof, btw — verschilt per boot; Simon bevestigt het voordat je boekt.',
  'The dossier holds the photos, the dimensions and the terms for this boat. What the rate includes — skipper, fuel, VAT — differs per boat; Simon confirms it before you book.',
  'Im Dossier stehen die Fotos, die Maße und die Bedingungen dieses Bootes. Was im Preis enthalten ist — Skipper, Kraftstoff, MwSt. — unterscheidet sich je Boot; Simon bestätigt es vor der Buchung.',
  'El dossier recoge las fotos, las medidas y las condiciones de este barco. Lo que incluye la tarifa — patrón, combustible, IVA — varía según el barco; Simon lo confirma antes de reservar.',
  'Le dossier contient les photos, les dimensions et les conditions de ce bateau. Ce que le tarif inclut — skipper, carburant, TVA — varie selon le bateau ; Simon le confirme avant réservation.',
)
const ASK: T = L('Boek deze boot direct', 'Book this boat now', 'Dieses Boot direkt buchen', 'Reserva este barco ya', 'Réservez ce bateau')
const FULL: T = L('Volledig scherm', 'Full screen', 'Vollbild', 'Pantalla completa', 'Plein écran')
const NO_EMBED: T = L(
  'Kan het dossier hier niet tonen. Open het in een nieuw venster.',
  'Cannot display the dossier here. Open it in a new window.',
  'Das Dossier kann hier nicht angezeigt werden. In neuem Fenster öffnen.',
  'No se puede mostrar el dossier aquí. Ábrelo en una ventana nueva.',
  'Impossible d’afficher le dossier ici. Ouvrez-le dans une nouvelle fenêtre.',
)
const GUESTS: T = L('gasten', 'guests', 'Gäste', 'invitados', 'invités')
const WA_MSG: T = L(
  'Hoi Ibiza mi Vida! Ik heb het dossier van {boat} bekeken en wil deze boot graag boeken. Kunnen jullie de beschikbaarheid en de prijs bevestigen?',
  'Hi Ibiza mi Vida! I have read the dossier of {boat} and would like to book this boat. Could you confirm availability and the price?',
  'Hallo Ibiza mi Vida! Ich habe das Dossier der {boat} gelesen und möchte dieses Boot buchen. Können Sie Verfügbarkeit und Preis bestätigen?',
  '¡Hola Ibiza mi Vida! He visto el dossier de {boat} y quiero reservar este barco. ¿Podéis confirmar la disponibilidad y el precio?',
  'Bonjour Ibiza mi Vida ! J’ai consulté le dossier du {boat} et je souhaite réserver ce bateau. Pouvez-vous confirmer la disponibilité et le tarif ?',
)

function boatFor(slug: string) {
  return FLEET.find((b) => b.slug === slug) ?? null
}

/**
 * noindex, bewust. 94 dossierpagina's met als inhoud een ingebedde PDF zijn
 * dun-op-dun voor een zoekmachine en zouden met de charterpagina om dezelfde
 * zoekterm vechten — precies de fout die bij /ibiza-guestlist is rechtgezet.
 * Dit is een gebruikerspagina, geen landingspagina.
 */
export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const boat = boatFor(params.slug)
  if (!boat) return {}
  return {
    title: `${boat.name ?? boat.model} — ${boat.model}`,
    robots: { index: false, follow: true },
  }
}

/**
 * Dossierweergave in eigen huisstijl.
 *
 * De kaarten openden de kale PDF in een nieuw tabblad: geen logo, geen weg
 * terug, geen WhatsApp — een doodlopende steeg op precies het moment dat
 * iemand geïnteresseerd raakt. Nu staat de PDF ín de site, met eromheen wat
 * er op dat moment toe doet: terug naar de vloot (naar déze boot, via de
 * #boat-anker dat de vlootpagina al kent), het hartje, en Simon.
 *
 * De terugknop is een Link en geen history.back(): wie het dossier deelt of
 * uit een zoekresultaat binnenkomt heeft geen geschiedenis om naar terug te
 * gaan, en het anker zorgt dat de vlootpagina naar de juiste kaart scrolt.
 */
export default function DossierPage({ params }: { params: { locale: string; slug: string } }) {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const boat = boatFor(params.slug)
  if (!boat) notFound()

  const naam = boat.name ?? boat.model
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_MSG[l].replace('{boat}', `${boat.model} "${naam}"`))}`
  const terug = `/${l}/private-boat-charters#boat-${boat.slug}`
  const pdfSrc = `/api/dossier/${boat.slug}`

  return (
    <div className="min-h-screen bg-neutral-100 pt-[calc(var(--nav-h)+8px)] text-black">
      {/* Kopregel: terug · bootnaam · hartje. Slank gehouden — het dossier is
          de pagina, dit is alleen de lijst eromheen. */}
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-2.5">
        <Link
          href={terug}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-black ring-1 ring-black/10 transition-colors hover:bg-neutral-200"
        >
          <ArrowLeft size={16} /> {BACK[l]}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-black/50">{DOSSIER[l]}</div>
          <h1 className="truncate font-serif text-lg font-black leading-tight">
            {boat.model} <span className="text-ibiza-green">{naam}</span>
          </h1>
        </div>
        <span className="hidden items-center gap-3 text-xs font-semibold text-black/50 sm:inline-flex">
          <span className="inline-flex items-center gap-1"><Users size={12} className="text-ibiza-green" /> {boat.pax} {GUESTS[l]}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} className="text-ibiza-green" /> {boat.marina}</span>
        </span>
        <FavouriteButton slug={boat.slug} locale={l} className="!bg-neutral-900" />
      </div>

      {/* Het dossier zelf, meteen.
          Hier stond een tussenstap: een foto met een knop "open het dossier",
          dus je klikte op een boot om een pagina te krijgen die zei dat je nog
          een keer moest klikken. Nu staat het document er direct, in de
          PDF-weergave van de browser — die streamt en toont de eerste pagina
          voordat de rest binnen is.

          <object> en niet <iframe>: de inhoud tussen de tags is de terugval als
          de browser geen PDF kan inbedden (iOS doet dat wisselend). Die terugval
          is een echte link, geen leeg vlak, en de knop onderaan werkt sowieso. */}
      <div className="mx-auto max-w-5xl px-3 pb-32">
        <object
          data={pdfSrc}
          type="application/pdf"
          aria-label={`${DOSSIER[l]} — ${boat.model} ${naam}`}
          className="block h-[74svh] min-h-[420px] w-full rounded-2xl bg-white shadow-lg ring-1 ring-black/10"
        >
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl bg-white p-8 text-center">
            <p className="text-sm text-neutral-600">{NO_EMBED[l]}</p>
            <a
              href={pdfSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-black uppercase tracking-wider text-white"
            >
              <FileText size={16} /> {OPEN_PDF[l]}
            </a>
          </div>
        </object>

        <p className="mx-auto mt-4 max-w-3xl text-center text-[12px] leading-relaxed text-neutral-500">{TERMS[l]}</p>
      </div>

      {/* Boeken vanuit het dossier. Vast onderin, want je neemt dat besluit
          terwijl je op pagina zeven van de PDF zit — niet bovenaan. */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_-12px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="book-cta inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ibiza-green px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white"
          >
            <MessageCircle size={16} /> {ASK[l]}
          </a>
          <a
            href={pdfSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-neutral-700 ring-1 ring-black/12 transition-colors hover:bg-neutral-100"
          >
            <FileText size={15} /> {FULL[l]}
            {boat.pdfPages ? <span className="font-sans text-[11px] font-normal text-neutral-400">· {boat.pdfPages} {PAGES[l]}</span> : null}
          </a>
        </div>
      </div>
    </div>
  )
}
