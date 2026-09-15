import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { getVenues, getAllDates } from '@/lib/clubtickets'
import { priceNumbers } from '@/lib/price-parse'
import { ibizaToday, fmtShortDate } from '@/lib/date-label'
import { departuresFor, departureLabel, departureOrder } from '@/lib/jetski-departures'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

/**
 * De boekbare jetski-aanbieders, gegroepeerd op vertrekplaats.
 *
 * Waarom dit blok bestaat: de jetskipagina legde uit wat mag en wat het kost,
 * maar er stond geen enkele route naar een boeking op. De keuzekaarten wezen
 * naar /boats en /boat-party — interne pagina's over iets anders. Wie na het
 * lezen wilde boeken kon nergens klikken, en een crawler zonder JavaScript zag
 * al helemaal geen commerciële route. Dezelfde fout als de afrekenknoppen die
 * ooit `<button>` waren.
 *
 * Waarom op vertrekplaats en niet op prijs: vier aanbieders op drie plekken is
 * anders geen keuze maar een puzzel. Wie in Playa d'en Bossa zit hoeft niet
 * naar San Antonio; door de plaats als kop te nemen staat de dichtstbijzijnde
 * bovenaan zodra je weet waar je zit. Waar de plaats vandaan komt en waarom
 * hij soms ontbreekt: zie src/lib/jetski-departures.ts.
 *
 * Alles komt uit de ClubTickets-feed: de venues van het type `activities`
 * waarvan de naam jetski noemt, met hun eerstvolgende datum en de entreeprijs
 * uit `priceNumbers()`. Staat een aanbieder niet in de feed, dan staat hij hier
 * niet — dezelfde regel als voor de clubs. Is er niets boekbaars, dan rendert
 * het blok niets: geen lege kaarten, geen "binnenkort".
 *
 * De link gaat naar ONZE eigen pagina voor dat product
 * (`/<taal>/water-sports/<venue>/<event>`), die uit dezelfde feed is opgebouwd
 * en de datumkiezer plus de afrekenknop draagt. Geen kale partnerlink hier: de
 * affiliate-afhandeling zit op die pagina, op één plek.
 */

const HEADING: Record<Locale, string> = {
  nl: 'Jetski boeken, per vertrekplaats',
  en: 'Book a jet ski, by departure point',
  de: 'Jetski buchen, nach Startpunkt',
  es: 'Reserva una moto de agua, por punto de salida',
  fr: 'Réserver un jet ski, par point de départ',
}

const INTRO: Record<Locale, (n: number) => string> = {
  nl: (n) => `${n} aanbieders met plek in onze agenda, gesorteerd op waar ze vertrekken. Kies de plek waar je zit; je ziet dan de datums, de tijden en de prijs, en je boekt direct.`,
  en: (n) => `${n} operators with availability in our calendar, grouped by where they launch. Pick the one nearest you to see dates, slots and price, and book from there.`,
  de: (n) => `${n} Anbieter mit freien Terminen, sortiert nach Startpunkt. Wähle den nächstgelegenen, um Termine, Zeiten und Preis zu sehen und direkt zu buchen.`,
  es: (n) => `${n} operadores con disponibilidad, agrupados por punto de salida. Elige el más cercano para ver fechas, horarios y precio, y reserva desde ahí.`,
  fr: (n) => `${n} prestataires avec des disponibilités, regroupés par point de départ. Choisissez le plus proche pour voir les dates, les créneaux et le prix.`,
}

const ELSEWHERE: Record<Locale, string> = {
  nl: 'Vertrekplaats niet opgegeven',
  en: 'Departure point not stated',
  de: 'Startpunkt nicht angegeben',
  es: 'Punto de salida no indicado',
  fr: 'Point de départ non précisé',
}

const NEXT: Record<Locale, string> = {
  nl: 'Eerstvolgende datum', en: 'Next date', de: 'Nächster Termin',
  es: 'Próxima fecha', fr: 'Prochaine date',
}

const FROM: Record<Locale, string> = { nl: 'vanaf', en: 'from', de: 'ab', es: 'desde', fr: 'dès' }

const CTA: Record<Locale, string> = {
  nl: 'Datums en boeken', en: 'See dates and book', de: 'Termine und buchen',
  es: 'Ver fechas y reservar', fr: 'Voir les dates et réserver',
}

