'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { cloudinaryVideo, optimizeCloudinaryVideo, cloudinaryVideoPoster, MEDIA } from '@/lib/cloudinary'

// Background clips that play one after another, looping (first clip always first).
//
// These are served from our Cloudinary cloud (instant, adaptive delivery). To
// override, set NEXT_PUBLIC_HOME_HERO_VIDEOS to a comma-separated list of
// Cloudinary public ids or full delivery URLs.
function resolveSources(): string[] {
  const configured = process.env.NEXT_PUBLIC_HOME_HERO_VIDEOS
  const ids = configured
    ? configured.split(',').map((s) => s.trim()).filter(Boolean)
    : [...MEDIA.homeHero]
  return ids.map((entry) =>
    entry.startsWith('http') ? optimizeCloudinaryVideo(entry) : cloudinaryVideo(entry),
  )
}

const VIDEOS = resolveSources()
const POSTERS = VIDEOS.map((src) => cloudinaryVideoPoster(src))
// Per-clip framing — clip one sits ~30% higher (crops a bit off the top).
const POSITIONS = ['center 96%', 'center', 'center']

export function HomeHeroVideo({ className, style }: { className?: string; style?: CSSProperties }) {
  const [i, setI] = useState(0)
  // PERF: the first clip is ~3.3MB — by far the heaviest thing on the page. With
  // `preload="auto"` it raced the hero text, fonts and above-the-fold images for
  // bandwidth on mobile. We paint the poster immediately and only attach the
  // video source once the page has finished loading, so the clip uses leftover
  // bandwidth instead of competing with the LCP.
  const [armed, setArmed] = useState(false)
  const next = () => setI(p => (p + 1) % VIDEOS.length)

  useEffect(() => {
    // Respect a user's data-saver / reduced-motion preference: no clip at all.
    const conn = (navigator as any).connection
    if (conn?.saveData) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const arm = () => setArmed(true)
    if (document.readyState === 'complete') {
      const idle = (window as any).requestIdleCallback
      const id = idle ? idle(arm, { timeout: 2000 }) : window.setTimeout(arm, 400)
      return () => (idle ? (window as any).cancelIdleCallback?.(id) : clearTimeout(id))
    }
    window.addEventListener('load', arm, { once: true })
    return () => window.removeEventListener('load', arm)
  }, [])

  return (
    <video
      key={VIDEOS[i]}
      src={armed ? VIDEOS[i] : undefined}
      poster={POSTERS[i]}
      autoPlay
      muted
      loop={false}
      playsInline
      preload="none"
      onEnded={next}
      onClick={next}
      onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 0.66 }}
      onCanPlay={(e) => { e.currentTarget.playbackRate = 0.66; e.currentTarget.play().catch(() => {}) }}
      className={className}
      style={{ ...style, objectPosition: POSITIONS[i] }}
    />
  )
}
