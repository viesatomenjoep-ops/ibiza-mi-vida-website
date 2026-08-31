import type { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { HubHero, PriceTable, ItemGrid, ProseSection, InternalLinks, Breadcrumbs, type Crumb } from '@/components/hub/HubSections'
import { FaqAccordion, type Faq } from '@/components/hub/FaqAccordion'
import { TrustBlock } from '@/components/hub/TrustBlock'
import { Proof } from '@/components/hub/Proof'
import { AuthorByline } from '@/components/seo/AuthorByline'
import { localizedAlternates } from '@/lib/route-slugs'
import { RENTAL_PRICES } from '@/lib/rental-prices'
import { CLICKANDBOAT_URL } from '@/lib/partners'
import { contentUpdated } from '@/lib/content-dates'
import { SITE_NAME, type Locale } from '@/lib/seo'

export const revalidate = 3600
const LOCALE: Locale = 'de'
const PAGE_KEY = 'boot-mieten-ibiza'
const skipper = RENTAL_PRICES.boatWithSkipper.amount
const ohne = RENTAL_PRICES.boatNoLicence.amount

/**
 * Deutsche Pillar-Seite, eigenständig geschrieben statt übersetzt.
 *
 * Der deutsche Suchbegriff ist "Boot mieten Ibiza" bzw. "Bootsverleih Ibiza",
 * und die häufigste Fehlannahme ist eine andere als im Englischen: deutsche
 * Gäste bringen oft einen Sportbootführerschein See mit und gehen davon aus,
 * dass er hier automatisch alles abdeckt. Tut er nicht — Spanien erkennt
 * ausländische Scheine kategorieweise an. Das steht deshalb weit oben.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Boot mieten auf Ibiza — mit oder ohne Schein',
    description:
      'Boot mieten auf Ibiza mit Skipper, mit eigenem Führerschein oder führerscheinfrei bis 15 PS. Vier Marinas und die Routen nach Es Vedrà und Formentera.',
    alternates: localizedAlternates('boat-rental', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Boot mieten auf Ibiza — mit oder ohne Schein',
      description: 'Bootsverleih auf Ibiza mit Skipper, mit eigenem Führerschein oder führerscheinfrei bis 15 PS.',
      locale: 'de_DE',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Boot mieten auf Ibiza' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Startseite', path: '' },
  { name: 'Boote', path: 'boats' },
  { name: 'Boot mieten Ibiza' },
]

const FAQS: Faq[] = [
  { q: 'Kann ich auf Ibiza ein Boot ohne Führerschein mieten?', a: 'Ja, innerhalb klarer Grenzen. Nach spanischem Recht darf jede Person ab 18 ein Boot mit maximal 15 PS und einem Rumpf unter sechs Metern fahren — ohne Führerschein und ohne Vorerfahrung. Du bekommst vorher eine Einweisung und ein Fahrgebiet, das du nicht verlassen darfst, meist der Küstenabschnitt rund um deinen Starthafen. Alles Größere oder Stärkere verlangt einen anerkannten Schein, daran lässt sich nicht rütteln.' },
  { q: 'Gilt mein Sportbootführerschein See auf Ibiza?', a: 'Nicht automatisch für jede Kategorie. Spanien erkennt ausländische Scheine kategorieweise an, und das fällt oft enger aus als erwartet: ein Schein, der auf der Ostsee genügt, deckt hier nicht selbstverständlich jede Motoryacht ab. Schick uns ein Foto deines Scheins und das Boot, das dich interessiert — wir prüfen die Kombination, bevor du ein Datum festlegst.' },
  { q: 'Was kostet ein Boot auf Ibiza?', a: 'Das hängt an drei Dingen: Größe des Bootes, Skipper an Bord oder nicht, und das Datum. Ein führerscheinfreies Boot für vier bis sechs Personen ist der günstigste Weg aufs Wasser, ein Tagescharter mit Skipper der teuerste. Der Kraftstoff wird fast überall separat nach Verbrauch abgerechnet — das überrascht die meisten mehr als der Mietpreis. Schreib uns Datum und Gruppengröße, dann nennen wir den Tarif der Boote, die an dem Tag wirklich frei sind.' },
  { q: 'Muss ich eine Kaution hinterlegen?', a: 'Ja, praktisch bei jedem Boot. Die Kaution wird auf der Kreditkarte des Hauptmieters geblockt und freigegeben, sobald das Boot unbeschädigt zurück ist. Die Höhe richtet sich nach dem Wert des Bootes. Bring eine echte Kreditkarte mit: eine Debitkarte oder eine Karte auf den Namen des Partners wird an den meisten Basen abgelehnt.' },
  { q: 'Wie viele Personen dürfen mit?', a: 'Das Zertifikat des Bootes entscheidet, nicht der Platz an Deck. Führerscheinfreie Boote sind meist für vier bis sechs zugelassen, mittelgroße Motorboote für acht bis zwölf. Bei manchen Zertifikaten zählt der Skipper mit, bei anderen nicht. Nenn uns die echte Personenzahl inklusive Kindern — mit neun Leuten auf einem Sechs-Personen-Boot bleibt jemand am Steg.' },
  { q: 'Ist Kraftstoff inbegriffen?', a: 'So gut wie nie. Üblich ist: voll übernehmen, voll zurückbringen, oder den Verbrauch am Ende abrechnen. Wie viel zusammenkommt, hängt stärker vom Fahrstil als von der Distanz ab — vor Anker in einer Bucht kostet nichts, Vollgas nach Formentera und zurück kostet deutlich. Frag nach Tankgröße und Verbrauch, wenn du es vorher kalkulieren willst.' },
  { q: 'Was passiert bei schlechtem Wetter?', a: 'Der Tramuntana aus Norden bestimmt hier häufiger den Tag als Regen. Ist es zu ruppig, sagt die Basis oder der Skipper ab, und du bekommst einen neuen Termin oder dein Geld zurück — diese Entscheidung liegt bei ihnen, nicht bei dir. An Grenztagen wird meist die Route geändert statt des Datums: Wenn der Norden dicht ist, funktionieren Süden und Westen in der Regel gut.' },
  { q: 'Wann ist die beste Zeit?', a: 'Juni bis August ist Hochsaison: wärmstes Wasser, verlässlichstes Wetter, höchste Preise — und die bekannten Buchten sind mittags voll. Mai, September und Anfang Oktober sind das bessere Geschäft: im September ist das Wasser noch warm, die Boote sind günstiger und die Cala Comte ist um elf noch nicht überfüllt. Werktags ist in jedem Monat günstiger und ruhiger als am Wochenende.' },
]

export default function BootMietenIbizaPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Boot mieten auf Ibiza',
        description: 'Bootsverleih auf Ibiza mit Skipper, mit eigenem Führerschein oder führerscheinfrei bis 15 PS, ab vier Marinas rund um die Insel.',
        brand: 'Click&Boat', price: skipper, path: 'boot-mieten-ibiza',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Boot mieten auf Ibiza"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <>
            <p>
              Drei Wege aufs Wasser: mit einem Skipper, der fährt, mit deinem eigenen Führerschein, oder
              führerscheinfrei auf einem Boot mit maximal 15 PS, wenn du 18 oder älter bist.
              {skipper ? ` Ein Tagescharter mit Skipper beginnt bei €${skipper}.` : ''}
              {ohne ? ` Führerscheinfreie Boote starten bei €${ohne}.` : ''} Hochsaison ist Juni bis August;
              werktags ist es günstiger und die Buchten sind leerer als am Wochenende.
            </p>
            <p className="mt-4">
              Die Boote starten in vier Marinas, und welche du wählst, prägt den Tag stärker als das Boot.
            </p>
          </>
        }
      />

      <ItemGrid
        heading="Mit oder ohne Führerschein — was ist erlaubt?"
        columns={3}
        intro="Das ist spanisches Recht, keine Hausregel eines Vermieters. Wer dir etwas anderes anbietet, bringt dich aus deinem Versicherungsschutz."
        items={[
          { name: 'Ohne Führerschein', body: 'Maximal 15 PS, Rumpf unter sechs Metern, Fahrer ab 18, und ein Fahrgebiet, das dir vorher auf der Karte gezeigt wird. Keine Erfahrung nötig — die Einweisung deckt Starten, Stoppen, Steuern und Ankern ab. Gedacht für die Buchten in der Nähe, nicht für die Überfahrt nach Formentera.' },
          { name: 'Mit eigenem Führerschein', body: 'Dann öffnet sich die ganze Flotte: größere Rümpfe, echte Reichweite, Formentera wird realistisch. Aber Spanien erkennt ausländische Scheine kategorieweise an — dein Sportbootführerschein deckt nicht automatisch jede Motoryacht. Original mitbringen, ein Foto genügt am Steg nicht.' },
          { name: 'Mit Skipper', body: 'Bei den meisten größeren Motoryachten und praktisch allen Katamaranen ohnehin Pflicht, unabhängig davon, was du besitzt. Bei allem anderen meist einfach die bessere Wahl.' },
        ]}
      />

      <PriceTable
        heading="Was kostet ein Boot auf Ibiza?"
        locale={LOCALE}
        caption="Ab-Preise nach Bootstyp"
        intro="Ab-Preise pro Boot und Tag. Kraftstoff kommt fast überall separat dazu, nach Verbrauch — frag nach Tankgröße und Verbrauch, wenn du es kalkulieren willst."
        rows={[
          { label: 'Führerscheinfreies Boot', note: '4–6 Personen, max. 15 PS', amount: RENTAL_PRICES.boatNoLicence.amount, unit: RENTAL_PRICES.boatNoLicence.unit.de },
          { label: 'Motorboot, selbst gefahren', note: 'Führerschein erforderlich', amount: RENTAL_PRICES.boatWithLicence.amount, unit: RENTAL_PRICES.boatWithLicence.unit.de },
          { label: 'Tagescharter mit Skipper', note: 'Skipper im Tarif enthalten', amount: RENTAL_PRICES.boatWithSkipper.amount, unit: RENTAL_PRICES.boatWithSkipper.unit.de },
        ]}
      />

      <ItemGrid
        heading="Wo die Boote starten"
        columns={2}
        intro="Vier Starthäfen, jeder auf einen anderen Küstenabschnitt gerichtet. Nimm die Marina, die deinem Ziel am nächsten liegt — eine Stunde ums Eiland motoren ist eine Stunde ohne Schwimmen."
        items={[
          { name: 'San Antonio', body: 'Die Westküsten-Basis, der kürzeste Weg zur Cala Bassa, Cala Comte und Cala Salada. Auch die vollste: im Juli und August vor zehn ablegen, sonst stehst du an der Tankstelle an und kommst in einer überfüllten Bucht an.' },
          { name: 'Santa Eulària', body: 'Ruhigere Marina an der Ostküste, am nächsten an den nordöstlichen Buchten und Es Canar. Die bessere Wahl, wenn dir San Antonio zu hektisch ist.' },
          { name: 'Ibiza-Stadt', body: 'Direkt Richtung Formentera und Südküste, mit Talamanca und Ses Salines in Reichweite. Praktisch, wenn du in der Stadt wohnst und keine Taxifahrt quer über die Insel willst.' },
          { name: 'Marina Botafoch', body: 'Hier liegen die größeren Boote, gegenüber der Altstadt. Gleicher Zugang nach Formentera wie Ibiza-Stadt, mit mehr Platz am Steg für eine große Gruppe.' },
        ]}
      />

      <TrustBlock
        heading="Bei wem du buchst"
        locale={LOCALE}
        intro="Wir sind ein lokales Team auf Ibiza. Die Boote kommen über Click&Boat, Europas größte Bootsvermietungsplattform mit über 55.000 Booten — deshalb finden wir meist noch etwas an einem Datum, das ausgebucht aussieht."
        partner="Click&Boat"
        partnerHref={CLICKANDBOAT_URL}
        partnerCta="Verfügbarkeit bei Click&Boat prüfen"
        points={[
          { title: 'Versicherung', body: 'Jedes Boot ist vom Eigner oder Betreiber versichert; das ist Voraussetzung für die Listung. Haftpflicht ist Standard. Was variiert, ist die Selbstbeteiligung — nach der Zahl solltest du fragen, bevor du unterschreibst.' },
          { title: 'Die Kaution', body: 'Auf der Kreditkarte des Hauptmieters geblockt, freigegeben nach unbeschädigter Rückgabe. Die Höhe skaliert mit dem Wert des Bootes und wird dir vorher genannt. Echte Kreditkarte mitbringen.' },
          { title: 'Was wir tun', body: 'Wir gleichen Datum, Gruppengröße und Sprache mit den tatsächlich verfügbaren Booten ab und antworten per WhatsApp statt über ein Ticketformular. Passt ein Boot nicht zu dem, was du beschrieben hast, sagen wir das.' },
          { title: 'Stornierung', body: 'Wetterabsagen entscheidet die Basis oder der Skipper, nicht du, und sie bringen einen neuen Termin oder eine Rückerstattung. Die Bedingungen fürs Umentscheiden variieren pro Boot — frag uns nach der Regelung für dein Boot.' },
        ]}
      />

      <ProseSection
        heading="Was wir einem Freund sagen würden"
        paragraphs={[
          'Plane das Boot um das Wetter herum, nicht umgekehrt. Der Tramuntana weht aus Norden und legt diese Seite der Insel tagelang lahm, während Süden und Westen völlig in Ordnung bleiben. Ein Skipper dreht die Route einfach um; fährst du selbst, frag morgens an der Basis und sei bereit, den Plan zu ändern.',
          'Früh ablegen. Nicht wegen des Sonnenaufgangs, sondern wegen des Ankerplatzes. Cala Comte und Cala Bassa sind im Juli und August mittags voll, und der Unterschied zwischen zehn und eins ist, ob du vom Boot aus schwimmst oder Runden drehst.',
          'Nimm mehr Wasser und mehr Schatten mit, als du für nötig hältst. Fast jedes Boot unter zehn Metern hat beides nicht, und sechs Stunden Mittelmeersonne ohne Bimini ruinieren einen Tag zuverlässiger als alles andere.',
        ]}
      />

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Verwandte Seiten" locale={LOCALE} links={[
        { label: 'Mietwagen auf Ibiza', href: 'mietwagen-ibiza', body: 'Wie du zur Marina kommst — und zu den Buchten, an die kein Boot fährt.' },
        { label: 'Boat Party auf Ibiza', href: 'boat-party', body: 'Die organisierte Variante: ein Ticket, ein DJ und eine Gruppe.' },
        { label: 'Privatcharter', href: 'private-boat-charters', body: 'Größere Yachten und Katamarane, mit oder ohne Skipper.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="Boot mieten auf Ibiza" />
    </>
  )
}
