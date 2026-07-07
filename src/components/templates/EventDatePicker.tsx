'use client'

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import {
  format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfDay, eachDayOfInterval, parseISO, isToday, isTomorrow,
} from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { EventTicketSelector } from './EventTicketSelector'

type Period = 'day' | 'week' | 'month' | 'year'
type Locale = typeof enUS

export interface PickerDate {
  id: string
  date: string
  eventName?: string
  prices?: string
  lineUp?: string
  affLink?: string | null
}

// NOTE: every field must be a plain string — this object is passed from a Server
// Component (EventDetailPage) to this Client Component, and functions are not
// serialisable across that boundary (they throw a server-side exception).
export interface PickerLabels {
  day: string; week: string; month: string; year: string
  wholeWeek: string; wholeMonth: string
  price: string; available: string; noDates: string
  today: string; tomorrow: string
}

interface Props {
  dates: PickerDate[]
  eventName: string
  eventCover: string
  locale: string
  labels: PickerLabels
}

const getLoc = (l: string) => ({ nl, de, es, fr, en: enUS } as Record<string, Locale>)[l] || enUS

function formatLineUp(lineUp?: string): string {
  if (!lineUp) return ''
  let text = lineUp.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  text = text.replace(/(\s*-\s*)+/g, ', ')
  if (text.startsWith(',')) text = text.substring(1).trim()
  return text
}

