// Plain-date helpers (yyyy-MM-dd strings) shared by MonthStrip, DatePickerSheet
// and the Planner — deliberately dependency-free (no date-fns) since the app
// shell only ever needs day-grid math, not locale-aware formatting.

import { ibizaTonight } from '@/lib/date-label'

export const toISO = (d: Date) => d.toISOString().slice(0, 10)

/**
 * De dag waarop de app-schil opent.
 *
 * Dit was `toISO(new Date())`, oftewel UTC-vandaag. Twee fouten in één regel:
 * Ibiza loopt op UTC voor, én een clubavond loopt door tot een uur of zes 's
 * ochtends. Wie om 01:00 de agenda opende kreeg de dág erna te zien en kon voor
 * het feest dat op dat moment bezig was niets meer boeken. Zie ibizaTonight().
 */
export const todayISO = () => ibizaTonight()

export function addDaysISO(iso: string, n: number): string {
  const d = new Date(iso + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return toISO(d)
}

/** 0 = Sunday, per JS Date — matches WEEKDAYS_SHORT ordering in i18n.ts. */
export function weekdayOf(iso: string): number {
  return new Date(iso + 'T12:00:00Z').getUTCDay()
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7) // yyyy-MM
}

/** First day of the month containing `iso`, as yyyy-MM-dd. */
export function startOfMonthISO(iso: string): string {
  return `${iso.slice(0, 7)}-01`
}

export function addMonthsISO(iso: string, n: number): string {
  const [y, m] = iso.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return toISO(d)
}

/** Days in the calendar month containing `iso`. */
export function daysInMonth(iso: string): number {
  const [y, m] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m, 0)).getUTCDate()
}

/**
 * Full month grid for a calendar UI: leading `null`s for the days of the
 * previous month that share the first week, then every date of the month
 * as yyyy-MM-dd.
 */
export function monthGrid(iso: string): (string | null)[] {
  const first = startOfMonthISO(iso)
  const lead = weekdayOf(first)
  const total = daysInMonth(first)
  const out: (string | null)[] = Array(lead).fill(null)
  for (let d = 1; d <= total; d++) out.push(`${first.slice(0, 8)}${String(d).padStart(2, '0')}`)
  return out
}
