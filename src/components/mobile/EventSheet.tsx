'use client'

import { MapPin, Clock, Headphones, Martini, ArrowRight } from 'lucide-react'
import type { AppEvent } from './types'
import type { AppLabels } from './i18n'
import { optImg } from '@/lib/img'
import { ctLink } from '@/lib/ct-link'
import { waLink, WA_BOOKINGS } from './config'
import { shortDate } from './EventCard'

/** Event detail inside the bottom sheet: cover, facts, lineup, dual CTA. */
export function EventSheet({
  event: e,
  venueLogo = '',
  t,
  locale,
}: {
  event: AppEvent
  /** looked up from `venues` by the shell — not shipped per event */
  venueLogo?: string
  t: AppLabels
  locale: string
}) {
  const drinksMsg = `Hi Ibiza Mi Vida! I'd like to save on drinks for ${e.name} at ${e.venueName} on ${e.date}. What are the options?`

  return (
    <div className="flex flex-col gap-5 pt-1">
      {/* Cover */}
      {e.cover && (
        <div className="relative -mx-1 overflow-hidden rounded-2xl">
          <img src={optImg(e.cover, 828)} alt={e.name} className="h-48 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-light/90 via-transparent to-transparent" aria-hidden />
          {/* Logo badge only for .png logos — the brightness-0 treatment needs
              transparency; an opaque jpg would render as a solid black block. */}
          {venueLogo && /\.png(\?|$)/i.test(venueLogo) && (
            <span className="absolute bottom-3 left-3 grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-white/95 p-1.5 shadow-lg">
              <img src={optImg(venueLogo, 96)} alt="" decoding="async" className="max-h-full max-w-full object-contain brightness-0" />
            </span>
          )}
        </div>
      )}

      <div>
        <span className="mb-2 inline-block rounded-full bg-app-accent/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-app-accent-soft">
          Event
        </span>
        <h2 className="font-display text-[26px] font-black leading-tight text-white">{e.name}</h2>
      </div>

      {/* Facts */}
      <div className="flex flex-col gap-2.5 rounded-2xl border border-white/[0.07] bg-obsidian-card p-4">
        <span className="flex items-center gap-2.5 text-[15px] font-semibold text-white/85">
          <MapPin size={16} className="shrink-0 text-app-accent-soft" /> {e.venueName}
        </span>
        <span className="flex items-center gap-2.5 text-[15px] font-semibold text-white/85">
          <Clock size={16} className="shrink-0 text-app-accent-soft" />
          {shortDate(e.date, locale)}{e.time ? ` · ${e.time}` : ''}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between rounded-2xl border border-app-accent/25 bg-app-accent/[0.08] px-4 py-3.5">
        <span className="text-[14px] font-bold uppercase tracking-wider text-white/60">{t.price}</span>
        <span className="font-display text-2xl font-black text-white">
          {e.price > 0 ? <>€{e.price}</> : <span className="text-[15px] font-bold text-white/70">{t.tickets}</span>}
        </span>
      </div>

      {/* Lineup */}
      {e.lineUp && (
        <div>
          <h3 className="mb-2 font-display text-[15px] font-extrabold uppercase tracking-wider text-white/50">{t.lineup}</h3>
          <p className="flex items-start gap-2.5 rounded-2xl border border-white/[0.07] bg-obsidian-card p-4 text-[14px] leading-relaxed text-white/80">
            <Headphones size={16} className="mt-0.5 shrink-0 text-app-accent-soft" />
            <span>{e.lineUp}</span>
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="mt-1 grid grid-cols-2 gap-3">
        <a
          href={waLink(WA_BOOKINGS, drinksMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-3.5 text-[13px] font-extrabold uppercase tracking-wide text-white outline-none transition-colors motion-reduce:transition-none hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-[0.97] motion-reduce:active:scale-100"
        >
          <Martini size={16} className="shrink-0 text-app-accent-soft" /> {t.saveOnDrinks}
        </a>
        {e.affLink ? (
          <a
            href={ctLink(e.affLink, locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-app-accent px-4 py-3.5 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-app-accent/25 outline-none transition-colors motion-reduce:transition-none hover:bg-app-accent-soft focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97] motion-reduce:active:scale-100"
          >
            {t.tickets} <ArrowRight size={16} className="shrink-0" />
          </a>
        ) : (
          <span className="flex items-center justify-center rounded-full bg-white/5 px-4 py-3.5 text-[13px] font-extrabold uppercase tracking-wide text-white/30">
            {t.tickets}
          </span>
        )}
      </div>
    </div>
  )
}
