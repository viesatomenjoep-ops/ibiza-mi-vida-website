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
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(localeTag(locale), {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC',
  })
}

/** `2026-08-30` + 2 -> `2026-09-01`. UTC arithmetic, so no DST surprises. */
export function addDays(iso: string, n: number): string {
  const [y, m, d] = String(iso || '').split('-').map(Number)
  if (!y || !m || !d) return iso
  const t = new Date(Date.UTC(y, m - 1, d + n))
  return t.toISOString().slice(0, 10)
}
