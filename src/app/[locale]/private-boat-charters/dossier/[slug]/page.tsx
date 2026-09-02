import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, MessageCircle, Download, MapPin, Users } from 'lucide-react'
import { FLEET } from '@/data/fleet'
import { FavouriteButton } from '@/components/boats/FavouriteButton'
import { DossierPages } from '@/components/boats/DossierPages'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'

export const revalidate = 86400

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const BACK: T = L('Terug naar de vloot', 'Back to the fleet', 'Zurück zur Flotte', 'Volver a la flota', 'Retour à la flotte')
const DOSSIER: T = L('Bootdossier', 'Boat dossier', 'Bootsdossier', 'Dossier del barco', 'Dossier du bateau')
const OPEN_PDF: T = L('Open het dossier (PDF)', 'Open the dossier (PDF)', 'Dossier öffnen (PDF)', 'Abrir el dossier (PDF)', 'Ouvrir le dossier (PDF)')
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

      {/* Het dossier als eigen content: elke PDF-pagina uitgetekend naar een
          afbeelding, onder elkaar, volle breedte, gewoon scrollbaar. Hier stond
          een ingebedde <object>: die gaf op iOS alleen de eerste pagina en op
          desktop de PDF-werkbalk van de browser, wat oogt als andermans
          document. Zie DossierPages voor de afwegingen (scherpte, geheugen,
          pagina-voor-pagina tonen). */}
      <div className="mx-auto max-w-4xl px-4 pb-4">
        <DossierPages
          pdfUrl={boat.pdf}
          pages={boat.pdfPages ?? 0}
          locale={l}
          title={`${boat.model} ${naam}`}
          fallbackHref={pdfSrc}
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ibiza-green px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-95 active:scale-[0.98]"
          >
            <MessageCircle size={16} /> {ASK[l]}
          </a>
          {/* Zelfde tabblad, ook op desktop: het terugpijltje moet altijd
              naar deze pagina terugleiden. */}
          <a
            href={pdfSrc}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-600 underline underline-offset-2 hover:text-black"
          >
            <Download size={14} /> {OPEN_PDF[l]}
          </a>
        </div>
      </div>
    </div>
  )
}
