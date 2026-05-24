import type { Metadata } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFAB } from '@/components/layout/WhatsAppFAB'
import { BookingProvider } from '@/context/booking-context'
import { BookingModal } from '@/components/booking/BookingModal'
import '@/styles/globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
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
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="font-sans bg-ibiza-sand text-velvet-obsidian antialiased overflow-x-hidden w-full max-w-[100vw]">
        <BookingProvider>
          <Navbar />
          <main id="main-content" className="pb-16 lg:pb-0">
            {children}
          </main>
          <Footer />
          <WhatsAppFAB />
          <BookingModal />
        </BookingProvider>
      </body>
    </html>
  )
}
