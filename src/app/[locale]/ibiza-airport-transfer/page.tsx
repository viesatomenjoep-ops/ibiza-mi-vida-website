import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'ibiza-airport-transfer'

/**
 * Luchthavenvervoer — een beslispagina, geen prijslijst.
 *
 * Deze pagina noemt bewust GEEN taxitarieven en GEEN buslijnnummers. Niet uit
 * voorzichtigheid maar omdat CLAUDE.md het verbiedt: publiceer nooit een prijs
 * die niet bevestigd is. Taxitarieven op Ibiza hebben seizoens- en
 * nachttoeslagen en de buslijnen naar San Antonio rijden alleen in het seizoen;
 * een getal dat hier hardgecodeerd staat is binnen één seizoen onwaar en blijft
 * dan jaren staan.
 *
 * Wat een bezoeker écht mist bij "ibiza airport transfer" is niet het getal maar
 * de kéuze: vier opties, en welke bij welke aankomst past. Dat is wat hier staat
 * en wat een antwoordmachine kan citeren zonder te liegen.
 *
 * De ontbrekende cijfers staan als [[VERIFY]] in docs/seo/NIGHT-REPORT.md.
 * Zodra Simon ze bevestigt, komen ze hier in een PriceTable met echte rijen.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ibiza Airport Transfers & Taxis',
    description:
      'Getting from Ibiza airport to your hotel: taxi, bus, pre-booked transfer or hire car, and which one is right for your arrival time and group size.',
    alternates: localizedAlternates('airport-transfer', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Ibiza Airport Transfers & Taxis',
      description: 'Four ways out of Ibiza airport, and which one fits your arrival.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Ibiza airport transfers' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza airport transfers' },
]

const FAQS: Faq[] = [
  {
    q: 'How do I get from Ibiza airport to my hotel?',
    a: 'Four options, and the right one depends on your arrival time and group size. The taxi rank outside arrivals is the default and works for most people. A pre-booked private transfer makes sense for a group with luggage or a late landing. The public bus is the cheap option if you are travelling light to Ibiza Town. A hire car pays for itself if you plan to leave your resort more than twice.',
  },
  {
    q: 'How far is Ibiza airport from Ibiza Town?',
    a: 'About seven kilometres, which is fifteen to twenty minutes by road outside peak times. Playa d’en Bossa is closer still — it sits between the two. San Antonio is on the other side of the island and is a longer run, roughly half an hour depending on traffic and the season. Santa Eulalia is further again.',
  },
  {
    q: 'Is there a taxi rank at Ibiza airport?',
    a: 'Yes, directly outside arrivals, and it is the simplest way out of the terminal. In peak season and after a bank of evening landings there is a queue, and it moves at the pace the rank is fed rather than the pace you would like. Taxis are metered with supplements that vary by time and luggage — ask what the run will cost before you set off.',
  },
  {
    q: 'Can I use Uber or Bolt in Ibiza?',
    a: 'Do not build your arrival around it. Ride-hailing coverage on the island is limited and seasonal, and it is not a substitute for the taxi rank the way it is in a mainland city. If having a car waiting matters — a late landing, a group, a lot of luggage — book a private transfer in advance instead of assuming an app will answer.',
  },
  {
    q: 'Is there a bus from Ibiza airport?',
    a: 'There is a public bus service between the airport and Ibiza Town that runs year-round, plus a seasonal route towards San Antonio during the summer. Line numbers and timetables change between seasons, so check the current schedule before you rely on it — particularly for a late arrival, where the last departure of the day matters more than the fare.',
  },
  {
    q: 'What if I land after midnight?',
    a: 'Pre-book. Late landings are exactly when the taxi queue is longest and the bus has stopped running, and it is the one arrival where improvising is genuinely expensive. A private transfer booked in advance costs a known amount and has your name on it; the same journey found at two in the morning does not.',
  },
  {
    q: 'Should I hire a car instead?',
    a: 'If you are staying outside Ibiza Town or Playa d’en Bossa, or you want to reach the north, the west-coast beaches or a club like Amnesia out on the San Antonio road, a car is usually cheaper than the taxis it replaces. If you are staying on the strip and clubbing every night, it is a parking problem you are paying for. Our car rental page covers the pick-up flow at the airport.',
  },
  {
    q: 'Can Ibiza Mi Vida arrange a transfer?',
    a: 'Yes, through Simon on WhatsApp. Send the flight number, the landing time, the group size and where you are staying, and he arranges a private transfer and confirms the price before you fly rather than after you land. It is the same channel that handles guestlist and boat bookings, so a whole trip can be sorted in one thread.',
  },
]

const OPTIONS = [
  {
    name: 'Taxi from the rank',
    body:
      'Outside arrivals, no booking, works for most arrivals. Metered with supplements that vary by time of day and luggage. The weakness is the queue after a bank of evening landings — twenty minutes of flying time can turn into forty minutes of standing.',
  },
  {
    name: 'Pre-booked private transfer',
    body:
      'A driver with your name, waiting, at a price agreed before you fly. Worth it for groups, for anyone landing late, and for a first trip where nobody knows the island. This is what Simon arranges over WhatsApp.',
  },
  {
    name: 'Public bus',
    body:
      'The cheap option if you are travelling light and heading for Ibiza Town. A year-round route serves the town; a seasonal one runs towards San Antonio in summer. Check the current timetable — the last departure matters more than the fare.',
  },
  {
    name: 'Hire car from the airport',
    body:
      'Best value if you will leave your resort regularly, if you are staying in the north or on the west coast, or if a club on the San Antonio road is in the plan. Least useful if you are on the strip and out every night.',
  },
]

export default function IbizaAirportTransferPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Ibiza Airport Transfers — Taxi, Bus, Private or Hire Car"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Ibiza airport sits about seven kilometres from Ibiza Town — fifteen to twenty minutes by
              road, and less to Playa d’en Bossa. There are four ways out of the terminal: the taxi rank
              outside arrivals, a pre-booked private transfer, the public bus, or a hire car. Which one is
              right comes down to two things: what time you land and how many of you there are.
            </p>
            <p className="mt-4">
              We deliberately do not print taxi fares or bus line numbers here. Both carry seasonal and
              night supplements and both change between summers, and a stale number on a page like this is
              worse than none. Simon confirms the real figure for your flight before you book.
            </p>
          </>
        }
      />

      <ItemGrid heading="The four options" items={OPTIONS} columns={2} />

      <ProseSection
        heading="Which one for your arrival"
        paragraphs={[
          'Landing in daylight, two of you, staying in Ibiza Town or Playa d’en Bossa: take the taxi from the rank. The run is short, the queue in the afternoon is manageable, and pre-booking a fifteen-minute journey is a solution to a problem you do not have.',
          'Landing after eleven at night, or four or more of you, or anyone with a lot of luggage: pre-book. The evening is when arrivals bank up, when the queue is longest and the bus has finished for the day. A transfer booked from your sofa costs a known amount; the same journey negotiated at two in the morning does not, and one member of the group is always the one who ends up sorting it.',
          'Staying in the north, on the west coast, in Santa Eulalia or anywhere that is not walking distance from a beach and a supermarket: hire a car at the airport and stop thinking about transport for the week. The break-even against taxis arrives faster than people expect — roughly two return journeys a day is all it takes — and it is what makes Amnesia, the Es Vedrà viewpoints and the north-coast beaches practical rather than a project.',
          'One thing that applies to all four: do not plan on a ride-hailing app answering. Coverage on the island is limited and seasonal, and an arrival plan that depends on it is an arrival plan with no fallback.',
        ]}
      />

      <WhatsAppCta
        locale={LOCALE}
        body="Send Simon your flight number, landing time, group size and where you are staying, and he arranges a private transfer with the price confirmed before you fly. Same thread as your club tickets and boat bookings, so the whole trip is in one place — and if the honest answer is that the taxi rank is cheaper for your run, he will say so."
        prefill="Hi Simon, I need an airport transfer in Ibiza — flight number, landing time and group size: "
      />

      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Car rental in Ibiza', href: 'car-rental-ibiza', body: 'All-inclusive hire through Wiber, five minutes from the terminal.' },
          { label: 'Car rental at Ibiza airport', href: 'car-rental-ibiza-airport', body: 'The pick-up flow at IBZ, shuttle and late-landing advice.' },
          { label: 'Ibiza tips', href: 'tips', body: 'Practical island advice from the local team.' },
          { label: 'DC-10 Ibiza', href: 'dc10-ibiza', body: 'The one club that is closer to the airport than your hotel.' },
          { label: 'Amnesia Ibiza', href: 'amnesia-ibiza', body: 'Out on the San Antonio road, where a car earns its keep.' },
          { label: 'Ibiza club calendar', href: 'calendar', body: 'Plan the week before you plan the transfer.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Ibiza airport transfers" />
    </>
  )
}
