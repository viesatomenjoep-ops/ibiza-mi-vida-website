'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react'
import { format, addDays, startOfWeek, parseISO } from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { optImg } from '@/lib/img'

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
  variant = 'red',
  imagePool = [],
  photoDim = true,
}: {
  eventDates: string[]
  weekStart: string
  setWeekStart: (d: string) => void
  activeDay: string | null
  setActiveDay: (d: string | null) => void
  locale?: string
  imageFor?: (iso: string) => string
  variant?: 'red' | 'photo'
  imagePool?: string[]
  photoDim?: boolean
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

  // Photo variant: gently rotate the blurred backdrops over time (live feel)
  const [tick, setTick] = useState(0)
  useEffect(() => { if (variant !== 'photo') return; const id = setInterval(() => setTick(t => t + 1), 7000); return () => clearInterval(id) }, [variant])

  // Weeks as swipeable pages — the tiles physically slide with your thumb
  const weeks = useMemo(() => {
    const out: string[] = []; let c = parseISO(firstMonday); let g = 0
    while (format(c, 'yyyy-MM-dd') <= lastMonday && g < 80) { out.push(format(c, 'yyyy-MM-dd')); c = addDays(c, 7); g++ }
    return out.length ? out : [firstMonday]
  }, [firstMonday, lastMonday])
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollTimer = useRef<any>(null)
  // Keep the carousel aligned to the controlled weekStart (e.g. when arrows are used)
  useEffect(() => {
    const el = scrollRef.current; if (!el) return
    const idx = Math.max(0, weeks.indexOf(weekStart))
    const target = idx * el.clientWidth
    if (Math.abs(el.scrollLeft - target) > 4) el.scrollTo({ left: target, behavior: 'smooth' })
  }, [weekStart, weeks])
  const onScroll = () => {
    const el = scrollRef.current; if (!el) return
    clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      const w = weeks[Math.max(0, Math.min(weeks.length - 1, idx))]
      if (w && w !== weekStart) { setWeekStart(w); setActiveDay(null) }
    }, 110)
  }
  const shiftTo = (dir: number) => {
    const i = weeks.indexOf(weekStart)
    const w = weeks[Math.max(0, Math.min(weeks.length - 1, (i < 0 ? 0 : i) + dir))]
    if (w) { setWeekStart(w); setActiveDay(null) }
  }

  const renderTile = (ds: string, i: number) => {
    const d = parseISO(ds)
    const past = ds < todayStr
    const hv = has(ds)
    const on = activeDay === ds
    const disabled = past || !hv
    const photoBg = variant === 'photo' ? (imageFor?.(ds) || imagePool[(i + tick) % Math.max(1, imagePool.length)] || '') : ''
    return (
      <button
        key={ds}
        type="button"
        disabled={disabled}
        onClick={() => setActiveDay(on ? null : ds)}
        style={variant === 'red' ? { backgroundColor: '#E14D68' } : { backgroundColor: '#111' }}
        className={`relative flex h-12 flex-col items-center justify-center overflow-hidden rounded-lg leading-none transition-all sm:h-14 ${on ? 'ring-[3px] ring-ibiza-green ring-offset-1 ring-offset-white' : ''} ${disabled ? 'opacity-30' : 'active:scale-95'}`}
      >
        {variant === 'photo' && photoBg && <img src={optImg(photoBg, 800)} loading="lazy" alt="" className={`absolute inset-0 h-full w-full object-cover ${photoDim ? 'scale-110 blur-[2px]' : ''}`} />}
        {variant === 'photo' && photoDim && <span className="absolute inset-0 bg-black/55" />}
        {variant === 'photo' && !photoDim && <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />}
        <span className="relative flex flex-col items-center">
          <span className="text-[9px] font-black uppercase text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">{format(d, 'EEEEE', { locale: L })}</span>
          <span className="font-serif text-base font-black text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">{format(d, 'd')}</span>
          {hv && !on && <span className="mt-0.5 h-1 w-1 rounded-full bg-white [box-shadow:0_0_3px_rgba(0,0,0,0.8)]" />}
        </span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[55] border-t border-black/10 bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-3xl px-2 pt-1.5" style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}>
        <div className="mb-1.5 flex items-center justify-center gap-3">
          <button type="button" aria-label="prev" onClick={() => shiftTo(-1)} disabled={weekStart <= firstMonday} className="grid h-7 w-7 place-items-center rounded-full border border-black/10 bg-white text-black transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronLeft size={16} /></button>
          <span className="text-[15px] font-black uppercase tracking-wide text-black">{cap(format(parseISO(weekStart), 'd MMM', { locale: L }))} – {cap(format(parseISO(weekEnd), 'd MMM', { locale: L }))}</span>
          <button type="button" aria-label="next" onClick={() => shiftTo(1)} disabled={weekStart >= lastMonday} className="grid h-7 w-7 place-items-center rounded-full border border-black/10 bg-white text-black transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronRight size={16} /></button>
        </div>
        {/* Swipeable weeks — the 7 blocks slide with the thumb, snapping per week */}
        <div ref={scrollRef} onScroll={onScroll} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {weeks.map(ws => {
            const wd = Array.from({ length: 7 }, (_, i) => format(addDays(parseISO(ws), i), 'yyyy-MM-dd'))
            return <div key={ws} className="grid min-w-full shrink-0 snap-center grid-cols-7 gap-1">{wd.map((ds, i) => renderTile(ds, i))}</div>
          })}
        </div>
      </div>
    </div>
  )
}
