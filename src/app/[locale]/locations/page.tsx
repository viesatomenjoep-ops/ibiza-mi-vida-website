import type { Metadata } from 'next'
import { LocationImage } from '@/components/locations/LocationImage'
import Link from 'next/link'
import Image from 'next/image'
import { locations, locationsByIsland, type LocationData } from '@/lib/locations'
import { DEFAULT_LOCALE, LOCALES, SITE_URL, type Locale } from '@/lib/seo'
import { ItemListJsonLd } from '@/components/seo/ItemListJsonLd'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Index for the place-guide pages.
 *
 * These pages existed and returned 200, but there was no index route —
 * `/locations` was a hard 404 — they were in no sitemap and nothing linked to
 * them: working pages that Google had no way to discover. This page gives them
 * a parent, an ItemList and a place in the crawl graph.
 *
 * The set now covers two islands, so the cards are grouped by `island` rather
 * than dumped into one flat grid: "which island is this on" is the first
 * question a reader has, and a single ungrouped list of twenty-one answers it
 * for none of them.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('De eilanden', 'The islands', 'Die Inseln', 'Las islas', 'Les îles')
const TITLE: T = L(
  'Waar op Ibiza en Formentera wil je zitten?',
  'Where on Ibiza and Formentera do you want to be?',
  'Wo auf Ibiza und Formentera willst du sein?',
  '¿En qué parte de Ibiza y Formentera quieres estar?',
  'Où sur Ibiza et Formentera voulez-vous être ?',
)
const INTRO: T = L(
  'Ibiza is klein, maar de sfeer verschilt sterk per plek. De zonsondergangkant is een andere vakantie dan de oude stad, en het noorden is weer iets heel anders. Formentera, het buureiland dat je alleen over zee bereikt, is nog eens een categorie apart. Een overzicht van de plekken, zodat je weet waar je je basis legt — inclusief wat er per plek tegenvalt.',
  'Ibiza is small, but the mood changes sharply from place to place. The sunset side is a different holiday from the old town, and the north is something else again. Formentera, the neighbouring island you can only reach by sea, is a category of its own. A guide to the places, so you know where to base yourself — including what is disappointing about each one.',
  'Ibiza ist klein, aber die Stimmung ändert sich von Ort zu Ort deutlich. Die Sunset-Seite ist ein anderer Urlaub als die Altstadt, und der Norden noch einmal etwas ganz anderes. Formentera, die Nachbarinsel, die nur über das Meer erreichbar ist, ist eine Kategorie für sich. Ein Überblick über die Orte — samt dem, was jeweils enttäuscht.',
  'Ibiza es pequeña, pero el ambiente cambia mucho de una zona a otra. El lado del atardecer son otras vacaciones distintas al casco antiguo, y el norte es otra cosa más. Formentera, la isla vecina a la que solo se llega por mar, es un capítulo aparte. Una guía de los lugares, con lo que decepciona de cada uno.',
  'Ibiza est petite, mais l’ambiance change beaucoup d’un endroit à l’autre. Le côté coucher de soleil n’est pas les mêmes vacances que la vieille ville, et le nord est encore autre chose. Formentera, l’île voisine que l’on n’atteint que par la mer, est une catégorie à part. Un guide des lieux, avec ce qui déçoit dans chacun.',
)
const IBIZA_HEAD: T = L('Ibiza', 'Ibiza', 'Ibiza', 'Ibiza', 'Ibiza')
const FORMENTERA_HEAD: T = L('Formentera', 'Formentera', 'Formentera', 'Formentera', 'Formentera')

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const languages: Record<string, string> = {}
  for (const x of LOCALES) languages[x] = `${SITE_URL}/${x}/locations`
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}/locations`
  return {
    title: TITLE[l],
    description: INTRO[l].slice(0, 155),
    alternates: { canonical: `${SITE_URL}/${l}/locations`, languages },
  }
}

export default function LocationsIndex({ params }: { params: { locale: string } }) {
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const base = `/${l}`

  const groups: { key: string; heading: string; items: LocationData[] }[] = [
    { key: 'ibiza', heading: IBIZA_HEAD[l], items: locationsByIsland('ibiza') },
    { key: 'formentera', heading: FORMENTERA_HEAD[l], items: locationsByIsland('formentera') },
  ].filter((g) => g.items.length > 0)

  return (
    <main className="bg-white text-neutral-900">
      <BreadcrumbJsonLd
        locale={l}
        items={[{ name: homeLabel(l), path: '' }, { name: TITLE[l] }]}
      />
      <ItemListJsonLd
        entries={locations.map((loc) => ({ name: loc.name, path: `${l}/locations/${loc.slug}` }))}
        locale={l}
        name="Ibiza and Formentera places"
      />

      <section className="mx-auto max-w-5xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[l]}</p>
        <h1 className="mt-3 font-serif text-4xl font-black tracking-tight md:text-6xl">{TITLE[l]}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600">{INTRO[l]}</p>
      </section>

      {groups.map(({ key, heading, items }) => (
        <section key={key} className="mx-auto max-w-5xl px-4 pb-16">
          <h2 className="mb-6 font-serif text-3xl font-black tracking-tight text-neutral-900">
            {heading}
            <span className="ml-3 align-middle text-sm font-bold text-neutral-500">{items.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((loc, i) => (
              <Reveal
                key={loc.slug}
                delay={(i % 3) * 80}
                as={Link as any}
                href={`${base}/locations/${loc.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white text-neutral-900 transition-all hover:border-gold hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-ibiza-mint">
                  <LocationImage
                    src={loc.imageUrl}
                    name={loc.name}
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-1 flex-col gap-1.5 p-5 text-neutral-900">
                  <strong className="font-serif text-lg font-black leading-tight text-neutral-900">{loc.name}</strong>
                  <span className="text-sm leading-relaxed text-neutral-600">{loc.tagline[l]}</span>
                </span>
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
