import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
const ASK: T = L('Vraag Simon naar deze boot', 'Ask Simon about this boat', 'Frag Simon zu diesem Boot', 'Pregunta a Simon por este barco', 'Demandez ce bateau à Simon')
const GUESTS: T = L('gasten', 'guests', 'Gäste', 'invitados', 'invités')
const WA_MSG: T = L(
  'Hoi Ibiza mi Vida! Ik bekijk het dossier van {boat} en wil graag beschikbaarheid en prijs weten.',
  'Hi Ibiza mi Vida! I am looking at the dossier of {boat} and would like to know availability and price.',
  'Hallo Ibiza mi Vida! Ich schaue mir das Dossier der {boat} an und würde gern Verfügbarkeit und Preis erfahren.',
  '¡Hola Ibiza mi Vida! Estoy viendo el dossier de {boat} y me gustaría saber disponibilidad y precio.',
  'Bonjour Ibiza mi Vida ! Je consulte le dossier du {boat} et j’aimerais connaître la disponibilité et le prix.',
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
    <div className="min-h-screen bg-white pt-[calc(var(--nav-h)+12px)] text-black">
      {/* Kopregel: terug · bootnaam · hartje */}
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
        <Link
          href={terug}
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-neutral-200"
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

      {/* Geen PDF-preview meer op deze pagina, op uitdrukkelijk verzoek om
          snelheid. Zelfs de lichte Cloudinary-omzetting laadde bij binnenkomst
          honderden kilobytes aan pagina's die de meeste bezoekers nooit
          openslaan. Nu laadt deze pagina niets van het dossier: de foto komt
          uit de vlootlijst en staat bij de meeste bezoekers al in de cache,
          en het dossier wordt pas opgehaald als iemand er echt op klikt.

          De knop wijst naar /api/dossier en niet rechtstreeks naar de partner.
          Dat is gemeten sneller: rechtstreeks duurde 1,96s, via onze route na
          de eerste bezoeker 0,21s omdat het dan uit de edge-cache komt. Zelfde
          bestand, zelfde bron, alleen dichterbij. */}
      <div className="mx-auto max-w-4xl px-4 pb-6">
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={boat.image}
              alt={`${boat.model} ${naam}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-4 text-white sm:hidden">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
                <Users size={11} /> {boat.pax} {GUESTS[l]}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
                <MapPin size={11} /> {boat.marina}
              </span>
            </div>
          </div>

          <div className="p-5">
            <p className="text-[13px] leading-relaxed text-neutral-600">{TERMS[l]}</p>

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              {/* Zelfde tabblad: alleen dan brengt het terugpijltje van de
                  browser je terug naar deze pagina, en vandaar naar de vloot. */}
              <a
                href={pdfSrc}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-black active:scale-[0.98]"
              >
                <FileText size={16} /> {OPEN_PDF[l]}
                {boat.pdfPages ? <span className="font-sans text-[11px] font-normal normal-case tracking-normal text-white/60">· {boat.pdfPages} {PAGES[l]}</span> : null}
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ibiza-green px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition-all hover:brightness-95 active:scale-[0.98]"
              >
                <MessageCircle size={16} /> {ASK[l]}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
