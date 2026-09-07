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
const PAGE_KEY = 'dc10-ibiza'

/**
 * DC-10 — de strengste versie van de gidspagina.
 *
 * Twee redenen waarom hier geen ticketknop staat, en ze stapelen: DC-10 zit
 * niet in de ClubTickets-feed (docs/seo/AUDIT.md, A6), én de club verkoopt
 * voorverkoop in 2026 uitsluitend via DICE. Elke knop die anders suggereert is
 * dus niet alleen iets wat wij niet kunnen leveren, maar ook iets wat via geen
 * enkele partij te leveren is. Dat staat in zin twee van de lead.
 *
 * Precies die situatie is waar een antwoordmachine op ingezet wordt ("how do I
 * get DC-10 tickets") en waar de meeste pagina's op het internet gokken. Een
 * pagina die het eerlijk uitlegt is hier de citeerbare, niet de commerciële.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'DC-10 Ibiza 2026 — Guide & Guestlist',
    description:
      'DC-10 Ibiza in 2026: Circoloco Mondays by the salt flats, next to the airport. How its ticketing works, what the door is like, and how to get there.',
    alternates: localizedAlternates('dc10-venue', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'DC-10 Ibiza 2026 — Guide & Guestlist',
      description: 'Circoloco Mondays, the door, and how DC-10 tickets actually work.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'DC-10 Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Clubs', path: 'clubs' },
  { name: 'DC-10 Ibiza' },
]

const FAQS: Faq[] = [
  {
    q: 'How do I buy DC-10 tickets?',
    a: 'For 2026, advance tickets run through DICE and nowhere else. That is not a preference of ours — it is how the club sells, and it means anyone offering you a DC-10 e-ticket through another platform is selling something that will not scan. We do not sell DC-10 entry either, and we would rather tell you that on this page than take an enquiry we cannot fill. What Simon can do is advise on the date and handle guestlist enquiries over WhatsApp.',
  },
  {
    q: 'What is Circoloco?',
    a: 'The Monday party DC-10 is known for, and the reason most people search for the club at all. It runs during the season and has done for decades, which makes it one of the longest-running weekly nights on the island. Because it is a Monday and it starts in daylight, it shapes an entire week: people plan the rest of the trip around it rather than fitting it in.',
  },
  {
    q: 'Where is DC-10 and how do I get there?',
    a: 'Out by the Ses Salines salt flats in Sant Josep, a couple of minutes from the airport and not near any town. There is nothing walkable around it. A taxi from Ibiza Town or Playa d’en Bossa is short; from San Antonio it is not. Because the night starts in the afternoon and ends late, the return journey is the part to plan — the queue at the end is real.',
  },
  {
    q: 'What time does DC-10 start?',
    a: 'Daytime rather than midnight, which is the thing that catches people out. The Monday party opens in the afternoon and runs into the night, so it is a full day rather than a night out. Dress and pace accordingly: sun in the first half, and a considerably longer session than a midnight-to-six club night.',
  },
  {
    q: 'What is the door like at DC-10?',
    a: 'Stricter about behaviour than about clothes. There is no dress code worth the name — this is the least dressed-up major venue on the island — but the door turns people away for arriving in a state, and the club protects the room’s atmosphere in a way the big commercial venues do not. Come sober enough to get in, and bring physical photo ID.',
  },
  {
    q: 'Is DC-10 an open-air club?',
    a: 'Partly. It combines an outdoor terrace with an indoor room, which is what lets the party run from afternoon sun into the night without changing venue. In practice you will move between the two across the session, and the room you prefer at four in the afternoon is rarely the one you prefer at midnight.',
  },
  {
    q: 'Should I bring cash?',
    a: 'Bring some. Card acceptance at Ibiza venues has improved a lot, but the bars and the queue on a busy night are not the place to discover a terminal is down, and taxis on the island are not uniformly card-friendly either. Enough for drinks and a ride home is the sensible amount — a full night’s budget in cash is not.',
  },
  {
    q: 'Is there an age limit?',
    a: 'Eighteen, checked with physical photo ID at the door. A photo on your phone is not accepted. This applies regardless of whether you hold a DICE ticket or a place on a list, and it is Spanish law rather than something the door can waive.',
  },
]

const CHARACTER = [
  {
    name: 'A day, not a night',
    body:
      'The Monday party starts in the afternoon and runs on. That single fact separates DC-10 from every other club on this site: you are dressing for sun and dancing for longer, and the following day is written off. Plan Tuesday as a beach day before you go, not after.',
  },
  {
    name: 'Terrace and indoor room',
    body:
      'An outdoor terrace and an enclosed room, used at different points of the session rather than as main stage and overflow. Most people find they want the terrace early and the room late, and moving between the two is how the day paces itself.',
  },
  {
    name: 'The crowd',
    body:
      'The least dressed-up room on the island and the most focused on the music. Nobody is here for bottle service or a photo. If that is what you want from a night out, Playa d’en Bossa is ten minutes away and does it better.',
  },
]

const PRACTICAL = [
  {
    name: 'Getting there',
    body:
      'Sant Josep, by the salt flats, minutes from the airport. Short taxi from Ibiza Town or Playa d’en Bossa, long one from San Antonio, and nothing within walking distance. If you are landing on a Monday, the club is closer to the airport than your hotel probably is.',
  },
  {
    name: 'Getting in',
    body:
      'A DICE ticket bought in advance is the reliable route for 2026. Guestlist enquiries go through Simon, and what a list gets you here varies per date — we confirm the terms before you count on them rather than after. Anything sold as a DC-10 e-ticket on another platform is not one.',
  },
  {
    name: 'What to bring',
    body:
      'Physical ID, sun protection for the first half, some cash, and a phone you can put away. Not: the good trainers, or anything you would mind losing over a session this long.',
  },
]

export default function Dc10IbizaPage() {
  // Nog niet gepubliceerd — zie src/lib/pending-venues.ts. De pagina 404't
  // tot het akkoord met de club rond is; hij staat in geen sitemap en er
  // linkt niets naartoe, dus dit is de enige weg naar binnen.
  if (!venuePagePublished(PAGE_KEY)) notFound()

  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="DC-10 Ibiza 2026 — Guide, Guestlist & Circoloco"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              DC-10 is the open-air club by the Ses Salines salt flats in Sant Josep, minutes from Ibiza
              airport, and Circoloco on Mondays is what it is known for. The ticketing answer first,
              because it is the thing everyone gets wrong: for 2026 advance tickets run through DICE and
              nowhere else. We do not sell DC-10 entry, and neither does any other reseller — anything
              advertised as a DC-10 e-ticket elsewhere will not scan at that door.
            </p>
            <p className="mt-4">
              What this page is for is the rest of it: what the day actually looks like, what the door
              cares about, and how to get back afterwards. Guestlist questions go to Simon on WhatsApp.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="What DC-10 is"
        intro="Closer to a long Monday than to a night out, and deliberately unlike the arenas at Playa d’en Bossa."
        items={CHARACTER}
      />

      <ProseSection
        heading="Why the ticketing works differently"
        paragraphs={[
          'Most Ibiza clubs distribute widely: the same night appears across several ticketing platforms and affiliates, and buying through one of them is normal. DC-10 does not work that way for 2026 — advance sales run through DICE, a single channel, and that is a deliberate choice by the club rather than an oversight.',
          'The practical consequence is worth stating plainly, because it is where people lose money. If a site is offering you a DC-10 ticket for a 2026 date, it is either reselling a DICE ticket it does not control or selling nothing at all. Neither gets you through the door. The same goes for anyone quoting a fixed guestlist price for the season.',
          'It also explains what we can and cannot do here. Ibiza Mi Vida is an official ticketing partner for a dozen clubs on the island, and DC-10 is not one of them. So this page carries no ticket button on purpose. Simon can advise on which Monday is worth planning around, and handle a guestlist enquiry — and if the honest answer for your date is "buy on DICE", that is the answer you get.',
        ]}
      />

      <ItemGrid heading="Know before you go" items={PRACTICAL} />

      <WhatsAppCta
        locale={LOCALE}
        body="Simon is on the island and will tell you straight whether a given Monday is worth building the week around, what a guestlist realistically gets you on that date, and how to get back afterwards. He will also tell you when the answer is simply to buy on DICE — we would rather be the page you trusted than the one that sold you something."
        prefill="Hi Simon, I have a question about DC-10 / Circoloco — "
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Ibiza club tickets 2026', href: 'ibiza-club-tickets', body: 'The clubs we do sell, and what entry costs.' },
          { label: 'Pacha Ibiza', href: 'pacha-ibiza', body: 'The oldest room on the island, in Ibiza Town.' },
          { label: 'Amnesia Ibiza', href: 'amnesia-ibiza', body: 'Two rooms on the San Antonio road.' },
          { label: 'Ibiza guestlist', href: 'guestlist', body: 'What a list means per club and per night.' },
          { label: 'Ibiza airport transfers', href: 'ibiza-airport-transfer', body: 'Getting from IBZ to the club, and back at the end.' },
          { label: 'Ibiza club calendar', href: 'calendar', body: 'Every dated night on the island, by day.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="DC-10 Ibiza" />
    </>
  )
}
