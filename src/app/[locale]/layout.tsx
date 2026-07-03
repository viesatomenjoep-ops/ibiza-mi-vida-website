import type { Metadata } from 'next'
import { Inter, Oswald, Outfit } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFAB } from '@/components/layout/WhatsAppFAB'
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ibizamivida.com'),
  title: {
    default: 'Ibiza mi vida — Ibiza Events, Club Tickets & Private Boat Charters',
    template: '%s | Ibiza mi vida',
  },
  description:
    'Book Ibiza club tickets, private boat charters, boat parties, VIP catamarans and Formentera trips with Ibiza mi vida — your premium Ibiza events agency.',
}

import { CartProvider } from '@/context/cart-context'
import { CartDrawer } from '@/components/ui/CartDrawer'

export default function RootLayout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: { locale: string }
}) {
  const { locale } = params;

  return (
    <html lang={locale || 'en'} className={`${inter.variable} ${oswald.variable} ${outfit.variable}`}>
      <body>
        <CartProvider>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <WhatsAppFAB />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
