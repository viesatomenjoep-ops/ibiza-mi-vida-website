import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { WiberDirect } from '@/components/partner/WiberDirect'
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
const LOCALE: Locale = 'de'
const PAGE_KEY = 'mietwagen-ibiza'
const proTag = RENTAL_PRICES.carPerDay.amount

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Mietwagen auf Ibiza — all-inclusive',
    description:
      'Mietwagen auf Ibiza bei Wiber: All-inclusive-Tarif, Büro fünf Minuten vom Flughafen mit Gratis-Shuttle. Bedingungen, Kaution und der Zuschlag für junge Fahrer.',
    alternates: localizedAlternates('car-rental', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Mietwagen auf Ibiza — all-inclusive',
      description: 'Mietwagen auf Ibiza bei Wiber: All-inclusive, fünf Minuten vom Flughafen, Gratis-Shuttle.',
      locale: 'de_DE',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Mietwagen auf Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Startseite', path: '' },
  { name: 'Mietwagen Ibiza' },
]

const FAQS: Faq[] = [
  { q: 'Bekomme ich einen Mietwagen am Flughafen Ibiza?', a: 'Du holst ihn fünf Minuten entfernt ab, nicht im Terminal. Das Büro von Wiber liegt an der Ctra. Aeropuerto bei km 5 in Sant Josep, ein Gratis-Shuttle fährt vom Terminal dorthin. Das klingt nach einem Nachteil und ist im August das Gegenteil: die Schalter im Terminal bedeuten nach mehreren Abendankünften regelmäßig über eine Stunde Wartezeit.' },
  { q: 'Was heißt all-inclusive konkret?', a: 'Der Preis, den du bekommst, ist der Preis, den du zahlst: die Versicherung steckt im Tarif, statt am Schalter verkauft zu werden, und es gibt kein Spiel mit der Tankkaution. Es heißt nicht, dass nie etwas dazukommen kann — Schäden außerhalb der Deckung, ein verlorener Schlüssel oder Nachtanken bleiben deine Sache. Der Unterschied zu einem billigen Lockpreis ist, dass nichts dazukommt, nur weil du am Schalter Nein gesagt hast.' },
  { q: 'Kann ich mit 21 einen Wagen mieten?', a: 'Ja. Mindestalter ist 21, und der Führerschein muss seit mindestens 12 Monaten bestehen. Fahrer zwischen 21 und 24 zahlen einen Jungfahrerzuschlag von 9 € pro Tag, der zusätzlich zum Tarif berechnet wird und nicht im All-inclusive-Preis steckt. Ab 25 entfällt er.' },
  { q: 'Brauche ich eine Kreditkarte?', a: 'Ja, auf den Namen des Hauptfahrers. Das ist mit Abstand der häufigste Grund, warum Leute an einem spanischen Schalter abgewiesen werden: eine Debitkarte oder eine Karte des Partners wird nicht akzeptiert. Die Kaution wird vorautorisiert, nicht abgebucht, und nach der Rückgabe freigegeben.' },
  { q: 'Lohnt sich ein Cabrio auf Ibiza?', a: 'Für die Küstenstraßen wirklich — die Fahrt von Sant Josep hinunter zur Cala d’Hort mit offenem Verdeck ist der Grund, warum Leute eins buchen. Für eine Woche Einkäufe und Flughafenfahrten nicht: du zahlst mehr, hast weniger Kofferraum und musst ein offenes Auto an jedem Strandparkplatz komplett ausräumen. Buch es fürs Fahren, nicht für die Woche.' },
  { q: 'Brauche ich auf Ibiza überhaupt ein Auto?', a: 'Wohnst du in Ibiza-Stadt oder San Antonio und bleibst dort, nein — Busse und Taxis reichen. Willst du zur Cala Salada, Cala d’Hort, in den Norden um Sant Joan oder zu irgendeiner Bucht am Ende einer Schotterpiste, ja. Genau davon erzählen die Leute hinterher, und dorthin fährt kein Bus.' },
  { q: 'Wie ist die Parksituation?', a: 'Rechne damit, denn im August entscheidet sie deinen Tag. In Ibiza-Stadt parkst du in der Tiefgarage und zahlst dafür; freie Straßenplätze gibt es in der Saison kaum. San Antonio ist Richtung Bucht einfacher. Die Parkplätze an der Cala Comte und Cala Bassa sind am Vormittag voll — vor zehn oder nach vier ist der ganze Trick.' },
  { q: 'Darf ich mit dem Mietwagen auf Schotterpisten?', a: 'Auf den planierten Wegen etwa zur Cala Salada fahren alle, und das geht gut. Bei den raueren Strecken weiter nördlich: lies erst die Bedingungen, denn die meisten Verträge schließen Schäden abseits befestigter Straßen aus, und eine durchschlagene Ölwanne geht dann auf dich. Ist der Plan wirklich abgelegen, nimm den 4x4 statt des günstigsten Kleinwagens.' },
]

