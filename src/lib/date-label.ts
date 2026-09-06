/**
 * Short weekday+date labels, e.g. `2026-08-30` -> `zo 30 aug`.
 *
 * Parsed as UTC on purpose. `new Date('2026-08-30')` is midnight UTC, so any
 * browser west of Greenwich formats it as the 29th — the kind of off-by-one-day
 * bug that only shows up for some of your visitors, which is the worst kind.
 *
 * Lives here rather than inside a component because the homepage rotator and
 * the cards it rotates both need it, and a second copy would drift.
 */

const TAGS: Record<string, string> = {
  nl: 'nl-NL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR',
}

export function localeTag(locale: string): string {
  return TAGS[locale] || 'en-GB'
}

export function fmtShortDate(iso: string, locale: string): string {
  const [y, m, d] = String(iso || '').split('-').map(Number)
  if (!y || !m || !d) return String(iso || '')
  // Uit losse delen samengesteld, niet via toLocaleDateString in één keer.
  // De ICU van Node schrijft voor en-GB "Fri 4 Sept", die van Chrome
  // "Fri, 4 Sept" — zelfde delen, andere leestekens. Deze functie wordt in
  // client-componenten gerenderd (FeaturedDayRotator op de homepage), dus dat
  // verschil was een hydration-mismatch waarna React de complete homepage
  // weggooide en opnieuw rendert. De delen zelf (weekdag, dag, maand) zijn
  // wél gelijk in beide; alleen de scheidingstekens zetten we zelf.
  const parts = new Intl.DateTimeFormat(localeTag(locale), {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC',
  }).formatToParts(new Date(Date.UTC(y, m - 1, d)))
  const deel = (t: string) => parts.find(x => x.type === t)?.value ?? ''
  // Engels: "Fri 4 Sept"; de rest: "vr 4 sep." (zoals ze zelf al deden).
  return `${deel('weekday')} ${deel('day')} ${deel('month')}`.replace(/\s+/g, ' ').trim()
}

/**
 * Vandaag als YYYY-MM-DD in Ibiza-tijd (Europe/Madrid).
 *
 * `new Date().toISOString().slice(0, 10)` is UTC-vandaag, en Ibiza loopt in het
 * seizoen twee uur voor: om 00:45 Ibiza-tijd is het in UTC nog gisteren. Elke
 * pagina die daarmee "vanavond" bepaalde zat tussen middernacht en twee uur een
 * dag achter — precies het venster waarin de doelgroep de site gebruikt. En
 * `new Date()` in een client-component is erger: de server (UTC) en de browser
 * (lokale tijd) komen op een andere dag uit, en dat is een hydration-mismatch.
 * Server én client rekenen daarom allebei hiermee.
 */
export function ibizaToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}

/** `2026-08-30` + 2 -> `2026-09-01`. UTC arithmetic, so no DST surprises. */
export function addDays(iso: string, n: number): string {
  const [y, m, d] = String(iso || '').split('-').map(Number)
  if (!y || !m || !d) return iso
  const t = new Date(Date.UTC(y, m - 1, d + n))
  return t.toISOString().slice(0, 10)
}

/**
 * Het uur waarop de nacht overgaat in de volgende dag, in Ibiza-tijd.
 *
 * Niet op gevoel gekozen maar geteld in de feed: van de 71 events met een
 * opgegeven eindtijd loopt er niets door na 06:00 de volgende ochtend. De
 * laatste twee sluiten om 06:00, negen om 05:00. Sluit een club ooit later,
 * dan is dit het enige getal dat mee hoeft.
 */
export const NACHT_EINDE_UUR = 6

/**
 * De datum van de nacht die nú bezig is op Ibiza, als YYYY-MM-DD.
 *
 * ── Waarom dit naast ibizaToday bestaat ───────────────────────────────────
 * Een clubavond staat in de feed op de datum waarop hij BEGINT:
 *
 *     elrow Ibiza @ [UNVRS]   date: 2026-09-12   startAt: 23:30
 *
 * Wie om 01:00 in de rij staat en op zijn telefoon nog een ticket wil kopen,
 * zit volgens de kalender al in de volgende dag. Filterden we op
 * `ibizaToday()`, dan viel die vrijdagregel om middernacht uit de lijst —
 * midden in het feest, precies op het uur dat mensen kopen. Geen cosmetisch
 * probleem maar gemiste verkoop, en zo ook door de ticketverkoop gemeld: "om
 * 01:00 zie ik alleen nog tickets voor morgen, niet meer voor vanavond".
 *
 *     23:30 vrijdag  -> die vrijdag
 *     01:00 zaterdag -> nog steeds die vrijdag
 *     06:00 zaterdag -> de zaterdag
 *
 * ── Waar je dit NIET voor gebruikt ────────────────────────────────────────
 * Alleen voor wat 's nachts doorloopt: clubavonden en boatparty's. Een
 * jetskiverhuur of een jeepsafari van 10:00 hoort bij de gewone kalenderdag;
 * die zou je hiermee tussen middernacht en zes uur een dag te ver terug tonen,
 * waarna iemand doorklikt naar een datum die al voorbij is. Daarvoor blijft
 * `ibizaToday()` staan.
 */
export function ibizaTonight(nu: Date = new Date()): string {
  const delen = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(nu)
  const pak = (t: string) => delen.find(d => d.type === t)?.value ?? ''
  const iso = `${pak('year')}-${pak('month')}-${pak('day')}`
  // Vóór het sluitingsuur telt de vórige kalenderdag nog als vanavond.
  return Number(pak('hour')) < NACHT_EINDE_UUR ? addDays(iso, -1) : iso
}
