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
  /**
   * Site-eigendom aantonen bij zoekmachines.
   *
   * Bing wil bewijs dat wij over www.ibizamivida.com gaan. De XML-methode
   * vraagt om een bestand in de webroot, wat bij een Next-app op Vercel een
   * commit en een deploy kost voor iets wat één regel tekst is. De metatag
   * doet hetzelfde en staat hier, zodat het via een omgevingsvariabele kan --
   * geen code-wijziging nodig als de sleutel ooit verandert.
   *
   * Zet BING_SITE_VERIFICATION in Vercel op de waarde uit "HTML Meta Tag" in
   * Bing Webmaster Tools (het deel achter content=). Zonder die variabele
   * rendert er niets: een lege verificatietag is erger dan geen tag, want
   * Bing leest hem dan als een mislukte poging.
   */
  ...(process.env.BING_SITE_VERIFICATION
    ? { verification: { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } } }
    : {}),
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
import { Analytics } from '@vercel/analytics/next'
import { getGoogleReviews } from '@/lib/google-reviews'
import { getVenues } from '@/lib/clubtickets'

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
  const [reviews, venues] = await Promise.all([getGoogleReviews(), getVenues(locale)])
  const rating = reviews ? { value: reviews.rating, count: reviews.total } : null
  // Boten en activiteiten voor het footermozaïek. getVenues() cachet per
  // Node-proces en wordt op de meeste pagina's toch al aangeroepen, dus dit
  // kost de layout geen tweede parse van de feed. Alleen de URL's gaan mee.
  // De footerachtergrond is een muur van clublogo's.
  //
  // Er stonden bootfoto's en excursiefoto's; die zijn mooi maar zeggen niets.
  // De logo's van Ushuaia, Hi, [UNVRS], Eden en Ibiza Rocks zijn wel meteen
  // herkenbaar, en dat is precies wat een achtergrond op 6% dekking moet doen:
  // in een oogopslag zeggen waar deze site over gaat, zonder de tekst erboven
  // in de weg te zitten.
  //
  // `whitelogo` en niet `logo`: de venues in deze feed hebben helemaal geen
  // `logo`-veld (geteld: 0 van de 15 clubs), wel een witte variant (15 van de
  // 15). Wit op een witte footer is niets, dus de footer keert ze om naar
  // zwart -- zie Footer.tsx.
  const clubLogos = venues
    .filter(v => (v.type?.slug || '') === 'clubbing')
    .map(v => v.whitelogo)
    .filter((u): u is string => !!u)
  // De footer toont er ook de bron-link bij, dus die krijgt url mee.
  const footerRating = reviews ? { rating: reviews.rating, total: reviews.total, url: reviews.url } : null

  return (
    <html lang={locale || 'en'} className={`${inter.variable} ${oswald.variable} ${outfit.variable} ${montserrat.variable}`}>
      <body>
        <CartProvider>
          <Navbar rating={rating} />
          <main id="main-content">
            {children}
          </main>
          <Footer rating={footerRating} clubLogos={clubLogos} />
          <CartDrawer />
          <ScrollProgress />
          <AttributionCapture />
          <AiReferralTagger />
          {/* Google Analytics en Impact stonden hierboven onvoorwaardelijk in
              de <head> en draaiden dus bij iedereen vanaf de eerste pixel.
              Ze worden nu pas geladen na toestemming — zie
              components/consent/ConsentScripts.tsx. */}
          <ConsentScripts />
          {/* Vercel Analytics, bewust NIET achter de cookiebanner.
              ── Waarom dat mag ──────────────────────────────────────────────
              Google Analytics hierboven zit er wel achter, en terecht: dat zet
              een identifier op het apparaat en deelt gegevens met een derde.
              Vercel Analytics doet geen van beide -- geen cookie, geen
              localStorage, geen vingerafdruk, geen profiel dat je tussen sites
              volgt. Er is dus niets om toestemming voor te vragen; de
              ePrivacy-regel gaat over opslaan en uitlezen op het apparaat.
              ── Waarom dit ernaast staat en GA niet vervangt ────────────────
              GA telt alleen bezoekers die op "Accepteren" klikken, en dat is in
              de praktijk de helft tot tweederde. Dit telt iedereen, en is
              daarmee het enige eerlijke antwoord op "hoeveel mensen waren er".
              GA blijft voor het diepere werk: welke bron, welk pad, welke
              boeking. */}
          <Analytics />
          <ConsentBanner locale={locale} />
        </CartProvider>
      </body>
    </html>
  )
}
