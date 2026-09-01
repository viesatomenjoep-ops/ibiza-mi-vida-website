import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTE_SLUGS, ROUTE_LOCALES, findRouteBySlug } from '@/lib/route-slugs'

const locales = ['en', 'nl', 'de', 'es', 'fr'] as const
type Loc = (typeof locales)[number]

/**
 * English, not Dutch.
 *
 * This used to be 'nl', which meant every visitor on earth — Spanish, German,
 * French, English — was redirected to the Dutch site from the bare domain. For
 * an island business whose customers arrive from all over Europe that is the
 * most expensive default possible, and it is also why the .es domain landed
 * people on /nl.
 *
 * English is now the fallback for anyone we cannot place.
 */
const DEFAULT: Loc = 'en'

/** Remembers a language the visitor chose themselves. */
const COOKIE = 'imv_locale'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/**
 * Country → language, used only as a weak second signal.
 *
 * Language beats country deliberately: a Dutch speaker holidaying in Spain
 * should still get Dutch. Belgium and Switzerland are intentionally absent —
 * they are genuinely multilingual, so guessing from the country would be wrong
 * a lot of the time. Accept-Language decides those.
 */
const COUNTRY_LANG: Record<string, Loc> = {
  NL: 'nl',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es',
  DE: 'de', AT: 'de',
  FR: 'fr', MC: 'fr',
  GB: 'en', IE: 'en', US: 'en', CA: 'en', AU: 'en', NZ: 'en',
}

/**
 * Best supported language from an Accept-Language header.
 *
 * Parses q-values rather than taking the first tag: browsers send things like
 * `fr-CA,fr;q=0.9,en;q=0.8`, and reading only the first entry would hand a
 * French Canadian the English site. The base language is matched too, so
 * `de-AT` resolves to `de`.
 */
function fromAcceptLanguage(header: string | null): Loc | null {
  if (!header) return null
  const parsed = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params.find((p) => p.trim().startsWith('q='))
      return { tag: tag.trim().toLowerCase(), q: q ? parseFloat(q.split('=')[1]) || 0 : 1 }
    })
    .filter((x) => x.tag)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of parsed) {
    const base = tag.split('-')[0]
    if ((locales as readonly string[]).includes(base)) return base as Loc
  }
  return null
}

function route(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl

  if (pathname.includes('.') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return
  }

  // The mobile app shell (/m) has its own root layout and handles language via
  // ?lang= — it must not be locale-prefixed like the marketing site.
  if (pathname === '/m' || pathname.startsWith('/m/')) return

  const matched = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))

  if (matched) {
    /**
     * Cross-language slug redirect.
     *
     * The keyword pages carry a different slug per language
     * (/en/boat-rental-ibiza vs /nl/boot-huren-ibiza). An old inbound link, a
     * shared URL whose language was switched by hand, or a translated
     * newsletter can therefore land on a locale + slug combination that does
     * not belong together. Rendering it would publish a second copy of the page
     * on a URL that no hreflang cluster references — duplicate content with no
     * canonical pointing at it.
     *
     * 301, not 307: this mapping is a permanent property of the route, the same
     * for every visitor, so it is safe (and desirable) for browsers, CDNs and
     * crawlers to cache it. That is the opposite of the language redirect
     * below, which depends on who is asking and must never be cached.
     */
    const segments = pathname.slice(matched.length + 2).split('/').filter(Boolean)
    const first = segments[0]
    if (first) {
      const found = findRouteBySlug(first)
      if (found) {
        const rest = segments.slice(1).join('/')
        const published = ROUTE_LOCALES[found.key]
        const go = (locale: Loc, slug: string) => {
          request.nextUrl.pathname = `/${locale}/${slug}${rest ? `/${rest}` : ''}`
          return NextResponse.redirect(request.nextUrl, 301)
        }

        // ── Is deze route in deze taal überhaupt gepubliceerd? ──────────────
        //
        // ROUTE_SLUGS heeft een slug voor alle vijf de talen; ROUTE_LOCALES zegt
        // welke daarvan een echte pagina hebben. Dit blok las alleen de eerste,
        // en vertaalde daardoor een wérkende Engelse slug naar een Duitse die
        // nergens heen ging: /de/jet-ski-rental-ibiza 301'de naar
        // /de/jetski-mieten-ibiza, en dat is een 404. Achtentwintig URL's deden
        // dat, en een 301 wordt gecachet door browsers, CDN's en crawlers — dus
        // wie er één volgde, bleef hem volgen.
        //
        // Erger nog was de kale variant: een Duitser die op /jet-ski-rental-ibiza
        // klikte werd eerst naar /de/ gestuurd en daarna de muur in. Dat is
        // precies de vorm van link die in een advertentie of Instagram-bio staat.
        //
        // Bestaat de pagina niet in deze taal, stuur dan naar de taal waarin hij
        // wél bestaat. Een pagina in de verkeerde taal is beter dan geen pagina.
        if (published.length && !published.includes(matched)) {
          const target = (published.includes('en') ? 'en' : published[0]) as Loc
          return go(target, ROUTE_SLUGS[found.key][target])
        }

        // Een route zonder gepubliceerde talen is puur een 301-doel (guestlist-hub).
        // Die laten we door naar de pagina zelf, die de doorverwijzing per taal
        // al goed afhandelt — hier iets verzinnen zou dat dubbelop doen.
        if (published.length) {
          // Vergelijk SLUGS, niet locales. Sommige routes gebruiken bewust in elke
          // taal dezelfde slug (boat-party), dus "de slug is onder een andere taal
          // gevonden" is voor die routes altijd waar — en daarop redirecten stuurde
          // elke niet-Nederlandse taal voor eeuwig naar zichzelf. Alleen een slug
          // die voor DEZE taal anders is dan wat er gevraagd werd, rechtvaardigt een
          // redirect.
          const correct = ROUTE_SLUGS[found.key][matched]
          if (correct && correct !== first) return go(matched, correct)
        }
      }
    }

    // The visitor is on an explicit locale — they clicked a language pill or
    // followed a link. Remember it, so returning to the bare domain later does
    // not override a choice they already made.
    const res = NextResponse.next()
    if (request.cookies.get(COOKIE)?.value !== matched) {
      res.cookies.set(COOKIE, matched, { maxAge: COOKIE_MAX_AGE, sameSite: 'lax', path: '/' })
    }
    return res
  }

  const saved = request.cookies.get(COOKIE)?.value
  const country = request.headers.get('x-vercel-ip-country')?.toUpperCase()

  const locale: Loc =
    ((locales as readonly string[]).includes(saved || '') ? (saved as Loc) : null) ??
    fromAcceptLanguage(request.headers.get('accept-language')) ??
    (country ? COUNTRY_LANG[country] : null) ??
    DEFAULT

  request.nextUrl.pathname = `/${locale}${pathname}`

  // 307, not 308: the destination depends on who is asking, so a browser must
  // never cache it as a permanent rule for this URL.
  const res = NextResponse.redirect(request.nextUrl, 307)

  // CRITICAL on a CDN. Without Vary, the first visitor's redirect gets cached
  // and replayed to everyone — one German arriving first would send the whole
  // world to /de. This tells every cache the response depends on who asked.
  res.headers.set('Vary', 'Accept-Language, Cookie')
  res.cookies.set(COOKIE, locale, { maxAge: COOKIE_MAX_AGE, sameSite: 'lax', path: '/' })
  return res
}

