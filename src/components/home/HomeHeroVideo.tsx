'use client'

import { useState, type CSSProperties } from 'react'

// Background clips that play one after another, looping (first clip always first).
const VIDEOS = ['/videos/anyma-1.mp4', '/videos/anyma-2.mp4', '/videos/calvin.mp4']

export function HomeHeroVideo({ className, style }: { className?: string; style?: CSSProperties }) {
  const [i, setI] = useState(0)
  return (
    <video
      key={VIDEOS[i]}
      src={VIDEOS[i]}
      autoPlay
      muted
      loop={false}
      playsInline
      preload="auto"
      onEnded={() => setI(p => (p + 1) % VIDEOS.length)}
      onCanPlay={(e) => { e.currentTarget.play().catch(() => {}) }}
      className={className}
      style={style}
    />
  )
}
