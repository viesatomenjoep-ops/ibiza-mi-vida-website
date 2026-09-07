/**
 * Clubpagina's die geschreven zijn maar nog niet gepubliceerd mogen worden.
 *
 * Pacha, Amnesia en DC-10 komen later dit jaar; het akkoord daarvoor is nog
 * niet rond. De pagina's staan er al (zie src/app/[locale]/{pacha,amnesia,dc10}
 * -ibiza), maar tot dat akkoord er is 404't elke route hier op — precies zoals
 * /restaurants doet zolang restaurants.ts leeg is.
 *
 * Waarom 404 en niet gewoon publiceren: de huidige tekst zegt stellig dat we
 * voor deze drie GEEN tickets verkopen, omdat ze niet in de ClubTickets-feed
 * zitten. Dat is vandaag waar. Zodra het akkoord er is verandert precies dat
 * feit, en dan is de gepubliceerde versie niet meer alleen achterhaald maar
 * onjuist — en een claim die eenmaal geïndexeerd en geciteerd is, haal je niet
 * terug door de pagina te wijzigen.
 *
 * ── Publiceren ────────────────────────────────────────────────────────────
 * Zet de slug hieronder op `true`, en doe in DEZELFDE commit:
 *   1. Herlees de copy. Staat de club inmiddels in de feed, dan moeten de
 *      "wij verkopen hier geen tickets"-passages eruit (lead, eerste FAQ, en
 *      bij DC-10 de sectie over DICE) en komt er een <AffiliateLink> voor in de
 *      plaats. Staat hij er níét in, dan klopt de tekst en kan hij zo mee.
 *   2. Voeg de RouteKey toe aan LOCALIZED_ROUTES in src/app/sitemap.ts.
 *   3. Voeg de pagina toe aan src/app/llms.txt/route.ts.
 *   4. Zet de interne links terug (zie de InternalLinks-blokken van de drie
 *      pagina's onderling en van /en/ibiza-airport-transfer).
 *   5. Werk de datum bij in src/lib/content-dates.ts.
 *
 * Publiceer nooit alleen deze vlag: een pagina die live staat maar in geen
 * sitemap en geen enkele interne link voorkomt, wordt niet gevonden.
 */
export const VENUE_PAGE_PUBLISHED: Record<string, boolean> = {
  'pacha-ibiza': false,
  'amnesia-ibiza': false,
  'dc10-ibiza': false,
}

/** Mag deze venuepagina gerenderd worden? Onbekende slugs: ja. */
export function venuePagePublished(slug: string): boolean {
  return VENUE_PAGE_PUBLISHED[slug] ?? true
}
