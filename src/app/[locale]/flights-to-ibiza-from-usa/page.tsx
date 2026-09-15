import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { NonstopStatus, GatewayTable, UsClusterLinks } from '@/components/us/UsShared'
import { US_NONSTOP, nonstopBookable, usDate } from '@/lib/us-travel'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'flights-to-ibiza-from-usa'
const PATH = 'flights-to-ibiza-from-usa'

/**
 * Flights from the United States to Ibiza — the query an American types first.
 *
 * Two facts carry the page and both live in src/lib/us-travel.ts, not here:
 * the nonstop status (United's Newark route, announced for 31 May 2027) and
 * the one-stop gateway table. The copy branches on `nonstopBookable()` so the
 * day the route goes on sale, one status change rewrites the lead, the FAQ
 * and the table together. Nothing on this page is a schedule promise —
 * airlines re-time summer flights every season.
 */

const TITLE = 'Flights from the US to Ibiza (2027 Nonstop)'
const DESCRIPTION =
  "How Americans fly to Ibiza: United's Newark nonstop from May 2027, and one-stop routes via Madrid or Barcelona from JFK, MIA, LAX and seven more airports."

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: localizedAlternates('us-flights', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: TITLE,
      description: DESCRIPTION,
      locale: 'en_US',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Flights from the United States to Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza for Americans', path: 'ibiza-for-americans' },
  { name: 'Flights from the US' },
]

function buildFaqs(): Faq[] {
  const ns = US_NONSTOP[0]
  const nonstopAnswer = !ns
    ? 'Not yet. No airline sells a nonstop between the United States and Ibiza; every route connects once in Madrid, Barcelona, Lisbon or London. We update this page the day a nonstop goes on sale.'
    : nonstopBookable()
      ? `Yes. ${ns.airline} flies nonstop from ${ns.from.city} (${ns.from.iata}) to Ibiza ${ns.frequency}, since ${usDate(ns.starts)}. Every other US departure still connects once, usually in Madrid or Barcelona.`
      : `Announced, not yet flying. ${ns.airline} has announced a nonstop from ${ns.from.city} (${ns.from.iata}) to Ibiza starting ${usDate(ns.starts)}, ${ns.frequency} on an ${ns.aircraft}, subject to government approval. Until it is on sale, every US departure connects once, usually in Madrid or Barcelona. We verified the status on ${usDate(ns.asOf)}.`
  return [
    { q: 'Are there direct flights from the US to Ibiza?', a: nonstopAnswer },
    {
      q: 'How long is the flight from New York to Ibiza?',
      a: 'With one connection, 11 to 13 hours from wheels-up at JFK or Newark to landing in Ibiza: about seven hours across the Atlantic, a two-hour connection in Madrid or Barcelona, and a one-hour hop to the island. The announced Newark nonstop would take around eight hours.',
    },
    {
      q: 'Is it better to connect in Madrid or Barcelona?',
      a: 'Madrid has more Ibiza flights per day and more US arrivals, so a missed connection is easier to recover. Barcelona is a smaller airport with a shorter walk and a 55-minute hop to Ibiza. If your itinerary offers both at the same price, choose the one with a connection of at least two hours; less than 90 minutes in Madrid is tight after passport control.',
    },
    {
      q: 'Should I book the Ibiza leg on the same ticket?',
      a: 'Yes. On one ticket the airline rebooks you for free if the transatlantic flight lands late, and your bag is tagged through to IBZ. Two separate tickets can save money but you are on your own if the first flight is delayed, and you have to collect and re-check your bag in Madrid or Barcelona.',
    },
    {
      q: 'What time do flights from the US land in Ibiza?',
      a: 'Most East Coast departures leave between 5 and 8 p.m. and, after the connection, reach Ibiza between noon and 3 p.m. local time the next day. That is a good arrival: hotel check-in is open and you can still be on a beach by five. West Coast departures often land in the early evening.',
    },
    {
      q: 'Is there an overnight layover on the way to Ibiza?',
      a: 'Usually not, if you book one ticket through a Spanish hub: the morning arrival in Madrid or Barcelona connects to a midday Ibiza flight. Some London routings and most West Coast returns do force a late connection or a hotel night, so check the arrival time before you buy.',
    },
    {
      q: 'Which US cities have the shortest trip to Ibiza?',
      a: 'New York (JFK and Newark), Boston and Miami, at 11 to 14 hours with one stop, because they have the most nonstop Spain flights to connect from. Chicago, Dallas and Washington run 12 to 15 hours; Los Angeles and San Francisco 15 to 18.',
    },
    {
      q: 'Can I fly into Palma or Valencia and get to Ibiza another way?',
      a: 'You can, but it rarely saves time. Palma to Ibiza is a 30-minute flight or a two- to four-hour ferry; Valencia and Dénia have ferries of two to five hours. It only pays off if you want a night in Mallorca or Valencia first. For a straight Ibiza trip, connect by air.',
    },
  ]
}

const FAQS = buildFaqs()

