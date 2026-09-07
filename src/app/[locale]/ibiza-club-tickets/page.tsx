import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { ctBrowseLink } from '@/lib/ct-link'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'ibiza-club-tickets'

/**
 * Club tickets hub.
 *
 * Price ranges here are the observable market — what a ticket to these rooms
 * costs, which is public and checkable — rather than our own rate card. That
 * distinction matters: we are a reseller through ClubTickets, so quoting "our
 * price" for a headline show would be a commitment we cannot hold across a
 * season of dynamic pricing.
 *
 * Every club CTA goes through <AffiliateLink>, so rel="sponsored" and the
 * disclosure are structural rather than remembered.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ibiza Club Tickets 2026',
    description:
      'Ibiza club tickets for 2026: €20–30 midweek, €50–125+ for headline shows at UNVRS, Hï and Ushuaïa. Why openings and closings sell out first.',
    alternates: localizedAlternates('club-tickets-hub', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Ibiza Club Tickets 2026',
      description: 'What Ibiza club tickets cost in 2026, club by club, and when they sell out.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Ibiza club tickets' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza club tickets' },
]

const FAQS: Faq[] = [
  {
    q: 'How much are Ibiza club tickets?',
    a: 'Two different worlds. A smaller midweek night runs about €20 to €30. A headline show at UNVRS, Hï Ibiza or Ushuaïa runs €50 to €125 and beyond, depending on the artist and how close to the date you buy. Prices are dynamic: the same ticket genuinely costs more in the last week than it did in April, and the cheapest tier disappears first.',
  },
  {
    q: 'Do Ibiza clubs sell out?',
    a: 'The big nights do, and predictably so. Opening parties in late April and May, closing parties in late September and October, and any night with a headline name on a Saturday in August are the ones that go. A random Tuesday in June generally does not. If your trip is built around one specific night, buy it when you book the flight, not when you land.',
  },
  {
    q: 'Should I buy online or at the door?',
    a: 'Online, for two reasons that have nothing to do with price. You get guaranteed entry on a night that might sell out, and you pay the official rate rather than whatever a tout outside quotes you. Door prices are not reliably cheaper, and on a busy night the door may simply be closed.',
  },
  {
    q: 'What is the dress code?',
    a: 'Less strict than people expect, and stricter than people assume at the top end. Beach clothes, football shirts and flip-flops get refused at the main clubs. Ushuaïa is a daytime pool venue and dresses accordingly; Hï and UNVRS after midnight lean towards going-out clothes. Nobody needs a jacket. Trainers are fine everywhere.',
  },
  {
    q: 'How late do clubs open and close?',
    a: 'Late by any standard other than Ibiza\'s. The night clubs typically open around midnight and run to six in the morning, with the main act often on at two or three. Ushuaïa is the exception and runs in daylight, roughly from late afternoon to around midnight. Turning up at Hï at midnight means watching a warm-up in an empty room.',
  },
  {
    q: 'Can I buy tickets for someone else?',
    a: 'Yes. Tickets are issued to a name but are checked as a QR code at the door in most rooms, so buying for a group is normal and one person can hold them all. Where a venue does check ID against the name, we tell you before you buy rather than after.',
  },
  {
    q: 'What is included in the ticket price?',
    a: 'Entry, and nothing else. Drinks are bought inside and are expensive — that is the part of the budget people underestimate, not the ticket. Table service, drinks packages and guestlist arrangements are separate things; see the guestlist page for how those actually work.',
  },
  {
    q: 'Is there an age limit?',
    a: 'Eighteen, and it is enforced with photo ID at the door of every major club. A photo of your passport on your phone is not accepted at most venues. Bring the physical document.',
  },
]

const CLUBS = [
  {
    name: 'UNVRS',
    body:
      'The newest and largest room on the island, built for the scale of show that used to need a stadium. Headline bookings and headline prices; this is where the €125-plus tickets live.',
  },
  {
    name: 'Hï Ibiza',
    body:
      'Playa d\'en Bossa, consistently at the top of the global club lists, with two main rooms running different sounds on the same night. The safe choice if you only have one night out.',
  },
  {
    name: 'Ushuaïa',
    body:
      'The open-air one, and the only major venue that runs in daylight. Late afternoon to around midnight, poolside, with the crowd in swimwear early and going-out clothes later.',
  },
  {
    name: 'Eden',
    body:
      'San Antonio, and the room that anchors the west-side night. Big floor, broad bookings, and a night out that costs noticeably less than the same night at Playa d\'en Bossa.',
  },
  {
    name: 'O Beach',
    body:
      'The daytime one, also in San Antonio: poolside from lunchtime, show-driven, and finished by the time the night clubs open. The other half of a full day rather than a rival to it.',
  },
]

/**
 * "Ibiza club zonder lange rij" — met de eerlijke grens erbij.
 *
 * Het zoekplan ging ervan uit dat deze vraag hier al in de FAQ stond en alleen
 * naar een H2 getild hoefde te worden. Dat klopte niet: het antwoord stond op
 * /guestlist (als één van de drie uitkomsten van een lijstplek) en verder
 * nergens. Hij is dus geschreven in plaats van verplaatst.
 *
 * Waarom dit stuk voorzichtig is met beloften: "sla de rij over" is precies het
 * soort claim dat elke ticketsite maakt en niemand kan waarmaken. Wij kunnen
 * drie dingen aanwijzen die de wachttijd echt korter maken, en één ding dat
 * niet werkt — en dat laatste hoort er even hard bij, want iemand die met een
 * gekocht ticket in een rij van veertig minuten staat voelt zich bedrogen door
 * de pagina die hem dat ticket verkocht.
 *
 * Geen enkele bewering hier over een betaalde fast-track: die verschilt per
 * zaal en per avond en we hebben er geen bevestigde lijst van.
 */
