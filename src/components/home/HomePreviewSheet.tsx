'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
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
  onAdvance,
}: {
  base: string
  locale: string
  selected: CatKey | null
  image: string
  onClose: () => void
  onAdvance?: () => void
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
      className="fixed inset-x-0 bottom-0 z-[54] overflow-hidden bg-transparent"
      style={{
        // Always opens all the way up to the navbar, filling the screen.
        height: 'calc(100svh - var(--nav-h))',
        transform: open ? 'translateY(0)' : 'translateY(112%)',
        transition: 'transform .6s cubic-bezier(.16,.72,.24,1)',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {cat && (
        <>
          {/* Image layer — straight top; the full image fits inside the frame
              (centred, never cropped) */}
          <div
            className="absolute inset-0 cursor-pointer overflow-hidden bg-black"
            style={{ boxShadow: '0 -22px 50px rgba(0,0,0,0.4)' }}
            onClick={onAdvance}
            role="button"
            aria-label="Next"
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
            {/* Just the (black) category label — 50% bigger, and it links to the page */}
            <Link
              href={`${base}${cat.href}`}
              className="hps-cta pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-serif text-[15px] font-black uppercase tracking-wide shadow-xl transition-transform active:scale-95 sm:text-[17px]"
              style={{ backgroundColor: cat.bg, color: cat.fg }}
            >
              {cat.label[locale] || cat.label.en}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
