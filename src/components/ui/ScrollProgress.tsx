'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * A thin category-red bar pinned just under the navbar that fills left → right as
 * you scroll. Updates the DOM directly via rAF (no React re-renders) so scrolling
 * stays smooth.
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
      const header = document.querySelector('.site-header') as HTMLElement | null
      if (header && wrapRef.current) wrapRef.current.style.top = `${Math.round(header.getBoundingClientRect().bottom)}px`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [isHome])

  if (!isHome) return null

  return (
    <div ref={wrapRef} className="pointer-events-none fixed left-0 z-[80] w-full" style={{ top: 'var(--nav-h)', height: '3.6px' }}>
      <div
        ref={barRef}
        className="h-full rounded-r-full"
        style={{ width: '0%', backgroundColor: '#E14D68', transition: 'width 120ms ease-out', boxShadow: '0 0 10px rgba(225,77,104,0.7)' }}
      />
    </div>
  )
}
