import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'ibiza-guestlist'

/**
 * Guestlist hub — deliberately the least promotional page on the site.
 *
 * "Ibiza guestlist" is searched by people who believe it means free entry to a
 * headline show. It does not, and every site that implies otherwise converts
 * once and then deals with an angry customer at a door. The page leads with
 * that correction because being the page that tells the truth about it is the
 * only durable position here — and because an answer engine asked "how do I get
 * on the Ushuaïa guestlist" will quote whichever source actually answers.
 *
 * No prices are stated for VIP tables. Table minimums move per night, per room
 * and per act, and a figure published here would be wrong within a week. The
 * page says what drives the number instead, and routes to WhatsApp for a real
 * quote — see the same rule in src/lib/page-faq.ts.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Ibiza Guestlist & VIP Tables: How It Works',
    description:
      'There is no free guestlist for headline shows in Ibiza. What guestlist really means, how it differs from a ticket or a VIP table, and what a table costs.',
    alternates: localizedAlternates('guestlist-hub', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: 'Ibiza Guestlist & VIP Tables: How It Works',
      description: 'What guestlist actually means in Ibiza, and how it differs from a ticket or a table.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Ibiza guestlist and VIP tables' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza club tickets', path: 'ibiza-club-tickets' },
  { name: 'Guestlist and VIP tables' },
]

const FAQS: Faq[] = [
  {
    q: 'Is there a free guestlist for Ibiza clubs?',
    a: 'Not for headline shows at the big rooms. What gets called a guestlist here is normally a reduced rate or a timing condition — cheaper entry before a certain hour, or a discounted price on a quieter night — and it varies per club and per night. Anyone promising free entry to a sold-out Saturday at Hï or UNVRS is either selling you something else or is about to disappoint you at the door.',
  },
  {
    q: 'What is the difference between guestlist, a ticket and a VIP table?',
    a: 'A ticket is guaranteed entry at a published price. A guestlist is a conditional arrangement — usually a lower rate if you arrive before a set time, subject to the door. A table is a reserved space with a spend minimum, which buys you somewhere to sit, service, and entry for the group. They solve different problems, and the table is the only one that guarantees you a place to stand at three in the morning.',
  },
  {
    q: 'How much does a VIP table cost in Ibiza?',
    a: 'It is a minimum spend rather than a price, and it moves with the room, the night and the act — a midweek table at a smaller club and a Saturday table in front of the booth at a headline show are not in the same universe. The number also scales with group size, because the minimum is set against what the table is expected to spend. Tell us the club, the date and how many of you there are, and we come back with the real figure for that night.',
  },
  {
    q: 'How do I get on the Ushuaïa guestlist?',
    a: 'For most Ushuaïa dates there is no free list, and the practical route in is a ticket. Where a reduced-rate arrangement exists it is usually early-entry: in before a stated time, at a lower price, subject to capacity. Because it changes per event, the honest answer is to ask us for the specific date rather than to trust a blanket claim on any website, including this one.',
  },
  {
    q: 'How do you arrange it?',
    a: 'Over WhatsApp, with Simon and the local team. You tell us the club, the date and the group; we check what genuinely exists for that night — ticket, reduced rate or table — and tell you which is the best value for what you want. If the answer is "just buy a ticket", that is what we say.',
  },
  {
    q: 'When should I sort this out?',
    a: 'Earlier than feels necessary for opening and closing parties and for headline Saturdays in August, which is when tables and the better ticket tiers go. For a midweek night in June a few days ahead is fine. The cost of asking early is nothing; the cost of asking late is that the only thing left is the expensive tier.',
  },
]

export default function IbizaGuestlistPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Ibiza Guestlist & VIP Tables — How It Really Works"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              There is no free guestlist for headline shows at the big Ibiza clubs. What the word means here
              is a reduced rate or a timing condition — cheaper entry before a set hour, or a lower price on
              a quieter night — and it changes per club and per night. For a sold-out Saturday, a ticket is
              the way in.
            </p>
            <p className="mt-4">
              That is the honest version, and it is worth knowing before you plan a night around a promise
              somebody made you on Instagram.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="Three different things, often confused"
        columns={3}
        intro="People arrive asking for one of these and actually want another. The difference is worth two minutes."
        items={[
          {
            name: 'A ticket',
            body:
              'Guaranteed entry at a published price. Predictable, transferable in most rooms, and the only option that reliably works for a headline night. Buy it early: pricing is dynamic and the cheap tier goes first.',
          },
          {
            name: 'Guestlist',
            body:
              'A conditional arrangement, not a free pass. Usually early entry at a reduced rate, subject to the door and to capacity. Genuinely useful on quieter nights; close to meaningless on the big ones.',
          },
          {
            name: 'A VIP table',
            body:
              'A minimum spend that buys a reserved space, service and entry for the group. The only one of the three that guarantees you somewhere to sit at three in the morning, and the only one priced per night rather than per person.',
          },
        ]}
      />

      <ProseSection
        heading="What a table actually costs"
        paragraphs={[
          'A table is quoted as a minimum spend, not a ticket price, and that minimum moves with three things: which room, which night, and who is playing. A midweek table at a smaller club and a Saturday table in front of the booth for a headline act are different by a multiple, not a margin.',
          'It also scales with your group. The minimum is set against what a table of that size is expected to spend, so six people and twelve people are quoted differently for the same night. Split across a group it is often closer to the ticket-plus-drinks cost than people expect — which is the actual reason to consider one, rather than the status.',
          'We do not publish a number here because any number would be wrong within a week. Send us the club, the date and the headcount and we come back with the real minimum for that night.',
        ]}
      />

      <ProseSection
        heading="How we arrange it"
        paragraphs={[
          'It runs through WhatsApp with Simon and the team on the island, not a booking form. You say what you want the night to look like; we check what genuinely exists for that date — a ticket, a reduced-rate arrangement, or a table — and tell you which one is the best value for it.',
          'If the honest answer is that there is nothing special available and you should just buy a ticket, that is what you will get told. That is worth more to us than one booking.',
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Ibiza club tickets 2026', href: 'ibiza-club-tickets', body: 'What entry costs club by club, and when each night sells out.' },
          { label: 'Boat parties in Ibiza', href: 'boat-party', body: 'The daytime event that runs into the club night.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="Ibiza guestlist and VIP tables" />
    </>
  )
}
