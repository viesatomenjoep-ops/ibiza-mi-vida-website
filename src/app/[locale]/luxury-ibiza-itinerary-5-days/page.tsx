import type { Metadata } from 'next'
import Link from 'next/link'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
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
  'How Americans should plan five days in Ibiza: what each day is for, when to book what, and how jet lag, the season and the driving rules shape the trip.'

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

/**
 * De vijf dagen als planningskader, niet als uurschema.
 *
 * Stond hier eerst per dag uitgeschreven ("om 10 of 11 uur vertrekt de boot",
 * "diner om 22:00"). Dat leest als een script dat je moet volgen, terwijl een
 * Amerikaan die maanden vooruit boekt iets anders nodig heeft: waar elke dag
 * vóór is, wat je erover moet weten en waar je rekening mee houdt. Een
 * bezoeker die op dag drie regent of die geen zin heeft in een clubnacht kan
 * met een kader wél schuiven en met een uurschema niet.
 *
 * De volgorde blijft er wel in, want die is niet willekeurig — hij loopt mee
 * met een jetlag die de eerste twee dagen regeert en met een vertrek dat een
 * ochtendvlucht wil.
 */
interface DayPlan {
  n: number
  /** Waar de dag voor is, in gewone taal. */
  title: string
  /** Eén regel: wat deze dag oplevert. */
  premise: string
  /** Waar je rekening mee houdt. Overwegingen, geen tijdstippen. */
  notes: string[]
  book?: { label: string; href: string }
}

const PLAN: DayPlan[] = [
  {
    n: 1,
    title: 'The arrival day',
    premise: 'Do one easy thing and eat late. Nothing that needs booking, nothing that starts after midnight.',
    notes: [
      'Most one-stop routes from the East Coast land between noon and three in the afternoon, which is the good arrival: rooms are ready and the evening is still ahead of you. Build the rest of the trip around whatever your flight actually does, not around this page.',
      'Base yourself in Ibiza Town or Talamanca for a first trip and everything on this list is inside half an hour. San Antonio suits you only if the west-coast sunset bars are the point.',
      'Dinner here starts around ten and nobody thinks that is late. Book the first night before you fly; the good tables go, and hunting for one while jet-lagged is a bad start.',
      'Your body clock is six hours behind on the East Coast and nine on the West. Fighting that on night one costs you day two, which is the day you came for.',
    ],
    book: { label: 'Arrange the airport pickup', href: 'ibiza-airport-transfer' },
  },
  {
    n: 2,
    title: 'A day on the water',
    premise: 'The day that justifies the trip, and the one thing you book before anything else.',
    notes: [
      'Formentera is the classic run: under an hour by boat from Ibiza Town, and the water off Espalmador and Ses Illetes is what people photograph. A shorter west-coast day around Cala Bassa and Cala Comte works just as well if the wind is up.',
      'Book this first, before the hotel. In July and August the boats with a skipper go weeks ahead; hotel rooms do not. This is the scarcest thing on your whole trip.',
      'Ask what the rate includes before you compare two boats. Fuel is billed separately on nearly every charter here, and a skipper is itemized per boat. The cheaper headline number is often the more expensive day.',
      'Weather decides, not you. Strong wind means a different route or another date. Leave a spare day in the middle of the trip so a cancelled boat day still happens.',
    ],
    book: { label: 'See the fleet and day rates', href: 'boats' },
  },
  {
    n: 3,
    title: 'A beach club day, and your first night out',
    premise: 'Slow afternoon on the west coast, then the club night that works best on an American body clock.',
    notes: [
      'The west-coast beach clubs run from late morning. Reserve a bed for anything in peak season; walking up on a Saturday in August does not work.',
      'Start with a daytime open-air club rather than a midnight one. Doors are mid-afternoon, the headline set is in the early evening and the music stops by midnight, which is a far kinder first night than a set that starts at three.',
      'The midnight clubs are across the road and open as the daytime ones close, so you can do both in one evening if you want the full version. That is the classic Ibiza double and it is easier jet-lagged than either one alone.',
      'Buy club tickets by date and well ahead for headline names. Prices are dynamic and rise toward the night. A guestlist is not free entry at the big shows, whatever anyone promises.',
    ],
    book: { label: 'Club tickets and the calendar', href: 'ibiza-club-tickets' },
  },
  {
    n: 4,
    title: 'A day away from the coast',
    premise: 'The half of the island most visitors never see, and the night to spend on a table if you want one.',
    notes: [
      'The north is quieter, greener and reachable only by car. This is the day the rental pays for itself; two days of taxis to the north and back cost about what the extra rental days do.',
      'Bring an International Driving Permit with your US license. Spain requires it, rental desks can refuse the car without one, and it cannot be obtained once you are here.',
      'Village lunches and swimming coves rather than beach clubs. Sunday afternoons at the northern beaches have their own crowd and their own drum circle; midweek is close to empty.',
      'A VIP table is a minimum spend, not a ticket price: you commit a figure that is credited against bottles for the night, and it moves with the date and the DJ. That is why we quote it per night over WhatsApp instead of printing a number that would be wrong within a week.',
    ],
    book: { label: 'How package deals and tables work', href: 'package-deals' },
  },
  {
    n: 5,
    title: 'The departure day',
    premise: 'Plan it backwards from the connection, not from the hotel checkout.',
    notes: [
      'Take an early flight off the island. The risk on a westbound day is the connection in Madrid or Barcelona; a late Ibiza departure puts you on the last transatlantic flight of the day with nothing behind it.',
      'Ibiza airport is small and the summer security line is not. Three hours before departure in July and August is not excessive.',
      'Return a rental car at the off-airport office and take the shuttle back; budget the extra half hour rather than assuming you can drop it at the terminal.',
      'Keep the last morning free of anything that has to be booked. A market or the old-town shops absorb a delay; a reserved lunch does not.',
    ],
    book: { label: 'Flights back to the US', href: 'flights-to-ibiza-from-usa' },
  },
]

