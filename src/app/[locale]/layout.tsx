import type { Metadata } from 'next'
import { Inter, Oswald, Outfit, Montserrat } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { AttributionCapture } from '@/components/AttributionCapture'
import { SITE_URL, SITE_NAME, TWITTER_HANDLE } from '@/lib/seo'

import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ibiza mi vida — Ibiza Events, Club Tickets & Private Boat Charters',
    template: '%s | Ibiza mi vida',
  },
  description:
    'Book Ibiza club tickets, private boat charters, boat parties, VIP catamarans and Formentera trips with Ibiza mi vida — your premium Ibiza events agency.',
  applicationName: SITE_NAME,
  keywords: [
    'Ibiza', 'Ibiza tickets', 'Ibiza club tickets', 'Ibiza events', 'Ibiza clubs',
    'boat party Ibiza', 'private boat charter Ibiza', 'Formentera ferry', 'Ushuaïa', 'Hï Ibiza',
    'Pacha', 'Amnesia', 'VIP tables Ibiza', 'Ibiza guestlist',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: 'Ibiza mi vida — Ibiza Events, Club Tickets & Private Boat Charters',
    description:
      'Book Ibiza club tickets, private boat charters, boat parties, VIP catamarans and Formentera trips with Ibiza mi vida.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: 'Ibiza mi vida — Ibiza Events, Club Tickets & Private Boat Charters',
    description: 'Ibiza club tickets, private boat charters, boat parties and Formentera trips.',
    images: ['/og-default.jpg'],
  },
}

import { CartProvider } from '@/context/cart-context'
import { CartDrawer } from '@/components/ui/CartDrawer'
import { AiReferralTagger } from '@/components/AiReferralTagger'

export default function RootLayout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: { locale: string }
}) {
  const { locale } = params;

  return (
    <html lang={locale || 'en'} className={`${inter.variable} ${oswald.variable} ${outfit.variable} ${montserrat.variable}`}>
      <head>
        {/*
          Impact (impact.com) affiliate tracking.

          Rendered as a raw inline tag rather than through next/script on
          purpose. Impact verifies site ownership by fetching the homepage and
          looking for this snippet in the HTML; next/script with
          `afterInteractive` injects it only after hydration, so a verification
          crawler that does not run JavaScript would not find it and the check
          would fail.

          The cost is small: the inline part only appends an async <script>, so
          nothing here blocks rendering.

          Two things this does beyond counting visits, both worth knowing:
          `transformLinks` rewrites outbound links on the page to carry Impact's
          tracking, and `trackImpression` fires on load. Impact's own dialog
          states the captured data may be shared with advertisers, and this site
          currently has no consent mechanism — see the privacy policy before
          relying on it for EU traffic.
        */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7702481-c71c-450b-a591-dc158e54c54e1.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`,
          }}
        />

        {/*
          Google Analytics 4 (gtag.js), property G-QQ9CRE658P.

          Kept as raw inline tags in <head> for the same reason as the Impact
          snippet above: it lands in the server-rendered HTML immediately,
          without waiting for hydration. The external loader is async, so it
          does not block rendering.
        */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QQ9CRE658P"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-QQ9CRE658P');`,
          }}
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ScrollProgress />
          <AttributionCapture />
          <AiReferralTagger />
        </CartProvider>
      </body>
    </html>
  )
}
