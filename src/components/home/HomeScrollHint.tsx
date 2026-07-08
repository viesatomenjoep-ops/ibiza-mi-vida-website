'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const TXT: Record<string, string> = {
  nl: 'Scroll naar beneden', en: 'Scroll down', es: 'Desliza hacia abajo', de: 'Nach unten scrollen', fr: 'Défiler vers le bas',
}

/** A bouncing red "scroll down" arrow + label, just above the dock; fades out on scroll. */
export function HomeScrollHint({ locale = 'nl' }: { locale?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const apply = () => {
      raf = 0
      const o = Math.max(0, Math.min(1, 1 - window.scrollY / 160))
      if (ref.current) { ref.current.style.opacity = String(o); ref.current.style.visibility = o < 0.02 ? 'hidden' : 'visible' }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-x-0 z-[57] flex flex-col items-center gap-1"
      style={{ bottom: 'calc(78px + env(safe-area-inset-bottom))', transition: 'opacity .15s linear' }}
      aria-hidden="true"
    >
      <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
        {TXT[locale] || TXT.en}
      </span>
      <ChevronDown size={26} strokeWidth={2.6} className="animate-bounce" style={{ color: '#E14D68', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
    </div>
  )
}
