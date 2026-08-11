import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin.html',
      },
    ]
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
}

// Always wrap — needed for server/edge instrumentation wiring and (once
// credentials exist) sourcemap upload. The client is wired separately via the
// special instrumentation-client.ts file, auto-detected by Next.js itself.
// Without SENTRY_AUTH_TOKEN the plugin simply skips the sourcemap-upload step
// (org/project/authToken all undefined) rather than failing the build.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  widenClientFileUpload: true,
  webpack: { treeshake: { removeDebugLogging: true } },
  // Don't let a missing/invalid auth token break local dev or a build that
  // hasn't been given Sentry credentials yet.
  telemetry: false,
})
