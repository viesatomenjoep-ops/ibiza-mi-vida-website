import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { WhatsAppCta } from '@/components/hub/WhatsAppCta'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { UsClusterLinks, etiasSentence } from '@/components/us/UsShared'
import { ETIAS, EES, usDate } from '@/lib/us-travel'
import { localizedAlternates } from '@/lib/route-slugs'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600

const LOCALE: Locale = 'en'
const PAGE_KEY = 'ibiza-travel-requirements-us-citizens'
const PATH = 'ibiza-travel-requirements-us-citizens'

/**
 * Entry and practical requirements for US citizens.
 *
 * Government rules with a date on every one of them. ETIAS is the trap: half
 * the web says Americans "need ETIAS from 2026" and, as of writing, nobody
 * does — the EU pushed it to 2027. The sentence comes from etiasSentence(),
 * which reads src/lib/us-travel.ts, so flipping one flag when it launches
 * rewrites this page, the hub and llms.txt together. We link the EU's own
 * page rather than any of the paid "ETIAS application" sites.
 */

const TITLE = 'Ibiza Entry Requirements for US Citizens'
const DESCRIPTION =
  'What Americans need for Ibiza: passport rules, the 90-day limit, ETIAS status, the driving permit US licenses require in Spain, plus money, tipping and plugs.'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: localizedAlternates('us-requirements', LOCALE),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: TITLE,
      description: DESCRIPTION,
      locale: 'en_US',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Ibiza travel requirements for US citizens' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza for Americans', path: 'ibiza-for-americans' },
  { name: 'Entry requirements' },
]

const FAQS: Faq[] = [
  {
    q: 'Do US citizens need a visa for Ibiza?',
    a: `No. Ibiza is Spain, Spain is in the Schengen area, and a US passport gets you 90 days in any 180-day period across all Schengen countries without a visa. ${etiasSentence()}`,
  },
  {
    q: 'Do Americans need ETIAS to visit Spain?',
    a: `${etiasSentence()} When it does apply, you fill it in online once, it is linked to your passport and covers every trip for ${ETIAS.validityYears} years. Use only the EU's official site; the paid sites that rank above it charge for the same form.`,
  },
  {
    q: 'How long must my passport be valid to enter Spain?',
    a: 'At least three months beyond the day you plan to leave the Schengen area, and issued within the last ten years. Airlines check this at the gate in the US and deny boarding if it fails, so a passport expiring in October does not work for a trip ending in August.',
  },
  {
    q: 'Can I drive in Ibiza with a US license?',
    a: 'Only together with an International Driving Permit. Spain requires the IDP as the official translation of a non-EU license; rental desks can refuse the car without it, and a roadside check without one is a fine. AAA issues the permit in about 20 minutes for around $20 with two passport photos. It is valid one year and it has to travel with your actual license, not instead of it.',
  },
  {
    q: 'Do you tip in Ibiza?',
    a: 'Not the way you do at home, and nobody expects 20 percent. Spanish staff are paid a wage and service is included in the bill. In restaurants, 5 to 10 percent for genuinely good service is generous; in taxis, round up; at a beach club or a VIP table, a tip for the person who looked after you all day is appreciated and discretionary. Never tip on a card machine that adds a percentage you did not choose.',
  },
  {
    q: 'Should I pay in euros or dollars when the card machine asks?',
    a: 'Euros, every time. The dollar option is dynamic currency conversion at the merchant’s rate, typically three to six percent worse than what your bank charges. Choose euros and let your card do the conversion. The same applies at ATMs.',
  },
  {
    q: 'What is the drinking age in Ibiza, and will I be carded?',
    a: '18, and yes. Every club checks physical photo ID at the door regardless of how old you look, and most do not accept a photo of your passport on a phone. Carry your actual passport or your driver’s license, and keep the passport in the hotel safe on nights you take the license.',
  },
  {
    q: 'Do I need a power adapter for Spain?',
    a: 'Yes, a Type C or Type F plug adapter (the two round pins used across most of Europe). Spain runs on 230 volts, 50 hertz; phones, laptops and camera chargers handle that on their own, but a US hair dryer or straightener without a voltage switch will not, and cheap converters burn them out.',
  },
]

