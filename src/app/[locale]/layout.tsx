import type { Metadata } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFAB } from '@/components/layout/WhatsAppFAB'
import { BookingProvider } from '@/context/booking-context'
import { getVenues } from '@/lib/clubtickets'
import { CartProvider } from '@/context/cart-context'
import { CartDrawer } from '@/components/ui/CartDrawer'
import '@/styles/globals.css'
import './ibiza-design.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
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

export default async function RootLayout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: { locale: string }
}) {
  const { locale } = params;

  // Fetch venues and extract a list of unique top artists/events for the menu
  const venues = await getVenues(locale || 'en')
  
  const allEvents = venues.flatMap(v => v.events ? v.events.map(e => ({
    ...e,
    venueSlug: v.slug
  })) : [])
  
  // Filter out events without good images and deduplicate by name
  const uniqueArtistsMap = new Map()
  for (const event of allEvents) {
    if ((event.cover || event.logo) && !uniqueArtistsMap.has(event.name)) {
      uniqueArtistsMap.set(event.name, {
        id: event.id,
        name: event.name,
        slug: event.slug,
        image: event.logo || event.cover,
        href: `/club-tickets/${event.venueSlug}/${event.slug}`
      })
    }
  }
  
  // Get top 15 artists for the menu
  const artists = Array.from(uniqueArtistsMap.values()).slice(0, 15)

  return (
    <html lang={locale || 'en'} className={`${inter.variable} ${outfit.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased overflow-x-clip w-full max-w-[100vw] bg-[#0A0A0A] text-[#F4F4F5]">
        <CartProvider>
          <BookingProvider>
            <Navbar artists={artists} />
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
