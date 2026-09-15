import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ChoiceCards, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { RateNote, etiasSentence } from '@/components/us/UsShared'
import { US_NONSTOP, nonstopBookable, getEurUsd, eurUsd, usDate } from '@/lib/us-travel'
import { getFleetStats } from '@/lib/fleet-stats'
import { getPriceStats } from '@/lib/price-stats'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'ibiza-for-americans'
const PATH = 'ibiza-for-americans'

/**
 * The hub for American travelers. One page that answers, in the first
 * paragraph, the four things a US reader asks before booking — how to get
 * here, what the paperwork is, what it costs in dollars, and who books it —
 * then hands off to the three spokes. American English on purpose.
 *
 * Nothing on this page is hand-typed data: the nonstop status and ETIAS come
 * from src/lib/us-travel.ts, the prices from fleet.ts and the live agenda, the
 * exchange rate from a dated fetch with a dated fallback.
 */

const TITLE = 'Ibiza for Americans: Flights, Rules, Costs'
const DESCRIPTION =
  'The US traveler’s guide to Ibiza: the 2027 Newark nonstop and one-stop routes, passport and ETIAS status, the driving permit, tipping, and prices in dollars.'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: localizedAlternates('us-hub', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: TITLE,
      description: DESCRIPTION,
      locale: 'en_US',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Ibiza for American travelers' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza for Americans' },
]

