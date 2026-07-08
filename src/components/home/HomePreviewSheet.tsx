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
  // Oval (upward-arc) top only when opened at the very top of the homepage.
  const [atTop, setAtTop] = useState(false)
  useEffect(() => {
    if (selected) {
      setShownKey(selected); setShownImg(image)
      setAtTop(typeof window !== 'undefined' && window.scrollY < 40)
    }
  }, [selected, image])

  const open = !!selected
  const cat = HOME_CATEGORIES.find(c => c.key === shownKey) || null

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-x-0 bottom-0 z-[54] overflow-hidden bg-transparent"
      style={{
        // At the top of the page the image opens all the way up to the navbar with a
        // straight top; when scrolled it's a shorter slide-up.
        height: atTop ? 'calc(100svh - var(--nav-h))' : '54svh',
        transform: open ? 'translateY(0)' : 'translateY(112%)',
        transition: 'transform .6s cubic-bezier(.16,.72,.24,1)',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {cat && (
        <>
          {/* Image layer — straight top */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ boxShadow: '0 -22px 50px rgba(0,0,0,0.4)' }}
          >
          {shownImg ? (
            <img key={`${cat.key}-${shownImg}`} src={shownImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: cat.bg }} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45" />
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-30 grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Category label + CTA — kept high in the image, always visible. The
              container itself passes clicks through (so the × stays clickable);
              only the pill + button are interactive. */}
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center" style={{ paddingBottom: DOCK_CLEARANCE }}>
            <span
              className="mb-2.5 inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 font-serif text-[10px] font-black uppercase tracking-wide sm:text-[11px]"
              style={{ backgroundColor: cat.bg, color: cat.fg }}
            >
              {cat.label[locale] || cat.label.en}
            </span>
            <Link
              href={`${base}${cat.href}`}
              className="hps-cta group pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-wide text-black shadow-xl transition-transform active:scale-95 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
            >
              {cat.allLabel[locale] || cat.allLabel.en}
              <ArrowRight size={14} strokeWidth={2.6} className="transition-transform duration-200 group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
