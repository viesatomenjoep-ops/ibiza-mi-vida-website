'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo } from 'react'
import type { PickerEvent } from '@/lib/picker-event'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowCircle } from '@/components/ui/ArrowCircle'

/**
 * "Tonight on Ibiza" — the day's actual line-up, above the fold-ish.
 *
 * Why it exists: the homepage showed a generic "featured events" grid with no
 * sense of time, so nothing on the page said *today*. A dated, counted list is
 * the strongest honest urgency signal available — it is simply true, it changes
 * every day (which is also a freshness signal for crawlers), and it gives an
 * answer engine something concrete to quote.
 *
 * `todayStr` is passed in from the server rather than computed here: deriving
 * it from `new Date()` on the client would disagree with the server render in
 * any timezone where the date has already rolled over, which is a hydration
 * mismatch. If nothing is on tonight we fall back to the next night that has
 * events and say so, rather than rendering an empty or dishonest section.
 */
export function HomeTonight({
  events,
  todayStr,
  locale = 'nl',
  base,
}: {
  events: PickerEvent[]
  /** Server-rendered ISO yyyy-mm-dd for "today". */
  todayStr: string
  locale?: string
  base: string
}) {
  const { day, list, isTonight } = useMemo(() => {
    if (!events.length) return { day: '', list: [] as PickerEvent[], isTonight: false }
    // events arrive sorted ascending and already filtered to >= today, so the
    // first date present is either today or the next night with a line-up.
    const day = events[0].date
    return {
      day,
      list: events.filter((e) => e.date === day).slice(0, 8),
      isTonight: day === todayStr,
    }
  }, [events, todayStr])

  if (!list.length) return null

  const heading = isTonight ? t(TONIGHT, locale) : t(NEXT_UP, locale)
  const dateLabel = formatDay(day, locale)

  return (
    <section className="border-t border-black/5 bg-white py-10 text-neutral-900 md:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-gold">
              <span className="live-dot" aria-hidden />
              {heading}
            </span>
            <h2 className="mt-2 font-serif text-[1.625rem] font-black tracking-tight md:text-3xl">
              {dateLabel}
            </h2>
            <p className="mt-1 text-sm text-black/60">
              {t(COUNT, locale).replace('{n}', String(list.length))}
            </p>
          </div>
          <Link
            href={`${base}/calendar`}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-black/10 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-neutral-900 transition-colors hover:border-black"
          >
            {t(ALL, locale)}
            <ArrowCircle size={22} iconSize={13} className="bg-transparent" />
          </Link>
        </Reveal>

        <div className="tonight-rail">
          {list.map((e, i) => (
            <Reveal
              key={e.id}
              delay={i * 70}
              as={Link as any}
              href={e.href}
              className="tonight-card group"
            >
              <div className="tonight-media">
                {/* src is the raw URL on purpose: next/image runs the optimizer
                    itself, so passing an optImg() result nests the optimizer
                    inside itself (/_next/image?url=/_next/image?url=...), which
                    fails to decode and renders an empty box. */}
                {e.image ? (
                  <Image
                    src={e.image}
                    alt={e.eventName}
                    fill
                    sizes="(max-width: 768px) 70vw, 260px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                  />
                ) : (
                  <div className="h-full w-full bg-ibiza-mint" />
                )}
                <span className="tonight-club">{e.clubName}</span>
              </div>
              <div className="tonight-body">
                <strong className="tonight-name">{e.eventName}</strong>
                {e.lineUp ? <span className="tonight-lineup">{e.lineUp}</span> : null}
                <span className="tonight-foot">
                  {e.price > 0 ? (
                    <span className="tonight-price">
                      {t(FROM, locale)} €{e.price}
                    </span>
                  ) : (
                    <span />
                  )}
                  <ArrowCircle size={32} iconSize={15} className="bg-ibiza-mint text-ibiza-green group-hover:bg-ibiza-green group-hover:text-white" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

type L = Record<string, string>
const t = (m: L, locale: string) => m[locale] || m.en

const TONIGHT: L = {
  nl: 'Vanavond op Ibiza', en: 'Tonight on Ibiza', de: 'Heute Abend auf Ibiza', es: 'Esta noche en Ibiza', fr: 'Ce soir à Ibiza',
}
const NEXT_UP: L = {
  nl: 'Eerstvolgende avond', en: 'Next night out', de: 'Nächster Abend', es: 'La próxima noche', fr: 'Prochaine soirée',
}
const COUNT: L = {
  nl: '{n} events open om te boeken', en: '{n} events open to book', de: '{n} Events buchbar', es: '{n} eventos disponibles', fr: '{n} événements réservables',
}
const ALL: L = {
  nl: 'Hele agenda', en: 'Full calendar', de: 'Ganzer Kalender', es: 'Agenda completa', fr: 'Agenda complet',
}
const FROM: L = { nl: 'vanaf', en: 'from', de: 'ab', es: 'desde', fr: 'dès' }

const LOCALE_TAG: Record<string, string> = {
  nl: 'nl-NL', en: 'en-GB', de: 'de-DE', es: 'es-ES', fr: 'fr-FR',
}

/** `2026-07-12` -> `Zondag 12 juli`. Parsed as UTC so it never shifts a day. */
function formatDay(iso: string, locale: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const dt = new Date(Date.UTC(y, m - 1, d))
  const s = dt.toLocaleDateString(LOCALE_TAG[locale] || 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
  })
  return s.charAt(0).toUpperCase() + s.slice(1)
}
