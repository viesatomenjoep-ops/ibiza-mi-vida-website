// Registers Sentry for whichever runtime this server process is running in.
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

// Reports errors thrown while rendering (the exact class of bug that crashed
// /club-tickets/[slug]/[eventSlug] with an unguarded Supabase call earlier).
// Sentry.init() above is a no-op without a DSN, so this stays harmless too.
export { captureRequestError as onRequestError } from '@sentry/nextjs'
