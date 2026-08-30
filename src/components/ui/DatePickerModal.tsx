'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth,
  parseISO, startOfMonth, startOfWeek,
} from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const getLoc = (l: string) => ({ nl, de, es, fr, en: enUS } as Record<string, typeof enUS>)[l] || enUS

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const TITLE: L = {
  nl: 'Kies een datum', en: 'Pick a date', de: 'Datum wählen', es: 'Elige una fecha', fr: 'Choisir une date',
}
const SUB: L = {
  nl: 'Alleen dagen met een programma zijn te kiezen.',
  en: 'Only days with a programme can be selected.',
  de: 'Nur Tage mit Programm sind wählbar.',
  es: 'Solo se pueden elegir días con programa.',
  fr: 'Seuls les jours avec un programme sont sélectionnables.',
}
const CLOSE: L = { nl: 'Sluiten', en: 'Close', de: 'Schließen', es: 'Cerrar', fr: 'Fermer' }
const PREV: L = { nl: 'Vorige maand', en: 'Previous month', de: 'Vorheriger Monat', es: 'Mes anterior', fr: 'Mois précédent' }
const NEXT: L = { nl: 'Volgende maand', en: 'Next month', de: 'Nächster Monat', es: 'Mes siguiente', fr: 'Mois suivant' }
const CLEAR: L = { nl: 'Alle datums tonen', en: 'Show all dates', de: 'Alle Termine zeigen', es: 'Ver todas las fechas', fr: 'Voir toutes les dates' }
const NONE: L = {
  nl: 'Geen programma in deze maand.', en: 'Nothing on this month.',
  de: 'In diesem Monat kein Programm.', es: 'No hay programa este mes.', fr: 'Rien ce mois-ci.',
}

/**
 * Month-grid date picker for the event booking flow.
 *
 * The booking flow only had a week strip you step through seven days at a time,
 * so reaching an event two months out meant eight swipes with no idea whether
 * anything was there. This shows a whole month at once, marks which days
 * actually have a programme, and jumps straight to the first month that does.
 *
 * Only dates present in `available` are selectable — the picker cannot offer a
 * day we have nothing to sell, which is both the honest behaviour and what
 * stops someone landing on an empty result.
 */
export function DatePickerModal({
  open,
  onClose,
  available,
  selected,
  onSelect,
  locale = 'nl',
}: {
  open: boolean
  onClose: () => void
  /** ISO yyyy-mm-dd strings that have events. */
  available: string[]
  selected: string | null
  onSelect: (iso: string | null) => void
  locale?: string
}) {
  const loc = getLoc(locale)
  const availableSet = useMemo(() => new Set(available), [available])
  const sorted = useMemo(() => [...available].sort(), [available])

  // Open on the selected month, else on the first month that has anything.
  const initial = selected || sorted[0] || format(new Date(), 'yyyy-MM-dd')
  const [cursor, setCursor] = useState(() => startOfMonth(parseISO(initial)))
  useEffect(() => { if (open) setCursor(startOfMonth(parseISO(selected || sorted[0] || format(new Date(), 'yyyy-MM-dd')))) }, [open, selected, sorted])

  const firstMonth = useMemo(() => (sorted[0] ? startOfMonth(parseISO(sorted[0])) : null), [sorted])
  const lastMonth = useMemo(() => (sorted.length ? startOfMonth(parseISO(sorted[sorted.length - 1])) : null), [sorted])

  const grid = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }),
  }), [cursor])

  const monthHasAny = useMemo(
    () => grid.some((d) => isSameMonth(d, cursor) && availableSet.has(format(d, 'yyyy-MM-dd'))),
    [grid, cursor, availableSet],
  )

  const canPrev = !!firstMonth && cursor > firstMonth
  const canNext = !!lastMonth && cursor < lastMonth

  // Focus trap essentials: close on Escape, and restore focus on unmount.
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
    }
    document.addEventListener('keydown', onKey)
    const body = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = body
      prevFocus?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const weekdayLabels = Array.from({ length: 7 }, (_, i) =>
    format(startOfWeek(new Date(), { weekStartsOn: 1 }).getTime() + i * 86400000, 'EEEEE', { locale: loc }))

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t(TITLE, locale)}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-5 text-neutral-900 shadow-2xl outline-none sm:rounded-3xl"
        style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-black tracking-tight">{t(TITLE, locale)}</h2>
            <p className="mt-1 text-sm text-neutral-600">{t(SUB, locale)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t(CLOSE, locale)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/15 bg-white text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setCursor((c) => addMonths(c, -1))}
            disabled={!canPrev}
            aria-label={t(PREV, locale)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/15 bg-white text-neutral-900 transition-colors enabled:hover:bg-neutral-100 disabled:opacity-25"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <span className="font-serif text-base font-black capitalize">
            {format(cursor, 'LLLL yyyy', { locale: loc })}
          </span>
          <button
            type="button"
            onClick={() => setCursor((c) => addMonths(c, 1))}
            disabled={!canNext}
            aria-label={t(NEXT, locale)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/15 bg-white text-neutral-900 transition-colors enabled:hover:bg-neutral-100 disabled:opacity-25"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {weekdayLabels.map((w, i) => (
            <span key={i} className="py-1 text-[11px] font-black uppercase tracking-wide text-black/60">{w}</span>
          ))}
          {grid.map((d) => {
            const iso = format(d, 'yyyy-MM-dd')
            const inMonth = isSameMonth(d, cursor)
            const has = availableSet.has(iso)
            const isSel = selected === iso
            return (
              <button
                key={iso}
                type="button"
                disabled={!has}
                aria-pressed={isSel}
                aria-label={format(d, 'd MMMM yyyy', { locale: loc })}
                onClick={() => { onSelect(iso); onClose() }}
                className={[
                  'relative grid h-11 place-items-center rounded-xl text-sm font-bold transition-colors',
                  !inMonth ? 'opacity-30' : '',
                  isSel
                    ? 'bg-ibiza-green text-white'
                    : has
                      ? 'bg-ibiza-mint text-neutral-900 hover:bg-ibiza-green hover:text-white'
                      : 'text-black/35',
                ].join(' ')}
              >
                {format(d, 'd')}
                {has && !isSel ? (
                  <span aria-hidden className="absolute bottom-1.5 h-1 w-1 rounded-full bg-ibiza-green" />
                ) : null}
              </button>
            )
          })}
        </div>

        {!monthHasAny ? (
          <p className="mt-4 text-center text-sm text-neutral-600">{t(NONE, locale)}</p>
        ) : null}

        {selected ? (
          <button
            type="button"
            onClick={() => { onSelect(null); onClose() }}
            className="mt-5 w-full rounded-full border border-black/15 bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            {t(CLEAR, locale)}
          </button>
        ) : null}
      </div>
    </div>
  )
}
