import { LOCALES, DEFAULT_LOCALE, SITE_URL, type Locale } from './seo'
import type { Metadata } from 'next'

/**
 * Per-language URL slugs for the pages where the slug itself is a keyword.
 *
 * ── Why the slug differs per language ─────────────────────────────────────
 * A Dutch visitor searches "boot huren ibiza", a German "boot mieten ibiza", a
 * Frenchman "location bateau ibiza". Serving all of them /boat-rental-ibiza
 * throws away the single strongest on-page keyword signal in the URL, and it
 * reads as a machine translation of an English site — which is what it would
 * be. So each locale gets its own slug.
 *
 * ── Why that needs this file ──────────────────────────────────────────────
 * Localised slugs break the assumption the rest of the SEO code was built on:
 * that one page is `/{locale}/{same-path}` in every language. hreflang, the
 * canonical, the sitemap and the language switcher all need to know that
 * /en/boat-rental-ibiza and /nl/boot-huren-ibiza are the SAME page. Getting
 * that wrong does not degrade gracefully — Google discards a hreflang cluster
 * whose links do not reciprocate, so a half-localised set is worth less than no
 * localisation at all.
 *
 * This map is the single source of truth for those relationships. A route key
 * (stable, internal, never appears in a URL) maps to one slug per locale.
 *
 * ── Adding a page ─────────────────────────────────────────────────────────
 * 1. Add a key here with a slug for ALL FIVE locales. Not four.
 * 2. Create the route directory for each distinct slug.
 * 3. Have each page call `localeMetadata(routeKey, locale, …)` for its
 *    metadata, and `redirectToLocaleSlug(routeKey, locale, slug)` as its first
 *    statement so a wrong-language URL lands on the right one.
 * 4. `npm run check:hreflang` proves the cluster is symmetric.
 */

export type RouteKey =
  | 'boat-rental'
  | 'boat-no-licence'
  | 'boat-with-skipper'
  | 'jet-ski-rental'
  | 'car-rental'
  | 'car-rental-airport'
  | 'convertible-rental'
  | 'boat-party'
  | 'club-tickets-hub'
  | 'guestlist-hub'
  | 'wiber-partner'
  | 'clickandboat-partner'
  | 'pacha-venue'
  | 'amnesia-venue'
  | 'dc10-venue'
  | 'airport-transfer'
  | 'nightlife-guide'
  | 'dress-code'
  | 'getting-around'

type SlugSet = Record<Locale, string>

