import { SITE_URL, SITE_NAME, type Locale } from '@/lib/seo'

/**
 * Dataset-gestructureerde data voor de pagina's die iets méten.
 *
 * ── Waarom dit type en niet nog een Article ───────────────────────────────
 * /ibiza-prices en /ibiza-season zijn geen artikelen over Ibiza. Het zijn
 * tellingen: zoveel clubavonden, over deze periode, met deze mediaan. Precies
 * waar schema.org/Dataset voor bedoeld is, en vrijwel geen enkele reissite
 * gebruikt het — die publiceren meningen, geen metingen.
 *
 * Twee dingen die dat oplevert. Google heeft een aparte Dataset-zoekmachine
 * waar nauwelijks toeristische data in staat. En voor een taalmodel is
 * "dit is een dataset van N waarnemingen over periode X, gemeten door Y" een
 * wezenlijk ander signaal dan een pagina die beweert dat iets zo is: het maakt
 * de herkomst van het cijfer expliciet in plaats van dat het model dat uit
 * proza moet afleiden.
 *
 * ── Eerlijkheidsgrens ─────────────────────────────────────────────────────
 * Alleen gebruiken op een pagina die daadwerkelijk een telling publiceert,
 * met een echte `temporalCoverage` en een echt aantal waarnemingen. Dit type
 * op een gewone contentpagina plakken omdat het goed staat is precies het
 * soort opgeblazen markup waar zoekmachines op handhaven — en het ondermijnt
 * de twee pagina's waar het wél klopt.
 *
 * `measurementTechnique` staat er bewust in: het zegt in één zin dat wij dit
 * geteld hebben uit een gepubliceerde agenda en niet geschat.
 */
export function DatasetJsonLd({
  locale,
  path,
  name,
  description,
  /** ISO yyyy-mm-dd, begin en eind van de gemeten periode. */
  from,
  to,
  /** Wat er precies gemeten is, bijv. "cheapest advertised entry ticket". */
  variable,
  /** Aantal waarnemingen achter de cijfers. */
  observations,
  /** Eén zin over hoe het gemeten is. */
  technique,
}: {
  locale: Locale
  path: string
  name: string
  description: string
  from: string
  to: string
  variable: string
  observations: number
  technique: string
}) {
  if (!from || !to || !observations) return null

  const url = `${SITE_URL}/${locale}/${path.replace(/^\//, '')}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    // Merged into the one Organization declared in HomeJsonLd rather than
    // redeclaring the business here.
    creator: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    temporalCoverage: `${from}/${to}`,
    spatialCoverage: {
      '@type': 'Place',
      name: 'Ibiza, Balearic Islands, Spain',
    },
    variableMeasured: variable,
    measurementTechnique: technique,
    // The page itself is the distribution — there is no downloadable file, and
    // claiming one would be a link to nothing.
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'text/html',
      contentUrl: url,
    },
    isAccessibleForFree: true,
    inLanguage: locale,
    // Not a claim about accuracy, just the honest count behind the figures.
    size: `${observations} observations`,
    provider: { '@id': `${SITE_URL}/#organization` },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** Kort label voor de organisatie, voor hergebruik in beschrijvingen. */
export const DATASET_PUBLISHER = SITE_NAME
