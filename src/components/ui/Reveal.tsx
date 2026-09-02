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
  // PERF: will-change stond permanent op elk onthuld element. Elke Reveal op
  // de homepage bleef daardoor een eigen compositorlaag — tientallen lagen
  // vol tekst, die iOS bij geheugendruk wazig of dubbel tekent (het
  // "spookbeeld" op de koppen). Na de overgang gaat will-change eraf.
  const [settled, setSettled] = useState(false)

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

  useEffect(() => {
    if (!shown) return
    // transitionend vuurt niet als het element buiten beeld staat of de
    // browser de overgang overslaat; de timer is de bodem.
    const t = setTimeout(() => setSettled(true), 2600 + delay + 100)
    return () => clearTimeout(t)
  }, [shown, delay])

  return (
    <Tag
      ref={ref}
      className={className}
      {...rest}
      onTransitionEnd={() => setSettled(true)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: settled ? undefined : `opacity 2.6s cubic-bezier(.16,.7,.3,1) ${delay}ms, transform 2.6s cubic-bezier(.16,.7,.3,1) ${delay}ms`,
        willChange: settled ? undefined : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}
