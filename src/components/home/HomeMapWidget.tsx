'use client'

import { useEffect, useRef, useState } from 'react'
import { Maximize2, X } from 'lucide-react'

const LABELS: Record<string, { open: string; close: string; hint: string }> = {
  nl: { open: 'Kaart vergroten', close: 'Kaart sluiten', hint: 'Tik op een club — bekijk de locatie op de kaart' },
  en: { open: 'Enlarge map', close: 'Close map', hint: 'Tap a club — see its location on the map' },
  es: { open: 'Ampliar mapa', close: 'Cerrar mapa', hint: 'Toca un club — ve su ubicación en el mapa' },
  de: { open: 'Karte vergrößern', close: 'Karte schließen', hint: 'Tippe auf einen Club — sieh den Standort' },
  fr: { open: 'Agrandir la carte', close: 'Fermer la carte', hint: 'Touchez un club — voir sa position' },
}

/**
 * The Ibiza clubs map lives in a standalone HTML widget (public/ibiza-kaart.html).
 * On the homepage it sits compact, with a button to grow it to a full view and
 * collapse it back — so it never overwhelms the page.
 */
export function HomeMapWidget({ locale = 'nl' }: { locale?: string }) {
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)
  const secRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const t = LABELS[locale] || LABELS.en

  useEffect(() => {
    const m = () => setMobile(window.innerWidth < 720)
    m()
    window.addEventListener('resize', m)
    return () => window.removeEventListener('resize', m)
  }, [])

  // Zoom/pan is only allowed once the map is opened; collapsed it stays a
  // click-to-navigate overview (so the page keeps scrolling normally).
  const postInteractive = (on: boolean) => {
    frameRef.current?.contentWindow?.postMessage({ type: 'ibz-interactive', on }, '*')
  }
  useEffect(() => { postInteractive(open) }, [open])

  // Compact by default; grows to a full view when opened.
  const height = open ? (mobile ? 760 : 680) : (mobile ? 500 : 440)

  return (
    <section ref={secRef} id="ibiza-map-section" className="w-full bg-[#EFEDEA]">
      <div className="relative mx-auto w-full max-w-6xl">
        <iframe
          ref={frameRef}
          src="/ibiza-kaart.html"
          title="Ibiza clubs map"
          loading="lazy"
          onLoad={() => postInteractive(open)}
          className="block w-full border-0 transition-[height] duration-500 ease-out"
          style={{ height }}
        />
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-[#1B1917] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#EFEDEA] shadow-lg transition-transform hover:-translate-y-0.5"
        >
          {open ? <X size={15} /> : <Maximize2 size={15} />}
          {open ? t.close : t.open}
        </button>
      </div>
    </section>
  )
}
