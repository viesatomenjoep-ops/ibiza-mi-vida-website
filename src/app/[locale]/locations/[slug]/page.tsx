import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { locations, getLocationBySlug, type LocationData } from '@/lib/locations'
import { sailingForLocation } from '@/lib/location-sailing'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'
import { breadcrumbListSchema, homeLabel, sectionLabel } from '@/components/seo/BreadcrumbJsonLd'
import { DEFAULT_LOCALE, LOCALES, SITE_URL, type Locale } from '@/lib/seo'
import { PlaceNextStep } from '@/components/locations/PlaceNextStep'

/**
 * Kop en tussenzin van het vaarblok, in vijf talen.
 *
 * Bewust vragend geformuleerd: op een plaatspagina is "kom ik hier per boot?"
 * de vervolgvraag, en voor drie van deze zeven baaien is het eerlijke antwoord
 * dat de zee de betere route is dan de weg.
 */
const SAIL_LBL: Record<Locale, { heading: string; lead: (route: string) => string; cta: string; trips: string }> = {
  nl: {
    heading: 'Hierheen met de boot',
    lead: (r) => `Deze baai is een stop op onze vaarroute “${r}”. Wat een schipper hier doet, en waarom:`,
    cta: 'Privécharter bekijken',
    trips: 'Georganiseerde boottochten',
  },
  en: {
    heading: 'Reaching this by boat',
    lead: (r) => `This bay is a stop on our “${r}” sailing route. What a skipper does here, and why:`,
    cta: 'See private charters',
    trips: 'Organised boat trips',
  },
  de: {
    heading: 'Mit dem Boot hierher',
    lead: (r) => `Diese Bucht ist ein Stopp auf unserer Route „${r}“. Was ein Skipper hier macht, und warum:`,
    cta: 'Privatcharter ansehen',
    trips: 'Organisierte Bootstouren',
  },
  es: {
    heading: 'Llegar en barco',
    lead: (r) => `Esta cala es una parada de nuestra ruta «${r}». Lo que hace aquí un patrón, y por qué:`,
    cta: 'Ver chárter privado',
    trips: 'Excursiones en barco',
  },
  fr: {
    heading: 'Y venir en bateau',
    lead: (r) => `Cette crique est une étape de notre itinéraire « ${r} ». Ce qu’y fait un skipper, et pourquoi :`,
    cta: 'Voir les charters privés',
    trips: 'Sorties en bateau organisées',
  },
}

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

/**
 * Titelsuffix dat meegroeit met de lengte van de plaatsnaam.
 *
 * De titel was `{naam} — Ibiza`, en dat belooft niets. Search Console laat zien
 * waarom dat telt: `/locations/es-canar` had 67 vertoningen en nul klikken,
 * `/locations/playa-den-bossa` 22 en nul. Vertoningen genoeg dus — alleen geen
 * reden om te klikken. Vergelijk de venuepagina's, die wél zeggen wat je krijgt
 * ("Line-up, Events & Tickets") en daar niet op vastlopen.
 *
 * Eén vaste suffix kan niet: `fitTitle()` kapt op 44 tekens (60 min de 16 van
 * " | Ibiza mi vida") en de namen lopen van "Es Canar" tot
 * "Santa Gertrudis de Fruitera". Daarom een lijst van lang naar kort, waarbij
 * de eerste die past wint en de kale eilandnaam de bodem is — precies de
 * huidige titel, dus een lange naam wordt nooit slechter dan nu.
 *
 * Wat de suffix belooft, levert de pagina ook: er staat een sectie "wat je hier
 * doet", feiten, voor wie het geschikt is en een eerlijk nadeel. Een titel die
 * meer belooft dan de pagina heeft, is dezelfde fout als schema zonder
 * zichtbare tegenhanger.
 */
