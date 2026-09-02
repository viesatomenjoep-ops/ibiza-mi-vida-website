'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { fmtShortDate } from '@/lib/date-label'

export interface FeaturedDay<T> {
  /** ISO yyyy-mm-dd. */
  date: string
  items: T[]
}

const TODAY: Record<string, string> = {
  nl: 'Vandaag', en: 'Today', de: 'Heute', es: 'Hoy', fr: "Aujourd'hui",
}
const PICK_DAY: Record<string, string> = {
  nl: 'Kies een dag', en: 'Pick a day', de: 'Tag wählen',
  es: 'Elige un día', fr: 'Choisir un jour',
}
const SCOPE_DAY: Record<string, string> = {
  nl: 'Dag', en: 'Day', de: 'Tag', es: 'Día', fr: 'Jour',
}
const SCOPE_WEEK: Record<string, string> = {
  nl: 'Week', en: 'Week', de: 'Woche', es: 'Semana', fr: 'Semaine',
}
const SCOPE_MONTH: Record<string, string> = {
  nl: 'Maand', en: 'Month', de: 'Monat', es: 'Mes', fr: 'Mois',
}
const MORE: Record<string, string> = {
  nl: 'Bekijk de hele agenda', en: 'See the full calendar', de: 'Ganzen Kalender ansehen',
  es: 'Ver la agenda completa', fr: "Voir l'agenda complet",
}
/** "30 van 68 getoond" — nooit stilzwijgend afkappen. */
const shownOf = (n: number, total: number, locale: string) =>
  ({
    nl: `${n} van ${total} getoond`,
    en: `showing ${n} of ${total}`,
    de: `${n} von ${total} angezeigt`,
    es: `${n} de ${total} mostrados`,
    fr: `${n} sur ${total} affichés`,
  } as Record<string, string>)[locale] || `showing ${n} of ${total}`

const WEEKDAYS: Record<string, string[]> = {
  nl: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  de: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
  es: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  fr: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
}

/** Weekdagletter + dagnummer, zonder Date-parsing-verrassingen op Safari. */
function dagDelen(iso: string, locale: string) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1))
  const letters = WEEKDAYS[locale] || WEEKDAYS.en
  return { letter: letters[dt.getUTCDay()], nummer: String(d) }
}

/**
 * Dagkiezer voor de uitgelichte stroken op de homepage.
 *
 * ── Wat hier niet werkte ──────────────────────────────────────────────────
 * De dagen stonden als losse pillen in een `flex-wrap`. Met vier dagen viel de
 * vierde al op een tweede regel; met zeven werd het een blok van twee regels
 * dat meer ruimte kostte dan de events eronder. En de pillen zeiden "vr 4 sep",
 * wat je moet lézen — terwijl elke telefoon je heeft geleerd dat een dag een
 * letter is met een cijfer eronder.
 *
 * ── Wat het nu is ────────────────────────────────────────────────────────
 * Eén rij van zeven dagtegels (weekdagletter boven het dagnummer), horizontaal
 * veegbaar met scroll-snap, in de vorm die iOS zelf gebruikt. Daarboven een
 * segmentkiezer Dag / Week / Maand.
 *
 * Over die derde knop zit een keuze: de homepage heeft zeven dagen aan
 * programma in huis, geen maand. "Maand" tovert dus geen data tevoorschijn die
 * er niet is — het is een link naar de volledige agenda, waar de maand wél
 * staat. Een knop die belooft een maand te tonen en dan zeven dagen laat zien,
 * is een leugen met een animatie eromheen.
 *
 * In weekstand staan alle dagen onder elkaar. Dat kunnen zeventig kaarten zijn;
 * we tonen er ten hoogste dertig en zetten er in cijfers bij hoeveel er niet
 * getoond worden, met de agenda-link ernaast. Stilzwijgend afkappen leest als
 * "dit is alles".
 *
 * De regels die een automatisch draaiend blok leefbaar houden blijven staan:
 * hij stopt zolang je hem aanwijst, hij draait niet bij prefers-reduced-motion,
 * en zodra je zelf een dag kiest is het afgelopen met draaien. In weekstand
 * draait er sowieso niets.
 */
