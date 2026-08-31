import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
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
const PAGE_KEY = 'boat-rental-with-skipper-ibiza'
const price = RENTAL_PRICES.boatWithSkipper.amount

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Boat Rental With a Skipper in Ibiza',
    description:
      'When a skipper is required in Ibiza and when it is simply the better call: what it costs, the languages they work in, and how a local reads the wind.',
    alternates: localizedAlternates('boat-with-skipper', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Boat Rental With a Skipper in Ibiza',
      description: 'When a skipper is required in Ibiza, what it costs, and which languages they work in.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Boat rental with a skipper in Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Boat rental Ibiza', path: 'boat-rental-ibiza' },
  { name: 'With a skipper' },
]

const FAQS: Faq[] = [
  { q: 'When is a skipper compulsory in Ibiza?', a: 'Once the boat is beyond what your licence covers — and for most visitors that is sooner than expected, because a foreign licence is not automatically recognised for every category here. Larger motor yachts and most catamarans are skippered as a condition of the charter regardless of what you hold. If you are not sure whether your licence covers a specific boat, send us the boat and the licence and we check before you book.' },
  { q: 'What does a skipper cost?', a: 'On most day charters the skipper is inside the quoted rate rather than an extra line. Where it is separate, it is a day fee that does not change with the size of your group, so it is spread over however many of you are aboard. Fuel remains separate either way. Ask us for the specific boat and we tell you which of the two applies.' },
  { q: 'What languages do skippers speak?', a: 'English is widespread and Spanish is a given. Dutch, German and French exist but on fewer boats, so asking for one narrows the fleet rather than adding a fee. Say which language you want at the enquiry stage — filtering for it afterwards usually means changing boat.' },
  { q: 'Is it still my day, or does the skipper decide?', a: 'Yours, with one exception. You choose where you want to go and how long to sit in each cove; the skipper decides what is safe, and that call is final. In practice their input improves the day more than it constrains it, because they know which bays are workable in the wind that is actually blowing.' },
  { q: 'Do I need to tip?', a: 'Not obligatory, and genuinely appreciated on a day that went well. There is no standard percentage here. Treat it the way you would a good guide rather than the way you would a restaurant bill.' },
  { q: 'Does the skipper count towards the passenger limit?', a: 'On some certificates yes, on others no, and the difference has left groups a person short at the pontoon. Give us the real headcount and we confirm against the specific boat before you pay.' },
]

export default function BoatWithSkipperPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Boat rental with a skipper in Ibiza',
        description: 'Skippered day charters in Ibiza from marinas around the island, with local skippers working in several languages.',
        brand: 'Click&Boat', price, path: 'boat-rental-with-skipper-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Boat Rental With a Skipper in Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            A skipper is compulsory on most boats beyond what a standard licence covers, and on nearly every
            larger motor yacht and catamaran here.
            {price ? ` Skippered day charters start at €${price} per day.` : ''} On the boats where it is
            optional, it is still usually the better call: a local reads the wind and moves the route to the
            side of the island that is working, which is the difference between a good day and a rough one.
          </p>
        }
      />

      <ItemGrid
        heading="When you need one, and when you just want one"
        columns={2}
        items={[
          { name: 'Required by the boat', body: 'Most motor yachts above the small-boat categories and nearly all catamarans are chartered skippered, whatever licence you hold. This is set by the owner and the insurer, not negotiable at the pontoon.' },
          { name: 'Required by your licence', body: 'A foreign licence is not automatically recognised for every category in Spain. Send us the licence and the boat and we check the pairing before you commit to a date.' },
          { name: 'Worth it for the weather', body: 'The tramontana closes the north of the island for days at a time while the south and west stay fine. A skipper flips the route that morning; a first-timer driving themselves usually does not know they should.' },
          { name: 'Worth it for the anchoring', body: 'Knowing where the ground holds in each cove is not something you learn from a chart. It is the single biggest practical difference between a skippered day and a self-drive one.' },
        ]}
      />

      <PriceTable
        heading="What a skippered day costs"
        locale={LOCALE}
        caption="Skippered charter starting price"
        intro="Per boat, per day. On most charters the skipper is inside this rate; where it is separate it is a flat day fee regardless of group size. Fuel is billed on consumption either way."
        rows={[{ label: 'Day charter with skipper', note: 'Skipper included in the rate', amount: price, unit: RENTAL_PRICES.boatWithSkipper.unit.en }]}
      />

      <ProseSection
        heading="What a good skipper actually changes"
        paragraphs={[
          'The obvious answer is that you do not have to drive. The real answer is routing. Ibiza has a windward side and a leeward side that swap depending on the day, and a skipper who has worked these waters knows by breakfast which coves will be swimmable at two in the afternoon. That is not information you can look up.',
          'The second thing is timing. Arriving at Cala Comte at eleven in August means circling for a spot; arriving at nine or at five means anchoring where you want. Skippers plan the day around that as a matter of course, and it is the sort of thing you only learn by getting it wrong once.',
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            See skippered boats on Click&Boat
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Related pages" locale={LOCALE} links={[
        { label: 'Boat rental in Ibiza', href: 'boat-rental-ibiza', body: 'The pillar page: all three ways onto the water, with marinas and routes.' },
        { label: 'Boat hire without a licence', href: 'boat-hire-ibiza-no-licence', body: 'The other end of the range: 15 hp, no paperwork, nearby coves.' },
        { label: 'Boat parties in Ibiza', href: 'boat-party', body: 'When you want the crowd rather than the boat to yourself.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="skippered boat charters in Ibiza" />
    </>
  )
}
