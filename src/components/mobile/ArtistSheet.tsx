'use client'

import { MapPin, ArrowRight } from 'lucide-react'
import type { AppArtist } from './types'
import type { AppLabels } from './i18n'
import { optImg } from '@/lib/img'
import { ctLink } from '@/lib/ct-link'

export function ArtistSheet({ artist: a, t, locale }: { artist: AppArtist; t: AppLabels; locale: string }) {
  return (
    <div className="flex flex-col gap-5 pt-1">
      <div className="flex items-center gap-4">
        <span className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-obsidian-card">
          {a.image ? (
            <img src={optImg(a.image, 160)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center font-display text-2xl font-black text-white/25">
              {a.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-display text-2xl font-black text-white">{a.name}</h2>
          {a.venueName && (
            <span className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-white/55">
              <MapPin size={13} className="shrink-0 text-gold-soft" /> {a.venueName}
            </span>
          )}
        </div>
      </div>

      {a.href && (
        <a
          href={ctLink(a.href, locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-gold/25 outline-none transition-colors motion-reduce:transition-none hover:bg-gold-soft focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97] motion-reduce:active:scale-100"
        >
          {t.tickets} <ArrowRight size={16} />
        </a>
      )}
    </div>
  )
}
