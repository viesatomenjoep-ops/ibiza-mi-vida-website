export interface EventDate {
  /** yyyy-MM-dd */
  date: string
  /** 'HH:mm' uit de ClubTickets-feed, als hij bekend is. */
  startAt?: string
  endAt?: string
  /** Ruwe prijsstring van die avond, bijv. '30 € - 150 €'. */
  prices?: string
  /** Live: goedkoopste beschikbare tier als getal. Voorkeur boven het parsen
   *  van `prices`; `null`/afwezig bij uitverkocht of onbekend. */
  lowestAvailablePrice?: number | null
  /** Live: elke tier voor die avond is uitverkocht. */
  soldOut?: boolean
}

interface EventSchemaProps {
  name: string
  /** Elke aankomende datum van dit event, niet alleen de eerste. */
  dates: EventDate[]
  venueName: string
  /** Pagina over deze zaak op onze site — de entiteits-URL van de organizer. */
  venueUrl?: string
  description?: string
  image?: string
  lineup?: string[]
  pageUrl: string
  /** 'MusicEvent' for club nights (default); 'Event' for tours/activities/boats. */
  type?: 'MusicEvent' | 'Event'
}

/**
 * Event-markup voor Google's event-carrousel en voor antwoordmachines.
 *
 * ── Waarom elke datum, en niet alleen de eerste ───────────────────────────
 * Dit component kreeg één `startDate` en een event met twaalf data leverde dus
 * één vermelding op; de andere elf bestonden voor Google niet. Terwijl de
 * pagina ze alle twaalf toont. Nu krijgt elke aankomende datum een eigen
 * `Event`-knooppunt met een eigen `@id`, samen in één `@graph`.
 *
 * ── Waarom de tijd erbij moet ─────────────────────────────────────────────
 * `startDate: '2026-09-01'` zonder tijd leest Google als middernacht. Een
 * clubnacht begint om 23:45 en loopt tot in de ochtend, dus zonder tijd staat
 * het event op de verkeerde kalenderdag en valt het vroeg uit "vanavond"-
 * oppervlakken. De feed heeft `startAt`/`endAt` en de pagina drukt ze al af.
 * Loopt `endAt` voorbij middernacht, dan schuift de einddatum een dag op.
 *
 * Tijdzone: Ibiza is Europe/Madrid, +02:00 in het zomerseizoen waarin al deze
 * events vallen. Vast in plaats van berekend, omdat een verkeerde offset erger
 * is dan geen: dit is een clubagenda die van mei tot oktober loopt.
 *
 * ── Waarom de club de organizer is en wij de verkoper ─────────────────────
 * `organizer` stond hardgecodeerd op Ibiza mi vida. Wij organiseren Eden
 * Presents niet, we verkopen er kaartjes voor. Google controleert eventdata
 * tegen andere bronnen, en een wederverkoper die zich op 107 events als
 * organisator opvoert is precies het patroon waar de event-spamrichtlijn op
 * mikt. De club is de organizer; wij staan waar we horen, als `offers.seller`.
 */
export function EventSchema({
  name,
  dates,
  venueName,
  venueUrl,
  description,
  image,
  lineup = [],
  pageUrl,
  type = 'MusicEvent',
}: EventSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ibizamivida.com'
  /** Zomertijd op Ibiza. Zie de kop. */
  const OFFSET = '+02:00'

  const isoAt = (day: string, time: string) => `${day}T${time.padStart(5, '0')}:00${OFFSET}`
  const nextDay = (day: string) => {
    const d = new Date(`${day}T12:00:00Z`)
    d.setUTCDate(d.getUTCDate() + 1)
    return d.toISOString().slice(0, 10)
  }

  const place = {
    '@type': 'Place',
    name: venueName,
    address: { '@type': 'PostalAddress', addressLocality: 'Ibiza', addressCountry: 'ES' },
  }

  const nodes = dates
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.date || ''))
    .map((d) => {
      // De live, bevestigde ondergrens eerst; anders het eerste getal uit de
      // prijsstring. Bij uitverkocht is er geen prijs — dan géén Offer (nooit
      // price: 0), de datum blijft wel een Event.
      const priceMatch = String(d.prices || '').match(/\d+([.,]\d+)?/)
      const price =
        typeof d.lowestAvailablePrice === 'number'
          ? d.lowestAvailablePrice
          : priceMatch
            ? parseFloat(priceMatch[0].replace(',', '.'))
            : undefined
      // Eindigt de avond eerder op de klok dan hij begon, dan is dat de ochtend erna.
      const endDay = d.endAt && d.startAt && d.endAt < d.startAt ? nextDay(d.date) : d.date

      return {
        '@type': type,
        '@id': `${pageUrl}#${d.date}`,
        name,
        startDate: d.startAt ? isoAt(d.date, d.startAt) : d.date,
        ...(d.endAt ? { endDate: isoAt(endDay, d.endAt) } : {}),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        ...(description ? { description } : {}),
        image: image ?? `${siteUrl}/og-default.jpg`,
        url: pageUrl,
        location: place,
        // De club organiseert de avond, wij verkopen het kaartje. `url` is
        // verplicht voor elke Organization (check:schema bewaakt dat) en de
        // venuepagina op deze site is de juiste entiteits-URL van de zaak.
        organizer: { '@type': 'Organization', name: venueName, url: venueUrl ?? siteUrl },
        ...(lineup.length > 0 && {
          performer: lineup.map((artist) => ({ '@type': 'MusicGroup', name: artist })),
        }),
        ...(price !== undefined && {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: String(price),
            availability: d.soldOut
              ? 'https://schema.org/SoldOut'
              : 'https://schema.org/InStock',
            url: pageUrl,
            // Zelfstandig, geen @id-verwijzing: het Organization-knooppunt met
            // dat id wordt alleen op de homepage uitgezonden, dus hier zou de
            // verwijzing nergens naar wijzen. Google lost @id's niet op tussen
            // pagina's, en een verwijzing die niets vindt is slechter dan een
            // paar velden herhalen.
            seller: { '@type': 'Organization', name: 'Ibiza Mi Vida', url: siteUrl },
          },
        }),
      }
    })

  if (nodes.length === 0) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }) }}
    />
  )
}
