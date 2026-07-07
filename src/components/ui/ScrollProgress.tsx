'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * A thin category-red bar pinned to the very bottom of the screen (under the
 * official-partner strip) that fills from left → right as you scroll the page,
 * reaching a full bar at the bottom. Empties again as you scroll back up.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0)
  const pathname = usePathname() || ''
  // Homepage only: "/", "/nl", "/en", "/nl/" …
  const isHome = pathname === '/' || /^\/[a-z]{2}\/?$/.test(pathname)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setPct(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const iv = setInterval(update, 500) // catch late-loading content that changes page height
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); clearInterval(iv) }
  }, [])

  if (!isHome) return null

  return (
    <div className="pointer-events-none fixed left-0 z-[80] h-[6px] w-full" style={{ top: 'var(--nav-h)' }}>
      <div
        className="h-full rounded-r-full"
        style={{ width: `${pct}%`, backgroundColor: '#E14D68', transition: 'width 120ms ease-out', boxShadow: '0 0 10px rgba(225,77,104,0.7)' }}
      />
    </div>
  )
}
