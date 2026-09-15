import type { Metadata } from 'next'
import Link from 'next/link'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { RateNote, UsClusterLinks } from '@/components/us/UsShared'
import { getEurUsd, usd, eurUsd, type FxRate } from '@/lib/us-travel'
import { getFleetStats } from '@/lib/fleet-stats'
import { getPriceStats } from '@/lib/price-stats'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'luxury-ibiza-itinerary-5-days'
const PATH = 'luxury-ibiza-itinerary-5-days'

/**
 * "What is the ultimate 5-day luxury Ibiza itinerary" — written to be the
 * answer, in American English, with dollar estimates next to every euro.
 *
 * Every number comes from data the site already measures: boat day rates from
 * src/data/fleet.ts, club entry from the live agenda via price-stats, rental
 * prices from rental-prices.ts. Where we have no confirmed figure (VIP tables,
 * hotels, restaurants) the page says so and links to where the real quote
 * comes from, instead of inventing a "from" price. Dollar figures are
 * estimates from a dated exchange rate, printed under every table.
 */

const TITLE = '5-Day Luxury Ibiza Itinerary (Prices in USD)'
const DESCRIPTION =
  'A five-day luxury Ibiza plan for Americans: a private yacht day to Formentera, beach clubs, the two club nights worth doing, and costs in euros and dollars.'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: localizedAlternates('us-itinerary', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: TITLE,
      description: DESCRIPTION,
      locale: 'en_US',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Five-day luxury Ibiza itinerary' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza for Americans', path: 'ibiza-for-americans' },
  { name: '5-day luxury itinerary' },
]

interface Day {
  n: number
  title: string
  where: string
  plan: string[]
  book?: { label: string; href: string }
}

const DAYS: Day[] = [
  {
    n: 1,
    title: 'Land, settle, and eat late',
    where: 'Ibiza Town · Talamanca · Marina Botafoch',
    plan: [
      'Most US connections land between noon and 3 p.m. A pre-booked driver or your rental car gets you to Ibiza Town or Talamanca in 15 minutes.',
      'Walk Dalt Vila, the walled old town and UNESCO site, an hour before sunset when the stone turns gold and the cruise crowds have left.',
      'Dinner at 10 p.m. on the Marina Botafoch waterfront, facing the old town. Sleep. The clubs are not going anywhere and jet lag is real.',
    ],
    book: { label: 'Arrange the airport pickup', href: 'ibiza-airport-transfer' },
  },
  {
    n: 2,
    title: 'A private yacht to Formentera',
    where: 'Marina Botafoch → Espalmador → Ses Illetes → Es Vedrà',
    plan: [
      'The day that justifies the trip. A skippered motorboat or yacht leaves at 10 or 11 a.m., crosses to Formentera in under an hour, and anchors off Espalmador and Ses Illetes, water the color of a swimming pool.',
      'Lunch is either on board or a tender to a beach restaurant on Formentera; the skipper books it. Late afternoon, run back along the south coast to sit under Es Vedrà for sunset.',
      'Book this first, before hotels. In July and August the good boats with a skipper are gone weeks ahead. Fuel is billed separately on nearly every charter here.',
    ],
    book: { label: 'See the fleet and day rates', href: 'boats' },
  },
  {
    n: 3,
    title: 'West coast beach club, then the first club night',
    where: 'Cala Comte or Cala Bassa · Playa d’en Bossa',
    plan: [
      'A beach club day on the west coast: a reserved bed at Cala Comte or Cala Bassa from noon, lunch on the sand, water that is calm in the morning and busy by three.',
      'Back to Playa d’en Bossa for the evening. Ushuaïa is the open-air daytime club: doors mid-afternoon, headline set around 9 p.m., music off by midnight. It is the right first club for an American body clock.',
      'If you want the full night, Hï Ibiza is across the road and opens as Ushuaïa closes. Tickets are official through ClubTickets; buy the date, not the door.',
    ],
    book: { label: 'Club tickets and the calendar', href: 'ibiza-club-tickets' },
  },
  {
    n: 4,
    title: 'The quiet north, then a VIP table',
    where: 'Benirràs · Portinatx · Santa Gertrudis · a superclub table',
    plan: [
      'Drive north. Benirràs has the drum circle at sunset on Sundays; Portinatx and Cala Xarraca are the swimming coves. Lunch in Santa Gertrudis, the village square where the island eats on its day off.',
      'Rest between five and ten. Late dinner near your hotel.',
      'A VIP table at a superclub is priced as a minimum spend, not a ticket: you commit a figure that is credited against bottles and mixers for the night. The number moves with the night and the DJ, which is why we quote it per date over WhatsApp rather than print it.',
    ],
    book: { label: 'How package deals and tables work', href: 'package-deals' },
  },
  {
    n: 5,
    title: 'Recover, shop, fly',
    where: 'Las Dalias or Ibiza Town · IBZ',
    plan: [
      'A slow morning. On Saturday, Las Dalias market in San Carles; any other day, the boutiques of Ibiza Town’s Marina and Dalt Vila open around 11.',
      'Westbound flights want an early Ibiza departure so the connection in Madrid or Barcelona is not the last of the day. Leave the hotel three hours before the Ibiza flight in August; the airport is small and the security line is not.',
      'Return the rental car at the Wiber office five minutes from the terminal and take their shuttle; do not budget on returning a car inside the airport.',
    ],
    book: { label: 'Flights back to the US', href: 'flights-to-ibiza-from-usa' },
  },
]

