'use client'

import { MapPin, Clock, Headphones } from 'lucide-react'
import type { AppEvent } from './types'
import type { AppLabels } from './i18n'
import { optImg } from '@/lib/img'

const MONTHS: Record<string, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  fr: ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'],
}

export function shortDate(iso: string, locale: string): string {
  const [, m, d] = iso.split('-').map(Number)
  const months = MONTHS[locale] || MONTHS.en
  return `${d} ${months[(m || 1) - 1]}`
}

/**
 * The tactical list card: cover left, facts right, price pinned top-right.
 * Date/time/venue read as a compact fact column — no prose, no decoration.
 */
export function EventCard({
  event: e,
  t,
  locale,
  onOpen,
  hero = false,
  eager = false,
}: {
  event: AppEvent
  t: AppLabels
  locale: string
  onOpen: (e: AppEvent) => void
  hero?: boolean
  /** true for the first above-the-fold cards so their covers load immediately */
  eager?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(e)}
      // content-visibility lets the browser skip layout/paint for off-screen
      // cards entirely — with hundreds of rows this is what keeps scroll smooth.
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 112px' }}
      className="group relative flex w-full items-stretch gap-4 overflow-hidden rounded-3xl border border-white/[0.07] bg-obsidian-card p-3 text-left outline-none transition-all motion-reduce:transition-none hover:border-white/20 focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-[0.985] motion-reduce:active:scale-100"
    >
      {/* Cover */}
      <span className={`relative shrink-0 overflow-hidden rounded-2xl bg-obsidian ${hero ? 'h-28 w-28' : 'h-[88px] w-[88px]'}`}>
        {e.cover ? (
          <img
            src={optImg(e.cover, 256)}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105"
          />
        ) : (
          <span className="grid h-full w-full place-items-center font-display text-lg font-black text-white/20">
            {e.venueName.slice(0, 3).toUpperCase()}
          </span>
        )}
      </span>

      {/* Facts */}
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5">
        <span className="truncate pr-14 font-display text-[17px] font-extrabold leading-tight text-white">
          {e.name}
        </span>
        <span className="flex items-center gap-1.5 truncate text-[13px] font-semibold text-white/55">
          <MapPin size={13} className="shrink-0 text-gold-soft" />
          <span className="truncate">{e.venueName}</span>
        </span>
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white/55">
          <Clock size={13} className="shrink-0 text-gold-soft" />
          {shortDate(e.date, locale)}{e.time ? ` · ${e.time}` : ''}
        </span>
        {hero && e.lineUp && (
          <span className="mt-0.5 flex items-center gap-1.5 truncate text-[12px] text-white/40">
            <Headphones size={12} className="shrink-0" />
            <span className="truncate">{e.lineUp}</span>
          </span>
        )}
      </span>

      {/* Price chip */}
      {e.price > 0 && (
        <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[12px] font-black text-white shadow-lg">
          €{e.price}
        </span>
      )}
    </button>
  )
}
