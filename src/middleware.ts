import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.includes('.') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return
  }

  // The mobile app shell (/m) has its own root layout and handles language via
  // ?lang= — it must not be locale-prefixed like the marketing site.
  if (pathname === '/m' || pathname.startsWith('/m/')) return

  const matched = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))

  if (matched) {
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

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