export default function RequirementsPage() {
  return (
    <>
      <SchemaMarkup
        locale={LOCALE}
        page={{ path: PATH, dateModified: contentUpdated(PAGE_KEY), name: TITLE, description: DESCRIPTION }}
        breadcrumbs={CRUMBS}
        faqs={FAQS}
      />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Ibiza Travel Requirements for US Citizens"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              A US passport gets you into Ibiza visa-free for up to 90 days in any 180, as long as it is valid
              three months past your departure and was issued within the last ten years. {etiasSentence()}
            </p>
            <p className="mt-4">
              The rule most Americans miss is on the road, not at the border: a US license is only valid in
              Spain together with an International Driving Permit, and the rental desk is where that surfaces.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="At the border"
        intro={`Ibiza is Spain and Spain is in the Schengen area, so the rules are the EU's. Checked ${usDate(ETIAS.asOf)}.`}
        columns={3}
        items={[
          {
            name: 'Passport',
            body: 'Valid at least three months beyond the day you leave the Schengen area, issued within the last ten years, with a blank page. The airline enforces this at check-in in the US.',
          },
          {
            name: '90 days in 180',
            body: 'Visa-free stays are counted across every Schengen country combined. A week in Paris before Ibiza counts. There is no extension for tourists; overstaying earns a fine and an entry ban.',
          },
          {
            name: 'ETIAS',
            body: etiasSentence(),
          },
          {
            name: EES.live ? 'Biometric entry (EES)' : 'Entry registration',
            body: EES.live
              ? 'At your first Schengen border, fingerprints and a photo are recorded instead of a passport stamp. It is quick, but on your first trip it means a longer line in Madrid or Barcelona. Allow two hours for the connection.'
              : 'Passport stamp on entry and exit.',
          },
          {
            name: 'Return or onward ticket',
            body: 'Border officers can ask for proof you are leaving within 90 days and where you are staying. A round trip and a hotel confirmation on your phone are enough.',
          },
          {
            name: 'Customs',
            body: 'Cash of €10,000 or more must be declared. Prescription medication travels in its original packaging with the prescription; some US-legal products, including CBD in certain forms, are not legal in Spain.',
          },
        ]}
      />

      <TrustBlock
        heading="Driving: the International Driving Permit"
        locale={LOCALE}
        intro="Spain treats a US license as valid only with an official translation, and the International Driving Permit is that translation. It is a $20 booklet, and it is the one document Americans most often arrive without."
        points={[
          {
            title: 'Where to get it',
            body: 'AAA branches issue it over the counter to any US license holder, typically in about 20 minutes, for around $20 plus two passport photos. AATA is the other authorized issuer. Anyone else selling an "international license" online is selling paper the rental desk will not accept.',
          },
          {
            title: 'What it is not',
            body: 'It is not a license. It is valid only alongside your US license and for one year from issue. Carry both, together, whenever you drive.',
          },
          {
            title: 'What happens without it',
            body: 'The rental company can refuse the car, and many do, all-inclusive prepaid booking or not. At a roadside check, driving on a US license alone is a fine. Our partner Wiber will ask for your documents at pick-up; see the car rental page for the full conditions.',
          },
          {
            title: 'Age and card',
            body: 'Minimum rental age with our partner is 21, license held at least 12 months, and a credit card in the main driver’s name; debit cards are generally refused for the deposit. Drivers 21 to 24 pay a daily young-driver surcharge.',
          },
        ]}
      />

      <ItemGrid
        heading="Money, tipping and the everyday differences"
        columns={3}
        items={[
          {
            name: 'Currency and cards',
            body: 'The euro. Visa and Mastercard contactless work almost everywhere, including taxis and beach bars; American Express less so. Prices include tax (21 percent VAT), so what you see is what you pay. Keep some cash for small shops and the Saturday market.',
          },
          {
            name: 'Tipping',
            body: 'Service is included and staff are salaried. Five to ten percent for good restaurant service is generous, rounding up a taxi is normal, and a tip at a beach club or VIP table is appreciated but nobody expects 20 percent. Never tip through a machine that pre-selects a percentage.',
          },
          {
            name: 'Time zone',
            body: 'Central European Summer Time: six hours ahead of New York, nine ahead of Los Angeles. Dinner at 10 p.m. and club doors at midnight feel less strange when your body clock is still on Eastern.',
          },
          {
            name: 'Phones',
            body: 'Country code +34. Most US plans roam in Spain for a daily fee; an eSIM bought before you fly is cheaper for a week. Emergency number is 112, in English.',
          },
          {
            name: 'Plugs and voltage',
            body: 'Type C and F sockets, 230 volts. Bring a plug adapter; phones and laptops need nothing else. Leave the US hair dryer at home unless it switches to 230 V.',
          },
          {
            name: 'Tourist tax',
            body: 'The Balearic sustainable tourism tax is added per person per night at your hotel, a few euros in high season and less in the shoulder months. It is not included in online room rates and is paid at the desk.',
          },
        ]}
      />

      <ProseSection
        heading="What we would tell a friend"
        paragraphs={[
          'Get the International Driving Permit before you leave. It is the single document that decides whether your Ibiza plans need a car or a taxi budget, and it cannot be obtained once you are here. Twenty minutes at AAA is the whole job.',
          'Photograph your passport, your license and the IDP and email them to yourself. Then leave the passport in the hotel safe and take the license out at night. Clubs want physical photo ID, and a driver’s license does the job at every major door.',
          'Tell your bank the dates. A first tap in Madrid airport followed by a beach club charge in Ibiza is exactly what fraud models flag, and a frozen card at 2 a.m. outside a club is a bad way to learn it.',
          'If ETIAS has gone live by the time you read this, do it the week you book the flights, on the EU site, and do not pay anyone else to file it. It takes ten minutes and the approval is usually back before you finish your coffee.',
        ]}
      />

      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <WhatsAppCta
        locale={LOCALE}
        heading="Not sure what applies to you?"
        body="Ask us before you fly. We cannot give legal advice, but we can tell you what the door, the rental desk and the marina actually ask for, because we stand next to them every week."
        prefill="Hi Simon! I'm an American traveler coming to Ibiza and I have a question about documents."
      />

      <InternalLinks
        heading="Related pages"
        locale={LOCALE}
        links={[
          { label: 'Car rental in Ibiza', href: 'car-rental-ibiza', body: 'All-inclusive hire through Wiber, the conditions in full, and who should book elsewhere.' },
          { label: 'Ibiza club dress code', href: 'ibiza-club-dress-code', body: 'What gets you refused at the door, and the ID rule every club enforces.' },
          { label: 'Ibiza nightlife guide', href: 'ibiza-nightlife', body: 'How a night here actually runs, hour by hour.' },
        ]}
      />

      <UsClusterLinks current={PATH} />

      <AuthorByline locale={LOCALE} topic="traveling to Ibiza from the US" />
    </>
  )
}
