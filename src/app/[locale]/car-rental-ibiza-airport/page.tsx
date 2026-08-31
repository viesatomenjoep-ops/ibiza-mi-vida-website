import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { WIBER_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600
const LOCALE: Locale = 'en'
const PAGE_KEY = 'car-rental-ibiza-airport'
const perDay = RENTAL_PRICES.carPerDay.amount

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Car Rental at Ibiza Airport (IBZ)',
    description:
      'Collecting a hire car at Ibiza Airport: the Wiber office five minutes away at km 5, the free shuttle, and what to do after a late or delayed landing.',
    alternates: localizedAlternates('car-rental-airport', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Car Rental at Ibiza Airport (IBZ)',
      description: 'The pick-up flow at Ibiza Airport: free shuttle, five minutes to the desk, contactless collection.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Car rental at Ibiza Airport' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Car rental Ibiza', path: 'car-rental-ibiza' },
  { name: 'Ibiza Airport' },
]

const FAQS: Faq[] = [
  { q: 'Is the rental desk inside Ibiza Airport?', a: 'Not for Wiber. The office is five minutes away on the Ctra. Aeropuerto at km 5 in Sant Josep, reached by a free shuttle from the terminal. That sounds like a downside and in August it is the opposite: the off-airport desks move faster than the in-terminal queue when three flights land together.' },
  { q: 'Where do I find the shuttle?', a: 'Outside arrivals, at the shuttle pick-up area rather than the taxi rank. The run to the office takes about five minutes. Send us your flight number and we make sure the office knows when you are landing, which matters most on the late evening arrivals.' },
  { q: 'What if my flight is delayed?', a: 'Tell us the flight number when you book and a delay handles itself — the office tracks the arrival rather than the booked time. What causes problems is an unannounced change of flight, so message us if you rebook. Landing after a long delay with nobody expecting you is the one scenario worth avoiding.' },
  { q: 'What do I need to bring to collect the car?', a: 'A credit card in the main driver\'s name, the driving licence itself, and photo ID. The credit card is the one people get caught by: a debit card, or a card belonging to a partner, is refused, and there is no way around it at the desk at midnight.' },
  { q: 'How long does pick-up take?', a: 'With contactless collection the paperwork is done before you arrive, so it is a key handover rather than a counter appointment — usually under fifteen minutes including the shuttle. The comparison worth making is with an in-terminal queue in August, which regularly runs past an hour.' },
  { q: 'Can I drop the car off outside opening hours?', a: 'Ask when you book, because it depends on the date and the return time rather than being a blanket yes or no. Early-morning departures are the common case and are normally arranged. What you must not do is assume it and leave the keys somewhere: an unreturned car stays your responsibility.' },
]

export default function CarRentalAirportPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Car rental at Ibiza Airport',
        description: 'All-inclusive car rental collected five minutes from Ibiza Airport with a free shuttle and contactless pick-up.',
        brand: 'Wiber Rent a Car', price: perDay, path: 'car-rental-ibiza-airport',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Car Rental at Ibiza Airport"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            You collect five minutes from the terminal, not inside it: the Wiber office is at Ctra.
            Aeropuerto km 5 in Sant Josep, with a free shuttle from arrivals and contactless pick-up, so
            collection is a key handover rather than a counter queue.
            {perDay ? ` Rates start at €${perDay} per day, all-inclusive.` : ''} In peak season that is
            reliably faster than the in-terminal desks.
          </p>
        }
      />

      <ItemGrid
        heading="The pick-up flow, step by step"
        columns={2}
        items={[
          { name: '1. Send your flight number', body: 'At booking, not on the day. The office tracks the arrival, so a delayed flight is handled without you needing to call from baggage reclaim.' },
          { name: '2. Find the shuttle', body: 'Outside arrivals at the shuttle area, not the taxi rank. Roughly five minutes to the office at km 5.' },
          { name: '3. Collect the key', body: 'Paperwork is completed in advance. Bring the credit card in the main driver\'s name, the licence and photo ID — all three, every time.' },
          { name: '4. Check the car before you leave', body: 'Walk round it and photograph anything already marked. Two minutes here is the cheapest insurance there is, on any rental anywhere.' },
        ]}
      />

      <ProseSection
        heading="After a late landing"
        paragraphs={[
          'Most Ibiza arrivals in season land in the evening, and the last hour of the day is when rental collection goes wrong: the terminal desks are at their longest, the shuttle is at its busiest, and nobody is at their most patient. The fix is boring and it works — book with the flight number attached, have the credit card physically in hand rather than in a bag in the hold, and know that the office is five minutes down the road rather than wondering where it is.',
          'If you are landing after midnight, tell us when you book. Late collection is normally arranged, but it is arranged in advance rather than discovered on arrival.',
        ]}
      />

      <TrustBlock
        heading="Booking through Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Check airport availability"
        points={[
          { title: 'Free shuttle', body: 'From the terminal to the desk at km 5, included. No taxi, no separate charge.' },
          { title: 'All-inclusive rate', body: 'Insurance is in the price, so nothing is sold to you at the counter after a long flight.' },
          { title: 'Contactless collection', body: 'Paperwork done before arrival. The step that turns an hour into fifteen minutes.' },
          { title: 'A local number', body: 'If something goes wrong at the desk you message us, not a call centre in another country.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Related pages" locale={LOCALE} links={[
        { label: 'Car rental in Ibiza', href: 'car-rental-ibiza', body: 'The pillar page: conditions, categories, and why a car is worth it here.' },
        { label: 'Convertible car rental', href: 'convertible-car-rental-ibiza', body: 'The coast roads it is actually worth booking one for.' },
        { label: 'Boat rental in Ibiza', href: 'boat-rental-ibiza', body: 'Where you drive to, and what you do when you get there.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="car rental at Ibiza Airport" />
    </>
  )
}