export function EventDatePicker({ dates, eventName, eventCover, locale, labels: L }: Props) {
  const loc = getLoc(locale)
  const today = useMemo(() => startOfDay(new Date()), [])
  const todayStr = format(today, 'yyyy-MM-dd')

  // Only upcoming dates, sorted — guard against missing/invalid date strings
  const upcoming = useMemo(
    () => [...dates]
      .filter(d => d && typeof d.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d.date) && d.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date)),
    [dates, todayStr]
  )

  const [activeDay, setActiveDay] = useState<string | null>(null)

  const monday = useCallback((dt: Date) => startOfWeek(dt, { weekStartsOn: 1 }), [])
  const firstMonday = useMemo(() => format(monday(parseISO(upcoming[0]?.date || todayStr)), 'yyyy-MM-dd'), [upcoming, todayStr, monday])
  const lastMonday = useMemo(() => format(monday(parseISO(upcoming[upcoming.length - 1]?.date || todayStr)), 'yyyy-MM-dd'), [upcoming, todayStr, monday])
  const [weekStart, setWeekStart] = useState<string>(firstMonday)

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => format(addDays(parseISO(weekStart), i), 'yyyy-MM-dd')), [weekStart])
  const weekEnd = weekDays[6]
  const countForDay = useCallback((ds: string) => upcoming.filter(d => d.date === ds).length, [upcoming])
  const shiftWeek = (dir: number) => {
    const nx = format(addDays(parseISO(weekStart), dir * 7), 'yyyy-MM-dd')
    if (nx < firstMonday || nx > lastMonday) return
    setWeekStart(nx); setActiveDay(null)
  }

  const visible = useMemo(
    () => upcoming.filter(d => (activeDay ? d.date === activeDay : d.date >= weekStart && d.date <= weekEnd)),
    [upcoming, activeDay, weekStart, weekEnd]
  )

  const bcp = ({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as Record<string, string>)[locale] || 'en-GB'
  const capMonth = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  // When a day is picked, glide the matching event(s) into view (feels like it "opens")
  const tilesRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (activeDay && tilesRef.current) tilesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, [activeDay])

  return (
    <div ref={tilesRef} className="flex flex-col gap-5">

      {/* Date tiles */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-black/5 py-14 text-center">
          <CalendarDays size={34} className="mx-auto mb-3 text-black/20" />
          <p className="font-semibold text-black/50">{L.noDates}</p>
        </div>
      ) : (
        <div key={activeDay || weekStart} className="flex flex-col gap-3">
          <style>{`@keyframes dpSlide{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {visible.map((dateObj, idx) => {
            const line = formatLineUp(dateObj.lineUp)
            const d = parseISO(dateObj.date)
            const dayTag = isToday(d) ? L.today : isTomorrow(d) ? L.tomorrow : format(d, 'EEE', { locale: loc })
            return (
              <div key={`${dateObj.id}-${idx}`} style={{ animation: 'dpSlide .35s ease-out backwards', animationDelay: `${idx * 60}ms` }} className="group flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-black/10 bg-white p-4 transition-all hover:border-ibiza-green/40 hover:shadow-md sm:flex-row sm:items-center sm:p-5">
                <span className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-xl bg-neutral-900 sm:aspect-square sm:h-24 sm:w-24">
                  {eventCover ? <img src={eventCover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
                </span>
                <div className="flex w-full flex-col gap-1 sm:flex-1">
                  <span className="font-serif text-xl font-bold text-black transition-colors group-hover:text-ibiza-green">{dateObj.eventName || eventName}</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-black/60">
                    <span className="shrink-0 rounded-md bg-ibiza-green/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-ibiza-green">{dayTag}</span>
                    {new Date(dateObj.date).toLocaleDateString(bcp, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                  </span>
                  {line && (
                    <p className="mt-2 flex items-start gap-1.5 text-sm text-black/60">
                      <span className="mt-0.5 shrink-0 text-ibiza-green">✓</span>
                      <span className="line-clamp-2">{line}</span>
                    </p>
                  )}
                </div>
                <div className="mt-4 flex w-full shrink-0 items-center justify-between gap-4 sm:mt-0 sm:w-auto sm:justify-end sm:gap-6">
                  <div className="flex w-full flex-col items-end sm:w-auto">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black/40">{L.price}</span>
                    <span className="mb-3 text-lg font-bold text-black">{dateObj.prices ? dateObj.prices : L.available}</span>
                    <EventTicketSelector
                      id={dateObj.id.toString()}
                      title={dateObj.eventName || eventName}
                      date={dateObj.date}
                      priceStr={dateObj.prices || '50'}
                      image={eventCover}
                      affLink={dateObj.affLink || ''}
                      locale={locale}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Spacer so the fixed bottom bar never covers the last tile */}
      <div className="h-32" />

      {/* ── Fixed bottom week bar — permanent, like the navbar but at the bottom ── */}
      <div className="fixed bottom-0 left-0 right-0 z-[55] border-t border-black/10 bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <div className="mx-auto w-full max-w-3xl px-3 pt-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <div className="mb-1.5 text-center text-[10px] font-black uppercase tracking-widest text-black/45">
            {capMonth(format(parseISO(weekStart), 'd MMM', { locale: loc }))} – {capMonth(format(parseISO(weekEnd), 'd MMM', { locale: loc }))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="prev" onClick={() => shiftWeek(-1)} disabled={weekStart <= firstMonday} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-black transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronLeft size={18} /></button>
            <div className="grid flex-1 grid-cols-7 gap-1.5">
              {weekDays.map(ds => {
                const d = parseISO(ds)
                const past = ds < todayStr
                const cnt = countForDay(ds)
                const on = activeDay === ds
                const disabled = past || cnt === 0
                return (
                  <button
                    key={ds}
                    type="button"
                    disabled={disabled}
                    onClick={() => setActiveDay(on ? null : ds)}
                    className={`relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl transition-all ${on ? 'ring-2 ring-ibiza-green' : ''} ${disabled ? 'opacity-40' : 'active:scale-95 hover:-translate-y-0.5'}`}
                  >
                    {eventCover ? <img src={eventCover} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
                    <span className={`absolute inset-0 ${on ? 'bg-ibiza-green/75' : disabled ? 'bg-black/60' : 'bg-black/45'}`} />
                    <span className="relative flex flex-col items-center leading-none">
                      <span className={`text-[8px] font-black uppercase tracking-wide ${on ? 'text-black/70' : 'text-white/80'}`}>{format(d, 'EEEEE', { locale: loc })}</span>
                      <span className={`font-serif text-base font-black sm:text-lg ${on ? 'text-black' : 'text-white'}`}>{format(d, 'd')}</span>
                      <span className={`mt-0.5 h-1 w-1 rounded-full ${cnt > 0 ? (on ? 'bg-black' : 'bg-ibiza-green') : 'bg-transparent'}`} />
                    </span>
                  </button>
                )
              })}
            </div>
            <button type="button" aria-label="next" onClick={() => shiftWeek(1)} disabled={weekStart >= lastMonday} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-black transition-colors enabled:hover:bg-ibiza-green disabled:opacity-30"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
