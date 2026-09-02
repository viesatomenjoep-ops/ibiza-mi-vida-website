'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * A thin red bar that fills left → right as you scroll, pinned directly above
 * the fixed "Officiële ticketpartner" bar (.nav-partner-bottom) whenever that
 * bar is visible — and flush with the viewport bottom otherwise. Height is
 * measured live (not hardcoded) so it always tracks the real bar, regardless
 * of what's rendered below it. Updates the DOM directly via rAF (no React
 * re-renders).
 */
export function ScrollProgress() {
  const pathname = usePathname() || ''
  // Homepage only: "/", "/nl", "/en", "/nl/" …
  const isHome = pathname === '/' || /^\/[a-z]{2}\/?$/.test(pathname)

  const wrapRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isHome) return
    let raf = 0
    const apply = () => {
      raf = 0
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      const pct = max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0
      if (barRef.current) barRef.current.style.width = `${pct}%`

      const partnerBar = document.querySelector('.nav-partner-bottom') as HTMLElement | null
      const offset = partnerBar ? partnerBar.getBoundingClientRect().height : 0
      if (wrapRef.current) wrapRef.current.style.bottom = `calc(${offset}px + env(safe-area-inset-bottom))`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // De partnerbalk mount/unmount als je langs de vouw scrolt. Dat ving een
    // setInterval van 400 ms op — vier layout-uitlezingen plus een DOM-query,
    // tweeënhalf keer per seconde, ook als niemand scrolt. Een
    // MutationObserver op de header vuurt alleen wanneer er echt iets
    // verandert.
    const header = document.querySelector('.site-header')
    const mo = header ? new MutationObserver(onScroll) : null
    mo?.observe(header!, { childList: true, subtree: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
      mo?.disconnect()
    }
  }, [isHome])

  if (!isHome) return null

  return (
    <div ref={wrapRef} className="pointer-events-none fixed left-0 z-[56] w-full" style={{ bottom: 'env(safe-area-inset-bottom)', height: '3.6px' }}>
      <div
        ref={barRef}
        className="h-full rounded-r-full"
        style={{ width: '0%', backgroundColor: '#E14D68', transition: 'width 120ms ease-out' }}
      />
    </div>
  )
}
