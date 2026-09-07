import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, PriceTable, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { getPriceStats } from '@/lib/price-stats'
import { getSeasonStats } from '@/lib/season-stats'
import { getVenues } from '@/lib/clubtickets'
import { ctBrowseLink } from '@/lib/ct-link'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'ibiza-nightlife'

/**
 * De gids die bóven /clubs, /calendar en /ibiza-club-tickets hangt.
 *
 * Waarom dit geen vierde URL op dezelfde zoekvraag is — de test die
 * docs/seo/SLUG-DECISIONS.md aan elke slug oplegt:
 *   /clubs             is een index: welke zalen bestaan er
 *   /calendar          is een agenda: wie draait er wanneer
 *   /ibiza-club-tickets gaat over geld: wat kost een kaartje
 *   deze pagina        gaat over hoe een avond wérkt: wanneer begint wat, in
 *                      welke volgorde, wat trek je aan, hoe kom je thuis
 * Dat is een informatieve intentie die geen van de drie draagt, en alle drie
 * krijgen hier een link.
 *
 * De cijfers in de lead komen uit de agenda (price-stats, season-stats,
 * clubtickets) en niet uit een overgetypte zin. Een antwoordmachine citeert de
 * pagina die in de eerste alinea telbare feiten heeft staan, en een
 * overgetypt getal loopt stil achter zodra het seizoen draait. Ontbreekt de
 * data, dan valt de zin weg in plaats van een gat te tonen.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ibiza Nightlife Guide 2026',
    description:
      'How a night out in Ibiza actually works: when clubs open, what a ticket costs, the beach-club-to-club sequence, dress codes and how to get home.',
    alternates: localizedAlternates('nightlife-guide', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Ibiza Nightlife Guide 2026',
      description: 'When the night starts, what it costs, and how to get home.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Ibiza nightlife' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza nightlife' },
]

const FAQS: Faq[] = [
  {
    q: 'What time does Ibiza nightlife start?',
    a: 'Later than almost anywhere else. Night clubs open around midnight and run to six in the morning, with the headline set usually between two and four. Before that, the island runs on beach clubs and daytime venues from lunchtime onwards, and dinner happens around ten. Turning up at a night club at opening means watching a warm-up in an empty room.',
  },
  {
    q: 'How many nights do I need in Ibiza?',
    a: 'Four is the honest minimum if clubbing is the point, and it is not about the number of clubs. A club night ends at six and costs you the following day, so three consecutive nights out is two nights out and one write-off. Four nights lets you do two big nights, one beach-club day and one recovery day without the trip becoming an endurance test.',
  },
  {
    q: 'What is the difference between a beach club and a night club here?',
    a: 'Time of day and what you are paying for. Beach clubs run from late morning to sunset, and you pay for a sunbed or a table rather than entry. Night clubs open at midnight and charge admission. Ushuaïa sits between the two: it is an open-air venue that runs in daylight, from late afternoon to around midnight, with a ticket like a club.',
  },
  {
    q: 'Do I need to book Ibiza club tickets in advance?',
    a: 'For the nights that matter, yes. Opening parties in May, closing parties in late September and October, and any headline Saturday in August genuinely sell out. A midweek night in June generally does not. If your trip is built around one specific night, buy it when you book the flight rather than when you land.',
  },
  {
    q: 'Which area should I stay in for nightlife?',
    a: 'Playa d\'en Bossa if the big clubs are the point — Ushuaïa, Hï and UNVRS are all walkable or a short ride, and you can get home without planning it. Ibiza Town if you want dinner and the old town alongside the clubs. San Antonio for sunset bars and a younger, cheaper scene. Anywhere else and every night out ends with a taxi conversation.',
  },
  {
    q: 'How much should I budget for a night out?',
    a: 'Entry is the smaller half. Drinks inside the major clubs are priced accordingly, and the bar bill overtakes the ticket faster than people expect — that is the part first-timers underestimate, not the ticket. Add the ride home, which on a road-location club at closing time is not a rounding error. Our Ibiza prices page publishes measured entry prices per club, recomputed from the live agenda.',
  },
  {
    q: 'Is the Ibiza guestlist free?',
    a: 'Not by default, and anyone telling you otherwise is selling something. Being on a list means one of three things depending on the club and the night: free entry before a cut-off time, a reduced door price, or a faster queue. Nearly every list has a cut-off, and after it you pay the normal door price. Signing up through us is free and the terms are confirmed before you rely on them.',
  },
  {
    q: 'What is the dress code?',
    a: 'Less strict than people expect at most venues, and stricter than people assume at the top end. Beachwear, football shirts and flip-flops get refused at the main clubs; trainers are fine everywhere and nobody needs a jacket. The exceptions are the dinner-show venues, which do enforce a real dress code. We have a page on this.',
  },
  {
    q: 'Is there an age limit?',
    a: 'Eighteen, checked with physical photo ID at the door of every major club regardless of tickets, tables or lists. A photo of your passport on a phone is not accepted at most venues. This is Spanish law rather than club policy, so the door has no discretion and there is no point arguing it at four in the morning.',
  },
]

const SEQUENCE = [
  {
    name: 'Afternoon — beach club',
    body:
      'From late morning to sunset. You pay for a bed or a table rather than entry, and the music builds through the afternoon. This is where most of the island\'s daylight hours go, and it is also where a group decides what it is doing that night.',
  },
  {
    name: 'Sunset — the west coast',
    body:
      'San Antonio\'s sunset strip and the west-coast bays are a fixed part of the day here, not an optional extra. Roughly an hour either side of sunset, and then everyone moves. If you are doing one non-club thing on the island, this is it.',
  },
  {
    name: 'Evening — dinner, around ten',
    body:
      'Eating at eight marks you as a tourist and, more practically, leaves you with four empty hours. Ten is normal. The dinner-show venues run in this slot and are a night out in themselves rather than a warm-up.',
  },
  {
    name: 'Midnight to six — the club',
    body:
      'Doors around midnight, headline set between two and four, out at six. The exception is the open-air daytime venues, which run late afternoon to around midnight — which is why some people do one of each in a day and write off the next.',
  },
]

export default async function IbizaNightlifePage() {
  const [prices, season, venues] = await Promise.all([
    getPriceStats(LOCALE),
    getSeasonStats(LOCALE),
    getVenues(LOCALE),
  ])
  const clubCount = venues.filter((v) => (v as any).type?.slug === 'clubbing').length

  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Ibiza Nightlife Guide 2026"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Ibiza nightlife runs on a schedule that surprises first-timers: night clubs open around
              midnight and close at six, the headline set lands between two and four, and the hours before
              that belong to beach clubs and a ten o’clock dinner.
              {clubCount ? ` We cover ${clubCount} clubs on the island` : ' The major clubs'}
              {prices
                ? `, and across ${prices.clubN} dated club nights the median cheapest entry ticket is €${prices.clubMedian}, with half of all nights between €${prices.clubQ1} and €${prices.clubQ3}.`
                : '.'}
            </p>
            <p className="mt-4">
              {prices
                ? `Those are measured from our own live agenda rather than quoted from anywhere: ${prices.clubBuckets.under40}% of nights come in under €40, ${prices.clubBuckets.over80}% over €80. `
                : ''}
              This page is how the night fits together. For who is playing, use the calendar; for what a
              specific room costs, the prices page.
            </p>
          </>
        }
      >
        <div className="mt-7">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            See what is on this week
          </AffiliateLink>
        </div>
      </HubHero>

      <ItemGrid
        heading="How a day here actually runs"
        intro="Nothing about this is written down anywhere on arrival, and getting it wrong is the difference between three good nights and one."
        items={SEQUENCE}
        columns={2}
      />

      {prices && (
        <PriceTable
          heading="What entry costs, measured"
          locale={LOCALE}
          caption="Measured club entry prices from the live agenda"
          intro={`From ${prices.clubN} dated club nights across ${prices.venues.length} venues between ${prices.from} and ${prices.to}. Entry only — drinks, tables and transport are separate, and together they are the larger half of the evening.`}
          rows={[
            { label: 'Cheapest night in the agenda', amount: prices.clubMin, unit: 'per person' },
            { label: 'Median night', note: 'Half of all nights cost less than this', amount: prices.clubMedian, unit: 'per person' },
            { label: 'Typical range', note: 'The middle half of all nights', amount: prices.clubQ3, unit: `from €${prices.clubQ1} to €${prices.clubQ3}` },
          ]}
        />
      )}

      <ProseSection
        heading="Where to base yourself"
        paragraphs={[
          'Playa d’en Bossa is the practical answer if the big rooms are why you came. Three of the island’s largest venues sit on or beside the same strip, so a night out ends with a walk rather than a negotiation, and the beach clubs that fill the afternoon are on the same stretch of sand. The trade is that it is a strip: you are staying in the nightlife rather than near it.',
          'Ibiza Town suits a trip that is not only about clubbing. You get the old town and the harbour, dinner that is worth the ten o’clock slot, and one major club within walking distance. Everything else is a short ride. This is the version most people over thirty enjoy more, and it is also the base that survives a rainy day.',
          'San Antonio is the cheaper, younger end, and it owns the sunset. The trade-off is distance: the biggest rooms are on the other side of the island, and the return journey at six in the morning is a real cost that people discover on night two rather than when booking.',
          'Anywhere else — Santa Eulalia, the north, an inland villa — is a lovely holiday with a transport problem attached to every night out. It works if someone is driving and not drinking. It does not work as an afterthought.',
        ]}
      />

      {season && (
        <ProseSection
          heading="When the season runs"
          paragraphs={[
            `The published agenda currently runs from ${season.from} to ${season.to}, with ${season.openNow} of ${season.venues.length} clubs still having nights ahead. July and August are the densest months and also the most expensive; May, June, September and October are cheaper, quieter and, for a lot of people, better.`,
            'The two dates that behave differently are the openings and the closings. Opening parties in May and closing parties in late September and October sell out earliest, draw the strongest line-ups, and are the nights people plan flights around rather than fit in. If one of them is the reason for your trip, book the ticket before the flight.',
            'A club’s last scheduled night in our agenda is not proof it is shut afterwards — programmes get extended. It is the last date we can honestly show you, which is a different claim, and the season page lists it per club.',
          ]}
        />
      )}

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Next steps"
        locale={LOCALE}
        links={[
          { label: 'Ibiza club calendar', href: 'calendar', body: 'Every dated night on the island, by day and by venue.' },
          { label: 'Ibiza club tickets 2026', href: 'ibiza-club-tickets', body: 'What entry costs per room, and when nights sell out.' },
          { label: 'All clubs', href: 'clubs', body: 'Every venue we cover, each with its own live programme.' },
          { label: 'Ibiza club dress code', href: 'ibiza-club-dress-code', body: 'What actually gets refused at the door, venue by venue.' },
          { label: 'Getting around Ibiza', href: 'getting-around-ibiza', body: 'Bus, taxi, hire car or boat — and the ride home at six.' },
          { label: 'Ibiza guestlist', href: 'guestlist', body: 'What a list gets you, per club and per night.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Ibiza nightlife" />
    </>
  )
}
