import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
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
const PAGE_KEY = 'car-rental-ibiza'

/**
 * The car-rental pillar. Partner: Wiber Rent a Car, via Awin.
 *
 * Every outbound booking link goes through <AffiliateLink>, which hardcodes
 * rel="sponsored noopener noreferrer" and renders a visible disclosure. There
 * is deliberately no bare <a> to Wiber anywhere in this file.
 *
 * The conditions block is the commercially important part of this page rather
 * than the prices. "All-inclusive" is the claim the whole Wiber proposition
 * rests on, and it is also the claim every visitor has been burned by
 * elsewhere, so the page states plainly what it does and does not cover, and
 * names the young-driver surcharge rather than leaving it to the counter.
 */

const perDay = RENTAL_PRICES.carPerDay.amount

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Car Rental Ibiza: All-Inclusive',
    description:
      'All-inclusive car rental in Ibiza with Wiber, five minutes from the airport with a free shuttle. Conditions, deposit and the young-driver surcharge.',
    alternates: localizedAlternates('car-rental', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Car Rental Ibiza: All-Inclusive',
      description:
        'All-inclusive car rental in Ibiza with Wiber, five minutes from the airport with a free shuttle and contactless pick-up.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Car rental in Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Car rental Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'Can I rent a car at Ibiza Airport?',
    a: 'You collect five minutes away rather than in the terminal. Wiber\'s office is on the Ctra. Aeropuerto at km 5 in Sant Josep, and a free shuttle runs from the terminal to the desk. In practice that is faster in August than the in-terminal desks, where the queue after a bank of evening arrivals regularly runs past an hour.',
  },
  {
    q: 'What does all-inclusive actually mean?',
    a: 'It means the price you are quoted is the price you pay: insurance is in the rate rather than sold at the counter, and there is no fuel deposit game. It does not mean nothing can ever be charged — damage outside the cover, a lost key or refuelling after you bring it back empty are still yours. The difference from a cheap headline rate is that nothing is added just because you said no at the desk.',
  },
  {
    q: 'Can I rent a car in Ibiza at 21?',
    a: 'Yes. The minimum age is 21 and you must have held your licence for at least 12 months. Drivers aged 21 to 24 pay a young-driver surcharge of €9 per day, which is charged on top of the rate and is not something the all-inclusive price absorbs. From 25 there is no surcharge.',
  },
  {
    q: 'Do I need a credit card and a deposit?',
    a: 'Bring a credit card in the main driver\'s name. It is the single most common reason people get turned away at a rental desk anywhere in Spain, and a debit card or a card in a partner\'s name will not do. The deposit is pre-authorised rather than charged, and released after the car comes back.',
  },
  {
    q: 'Is a convertible worth it in Ibiza?',
    a: 'For the coast roads, genuinely yes — the drive from Sant Josep down to Cala d\'Hort with the roof down is the reason people book one. For a week of supermarket runs and airport transfers, no. Boot space is small, and a car parked open in a beach car park is a car you have to empty every time. Book it for the driving, not for the week.',
  },
  {
    q: 'Do I really need a car on Ibiza?',
    a: 'If you are staying in Ibiza Town or San Antonio and never leaving, no — buses and taxis cover it. If you want Cala Salada, Cala d\'Hort, the north around Sant Joan or any cove that takes a dirt track, yes. That is most of what people come back from Ibiza talking about, and none of it is on a bus route.',
  },
  {
    q: 'What about parking?',
    a: 'Plan for it, because in August it decides your day. Ibiza Town has paid underground car parks and almost no free street parking in season. San Antonio is easier out towards the bay. The beach car parks at Comte and Bassa fill by mid-morning; arriving before ten or after four is the whole trick.',
  },
  {
    q: 'Can I take a hire car on the dirt tracks?',
    a: 'On the graded tracks to places like Cala Salada, yes, and everyone does. On the rougher stuff further north, check your rental terms first — most contracts exclude damage sustained off sealed roads, so a punctured sump on a rocky track is on you. If the plan is genuinely remote coves, take the 4x4 rather than the cheapest economy car.',
  },
]