export default function MietwagenIbizaPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Mietwagen auf Ibiza',
        description: 'All-inclusive-Mietwagen auf Ibiza über Wiber Rent a Car, fünf Minuten vom Flughafen Ibiza mit Gratis-Shuttle und kontaktloser Übernahme.',
        brand: 'Wiber Rent a Car', price: proTag, path: 'mietwagen-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Mietwagen auf Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Wir buchen Mietwagen auf Ibiza über Wiber Rent a Car: All-inclusive-Tarif mit Versicherung im
              Preis, ein Büro fünf Minuten vom Flughafen an der Ctra. Aeropuerto km 5 in Sant Josep, ein
              Gratis-Shuttle ab Terminal und kontaktlose Übernahme.
              {proTag ? ` Tarife beginnen bei €${proTag} pro Tag.` : ''} Mindestalter 21, mit 9 € Zuschlag
              pro Tag für Fahrer zwischen 21 und 24.
            </p>
            <p className="mt-4">
              Der Grund für ein Auto ist nicht die Fahrt vom Flughafen. Es sind Cala Salada, Cala d&apos;Hort
              und die Nordküste — die Teile der Insel, zu denen kein Bus fährt.
            </p>
          </>
        }
      >
        <WiberDirect locale={LOCALE} />
      </HubHero>


      <ItemGrid
        heading="Die Bedingungen, gleich vorweg"
        columns={2}
        intro="Nichts davon ist für Spanien ungewöhnlich, aber du willst es wissen, bevor du landest — nicht am Schalter um elf Uhr nachts."
        items={[
          { name: 'Alter und Führerschein', body: 'Mindestens 21 Jahre, Führerschein seit mindestens 12 Monaten. Fahrer von 21 bis 24 zahlen 9 € pro Tag Jungfahrerzuschlag zusätzlich zum Tarif. Ab 25 entfällt er.' },
          { name: 'Kreditkarte und Kaution', body: 'Eine Kreditkarte auf den Namen des Hauptfahrers ist Pflicht. Die Kaution wird vorautorisiert, nicht abgebucht, und nach Rückgabe freigegeben. Eine Debitkarte oder eine Karte einer anderen Person wird abgelehnt — daran scheitert es am häufigsten.' },
          { name: 'Was die Versicherung deckt', body: 'Die Deckung steckt im All-inclusive-Tarif, statt am Schalter verkauft zu werden. Sie deckt nicht alles: Schäden abseits befestigter Straßen, ein verlorener Schlüssel oder der Innenraum nach einem nassen Wochenende fallen heraus. Frag nach der Selbstbeteiligung und danach, was die Deckung aufhebt.' },
          { name: 'Tanken und Rückgabe', body: 'Voll übernehmen, voll zurückgeben. Nachtanken durch den Vermieter wird zu einem Tarif abgerechnet, der keine Freude macht — und die Tankstelle am Flughafen weiß genau, warum du um sieben Uhr morgens dort stehst.' },
        ]}
      />

      <ProseSection
        heading="Warum du hier ein Auto willst"
        paragraphs={[
          'Die Insel ist klein genug, dass auf der Karte alles nah aussieht, und in der Praxis langsam genug, dass es das nicht ist. Dreißig Kilometer quer über die Insel sind im August eine Stunde, und die letzten zwei davon oft eine Schotterpiste. Das ist das Argument für das Auto in einem Satz: die Buchten, für die sich die Fahrt lohnt, sind genau die, zu denen kein Bus fährt.',
          'Die Cala Salada ist das deutlichste Beispiel. Sie liegt am Ende einer schmalen Straße nördlich von San Antonio, mit einem kleinen Parkplatz, der um zehn voll ist, und der Fußweg vom Ausweichparkplatz ist lang genug, dass die meisten aufgeben. Die Cala d’Hort mit Blick auf Es Vedrà ist dieselbe Geschichte auf der anderen Inselseite.',
          'Geht es wirklich um die raueren Pisten im Norden, nimm den 4x4 statt des günstigsten Kleinwagens. Nicht weil ein Kleinwagen es nicht schafft, sondern weil die meisten Mietverträge Schäden abseits befestigter Straßen ausschließen — und eine gerissene Ölwanne auf einem Felsweg ist eine Rechnung, die niemand einplant.',
          'Das Parken wird unterschätzt. In Ibiza-Stadt parkst du im August in der Tiefgarage und zahlst, oder du drehst Runden. An den Westküstenstränden: vor zehn oder nach vier. Planst du den Tag danach, ist das Auto die beste Entscheidung der Reise.',
        ]}
      />

      <TrustBlock
        heading="Buchen über Wiber"
        locale={LOCALE}
        intro="Wiber Rent a Car ist unser Mietwagenpartner auf der Insel. Wir buchen dort, weil der All-inclusive-Tarif auch am Schalter hält — was für die billigen Lockpreise am Flughafen Ibiza nicht gilt."
        partner="Wiber Rent a Car"
        partnerHref={WIBER_URL}
        partnerCta="Verfügbarkeit bei Wiber prüfen"
        points={[
          { title: 'Fünf Minuten vom Flughafen', body: 'Das Büro liegt an der Ctra. Aeropuerto km 5 in Sant Josep, mit Gratis-Shuttle ab Terminal. Außerhalb des Flughafens, in der Hochsaison aber schneller als die Schlange drinnen.' },
          { title: 'Kontaktlose Übernahme', body: 'Der Papierkram ist vor deiner Ankunft erledigt, die Übernahme ist eine Schlüsselübergabe statt eines Schaltertermins. Das macht nach einer späten Landung den Unterschied zwischen zwanzig Minuten und einer Stunde.' },
          { title: 'All-inclusive heißt, der Preis hält', body: 'Die Versicherung steckt im Tarif. Niemand verkauft dir am Schalter noch eine Deckung, weil du online abgelehnt hast — genau der Mechanismus hinter den meisten "der Preis war plötzlich doppelt"-Geschichten von spanischen Flughäfen.' },
          { title: 'Was wir tun', body: 'Wir buchen es mit dir per WhatsApp und bleiben erreichbar, solange du den Wagen hast. Geht am Schalter etwas schief, hast du eine lokale Nummer statt eines Callcenters.' },
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Verwandte Seiten" locale={LOCALE} links={[
        { label: 'Boot mieten auf Ibiza', href: 'boot-mieten-ibiza', body: 'Die Buchten, zu denen keine Straße führt — von der Wasserseite.' },
        { label: 'Ibiza-Tipps', href: 'tips', body: 'Buchten, Parken und wann du am besten kommst.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="Mietwagen auf Ibiza" />
    </>
  )
}