/**
 * De dingen die de vorm van de hele reis bepalen en die losstaan van welke dag
 * dan ook. Dit is wat een Amerikaan die maanden vooruit plant het eerst moet
 * weten; de dagen hierboven zijn de invulling.
 */
const PLAN_AROUND: { name: string; body: string }[] = [
  {
    name: 'Book in this order',
    body: 'Boat first, then the headline club nights, then the car, then the hotel. The first two are dated and scarce; rooms and restaurants are not. Every August we hear from someone who booked the hotel in March and the boat in July, and there was no boat left.',
  },
  {
    name: 'Jet lag runs the first two days',
    body: 'Six hours from New York, nine from Los Angeles, and a night here starts when you would normally be asleep. Put the easy day first and the water day second; save a real club night for when you have slept.',
  },
  {
    name: 'When you come changes everything',
    body: 'Late June and September are the sweet spot: everything is open, the sea is warm, and flights and rooms cost less than in July and August. The season runs May to October. Peak weeks mean higher boat rates, reserved beach beds and clubs at capacity.',
  },
  {
    name: 'Paperwork is a before-you-fly job',
    body: 'A US passport needs three months of validity beyond your departure. Driving needs an International Driving Permit alongside your license. Both are simple and neither can be fixed on the island.',
  },
  {
    name: 'Leave slack in the middle',
    body: 'Wind cancels boat days and a line-up can change. A trip with something booked every single day has nowhere to move things to. Five days with four fixed plans works; five days with five does not.',
  },
  {
    name: 'What a rate includes',
    body: 'Boats are quoted with or without a skipper and almost always without fuel. A table is a spend, not a fee. A car with our partner is all-inclusive and often is not elsewhere. Compare what is in the price, not the price.',
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
          <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">What each of the five days is for</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-neutral-700">
            Not an hour-by-hour script. Five days, each with one job, and what to weigh up when you plan it.
            The order matters more than the details: it runs with the jet lag at the start and with a morning
            flight at the end. Everything inside a day can move.
          </p>
          <ol className="mt-9 space-y-11">
            {PLAN.map((d) => (
              <li key={d.n} className="relative border-l-2 border-gold/60 pl-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gold">Day {d.n}</p>
                <h3 className="mt-1 font-serif text-xl font-black leading-snug tracking-tight">{d.title}</h3>
                <p className="mt-2 text-[16px] font-semibold leading-relaxed text-neutral-800">{d.premise}</p>
                <ul className="mt-4 space-y-3">
                  {d.notes.map((n, i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <p className="text-[16px] leading-relaxed text-neutral-700">{n}</p>
                    </li>
                  ))}
                </ul>
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

      {/* De overwegingen die losstaan van welke dag dan ook. Staan bewust vóór de
          kostentabel: wie dit leest wil eerst weten hoe hij plant en daarna wat
          het kost. */}
      <ItemGrid
        heading="What to plan around"
        intro="Six things that shape a five-day trip more than the choice of any single day. Read these before you book anything."
        columns={3}
        items={PLAN_AROUND}
      />

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
