import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ChoiceCards, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'boat-rental-ibiza'

/**
 * The boat-rental pillar.
 *
 * English only by design: the German, French, Spanish and Dutch versions are
 * separate pages on their own keyword slugs (see src/lib/route-slugs.ts), each
 * written rather than translated. The middleware 301s any other locale that
 * lands on this slug to its own version, so this file only ever renders for
 * /en — and the hreflang cluster still names all five.
 *
 * Every figure on this page comes from src/lib/rental-prices.ts. While a price
 * is null the copy is written to read correctly without it and the Product
 * carries no Offer. Nothing here invents a number to look finished.
 */

/** Price clause that simply disappears while the figure is unconfirmed. */
const skipperPrice = RENTAL_PRICES.boatWithSkipper.amount
const noLicencePrice = RENTAL_PRICES.boatNoLicence.amount

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Boat Rental Ibiza: With or Without a Licence',
    description:
      'Rent a boat in Ibiza with a skipper, with your own licence, or licence-free up to 15 hp. Four departure marinas, routes to Cala Comte, Es Vedrà and Formentera.',
    alternates: localizedAlternates('boat-rental', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Boat Rental Ibiza: With or Without a Licence',
      description:
        'Rent a boat in Ibiza with a skipper, with your own licence, or licence-free up to 15 hp. Departures from four marinas, routes to Es Vedrà and Formentera.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Boat rental in Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Boats', path: 'boats' },
  { name: 'Boat rental Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'Can I rent a boat in Ibiza without a licence?',
    a: 'Yes. Spanish rules let anyone over 18 drive a boat of up to 15 hp with a hull under six metres, with no licence and no prior experience. You get a safety briefing before you leave and an agreed navigation area you have to stay inside — usually the stretch of coast around your departure port rather than the open crossing to Formentera. Everything larger or more powerful needs a recognised licence.',
  },
  {
    q: 'How much does it cost to rent a boat in Ibiza?',
    a: 'It depends on three things: the size of the boat, whether a skipper comes along, and the date. A licence-free boat for four to six people is the cheapest way onto the water; a skippered day charter is the most expensive. Fuel is almost always billed separately, on consumption, and that surprises people more than the rental rate does. Message us with your date and group size and we come back with the current rate for the boats actually free that day.',
  },
  {
    q: 'Do I need a deposit?',
    a: 'Yes, on essentially every boat. The deposit is held on a credit card in the main renter\'s name and released after the boat comes back undamaged, usually within a few days. The amount scales with the value of the boat, so a licence-free six-metre and a twelve-metre motor yacht are not in the same range. You are told the exact figure before you pay anything.',
  },
  {
    q: 'Can I book a skipper who speaks English or Dutch?',
    a: 'Usually yes, and it is worth asking early rather than on the day. English is widely spoken among skippers here; Dutch, German and French are available but on fewer boats, so the request narrows the fleet. Tell us which language you want when you enquire and we filter for it before quoting.',
  },
  {
    q: 'What happens if the weather turns?',
    a: 'Ibiza\'s problem wind is the tramontana from the north, and it decides the day more often than rain does. If conditions make a charter unsafe the operator cancels and you are offered a new date or your money back — the call is made by the skipper or the base, not by you, and not the night before. On borderline days the usual fix is to change the route rather than the date: the south and west coasts stay workable when the north is closed out.',
  },
  {
    q: 'How many people can come on the boat?',
    a: 'The licence on the boat sets the number, not the space on deck. Licence-free boats are typically certified for four to six; mid-size motorboats for eight to twelve; larger charter boats go beyond that. Skippers count towards the total on some certificates and not on others, so give us the real headcount including children when you enquire — a group of nine booked onto an eight-person boat gets turned away at the pontoon.',
  },
  {
    q: 'Is fuel included in the price?',
    a: 'Almost never. The standard across the island is that you take the boat with a full tank and bring it back full, or settle consumption at the end. What you burn depends far more on how you drive than how far you go: sitting at anchor in a cove costs nothing, and running at full throttle to Formentera and back costs a lot. Ask for the tank size and consumption when you book if you want to budget it properly.',
  },
  {
    q: 'When is the best time of year to rent a boat in Ibiza?',
    a: 'June to August is peak: warmest water, most reliable weather, highest prices, and the popular coves are busy by midday. May, September and early October are the better value — the sea is still warm in September, boats cost less and Cala Comte is not full at eleven in the morning. Weekdays are consistently cheaper and calmer than weekends in every month.',
  },
]

