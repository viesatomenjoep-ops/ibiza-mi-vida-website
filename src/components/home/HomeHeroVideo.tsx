'use client'

import { useState, type CSSProperties } from 'react'

// Background clips that play one after another, looping (first clip always first).
const VIDEOS = ['/videos/anyma-1.mp4', '/videos/anyma-2.mp4', '/videos/calvin.mp4']
// Per-clip framing — clip one sits ~30% higher (crops a bit off the top).
const POSITIONS = ['center 80%', 'center', 'center']

export function HomeHeroVideo({ className, style }: { className?: string; style?: CSSProperties }) {
  const [i, setI] = useState(0)
  const next = () => setI(p => (p + 1) % VIDEOS.length)
  return (
    <video
      key={VIDEOS[i]}
      src={VIDEOS[i]}
      autoPlay
      muted
      loop={false}
      playsInline
      preload="auto"
      onEnded={next}
      onClick={next}
      onCanPlay={(e) => { e.currentTarget.play().catch(() => {}) }}
      className={className}
      style={{ ...style, objectPosition: POSITIONS[i] }}
    />
  )
}
