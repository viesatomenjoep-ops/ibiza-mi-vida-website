import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { locations, getLocationBySlug, type LocationData } from '@/lib/locations'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'
import { breadcrumbListSchema, homeLabel, sectionLabel } from '@/components/seo/BreadcrumbJsonLd'
import { DEFAULT_LOCALE, LOCALES, SITE_URL, type Locale } from '@/lib/seo'

/**
 * Place guide detail page.
 *
 * The data behind this route used to be a name plus one paragraph of
 * `description`. It is now a structured guide — intro, history, what to do,
 * facts, who it suits and an honest drawback — and this page renders all of it.
 * The `honestNote` is deliberately given its own visually distinct block: it is
 * the section that makes the page worth trusting, so it is not buried.
 */

type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const LBL = {
  back: L('Terug naar overzicht', 'Back to all places', 'Zurück zur Übersicht', 'Volver al listado', 'Retour à la liste'),
  kicker: L('Ibiza & Formentera', 'Ibiza & Formentera', 'Ibiza & Formentera', 'Ibiza y Formentera', 'Ibiza et Formentera'),
  history: L('Geschiedenis', 'History', 'Geschichte', 'Historia', 'Histoire'),
  whatToDo: L('Wat je hier doet', 'What to do here', 'Was man hier macht', 'Qué hacer aquí', 'Que faire ici'),
  facts: L('Feiten', 'Facts', 'Fakten', 'Datos', 'Faits'),
  goodFor: L('Goed voor', 'Good for', 'Gut für', 'Ideal para', 'Idéal pour'),
  honest: L('Eerlijk gezegd', 'Honestly', 'Ehrlich gesagt', 'Siendo sinceros', 'Honnêtement'),
  others: L('Andere plekken', 'Other places', 'Andere Orte', 'Otros lugares', 'Autres lieux'),
  ibiza: L('Ibiza', 'Ibiza', 'Ibiza', 'Ibiza', 'Ibiza'),
  formentera: L('Formentera', 'Formentera', 'Formentera', 'Formentera', 'Formentera'),
}

export function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const location = getLocationBySlug(params.slug)
  if (!location) return staticMetadata(params.locale, 'locations', 'Ibiza Locations')
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  return detailMetadata(params.locale, `locations/${params.slug}`, location.name, {
    // `tagline` is a localized object now — pass the string, not the object.
    description: location.tagline[l],
    image: location.imageUrl || undefined,
    suffix: location.island === 'formentera' ? '— Formentera' : '— Ibiza',
  })
}

/** containedInPlace: the island, then the region, then the country. */
function placeSchema(location: LocationData, l: Locale) {
  const islandName = location.island === 'formentera' ? 'Formentera' : 'Ibiza'
  return {
    '@type': ['Place', 'TouristDestination'],
    '@id': `${SITE_URL}/${l}/locations/${location.slug}#place`,
    name: location.name,
    description: location.tagline[l],
    url: `${SITE_URL}/${l}/locations/${location.slug}`,
    inLanguage: l,
    ...(location.imageUrl ? { image: `${SITE_URL}${location.imageUrl}` } : {}),
    touristType: location.goodFor[l],
    containedInPlace: {
      '@type': 'Place',
      name: islandName,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Balearic Islands',
        containedInPlace: { '@type': 'Country', name: 'Spain' },
      },
    },
  }
}

export default function LocationPage({ params }: { params: { slug: string; locale: string } }) {
  const location = getLocationBySlug(params.slug)

  if (!location) {
    notFound()
  }

  const l: Locale = (LOCALES as readonly string[]).includes(params.locale)
    ? (params.locale as Locale)
    : DEFAULT_LOCALE
  const base = `/${l}`
  const islandLabel = location.island === 'formentera' ? LBL.formentera[l] : LBL.ibiza[l]

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbListSchema(
        [
          { name: homeLabel(l), path: '' },
          { name: sectionLabel('locations', l), path: 'locations' },
          { name: location.name },
        ],
        l,
      ),
      placeSchema(location, l),
    ],
  }

  const related = locations.filter((x) => x.slug !== location.slug && x.island === location.island).slice(0, 4)

  return (
    <div className="min-h-screen bg-white pb-20 text-neutral-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-slate-900">
        {location.imageUrl ? (
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            className="object-cover opacity-70"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col justify-end px-4 pb-16 md:px-8">
          <Link
            href={`${base}/locations`}
            className="mb-6 inline-flex w-fit items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} /> {LBL.back[l]}
          </Link>
          <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#00A698]">
            <MapPin size={18} /> {islandLabel}
          </div>
          <h1 className="mb-4 font-serif text-5xl font-bold text-white drop-shadow-md md:text-7xl">
            {location.name}
          </h1>
          <p className="max-w-2xl font-sans text-xl font-light text-white/90">{location.tagline[l]}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-3xl px-4 pt-14">
        <p className="text-lg leading-relaxed text-neutral-700 md:text-xl">{location.intro[l]}</p>
      </section>

      {/* History */}
      <section className="mx-auto max-w-3xl px-4 pt-12">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{LBL.history[l]}</h2>
        <p className="mt-4 leading-relaxed text-neutral-700">{location.history[l]}</p>
      </section>

      {/* What to do */}
      <section className="mx-auto max-w-3xl px-4 pt-12">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{LBL.whatToDo[l]}</h2>
        <ul className="mt-5 space-y-3">
          {location.whatToDo[l].map((item, i) => (
            <li key={i} className="flex gap-3 leading-relaxed text-neutral-700">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Facts */}
      <section className="mx-auto max-w-3xl px-4 pt-12">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{LBL.facts[l]}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {location.facts[l].map((item, i) => (
            <li
              key={i}
              className="rounded-2xl border border-black/10 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Good for */}
      <section className="mx-auto max-w-3xl px-4 pt-12">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{LBL.goodFor[l]}</h2>
        <p className="mt-4 leading-relaxed text-neutral-700">{location.goodFor[l]}</p>
      </section>

      {/* Honest note — the reason the page is worth reading. */}
      <section className="mx-auto max-w-3xl px-4 pt-12">
        <div className="rounded-3xl border border-gold/40 bg-gold/5 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{LBL.honest[l]}</h2>
          <p className="mt-4 leading-relaxed text-neutral-800">{location.honestNote[l]}</p>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl border-t border-slate-100 px-4 py-12">
          <h2 className="mb-8 font-serif text-3xl font-bold text-neutral-900">{LBL.others[l]}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {related.map((loc) => (
              <Link
                key={loc.slug}
                href={`${base}/locations/${loc.slug}`}
                className="group relative flex h-48 flex-col justify-end overflow-hidden rounded-2xl bg-ibiza-mint p-4 text-neutral-900"
              >
                {loc.imageUrl ? (
                  <Image
                    src={loc.imageUrl}
                    alt={loc.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <h3 className="relative z-10 text-lg font-bold text-white">{loc.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
