'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import { HOME_CATEGORIES, type CatKey } from './homeCategories'

// Clearance so the CTA never hides behind the fixed selector dock.
const DOCK_CLEARANCE = 104

/**
 * A fixed panel that glides up from above the selector dock and shows a random,
 * half-page image for the chosen category — works at any scroll position on the
 * homepage. Closing (or the dock toggling off) glides it back down smoothly.
 */
export function HomePreviewSheet({
  base,
  locale,
  selected,
  image,
  onClose,
}: {
  base: string
  locale: string
  selected: CatKey | null
  image: string
  onClose: () => void
}) {
  // Keep the last shown content mounted while sliding out.
  const [shownKey, setShownKey] = useState<CatKey | null>(selected)
  const [shownImg, setShownImg] = useState(image)
  useEffect(() => {
    if (selected) { setShownKey(selected); setShownImg(image) }
  }, [selected, image])

  const open = !!selected
  const cat = HOME_CATEGORIES.find(c => c.key === shownKey) || null

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-x-0 bottom-0 z-[54] overflow-hidden bg-black"
      style={{
        height: '68svh',
        transform: open ? 'translateY(0)' : 'translateY(112%)',
        transition: 'transform .6s cubic-bezier(.16,.72,.24,1)',
        boxShadow: open ? '0 -22px 50px rgba(0,0,0,0.4)' : 'none',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {cat && (
        <>
          {shownImg ? (
            <img key={`${cat.key}-${shownImg}`} src={shownImg} alt="" className="hps-fade absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: cat.bg }} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Category label + CTA — kept high in the image so it's always visible,
              and vertically centred above the dock on every device */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center" style={{ paddingBottom: DOCK_CLEARANCE }}>
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
        </>
      )}
    </div>
  )
}
