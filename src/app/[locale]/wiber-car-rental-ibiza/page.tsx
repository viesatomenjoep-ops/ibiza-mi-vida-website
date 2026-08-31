import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { PartnerDossier } from '@/components/partner/PartnerDossier'
import { Breadcrumbs, InternalLinks, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { WIBER_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600
const LOCALE: Locale = 'en'
const PAGE_KEY = 'wiber-car-rental-ibiza'
const perDay = RENTAL_PRICES.carPerDay.amount

/**
 * Partner dossier: Wiber Rent a Car.
 *
 * Targets branded search — "Wiber Ibiza", "Wiber rent a car review", "is Wiber
 * any good" — which is a different intent from "car rental Ibiza" and so does
 * not compete with the pillar at /car-rental-ibiza. Someone running this query
 * has already been quoted a price and is deciding whether to trust the company.
 * The page answers that question rather than selling again, which is why it
 * leads with conditions and ends with a verdict that names who should book
 * elsewhere.
 *
 * The disclaimer is not decoration. This page carries another company's name on
 * our domain, so it says plainly whose page it is.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Wiber Rent a Car Ibiza: Reviewed',
    description:
      'What booking a car through Wiber in Ibiza involves: the office at km 5, the free shuttle, the deposit, the €9 young-driver surcharge and who it does not suit.',
    alternates: localizedAlternates('wiber-partner', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Wiber Rent a Car Ibiza: Reviewed',
      description: 'The conditions, the pick-up flow and the honest limits of booking a car through Wiber in Ibiza.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Wiber Rent a Car in Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Car rental Ibiza', path: 'car-rental-ibiza' },
  { name: 'Wiber Rent a Car' },
]

const FAQS: Faq[] = [
  {
    q: 'Is Wiber a good car rental company in Ibiza?',
    a: 'It is the one we book through, and the reason is narrow and specific: the all-inclusive rate holds at the counter. The common Spanish-airport complaint is not that the car was bad, it is that a €90 booking became €240 once insurance was sold at the desk. Wiber puts the cover in the rate instead. That does not make it the cheapest headline price on a comparison site — it usually is not — and if the headline number is what you are optimising for, you will find lower ones.',
  },
  {
    q: 'Where exactly is the Wiber office at Ibiza Airport?',
    a: 'Ctra. Aeropuerto km 5, in Sant Josep, about five minutes from the terminal, with a free shuttle from arrivals. It is off-airport, which sounds worse than it is: in August the in-terminal desks routinely run past an hour after a bank of evening arrivals, and the shuttle plus an off-airport desk is reliably faster.',
  },
  {
    q: 'What do I need to bring?',
    a: 'A credit card in the main driver\'s name, the physical driving licence, and photo ID. All three, every time. The credit card is the one that catches people: a debit card, or a card belonging to a partner who is not the named driver, is refused, and there is no talking round it at eleven at night.',
  },
  {
    q: 'What is the young-driver surcharge?',
    a: '€9 per day for drivers aged 21 to 24, charged on top of the rate. It is not absorbed by the all-inclusive price, so budget for it separately — on a ten-day trip it is €90. From 25 there is no surcharge. Minimum age is 21 and the licence must have been held for at least 12 months.',
  },
  {
    q: 'Is the deposit charged or blocked?',
    a: 'Pre-authorised, not charged: the amount is held against the credit card limit and released after the car comes back. It still reduces what you can spend on that card during the trip, which matters if it is the same card you were planning to eat out on.',
  },
  {
    q: 'What is not covered?',
    a: 'Damage sustained off sealed roads is the big one, and it matters here because half the good coves are down dirt tracks. A lost key, and the interior after a wet weekend, are also yours. Ask for the excess figure and for the list of what voids the cover before you sign — those two answers tell you more than the daily rate does.',
  },
]

export default function WiberPartnerPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Car rental in Ibiza with Wiber Rent a Car',
          description:
            'All-inclusive car rental in Ibiza through Wiber Rent a Car, five minutes from Ibiza Airport with a free shuttle and contactless pick-up.',
          brand: 'Wiber Rent a Car',
          price: perDay,
          path: 'wiber-car-rental-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <PartnerDossier
        locale={LOCALE}
        partner="Wiber Rent a Car"
        kicker="Our car rental partner"
        h1="Wiber Rent a Car in Ibiza"
        href={WIBER_URL}
        cta="Check availability with Wiber"
        pillarPath="car-rental-ibiza"
        pillarLabel="All car hire options in Ibiza"
        disclaimer="This is Ibiza Mi Vida's page about the rental company we work with. It is not Wiber's own website, and we are not Wiber. We earn a commission when you book through the links here; it costs you nothing extra, and it is why we say plainly below who should book somewhere else."
        lead={
          <>
            <p>
              Wiber is the company we book Ibiza car hire through. The office sits at Ctra. Aeropuerto km 5
              in Sant Josep — five minutes from the terminal, free shuttle, contactless pick-up — and the
              insurance is inside the rate rather than sold to you at the counter.
              {perDay ? ` Rates start at €${perDay} per day.` : ''}
            </p>
            <p className="mt-4">
              Minimum age is 21, with a €9 per day surcharge between 21 and 24, and a credit card in the
              main driver&apos;s name is not negotiable.
            </p>
          </>
        }
        headline={[
          { label: 'Office', value: 'Km 5, Sant Josep' },
          { label: 'From the terminal', value: '5 min, free shuttle' },
          { label: 'Minimum age', value: '21 (surcharge to 24)' },
          { label: 'Payment', value: 'Credit card only' },
        ]}
        factsHeading="The conditions, in full"
        facts={[
          { label: 'Pick-up location', value: 'Ctra. Aeropuerto km 5, Sant Josep — about five minutes from Ibiza Airport, reached by a free shuttle from arrivals.' },
          { label: 'Minimum age', value: '21 years, with the driving licence held for at least 12 months.' },
          { label: 'Young-driver surcharge', value: '€9 per day for drivers aged 21 to 24, charged on top of the rate. None from 25.' },
          { label: 'Payment', value: 'A credit card in the main driver’s name. Debit cards and cards in another person’s name are refused.' },
          { label: 'Deposit', value: 'Pre-authorised against the credit card, not charged, and released after the car is returned undamaged.' },
          { label: 'Insurance', value: 'Included in the all-inclusive rate rather than sold at the counter. Ask for the excess figure and what voids the cover.' },
          { label: 'Fuel policy', value: 'Collect full, return full. Refuelling by the company is charged at a rate well above the pump.' },
          { label: 'Off-road use', value: 'Damage sustained off sealed roads is excluded, as in most Spanish rental contracts. Relevant here — several of the best coves are down dirt tracks.' },
        ]}
        stepsHeading="How pick-up actually goes"
        steps={[
          { title: 'Send your flight number when you book', body: 'Not on the day. The office tracks the arrival, so a delay handles itself and nobody is waiting on a booking that looks like a no-show. If you rebook onto a different flight, message us — that is the one change that does not track itself.' },
          { title: 'Take the shuttle from arrivals', body: 'The shuttle pick-up area, not the taxi rank. Five minutes to the office at km 5. In August this is the part that beats the terminal queue rather than losing to it.' },
          { title: 'Collect the key', body: 'The paperwork is done in advance, so this is a handover rather than a counter appointment — usually under fifteen minutes including the shuttle. Bring the credit card, the licence and photo ID.' },
          { title: 'Photograph the car before you drive off', body: 'Walk round it and photograph anything already marked, including the wheels and the roof. Two minutes here is the cheapest insurance in car rental anywhere, and it is the step everybody skips when they are tired.' },
        ]}
        suitsHeading="Book through Wiber if"
        suits={[
          'You want the quoted price to be the price, and you have been caught by a counter upsell in Spain before.',
          'You are landing in the evening in July or August, when the in-terminal queues are at their worst.',
          'You are 25 or over with a credit card in your own name — the conditions cost you nothing.',
          'You want a local number to message if something goes wrong at the desk, rather than an international call centre.',
        ]}
        notSuitsHeading="Book elsewhere if"
        notSuits={[
          'The lowest headline number is what you are optimising for. All-inclusive rarely wins that comparison, because the competition is quoting without cover.',
          'Nobody in your party has a credit card. This is a hard stop, not a hurdle — bring one or book with a company that takes debit.',
          'You are under 21, or have held the licence under 12 months. There is no workaround.',
          'Your plan is genuinely rough off-road driving. The exclusion is standard, but standard does not mean it will not be enforced.',
        ]}
        verdictHeading="Our honest read"
        verdict={[
          'Wiber is not the cheapest name you will see on a comparison site, and we would rather say that here than have you discover it after booking. What you are paying the difference for is that the number stops moving: the insurance is in the rate, so the counter has nothing left to sell you at the end of a long flight.',
          'The conditions — 21 minimum, €9 a day to 24, credit card in the driver’s name — are ordinary for Spain rather than generous. We list them up front because the moment they cause a problem is at the desk, when there is no way to fix it, and a booking lost to a debit card is worse for everyone than a booking never made.',
          'If those conditions fit you, this is the least eventful way to get a car on this island, and an uneventful car hire is the whole point.',
        ]}
      >
        <FaqAccordion faqs={FAQS} locale={LOCALE} />
      </PartnerDossier>

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Car rental in Ibiza', href: 'car-rental-ibiza', body: 'The full picture: categories, prices, parking and why a car is worth it here.' },
          { label: 'Car rental at Ibiza Airport', href: 'car-rental-ibiza-airport', body: 'The pick-up flow at IBZ in more detail, including late landings.' },
          { label: 'Click&Boat, our boat partner', href: 'click-and-boat-ibiza', body: 'The same treatment for the platform behind our boats.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="renting a car in Ibiza through Wiber" />
    </>
  )
}
