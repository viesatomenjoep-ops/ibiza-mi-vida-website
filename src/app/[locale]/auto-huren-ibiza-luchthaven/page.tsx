import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { WIBER_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'
const LOCALE: Locale = 'nl'
const PAGE_KEY = 'auto-huren-ibiza-luchthaven'
const perDag = RENTAL_PRICES.carPerDay.amount

/**
 * Nederlandse variant. Geen vertaling van de Engelse.
 *
 * De invalshoek is de creditcard, en dat is geen detail maar de meest gemaakte
 * fout bij Nederlandse en Belgische huurders. Wij pinnen thuis met een
 * debetkaart en veel mensen hébben geen creditcard, of alleen die van hun
 * partner. Aan de balie is dat het einde van de rit: de borg wordt op een
 * creditcard op naam van de hoofdbestuurder geblokkeerd, en daar valt om
 * middernacht niet over te praten.
 *
 * De Engelse pagina noemt het als één van vier dingen om mee te nemen. Hier
 * staat het vooraan, want hier is het het probleem.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Auto huren luchthaven Ibiza (IBZ)',
    description:
      'Auto ophalen bij Ibiza Airport: Wiber-kantoor op vijf minuten met gratis shuttle, contactloos ophalen. En de creditcard-eis waar Nederlanders op stuklopen.',
    alternates: localizedAlternates('car-rental-airport', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Auto huren luchthaven Ibiza (IBZ)',
      description: 'Ophalen op vijf minuten van de terminal — en waarom je een creditcard nodig hebt.',
      locale: 'nl_NL',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Auto huren luchthaven Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Auto huren Ibiza', path: 'auto-huren-ibiza' },
  { name: 'Luchthaven' },
]

const FAQS: Faq[] = [
  { q: 'Kan ik met mijn pinpas betalen?', a: 'Nee, en dit is waar Nederlanders en Belgen het vaakst op stuklopen. Er moet een creditcard op naam van de hoofdbestuurder zijn: daar wordt de borg op geblokkeerd. Een debetkaart, een Maestro, een prepaid kaart of de creditcard van je partner worden geweigerd, en aan de balie om middernacht is daar niets aan te doen. Heb je er geen, regel dat vóór je boekt.' },
  { q: 'Zit de balie in de terminal?', a: 'Bij Wiber niet. Het kantoor ligt vijf minuten verderop aan de Ctra. Aeropuerto op km 5 in Sant Josep, bereikbaar met een gratis shuttle vanaf de terminal. Dat klinkt als een nadeel en is het in augustus juist niet: de balies buiten het vliegveld lopen sneller door dan de rij binnen wanneer er drie vluchten tegelijk landen.' },
  { q: 'Waar vind ik de shuttle?', a: 'Buiten bij aankomst, bij de shuttlehalte en niet bij de taxistandplaats. De rit naar het kantoor duurt ongeveer vijf minuten. Stuur ons je vluchtnummer, dan weet het kantoor wanneer je landt — dat scheelt vooral bij de late avondvluchten.' },
  { q: 'En als mijn vlucht vertraging heeft?', a: 'Geef het vluchtnummer bij het boeken door en vertraging lost zichzelf op: het kantoor volgt de aankomst en niet het geboekte tijdstip. Wat wél misgaat is een omboeking die niemand weet, dus laat het even weten als je van vlucht verandert. Na een lange vertraging landen terwijl niemand je verwacht is het enige scenario dat je wil vermijden.' },
  { q: 'Wat moet ik meenemen?', a: 'Een creditcard op naam van de hoofdbestuurder, het rijbewijs zelf, en een identiteitsbewijs. Alle drie, elke keer. Het rijbewijs moet minstens twaalf maanden geleden zijn afgegeven, en voor bestuurders van 21 tot 24 geldt een jonge-bestuurderstoeslag van €9 per dag.' },
  { q: 'Hoe lang duurt het ophalen?', a: 'Met contactloos ophalen is het papierwerk al klaar voor je aankomt, dus het is een sleuteloverdracht en geen balie-afspraak — meestal onder het kwartier, shuttle inbegrepen. De vergelijking die telt is met een rij in de terminal in augustus, en die loopt geregeld over het uur.' },
  { q: 'Kan ik buiten openingstijden inleveren?', a: 'Vraag het bij het boeken, want het hangt af van de datum en het tijdstip in plaats van dat het altijd wel of niet kan. Vroege ochtendvluchten zijn het gangbare geval en worden normaal gesproken geregeld. Wat je niet moet doen is het aannemen en de sleutels ergens achterlaten: een niet-ingeleverde auto blijft jouw verantwoordelijkheid.' },
]

export default function AutoHurenLuchthavenPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Auto huren bij Ibiza Airport',
        description: 'All-in autohuur, opgehaald op vijf minuten van Ibiza Airport met gratis shuttle en contactloos ophalen.',
        brand: 'Wiber Rent a Car', price: perDag, path: 'auto-huren-ibiza-luchthaven',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Auto huren bij de luchthaven van Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Je haalt op vijf minuten van de terminal op, niet erin: het Wiber-kantoor zit aan de Ctra.
            Aeropuerto km 5 in Sant Josep, met een gratis shuttle vanaf aankomst en contactloos ophalen.
            {perDag ? ` Tarieven vanaf €${perDag} per dag, all-in.` : ''} Eén ding vooraf, want het is de
            fout die Nederlanders en Belgen het vaakst maken: er moet een creditcard op naam van de
            hoofdbestuurder zijn. Een pinpas of Maestro wordt geweigerd.
          </p>
        }
      />

      <ItemGrid
        heading="Ophalen, stap voor stap"
        columns={2}
        items={[
          { name: '1. Stuur je vluchtnummer', body: 'Bij het boeken, niet op de dag zelf. Het kantoor volgt de aankomst, dus een vertraagde vlucht wordt opgevangen zonder dat je vanaf de bagageband moet bellen.' },
          { name: '2. Zoek de shuttle', body: 'Buiten bij aankomst, bij de shuttlehalte en niet bij de taxi’s. Ongeveer vijf minuten naar het kantoor op km 5.' },
          { name: '3. Haal de sleutel', body: 'Het papierwerk is vooraf gedaan. Neem de creditcard op naam van de hoofdbestuurder mee, het rijbewijs en een identiteitsbewijs — alle drie, elke keer.' },
          { name: '4. Loop de auto rond', body: 'Fotografeer wat er al beschadigd is voor je wegrijdt. Twee minuten hier is de goedkoopste verzekering die er bestaat, bij elke verhuurder ter wereld.' },
        ]}
      />

      <ProseSection
        heading="De creditcard, en waarom dit hier misgaat"
        paragraphs={[
          'In Nederland en België betaal je overal met een debetkaart, dus een deel van de reizigers heeft simpelweg geen creditcard — of alleen die van hun partner. Bij een autoverhuurder is dat het einde van de rit: de borg wordt geblokkeerd op een creditcard die op naam van de hoofdbestuurder staat, en dat is een eis van de verhuurder én van de verzekering. Aan de balie valt er niets aan te doen.',
          'Twee dingen die daarbij horen. De kaart moet fysiek mee — een kaart in Apple Pay telt niet, want er moet een bedrag op geblokkeerd worden. En de naam op de kaart moet die van de hoofdbestuurder zijn: rijdt jouw partner, dan moet zijn of haar kaart mee, niet die van jou.',
          'Heb je geen creditcard, zeg dat dan vóór je boekt. Soms is er een oplossing, soms niet, maar dat weten we van tevoren in plaats van dat je het om middernacht ontdekt.',
        ]}
      />

      <TrustBlock
        heading="Boeken via Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Bekijk beschikbaarheid bij de luchthaven"
        points={[
          { title: 'Gratis shuttle', body: 'Van de terminal naar het kantoor op km 5, inbegrepen. Geen taxi, geen aparte kosten.' },
          { title: 'All-in tarief', body: 'De verzekering zit in de prijs, dus er wordt na een lange vlucht niets meer aan de balie bijverkocht.' },
          { title: 'Contactloos ophalen', body: 'Papierwerk klaar voor aankomst. De stap die van een uur een kwartier maakt.' },
          { title: 'Een Nederlands aanspreekpunt', body: 'Gaat er bij de balie iets mis, dan app je ons — geen callcenter in een ander land.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Verder lezen" locale={LOCALE} links={[
        { label: 'Auto huren op Ibiza', href: 'auto-huren-ibiza', body: 'De pillar: voorwaarden, categorieën en waarom een auto hier de moeite is.' },
        { label: 'Cabrio huren op Ibiza', href: 'cabrio-huren-ibiza', body: 'De kustwegen waarvoor je er echt een boekt.' },
        { label: 'Boot huren op Ibiza', href: 'boats', body: 'Waar je naartoe rijdt, en wat je daar doet.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="auto huren bij Ibiza Airport" />
    </>
  )
}