export const ROUTE_SLUGS: Record<RouteKey, SlugSet> = {
  'boat-rental': {
    en: 'boat-rental-ibiza',
    nl: 'boot-huren-ibiza',
    de: 'boot-mieten-ibiza',
    fr: 'location-bateau-ibiza',
    es: 'alquiler-barco-ibiza',
  },
  'boat-no-licence': {
    en: 'boat-hire-ibiza-no-licence',
    nl: 'boot-huren-ibiza-zonder-vaarbewijs',
    de: 'boot-mieten-ibiza-ohne-fuehrerschein',
    fr: 'location-bateau-ibiza-sans-permis',
    es: 'alquiler-barco-ibiza-sin-titulacion',
  },
  'boat-with-skipper': {
    en: 'boat-rental-with-skipper-ibiza',
    nl: 'boot-huren-ibiza-met-schipper',
    de: 'boot-mieten-ibiza-mit-skipper',
    fr: 'location-bateau-ibiza-avec-skipper',
    es: 'alquiler-barco-ibiza-con-patron',
  },
  'jet-ski-rental': {
    en: 'jet-ski-rental-ibiza',
    nl: 'jetski-huren-ibiza',
    de: 'jetski-mieten-ibiza',
    fr: 'location-jet-ski-ibiza',
    es: 'alquiler-motos-agua-ibiza',
  },
  'car-rental': {
    en: 'car-rental-ibiza',
    nl: 'auto-huren-ibiza',
    de: 'mietwagen-ibiza',
    fr: 'location-voiture-ibiza',
    es: 'alquiler-coches-ibiza',
  },
  'car-rental-airport': {
    en: 'car-rental-ibiza-airport',
    nl: 'auto-huren-ibiza-luchthaven',
    de: 'mietwagen-ibiza-flughafen',
    fr: 'location-voiture-ibiza-aeroport',
    es: 'alquiler-coches-aeropuerto-ibiza',
  },
  'convertible-rental': {
    en: 'convertible-car-rental-ibiza',
    nl: 'cabrio-huren-ibiza',
    de: 'cabrio-mieten-ibiza',
    fr: 'location-cabriolet-ibiza',
    es: 'alquiler-descapotable-ibiza',
  },
  // NOT 'boat-party-ibiza'. A page already exists at /[locale]/boat-party with
  // its own copy, FAQ and Service schema. Publishing a second page about boat
  // parties on a keyword slug would put two of our own URLs in front of the
  // same query — they split each other's links and Google picks one, usually
  // not the one you wanted. The existing route stays canonical; if the keyword
  // slug is ever wanted, rename that route and 301 the old path rather than
  // adding a second page.
  'boat-party': {
    en: 'boat-party',
    nl: 'boat-party',
    de: 'boat-party',
    fr: 'boat-party',
    es: 'boat-party',
  },
  'club-tickets-hub': {
    en: 'ibiza-club-tickets',
    nl: 'ibiza-clubtickets',
    de: 'ibiza-club-tickets-kaufen',
    fr: 'billets-clubs-ibiza',
    es: 'entradas-discotecas-ibiza',
  },
  // Partnerdossiers. Deze mikken op merkzoekopdrachten ("Wiber Ibiza",
  // "Click and Boat review") — een andere intentie dan "car rental Ibiza", dus
  // ze concurreren niet met de pillars maar vangen de bezoeker die eerst wil
  // weten of de partij te vertrouwen is.
  'wiber-partner': {
    en: 'wiber-car-rental-ibiza',
    nl: 'wiber-auto-huren-ibiza',
    de: 'wiber-mietwagen-ibiza',
    fr: 'wiber-location-voiture-ibiza',
    es: 'wiber-alquiler-coches-ibiza',
  },
  'clickandboat-partner': {
    en: 'click-and-boat-ibiza',
    nl: 'click-and-boat-ibiza',
    de: 'click-and-boat-ibiza',
    fr: 'click-and-boat-ibiza',
    es: 'click-and-boat-ibiza',
  },
  'guestlist-hub': {
    en: 'ibiza-guestlist',
    nl: 'ibiza-gastenlijst',
    de: 'ibiza-gaesteliste',
    fr: 'guestlist-ibiza',
    es: 'lista-invitados-ibiza',
  },
  // ── Clubs die NIET in de ClubTickets-feed zitten ────────────────────────
  //
  // Pacha, Amnesia en DC-10 ontbreken volledig in de feed (docs/seo/AUDIT.md,
  // A6) terwijl ze tot de meest gezochte clubnamen van het eiland horen. Ze
  // krijgen daarom een gidspagina zonder boekknop en zonder ticketclaim: wat we
  // wél kunnen is uitleggen hoe de avond werkt en de guestlist via Simon.
  //
  // De slug is in alle vijf de talen gelijk: het zijn eigennamen, en een
  // vertaalde clubnaam zoekt niemand. Zelfde reden als bij 'boat-party'.
  'pacha-venue': {
    en: 'pacha-ibiza', nl: 'pacha-ibiza', de: 'pacha-ibiza', fr: 'pacha-ibiza', es: 'pacha-ibiza',
  },
  'amnesia-venue': {
    en: 'amnesia-ibiza', nl: 'amnesia-ibiza', de: 'amnesia-ibiza', fr: 'amnesia-ibiza', es: 'amnesia-ibiza',
  },
  'dc10-venue': {
    en: 'dc10-ibiza', nl: 'dc10-ibiza', de: 'dc10-ibiza', fr: 'dc10-ibiza', es: 'dc10-ibiza',
  },
  // Vervoer vanaf de luchthaven. Hier is de slug wél per taal, want dit is een
  // beschrijvende zoekterm en geen eigennaam.
  'airport-transfer': {
    en: 'ibiza-airport-transfer',
    nl: 'ibiza-luchthaven-transfer',
    de: 'ibiza-flughafentransfer',
    fr: 'transfert-aeroport-ibiza',
    es: 'traslado-aeropuerto-ibiza',
  },
  // ── Gidsen ─────────────────────────────────────────────────────────────
  //
  // Drie informatieve intenties die geen bestaande route droeg. De toets per
  // slug staat in docs/seo/SLUG-DECISIONS.md; van de ruim veertig slugs uit het
  // nachtplan overleefden alleen deze drie hem.
  //
  // 'nightlife-guide' is de gids bóven /clubs (een index), /calendar (een
  // agenda) en /ibiza-club-tickets (prijzen): hoe een avond wérkt. Alle drie
  // krijgen er een link uit; geen van drieën verliest een zoekterm aan deze
  // pagina.
  'nightlife-guide': {
    en: 'ibiza-nightlife',
    nl: 'ibiza-uitgaan',
    de: 'ibiza-nachtleben',
    fr: 'vie-nocturne-ibiza',
    es: 'vida-nocturna-ibiza',
  },
  'dress-code': {
    en: 'ibiza-club-dress-code',
    nl: 'ibiza-club-dresscode',
    de: 'ibiza-club-dresscode',
    fr: 'dress-code-clubs-ibiza',
    es: 'codigo-vestimenta-discotecas-ibiza',
  },
  'getting-around': {
    en: 'getting-around-ibiza',
    nl: 'vervoer-op-ibiza',
    de: 'fortbewegung-auf-ibiza',
    fr: 'se-deplacer-a-ibiza',
    es: 'como-moverse-por-ibiza',
  },
}

