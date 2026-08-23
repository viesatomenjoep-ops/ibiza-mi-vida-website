'use client'

import { MapPin, Users, MessageCircle } from 'lucide-react'
import type { AppBoat } from './types'
import type { AppLabels } from './i18n'
import { optImg } from '@/lib/img'
import { waLink, WA_BOOKINGS } from './config'

export function BoatSheet({ boat: b, t }: { boat: AppBoat; t: AppLabels }) {
  const msg = `Hi Ibiza Mi Vida! I'd like to book the ${b.name} (${b.model}) — please send availability and pricing.`
  return (
    <div className="flex flex-col gap-5 pt-1">
      {b.image && (
        <div className="-mx-1 overflow-hidden rounded-2xl">
          <img src={optImg(b.image, 828)} alt={b.name} className="h-48 w-full object-cover" />
        </div>
      )}

      <div>
        <span className="mb-2 inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-soft">
          {b.model}
        </span>
        <h2 className="font-display text-[26px] font-black leading-tight text-white">{b.name}</h2>
      </div>

      <div className="flex flex-col gap-2.5 rounded-2xl border border-white/[0.07] bg-obsidian-card p-4">
        <span className="flex items-center gap-2.5 text-[15px] font-semibold text-white/85">
          <MapPin size={16} className="shrink-0 text-gold-soft" /> {b.marina}
        </span>
        <span className="flex items-center gap-2.5 text-[15px] font-semibold text-white/85">
          <Users size={16} className="shrink-0 text-gold-soft" /> {b.pax} {t.pax}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-gold/25 bg-gold/[0.08] px-4 py-3.5">
        <span className="text-[14px] font-bold uppercase tracking-wider text-white/60">{t.from}</span>
        <span className="font-display text-2xl font-black text-white">€{b.priceFrom}<span className="text-[13px] font-bold text-white/50">{t.perDay}</span></span>
      </div>

      <a
        href={waLink(WA_BOOKINGS, msg)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-gold/25 outline-none transition-colors motion-reduce:transition-none hover:bg-gold-soft focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97] motion-reduce:active:scale-100"
      >
        <MessageCircle size={16} /> {t.requestBoat}
      </a>
    </div>
  )
}