const TITLE_TAILS: Record<Locale, (island: string) => string[]> = {
  nl: (i) => [`— ${i}: wat je er doet`, `— ${i}`],
  en: (i) => [`— ${i}: What to Do & Know`, `— ${i}: What to Do`, `— ${i}`],
  de: (i) => [`— ${i}: Was man hier macht`, `— ${i}`],
  es: (i) => [`— ${i}: qué hacer y saber`, `— ${i}: qué hacer`, `— ${i}`],
  fr: (i) => [`— ${i}: que faire et voir`, `— ${i}: que faire`, `— ${i}`],
}

/** 60 min de 16 tekens die de layout er als " | Ibiza mi vida" achter plakt. */
const TITLE_ROOM = 44

/**
 * De naam zonder de officiële variant tussen haakjes, alleen voor de titel.
 *
 * Vier plaatsen dragen er een: "San Antonio (Sant Antoni de Portmany)" is 37
 * tekens, en dan is de titel op vóór er iets nuttigs in staat — live werd het
 * "San Antonio (Sant Antoni de… — Ibiza", waar de afkapping precies op de
 * naamvariant viel die niemand intikt. Zoekers typen "san antonio ibiza".
 *
 * Alleen de titel: de H1, de lopende tekst en het `Place`-schema houden de
 * volledige naam, want daar is de officiële variant wél juist en is er ruimte
 * voor.
 */
const shortName = (name: string) => name.replace(/\s*\([^)]*\)\s*/g, ' ').trim()

function titleTail(name: string, island: string, l: Locale): string {
  // -1 voor de spatie die detailMetadata tussen naam en suffix zet.
  const room = TITLE_ROOM - name.length - 1
  const tails = TITLE_TAILS[l](island)
  return tails.find((t) => t.length <= room) ?? tails[tails.length - 1]
}

export function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const location = getLocationBySlug(params.slug)
  if (!location) return staticMetadata(params.locale, 'locations', 'Ibiza Locations')
  const l = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const titelNaam = shortName(location.name)
  return detailMetadata(params.locale, `locations/${params.slug}`, titelNaam, {
    // `intro` is a localized object now — pass the string, not the object.
    // The intro rather than the tagline: it gives detailMetadata enough text to
    // fill a 158-character snippet instead of a half-empty one-liner.
    description: location.intro[l],
    // Geen image: de locatiefoto's waren AI-gegenereerd en zijn verwijderd.
    // Een AI-beeld als `image` van een echte plek meegeven aan een deelkaart
    // of aan structured data is een voorstelling van zaken die niet klopt.
    suffix: titleTail(
      titelNaam,
      location.island === 'formentera' ? LBL.formentera[l] : LBL.ibiza[l],
      l,
    ),
  })
}