const QUEUE = [
  {
    name: 'Buy before you go, not at the door',
    body:
      'The longest line at most venues is the box office, not the entrance. A ticket bought in advance puts you in the ticket-holder line, which moves at the speed of a QR scan. This is the one that makes the biggest difference and it costs nothing extra — door prices are not reliably cheaper anyway.',
  },
  {
    name: 'Ask whether there is a list for your night',
    body:
      'A guest list place sometimes means a separate, faster entrance rather than a cheaper ticket — which of the two you get depends on the club and the night. We confirm which one applies before you go, so it is worth asking even when the entry price is not the issue.',
  },
  {
    name: 'Arrive before the headline slot',
    body:
      'Night clubs open around midnight and the main act is usually on between two and four. The door is busiest in the hour before that name plays. Being inside beforehand is the difference between walking in and standing still, and it costs you nothing but an earlier taxi.',
  },
  {
    name: 'What does not work',
    body:
      'A ticket is not a fast pass. On a sold-out headline night everyone waits, and nobody selling you a ticket — us included — can promise you a specific wait at a door they do not staff. Anyone who does promise that is guessing on your behalf.',
  },
]

export default function IbizaClubTicketsPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Ibiza Club Tickets 2026"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Expect €20 to €30 for a smaller midweek night and €50 to €125 or more for a headline show at
              UNVRS, Hï Ibiza or Ushuaïa. Buy online rather than at the door: you get guaranteed entry at
              the official price, and the nights that matter — openings in May, closings in late September
              and October, and headline Saturdays in August — genuinely sell out.
            </p>
            <p className="mt-4">
              Pricing is dynamic across the season. The same ticket costs more in the final week than it did
              in spring, and the cheapest tier always goes first.
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

      <PriceTable
        heading="What a night out costs"
        locale={LOCALE}
        caption="Typical ticket price ranges by night type"
        intro="Observed market ranges for entry only, not our rate card. Drinks are extra and are where most of the budget actually goes."
        rows={[
          { label: 'Midweek, smaller night', note: 'Resident DJs, off-peak dates', amount: 20, unit: 'from, per person' },
          { label: 'Weekend, established night', note: 'Eden, Es Paradis, Ushuaïa', amount: 40, unit: 'from, per person' },
          { label: 'Headline show', note: 'UNVRS, Hï, Ushuaïa main bookings', amount: 50, unit: 'from, rising to €125+' },
        ]}
      />

      <ItemGrid heading="The clubs" intro="Five rooms cover most of what people come for. They are genuinely different nights out, not five versions of the same one." items={CLUBS} />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-5xl px-4">
          <AffiliateLink href={ctBrowseLink(LOCALE)} partner="ClubTickets" locale={LOCALE}>
            Check dates and buy tickets
          </AffiliateLink>
        </div>
      </div>

      <ItemGrid
        heading="Can you skip the queue at an Ibiza club?"
        intro="Partly, and the thing that works best is the cheapest: a ticket bought before you arrive puts you in the ticket-holder line instead of the box-office line, and that is where the wait usually is. Two other things help. One thing that everyone claims does not."
        items={QUEUE}
        columns={2}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Ibiza guestlist and VIP tables', href: 'guestlist', body: 'What guestlist really means here, and what a table actually costs.' },
          { label: 'Boat parties in Ibiza', href: 'boat-party', body: 'The daytime version, before the club night starts.' },
          { label: 'Car rental in Ibiza', href: 'car-rental-ibiza', body: 'Getting out to San Antonio and back without a taxi surge at six.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Ibiza club tickets" />
    </>
  )
}