/**
 * Which languages each route is actually published in.
 *
 * This is the honest half of the slug map. Publishing a hreflang alternate for
 * a language whose page does not exist is worse than publishing none: Google
 * validates a cluster by following it, and a set where four of five URLs 404
 * gets discarded entirely — taking the one real relationship with it. The
 * sitemap reads this list too, so a URL is never submitted before it exists.
 *
 * Adding a language to a route here is the LAST step of translating it, after
 * the page renders. Never before.
 */
/**
 * Routes die in een andere pagina zijn opgegaan. Sleutel = route zonder
 * gepubliceerde talen (ROUTE_LOCALES leeg), waarde = de slug waar de
 * middleware élke taalvariant naartoe 301't. Zonder deze tabel gaven de
 * vertaalde slugs (/nl/ibiza-gastenlijst, /fr/location-bateau-ibiza) een
 * kale 404, want daar bestaat geen map voor.
 */
export const MERGED_INTO: Partial<Record<RouteKey, string>> = {
  'guestlist-hub': 'guestlist',
  'boat-rental': 'boats',
}

export const ROUTE_LOCALES: Record<RouteKey, Locale[]> = {
  // Samengevoegd met /boats. De slugs blijven hierboven staan zodat de
  // middleware oude URL's herkent; de pagina's zelf doen een 308 naar /boats.
  // Leeg = niet in sitemap, geen hreflang, geen taalwissel ernaartoe.
  'boat-rental': [],
  'car-rental': ['en', 'nl', 'de', 'fr', 'es'],
  // Alle vijf. NL vertrekt vanuit het misverstand dat de Nederlandse regel (lengte
  // en snelheid) hier zou gelden, DE vanuit de Duitse 15-PS-grens die dezelfde
  // zaal maar andere bijvoorwaarden heeft, ES vanuit wat je met 15 CV echt kunt,
  // FR vanuit het vaargebied — de enige voorwaarde zonder Frans equivalent.
  'boat-no-licence': ['en', 'nl', 'de', 'es', 'fr'],
  // Alle vijf. NL en DE vragen of hun vaarbewijs erkend wordt, ES wat een schipper
  // toevoegt als hij niet verplicht is, FR wat hij werkelijk op de offerte kost.
  'boat-with-skipper': ['en', 'nl', 'de', 'es', 'fr'],
  // Alle vijf. Elke taal heeft een eigen invalshoek op dezelfde wettelijke kern:
  // NL en DE vragen "telt mijn vaarbewijs hier", ES "welke titulación en wat
  // als ik het papier niet bij me heb", FR gaat over de verwachting — dertig
  // minuten is geen tochtje. Het juridische deel is overal woordelijk hetzelfde,
  // want daar valt niet mee te spelen.
  'jet-ski-rental': ['en', 'nl', 'de', 'es', 'fr'],
  // Alle vijf. NL gaat over de creditcard (wij pinnen thuis met een debetkaart en
  // een deel van de reizigers heeft er simpelweg geen), DE over waarom een
  // station buiten de terminal in augustus sneller is dan de balie erin, ES over
  // de devolución bij een vroege terugvlucht, FR over het vluchtnummer.
  'car-rental-airport': ['en', 'nl', 'de', 'es', 'fr'],
  'convertible-rental': ['en'],
  // Alle vijf: /nl|de|es|fr/boat-party renderen echt, staan in de sitemap en
  // dragen een volledige hreflang-cluster — ze lopen via STATIC_ROUTES, niet via
  // LOCALIZED_ROUTES, dus deze regel werd nergens gelezen. Zodra iemand
  // boat-party wél aan LOCALIZED_ROUTES toevoegt, zou 'en' alleen vier live
  // geindexeerde URL's stil uit de sitemap gooien.
  'boat-party': ['en', 'nl', 'de', 'fr', 'es'],
  // Alle vijf. Elke taal heeft een eigen bestand met een eigen invalshoek — de
  // Nederlandse gaat over betrouwbaarheid (is dit doorverkoop?), de Duitse over
  // wanneer je moet kopen, de Spaanse over waarom het duurder is dan een zaal
  // op het vasteland, de Franse over de tijden. Geen van de vijf is een
  // vertaling van een andere, en dat is precies waarom ze alle vijf mogen
  // renderen: een machinevertaling had hier een hreflang-cluster van vijf
  // dezelfde pagina's opgeleverd.
  'club-tickets-hub': ['en', 'nl', 'de', 'es', 'fr'],
  // Alleen nog een 301-doel naar /guestlist — niet publiceren.
  'guestlist-hub': [],
  'wiber-partner': ['en'],
  'clickandboat-partner': ['en'],
  // Nieuw en voorlopig alleen Engels. Een taal komt hier pas bij nadat de
  // vertaalde pagina echt rendert — een hreflang naar een 404 laat Google het
  // hele cluster weggooien, en dat is erger dan geen alternate.
  'pacha-venue': ['en'],
  'amnesia-venue': ['en'],
  'dc10-venue': ['en'],
  'airport-transfer': ['en'],
  'nightlife-guide': ['en'],
  'dress-code': ['en'],
  'getting-around': ['en'],
}

