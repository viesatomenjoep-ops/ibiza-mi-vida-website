'use client'

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import {
  format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  startOfDay, eachDayOfInterval, parseISO, isToday, isTomorrow,
} from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'
import { EventTicketSelector } from './EventTicketSelector'
import { WeekDockBar } from '@/components/ui/WeekDockBar'
import { DatePickerModal } from '@/components/ui/DatePickerModal'
import { optImg } from '@/lib/img'

type Period = 'day' | 'week' | 'month' | 'year'

const PICK_LABEL: Record<string, string> = {
  nl: 'Kies een datum', en: 'Pick a date', de: 'Datum wählen', es: 'Elige una fecha', fr: 'Choisir une date',
}
const CLEAR_LABEL: Record<string, string> = {
  nl: 'Alle datums', en: 'All dates', de: 'Alle Termine', es: 'Todas las fechas', fr: 'Toutes les dates',
}
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
  const [pickerOpen, setPickerOpen] = useState(false)
  const availableDates = useMemo(() => Array.from(new Set(upcoming.map(d => d.date))), [upcoming])

  // Picking a date from the month grid also has to move the week strip, or the
  // strip would still be showing a different week than the results below it.
  const chooseDate = useCallback((iso: string | null) => {
    setActiveDay(iso)
    if (iso) setWeekStart(format(startOfWeek(parseISO(iso), { weekStartsOn: 1 }), 'yyyy-MM-dd'))
  }, [])

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
  useEffect(() => { if (activeDay && tilesRef.current) tilesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [activeDay])

  return (
    <div ref={tilesRef} style={{ scrollMarginTop: 'calc(var(--nav-h) + 16px)' }} className="flex flex-col gap-5">

      {/* Jump straight to a date. The week strip alone meant stepping seven days
          at a time with no view of which days further out have anything on. */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-neutral-900 transition-colors hover:border-ibiza-green hover:text-ibiza-green"
        >
          <CalendarDays size={16} strokeWidth={2.5} />
          {activeDay
            ? new Date(activeDay).toLocaleDateString(bcp, { day: 'numeric', month: 'long', timeZone: 'UTC' })
            : (PICK_LABEL[locale] || PICK_LABEL.en)}
        </button>
        {activeDay ? (
          <button
            type="button"
            onClick={() => chooseDate(null)}
            className="text-xs font-black uppercase tracking-widest text-ibiza-green hover:underline"
          >
            {CLEAR_LABEL[locale] || CLEAR_LABEL.en}
          </button>
        ) : null}
      </div>

      <DatePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        available={availableDates}
        selected={activeDay}
        onSelect={chooseDate}
        locale={locale}
      />

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
                  {eventCover ? <img src={optImg(eventCover, 400)} loading="lazy" alt={dateObj.eventName || eventName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
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
                    {/* Only claim a price when the feed actually has one. It
                        does for 2,737 of 2,742 dates; for the handful without,
                        printing "Available" under a heading that says PRICE
                        reads as though the price is the word "Available". */}
                    {dateObj.prices ? (
                      <>
                        <span className="text-xs font-semibold uppercase tracking-wider text-black/60">{L.price}</span>
                        <span className="mb-3 text-lg font-bold text-black">{dateObj.prices}</span>
                      </>
                    ) : (
                      <span className="mb-3 text-sm font-semibold text-black/60">{L.available}</span>
                    )}
                    <EventTicketSelector
                      id={dateObj.id.toString()}
                      title={dateObj.eventName || eventName}
                      date={dateObj.date}
                      priceStr={dateObj.prices || ''}
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

      {/* Spacer so the fixed bottom dock never covers the last tile */}
      <div className="h-36" />

      {/* Fixed bottom week dock — present at every step of the category */}
      <WeekDockBar
        eventDates={upcoming.map(d => d.date)}
        weekStart={weekStart}
        setWeekStart={setWeekStart}
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        locale={locale}
        imageFor={() => eventCover}
      />
    </div>
  )
}
