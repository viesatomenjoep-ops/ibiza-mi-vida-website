'use client'

import { useState, type CSSProperties } from 'react'

// Three background clips that play one after another, looping.
const VIDEOS = ['/videos/calvin.mp4', '/videos/anyma-1.mp4', '/videos/anyma-2.mp4']

export function HomeHeroVideo({ className, style }: { className?: string; style?: CSSProperties }) {
  // Start on a random clip so it varies between visits.
  const [i, setI] = useState(() => Math.floor(Math.random() * VIDEOS.length))
  return (
    <video
      key={VIDEOS[i]}
      src={VIDEOS[i]}
      autoPlay
      muted
      playsInline
      preload="auto"
      onEnded={() => setI(p => (p + 1) % VIDEOS.length)}
      className={className}
      style={style}
    />
  )
}
