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
const LOCALE: Locale = 'de'
const PAGE_KEY = 'boot-mieten-ibiza-mit-skipper'
const preis = RENTAL_PRICES.boatWithSkipper.amount

/**
 * Deutsche Variante. Keine Übersetzung der englischen.
 *
 * Aufhänger ist die Anerkennung des eigenen Scheins. Wer einen SBF See hat,
 * geht selbstverständlich davon aus, hier selbst fahren zu dürfen. Das gilt
 * nicht pauschal: Spanien erkennt ausländische Scheine kategorienweise an, und
 * größere Motoryachten sowie praktisch alle Katamarane werden ohnehin nur mit
 * Skipper verchartert — eine Vorgabe von Eigner und Versicherer.
 *
 * Was hier NICHT steht, ist welcher deutsche oder österreichische Schein wofür
 * gilt. Das unterscheidet sich pro Boot und pro Kategorie, also sagt die Seite:
 * schick den Schein UND das Boot, wir prüfen die Kombination vor der
 * Terminfestlegung. Ein falsches Ja kostet hier einen Chartertag.
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Boot mieten auf Ibiza mit Skipper',
    description:
      'Boot mit Skipper auf Ibiza: wann er Pflicht ist, was er kostet und warum dein Sportbootführerschein hier nicht automatisch für jedes Boot zählt.',
    alternates: localizedAlternates('boat-with-skipper', LOCALE),
    openGraph: {
      type: 'website', siteName: SITE_NAME,
      title: 'Boot mieten auf Ibiza mit Skipper',
      description: 'Wann ein Skipper Pflicht ist, und warum dein Schein hier nicht immer zählt.',
      locale: 'de_DE',
      images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Boot mieten auf Ibiza mit Skipper' }],
    },
  }
}

const CRUMBS: Crumb[] = [
  { name: 'Home', path: '' },
  { name: 'Ibiza auf dem Wasser', path: 'boats' },
  { name: 'Mit Skipper' },
]

const FAQS: Faq[] = [
  { q: 'Zählt mein Sportbootführerschein auf Ibiza?', a: 'Nicht automatisch für jede Kategorie, und das überrascht die meisten. Spanien erkennt ausländische Scheine kategorienweise an, nicht pauschal, und ob deiner ein bestimmtes Boot abdeckt, hängt von Typ und Länge ab. Schick uns den Schein UND das Boot, das dir vorschwebt, dann prüfen wir die Kombination, bevor du einen Termin festlegst. Das erspart einen Chartertag, der nicht stattfindet.' },
  { q: 'Wann ist ein Skipper Pflicht?', a: 'Sobald das Boot über das hinausgeht, was dein Schein abdeckt — und das ist für die meisten Gäste früher als gedacht. Dazu kommen größere Motoryachten und praktisch alle Katamarane, die ohnehin nur mit Skipper verchartert werden, unabhängig von deinem Schein. Das gibt der Eigner zusammen mit dem Versicherer vor, und darüber wird am Steg nicht verhandelt.' },
  { q: 'Was kostet ein Skipper?', a: 'Bei den meisten Tagescharter steckt der Skipper im genannten Preis statt als separate Position. Wo er extra ausgewiesen wird, ist es eine Tagespauschale, die sich nicht mit der Gruppengröße ändert — sie verteilt sich also auf so viele Personen, wie an Bord sind. Der Kraftstoff bleibt in beiden Fällen separat. Frag nach dem konkreten Boot, dann sagen wir, welcher der beiden Fälle gilt.' },
  { q: 'Sprechen die Skipper Deutsch?', a: 'Englisch ist verbreitet, Spanisch ohnehin. Deutsch gibt es, aber auf weniger Booten — danach zu fragen verkleinert also die Flotte, statt Geld zu kosten. Sag es bei der Anfrage: hinterher darauf zu filtern bedeutet meist, das Boot zu wechseln.' },
  { q: 'Bleibt es mein Tag, oder entscheidet der Skipper?', a: 'Deiner, mit einer Ausnahme. Du wählst, wohin es geht und wie lange ihr in jeder Bucht bleibt; der Skipper entscheidet, was sicher ist, und diese Entscheidung ist endgültig. In der Praxis verbessert sein Input den Tag mehr, als er ihn einschränkt, weil er weiß, welche Buchten bei dem Wind funktionieren, der tatsächlich weht.' },
  { q: 'Muss ich Trinkgeld geben?', a: 'Keine Pflicht, und nach einem guten Tag ehrlich geschätzt. Einen Standardprozentsatz gibt es hier nicht. Behandle es wie bei einem guten Guide, nicht wie eine Restaurantrechnung.' },
  { q: 'Zählt der Skipper zur Personenzahl?', a: 'Auf manchen Zertifikaten ja, auf anderen nein, und dieser Unterschied hat Gruppen am Steg schon eine Person gekostet. Gib die echte Personenzahl an, dann gleichen wir sie mit dem konkreten Boot ab, bevor du zahlst.' },
]

export default function BootMietenMitSkipperPage() {
  return (
    <>
      <SchemaMarkup locale={LOCALE} breadcrumbs={CRUMBS} faqs={FAQS} product={{
        name: 'Boot mieten auf Ibiza mit Skipper',
        description: 'Tagescharter mit Skipper auf Ibiza ab Marinas rund um die Insel, mit ortskundigen Skippern in mehreren Sprachen.',
        brand: 'Click&Boat', price: preis, path: 'boot-mieten-ibiza-mit-skipper',
      }} />
      <Breadcrumbs items={CRUMBS} locale={LOCALE} />

      <HubHero
        h1="Boot mieten auf Ibiza mit Skipper"
        locale={LOCALE}
        updated={contentUpdated(PAGE_KEY)}
        lead={
          <p>
            Ein Skipper ist auf den meisten Booten Pflicht, die über einen gewöhnlichen Schein hinausgehen,
            und auf nahezu jeder größeren Motoryacht und jedem Katamaran hier.
            {preis ? ` Tagescharter mit Skipper ab ${preis} € pro Tag.` : ''} Verlass dich nicht darauf,
            dass dein Sportbootführerschein jede Kategorie abdeckt — Spanien erkennt ausländische Scheine
            kategorienweise an, nicht pauschal.
          </p>
        }
      />

      <ItemGrid
        heading="Wann du einen brauchst, und wann du einen willst"
        columns={2}
        items={[
          { name: 'Vom Boot vorgeschrieben', body: 'Die meisten Motoryachten oberhalb der kleinen Kategorien und fast alle Katamarane werden mit Skipper verchartert, egal welchen Schein du hast. Das legen Eigner und Versicherer fest, nicht verhandelbar am Steg.' },
          { name: 'Von deinem Schein vorgeschrieben', body: 'Ein ausländischer Schein wird in Spanien nicht für jede Kategorie anerkannt. Schick uns Schein und Boot, dann prüfen wir die Paarung, bevor du dich auf ein Datum festlegst.' },
          { name: 'Wegen des Wetters sinnvoll', body: 'Der Tramontana schließt den Norden der Insel tagelang, während Süden und Westen ruhig bleiben. Ein Skipper dreht die Route noch am selben Morgen um; wer zum ersten Mal selbst fährt, weiß meist nicht, dass er das müsste.' },
          { name: 'Wegen des Ankerns sinnvoll', body: 'Zu wissen, wo der Grund in welcher Bucht hält, lernt man nicht aus einer Karte. Das ist der größte praktische Unterschied zwischen einem Tag mit und ohne Skipper.' },
        ]}
      />

      <PriceTable
        heading="Was ein Tag mit Skipper kostet"
        locale={LOCALE}
        caption="Einstiegspreis für einen Charter mit Skipper"
        intro="Pro Boot, pro Tag. Bei den meisten Chartern ist der Skipper in diesem Preis enthalten; wo er separat ist, ist es eine Tagespauschale unabhängig von der Gruppengröße. Kraftstoff wird in beiden Fällen nach Verbrauch abgerechnet."
        rows={[{ label: 'Tagescharter mit Skipper', note: 'Skipper im Preis enthalten', amount: preis, unit: RENTAL_PRICES.boatWithSkipper.unit.de }]}
      />

      <ProseSection
        heading="Was ein guter Skipper wirklich ändert"
        paragraphs={[
          'Die naheliegende Antwort ist, dass du nicht fahren musst. Die eigentliche Antwort ist die Routenwahl. Ibiza hat eine Luv- und eine Leeseite, die je nach Tag wechseln, und ein Skipper, der diese Gewässer kennt, weiß beim Frühstück, in welchen Buchten man um zwei Uhr nachmittags schwimmen kann. Das kann man nicht nachschlagen.',
          'Das Zweite ist das Timing. Um elf Uhr im August an der Cala Comte anzukommen heißt, nach einem Platz zu kreisen; um neun oder um fünf ankerst du, wo du willst. Skipper planen den Tag selbstverständlich darum herum, und das ist genau die Sorte Wissen, die man sonst einmal falsch macht.',
        ]}
      />

      <div className="border-t border-black/5 bg-white pb-14 text-neutral-900">
        <div className="mx-auto max-w-4xl px-4">
          <AffiliateLink href={CLICKANDBOAT_URL} partner="Click&Boat" locale={LOCALE}>
            Boote mit Skipper auf Click&amp;Boat ansehen
          </AffiliateLink>
        </div>
      </div>

      <Proof locale={LOCALE} />
      <FaqAccordion faqs={FAQS} locale={LOCALE} />

      <InternalLinks heading="Weiterlesen" locale={LOCALE} links={[
        { label: 'Boot mieten auf Ibiza', href: 'boats', body: 'Die Pillar-Seite: alle drei Wege aufs Wasser, mit Marinas und Routen.' },
        { label: 'Boot mieten ohne Führerschein', href: 'boot-mieten-ibiza-ohne-fuehrerschein', body: 'Das andere Ende: 15 PS, kein Papierkram, nahe Buchten.' },
        { label: 'Boat Party auf Ibiza', href: 'boat-party', body: 'Wenn du die Menge willst statt das Boot für dich allein.' },
      ]} />

      <AuthorByline locale={LOCALE} topic="Boot mieten auf Ibiza mit Skipper" />
    </>
  )
}
