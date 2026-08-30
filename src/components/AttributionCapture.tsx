'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/attribution'

/**
 * Records first-touch attribution once per session.
 *
 * Renders nothing and runs in an effect after paint, so it cannot affect LCP —
 * which matters here, because getting the hero to paint fast took real work and
 * a synchronous storage read on every page would chip away at it.
 *
 * Mounted once in the locale layout rather than per page: `captureAttribution`
 * is a no-op after the first call in a session, so re-running it on client-side
 * navigations costs nothing and guarantees we catch the landing page whichever
 * route the visitor arrives on.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution()
  }, [])
  return null
}
