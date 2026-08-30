import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { locations } from '@/lib/locations'
import { DEFAULT_LOCALE, LOCALES, SITE_URL, type Locale } from '@/lib/seo'
import { ItemListJsonLd } from '@/components/seo/ItemListJsonLd'
import { BreadcrumbJsonLd, homeLabel } from '@/components/seo/BreadcrumbJsonLd'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Index for the location pages.
 *
 * These eight pages existed and returned 200, but there was no index route —
 * `/locations` was a hard 404 — they were in no sitemap and nothing linked to
 * them. Forty working pages (8 x 5 locales) that Google had no way to discover.
 * This page gives them a parent, an ItemList and a place in the crawl graph.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const KICKER: T = L('Het eiland', 'The island', 'Die Insel', 'La isla', 'L’île')
const TITLE: T = L(
  'Waar op Ibiza wil je zitten?',
  'Where on Ibiza do you want to be?',
  'Wo auf Ibiza willst du sein?',
  '¿En qué parte de Ibiza quieres estar?',
  'Où sur Ibiza voulez-vous être ?',
)
const INTRO: T = L(
  'Ibiza is klein, maar de sfeer verschilt sterk per plek. De zonsondergangkant is een andere vakantie dan de oude stad, en het noorden is weer iets heel anders. Een kort overzicht van de gebieden, zodat je weet waar je je basis legt.',
  'Ibiza is small, but the mood changes sharply from place to place. The sunset side is a different holiday from the old town, and the north is something else again. A short guide to the areas, so you know where to base yourself.',
  'Ibiza ist klein, aber die Stimmung ändert sich von Ort zu Ort deutlich. Die Sunset-Seite ist ein anderer Urlaub als die Altstadt, und der Norden noch einmal etwas ganz anderes. Ein kurzer Überblick über die Gegenden.',
  'Ibiza es pequeña, pero el ambiente cambia mucho de una zona a otra. El lado del atardecer es otras vacaciones distintas al casco antiguo, y el norte es otra cosa más. Una guía breve de las zonas.',
  'Ibiza est petite, mais l’ambiance change beaucoup d’un endroit à l’autre. Le côté coucher de soleil n’est pas les mêmes vacances que la vieille ville, et le nord est encore autre chose. Un bref guide des zones.',
)

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

  return (
    <main className="bg-white text-neutral-900">
      <BreadcrumbJsonLd
        locale={l}
        items={[{ name: homeLabel(l), path: `${l}` }, { name: TITLE[l] }]}
      />
      <ItemListJsonLd
        entries={locations.map((loc) => ({ name: loc.name, path: `${l}/locations/${loc.slug}` }))}
        locale={l}
        name="Ibiza areas"
      />

      <section className="mx-auto max-w-5xl px-4 pb-10 pt-[calc(var(--nav-h)+48px)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">{KICKER[l]}</p>
        <h1 className="mt-3 font-serif text-4xl font-black tracking-tight md:text-6xl">{TITLE[l]}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600">{INTRO[l]}</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc, i) => (
            <Reveal
              key={loc.slug}
              delay={(i % 3) * 80}
              as={Link as any}
              href={`${base}/locations/${loc.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white text-neutral-900 transition-all hover:border-gold hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-ibiza-mint">
                {loc.imageUrl ? (
                  <Image
                    src={loc.imageUrl}
                    alt={loc.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
              </span>
              <span className="flex flex-1 flex-col gap-1.5 p-5">
                <strong className="font-serif text-lg font-black leading-tight">{loc.name}</strong>
                <span className="text-sm leading-relaxed text-neutral-600">{loc.tagline}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}
