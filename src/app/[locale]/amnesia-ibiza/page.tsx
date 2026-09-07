import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { venuePagePublished } from '@/lib/pending-venues'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'amnesia-ibiza'

/**
 * Amnesia — gids, geen verkooppagina. Zie de kop van pacha-ibiza/page.tsx voor
 * de redenering: de club staat niet in de ClubTickets-feed, dus geen boekknop
 * en geen ticketclaim, en dat staat in de eerste alinea in plaats van in een
 * voetnoot.
 *
 * De invalshoek hier is bewust anders dan die van Pacha en DC-10: Amnesia is
 * het verhaal van twee zalen met twee verschillende avonden onder één dak, en
 * van de rit terug naar San Antonio. Drie clubpagina's die dezelfde zinnen
 * herschikken zijn voor Google één pagina.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Amnesia Ibiza Tickets & Events 2026',
    description:
      'Amnesia Ibiza in 2026: two rooms, the Terrace and the Club Room, on the San Antonio road. How the night runs, what to wear, and how to get home.',
    alternates: localizedAlternates('amnesia-venue', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Amnesia Ibiza Tickets & Events 2026',
      description: 'The Terrace, the Club Room, and how an Amnesia night actually works.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Amnesia Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Clubs', path: 'clubs' },
  { name: 'Amnesia Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'Can I book Amnesia tickets through Ibiza Mi Vida?',
    a: 'No. Amnesia is not in our ticketing partner’s catalogue, so entry tickets come from the club’s own channels rather than from us. We say that here rather than at checkout. What Simon does handle is guestlist and table enquiries for Amnesia over WhatsApp, and the full live agenda and tickets for the clubs we do sell, including UNVRS, Hï Ibiza and Ushuaïa.',
  },
  {
    q: 'Where is Amnesia Ibiza?',
    a: 'On the Ibiza–San Antonio road at San Rafael, roughly halfway between the two towns and not walkable from either. That location is the single biggest practical difference between Amnesia and the clubs in town: everything about the night, including what it costs, is shaped by how you get back at six in the morning.',
  },
  {
    q: 'What is the difference between the Terrace and the Club Room?',
    a: 'They are two separate rooms running two separate line-ups on the same ticket, and people pick a night by room as much as by artist. The Terrace is the glass-roofed one and the bigger draw; the Club Room is darker, tighter and usually the harder of the two. Walking between them mid-set is part of how the night works — do not settle in one room for six hours.',
  },
  {
    q: 'How do I get back from Amnesia at closing time?',
    a: 'Plan it before you go, because it is where Amnesia nights go wrong. Taxis at closing are a queue rather than a given, and the club sits on a road between two towns rather than in one. The reliable options are a pre-booked return, a discobus service running on your night, or one person in the group who is not drinking and drove. Deciding this at six in the morning is the expensive version.',
  },
  {
    q: 'What time does Amnesia open and close?',
    a: 'Doors around midnight, running until roughly six, and on some nights later than the clubs in town. The rooms fill later than people expect: at one in the morning the Terrace is still filling. If your plan is to arrive at opening and stay to the end, you are looking at a six-hour night, which is more than most first-timers actually want.',
  },
  {
    q: 'What is the dress code?',
    a: 'Relaxed by Ibiza standards and the least formal of the historic clubs. Trainers, shorts and a T-shirt are fine; beachwear, football shirts and flip-flops are not. Nobody at Amnesia is dressing for the room the way they do at Pacha or Lío. Bring something with pockets you can close — the foam nights are a real thing and phones do not survive them.',
  },
  {
    q: 'What is an Amnesia foam party?',
    a: 'Exactly what it says: the room is filled with foam during the night, and it is one of the things Amnesia is known for on the island. Practically, it means anything you are carrying gets wet — leave the good trainers at the apartment, keep your phone in something sealed, and expect to go home damp. Check the specific night before you build a plan around it.',
  },
  {
    q: 'Is there an age limit?',
    a: 'Eighteen, checked with photo ID at the door on every night regardless of tickets, tables or lists. A photo of your passport on a phone is not accepted at the door. This is Spanish law rather than club policy, so there is no discretion available and no point arguing it at four in the morning.',
  },
]

const ROOMS = [
  {
    name: 'The Terrace',
    body:
      'The glass-roofed room, and the one most people mean when they say they are going to Amnesia. Bigger, brighter, and the room that gets the headline booking on most nights. It is also where the room fills last and empties last.',
  },
  {
    name: 'The Club Room',
    body:
      'Darker, lower and tighter, usually running the harder end of whatever the night is. On a good night it is the better room after three in the morning, and it is the reason a single Amnesia ticket can feel like two different nights out.',
  },
  {
    name: 'Openings and closings',
    body:
      'The start and end of the season are Amnesia’s biggest dates, and they sell differently from a normal summer night: earlier, faster, and to people who booked flights around them. If your trip is built on one of those dates, sort entry when you book the flight.',
  },
]

const PRACTICAL = [
  {
    name: 'Getting there',
    body:
      'San Rafael, on the road between Ibiza Town and San Antonio. A taxi from either town is short; from Playa d’en Bossa it is longer. There is parking, which makes Amnesia one of the few major clubs where a hire car genuinely helps — provided somebody in the group is not drinking.',
  },
  {
    name: 'Getting in',
    body:
      'Advance tickets from the club, a place on a guestlist, or the door. Guestlist here means a reduced rate or a cut-off time rather than free entry, and which one applies changes per night — that is the thing to confirm before you rely on it, not after you have arrived.',
  },
  {
    name: 'What to budget',
    body:
      'Entry, drinks inside, and the ride home. The third one is the one people forget, and on a road location at closing time it is not a rounding error. Work out the return before you leave the apartment and the night costs what you expected it to.',
  },
]

export default function AmnesiaIbizaPage() {
  // Nog niet gepubliceerd — zie src/lib/pending-venues.ts. De pagina 404't
  // tot het akkoord met de club rond is; hij staat in geen sitemap en er
  // linkt niets naartoe, dus dit is de enige weg naar binnen.
  if (!venuePagePublished(PAGE_KEY)) notFound()

  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Amnesia Ibiza Tickets & Events 2026"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Amnesia sits on the Ibiza–San Antonio road at San Rafael and runs two rooms on one ticket:
              the glass-roofed Terrace and the darker Club Room, each with its own line-up on the same
              night. Straight answer first: we do not sell Amnesia entry tickets — the club is not in our
              ticketing partner’s catalogue. Simon handles guestlist and table enquiries here over WhatsApp,
              with the terms that apply to your date.
            </p>
            <p className="mt-4">
              The rest of this page is the practical part: which room to be in when, what the door is like,
              and the thing that actually decides how an Amnesia night goes — how you get back.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="Two rooms, one ticket"
        intro="Amnesia is not one dancefloor with a second bar attached. Treat it as two nights running in parallel and you get your money’s worth."
        items={ROOMS}
      />

      <ProseSection
        heading="The road location changes the night"
        paragraphs={[
          'Every other decision about an Amnesia night follows from where it is. The club is not in Ibiza Town and not in San Antonio; it is on the road between them, in San Rafael, and nothing about that is walkable. So the night has a beginning and an end that both need transport, and the end happens at six in the morning when several thousand other people want the same taxi.',
          'The upside of the same fact is that Amnesia has parking and space, which is why it can run the room sizes it does and why the crowd is less of a strip crowd than at Playa d’en Bossa. People come here for the line-up rather than because they are staying next door, and the room reflects that.',
          'The workable versions are a pre-booked return, a discobus running your night, or a hire car with a designated driver. All three are decisions to make in daylight. The version where you walk out at closing and improvise is the one that costs three times as much and takes an hour.',
        ]}
      />

      <ItemGrid heading="Know before you go" items={PRACTICAL} />

      <WhatsAppCta
        locale={LOCALE}
        body="Send Simon the date, the group size and which room you are aiming for, and he comes back with what applies that night — guestlist terms, table minimums, and an honest read on whether the night is worth the trip out to San Rafael. If we cannot help with a date, he says so rather than selling you something else."
        prefill="Hi Simon, I have a question about Amnesia Ibiza — "
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Ibiza club tickets 2026', href: 'ibiza-club-tickets', body: 'What entry costs island-wide, and the clubs we sell directly.' },
          { label: 'Pacha Ibiza', href: 'pacha-ibiza', body: 'The Ibiza Town alternative, and a very different room.' },
          { label: 'DC-10 Ibiza', href: 'dc10-ibiza', body: 'Monday by the salt flats, with its own ticketing rules.' },
          { label: 'Car rental in Ibiza', href: 'car-rental-ibiza', body: 'The San Rafael problem, solved in daylight.' },
          { label: 'Ibiza guestlist', href: 'guestlist', body: 'What a guestlist actually gets you, per club and per night.' },
          { label: 'Ibiza club calendar', href: 'calendar', body: 'Every dated night on the island, by day.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Amnesia Ibiza" />
    </>
  )
}
