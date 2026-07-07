'use client'

import { useEffect, useState } from 'react'

function randOther(len: number, cur: number) {
  if (len < 2) return 0
  let n = cur
  while (n === cur) n = Math.floor(Math.random() * len)
  return n
}

/** One tile that keeps swapping to a random yacht photo with a soft fade. */
function YachtTile({ pool, delay }: { pool: string[]; delay: number }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * pool.length))
  useEffect(() => {
    if (pool.length < 2) return
    const id = setInterval(() => setIdx(i => randOther(pool.length, i)), 2600 + delay)
    return () => clearInterval(id)
  }, [pool.length, delay])
  return (
    <div
      className="fs-ytile"
      role="button"
      tabIndex={0}
      aria-label="Yacht"
      onClick={() => setIdx(i => randOther(pool.length, i))}
    >
      {/* key forces a remount so the fade-in animation replays on every change */}
      <img key={idx} src={pool[idx]} alt="" loading="lazy" />
    </div>
  )
}

/**
 * Five yacht-photo tiles across the full width of the menu, each cycling through
 * random yacht images on its own rhythm with a soft fade — images only, no text,
 * with thin divider lines between them. Flush against the category line above.
 */
export function MenuYachtSlider({ images }: { images: string[] }) {
  if (images.length === 0) return null
  return (
    <div className="fs-yachts">
      {Array.from({ length: 5 }, (_, i) => (
        <YachtTile key={i} pool={images} delay={i * 480} />
      ))}
    </div>
  )
}
