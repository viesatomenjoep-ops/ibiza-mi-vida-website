'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AppLabels } from './i18n'
import { monthLong, weekdayShort } from './i18n'
import { addMonthsISO, monthGrid, monthKey, todayISO } from './dateUtils'

/**
 * Full-month calendar grid, used both as the standalone "select date" sheet
 * and (via the same component) inside the Planner's date-range step. Generic
 * over a single onPick callback — range logic lives in the caller.
 */
export function DatePickerSheet({
  t,
  locale,
  selected,
  min,
  max,
  onPick,
}: {
  t: AppLabels
  locale: string
  selected?: string
  min?: string
  max?: string
  onPick: (iso: string) => void
}) {
  const today = todayISO()
  const [cursor, setCursor] = useState(selected || today)
  const grid = monthGrid(cursor)
  const [, m] = cursor.split('-').map(Number)
  const canGoBack = !min || monthKey(addMonthsISO(cursor, -1)) >= monthKey(min)
  const canGoFwd = !max || monthKey(cursor) < monthKey(max)

  return (
    <div className="flex flex-col gap-4 pt-1">
      <h2 className="font-display text-xl font-black text-white">{t.pickDate}</h2>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoBack && setCursor(c => addMonthsISO(c, -1))}
          disabled={!canGoBack}
          aria-label="prev"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 outline-none transition-colors motion-reduce:transition-none enabled:hover:bg-white/10 disabled:opacity-25 focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-display text-[15px] font-extrabold capitalize text-white">
          {monthLong(locale, m - 1)} {cursor.slice(0, 4)}
        </span>
        <button
          type="button"
          onClick={() => canGoFwd && setCursor(c => addMonthsISO(c, 1))}
          disabled={!canGoFwd}
          aria-label="next"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 outline-none transition-colors motion-reduce:transition-none enabled:hover:bg-white/10 disabled:opacity-25 focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="pb-1 text-[11px] font-bold uppercase text-white/30">
            {weekdayShort(locale, i)}
          </span>
        ))}
        {grid.map((iso, i) => {
          if (!iso) return <span key={`b${i}`} />
          const disabled = (min && iso < min) || (max && iso > max)
          const isToday = iso === today
          const isSelected = iso === selected
          return (
            <button
              key={iso}
              type="button"
              disabled={!!disabled}
              onClick={() => onPick(iso)}
              className={`relative grid aspect-square place-items-center rounded-xl text-[14px] font-bold outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100 ${
                isSelected
                  ? 'bg-app-accent text-white shadow-lg shadow-app-accent/25'
                  : disabled
                    ? 'text-white/15'
                    : 'text-white/80 hover:bg-white/[0.08]'
              }`}
            >
              {Number(iso.slice(8, 10))}
              {isToday && !isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-app-accent-soft" aria-hidden />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
