import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'

import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

// Companion app surface: same content as the marketing site, different chrome.
// noindex so it never competes with the canonical locale pages in search.
export const metadata: Metadata = {
  title: 'Ibiza Mi Vida — App',
  description: 'Ibiza events, club tickets, guestlist and VIP concierge — in your pocket.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0B0C10',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function MobileAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      style={{ ['--font-display' as string]: 'Outfit, sans-serif' }}
    >
      {/* overscroll-none kills the browser rubber-band so the shell feels native;
          overflow-x-clip guards against accidental horizontal scroll on 375px. */}
      <body className="bg-obsidian text-white antialiased [overscroll-behavior-y:none] overflow-x-clip selection:bg-gold/30">
        {children}
      </body>
    </html>
  )
}