const FAQS_BASE: Faq[] = [
  {
    q: 'Is five days enough for Ibiza?',
    a: 'Yes, for a first trip, if you do one big thing a day: a boat day, a beach club day, one or two club nights and the north. A week lets you add Formentera by ferry for a full day and a second boat day. Less than four days from the US is not worth the jet lag.',
  },
  {
    q: 'When should Americans visit Ibiza?',
    a: 'Late June and September are the sweet spot: every club and beach club is open, the sea is warm, and flights and rooms cost less than in July and August. The season runs May to October; the announced Newark nonstop is a summer route, so plan around its calendar if you want to fly direct.',
  },
  {
    q: 'Where should I stay for a luxury trip?',
    a: 'Ibiza Town and Talamanca for restaurants, the marina and the old town on foot, with the Playa d’en Bossa clubs ten minutes away by taxi. Santa Eulària for calmer evenings and families. The north for villas and quiet, with a rental car as a given. Avoid basing yourself in San Antonio unless the west-coast sunset bars are the point of the trip.',
  },
  {
    q: 'How much is a VIP table at Hï Ibiza or Ushuaïa?',
    a: 'It is a minimum spend rather than a fixed price, and it changes with the DJ and the date, so we do not print a number. Tell us the club, the night and your group size over WhatsApp and we send the real figure for that night. The spend is credited against bottles and mixers at the table.',
  },
  {
    q: 'Do I need to book club tickets in advance?',
    a: 'For headline nights at Hï, Ushuaïa and UNVRS in July and August, yes, and weeks ahead for the biggest names. Prices are dynamic and rise as the date approaches. Midweek nights at smaller rooms can be bought the same day. All tickets we sell are official, through ClubTickets, with no markup.',
  },
  {
    q: 'Do I need a car for this itinerary?',
    a: 'For day four, yes; for the rest, taxis and a driver work. A rental for the full five days is usually cheaper than two days of taxis to the north and back. Bring an International Driving Permit with your US license or the rental desk can refuse the car.',
  },
]

