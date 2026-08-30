'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { fmtShortDate, addDays } from '@/lib/date-label'

export interface FeaturedDay<T> {
  /** ISO yyyy-mm-dd. */
  date: string
  items: T[]
}

const TODAY: Record<string, string> = {
  nl: 'Vandaag', en: 'Today', de: 'Heute', es: 'Hoy', fr: "Aujourd'hui",
}
const TOMORROW: Record<string, string> = {
  nl: 'Morgen', en: 'Tomorrow', de: 'Morgen', es: 'Mañana', fr: 'Demain',
}
const PICK_DAY: Record<string, string> = {
  nl: 'Kies een dag', en: 'Pick a day', de: 'Tag wählen',
  es: 'Elige un día', fr: 'Choisir un jour',
}

/**
 * Cycles a featured-events grid through the next few days.
 *
 * The homepage used to show one day only — whatever happened to be next in the
 * feed — so a visitor landing late in the evening saw a programme that was
 * already half over. Rotating through three days puts more of the actual
 * inventory in front of someone who never scrolls past the fold.
 *
 * Three rules keep an auto-rotating block from being hostile:
 *
 *  • It stops while you are pointing at it. Content sliding away mid-read is
 *    the single most irritating thing a carousel does, and these cards are
 *    links, so a swap under the cursor also means clicking the wrong event.
 *  • It never rotates for anyone who asked their OS for reduced motion. They
 *    get the day tabs and nothing moves on its own.
 *  • Touching a tab ends the rotation for good. Explicit user intent outranks
 *    an automatic timer; resuming afterwards would just fight the visitor.
 *
 * The tabs are real buttons in a tablist rather than decorative dots, so the
 * day can be reached by keyboard and read out by a screen reader — an
 * auto-advancing region with no manual control is unusable otherwise.
 */
export function FeaturedDayRotator<T>({
  days,
  locale,
  title,
  todayStr,
  intervalMs = 6000,
  id,
  children,
}: {
  days: FeaturedDay<T>[]
  locale: string
  title: string
  /**
   * Today's date as the server computed it. Tabs are labelled by comparing
   * against this rather than by position, because a day with no programme is
   * dropped before it reaches this component — label by index and the first
   * tab reads "Today" while showing tomorrow's events.
   */
  todayStr: string
  /** Section id, needed to tie tabs to their panel for assistive tech. */
  id: string
  intervalMs?: number
  children: (items: T[], date: string) => ReactNode
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [manual, setManual] = useState(false)
  const [reduced, setReduced] = useState(false)
  const holding = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (days.length < 2 || paused || manual || reduced) return
    const t = setInterval(() => setIndex(i => (i + 1) % days.length), intervalMs)
    return () => clearInterval(t)
  }, [days.length, paused, manual, reduced, intervalMs])

  if (days.length === 0) return null

  const active = days[Math.min(index, days.length - 1)]

  // A finger resting on the grid counts as reading it, same as a cursor.
  const hold = () => { holding.current = true; setPaused(true) }
  const release = () => { holding.current = false; setPaused(false) }

  const dayLabel = (iso: string) => {
    if (todayStr && iso === todayStr) return TODAY[locale] || TODAY.en
    if (todayStr && iso === addDays(todayStr, 1)) return TOMORROW[locale] || TOMORROW.en
    return fmtShortDate(iso, locale)
  }

  return (
    <section
      id={id}
      className="border-t border-black/5 bg-white pb-12 pt-6 text-neutral-900 md:pb-16 md:pt-8"
      onPointerEnter={hold}
      onPointerLeave={release}
      onPointerCancel={release}
      onTouchStart={hold}
      onTouchEnd={release}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => { if (!holding.current) setPaused(false) }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <h3 className="min-w-0 font-serif text-[1.25rem] font-black leading-tight tracking-tight text-neutral-900 sm:text-[1.625rem]">
            {title}
          </h3>
          <span className="hidden h-px flex-1 bg-black/10 sm:block" />
        </div>

        {days.length > 1 && (
          <div
            role="tablist"
            aria-label={PICK_DAY[locale] || PICK_DAY.en}
            className="mb-6 flex flex-wrap gap-2"
          >
            {days.map((d, i) => {
              const on = i === index
              return (
                <button
                  key={d.date}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={`${id}-panel`}
                  onClick={() => { setIndex(i); setManual(true) }}
                  className={
                    'rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors ' +
                    (on
                      ? 'border-ibiza-green bg-ibiza-green text-white'
                      : 'border-black/10 bg-white text-neutral-700 hover:border-ibiza-green hover:text-ibiza-green')
                  }
                >
                  {dayLabel(d.date)}
                </button>
              )
            })}
          </div>
        )}

        <div
          id={`${id}-panel`}
          role="tabpanel"
          // Re-keying on the date remounts the cards, so each day's grid fades
          // in through Reveal instead of swapping in place.
          key={active.date}
        >
          {children(active.items, active.date)}
        </div>
      </div>
    </section>
  )
}
