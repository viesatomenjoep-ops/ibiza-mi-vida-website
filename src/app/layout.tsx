import type { Metadata } from 'next'
import { Marcellus, Mulish } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFAB } from '@/components/layout/WhatsAppFAB'
import { BookingProvider } from '@/context/booking-context'
import { CartProvider } from '@/context/cart-context'
import { CartDrawer } from '@/components/ui/CartDrawer'
import '@/styles/globals.css'
import './ibiza-design.css'

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
  display: 'swap',
})

const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-mulish',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'),
  title: {
    default: 'Ibiza mi vida — Ibiza Events, Club Tickets & Private Boat Charters',
    template: '%s | Ibiza mi vida',
  },
  description:
    'Book Ibiza club tickets, private boat charters, boat parties, VIP catamarans and Formentera trips with Ibiza mi vida — your premium Ibiza events agency.',
  keywords: [
    'Ibiza events',
    'Ibiza club tickets',
    'private boat charter Ibiza',
    'Ibiza boat party',
    'VIP catamaran Ibiza',
    'Formentera boat trip',
    'Ibiza mi vida',
  ],
  openGraph: {
    siteName: 'Ibiza mi vida',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${marcellus.variable} ${mulish.variable}`}>
      <body className="font-sans antialiased overflow-x-clip w-full max-w-[100vw]">
        <CartProvider>
          <BookingProvider>
            <Navbar />
            <main id="main-content">
              {children}
            </main>
            <Footer />
            <WhatsAppFAB />
            <CartDrawer />
          </BookingProvider>
        </CartProvider>
      </body>
    </html>
  )
}
