'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * A thin red bar pinned just above the five-tab dock that fills left → right as
 * you scroll. Updates the DOM directly via rAF (no React re-renders).
 */
export function ScrollProgress() {
  const pathname = usePathname() || ''
  // Homepage only: "/", "/nl", "/en", "/nl/" …
  const isHome = pathname === '/' || /^\/[a-z]{2}\/?$/.test(pathname)

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
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [isHome])

  if (!isHome) return null

  return (
    <div className="pointer-events-none fixed left-0 z-[56] w-full" style={{ bottom: 'calc(70px + env(safe-area-inset-bottom))', height: '3.6px' }}>
      <div
        ref={barRef}
        className="h-full rounded-r-full"
        style={{ width: '0%', backgroundColor: '#E14D68', transition: 'width 120ms ease-out' }}
      />
    </div>
  )
}
