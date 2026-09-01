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
import { ConsentBanner } from '@/components/consent/ConsentBanner'
import { ConsentScripts } from '@/components/consent/ConsentScripts'
import { getGoogleReviews } from '@/lib/google-reviews'

/**
 * De Google-beoordeling wordt hier opgehaald en niet in de Navbar zelf.
 *
 * Navbar is een client-component ('use client') en getGoogleReviews() is een
 * serverfunctie met een fetch die 24 uur gecachet wordt. Een client-component
 * kan die niet aanroepen, dus komt het cijfer als prop naar beneden. Alleen de
 * twee getallen die de balk nodig heeft — niet het hele object met de
 * reviewteksten, want die zouden dan in de HTML van élke pagina belanden
 * zonder ergens getoond te worden.
 *
 * Is er niets — geen sleutel, geen Place ID, nul reviews, of Google geeft een
 * fout — dan is dit `null` en tekent de balk alleen de partnertekst. Dat is de
 * normale toestand tot GOOGLE_PLACE_ID gezet is, geen storing. Verzinnen mag
 * hier nooit; zie de kop van src/lib/google-reviews.ts voor waarom.
 */
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { locale: string }
}) {
  const { locale } = params;
  const reviews = await getGoogleReviews()
  const rating = reviews ? { value: reviews.rating, count: reviews.total } : null

  return (
    <html lang={locale || 'en'} className={`${inter.variable} ${oswald.variable} ${outfit.variable} ${montserrat.variable}`}>
      <body>
        <CartProvider>
          <Navbar rating={rating} />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ScrollProgress />
          <AttributionCapture />
          <AiReferralTagger />
          {/* Google Analytics en Impact stonden hierboven onvoorwaardelijk in
              de <head> en draaiden dus bij iedereen vanaf de eerste pixel.
              Ze worden nu pas geladen na toestemming — zie
              components/consent/ConsentScripts.tsx. */}
          <ConsentScripts />
          <ConsentBanner locale={locale} />
        </CartProvider>
      </body>
    </html>
  )
}
