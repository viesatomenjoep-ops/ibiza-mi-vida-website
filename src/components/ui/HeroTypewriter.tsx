'use client'

import React, { useEffect, useState } from 'react'

interface HeroTypewriterProps {
  title: string
  subtitle: string
}

// Classes kept identical between the invisible "ghost" (reserves layout so
// there is zero layout shift) and the animated overlay.
const H1_CLASS =
  'text-white text-lg sm:text-5xl md:text-5xl lg:text-[5rem] font-medium font-serif uppercase tracking-tight drop-shadow-lg leading-[1.05]'
const SUB_CLASS =
  'block font-serif font-normal text-base sm:text-lg md:text-xl lg:text-2xl mt-4 tracking-tight leading-snug text-white/90'

export function HeroTypewriter({ title, subtitle }: HeroTypewriterProps) {
  const [titleText, setTitleText] = useState('')
  const [subText, setSubText] = useState('')
  // 'title' -> typing title, 'sub' -> typing subtitle, 'done' -> finished
  const [phase, setPhase] = useState<'title' | 'sub' | 'done'>('title')

  useEffect(() => {
    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const type = (
      text: string,
      setter: (v: string) => void,
      speed: number,
      onDone?: () => void
    ) => {
      let i = 0
      const step = () => {
        if (cancelled) return
        i++
        setter(text.slice(0, i))
        if (i < text.length) {
          timeouts.push(setTimeout(step, speed))
        } else {
          onDone?.()
        }
      }
      timeouts.push(setTimeout(step, speed))
    }

    // Reset each mount so the effect replays every time the page opens.
    setTitleText('')
    setSubText('')
    setPhase('title')

    timeouts.push(
      setTimeout(() => {
        type(title, setTitleText, 95, () => {
          setPhase('sub')
          timeouts.push(
            setTimeout(() => {
              type(subtitle, setSubText, 42, () => setPhase('done'))
            }, 320)
          )
        })
      }, 300)
    )

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [title, subtitle])

  const Caret = ({ small = false }: { small?: boolean }) => (
    <span
      aria-hidden
      className="hero-caret"
      style={{
        display: 'inline-block',
        width: small ? '0.06em' : '0.05em',
        height: '0.9em',
        marginLeft: '0.06em',
        marginBottom: small ? '-0.05em' : '-0.08em',
        background: 'currentColor',
        verticalAlign: 'baseline',
      }}
    />
  )

  return (
    <div className="relative w-full">
      <style>{`
        @keyframes heroCaretBlink { 0%, 45% { opacity: 1 } 50%, 95% { opacity: 0 } 100% { opacity: 1 } }
        .hero-caret { animation: heroCaretBlink 1s steps(1) infinite; }
      `}</style>

      {/* Ghost — reserves exact layout, invisible & non-interactive */}
      <h1 aria-hidden className={`${H1_CLASS} invisible pointer-events-none select-none`}>
        {title}
        <span className={SUB_CLASS}>{subtitle}</span>
      </h1>

      {/* Animated overlay */}
      <h1
        className={`${H1_CLASS} absolute inset-0`}
        aria-label={`${title}. ${subtitle}`}
      >
        <span aria-hidden>
          {titleText}
          {phase === 'title' && <Caret />}
        </span>
        <span className={SUB_CLASS} aria-hidden>
          {subText}
          {(phase === 'sub' || phase === 'done') && <Caret small />}
        </span>
      </h1>
    </div>
  )
}