export default function CarRentalIbizaPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Car rental in Ibiza',
          description:
            'All-inclusive car rental in Ibiza with Wiber Rent a Car, five minutes from Ibiza Airport with a free shuttle and contactless pick-up.',
          brand: 'Wiber Rent a Car',
          price: perDay,
          path: 'car-rental-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Car Rental in Ibiza — All-Inclusive, No Surprises"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              We book Ibiza car hire through Wiber Rent a Car: all-inclusive pricing with the insurance in
              the rate, an office five minutes from the airport at Ctra. Aeropuerto km 5 in Sant Josep, a
              free shuttle from the terminal and contactless pick-up.
              {perDay ? ` Rates start at €${perDay} per day.` : ''} Minimum age is 21, with a €9 per day
              surcharge for drivers aged 21 to 24.
            </p>
            <p className="mt-4">
              The reason to have a car here is not the airport run. It is Cala Salada, Cala d&apos;Hort and
              the north coast — the parts of the island no bus goes to.
            </p>
          </>
        }
      />

      <PriceTable
        heading="What car hire costs in Ibiza"
        locale={LOCALE}
        caption="Starting prices per car category"
        intro="Starting prices per day, all-inclusive. Rates climb steeply in July and August and the cheap categories sell out first, so the gap between booking in April and booking in July is larger than the gap between categories."
        rows={[
          { label: 'Economy', note: 'Two adults, hand luggage, town parking', amount: RENTAL_PRICES.carPerDay.amount, unit: RENTAL_PRICES.carPerDay.unit.en },
          { label: 'Compact', note: 'Four adults with real luggage', amount: null, unit: RENTAL_PRICES.carPerDay.unit.en },
          { label: 'Convertible', note: 'Two adults, small boot, coast roads', amount: null, unit: RENTAL_PRICES.carPerDay.unit.en },
          { label: 'SUV / 4x4', note: 'Dirt tracks and remote coves', amount: null, unit: RENTAL_PRICES.carPerDay.unit.en },
        ]}
      />

      <ItemGrid
        heading="The conditions, stated up front"
        intro="None of this is unusual for Spain, but all of it is worth knowing before you land rather than at the desk at eleven at night."
        columns={2}
        items={[
          {
            name: 'Age and licence',
            body:
              'Minimum age 21, and the licence must have been held for at least 12 months. Drivers aged 21 to 24 pay a young-driver surcharge of €9 per day on top of the rate. From 25 there is no surcharge.',
          },
          {
            name: 'Credit card and deposit',
            body:
              'A credit card in the main driver\'s name is required. The deposit is pre-authorised, not charged, and released after return. A debit card, or a card belonging to someone else in the party, is refused — this is the most common reason people lose a booking.',
          },
          {
            name: 'What insurance covers',
            body:
              'Cover is included in the all-inclusive rate rather than sold at the counter. It does not extend to everything: damage off sealed roads, a lost key, or the interior after a wet weekend are outside it. Ask for the excess figure and what voids the cover.',
          },
          {
            name: 'Fuel and return',
            body:
              'Take it full, bring it back full. Refuelling on your behalf is charged at a rate you will not enjoy, and the petrol station nearest the airport knows exactly why you are there at seven in the morning.',
          },
        ]}
      />

      <ProseSection
        heading="Why you want a car on Ibiza"
        paragraphs={[
          'The island is small enough that everything looks close on a map and slow enough in practice that it is not. Thirty kilometres across the middle in August is an hour, and the last two of those kilometres are often a dirt track. That is the argument for the car in one sentence: the coves worth the trip are the ones the buses do not reach.',
          'Cala Salada is the clearest example. It sits at the end of a narrow road north of San Antonio with a small car park that fills by ten in the morning, and the walk in from the overflow is long enough that most people give up. Cala d\'Hort, looking straight at Es Vedrà, is the same story from the other side of the island. Both are twenty minutes from a main road and neither has a useful bus.',
          'If the plan involves the rougher tracks in the north — the coves around Sant Joan, or the ones you find by turning off somewhere unmarked — take the 4x4 rather than the cheapest economy car. Not because an economy car cannot make it, but because most rental contracts exclude damage sustained off sealed roads, and a cracked sump on a rocky track is a bill nobody budgets for.',
          'Parking is the part people underestimate. In Ibiza Town in August you park underground and pay for it, or you circle. At the west-coast beaches, before ten or after four. Plan the day around that and the car is the best decision of the trip; ignore it and you spend the holiday looking for spaces.',
        ]}
      />

      <TrustBlock
        heading="Booking through Wiber"
        locale={LOCALE}
        intro="Wiber Rent a Car is our car rental partner on the island. We book through them because the all-inclusive rate holds at the counter, which is not true of every cheap headline price at Ibiza airport."
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Check availability with Wiber"
        points={[
          {
            title: 'Five minutes from the airport',
            body:
              'The office is at Ctra. Aeropuerto km 5, Sant Josep, with a free shuttle from the terminal. Off-airport, but faster in peak season than the in-terminal queue after an evening arrivals bank.',
          },
          {
            title: 'Contactless pick-up',
            body:
              'Paperwork is done before you arrive, so collection is a key handover rather than a counter appointment. It is the difference between twenty minutes and an hour after a late landing.',
          },
          {
            title: 'All-inclusive means the quote holds',
            body:
              'Insurance is in the rate. Nobody sells you cover at the desk because you declined it online, which is the mechanism behind most "the price doubled" stories from Spanish airports.',
          },
          {
            title: 'What we do',
            body:
              'We book it with you over WhatsApp and stay reachable while you have the car. If something goes wrong at the desk, you have a local number rather than a call centre.',
          },
        ]}
      />

      <Proof locale={LOCALE} />

      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          {
            label: 'Boat rental in Ibiza',
            href: 'boat-rental-ibiza',
            body: 'The coves you cannot drive to, reached the other way.',
          },
          {
            label: 'Wiber Rent a Car, reviewed',
            href: 'wiber-car-rental-ibiza',
            body: 'Who our rental partner is, the conditions in full, and who should book elsewhere.',
          },
          {
            label: 'Car rental at Ibiza Airport',
            href: 'car-rental-ibiza-airport',
            body: 'The pick-up flow at IBZ, shuttle times and what to do after a late landing.',
          },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="car rental in Ibiza" />
    </>
  )
}
