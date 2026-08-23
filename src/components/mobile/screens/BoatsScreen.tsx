'use client'

import { Anchor, Users } from 'lucide-react'
import type { AppBoat } from '../types'
import type { AppLabels } from '../i18n'
import { optImg } from '@/lib/img'

export function BoatsScreen({
  boats,
  t,
  onOpen,
}: {
  boats: AppBoat[]
  t: AppLabels
  onOpen: (b: AppBoat) => void
}) {
  return (
    <div className="px-4" style={{ paddingTop: '16px' }}>
      <h1 className="font-display text-2xl font-black text-white">{t.boatsTitle}</h1>
      <p className="mt-1 mb-5 text-[13px] text-white/50">{t.boatsSubtitle}</p>

      <div className="grid grid-cols-2 gap-3">
        {boats.map(b => (
          <button
            key={b.slug}
            type="button"
            onClick={() => onOpen(b)}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-obsidian-card text-left outline-none transition-all motion-reduce:transition-none hover:border-white/20 focus-visible:ring-2 focus-visible:ring-gold-soft active:scale-[0.97] motion-reduce:active:scale-100"
          >
            <span className="relative h-28 w-full overflow-hidden bg-obsidian">
              {b.image && (
                <img
                  src={optImg(b.image, 384)}
                  loading="lazy"
                  decoding="async"
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105"
                />
              )}
              <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                <Users size={10} /> {b.pax}
              </span>
            </span>
            <span className="flex flex-col gap-0.5 p-3">
              <span className="truncate font-display text-[14px] font-extrabold text-white">{b.name}</span>
              <span className="truncate text-[11px] font-semibold text-white/45">{b.marina}</span>
              <span className="mt-1 font-display text-[15px] font-black text-gold-soft">
                €{b.priceFrom}<span className="text-[11px] font-bold text-white/40">{t.perDay}</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {boats.length === 0 && (
        <p className="mt-8 flex flex-col items-center gap-2 rounded-3xl border border-white/[0.07] bg-obsidian-card p-10 text-center text-[14px] font-semibold text-white/40">
          <Anchor size={20} className="text-white/20" />
          {t.noResults}
        </p>
      )}
    </div>
  )
}
