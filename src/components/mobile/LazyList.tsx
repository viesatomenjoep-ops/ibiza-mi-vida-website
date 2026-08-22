'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Incremental list renderer: mounts the first `initial` children, then grows
 * by `step` as the user approaches the end. Keeps long feeds (hundreds of
 * event cards) from mounting — and firing hundreds of image requests — in one
 * burst, which is what made scrolling stutter.
 *
 * Growth is detected two ways, deliberately redundant: an IntersectionObserver
 * on a sentinel AND a passive scroll/resize listener doing a rect check. Some
 * embedded webviews ship an IntersectionObserver that never delivers entries
 * (observed in testing) — the scroll fallback guarantees the list still grows
 * there, while costing nothing where IO works (both paths share one guard).
 */
export function LazyList({
  children,
  initial = 10,
  step = 10,
}: {
  children: React.ReactNode[]
  initial?: number
  step?: number
}) {
  const [visible, setVisible] = useState(initial)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const total = children.length
  const done = visible >= total

  const grow = useCallback(() => {
    const el = sentinelRef.current
    if (!el) return
    if (el.getBoundingClientRect().top < window.innerHeight + 600) {
      setVisible(v => Math.min(total, v + step))
    }
  }, [total, step])

  useEffect(() => {
    if (done) return
    const el = sentinelRef.current
    if (!el) return

    let io: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        entries => { if (entries.some(e => e.isIntersecting)) grow() },
        { rootMargin: '600px 0px' },
      )
      io.observe(el)
    }

    // Throttle with a timer, NOT requestAnimationFrame: rAF (and IO) are
    // suspended entirely in hidden/backgrounded tabs and some webviews, and
    // this fallback exists precisely for those environments.
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      setTimeout(() => { ticking = false; grow() }, 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Initial check: if the sentinel is already near the viewport on mount
    // (short first page), grow immediately without waiting for a scroll.
    grow()

    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [done, grow])

  return (
    <>
      {children.slice(0, visible)}
      {!done && <div ref={sentinelRef} className="h-px" aria-hidden />}
    </>
  )
}