/**
 * The canonical host, derived from the same env var the rest of the SEO code
 * reads so the two can never drift apart.
 */
const CANONICAL_HOST = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ibizamivida.com')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')
  .toLowerCase()

/**
 * Hostvergelijking zonder `www.`, en dat is geen netheid maar een noodrem.
 *
 * De noindex-header hieronder bestaat om previews uit de index te houden. Hij
 * hangt aan één env-var, en die var kon het hele werkende domein raken: staat
 * NEXT_PUBLIC_SITE_URL op `https://ibizamivida.com` — precies wat .env.example
 * voorschreef — dan is de canonieke host `ibizamivida.com`, matcht
 * `www.ibizamivida.com` niet, en krijgt élke pagina van de live site
 * `noindex, nofollow` mee. Geen foutmelding, geen kapotte pagina: de site
 * verdwijnt gewoon uit Google en uit elke AI-crawler, en niets in de code wijst
 * naar de oorzaak.
 *
 * www en het kale domein zijn dezelfde site, dus ze horen allebei canoniek te
 * zijn. Door beide kanten te normaliseren kan een www-verschil deze header niet
 * meer op de echte site zetten. Previews op *.vercel.app en het losse .es-domein
 * matchen nog steeds niet en krijgen hem wél.
 */
const bareHost = (host: string) => host.replace(/^www\./, '')

/** Local development hosts, which are nobody's SEO problem. */
const isLocalHost = (host: string) =>
  host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('0.0.0.0') || host.startsWith('[::1]')

/**
 * Keep preview deployments out of the search index.
 *
 * Every Vercel preview deployment is a full copy of the site on a
 * *.vercel.app host, and Google will happily index one it finds linked from
 * anywhere — producing a duplicate of the entire site on a domain we do not
 * control, competing with the real one. robots.txt cannot prevent this: a
 * Disallow stops crawling, not indexing of a URL discovered elsewhere, and the
 * preview host serves the same robots.txt as production anyway.
 *
 * `X-Robots-Tag: noindex` is the header that actually removes a page from the
 * index, and it applies to the response regardless of which host served it.
 * The canonical host is exempt, and so is localhost — a dev server that
 * returned noindex would make the SEO check scripts fail against a build that
 * is in fact correct.
 */
export function middleware(request: NextRequest) {
  const res = route(request)
  const host = (request.headers.get('host') ?? '').toLowerCase()

  if (!host || bareHost(host) === bareHost(CANONICAL_HOST) || isLocalHost(host)) return res

  const stamped = res ?? NextResponse.next()
  stamped.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return stamped
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
