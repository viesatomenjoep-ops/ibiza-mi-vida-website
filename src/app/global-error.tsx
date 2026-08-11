'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

// Root-level fallback — only fires if the root layout itself throws (rare).
// Next.js requires this file to render its own <html>/<body> since it
// replaces the entire app shell when triggered.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[GlobalErrorBoundary]', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0B0C10', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: 16, maxWidth: 420, opacity: 0.65, lineHeight: 1.5 }}>
            Sorry — the page could not be loaded. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ marginTop: 32, borderRadius: 999, background: '#3D6A96', color: '#fff', border: 'none', padding: '14px 28px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 12, cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
