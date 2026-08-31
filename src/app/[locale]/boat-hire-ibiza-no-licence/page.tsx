import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { Proof } from '@/components/hub/Proof'
import { AffiliateLink } from '@/components/hub/AffiliateLink'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { CLICKANDBOAT_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600
const LOCALE: Locale = 'en'
const PAGE_KEY = 'boat-hire-ibiza-no-licence'
const price = RENTAL_PRICES.boatNoLicence.amount

/**
 * Licence-free boat spoke.
 *
 * The four conditions in the opening paragraph — 15 hp, under six metres, 18+,
 * agreed navigation area — are the legal frame, not marketing. They are stated
 * first and repeated in the FAQ because getting them wrong is what puts a
 * visitor outside their insurance, and because this is the exact question an
 * answer engine gets asked about Ibiza boats.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Boat Hire Ibiza Without a Licence',
    description:
      'Rent a boat in Ibiza with no licence: up to 15 hp, hull under six metres, drivers 18 and over, briefing and a set navigation area. Boats and prices.',
    alternates: localizedAlternates('boat-no-licence', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Boat Hire Ibiza Without a Licence',
      description: 'Licence-free boat hire in Ibiza: the 15 hp rule, who can drive, and where you are allowed to go.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Licence-free boat hire in Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Boat rental Ibiza', path: 'boat-rental-ibiza' },
  { name: 'Without a licence' },
]

const FAQS: Faq[] = [
  { q: 'Can I really rent a boat in Ibiza without any licence?', a: 'Yes, within a defined limit. Spanish rules allow anyone aged 18 or over to drive a boat of up to 15 hp with a hull under six metres, with no licence and no logged experience. You get a briefing before you leave and a navigation area you agree to stay inside. Anything more powerful or longer needs a recognised licence, and no operator can waive that.' },
  { q: 'How powerful is 15 hp in practice?', a: 'Enough to move a small boat with four to six people at a walking-to-jogging pace across the water, and not enough to plane or to fight a headwind. Think of it as a way to reach the next cove along the coast in twenty minutes rather than a way to cover the island. Anyone imagining a speedboat will be disappointed; anyone imagining a floating picnic will be delighted.' },
  { q: 'Where am I allowed to go?', a: 'Inside the area the base marks on a chart before you leave, which is normally the stretch of coast around your departure port. From San Antonio that typically covers the bay and the coves south towards Cala Bassa and Cala Comte. The Formentera crossing is not in it — that is open water and needs a different boat and, realistically, a skipper.' },
  { q: 'What does it cost?', a: 'Licence-free boats are the cheapest way onto the water in Ibiza, and cost less than any skippered charter. Fuel is billed separately on consumption, which on a 15 hp engine is genuinely small. The rate moves with the season, so message us with your date and group size for the current figure.' },
  { q: 'How many people fit?', a: 'Four to six, set by the certificate on the boat rather than by the space on deck. Give us the real headcount including children when you enquire — arriving seven-strong for a six-person certificate means somebody stays on the pontoon.' },
  { q: 'Do I need experience?', a: 'No, and most people who take these out have none. The briefing covers starting, stopping, steering, anchoring and what to do if the engine stops, and the boats are deliberately slow and forgiving. If you can reverse a car into a space you can handle one of these.' },
]

export default function BoatHireNoLicencePage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Licence-free boat hire in Ibiza',
        description: 'Boat hire in Ibiza without a licence: up to 15 hp, hull under six metres, drivers aged 18 and over.',
        brand: 'Click&Boat', price, path: 'boat-hire-ibiza-no-licence',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Boat Hire in Ibiza Without a Licence"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            You can drive a boat in Ibiza with no licence at all, as long as it stays inside four conditions:
            a maximum of 15 hp, a hull under six metres, a driver aged 18 or over, and an agreed navigation
            area you stay inside after the safety briefing.
            {price ? ` Boats start at €${price} per day.` : ''} That covers four to six people and the coves
            along your own stretch of coast — not the Formentera crossing.
          </p>
        }
      />

      <ItemGrid
        heading="The four rules, in full"
        columns={2}
        intro="These are legal limits rather than house policy. An operator who offers to bend one of them is offering to put you outside your insurance."
        items={[
          { name: 'Maximum 15 hp', body: 'The engine ceiling for licence-free operation. It is the number that decides everything else about the day: slow, stable, and fine for hopping between nearby coves.' },
          { name: 'Hull under six metres', body: 'Length matters as much as power. A boat can be under 15 hp and still need a licence if the hull is too long, which is why the fleet for this is small and specific.' },
          { name: 'Driver 18 or over', body: 'The person at the controls must be 18, with ID. Passengers can be any age with a correctly sized lifejacket. Only the driver signs.' },
          { name: 'A set navigation area', body: 'Marked on a chart at the briefing, usually the coast around your departure port. Leaving it is what voids the cover, and the coastguard here does check.' },
        ]}
      />

      <PriceTable
        heading="What it costs"
        locale={LOCALE}
        caption="Licence-free boat hire starting price"
        intro="Per boat, per day, split across four to six people. Fuel is extra and consumption on a 15 hp engine is modest."
        rows={[{ label: 'Licence-free boat', note: '4–6 people, max 15 hp', amount: price, unit: RENTAL_PRICES.boatNoLicence.unit.en }]}
      />

      <ItemGrid
        heading="Where you can actually get to"
        intro="Realistic destinations at 15 hp from San Antonio, which is where most licence-free boats are based."
        items={[
          { name: 'Cala Bassa', body: 'Twenty to thirty minutes down the coast, sheltered and sandy. The standard first stop and the one that works with children aboard.' },
          { name: 'Cala Comte', body: 'A little further south, shallow and turquoise. Reachable on a calm day; check the forecast, because the return leg into a headwind at 15 hp is slow.' },
          { name: 'San Antonio bay', body: 'The bay itself is the fallback and it is not a consolation prize: flat water, easy anchoring, and close enough to go back for lunch.' },
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            See licence-free boats on Click&Boat
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Related pages" locale={LOCALE} links={[
        { label: 'Boat rental in Ibiza', href: 'boat-rental-ibiza', body: 'The pillar page: all three ways onto the water, with prices and marinas.' },
        { label: 'Boat rental with a skipper', href: 'boat-rental-with-skipper-ibiza', body: 'When someone else drives, and why it is often the cheaper mistake to avoid.' },
        { label: 'Jet ski rental in Ibiza', href: 'jet-ski-rental-ibiza', body: 'The faster, shorter version, with its own licence rules.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="licence-free boat hire in Ibiza" />
    </>
  )
}