/** The locales a route is published in. */
export function localesFor(key: RouteKey): Locale[] {
  return ROUTE_LOCALES[key]
}

/** The slug this route uses in a given locale. */
export function slugFor(key: RouteKey, locale: Locale): string {
  return ROUTE_SLUGS[key][locale]
}

/** Full path including the locale prefix, e.g. '/nl/boot-huren-ibiza'. */
export function pathFor(key: RouteKey, locale: Locale): string {
  return `/${locale}/${slugFor(key, locale)}`
}

/** Reverse lookup: which route (if any) does this locale+slug belong to? */
export function routeKeyForSlug(locale: Locale, slug: string): RouteKey | null {
  for (const key of Object.keys(ROUTE_SLUGS) as RouteKey[]) {
    if (ROUTE_SLUGS[key][locale] === slug) return key
  }
  return null
}

/**
 * Canonical + hreflang alternates for a page whose slug is localised.
 *
 * The equivalent of buildAlternates() in ./seo.ts, except each language's href
 * is that language's own slug. Every locale is listed, the current one included
 * (the self-reference Google requires), and x-default points at the English
 * version per the site's global rule.
 */
export function localizedAlternates(key: RouteKey, locale: Locale): NonNullable<Metadata['alternates']> {
  const available = localesFor(key)
  const languages: Record<string, string> = {}
  for (const l of available) languages[l] = `${SITE_URL}${pathFor(key, l)}`
  // x-default points at English when English exists, and otherwise at the only
  // language that does — an x-default aimed at a 404 breaks the cluster it is
  // meant to complete.
  const fallback = available.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : available[0]
  languages['x-default'] = `${SITE_URL}${pathFor(key, fallback)}`
  return { canonical: `${SITE_URL}${pathFor(key, locale)}`, languages }
}

/**
 * Every localised route as { locale, path } pairs, for the sitemap.
 * `path` excludes the locale prefix, matching the sitemap's other entries.
 */
export function allLocalizedRoutes(): { key: RouteKey; locale: Locale; path: string }[] {
  const out: { key: RouteKey; locale: Locale; path: string }[] = []
  for (const key of Object.keys(ROUTE_SLUGS) as RouteKey[]) {
    for (const locale of LOCALES) out.push({ key, locale, path: ROUTE_SLUGS[key][locale] })
  }
  return out
}

/**
 * Find the route a slug belongs to, in ANY locale.
 *
 * This is what powers the cross-language slug redirect. A visitor (or an old
 * inbound link, or a translated share) can arrive at /nl/boat-rental-ibiza —
 * the Dutch locale carrying the English slug. That URL must not render: it
 * would be a second copy of the page on a URL no hreflang cluster mentions,
 * which is duplicate content pointing nowhere. Instead the middleware looks the
 * slug up here and sends a 301 to the slug that locale actually uses.
 *
 * Returns the key and the locale the slug was found under, so a caller can tell
 * "this is the right slug for this locale" from "this belongs to another one".
 */
export function findRouteBySlug(slug: string): { key: RouteKey; locale: Locale } | null {
  for (const key of Object.keys(ROUTE_SLUGS) as RouteKey[]) {
    for (const locale of LOCALES) {
      if (ROUTE_SLUGS[key][locale] === slug) return { key, locale }
    }
  }
  return null
}
