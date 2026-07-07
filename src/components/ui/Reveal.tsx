'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Elegant scroll-reveal: fades + glides up when it enters the viewport (once).
 * `delay` (ms) staggers siblings. Has a safety timeout so content is never stuck hidden.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 26,
  as: Tag = 'div',
  ...rest
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  as?: any
  [key: string]: any
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setShown(true); return }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    const safety = setTimeout(() => setShown(true), 1600) // never stay hidden
    return () => { io.disconnect(); clearTimeout(safety) }
  }, [])

  return (
    <Tag
      ref={ref}
      className={className}
      {...rest}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity .7s cubic-bezier(.21,.5,.32,1) ${delay}ms, transform .7s cubic-bezier(.21,.5,.32,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}