/** De feed hangt er vaak "- Jetski" achter; dat hoeft niet op een kaart. */
function cleanName(raw: string): string {
  return raw.replace(/\s*[-–]\s*jet\s*-?ski\b/i, '').trim()
}

const JETSKI_MATCH = /jet\s*-?\s*ski|jetski|moto\s+de\s+agua/i

interface Operator {
  venueSlug: string
  eventSlug: string
  name: string
  nextDate: string
  from: number | null
  departures: string[]
}

export async function JetSkiOperators({ locale }: { locale: string }) {
  const l = (LOCALES as readonly string[]).includes(locale) ? (locale as Locale) : DEFAULT_LOCALE

  const [venues, dates] = await Promise.all([getVenues(locale), getAllDates(locale)])
  const today = ibizaToday()

  const operators: Operator[] = venues
    .filter((v) => v.type?.slug === 'activities' && JETSKI_MATCH.test(v.name))
    .map((v) => {
      const own = dates
        .filter((d) => d.venueSlug === v.slug && d.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
      // Entreeprijs = het eerste getal in het prijsveld, zie price-parse.ts.
      const lows = own
        .map((d) => priceNumbers(d.prices)[0])
        .filter((n): n is number => typeof n === 'number' && n > 0)
      const eventNames = (v.events ?? []).map((e: { name?: string }) => e.name ?? '')
      return {
        venueSlug: v.slug,
        // De eventSlug van de eerstvolgende datum: dat is de pagina met de
        // datumkiezer en de afrekenknop.
        eventSlug: own[0]?.eventSlug ?? '',
        name: cleanName(v.name),
        nextDate: own[0]?.date ?? '',
        from: lows.length ? Math.min(...lows) : null,
        departures: departuresFor(v.slug, eventNames),
      }
    })
    // Zonder datum of zonder eventpagina valt een aanbieder weg: een kaart die
    // nergens heen gaat is precies wat deze sectie moest oplossen.
    .filter((o) => o.nextDate !== '' && o.eventSlug !== '')

  if (!operators.length) return null

  // Groeperen op vertrekplaats. Een aanbieder met twee vertrekpunten staat
  // onder allebei — dat is geen duplicaat maar de werkelijkheid.
  const groups = departureOrder()
    .map((key) => ({
      key,
      label: departureLabel(key, l),
      items: operators
        .filter((o) => o.departures.includes(key))
        .sort((a, b) => (a.from ?? Infinity) - (b.from ?? Infinity)),
    }))
    .filter((g) => g.items.length > 0 && g.label)

  const orphans = operators.filter((o) => o.departures.length === 0)

  const card = (o: Operator) => (
    <Link
      key={`${o.venueSlug}-${o.eventSlug}`}
      href={`/${l}/water-sports/${o.venueSlug}/${o.eventSlug}`}
      className="group flex flex-col rounded-2xl border border-black/10 bg-neutral-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white"
    >
      <h4 className="font-serif text-base font-black leading-snug">{o.name}</h4>
      <p className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-neutral-500">{NEXT[l]}</p>
      <p className="text-[15px] font-medium text-neutral-900">{fmtShortDate(o.nextDate, l)}</p>
      {o.from !== null && (
        <p className="mt-3 font-serif text-lg font-black text-neutral-900">
          <span className="text-[13px] font-normal text-neutral-500">{FROM[l]} </span>€{o.from}
        </p>
      )}
      <span className="mt-5 inline-flex w-fit items-center rounded-full bg-neutral-900 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors group-hover:bg-neutral-700">
        {CTA[l]}
      </span>
    </Link>
  )

  return (
    <section className="border-t border-black/5 bg-white py-14 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-serif text-2xl font-black tracking-tight md:text-3xl">{HEADING[l]}</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">{INTRO[l](operators.length)}</p>

        <div className="mt-9 space-y-10">
          {groups.map((g) => (
            <div key={g.key}>
              <h3 className="flex items-center gap-2 font-serif text-lg font-black tracking-tight text-neutral-900">
                <MapPin size={17} strokeWidth={2.5} aria-hidden className="text-gold" />
                {g.label}
              </h3>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{g.items.map(card)}</div>
            </div>
          ))}

          {orphans.length > 0 && (
            <div>
              <h3 className="font-serif text-lg font-black tracking-tight text-neutral-900">{ELSEWHERE[l]}</h3>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{orphans.map(card)}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