export default function FlightsFromUsaPage() {
  const ns = US_NONSTOP[0]
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        page={{ path: PATH, dateModified: contentUpdated(PAGE_KEY), name: TITLE, description: DESCRIPTION }}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
      />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Flights from the United States to Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              {ns && !nonstopBookable()
                ? `The first nonstop between the United States and Ibiza has been announced: ${ns.airline} from ${ns.from.city} (${ns.from.iata}), ${ns.frequency} from ${usDate(ns.starts)}, on an ${ns.aircraft}, pending government approval. Until it is on sale, every American flies to Ibiza with one connection, and the fast way is 11 to 13 hours from New York via Madrid or Barcelona.`
                : ns
                  ? `${ns.airline} flies nonstop from ${ns.from.city} (${ns.from.iata}) to Ibiza ${ns.frequency}, around eight hours. From everywhere else in the United States you connect once, and the fast way is 11 to 13 hours from New York via Madrid or Barcelona.`
                  : 'There is no nonstop flight from the United States to Ibiza. Every American flies with one connection, and the fast way is 11 to 13 hours from New York via Madrid or Barcelona.'}
            </p>
            <p className="mt-4">
              Below: the nonstop status, a table of one-stop connections from ten US airports, and the booking
              rules that decide whether a late transatlantic flight costs you your Ibiza leg.
            </p>
          </>
        }
      />

      <NonstopStatus />

      <GatewayTable />

      <ItemGrid
        heading="The four ways to connect"
        intro="Madrid and Barcelona carry nearly all US traffic to Ibiza. Lisbon and London work too, and sometimes price lower."
        columns={2}
        items={[
          {
            name: 'Via Madrid (MAD)',
            body:
              'The most Ibiza flights per day of any airport, and the most US arrivals: Iberia, American, Delta, United and Air Europa all fly in. Passport control is here, so allow two hours. The Madrid to Ibiza hop is about an hour and ten minutes.',
          },
          {
            name: 'Via Barcelona (BCN)',
            body:
              'A smaller, quicker airport with a 55-minute flight to Ibiza and frequent Vueling departures. Fewer US nonstops than Madrid, mostly from New York, Boston, Atlanta and the West Coast, several of them seasonal.',
          },
          {
            name: 'Via Lisbon (LIS)',
            body:
              'TAP connects Newark, Boston, Miami, Chicago, Washington and San Francisco with a summer Lisbon to Ibiza flight. Often the cheapest one-ticket option; the connection times are longer.',
          },
          {
            name: 'Via London (LHR / LGW)',
            body:
              'British Airways and Virgin fly from many US cities, and Ibiza has dozens of London flights a day in summer. The catch is that Heathrow to Gatwick transfers and separate tickets are common on this routing, and you clear passport control twice.',
          },
        ]}
      />

      <ProseSection
        heading="What we would tell a friend booking from the States"
        paragraphs={[
          'Book one ticket, not two. The price difference between a through-fare and a separate cheap hop from Madrid is usually under a hundred dollars, and it buys you a free rebooking if the ocean flight is late, a bag that goes through to Ibiza, and someone else responsible when things go wrong. Every August we hear from people stuck in Madrid on two tickets.',
          'Aim for a connection of two to three hours. The first Schengen airport is where you clear passport control and, since the EU started biometric registration in 2025, the line takes longer on your first visit. Ninety minutes in Madrid works when everything is on time and only then.',
          'Land by mid-afternoon. Ibiza hotels check in from around 3 p.m., the marina and beach clubs run until sunset, and the club nights start after midnight. An early-evening East Coast departure gets you that arrival; a morning departure usually forces a night in Madrid.',
          'Do not book the Ibiza leg on the last flight of the day. If the transatlantic flight is late, the last hop is the one you miss, and the next one is tomorrow. Choose the routing with at least one later Ibiza flight behind yours.',
          'Fly back on a morning Ibiza flight. Westbound days are long and the connection in Madrid or Barcelona is where a delay costs you the ocean flight. An early departure from IBZ, even at the cost of an earlier alarm, is the safer day.',
        ]}
      />

      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <WhatsAppCta
        locale={LOCALE}
        heading="Arriving from the States? Tell us your flight"
        body="Send us your arrival time and we plan the first day around it: a transfer or rental car ready at the terminal, a table for dinner, and nothing booked for the hours you will be asleep."
        prefill="Hi Simon! I'm flying in from the US on [date], landing in Ibiza around [time]. Can you help me plan the arrival?"
      />

      <InternalLinks
        heading="After you land"
        locale={LOCALE}
        links={[
          { label: 'Ibiza airport transfers', href: 'ibiza-airport-transfer', body: 'Taxi rank, private transfer, bus or rental car: which fits which arrival.' },
          { label: 'Car rental at Ibiza Airport', href: 'car-rental-ibiza-airport', body: 'The pick-up flow at IBZ and what to do after a late landing.' },
          { label: 'Getting around Ibiza', href: 'getting-around-ibiza', body: 'Distances, the six ways to move, and when a car beats a taxi.' },
        ]}
      />

      <UsClusterLinks current={PATH} />

      <AuthorByline locale={LOCALE} topic="flying to Ibiza from the US" />
    </>
  )
}
