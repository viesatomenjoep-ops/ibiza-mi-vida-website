import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { WIBER_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600
const LOCALE: Locale = 'en'
const PAGE_KEY = 'convertible-car-rental-ibiza'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Convertible Car Rental in Ibiza',
    description:
      'Renting a convertible in Ibiza: which coast roads justify it, what it costs against a normal car, and the practical catches nobody mentions upfront.',
    alternates: localizedAlternates('convertible-rental', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Convertible Car Rental in Ibiza',
      description: 'Which Ibiza coast roads justify a convertible, what it costs, and the practical catches.',
      locale: 'en_GB',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Convertible car rental in Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Car rental Ibiza', path: 'car-rental-ibiza' },
  { name: 'Convertible' },
]

const FAQS: Faq[] = [
  { q: 'Is a convertible worth it in Ibiza?', a: 'For the coast roads, yes. The run from Sant Josep down to Cala d\'Hort, and the north road out towards Portinatx, are genuinely better with the roof down, and they are the drives people remember. For a week of airport runs and supermarket trips, no — you pay more for a smaller boot and a car you have to empty every time you park it.' },
  { q: 'What does a convertible cost against a normal car?', a: 'More per day than an economy or compact, and the gap widens in July and August when the category sells out first. The honest way to book one is for the days you will actually drive the coast, rather than for the whole week — though on a short trip the simplicity of one booking usually wins.' },
  { q: 'How much luggage fits?', a: 'Less than you think, and less again with the roof stowed, because the roof lives in the boot. Two people with cabin bags are fine. Four people with suitcases are not, whatever the category description suggests. If you are landing as a group of four, take the compact and rent the convertible for a day.' },
  { q: 'Is it too hot to drive with the roof down?', a: 'In the middle of a July afternoon, honestly yes — you are stationary in traffic in direct sun with no shade. The roof-down hours here are early morning and from about six in the evening, which happens to be when the coast roads look best anyway. Plan the drive for then and it is perfect.' },
  { q: 'Can I leave things in it while I swim?', a: 'No, and this is the practical catch that spoils convertible weeks. An open car in a beach car park is an invitation, and even roof-up a soft top is not a secure boot. It means emptying the car every stop, which is fine for a drive and tedious for a beach day.' },
  { q: 'Do I need to book it further ahead?', a: 'Yes. Convertibles are a small part of any Ibiza fleet and the first category to go in peak weeks. Booking in spring for August is normal; booking in July for August generally means there is nothing left at any price.' },
]

export default function ConvertibleRentalPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Convertible car rental in Ibiza',
        description: 'Convertible hire in Ibiza for the west and north coast roads, all-inclusive through Wiber Rent a Car.',
        brand: 'Wiber Rent a Car', price: null, path: 'convertible-car-rental-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Convertible Car Rental in Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            A convertible earns its premium on about three roads here, and the best of them is the twenty
            minutes from Sant Josep down to Cala d&apos;Hort with Es Vedrà ahead of you. It costs more per
            day than a compact, holds noticeably less luggage, and cannot be left loaded in a beach car
            park. Book it for the driving, in the early morning or after six — not for a week of errands.
          </p>
        }
      />

      <ItemGrid
        heading="The roads worth the roof"
        intro="Three drives that justify the category, and one that does not."
        items={[
          { name: 'Sant Josep to Cala d\'Hort', body: 'The south-west run, dropping through pine and terraces with Es Vedrà filling the windscreen at the end. The single best twenty minutes of driving on the island, and best in the last hour of light.' },
          { name: 'The north road to Portinatx', body: 'Longer, greener and emptier, winding through Sant Joan. Slower than the map suggests and better for it. The one to do in the morning before the heat.' },
          { name: 'Ibiza Town to Santa Eulària', body: 'The easy coastal option, short and civilised, good for an evening out. Not spectacular, but pleasant with the roof down and no effort at all.' },
          { name: 'Not: the airport road', body: 'Straight, busy and hot, with roadworks somewhere on it most seasons. Nobody has ever enjoyed this one roof-down in August traffic.' },
        ]}
      />

      <PriceTable
        heading="What it costs"
        locale={LOCALE}
        caption="Convertible rental starting price"
        intro="Higher per day than an economy or compact, and the category sells out first in peak weeks. Ask us for the figure on your dates — it moves more by season than by model."
        rows={[{ label: 'Convertible', note: '2 adults, small boot, coast roads', amount: null, unit: RENTAL_PRICES.carPerDay.unit.en }]}
      />

      <ProseSection
        heading="The catches nobody mentions"
        paragraphs={[
          'The roof lives in the boot, so the luggage space quoted for the category is the roof-up figure. Two people with cabin bags are comfortable; four people with suitcases will not fit, and discovering that at the rental desk at eleven at night with a family waiting is a bad evening.',
          'The other one is parking. A soft top is not a secure boot, and an open car in a beach car park is an invitation. In practice it means the car gets emptied at every stop, which is a minor irritation on a drive and a genuine nuisance on a beach day. If most of your week is beaches, rent the convertible for two days and take something with a lockable boot for the rest.',
        ]}
      />

      <TrustBlock
        heading="Booking through Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Check convertible availability"
        points={[
          { title: 'Book early', body: 'Convertibles are a small slice of any Ibiza fleet and the first category to sell out for July and August.' },
          { title: 'All-inclusive rate', body: 'Insurance in the price, so the premium you pay is for the car rather than for cover sold at the counter.' },
          { title: 'Same conditions', body: 'Minimum age 21, licence held 12 months, €9 per day surcharge for drivers aged 21–24, credit card in the main driver\'s name.' },
          { title: 'Five minutes from the airport', body: 'Same office and free shuttle as every other category — Ctra. Aeropuerto km 5, Sant Josep.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Related pages" locale={LOCALE} links={[
        { label: 'Car rental in Ibiza', href: 'car-rental-ibiza', body: 'The pillar page: all categories, conditions and parking advice.' },
        { label: 'Car rental at Ibiza Airport', href: 'car-rental-ibiza-airport', body: 'The pick-up flow, shuttle and what to do after a late landing.' },
        { label: 'Boat rental in Ibiza', href: 'boat-rental-ibiza', body: 'Cala d\'Hort from the water instead of the cliff road.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="convertible car rental in Ibiza" />
    </>
  )
}