export default async function IbizaForAmericansPage() {
  const [fx, prices] = await Promise.all([getEurUsd(), getPriceStats('en')])
  const fleet = getFleetStats()
  const ns = US_NONSTOP[0]
  const boatLow = fleet?.cheapest.price.low ?? null
  const clubMedian = prices?.clubMedian ?? null
  // De lead draagt een VANAF-prijs, niet de mediaan: "een mediaan van €32 per
  // nacht" leest als een tarief dat wij rekenen en is preciezer dan een
  // openingsalinea aankan. De mediaan blijft in de FAQ staan, waar de vraag
  // "is Ibiza duur" er wél om vraagt, en in de tabel op de itinerary.
  const clubFrom = prices?.clubMin ?? null

  const faqs: Faq[] = [
    {
      q: 'Can Americans fly direct to Ibiza?',
      a: ns
        ? nonstopBookable()
          ? `Yes. ${ns.airline} flies nonstop from ${ns.from.city} to Ibiza ${ns.frequency}. From other US cities you connect once, usually in Madrid or Barcelona, 11 to 18 hours in total depending on the coast.`
          : `Not yet, but it is coming: ${ns.airline} has announced a nonstop from ${ns.from.city} (${ns.from.iata}) to Ibiza starting ${usDate(ns.starts)}, ${ns.frequency}, pending government approval. Until then every US departure connects once, usually in Madrid or Barcelona: 11 to 13 hours from New York, 15 to 18 from the West Coast.`
        : 'Not at the moment. Every US departure connects once, usually in Madrid or Barcelona: 11 to 13 hours from New York, 15 to 18 from the West Coast.',
    },
    {
      q: 'Do US citizens need a visa or ETIAS for Ibiza?',
      a: `No visa: a US passport gives 90 days in any 180 across the Schengen area. ${etiasSentence()}`,
    },
    {
      q: 'Is Ibiza expensive for Americans?',
      a: `Less than the reputation in some places, more in others. ${clubMedian ? `Club entry runs a median of ${eurUsd(clubMedian, fx)} a night across our live agenda, ` : 'Club entry is priced per night, '}a cocktail at a beach club is in the high teens in euros, and a good dinner for two with wine is comparable to New York. ${boatLow ? `A private boat day starts at ${eurUsd(boatLow, fx)} (smallest motorboat, low season; a skipper is itemized per boat) and is the best value on the island split between six or eight people.` : 'A private boat, split between six or eight people, is the best value on the island.'} A VIP table is a minimum spend and moves with the night.`,
    },
    {
      q: 'Do I need an International Driving Permit to rent a car in Ibiza?',
      a: 'Yes. Spain requires a US license to be accompanied by an International Driving Permit, rental desks can refuse the car without one, and a roadside check without it is a fine. AAA issues it in about 20 minutes for around $20. Get it before you fly; it cannot be obtained in Spain.',
    },
    {
      q: 'Do I tip in Ibiza?',
      a: 'Lightly. Service is included and staff are salaried; 5 to 10 percent in a restaurant for good service, round up a taxi, and a discretionary tip for the person who ran your beach bed or table all day. Nobody expects 20 percent and a machine that pre-selects a tip percentage is not the custom here.',
    },
    {
      q: 'How do I pay and is my US card accepted?',
      a: 'Visa and Mastercard contactless work almost everywhere; American Express is hit and miss. Prices include tax. When a terminal offers to charge in dollars, decline and pay in euros: the dollar option uses the merchant’s rate, three to six percent worse than your bank’s.',
    },
    {
      q: 'When is the best time for Americans to visit Ibiza?',
      a: 'Late June and September: everything is open, the water is warm, and flights and rooms are cheaper than in July and August. The season runs May to October. If you want the Newark nonstop once it flies, it is a summer route, so check its calendar first.',
    },
    {
      q: 'How does booking with Ibiza Mi Vida work from the US?',
      a: 'Over WhatsApp, in English, with Simon, who has lived here since 2021. You send dates and group size; we come back with boats, official club tickets, tables and a car, at the operator’s price with no booking fee. Time difference is six hours from the East Coast, so a message sent after your lunch is answered in our evening.',
    },
  ]

  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        page={{ path: PATH, dateModified: contentUpdated(PAGE_KEY), name: TITLE, description: DESCRIPTION }}
        breadcrumbs={CRUMBS}
        faqs={faqs}
      />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Ibiza for American Travelers"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              {ns && !nonstopBookable()
                ? `Getting here takes one connection today (11 to 13 hours from New York via Madrid or Barcelona) and, if the announced ${ns.airline} nonstop from ${ns.from.city} launches as planned on ${usDate(ns.starts)}, about eight hours next summer.`
                : ns
                  ? `Getting here takes about eight hours nonstop from ${ns.from.city} with ${ns.airline}, or one connection from everywhere else in the US.`
                  : 'Getting here takes one connection, 11 to 13 hours from New York via Madrid or Barcelona.'}
              {' '}No visa is needed for a US passport.
              {clubFrom ? ` Club tickets start from around €${clubFrom}` : ''}
              {boatLow ? `${clubFrom ? ', and' : ' '} a private boat day from ${eurUsd(boatLow, fx)}` : ''}
              {clubFrom || boatLow ? ' — split between six or eight people, the boat is the best value on the island.' : ''}
              {' '}Everything is booked in English over WhatsApp with someone who lives on the island.
            </p>
            <p className="mt-4">
              This page is the US traveler’s starting point. The three guides below go deeper on flights,
              paperwork and a five-day plan; the rest of the site covers boats, clubs, cars and the island itself.
            </p>
          </>
        }
      />

      <ChoiceCards
        heading="Start with the guide you need"
        locale={LOCALE}
        cards={[
          {
            title: 'Flights from the US',
            meta: ns ? `${ns.airline} nonstop ${nonstopBookable() ? 'on sale' : 'announced'} · one-stop from 10 airports` : 'One-stop from 10 US airports',
            body: 'Where to connect, how long it takes from your airport, and the booking rules that keep a late ocean flight from costing you the Ibiza leg.',
            href: 'flights-to-ibiza-from-usa',
            cta: 'Flight routes and times',
          },
          {
            title: 'Entry requirements',
            meta: 'Passport · ETIAS status · driving permit · tipping',
            body: 'What the border, the rental desk and the club door actually ask an American for, with the date each rule was last checked.',
            href: 'ibiza-travel-requirements-us-citizens',
            cta: 'What you need',
          },
          {
            title: 'Planning and costs',
            meta: 'Booking order · jet lag · when to come · real prices',
            body: 'What each of five days is for, what to book first, and what the water, the clubs and a car actually cost.',
            href: 'luxury-ibiza-itinerary-5-days',
            cta: 'How to plan it',
          },
        ]}
      />

      <ItemGrid
        heading="The five things Americans ask us first"
        columns={3}
        items={[
          {
            name: 'How far, how long',
            body: 'Ibiza is a Spanish island in the Mediterranean, an hour’s flight from Madrid or Barcelona. From the East Coast the trip is 11 to 13 hours with one connection; from the West Coast 15 to 18. The time difference is six hours from New York, nine from Los Angeles.',
          },
          {
            name: 'Paperwork',
            body: etiasSentence(),
          },
          {
            name: 'Driving',
            body: 'Rent a car if you want the north or the quiet coves; the west-coast beach clubs and the Playa d’en Bossa clubs work by taxi. Either way the rental desk wants a US license plus an International Driving Permit, a credit card in the driver’s name, and a driver aged 21 or older.',
          },
          {
            name: 'Money',
            // Vanaf-prijs, geen bereik met twee uitersten: "van €15 tot €175
            // voor het goedkoopste ticket" is een zin die je twee keer moet
            // lezen. De mediaan en het volledige bereik staan op /ibiza-prices.
            body: `Euros, contactless cards nearly everywhere, tax included in the price. ${prices ? `Club tickets start from around €${prices.clubMin}, with headline nights well above that.` : ''} Tip lightly; nobody expects 20 percent.`,
          },
          {
            name: 'The night',
            body: 'Clubs open around midnight and run to 6 a.m.; the headline set is between 2 and 4. The daytime open-air venues are the exception, with doors mid-afternoon and music off by midnight. Minimum age is 18, with physical photo ID at every door.',
          },
          {
            name: 'Who you deal with',
            body: 'Simon, on the island since 2021, over WhatsApp. Club tickets are official through ClubTickets at the official price; boats come through Click&Boat and our own fleet partner; cars through Wiber Rent a Car. No booking fee, no markup on the operator’s price.',
          },
        ]}
      />

      <ProseSection
        heading="What we would tell a friend coming from the States"
        paragraphs={[
          'Book the boat and the headline club nights before the hotel. Both sell out weeks ahead in July and August and both are dated; hotels are not. Everything else on the island can be arranged the week you arrive.',
          'Plan around jet lag instead of fighting it. Land mid-afternoon, eat late on the first night, and make your first club Ushuaïa, the daytime venue that ends at midnight, before you attempt a 3 a.m. headline set.',
          'Skip the "free guestlist" promises you will read online. At the major clubs a guestlist means a discounted or timed entry at best and is never guaranteed; for a headline Saturday, a ticket is the way in. Anyone promising free entry to Hï on a Saturday in August is going to disappoint you at the door.',
          'Ask us what a rate includes before you compare it. Boat prices here are quoted with or without skipper and almost always without fuel; a table is a spend, not a fee; a car is all-inclusive with our partner and often not with others. The cheaper headline number is frequently the more expensive day.',
        ]}
      />

      <RateNote fx={fx} />

      <Proof locale={LOCALE} />

      <FaqAccordion faqs={faqs} locale={LOCALE} />

      <WhatsAppCta
        locale={LOCALE}
        heading="Planning from the US? Message us"
        body="Tell us your dates, your group and what you want the trip to look like. We answer in English, in the evening your time, with real prices in euros and a dollar estimate next to each."
        prefill="Hi Simon! I'm planning a trip to Ibiza from the US. Can you help?"
      />

      <InternalLinks
        heading="Where the bookings happen"
        locale={LOCALE}
        links={[
          { label: 'Boat rental in Ibiza', href: 'boats', body: 'Skippered yachts and motorboats, licence-free boats, day rates by season.' },
          { label: 'Ibiza club tickets', href: 'ibiza-club-tickets', body: 'Official tickets and what entry actually costs, measured daily.' },
          { label: 'Car rental in Ibiza', href: 'car-rental-ibiza', body: 'All-inclusive hire five minutes from the airport, and the documents you need.' },
          { label: 'Package deals and VIP tables', href: 'package-deals', body: 'How a minimum spend works and how we quote one.' },
          { label: 'Concierge in Ibiza', href: 'concierge-ibiza', body: 'What we arrange, what it costs you (nothing), and how to check any concierge here.' },
          { label: 'Ibiza nightlife guide', href: 'ibiza-nightlife', body: 'How a night here runs, hour by hour, and where to base yourself.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="visiting Ibiza from the US" />
    </>
  )
}
