// This file configures the initialization of Sentry on the client (browser).
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn,
  enabled: !!dsn, // no-ops entirely until a DSN is configured — zero risk without one
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  // Low sample rate — this is a marketing/booking site, not a debugging tool;
  // we only need enough traces to spot real regressions, not every pageview.
  tracesSampleRate: 0.1,
  // Capture a replay for a small % of sessions, and always for ones with an error.
  replaysSessionSampleRate: 0.02,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false })],
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
