'use client'

import React, { useMemo } from 'react'
import { format, addDays, startOfWeek, parseISO } from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const getLoc = (l: string) => ({ nl, de, es, fr, en: enUS } as Record<string, typeof enUS>)[l] || enUS

/**
 * Fixed bottom "dock" bar with a full-width row of 7 day blocks (Mon–Sun), each
 * showing the event photo. Controlled: parent owns weekStart + activeDay so the
 * page content can react. Present at every step of a category (list + detail).
 */
export function WeekDockBar({
  eventDates,
  weekStart,
  setWeekStart,
  activeDay,
  setActiveDay,
  locale = 'nl',
  imageFor,
}: {
  eventDates: string[]
  weekStart: string
  setWeekStart: (d: string) => void
  activeDay: string | null
  setActiveDay: (d: string | null) => void
  locale?: string
  imageFor?: (iso: string) => string
}) {
  const L = getLoc(locale)
  const todayStr = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])
  const upcoming = useMemo(() => Array.from(new Set(eventDates.filter(d => d >= todayStr))).sort(), [eventDates, todayStr])
  const monday = (d: Date) => startOfWeek(d, { weekStartsOn: 1 })
  const firstMonday = useMemo(() => format(monday(parseISO(upcoming[0] || todayStr)), 'yyyy-MM-dd'), [upcoming, todayStr])
  const lastMonday = useMemo(() => format(monday(parseISO(upcoming[upcoming.length - 1] || todayStr)), 'yyyy-MM-dd'), [upcoming, todayStr])

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => format(addDays(parseISO(weekStart), i), 'yyyy-MM-dd')), [weekStart])
  const weekEnd = days[6]
  const has = (ds: string) => upcoming.includes(ds)
  const shift = (dir: number) => {
    const nx = format(addDays(parseISO(weekStart), dir * 7), 'yyyy-MM-dd')
    if (nx < firstMonday || nx > lastMonday) return
    setWeekStart(nx); setActiveDay(null)
  }
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[55] border-t border-black/10 bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-3xl px-2 pt-1.5" style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}>
        <div className="mb-1 flex items-center justify-center gap-3">
          <button type="button" aria-label="prev" onClick={() => shift(-1)} disabled={weekStart <= firstMonday} className="grid h-7 w-7 place-items-center rounded-full border border-black/10 bg-white text-black transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronLeft size={16} /></button>
          <span className="text-[10px] font-black uppercase tracking-widest text-black/50">{cap(format(parseISO(weekStart), 'd MMM', { locale: L }))} – {cap(format(parseISO(weekEnd), 'd MMM', { locale: L }))}</span>
          <button type="button" aria-label="next" onClick={() => shift(1)} disabled={weekStart >= lastMonday} className="grid h-7 w-7 place-items-center rounded-full border border-black/10 bg-white text-black transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronRight size={16} /></button>
        </div>
        {/* Seven full-width blocks that fill the bar edge to edge */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(ds => {
            const d = parseISO(ds)
            const past = ds < todayStr
            const hv = has(ds)
            const on = activeDay === ds
            const disabled = past || !hv
            const img = imageFor?.(ds)
            return (
              <button
                key={ds}
                type="button"
                disabled={disabled}
                onClick={() => setActiveDay(on ? null : ds)}
                className={`relative flex h-12 flex-col items-center justify-center overflow-hidden rounded-lg transition-all sm:h-14 ${on ? 'ring-2 ring-ibiza-green' : ''} ${disabled ? 'opacity-40' : 'active:scale-95'}`}
              >
                {img ? <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
                <span className={`absolute inset-0 ${on ? 'bg-ibiza-green/75' : disabled ? 'bg-black/60' : 'bg-black/45'}`} />
                <span className="relative flex flex-col items-center leading-none">
                  <span className={`text-[8px] font-black uppercase ${on ? 'text-black/70' : 'text-white/85'}`}>{format(d, 'EEEEE', { locale: L })}</span>
                  <span className={`font-serif text-sm font-black ${on ? 'text-black' : 'text-white'}`}>{format(d, 'd')}</span>
                  {hv && !on && <span className="mt-0.5 h-1 w-1 rounded-full bg-ibiza-green" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
