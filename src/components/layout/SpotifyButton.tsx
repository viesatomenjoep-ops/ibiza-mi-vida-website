'use client'

import { useState, useRef, useEffect } from 'react'

const PLAYLIST_ID = '15AK4lfHIRpqQ2ZaggSrCQ'

// Small round Spotify icon (same size as the language pills) that lives in the menu footer.
// Tap to open the playlist — the panel unfolds UPWARD so it never runs off the bottom.
export function SpotifyButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className={`fs-spotify${open ? ' is-open' : ''}`} ref={ref}>
      {open && (
        <div className="fs-spotify-panel">
          <iframe
            title="Ibiza mi Vida Spotify playlist"
            src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            style={{ border: 0, display: 'block', borderRadius: '16px' }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
      <button
        type="button"
        className="fs-spotify-btn"
        aria-expanded={open}
        aria-label="Ibiza mi Vida · Spotify playlist"
        onClick={() => setOpen(o => !o)}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            fill="#1ED760"
            d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.42.24.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.1 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.32-1.32 11.4-1.02 15.9 1.62.54.3.72 1.02.42 1.56-.3.48-1.02.66-1.56.36z"
          />
        </svg>
      </button>
    </div>
  )
}
