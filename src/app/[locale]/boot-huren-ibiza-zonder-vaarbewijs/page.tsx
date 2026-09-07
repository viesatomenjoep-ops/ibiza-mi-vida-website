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
const LOCALE: Locale = 'nl'
const PAGE_KEY = 'boot-huren-ibiza-zonder-vaarbewijs'
const prijs = RENTAL_PRICES.boatNoLicence.amount

/**
 * Nederlandse variant. Geen vertaling van de Engelse.
 *
 * De invalshoek komt uit een misverstand dat alleen Nederlanders en Belgen
 * kunnen hebben. Thuis hangt de vaarbewijsplicht aan LENGTE en SNELHEID — boven
 * de 15 meter of harder dan 20 km/u — en niet aan vermogen. Wie dat meeneemt
 * naar Spanje rekent verkeerd: hier is 15 pk de grens, plus een romp onder zes
 * meter én een afgesproken vaargebied. Drie voorwaarden waar er thuis nul zijn.
 *
 * Dat is geen detail. Iemand die denkt "ik vaar thuis ook zonder papieren" boekt
 * een boot waar hij niet in mag, of vaart buiten zijn vaargebied en staat
 * onverzekerd op het water.
 *
 * De vier voorwaarden zijn Spaanse wet, geen huisregel, en dat staat er ook.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Boot huren Ibiza zonder vaarbewijs',
    description:
      'Boot huren op Ibiza zonder vaarbewijs: maximaal 15 pk, romp onder zes meter, bestuurder vanaf 18 en een afgesproken vaargebied. Wat je er echt mee kunt.',
    alternates: localizedAlternates('boat-no-licence', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Boot huren Ibiza zonder vaarbewijs',
      description: 'De vier Spaanse voorwaarden, en waarom de Nederlandse regel hier niet opgaat.',
      locale: 'nl_NL',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Boot huren Ibiza zonder vaarbewijs' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza op het water', path: 'boats' },
  { name: 'Zonder vaarbewijs' },
]

const FAQS: Faq[] = [
  { q: 'Geldt de Nederlandse vaarbewijsregel hier ook?', a: 'Nee, en dat is het misverstand waar het vaakst iets misgaat. In Nederland hangt de plicht aan lengte en snelheid: boven de 15 meter of harder dan 20 km per uur heb je een vaarbewijs nodig. In Spanje hangt het aan vermogen — maximaal 15 pk — plus een romp onder zes meter en een vaargebied dat je afspreekt. Drie voorwaarden waar er thuis geen zijn. Reken dus niet met wat je gewend bent.' },
  { q: 'Kan ik op Ibiza echt zonder enig papier een boot huren?', a: 'Ja, binnen een vaste grens. De Spaanse regels laten iedereen van 18 jaar of ouder een boot van maximaal 15 pk met een romp onder zes meter varen, zonder vaarbewijs en zonder aantoonbare ervaring. Je krijgt vooraf een briefing en een vaargebied waar je binnen blijft. Alles wat krachtiger of langer is vraagt een erkend vaarbewijs, en geen enkele verhuurder kan daarvan afwijken.' },
  { q: 'Hoeveel is 15 pk in de praktijk?', a: 'Genoeg om een kleine boot met vier tot zes mensen op wandel- tot jogtempo over het water te bewegen, en niet genoeg om te planeren of tegen de wind in te knokken. Zie het als een manier om in twintig minuten de volgende baai te bereiken, niet om het eiland rond te varen. Wie een speedboot voor zich ziet komt bedrogen uit; wie een drijvende picknick voor zich ziet niet.' },
  { q: 'Waar mag ik heen?', a: 'Binnen het gebied dat de basis vóór vertrek op een kaart aangeeft, meestal het stuk kust rond je vertrekhaven. Vanuit San Antonio is dat doorgaans de baai en de baaien zuidwaarts richting Cala Bassa en Cala Comte. De oversteek naar Formentera zit er niet in — dat is open water en vraagt een andere boot en realistisch gezien een schipper.' },
  { q: 'Wat kost het?', a: 'Boten zonder vaarbewijs zijn de goedkoopste manier om hier het water op te gaan, en kosten minder dan welke charter met schipper dan ook. Brandstof wordt apart op verbruik afgerekend, en op een 15 pk-motor is dat werkelijk weinig. Het tarief beweegt met het seizoen, dus stuur je datum en groepsgrootte voor het cijfer van die dag.' },
  { q: 'Hoeveel mensen passen erin?', a: 'Vier tot zes, bepaald door het certificaat van de boot en niet door de ruimte aan dek. Geef bij je aanvraag het echte aantal door, kinderen meegeteld — met z’n zevenen aankomen voor een certificaat van zes betekent dat er iemand op de steiger blijft.' },
  { q: 'Heb ik ervaring nodig?', a: 'Nee, en de meeste mensen die hiermee wegvaren hebben die ook niet. De briefing behandelt starten, stoppen, sturen, ankeren en wat je doet als de motor uitvalt, en de boten zijn bewust traag en vergevingsgezind. Kun je een auto achteruit inparkeren, dan kun je hiermee overweg.' },
]

export default function BootHurenZonderVaarbewijsPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Boot huren op Ibiza zonder vaarbewijs',
        description: 'Boot huren op Ibiza zonder vaarbewijs: tot 15 pk, romp onder zes meter, bestuurder vanaf 18 jaar.',
        brand: 'Click&Boat', price: prijs, path: 'boot-huren-ibiza-zonder-vaarbewijs',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Boot huren op Ibiza zonder vaarbewijs"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Je mag op Ibiza zonder enig vaarbewijs varen, zolang je binnen vier voorwaarden blijft:
            maximaal 15 pk, een romp onder zes meter, een bestuurder van 18 of ouder, en een afgesproken
            vaargebied waar je na de veiligheidsbriefing binnen blijft.
            {prijs ? ` Boten vanaf €${prijs} per dag.` : ''} Let op: dit is Spaanse wet en niet de
            Nederlandse regel — thuis telt lengte en snelheid, hier telt vermogen.
          </p>
        }
      />

      <ItemGrid
        heading="De vier regels, volledig"
        columns={2}
        intro="Dit zijn wettelijke grenzen en geen huisregels. Een verhuurder die aanbiedt er eentje op te rekken, biedt aan je buiten je verzekering te zetten."
        items={[
          { name: 'Maximaal 15 pk', body: 'Het vermogensplafond voor varen zonder papieren. Dit getal bepaalt alles aan de dag: langzaam, stabiel, en prima om tussen nabije baaien te hoppen.' },
          { name: 'Romp onder zes meter', body: 'Lengte telt net zo zwaar als vermogen. Een boot kan onder de 15 pk zitten en tóch een vaarbewijs vragen als de romp te lang is — daarom is de vloot hiervoor klein en specifiek.' },
          { name: 'Bestuurder 18 of ouder', body: 'Wie aan de knoppen staat moet 18 zijn, met identiteitsbewijs. Passagiers mogen elke leeftijd hebben, in een zwemvest op maat. Alleen de bestuurder tekent.' },
          { name: 'Een vast vaargebied', body: 'Bij de briefing op een kaart aangegeven, meestal de kust rond je vertrekhaven. Eruit varen is wat de dekking laat vervallen, en de kustwacht controleert hier echt.' },
        ]}
      />

      <PriceTable
        heading="Wat het kost"
        locale={LOCALE}
        caption="Instapprijs voor een boot zonder vaarbewijs"
        intro="Per boot, per dag, gedeeld door vier tot zes personen. Brandstof komt erbij en het verbruik van een 15 pk-motor is bescheiden."
        rows={[{ label: 'Boot zonder vaarbewijs', note: '4–6 personen, max 15 pk', amount: prijs, unit: RENTAL_PRICES.boatNoLicence.unit.nl }]}
      />

      <ItemGrid
        heading="Waar je realistisch komt"
        intro="Haalbare bestemmingen op 15 pk vanuit San Antonio, waar de meeste boten zonder vaarbewijs liggen."
        items={[
          { name: 'Cala Bassa', body: 'Twintig tot dertig minuten langs de kust, beschut en zandig. De standaard eerste stop, en de enige die met kinderen aan boord echt werkt.' },
          { name: 'Cala Comte', body: 'Iets verder zuidwaarts, ondiep en turquoise. Haalbaar op een rustige dag; check de verwachting, want terug tegen de wind in duurt op 15 pk lang.' },
          { name: 'De baai van San Antonio', body: 'De baai zelf is de terugvaloptie en dat is geen troostprijs: vlak water, makkelijk ankeren, en dichtbij genoeg om tussendoor te gaan lunchen.' },
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            Bekijk boten zonder vaarbewijs op Click&amp;Boat
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Verder lezen" locale={LOCALE} links={[
        { label: 'Boot huren op Ibiza', href: 'boats', body: 'De pillar: alle drie de manieren om het water op te gaan, met prijzen en jachthavens.' },
        { label: 'Boot huren met schipper', href: 'boot-huren-ibiza-met-schipper', body: 'Wanneer iemand anders vaart, en waarom dat vaak de goedkopere keuze is.' },
        { label: 'Jetski huren op Ibiza', href: 'jetski-huren-ibiza', body: 'De snellere, kortere versie, met eigen regels over vaarbewijzen.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="boot huren op Ibiza zonder vaarbewijs" />
    </>
  )
}
