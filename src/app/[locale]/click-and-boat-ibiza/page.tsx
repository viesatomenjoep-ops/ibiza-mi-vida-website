import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { PartnerDossier } from '@/components/partner/PartnerDossier'
import { Breadcrumbs, InternalLinks, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { CLICKANDBOAT_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600
const LOCALE: Locale = 'en'
const PAGE_KEY = 'click-and-boat-ibiza'
const skipper = RENTAL_PRICES.boatWithSkipper.amount

/**
 * Partner dossier: Click&Boat.
 *
 * Same job as the Wiber page and the same reasoning: "Click and Boat Ibiza" and
 * "is Click&Boat legit" are trust queries, not category queries, so this does
 * not compete with /boat-rental-ibiza.
 *
 * The thing worth being clear about — and the reason this page earns its place
 * rather than repeating the pillar — is that Click&Boat is a marketplace, not
 * an operator. The boat, the skipper and the deposit terms belong to an owner,
 * and that single fact explains almost every surprise people report. Saying it
 * plainly is more useful than another list of coves.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Click&Boat in Ibiza: Our Partner, Reviewed',
    description:
      'Click&Boat is a marketplace, not an operator — which explains the deposits, the fuel bills and the surprises. What to check before booking a boat in Ibiza.',
    alternates: localizedAlternates('clickandboat-partner', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Click&Boat in Ibiza: Our Partner, Reviewed',
      description: 'What booking an Ibiza boat through Click&Boat actually involves, and the four things to check first.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Click&Boat boat rental in Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Boat rental Ibiza', path: 'boat-rental-ibiza' },
  { name: 'Click&Boat' },
]

const FAQS: Faq[] = [
  {
    q: 'Is Click&Boat legitimate?',
    a: 'Yes, and the useful detail is what kind of company it is: a marketplace, Europe\'s largest for boat rental, with more than 55,000 boats listed across its markets. It does not own the boats. Owners and charter companies list them, and the platform handles the booking and the payment. That structure is why the boats vary so much between listings — and why the questions worth asking are about the specific boat, not about the platform.',
  },
  {
    q: 'Why does the price change so much between similar boats?',
    a: 'Because each listing is priced by its owner, not by a central rate card. Two twelve-metre motorboats from the same marina on the same weekend can differ substantially, and the gap is usually explained by the year, the engine hours, whether a skipper is in the rate, and how booked the owner already is. It is a marketplace, so the spread is real rather than a mistake.',
  },
  {
    q: 'Is fuel included?',
    a: 'Almost never, on any platform, and this is the single biggest source of surprise on the final bill. The island standard is full-to-full, or consumption settled at the end. What you burn depends far more on how you drive than how far you go: a day at anchor costs almost nothing, and a fast run to Formentera and back costs a lot. Ask for the tank size and the consumption if you want to budget it properly.',
  },
  {
    q: 'How does the deposit work?',
    a: 'It is held on the main renter\'s credit card and released after the boat comes back undamaged, usually within a few days. The amount is set by the owner and scales with the value of the boat, so a licence-free six-metre and a twelve-metre motor yacht are not remotely in the same range. You are told the figure before you pay anything — if you are not, that is the question to ask.',
  },
  {
    q: 'What if the weather cancels my day?',
    a: 'The call belongs to the base or the skipper, not to you, and a weather cancellation comes with a new date or a refund. Terms for simply changing your mind vary per listing, because they are the owner\'s terms — which is exactly why we read them for the specific boat before you commit rather than quoting a general policy.',
  },
  {
    q: 'Why book through you instead of the platform directly?',
    a: 'You can book directly, and for a straightforward day out you will be fine. What we add is the filtering: matching your date, group size and language against the boats genuinely free, checking that the certificate covers your actual headcount, and reading that listing\'s deposit and cancellation terms before you pay. On a platform with tens of thousands of listings, that is the part that takes an evening if you do it yourself.',
  },
]

export default function ClickAndBoatPartnerPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
        product={{
          name: 'Boat rental in Ibiza through Click&Boat',
          description:
            'Boat rental in Ibiza through Click&Boat, Europe’s largest boat rental marketplace, with a skipper, your own licence, or licence-free up to 15 hp.',
          brand: 'Click&Boat',
          price: skipper,
          path: 'click-and-boat-ibiza',
        }}
      />

      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <PartnerDossier
        locale={LOCALE}
        partner="Click&Boat"
        kicker="Our boat rental partner"
        h1="Click&Boat in Ibiza"
        href={CLICKANDBOAT_URL}
        cta="See available boats"
        pillarPath="boat-rental-ibiza"
        pillarLabel="All boat rental options in Ibiza"
        disclaimer="This is Ibiza Mi Vida's page about the platform our boats come from. It is not Click&Boat's own website, and we are not Click&Boat. We earn a commission when you book through the links here; it costs you nothing extra, and it is why the page spends more time on what to check than on why to book."
        lead={
          <>
            <p>
              Click&Boat is Europe&apos;s largest boat rental marketplace, with more than 55,000 boats
              listed. The word that matters is <em>marketplace</em>: it does not own the boats. Owners and
              charter companies list them, which is why prices, deposits and cancellation terms vary from
              one listing to the next.
              {skipper ? ` Skippered day charters start at €${skipper}.` : ''}
            </p>
            <p className="mt-4">
              Understand that one fact and almost every surprise people report about booking a boat online
              stops being surprising.
            </p>
          </>
        }
        headline={[
          { label: 'Type', value: 'Marketplace, not operator' },
          { label: 'Boats listed', value: '55,000+ across markets' },
          { label: 'Fuel', value: 'Almost never included' },
          { label: 'Deposit', value: 'Set per boat, by its owner' },
        ]}
        factsHeading="What varies per listing, and what does not"
        facts={[
          { label: 'Who owns the boat', value: 'An individual owner or a charter company. Click&Boat handles booking and payment; the boat, the skipper and the terms are theirs.' },
          { label: 'Insurance', value: 'Every listed boat is insured by its owner or operator — a condition of being listed. Third-party cover is standard; the excess is what varies, and it is the number to ask for.' },
          { label: 'Deposit', value: 'Held on the main renter’s credit card, released after undamaged return. Set by the owner and scaled to the value of the boat.' },
          { label: 'Fuel', value: 'Billed separately on consumption, in nearly all cases. Full-to-full is the island norm.' },
          { label: 'Skipper', value: 'Inside the rate on most day charters; a separate flat day fee on some. Required outright on most larger motor yachts and nearly all catamarans.' },
          { label: 'Passenger limit', value: 'Set by the boat’s certificate, not by deck space. On some certificates the skipper counts towards the total and on others not.' },
          { label: 'Cancellation', value: 'Weather cancellations are decided by the base or skipper and come with a new date or a refund. Terms for changing your mind are the owner’s and differ per listing.' },
          { label: 'Licence-free boats', value: 'Available, within Spanish limits: maximum 15 hp, hull under six metres, driver 18 or over, and an agreed navigation area.' },
        ]}
        stepsHeading="What we check before you pay"
        steps={[
          { title: 'That the boat is genuinely free on your date', body: 'A calendar on a marketplace can lag the owner’s own bookings, particularly in July and August. We confirm against the operator rather than against the listing.' },
          { title: 'That the certificate covers your real headcount', body: 'Including children, and including the skipper where that certificate counts them. This is the single most common way a group loses a person at the pontoon, and it is entirely avoidable an evening earlier.' },
          { title: 'The deposit, the excess and what voids the cover', body: 'Three numbers that are not on the listing headline and that decide what a bad day costs you. If an owner will not state them, that tells you something in itself.' },
          { title: 'That the boat matches what you described', body: 'A licence-free 15 hp boat cannot cross to Formentera, whatever the map suggests, and a group of ten does not fit a boat certified for eight. If the listing you liked is wrong for your day, we say so before you pay rather than after.' },
        ]}
        suitsHeading="Book through the platform if"
        suits={[
          'You want range: tens of thousands of listings means something is usually free on a date that looks fully booked.',
          'You want to compare boat against boat rather than take whatever one operator has left.',
          'You are happy to read a listing’s deposit and cancellation terms properly, because they are the owner’s and they differ.',
          'You want the payment handled by a platform rather than by a bank transfer to somebody you found on Instagram.',
        ]}
        notSuitsHeading="Be careful if"
        notSuits={[
          'You are assuming the price is the total. Fuel is extra almost everywhere, and on a fast boat it is not a rounding error.',
          'You are booking on the headline photo. The certificate, the excess and the deposit are what shape the day.',
          'Nobody in the party has a credit card for the deposit. Debit is refused at most bases.',
          'You want one number for everything. On a marketplace, terms are per listing — that is the trade-off for the choice.',
        ]}
        verdictHeading="Our honest read"
        verdict={[
          'Click&Boat is the reason we can usually find something on a Saturday in August when a single operator is full. That range is the whole argument for a marketplace, and it is a real one.',
          'The cost of that range is that nothing is standard. Two similar boats can differ in deposit, in excess, in whether the skipper is in the price and in what happens if you cancel — and none of that is visible from the listing photo. People who report a bad experience with an online boat booking, on any platform, have almost always hit one of those four.',
          'So book it, and read the specific listing rather than the platform. If you would rather not spend the evening doing that, it is the part we do: send the date, the group and roughly what you want the day to look like, and we come back with the boats that actually work.',
        ]}
      >
        <FaqAccordion faqs={FAQS} locale={LOCALE} />
      </PartnerDossier>

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Boat rental in Ibiza', href: 'boat-rental-ibiza', body: 'The full picture: three ways onto the water, four marinas and the routes.' },
          { label: 'Boat hire without a licence', href: 'boat-hire-ibiza-no-licence', body: 'The 15 hp category and the four legal conditions on it.' },
          { label: 'Wiber, our car partner', href: 'wiber-car-rental-ibiza', body: 'The same treatment for the company behind our car hire.' },
        ]}
      />

      <AuthorByline locale={LOCALE} topic="booking boats in Ibiza through Click&Boat" />
    </>
  )
}
