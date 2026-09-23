import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MessageCircle, FileText, Users, Ruler, MapPin, Ship, ArrowLeft } from 'lucide-react'

import { FLEET, dossierHref, type Boat } from '@/data/fleet'
import { getLiveFleet, priceForDate, statusForDate, seasonForDate, liveStampTime } from '@/lib/yacht-broker'
import { ibizaToday, longDate } from '@/lib/date-label'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'
import { detailMetadata } from '@/lib/seo-pages'
import { BOAT_DETAIL_COPY, CATEGORY_LABEL, CATEGORY_PHRASE } from '@/lib/boat-detail-copy'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { crumbLabel } from '@/lib/breadcrumb-labels'
import { Breadcrumbs } from '@/components/hub/HubSections'
import { WHATSAPP_NUMBER } from '@/lib/whatsapp'

/**
 * Eén boot, op een eigen URL.
 *
 * Waarom deze route bestaat: vanaf de homepage ging een klik op een boot naar
 * `/private-boat-charters#boat-<slug>`. Dat laadt de hele vloot — 94 kaarten,
 * de filterbalk, de live laag — om daarna naar één kaart te scrollen. Je
 * betaalt dus de zwaarste pagina van de site om één product te zien, en wat je
 * dan ziet is een kaart met vier regels. Een eigen pagina is het antwoord op
 * allebei: hij laadt alleen deze boot, en hij kan wél alles vertellen (specs,
 * seizoensbanden, beschikbaarheid van vandaag, het dossier).
 *
 * En hij kan geïndexeerd worden. Een modal kan dat geen van beide: die zit nog
 * steeds achter de vlootpagina en heeft geen eigen URL om te delen of te
 * citeren.
 *
 * 900 seconden, gelijk aan de vlootpagina: de live beschikbaarheid staat in de
 * HTML en de partnerfeed wordt vijftien minuten gecachet. Een uur oud zou een
 * boot als vrij tonen die al drie kwartier weg is.
 */
export const revalidate = 900

const boatBySlug = (slug: string): Boat | undefined => FLEET.find((b) => b.slug === slug)

/** "Vanquish VQ58 The Wolf" — de naam zoals een mens hem noemt. */
const boatName = (b: Boat) => (b.name ? `${b.model} ${b.name}` : b.model)

const loc = (raw: string): Locale =>
  (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : DEFAULT_LOCALE

const BCP: Record<Locale, string> = { nl: 'nl-NL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' }

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const boat = boatBySlug(params.slug)
  if (!boat) return {}
  const l = loc(params.locale)
  const C = BOAT_DETAIL_COPY[l]
  const soort = CATEGORY_LABEL[boat.category][l]
  // De omschrijving draagt de feiten die iemand in het zoekresultaat zoekt:
  // soort, aantal gasten, haven en het vanafbedrag. Uit de data, niet getypt.
  const description = `${boatName(boat)} — ${soort.toLowerCase()}, ${boat.pax} ${C.pax.toLowerCase()}, ${boat.marina}. €${boat.price.low.toLocaleString(BCP[l])} ${C.perDay}.`
  return detailMetadata(l, `private-boat-charters/${boat.slug}`, boatName(boat), {
    description,
    image: boat.image,
    // Vaste suffix: twee boten van hetzelfde model verschillen alleen in hun
    // eigennaam, en zonder deze toevoeging staat er op de pagina niets dat
    // zegt waar je bent. detailMetadata kort de naam in plaats van de suffix.
    suffix: '— Ibiza',
  })
}

