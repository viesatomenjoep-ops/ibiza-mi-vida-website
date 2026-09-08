'use client'

import { useEffect, useRef, useState } from 'react'
import { HOME_ZONES } from '@/lib/home-zones'
import { scrollSectionIntoView } from '@/lib/scroll-to-section'

/**
 * Sticky categorienav boven de vier werelden.
 *
 * Plakt onder de vaste navbar (`top: var(--nav-h)`, niet `top: 0` — die balk
 * staat er al en is zelf `position:fixed`) zolang je binnen de wikkel zit die
 * de vier zones omvat; scrolt die wikkel voorbij, dan schuift deze balk
 * gewoon met de pagina mee weg. De actieve pil volgt welke zone-sectie op dit
 * moment het midden van het scherm raakt.
 */
export function HomeZoneNav({ locale = 'nl' }: { locale?: string }) {
  const [active, setActive] = useState(HOME_ZONES[0].id)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) setActive(en.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    const observeAll = () => HOME_ZONES.forEach(z => {
      const el = document.getElementById(z.id)
      if (el) io.observe(el)
    })
    observeAll()
    // De secties staan onder een lange pagina met lui geladen beeld erboven;
    // een tweede poging nadat de lay-out tot rust is gekomen zorgt dat de
    // waarnemer niet op verouderde posities blijft hangen.
    const t = setTimeout(observeAll, 800)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])

  return (
    <div
      ref={navRef}
      aria-label="Categorieën"
      className="sticky top-[var(--nav-h)] z-40 border-b border-white/[0.08] bg-[rgba(10,10,10,.88)] backdrop-blur-[14px]"
    >
      <div className="mx-auto flex max-w-[1180px] items-center gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center">
        {HOME_ZONES.map(z => {
          const on = active === z.id
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => {
                const el = document.getElementById(z.id)
                const gap = 16 + (navRef.current?.offsetHeight || 0)
                scrollSectionIntoView(el, { gap })
              }}
              aria-current={on ? 'true' : undefined}
              className="flex min-h-[44px] flex-none items-center justify-center whitespace-nowrap rounded-[14px] border px-[18px] py-2.5 font-sans text-[11px] font-black uppercase tracking-[0.12em] text-white transition-colors duration-200"
              style={{
                borderColor: on ? z.accent : 'rgba(255,255,255,.25)',
                background: on ? z.accent : 'rgba(0,0,0,.35)',
              }}
            >
              {z.naam[locale] || z.naam.en}
            </button>
          )
        })}
      </div>
    </div>
  )
}
