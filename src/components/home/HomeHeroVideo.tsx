'use client'

import { useState, type CSSProperties } from 'react'
import { cloudinaryVideo, optimizeCloudinaryVideo, cloudinaryVideoPoster } from '@/lib/cloudinary'

// Background clips that play one after another, looping (first clip always first).
//
// To serve these from Cloudinary (instant, adaptive delivery instead of the
// heavy local .mp4 files), set NEXT_PUBLIC_HOME_HERO_VIDEOS to a comma-separated
// list of Cloudinary public ids or full delivery URLs, e.g.
//   NEXT_PUBLIC_HOME_HERO_VIDEOS="home/anyma-1,home/anyma-2,home/calvin"
// When unset, we fall back to the bundled /videos/*.mp4 files.
const LOCAL_VIDEOS = ['/videos/anyma-1.mp4', '/videos/anyma-2.mp4', '/videos/calvin.mp4']

function resolveSources(): string[] {
  const configured = process.env.NEXT_PUBLIC_HOME_HERO_VIDEOS
  if (!configured) return LOCAL_VIDEOS
  return configured
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) =>
      entry.startsWith('http')
        ? optimizeCloudinaryVideo(entry)
        : cloudinaryVideo(entry),
    )
}

const VIDEOS = resolveSources()
const POSTERS = VIDEOS.map((src) => cloudinaryVideoPoster(src))
// Per-clip framing — clip one sits ~30% higher (crops a bit off the top).
const POSITIONS = ['center 96%', 'center', 'center']

export function HomeHeroVideo({ className, style }: { className?: string; style?: CSSProperties }) {
  const [i, setI] = useState(0)
  const next = () => setI(p => (p + 1) % VIDEOS.length)
  return (
    <video
      key={VIDEOS[i]}
      src={VIDEOS[i]}
      poster={POSTERS[i]}
      autoPlay
      muted
      loop={false}
      playsInline
      preload="auto"
      onEnded={next}
      onClick={next}
      onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.66 }}
      onCanPlay={(e) => { e.currentTarget.playbackRate = 0.66; e.currentTarget.play().catch(() => {}) }}
      className={className}
      style={{ ...style, objectPosition: POSITIONS[i] }}
    />
  )
}
