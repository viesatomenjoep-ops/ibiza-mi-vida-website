'use client'

import { useEffect, useState } from 'react'

/**
 * Fills the empty space in the fullscreen menu (below the category bars, above
 * the language selector) with a crossfading slider of yacht photos — images
 * only, no text. Auto-advances, and a tap jumps quickly to the next photo.
 */
export function MenuYachtSlider({ images }: { images: string[] }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(() => setI(p => (p + 1) % images.length), 3500)
    return () => clearInterval(id)
  }, [images.length])

  if (images.length === 0) return null

  return (
    <div
      className="fs-yachts"
      role="button"
      tabIndex={0}
      aria-label="Yachts"
      onClick={() => setI(p => (p + 1) % images.length)}
    >
      {images.map((src, idx) => (
        <img key={src + idx} src={src} alt="" loading="lazy" className={idx === i ? 'is-active' : ''} />
      ))}
    </div>
  )
}