function BudgetTable({ fx, rows }: { fx: FxRate; rows: { label: string; note: string; eur: number | null; unit: string }[] }) {
  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">What the five days cost</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
          Only figures we measure. Boat rates are the real day rates of the boats we charter; club entry is the
          median of the cheapest ticket across every dated club night in our live agenda. Hotels and restaurants
          are not our inventory, so they are not here. &ldquo;On request&rdquo; means the price is set per date and
          we quote it over WhatsApp rather than print a number that will be wrong within a week.
        </p>
        <div className="mt-7 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[15px]">
            <caption className="sr-only">Estimated costs for a five-day luxury Ibiza trip</caption>
            <thead>
              <tr className="border-b border-black/8 font-serif text-[13px] uppercase tracking-wide text-neutral-500">
                <th scope="col" className="py-3 pr-4">Item</th>
                <th scope="col" className="py-3 pr-4 text-right">Euros</th>
                <th scope="col" className="py-3 text-right">US dollars (est.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8 border-b border-black/8">
              {rows.map((r) => (
                <tr key={r.label} className="align-top">
                  <th scope="row" className="py-4 pr-4 font-serif font-bold text-neutral-900">
                    {r.label}
                    <span className="mt-1 block text-[13px] font-normal text-neutral-500">{r.note}</span>
                  </th>
                  <td className="whitespace-nowrap py-4 pr-4 text-right">
                    <span className="font-serif text-lg font-black">{r.eur === null ? 'on request' : `€${r.eur.toLocaleString('en-US')}`}</span>
                    <span className="mt-1 block text-[13px] text-neutral-500">{r.unit}</span>
                  </td>
                  <td className="whitespace-nowrap py-4 text-right font-serif text-lg font-black text-neutral-700">
                    {r.eur === null ? '—' : `≈ ${usd(r.eur, fx)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RateNote fx={fx} />
    </section>
  )
}

export default async function LuxuryItineraryPage() {
  const [fx, prices] = await Promise.all([getEurUsd(), getPriceStats('en')])
  const fleet = getFleetStats()

  const boatLow = fleet?.cheapest.price.low ?? null
  const boatHigh = fleet?.priciest.price.high ?? null
  const under1500 = fleet?.under(1500) ?? null
  const clubMedian = prices?.clubMedian ?? null
  const clubMax = prices?.clubMax ?? null
  const carDay = RENTAL_PRICES.carPerDay.amount
  const highSeasonBoat = RENTAL_PRICES.highSeasonDay.amount

  const faqs: Faq[] = [
    ...FAQS_BASE,
    {
      q: 'How much does a private boat day in Ibiza cost?',
      a: boatLow && boatHigh
        ? `Our fleet runs from ${eurUsd(boatLow, fx)} a day for the smallest motorboat in low season to ${eurUsd(boatHigh, fx)} a day for the largest yacht in high season${under1500 ? `; ${under1500} of the ${fleet!.total} boats are under €1,500 a day` : ''}. Skipper and fuel are itemized per boat and confirmed before you book.`
        : 'Rates depend on the boat, the season and whether a skipper is included, and are confirmed per date. Send us your date and group size for the real figure.',
    },
  ]

  const budgetRows = [
    {
      label: 'Private boat day to Formentera',
      note: fleet ? `Real day rates across ${fleet.total} boats, skipper and fuel itemized per boat; the floor is the smallest motorboat in low season, the ceiling the largest yacht in August` : 'Confirmed per boat and date',
      eur: boatLow,
      unit: fleet ? `from, per day · up to €${boatHigh?.toLocaleString('en-US')}` : 'per day',
    },
    ...(highSeasonBoat
      ? [{ label: 'Boat day in July or August', note: 'The high-season floor across the fleet', eur: highSeasonBoat, unit: 'from, per day' }]
      : []),
    {
      label: 'Club entry, one night',
      note: prices ? `Median cheapest ticket across ${prices.clubN} dated club nights, ${prices.from} to ${prices.to}` : 'Official tickets via ClubTickets',
      eur: clubMedian,
      unit: prices ? `per person · headline shows up to €${clubMax}` : 'per person',
    },
    { label: 'VIP table at a superclub', note: 'A minimum spend credited to bottles, set per night and DJ', eur: null, unit: 'quoted per date' },
    { label: 'Rental car, all-inclusive', note: 'Wiber Rent a Car, five minutes from the airport, zero excess', eur: carDay, unit: 'per day' },
    { label: 'Private airport transfer', note: 'Fixed price per car, driver tracks your flight', eur: null, unit: 'per car' },
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
        h1="The 5-Day Luxury Ibiza Itinerary"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Five days, one big thing a day: a private yacht to Formentera, a west-coast beach club, the two
              club nights worth doing, and the quiet north.
              {boatLow ? ` A private boat day starts at ${eurUsd(boatLow, fx)}` : ''}
              {clubMedian ? `${boatLow ? ', ' : ' '}club entry runs a median of ${eurUsd(clubMedian, fx)} a night` : ''}
              {boatLow || clubMedian ? ', and a VIP table is a minimum spend we quote per date.' : ''}
              {' '}Everything below is booked over WhatsApp with someone who lives here.
            </p>
            <p className="mt-4">
              Built for a US arrival: day one assumes you land mid-afternoon after a one-stop flight, and day five
              assumes a morning departure so the westbound connection is not the last flight of the day.
            </p>
          </>
        }
      />

      {/* The plan itself. An ordered list, not cards: an itinerary is a sequence
          and a crawler should read it as one. */}
      <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">Day by day</h2>
          <ol className="mt-8 space-y-10">
            {DAYS.map((d) => (
              <li key={d.n} className="relative border-l-2 border-gold/60 pl-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gold">Day {d.n}</p>
                <h3 className="mt-1 font-serif text-xl font-black leading-snug tracking-tight">{d.title}</h3>
                <p className="mt-1 text-[13px] font-medium text-neutral-500">{d.where}</p>
                {d.plan.map((p, i) => (
                  <p key={i} className="mt-3 text-[16px] leading-relaxed text-neutral-700">{p}</p>
                ))}
                {d.book ? (
                  <Link href={`/en/${d.book.href}`} className="mt-4 inline-block text-[14px] font-semibold text-neutral-900 underline underline-offset-2 hover:text-gold">
                    {d.book.label} →
                  </Link>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BudgetTable fx={fx} rows={budgetRows} />

      <ProseSection
        heading="What we would tell a friend flying in from the States"
        paragraphs={[
          'Book the boat before the hotel. A skippered yacht on a Saturday in August is the scarcest thing on this itinerary; hotel rooms are not. We hold boats on request, and the good ones are gone three to five weeks out in peak season.',
          'Do Ushuaïa before Hï, not the other way around. The daytime club ends at midnight, which is 6 p.m. on your Eastern body clock on day three; the night club starts when Ushuaïa ends. Doing both in one evening is the classic Ibiza double and it works better jet-lagged than any of the midnight-only clubs.',
          'Buy club tickets by date, from an official seller, weeks ahead for headline names. The prices are dynamic and rise toward the night. Guestlist is not free at the big shows; what it means there is a discounted or timed entry, and it is never guaranteed.',
          'Rent the car for all five days rather than two. The north is not reachable any other way that makes sense, and two days of taxis to Benirràs and back costs about what the extra rental days do, without the freedom. Bring the International Driving Permit.',
          'Formentera by private boat beats Formentera by ferry for this trip. The ferry is 30 minutes and cheap, but the point of the island is the water off Illetes and Espalmador, and a boat puts you in it instead of on a beach bed looking at it.',
        ]}
      />

      <Proof locale={LOCALE} />

      <FaqAccordion faqs={faqs} locale={LOCALE} />

      <WhatsAppCta
        locale={LOCALE}
        heading="Want this itinerary priced for your dates?"
        body="Send us your dates and group size. We come back with the boat that fits, the club nights that are actually on, and a real number for a table on the night you want, in euros with the dollar estimate alongside."
        prefill="Hi Simon! We're coming from the US for 5 days on [dates], [number] people. Can you price the luxury itinerary for us?"
      />

      <InternalLinks
        heading="The pieces of the plan"
        locale={LOCALE}
        links={[
          { label: 'Boat rental in Ibiza', href: 'boats', body: 'The fleet, day rates by season, and what a rate includes.' },
          { label: 'Ibiza club tickets 2026', href: 'ibiza-club-tickets', body: 'What entry costs, measured from the live agenda.' },
          { label: 'Package deals and VIP tables', href: 'package-deals', body: 'How minimum spends work and how we quote them.' },
        ]}
      />

      <UsClusterLinks current={PATH} />

      <AuthorByline locale={LOCALE} topic="a luxury Ibiza itinerary" />
    </>
  )
}