export default function BoatRentalIbizaPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Boat rental in Ibiza',
          description:
            'Private boat rental in Ibiza with a skipper, with your own licence, or licence-free up to 15 hp, from San Antonio, Santa Eulària, Ibiza Town and Marina Botafoch.',
          brand: 'Click&Boat',
          price: skipperPrice,
          path: 'boat-rental-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Boat Rental in Ibiza — With or Without a Licence"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              You can rent a boat in Ibiza three ways: with a skipper who drives for you, with your own
              licence, or licence-free on a boat capped at 15 hp if you are over 18. Peak season runs June
              to August; weekdays are cheaper and the coves are emptier than at weekends.
              {skipperPrice ? ` A skippered day charter starts at €${skipperPrice}.` : ''}
              {noLicencePrice ? ` Licence-free boats start at €${noLicencePrice}.` : ''}
            </p>
            <p className="mt-4">
              Boats leave from four marinas, and which one you pick shapes the day more than the boat does:
              San Antonio for the west-coast beaches, Santa Eulària for the quieter north, Ibiza Town and
              Marina Botafoch for the Formentera crossing.
            </p>
          </>
        }
      />

      <ChoiceCards
        heading="Three ways to get on the water"
        locale={LOCALE}
        cards={[
          {
            title: 'With a licence',
            meta: 'Your own licence · larger, faster boats',
            body:
              'You drive, and the whole fleet opens up: bigger hulls, real range, and the Formentera crossing on the table. Bring the licence itself — a photo of it is not enough at the pontoon.',
            href: 'boat-rental-with-skipper-ibiza',
            cta: 'What you can drive',
          },
          {
            title: 'Without a licence',
            meta: 'Max 15 hp · 18+ · briefing · set navigation area',
            body:
              'No paperwork, no experience needed. You get a briefing before you leave and a marked area to stay inside. Best for four to six people who want a cove and a swim, not a crossing.',
            href: 'boat-hire-ibiza-no-licence',
            cta: 'Licence-free boats',
          },
          {
            title: 'With a skipper',
            meta: 'Someone else drives · local knowledge',
            body:
              'A local skipper reads the wind and moves the route to suit it, which is what saves a day when the north coast closes out. Required on most larger boats anyway.',
            href: 'boat-rental-with-skipper-ibiza',
            cta: 'Book with a skipper',
          },
        ]}
      />

      <PriceTable
        heading="What a boat costs in Ibiza"
        locale={LOCALE}
        caption="Starting prices per boat type"
        intro="Starting prices, per boat and per day unless stated. Fuel is billed separately on consumption almost everywhere on the island — ask for tank size and burn rate if you want to budget it properly."
        rows={[
          {
            label: 'Licence-free boat',
            note: '4–6 people, max 15 hp',
            amount: RENTAL_PRICES.boatNoLicence.amount,
            unit: RENTAL_PRICES.boatNoLicence.unit.en,
          },
          {
            label: 'Motorboat, you drive',
            note: 'Licence required',
            amount: RENTAL_PRICES.boatWithLicence.amount,
            unit: RENTAL_PRICES.boatWithLicence.unit.en,
          },
          {
            label: 'Day charter with skipper',
            note: 'Skipper included in the rate',
            amount: RENTAL_PRICES.boatWithSkipper.amount,
            unit: RENTAL_PRICES.boatWithSkipper.unit.en,
          },
        ]}
      />

      <ItemGrid
        heading="Where the boats leave from"
        intro="Four departure points, each pointing at a different part of the coast. Pick the marina closest to what you want to see — an hour spent motoring around the island is an hour not spent swimming."
        columns={2}
        items={[
          {
            name: 'San Antonio',
            body:
              'The west coast base, and the shortest run to Cala Bassa, Cala Comte and Cala Salada. Also the busiest: leave by ten in July and August or you queue for the fuel dock and arrive at a full cove.',
          },
          {
            name: 'Santa Eulària',
            body:
              'Quieter marina on the east coast, closest to the north-eastern bays and Es Canar. The best choice when San Antonio is chaotic and you would rather start the day without a crowd.',
          },
          {
            name: 'Ibiza Town',
            body:
              'Straight out towards Formentera and the south coast, with Talamanca and Ses Salines within easy reach. Handy if you are staying in town and do not want a taxi across the island first.',
          },
          {
            name: 'Marina Botafoch',
            body:
              'The larger boats sit here, across the water from the old town. Same access to Formentera as Ibiza Town, with more room on the pontoon for a bigger group boarding at once.',
          },
        ]}
      />

      <ItemGrid
        heading="Where people actually go"
        intro="Five routes cover most of what a day out here looks like. All of them work from San Antonio except the Formentera crossing, which is faster from Ibiza Town or Botafoch."
        items={[
          {
            name: 'Cala Bassa',
            body:
              'Wide, sandy, sheltered, and twenty minutes from San Antonio. The easy first stop, and the one that works with children on board. Anchor off the beach rather than fighting for a spot in close.',
          },
          {
            name: 'Cala Comte',
            body:
              'The one everyone photographs, for good reason: shallow turquoise water over sand with the islets just offshore. It fills up by midday in summer, so go early or arrive after four when the day-trippers leave.',
          },
          {
            name: 'Cala Salada',
            body:
              'North of San Antonio, pine-backed and much smaller. The road access is poor, which is exactly why it stays calmer than the coves you can drive to. A good second stop when Comte is full.',
          },
          {
            name: 'Es Vedrà',
            body:
              'The rock off the south-west coast, and the one stop that is about looking rather than swimming. Best in the late afternoon with the sun behind it. Check the wind before committing — it is exposed out there.',
          },
          {
            name: 'Formentera day trip',
            body:
              'The full day: a crossing to Ses Illetes and the sandbanks, lunch, and back. Needs a boat with the range and, in practice, a skipper. Not a plan for a licence-free 15 hp boat, whatever the map suggests.',
          },
        ]}
      />

      <TrustBlock
        heading="Who you are booking through"
        locale={LOCALE}
        intro="We are a local team on Ibiza. The boats themselves come from Click&Boat, Europe's largest boat rental platform, with more than 55,000 boats listed across its markets — which is why we can usually find something free on a date that looks fully booked."
        partner="Click&Boat"
        points={[
          {
            title: 'Insurance',
            body:
              'Every boat is insured by its owner or operator as a condition of being listed. Third-party cover is standard; what varies is the excess, which is the number worth asking about before you sign anything.',
          },
          {
            title: 'The deposit',
            body:
              'Held on the main renter\'s credit card, released after the boat comes back undamaged. The amount scales with the value of the boat and you are told it before paying. Bring a real credit card — a debit card is refused at most bases.',
          },
          {
            title: 'What we do',
            body:
              'We match your date, group size and language to the boats actually available, and answer over WhatsApp rather than a ticket form. If a boat is wrong for what you described, we say so.',
          },
          {
            title: 'Cancellation',
            body:
              'Weather cancellations are decided by the base or the skipper, not by you, and come with a new date or a refund. Terms for changing your mind vary per boat, so ask us for that boat\'s policy before you commit.',
          },
        ]}
      />

      <ProseSection
        heading="What we would tell a friend"
        paragraphs={[
          'Book the boat around the weather, not the other way round. The tramontana blows from the north and closes out that side of the island for days at a time, while the south and west stay perfectly workable. A skipper will simply flip the route; if you are driving yourself, ask at the base that morning and be willing to change plan.',
          'Leave early. Not for the sunrise — for the anchorage. Cala Comte and Cala Bassa are full by midday in July and August, and the difference between arriving at ten and arriving at one is whether you swim off the boat or circle looking for room.',
          'Take more water and more shade than you think you need. Almost every boat under ten metres has neither, and six hours of Mediterranean sun with no bimini is the single most common way people ruin a day out here.',
        ]}
      />

      <Proof locale={LOCALE} />

      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          {
            label: 'Jet ski rental in Ibiza',
            href: 'jet-ski-rental-ibiza',
            body: 'Thirty-minute slots from San Antonio, with or without a licence on a guided tour.',
          },
          {
            label: 'Boat parties in Ibiza',
            href: 'boat-party',
            body: 'The organised version: a ticket, a DJ and a crowd, instead of a boat to yourself.',
          },
          {
            label: 'Car rental in Ibiza',
            href: 'car-rental-ibiza',
            body: 'How you reach the marina, and the coves that no boat gets you to.',
          },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="boat rental in Ibiza" />
    </>
  )
}