export function FeaturedDayRotator<T>({
  days,
  locale,
  title,
  todayStr,
  intervalMs = 6000,
  id,
  calendarHref,
  weekMax = 30,
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
  /** Waar "Maand" en "bekijk de hele agenda" heen wijzen. */
  calendarHref: string
  /** Hoeveel kaarten de weekstand maximaal toont. */
  weekMax?: number
  children: (items: T[], date: string) => ReactNode
}) {
  const [index, setIndex] = useState(0)
  const [week, setWeek] = useState(false)
  const [paused, setPaused] = useState(false)
  const [manual, setManual] = useState(false)
  const [reduced, setReduced] = useState(false)
  const holding = useRef(false)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (week || days.length < 2 || paused || manual || reduced) return
    const t = setInterval(() => setIndex(i => (i + 1) % days.length), intervalMs)
    return () => clearInterval(t)
  }, [week, days.length, paused, manual, reduced, intervalMs])

  // De gekozen dag in beeld schuiven, ook als de rij breder is dan het scherm.
  useEffect(() => {
    if (week) return
    const strip = stripRef.current
    const knop = strip?.querySelector<HTMLElement>('[data-actief="1"]')
    if (!strip || !knop) return
    const doel = knop.offsetLeft - (strip.clientWidth - knop.clientWidth) / 2
    strip.scrollTo({ left: Math.max(0, doel), behavior: reduced ? 'auto' : 'smooth' })
  }, [index, week, reduced])

  const alleItems = useMemo(() => days.flatMap(d => d.items), [days])

  if (days.length === 0) return null

  const active = days[Math.min(index, days.length - 1)]
  const weekItems = alleItems.slice(0, weekMax)

  // A finger resting on the grid counts as reading it, same as a cursor.
  const hold = () => { holding.current = true; setPaused(true) }
  const release = () => { holding.current = false; setPaused(false) }

  const segment = (aan: boolean) =>
    'flex-1 rounded-full px-4 py-1.5 text-center text-[11px] font-black uppercase tracking-widest transition-colors ' +
    (aan ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800')

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
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <h3 className="min-w-0 font-serif text-[1.25rem] font-black leading-tight tracking-tight text-neutral-900 sm:text-[1.625rem]">
            {title}
          </h3>
          <span className="hidden h-px flex-1 bg-black/10 sm:block" />
        </div>

        {days.length > 1 && (
          <>
            {/* Segmentkiezer in de vorm die iOS gebruikt: een grijze goot met
                één witte pil die verspringt. */}
            <div className="mb-3 flex w-full max-w-[320px] items-center gap-1 rounded-full bg-neutral-100 p-1">
              <button
                type="button"
                onClick={() => setWeek(false)}
                aria-pressed={!week}
                className={segment(!week)}
              >
                {SCOPE_DAY[locale] || SCOPE_DAY.en}
              </button>
              <button
                type="button"
                onClick={() => { setWeek(true); setManual(true) }}
                aria-pressed={week}
                className={segment(week)}
              >
                {SCOPE_WEEK[locale] || SCOPE_WEEK.en}
              </button>
              {/* Geen knop maar een link: de maand staat op de agendapagina,
                  niet hier. Zie de toelichting bovenaan dit bestand. */}
              <Link href={calendarHref} className={segment(false)}>
                {SCOPE_MONTH[locale] || SCOPE_MONTH.en}
              </Link>
            </div>

            {!week && (
              <div
                ref={stripRef}
                role="tablist"
                aria-label={PICK_DAY[locale] || PICK_DAY.en}
                className="hide-scrollbar -mx-4 mb-6 flex snap-x snap-proximity gap-2 overflow-x-auto px-4 pb-1"
              >
                {days.map((d, i) => {
                  const on = i === index
                  const { letter, nummer } = dagDelen(d.date, locale)
                  const vandaag = Boolean(todayStr) && d.date === todayStr
                  return (
                    <button
                      key={d.date}
                      type="button"
                      role="tab"
                      data-actief={on ? '1' : '0'}
                      aria-selected={on}
                      aria-controls={`${id}-panel`}
                      aria-label={vandaag ? (TODAY[locale] || TODAY.en) : fmtShortDate(d.date, locale)}
                      onClick={() => { setIndex(i); setManual(true) }}
                      className={
                        'flex h-[58px] w-[52px] shrink-0 snap-center flex-col items-center justify-center rounded-2xl border transition-colors ' +
                        (on
                          ? 'border-ibiza-green bg-ibiza-green text-white'
                          : 'border-black/10 bg-white text-neutral-700 hover:border-ibiza-green')
                      }
                    >
                      <span className={'text-[10px] font-black uppercase tracking-widest ' + (on ? 'text-white/80' : 'text-neutral-400')}>
                        {letter}
                      </span>
                      <span className="font-serif text-lg font-black leading-none">{nummer}</span>
                      <span aria-hidden className={'mt-[3px] h-1 w-1 rounded-full ' + (vandaag ? (on ? 'bg-white' : 'bg-ibiza-green') : 'bg-transparent')} />
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}

        <div
          id={`${id}-panel`}
          role="tabpanel"
          // Re-keying on the date remounts the cards, so each day's grid fades
          // in through Reveal instead of swapping in place.
          key={week ? 'week' : active.date}
        >
          {week ? children(weekItems, days[0].date) : children(active.items, active.date)}
        </div>

        {week && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={calendarHref}
              className="inline-flex items-center gap-2 rounded-full border-2 border-black/10 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black transition-colors hover:border-black"
            >
              {MORE[locale] || MORE.en}
              <span aria-hidden>↗</span>
            </Link>
            {alleItems.length > weekItems.length && (
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                {shownOf(weekItems.length, alleItems.length, locale)}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
