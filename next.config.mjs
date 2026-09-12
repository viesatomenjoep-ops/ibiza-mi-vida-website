import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion', '@supabase/supabase-js'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 dagen cache voor geoptimaliseerde beelden
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|webp|avif|woff2|woff)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
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
