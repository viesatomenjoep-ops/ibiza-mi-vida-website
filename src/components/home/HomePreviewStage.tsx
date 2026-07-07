'use client'

import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import { HOME_CATEGORIES, type CatKey } from './homeCategories'

// Height reserved at the bottom so nothing hides behind the fixed selector dock.
const DOCK_CLEARANCE = 92

export function HomePreviewStage({
  base,
  locale,
  selected,
  image,
  headline,
  subline,
  onClose,
}: {
  base: string
  locale: string
  selected: CatKey | null
  image: string
  headline: string
  subline: string
  onClose: () => void
}) {
  const cat = HOME_CATEGORIES.find(c => c.key === selected) || null

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Default resting state — the tagline in black */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-500 ${cat ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
        style={{ paddingBottom: DOCK_CLEARANCE }}
      >
        <span className="font-serif text-[1.625rem] font-black leading-none tracking-tight text-neutral-900">
          Ibiza Mi Vida
        </span>
        <h2 className="mt-2.5 max-w-3xl font-serif text-[2.25rem] font-black leading-[1.05] text-black sm:text-[2.7rem] md:text-[3.5rem]">
          {headline}
        </h2>
        <p className="mt-3.5 max-w-2xl text-[1.2rem] font-bold leading-snug text-black/70 sm:text-[1.3rem] md:text-[1.5rem]">
          {subline}
        </p>
      </div>

      {/* Selected state — full-bleed random image + "see all" button */}
      {cat && (
        <div key={`${cat.key}-${image}`} className="hps-fade absolute inset-0">
          {image ? (
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: cat.bg }} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

          {/* Close back to the tagline */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Category label + CTA button, clear of the dock */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-5 text-center" style={{ paddingBottom: DOCK_CLEARANCE }}>
            <span
              className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-serif text-[11px] font-black uppercase tracking-wide"
              style={{ backgroundColor: cat.bg, color: cat.fg }}
            >
              {cat.label[locale] || cat.label.en}
            </span>
            <Link
              href={`${base}${cat.href}`}
              className="hps-cta group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-wide text-black shadow-xl transition-transform active:scale-95"
            >
              {cat.allLabel[locale] || cat.allLabel.en}
              <ArrowRight size={16} strokeWidth={2.6} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