export default async function BoatPage({ params }: { params: { locale: string; slug: string } }) {
  const boat = boatBySlug(params.slug)
  if (!boat) notFound()

  const l = loc(params.locale)
  const C = BOAT_DETAIL_COPY[l]
  const bcp = BCP[l]
  const fmt = (n: number) => n.toLocaleString(bcp)

  const soort = CATEGORY_LABEL[boat.category][l]
  const vandaag = ibizaToday()
  const seizoen = seasonForDate(vandaag)

  // Live laag: dezelfde bron en dezelfde cache als de vlootpagina. Valt hij
  // weg, dan staat de statische band er gewoon — nooit een verzonnen stand.
  const live = await getLiveFleet()
  const lb = live?.boats[boat.brokerKey] ?? null
  const inRange = !!(live && vandaag >= live.rangeStart && vandaag < live.rangeEnd)
  const status = lb && inRange ? statusForDate(lb, vandaag) : null
  const livePrijs = lb && inRange ? priceForDate(lb, vandaag, live!.season) : null

  // Een boot zonder tussenseizoensprijs valt in die maanden terug op de lage
  // band; dan hoort het label dat ook te zeggen (zelfde regel als op de kaart).
  const band = seizoen === 'mid' && boat.price.mid == null ? 'low' : seizoen
  const bandPrijs = band === 'high' ? boat.price.high : band === 'mid' ? (boat.price.mid as number) : boat.price.low
  const dagPrijs = livePrijs ?? bandPrijs
  const bandLabel = band === 'high' ? C.seasonHigh : band === 'mid' ? C.seasonMid : C.seasonLow

  const crumbs = [
    { name: homeLabel(l), path: '' },
    { name: crumbLabel('private-boat-charters', l), path: 'private-boat-charters' },
    { name: boatName(boat) },
  ]

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    C.waMessage(`${boatName(boat)} (${boat.marina}, ${boat.pax} pax)`),
  )}`

  // Verwante boten: eerst uit dezelfde haven, aangevuld met dezelfde soort.
  // Deterministisch (op prijs, dan op slug) — dit rendert server-side.
  const verwant = [
    ...FLEET.filter((b) => b.slug !== boat.slug && b.marina === boat.marina),
    ...FLEET.filter((b) => b.slug !== boat.slug && b.marina !== boat.marina && b.category === boat.category),
  ]
    .filter((b, i, a) => a.findIndex((x) => x.slug === b.slug) === i)
    .sort((a, b) => a.price.low - b.price.low || a.slug.localeCompare(b.slug))
    .slice(0, 4)

  const banden: { label: string; note: string; prijs: number | undefined }[] = [
    { label: C.seasonLow, note: C.seasonLowNote, prijs: boat.price.low },
    { label: C.seasonMid, note: C.seasonMidNote, prijs: boat.price.mid },
    { label: C.seasonHigh, note: boat.price.highWindow || C.seasonHighNote, prijs: boat.price.high },
  ]

  return (
    <main className="bg-white text-black">
      <BreadcrumbJsonLd locale={l} items={crumbs} />
      <SchemaMarkup
        locale={l}
        page={{ path: `private-boat-charters/${boat.slug}`, type: 'ItemPage', name: boatName(boat) }}
        product={{
          name: boatName(boat),
          description: `${soort} — ${boat.pax} ${C.pax.toLowerCase()}, ${boat.marina}, Ibiza.`,
          // Geen `brand`: deze vloot komt van negen verhuurders (zie de kop van
          // src/data/fleet.ts). Eén merknaam eronder zetten zou voor een deel
          // van de boten aantoonbaar onjuist zijn.
          price: boat.price.low,
          path: `private-boat-charters/${boat.slug}`,
          image: boat.image,
        }}
      />

      <Breadcrumbs items={crumbs} locale={l} />

      <article className="mx-auto max-w-5xl px-4 pb-16 pt-6">
        {/* Foto. Gewone <img> met de Cloudinary-srcset die al in de data zit —
            zie src/data/fleet.ts voor waarom hier geen next/image staat. Deze
            is boven de vouw, dus eager en met fetchPriority. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={boat.image}
          srcSet={boat.imageSet}
          sizes="(min-width: 1024px) 960px, 100vw"
          alt={boatName(boat)}
          fetchPriority="high"
          decoding="async"
          className="aspect-[16/9] w-full rounded-3xl object-cover"
        />

        <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-black/60">
          <span className="inline-flex items-center gap-1.5">
            <Ship size={13} className="text-ibiza-green" /> {soort}
          </span>
          <span aria-hidden className="text-black/25">·</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-ibiza-green" /> {boat.marina}
          </span>
        </div>

        <h1 className="mt-2 font-serif text-4xl font-black leading-tight tracking-tight md:text-5xl">
          {boat.model}
          {boat.name && <span className="text-ibiza-green"> {boat.name}</span>}
        </h1>

        {/* Antwoord-eerst: soort, gasten, haven en het dagtarief in de eerste
            zin. Alle vier uit de data — een overgetypt getal loopt achter zodra
            de vloot wisselt. */}
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-black/80">
          {C.lead(CATEGORY_PHRASE[boat.category][l], boat.pax, boat.marina, fmt(dagPrijs), bandLabel)}
        </p>
        <p className="mt-2 max-w-2xl text-sm italic leading-relaxed text-black/60">{C.leadNote}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ibiza-green px-6 py-3.5 text-sm font-black text-white"
          >
            <MessageCircle size={17} /> {C.book}
          </a>
          {/* Een gewone <a>: het dossier is een bestand, geen route. */}
          <a
            href={dossierHref(boat.slug)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-6 py-3.5 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            <FileText size={16} /> {C.dossier}
          </a>
        </div>

        {/* Beschikbaarheid van vandaag, server-gerenderd — ook zonder
            JavaScript zichtbaar, net als op de vlootpagina. */}
        <section className="mt-10 rounded-3xl border border-black/10 bg-neutral-50 p-6">
          <h2 className="font-serif text-xl font-bold">{C.todayHeading(longDate(vandaag, l))}</h2>
          {status ? (
            <>
              <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/75">
                <span
                  aria-hidden
                  className={`h-2.5 w-2.5 rounded-full ${
                    status === 'free' ? 'bg-ibiza-green' : status === 'option' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                />
                {status === 'free' ? C.availFree : status === 'option' ? C.availOption : C.availBooked}
              </p>
              {live && (
                <p className="mt-1.5 text-xs text-black/55">{C.liveStamp(liveStampTime(live.generatedAt, bcp))}</p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-black/65">{C.noLive}</p>
          )}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 p-6">
            <h2 className="font-serif text-xl font-bold">{C.specs}</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-2.5">
                <dt className="inline-flex items-center gap-2 text-black/60">
                  <Users size={14} className="text-ibiza-green" /> {C.pax}
                </dt>
                <dd className="font-bold">{boat.pax}</dd>
              </div>
              {/* `length` staat alleen bij boten waarvan het dossier hem
                  letterlijk noemt (22 van 94); een afgeleide lengte is geen
                  feit en blijft dus weg in plaats van geschat te worden. */}
              {boat.length != null && (
                <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-2.5">
                  <dt className="inline-flex items-center gap-2 text-black/60">
                    <Ruler size={14} className="text-ibiza-green" /> {C.length}
                  </dt>
                  <dd className="font-bold">{boat.length} m</dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-2.5">
                <dt className="inline-flex items-center gap-2 text-black/60">
                  <MapPin size={14} className="text-ibiza-green" /> {C.marina}
                </dt>
                <dd className="font-bold">{boat.marina}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="inline-flex items-center gap-2 text-black/60">
                  <Ship size={14} className="text-ibiza-green" /> {C.type}
                </dt>
                <dd className="font-bold">{soort}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-black/10 p-6">
            <h2 className="font-serif text-xl font-bold">{C.rates}</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              {banden
                // Een band zonder bedrag laten we weg in plaats van er "op
                // aanvraag" van te maken: de andere twee staan er wél, en een
                // lege regel ertussen leest als een ontbrekend tarief.
                .filter((b) => b.prijs != null)
                .map((b) => (
                  <div key={b.label} className="flex items-end justify-between gap-4 border-b border-black/5 pb-2.5 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <div className="font-bold">{b.label}</div>
                      <div className="text-xs text-black/55">{b.note}</div>
                    </div>
                    <div className="shrink-0 whitespace-nowrap font-serif text-lg font-bold">
                      €{fmt(b.prijs as number)}{' '}
                      <span className="font-sans text-[10px] font-normal text-black/60">{C.perDay}</span>
                    </div>
                  </div>
                ))}
            </dl>
            <p className="mt-3 text-xs italic leading-relaxed text-black/55">{C.ratesNote}</p>
          </div>
        </section>

        {verwant.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-bold">{C.more}</h2>
            <p className="mt-1 text-sm text-black/60">{C.moreNote(boat.marina)}</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {verwant.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/${l}/private-boat-charters/${b.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-black/10 transition-colors hover:border-ibiza-green"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.image}
                      srcSet={b.imageSet}
                      sizes="(min-width: 1024px) 240px, 50vw"
                      alt={boatName(b)}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="p-3">
                      <div className="truncate text-sm font-bold">{boatName(b)}</div>
                      <div className="mt-0.5 text-xs text-black/60">
                        {b.marina} · €{fmt(b.price.low)} {C.perDay}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link
          href={`/${l}/private-boat-charters`}
          className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-ibiza-green underline underline-offset-4 hover:text-black"
        >
          <ArrowLeft size={15} /> {C.backToFleet}
        </Link>
      </article>
    </main>
  )
}
