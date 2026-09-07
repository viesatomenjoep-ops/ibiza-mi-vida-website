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
const LOCALE: Locale = 'de'
const PAGE_KEY = 'cabrio-mieten-ibiza'

/**
 * Deutsche Variante. Keine Übersetzung der englischen.
 *
 * Aufhänger ist die Buchungszeit. Cabrios sind ein kleiner Teil jeder
 * Ibiza-Flotte und die erste Kategorie, die für Juli und August weg ist — im
 * Frühjahr buchen ist normal, im Juli für August buchen heißt meist: nichts
 * mehr da, zu keinem Preis. Für ein Publikum, das die Reise ohnehin früh plant,
 * ist das die nützlichste Information auf der Seite.
 *
 * Die englische Fassung stellt die Frage "lohnt es sich?" nach vorn. Hier steht
 * sie auch drin, aber die Antwort nützt nur, wenn im August überhaupt noch
 * eines dasteht.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cabrio mieten auf Ibiza',
    description:
      'Cabrio auf Ibiza mieten: für welche Küstenstraßen sich der Aufpreis lohnt, wie viel Gepäck wirklich passt und warum man im Frühjahr buchen muss.',
    alternates: localizedAlternates('convertible-rental', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Cabrio mieten auf Ibiza',
      description: 'Drei Straßen, für die es sich lohnt — und warum die Kategorie im Juli schon weg ist.',
      locale: 'de_DE',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Cabrio mieten auf Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Mietwagen Ibiza', path: 'mietwagen-ibiza' },
  { name: 'Cabrio' },
]

const FAQS: Faq[] = [
  { q: 'Wie früh muss ich ein Cabrio buchen?', a: 'Für Juli und August im Frühjahr. Cabrios sind ein kleiner Teil jeder Ibiza-Flotte und die erste Kategorie, die in den Spitzenwochen ausverkauft ist. Im Juli für August zu buchen bedeutet in der Regel, dass zu keinem Preis mehr eines dasteht. Für Mai, Juni, September und Oktober ist die Lage entspannt und der Tagespreis niedriger.' },
  { q: 'Lohnt sich ein Cabrio auf Ibiza?', a: 'Für die Küstenstraßen ja. Die Fahrt von Sant Josep hinunter zur Cala d’Hort und die Nordstraße Richtung Portinatx sind mit offenem Dach wirklich besser, und das sind die Fahrten, an die man sich erinnert. Für eine Woche Flughafenfahrten und Supermarktbesuche nein: du zahlst mehr für einen kleineren Kofferraum und ein Auto, das du bei jedem Halt ausräumen musst.' },
  { q: 'Wie viel Gepäck passt hinein?', a: 'Weniger als gedacht, und bei offenem Dach noch weniger, denn das Dach liegt im Kofferraum. Zwei Personen mit Handgepäck passen gut. Vier Personen mit Koffern nicht, was die Kategoriebeschreibung auch verspricht. Wer zu viert landet, nimmt den Kompaktwagen und mietet das Cabrio für einen Tag.' },
  { q: 'Was kostet ein Cabrio gegenüber einem normalen Auto?', a: 'Mehr pro Tag als ein Economy oder Kompakt, und der Abstand wächst im Juli und August, weil die Kategorie zuerst ausverkauft. Der ehrliche Weg ist, es für die Tage zu buchen, an denen du wirklich die Küste fährst — bei einer kurzen Reise gewinnt allerdings meist die Einfachheit einer einzigen Buchung.' },
  { q: 'Kann ich Sachen im Auto lassen, während ich schwimme?', a: 'Nein, und das ist der praktische Haken, der Cabriowochen verdirbt. Ein offenes Auto auf einem Strandparkplatz ist eine Einladung, und auch mit geschlossenem Dach ist ein Stoffverdeck kein abschließbarer Kofferraum. Das heißt: bei jedem Halt ausräumen — auf einer Fahrt eine Kleinigkeit, an einem Strandtag echte Mühe.' },
  { q: 'Ist es nicht zu heiß mit offenem Dach?', a: 'Mitten am Julinachmittag ehrlich gesagt ja: du stehst im Verkehr, in der prallen Sonne, ohne Schatten. Die Stunden mit offenem Dach sind früh am Morgen und ab etwa sechs Uhr abends — genau dann, wenn die Küstenstraßen ohnehin am besten aussehen. Plane die Fahrt dafür und es stimmt.' },
]

export default function CabrioMietenPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Cabrio mieten auf Ibiza',
        description: 'Cabriovermietung auf Ibiza für die West- und Nordküstenstraßen, all-inclusive über Wiber Rent a Car.',
        brand: 'Wiber Rent a Car', price: null, path: 'cabrio-mieten-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Cabrio mieten auf Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Ein Cabrio verdient seinen Aufpreis auf etwa drei Straßen hier, und die beste sind die zwanzig
            Minuten von Sant Josep hinunter zur Cala d’Hort mit Es Vedrà vor der Scheibe. Wichtiger als
            die Frage, ob es sich lohnt, ist aber der Zeitpunkt: die Kategorie ist die erste, die für Juli
            und August ausverkauft. Im Frühjahr buchen ist normal — im Juli für August anzufragen heißt
            meist, dass keines mehr dasteht.
          </p>
        }
      />

      <ItemGrid
        heading="Die Straßen, für die man das Dach öffnet"
        intro="Drei Fahrten, die die Kategorie rechtfertigen, und eine, die es nicht tut."
        items={[
          { name: 'Sant Josep zur Cala d’Hort', body: 'Die Südwestfahrt, hinunter durch Pinien und Terrassen, mit Es Vedrà, das am Ende die Windschutzscheibe füllt. Die besten zwanzig Minuten Fahren auf der Insel, am schönsten in der letzten Stunde Licht.' },
          { name: 'Die Nordstraße nach Portinatx', body: 'Länger, grüner und leerer, kurvig durch Sant Joan. Langsamer als die Karte vermuten lässt und gerade deshalb besser. Diese fährt man morgens, vor der Hitze.' },
          { name: 'Ibiza-Stadt nach Santa Eulària', body: 'Die einfache Küstenoption, kurz und zivilisiert, gut für einen Abend. Nicht spektakulär, aber angenehm mit offenem Dach und völlig mühelos.' },
          { name: 'Nicht: die Flughafenstraße', body: 'Gerade, voll und heiß, mit fast jede Saison irgendwo einer Baustelle. Diese hat noch niemand offen im Augustverkehr genossen.' },
        ]}
      />

      <PriceTable
        heading="Was es kostet"
        locale={LOCALE}
        caption="Einstiegspreis für die Cabriovermietung"
        intro="Höher pro Tag als ein Economy oder Kompakt, und die Kategorie ist in den Spitzenwochen zuerst weg. Frag uns nach der Zahl für deine Daten — sie bewegt sich stärker mit der Saison als mit dem Modell."
        rows={[{ label: 'Cabrio', note: '2 Erwachsene, kleiner Kofferraum, Küstenstraßen', amount: null, unit: RENTAL_PRICES.carPerDay.unit.de }]}
      />

      <ProseSection
        heading="Warum die Kategorie so schnell weg ist"
        paragraphs={[
          'Eine Ibiza-Flotte besteht überwiegend aus Economy- und Kompaktwagen: das ist, was die meisten Gäste brauchen und was sich das ganze Jahr auslastet. Cabrios sind eine Handvoll Autos pro Station, und sie werden von Leuten gebucht, die die Reise Monate vorher planen. Beides zusammen heißt, dass die Kategorie im Hochsommer nicht knapp wird, sondern schlicht leer ist.',
          'Praktisch: für Juli und August im Frühjahr buchen. Für Mai, Juni, September und Oktober ist die Lage entspannt, der Tagespreis niedriger und die Küstenstraßen sind ohnehin angenehmer zu fahren.',
          'Und wenn nichts mehr frei ist: das Cabrio für zwei Tage nehmen und für den Rest der Woche etwas mit abschließbarem Kofferraum. Das ist ohnehin die bessere Aufteilung — siehe unten.',
        ]}
      />

      <TrustBlock
        heading="Buchen über Wiber"
        locale={LOCALE}
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Cabrio-Verfügbarkeit prüfen"
        points={[
          { title: 'Früh buchen', body: 'Cabrios sind ein kleiner Teil jeder Ibiza-Flotte und die erste Kategorie, die für Juli und August ausverkauft.' },
          { title: 'All-inclusive-Tarif', body: 'Versicherung im Preis: der Aufpreis, den du zahlst, ist für das Auto und nicht für Deckung, die am Schalter verkauft wird.' },
          { title: 'Gleiche Bedingungen', body: 'Mindestalter 21, Führerschein seit 12 Monaten, 9 € Jungfahrerzuschlag pro Tag für 21- bis 24-Jährige, Kreditkarte auf den Hauptfahrer.' },
          { title: 'Fünf Minuten vom Flughafen', body: 'Dieselbe Station und derselbe kostenlose Shuttle wie bei jeder anderen Kategorie — Ctra. Aeropuerto km 5, Sant Josep.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Weiterlesen" locale={LOCALE} links={[
        { label: 'Mietwagen auf Ibiza', href: 'mietwagen-ibiza', body: 'Die Pillar-Seite: alle Kategorien, Bedingungen und Parkhinweise.' },
        { label: 'Mietwagen am Flughafen', href: 'mietwagen-ibiza-flughafen', body: 'Die Abholung, der Shuttle und was nach einer späten Landung zu tun ist.' },
        { label: 'Boot mieten auf Ibiza', href: 'boats', body: 'Cala d’Hort vom Wasser aus statt von der Klippenstraße.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="Cabrio mieten auf Ibiza" />
    </>
  )
}
