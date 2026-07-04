'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const PLAYLIST_ID = '15AK4lfHIRpqQ2ZaggSrCQ'

export function SpotifyButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="spotify-btn"
        aria-label="Ibiza mi Vida Spotify playlist"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        {/* Official Spotify mark */}
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            fill="#1ED760"
            d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.42.24.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.1 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.32-1.32 11.4-1.02 15.9 1.62.54.3.72 1.02.42 1.56-.3.48-1.02.66-1.56.36z"
          />
        </svg>
      </button>

      {open && (
        <div className="spotify-panel" role="dialog" aria-label="Spotify player">
          <div className="spotify-panel-head">
            <span>Ibiza mi Vida · Playlist</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Sluiten" className="spotify-panel-close">
              <X size={16} />
            </button>
          </div>
          <iframe
            title="Ibiza mi Vida Spotify playlist"
            src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            style={{ border: 0 }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </>
  )
}
