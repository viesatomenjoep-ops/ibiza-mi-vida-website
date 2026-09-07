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
const LOCALE: Locale = 'nl'
const PAGE_KEY = 'boot-huren-ibiza-met-schipper'
const prijs = RENTAL_PRICES.boatWithSkipper.amount

/**
 * Nederlandse variant. Geen vertaling van de Engelse.
 *
 * De invalshoek is de erkenning van je papieren. Nederlanders en Belgen varen
 * veel en hebben vaak een Klein Vaarbewijs I of II, en gaan er daarom van uit
 * dat ze hier zelf mogen. Dat gaat niet automatisch op: een buitenlands
 * vaarbewijs wordt in Spanje niet voor elke categorie erkend, en de grotere
 * motorjachten en vrijwel alle catamarans worden hoe dan ook mét schipper
 * verhuurd — dat is een eis van de eigenaar en de verzekeraar.
 *
 * Wat we hier NIET zeggen is welk Nederlands of Belgisch papier waarvoor geldt.
 * Dat verschilt per boot en per categorie, dus de pagina zegt: stuur het
 * vaarbewijs én de boot, dan checken we de combinatie vóór je een datum
 * vastlegt. Een verkeerd ja kost hier een dag charter.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Boot huren op Ibiza met schipper',
    description:
      'Boot huren op Ibiza met schipper: wanneer het moet, wat het kost en waarom je Nederlandse vaarbewijs hier niet automatisch voor elke boot telt.',
    alternates: localizedAlternates('boat-with-skipper', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Boot huren op Ibiza met schipper',
      description: 'Wanneer een schipper verplicht is, en waarom je vaarbewijs hier niet altijd meetelt.',
      locale: 'nl_NL',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Boot huren op Ibiza met schipper' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza op het water', path: 'boats' },
  { name: 'Met schipper' },
]

const FAQS: Faq[] = [
  { q: 'Telt mijn Klein Vaarbewijs op Ibiza?', a: 'Niet automatisch voor elke categorie, en dat verrast de meeste Nederlanders en Belgen. Spanje erkent buitenlandse vaarbewijzen per categorie, niet in het algemeen, en of het jouwe een specifieke boot dekt hangt af van het type en de lengte. Stuur ons het vaarbewijs én de boot die je op het oog hebt, dan checken we de combinatie voordat je een datum vastlegt. Dat scheelt een dag charter die niet doorgaat.' },
  { q: 'Wanneer is een schipper verplicht?', a: 'Zodra de boot verder gaat dan wat jouw vaarbewijs dekt — en voor de meeste bezoekers is dat eerder dan verwacht. Daarnaast worden grotere motorjachten en vrijwel alle catamarans hoe dan ook mét schipper verhuurd, ongeacht wat je hebt. Dat is een eis van de eigenaar en de verzekeraar en niet iets waarover je aan de steiger onderhandelt.' },
  { q: 'Wat kost een schipper?', a: 'Op de meeste dagcharters zit de schipper in het genoemde tarief in plaats van als aparte regel. Waar het wel apart staat, is het een dagbedrag dat niet meebeweegt met de groepsgrootte, dus je deelt het door hoeveel jullie aan boord zijn. Brandstof blijft in beide gevallen apart. Vraag het voor de specifieke boot en we zeggen welke van de twee geldt.' },
  { q: 'Spreken de schippers Nederlands?', a: 'Engels is wijdverbreid en Spaans spreekt vanzelf. Nederlands bestaat, maar op minder boten — erom vragen versmalt dus de vloot in plaats van dat het geld kost. Zeg het bij de aanvraag: er achteraf op filteren betekent meestal van boot wisselen.' },
  { q: 'Blijft het mijn dag, of bepaalt de schipper?', a: 'De jouwe, met één uitzondering. Jij kiest waar je heen wil en hoe lang je in elke baai blijft; de schipper beslist wat veilig is, en dat oordeel is definitief. In de praktijk maakt zijn inbreng de dag beter in plaats van beperkter, want hij weet welke baaien werken bij de wind die er die dag staat.' },
  { q: 'Moet ik fooi geven?', a: 'Niet verplicht, en oprecht gewaardeerd na een dag die goed ging. Er geldt hier geen standaardpercentage. Behandel het zoals je een goede gids zou behandelen, niet zoals een restaurantrekening.' },
  { q: 'Telt de schipper mee voor het maximum aantal personen?', a: 'Op sommige certificaten wel en op andere niet, en dat verschil heeft groepen aan de steiger een persoon tekort laten komen. Geef het echte aantal door, dan controleren we het tegen de specifieke boot voordat je betaalt.' },
]

export default function BootHurenMetSchipperPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Boot huren op Ibiza met schipper',
        description: 'Dagcharters met schipper op Ibiza vanuit jachthavens rond het eiland, met lokale schippers die meerdere talen spreken.',
        brand: 'Click&Boat', price: prijs, path: 'boot-huren-ibiza-met-schipper',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Boot huren op Ibiza met schipper"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Een schipper is verplicht op de meeste boten die verder gaan dan wat een gewoon vaarbewijs
            dekt, en op vrijwel elk groter motorjacht en elke catamaran hier.
            {prijs ? ` Dagcharters met schipper vanaf €${prijs} per dag.` : ''} Reken er niet op dat je
            Klein Vaarbewijs elke categorie dekt — Spanje erkent buitenlandse papieren per categorie, niet
            in het algemeen.
          </p>
        }
      />

      <ItemGrid
        heading="Wanneer je er een nodig hebt, en wanneer je er een wil"
        columns={2}
        items={[
          { name: 'Vereist door de boot', body: 'De meeste motorjachten boven de kleine categorieën en vrijwel alle catamarans worden mét schipper verhuurd, wat voor vaarbewijs je ook hebt. Dat legt de eigenaar en de verzekeraar op, en daar valt aan de steiger niet over te praten.' },
          { name: 'Vereist door je vaarbewijs', body: 'Een buitenlands vaarbewijs wordt in Spanje niet voor elke categorie erkend. Stuur ons het vaarbewijs en de boot, dan checken we die combinatie voordat je je aan een datum vastlegt.' },
          { name: 'De moeite waard om het weer', body: 'De tramontana sluit het noorden van het eiland dagenlang af terwijl het zuiden en westen prima blijven. Een schipper draait de route diezelfde ochtend om; wie voor het eerst zelf vaart weet meestal niet dat dat moet.' },
          { name: 'De moeite waard om het ankeren', body: 'Weten waar de grond in elke baai houdt, leer je niet van een kaart. Dat is het grootste praktische verschil tussen een dag met en zonder schipper.' },
        ]}
      />

      <PriceTable
        heading="Wat een dag met schipper kost"
        locale={LOCALE}
        caption="Instapprijs voor een charter met schipper"
        intro="Per boot, per dag. Op de meeste charters zit de schipper in dit tarief; waar het apart staat is het een vast dagbedrag ongeacht de groepsgrootte. Brandstof gaat in beide gevallen op verbruik."
        rows={[{ label: 'Dagcharter met schipper', note: 'Schipper inbegrepen in het tarief', amount: prijs, unit: RENTAL_PRICES.boatWithSkipper.unit.nl }]}
      />

      <ProseSection
        heading="Wat een goede schipper echt verandert"
        paragraphs={[
          'Het voor de hand liggende antwoord is dat je niet hoeft te varen. Het echte antwoord is de route. Ibiza heeft een loefzijde en een lijzijde die per dag wisselen, en een schipper die deze wateren kent weet bij het ontbijt al in welke baaien je om twee uur ’s middags kunt zwemmen. Dat kun je nergens opzoeken.',
          'Het tweede is de timing. Om elf uur in augustus bij Cala Comte aankomen betekent rondjes varen op zoek naar een plek; om negen uur of om vijf uur anker je waar je wil. Schippers plannen de dag daar vanzelf omheen, en dat is precies het soort ding dat je anders één keer verkeerd doet.',
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            Bekijk boten met schipper op Click&amp;Boat
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Verder lezen" locale={LOCALE} links={[
        { label: 'Boot huren op Ibiza', href: 'boats', body: 'De pillar: alle drie de manieren om het water op te gaan, met jachthavens en routes.' },
        { label: 'Boot huren zonder vaarbewijs', href: 'boot-huren-ibiza-zonder-vaarbewijs', body: 'Het andere uiterste: 15 pk, geen papieren, baaien dichtbij.' },
        { label: 'Boat party op Ibiza', href: 'boat-party', body: 'Wanneer je de menigte wil in plaats van de boot voor jezelf.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="boot huren op Ibiza met schipper" />
    </>
  )
}
