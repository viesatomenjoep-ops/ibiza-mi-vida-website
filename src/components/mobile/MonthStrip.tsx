'use client'

import { useMemo } from 'react'
import { monthShort } from './i18n'
import { addMonthsISO, monthKey, todayISO } from './dateUtils'

/**
 * Horizontal month-pill row above the day strip. Picking a month jumps the
 * day strip's window to that month's first (upcoming) day. Only months that
 * actually have data ahead (today .. +6mo) are shown.
 */
export function MonthStrip({
  activeMonth,
  onPick,
  locale,
  months = 6,
}: {
  activeMonth: string
  onPick: (monthStartISO: string) => void
  locale: string
  months?: number
}) {
  const today = todayISO()
  const options = useMemo(
    () => Array.from({ length: months }, (_, i) => addMonthsISO(today, i)),
    [today, months],
  )

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map(iso => {
        const active = monthKey(iso) === monthKey(activeMonth)
        const [, m] = iso.split('-').map(Number)
        return (
          <button
            key={iso}
            type="button"
            onClick={() => onPick(iso)}
            aria-pressed={active}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-wide outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-95 motion-reduce:active:scale-100 ${
              active ? 'bg-white/[0.1] text-white' : 'text-white/35 hover:text-white/65'
            }`}
          >
            {monthShort(locale, m - 1)}
          </button>
        )
      })}
    </div>
  )
}