/** containedInPlace: the island, then the region, then the country. */
function placeSchema(location: LocationData, l: Locale) {
  const islandName = location.island === 'formentera' ? 'Formentera' : 'Ibiza'
  return {
    '@type': ['Place', 'TouristDestination'],
    '@id': `${SITE_URL}/${l}/locations/${location.slug}#place`,
    name: location.name,
    description: location.intro[l],
    url: `${SITE_URL}/${l}/locations/${location.slug}`,
    inLanguage: l,
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

export default async function LocationPage({ params }: { params: { slug: string; locale: string } }) {
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
  // null voor de veertien plaatsen die geen stop op een vaarroute zijn; dan
  // rendert het blok niet.
  const sailing = sailingForLocation(location.slug)

  return (
    <div className="min-h-screen bg-white pb-20 text-neutral-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      {/* Hero
          mt-[var(--nav-h)]: dezelfde fix als op de event- en venuepagina's --
          zie de uitleg in EventDetailPage.tsx. Zonder deze marge schuift de
          sinds vanavond vaste, ondoorzichtige navigatiebalk over het
          bovenste stuk van de locatiefoto en de titel heen. */}
      {/* Kop.
          Was een halfschermse foto met witte tekst over een donkere gradient.
          Die foto was AI-gegenereerd, en bij de plaatsen zonder foto bleef er
          een zwart vlak over — twee redenen om hem weg te halen. Wat er nu
          staat is typografisch en licht.

          pt-[calc(var(--nav-h)+…)]: dit is het eerste element van de pagina en
          .site-header staat `position:fixed` zonder globale compensatie. Nooit
          een vast getal; --nav-h is de enige bron. */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-[calc(var(--nav-h)+40px)] md:px-8">
          <Link
            href={`${base}/locations`}
            className="mb-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft size={16} /> {LBL.back[l]}
          </Link>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
            <MapPin size={16} /> {islandLabel}
          </div>
          <h1 className="font-serif text-4xl font-black tracking-tight text-neutral-900 md:text-6xl">
            {location.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">{location.tagline[l]}</p>
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

      {/* Per boot bereikbaar? Alleen voor de baaien die ook een stop op een
          vaarroute zijn — zie src/lib/location-sailing.ts. Er komt hier geen
          nieuwe bewering bij: alle tekst komt uit sailing-routes.ts, dat onder
          dezelfde feitelijke regels is geschreven als deze pagina. */}
      {sailing && (
        <section className="mx-auto max-w-3xl px-4 pt-12">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{SAIL_LBL[l].heading}</h2>
          <p className="mt-4 leading-relaxed text-neutral-700">{SAIL_LBL[l].lead(sailing.route.title[l])}</p>
          <div className="mt-6 rounded-3xl border border-black/10 bg-neutral-50 p-6 md:p-8">
            <p className="leading-relaxed text-neutral-800">{sailing.stop.blurb[l]}</p>
            <p className="mt-4 leading-relaxed text-neutral-800">{sailing.stop.why[l]}</p>
            {/* De praktische kanttekening blijft staan: bij welke wind het niet
                werkt, of hoe druk het in augustus is. Dat is precies het deel
                dat sailing-routes.ts verplicht stelt en dat je nergens anders
                leest. */}
            <p className="mt-4 border-t border-black/10 pt-4 text-[15px] leading-relaxed text-neutral-600">
              {sailing.stop.note[l]}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`${base}/private-boat-charters`}
              className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-neutral-700"
            >
              {SAIL_LBL[l].cta}
            </Link>
            <Link
              href={`${base}/boat-trip`}
              className="inline-flex items-center rounded-full border border-black/15 px-5 py-2.5 text-[14px] font-semibold text-neutral-900 hover:bg-neutral-100"
            >
              {SAIL_LBL[l].trips}
            </Link>
          </div>
        </section>
      )}

      {/* Honest note — the reason the page is worth reading. */}
      <section className="mx-auto max-w-3xl px-4 pt-12">
        <div className="rounded-3xl border border-gold/40 bg-gold/5 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{LBL.honest[l]}</h2>
          <p className="mt-4 leading-relaxed text-neutral-800">{location.honestNote[l]}</p>
        </div>
      </section>

      {/* De vervolgstap. Stond hier niet, en dat was het hele probleem: in
          <main> stonden vijf links en dat waren "terug naar alle plaatsen" plus
          vier andere plaatspagina's. Wie via Google op een plaatsnaam binnenkwam
          kon dus alleen zijwaarts of weg — geen agenda, geen ticket, geen boot.
          Dit blok staat bewust vóór "andere plekken": eerst iets om te boeken,
          dan pas de zijstap. */}
      <PlaceNextStep locale={l} island={location.island} placeName={location.name} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl border-t border-slate-100 px-4 py-12">
          <h2 className="mb-8 font-serif text-3xl font-bold text-neutral-900">{LBL.others[l]}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {related.map((loc) => (
              <Link
                key={loc.slug}
                href={`${base}/locations/${loc.slug}`}
                className="flex flex-col gap-1.5 rounded-2xl border border-black/10 bg-neutral-50 p-5 text-neutral-900 transition-colors hover:border-gold hover:bg-white"
              >
                <h3 className="font-serif text-lg font-black leading-tight">{loc.name}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{loc.tagline[l]}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
