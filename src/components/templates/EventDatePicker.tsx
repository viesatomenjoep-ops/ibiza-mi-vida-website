'use client'

import React, { useMemo, useState, useCallback } from 'react'
import {
  format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfDay, eachDayOfInterval, parseISO, isToday, isTomorrow,
} from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'
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

  const [period, setPeriod] = useState<Period>('week')
  const [activeDay, setActiveDay] = useState<string | null>(null)

  const { rangeStartStr, rangeEndStr, stripDays, showStrip } = useMemo(() => {
    let s = today, e = today, strip = true
    if (period === 'day') { s = today; e = addDays(today, 13) }
    else if (period === 'week') { s = startOfWeek(today, { weekStartsOn: 1 }); e = endOfWeek(today, { weekStartsOn: 1 }) }
    else if (period === 'month') { s = startOfMonth(today); e = endOfMonth(today) }
    else { s = today; e = addDays(today, 365); strip = false }
    return {
      rangeStartStr: format(s, 'yyyy-MM-dd'),
      rangeEndStr: format(e, 'yyyy-MM-dd'),
      stripDays: strip ? eachDayOfInterval({ start: s, end: e }) : [],
      showStrip: strip,
    }
  }, [period, today])

  const changePeriod = useCallback((p: Period) => {
    setPeriod(p)
    setActiveDay(p === 'day' ? todayStr : null)
  }, [todayStr])

  const countForDay = useCallback((ds: string) => upcoming.filter(d => d.date === ds).length, [upcoming])

  const visible = useMemo(() => {
    return upcoming.filter(d => {
      if (activeDay) return d.date === activeDay
      return d.date >= rangeStartStr && d.date <= rangeEndStr
    })
  }, [upcoming, activeDay, rangeStartStr, rangeEndStr])

  const periods: { key: Period; label: string }[] = [
    { key: 'day', label: L.day }, { key: 'week', label: L.week },
    { key: 'month', label: L.month }, { key: 'year', label: L.year },
  ]
  const periodIdx = periods.findIndex(p => p.key === period)
  const bcp = ({ en: 'en-GB', nl: 'nl-NL', de: 'de-DE', es: 'es-ES', fr: 'fr-FR' } as Record<string, string>)[locale] || 'en-GB'

  return (
    <div className="flex flex-col gap-5">
      {/* Period selector (sliding pill) */}
      <div className="relative grid grid-cols-4 rounded-full border border-black/10 bg-black/[0.04] p-1.5">
        <span
          className="absolute top-1.5 bottom-1.5 rounded-full bg-ibiza-green shadow-lg transition-all duration-300 ease-out"
          style={{ left: `calc(${periodIdx * 25}% + 6px)`, width: 'calc(25% - 12px)' }}
        />
        {periods.map(p => (
          <button
            key={p.key}
            onClick={() => changePeriod(p.key)}
            className={`relative z-10 rounded-full py-2.5 text-center text-sm font-black uppercase tracking-wide transition-colors md:text-base ${period === p.key ? 'text-velvet-obsidian' : 'text-black/55 hover:text-black'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Day strip */}
      {showStrip && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {period !== 'day' && (
            <button
              onClick={() => setActiveDay(null)}
              className={`shrink-0 rounded-2xl border px-4 py-3 text-sm font-bold transition ${!activeDay ? 'border-ibiza-green bg-ibiza-green text-velvet-obsidian' : 'border-black/10 bg-white text-black/60 hover:border-black/40 hover:text-black'}`}
            >
              {period === 'week' ? L.wholeWeek : L.wholeMonth}
            </button>
          )}
          {stripDays.map(d => {
            const ds = format(d, 'yyyy-MM-dd')
            const past = ds < todayStr
            const cnt = countForDay(ds)
            const on = activeDay === ds
            return (
              <button
                key={ds}
                disabled={past || cnt === 0}
                onClick={() => setActiveDay(on ? (period === 'day' ? ds : null) : ds)}
                className={`flex shrink-0 flex-col items-center rounded-2xl border px-4 py-2.5 transition ${on ? 'border-ibiza-green bg-ibiza-green text-velvet-obsidian' : past || cnt === 0 ? 'cursor-not-allowed border-black/5 bg-transparent text-black/25' : 'border-black/10 bg-white text-black hover:border-black/40'}`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wide ${on ? 'text-velvet-obsidian/70' : 'text-black/40'}`}>{format(d, 'EEE', { locale: loc })}</span>
                <span className="text-xl font-black leading-tight">{format(d, 'd')}</span>
                <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${cnt > 0 ? (on ? 'bg-velvet-obsidian' : 'bg-ibiza-green') : 'bg-transparent'}`} />
              </button>
            )
          })}
        </div>
      )}

      {/* Date tiles */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-black/5 py-14 text-center">
          <CalendarDays size={34} className="mx-auto mb-3 text-black/20" />
          <p className="font-semibold text-black/50">{L.noDates}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((dateObj, idx) => {
            const line = formatLineUp(dateObj.lineUp)
            const d = parseISO(dateObj.date)
            const dayTag = isToday(d) ? L.today : isTomorrow(d) ? L.tomorrow : format(d, 'EEE', { locale: loc })
            return (
              <div key={`${dateObj.id}-${idx}`} className="group flex flex-col justify-between gap-4 rounded-2xl border border-black/10 bg-white p-5 transition-all hover:border-ibiza-green/40 hover:shadow-md sm:flex-row sm:items-center">
                <div className="flex w-full flex-col gap-1 sm:w-2/3">
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
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
