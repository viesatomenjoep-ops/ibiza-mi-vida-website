'use client'

import { useEffect, useState, type CSSProperties } from 'react'

// Three background clips that play one after another, looping.
const VIDEOS = ['/videos/calvin.mp4', '/videos/anyma-1.mp4', '/videos/anyma-2.mp4']

export function HomeHeroVideo({ className, style }: { className?: string; style?: CSSProperties }) {
  // Deterministic first frame (avoids an SSR/hydration mismatch); pick a random
  // starting clip on the client after mount.
  const [i, setI] = useState(0)
  useEffect(() => { setI(Math.floor(Math.random() * VIDEOS.length)) }, [])
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
