'use client'

import { Headphones } from 'lucide-react'
import type { AppArtist } from './types'
import type { AppLabels } from './i18n'
import { optImg } from '@/lib/img'

/** Horizontal artist slider — photo, name, and "plays at <venue>" copy. */
export function ArtistRail({
  artists,
  t,
  onOpen,
}: {
  artists: AppArtist[]
  t: AppLabels
  onOpen: (a: AppArtist) => void
}) {
  if (artists.length === 0) return null
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-black text-white">
        <Headphones size={18} className="text-app-accent-soft" /> {t.onDecks}
      </h2>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {artists.map(a => (
          <button
            key={a.slug}
            type="button"
            onClick={() => onOpen(a)}
            className="group flex w-28 shrink-0 flex-col items-center gap-2 rounded-2xl p-2 text-center outline-none transition-colors motion-reduce:transition-none hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-app-accent-soft active:scale-95 motion-reduce:active:scale-100"
          >
            <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-obsidian-card">
              {a.image ? (
                <img
                  src={optImg(a.image, 160)}
                  loading="lazy"
                  decoding="async"
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105"
                />
              ) : (
                <span className="grid h-full w-full place-items-center font-display text-lg font-black text-white/25">
                  {a.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </span>
            <span className="w-full">
              <span className="block truncate font-display text-[13px] font-extrabold text-white">{a.name}</span>
              {a.venueName && (
                <span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-wide text-white/40">
                  {t.artistAt} {a.venueName}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
