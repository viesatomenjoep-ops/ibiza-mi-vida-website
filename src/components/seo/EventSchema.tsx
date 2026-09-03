export interface EventDate {
  /** yyyy-MM-dd */
  date: string
  /** 'HH:mm' uit de ClubTickets-feed, als hij bekend is. */
  startAt?: string
  endAt?: string
  /** Ruwe prijsstring van die avond, bijv. '30 € - 150 €'. */
  prices?: string
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
  /** Datums (yyyy-mm-dd) die volgens ClubTickets nu uitverkocht zijn. */
  soldOutDates?: string[]
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
  soldOutDates = [],
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
      const priceMatch = String(d.prices || '').match(/\d+([.,]\d+)?/)
      const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : undefined
      // Eindigt de avond eerder op de klok dan hij begon, dan is dat de ochtend erna.
      //
      // ── Waarom hier een geloofwaardigheidstoets omheen staat ──────────────
      // ClubTickets zet '00:00' neer als het sluitingsuur onbekend is. Omdat
      // '00:00' als tekst vóór '23:30' komt, rolde de datum naar de volgende
      // dag en werd de eindtijd een half uur ná het begin. Gevolg: we
      // publiceerden Carl Cox, David Guetta, FISHER en elrow naar Google als
      // events van dertig minuten -- 42 van de 155 events, in alle vijf de
      // talen. Gemeten, niet vermoed: alle 42 hebben `endIsDefined: false`.
      //
      // Alleen op `endIsDefined` afgaan is te grof: acht events (SHINE
      // 18:00-04:00, boottochten van 09:15 tot 14:00) hebben dat ook op false
      // staan terwijl hun eindtijd prima klopt. Vandaar de combinatie:
      // '00:00' of korter dan twee uur telt als onbekend.
      //
      // endDate is optioneel voor Google. Niets zeggen is beter dan iets
      // onwaars zeggen.
      const inMinuten = (t: string) => { const [u, m] = t.split(':').map(Number); return u * 60 + m }
      const duurMin = d.startAt && d.endAt
        ? ((inMinuten(d.endAt) - inMinuten(d.startAt)) % 1440 + 1440) % 1440 || 1440
        : undefined
      const eindBekend = Boolean(d.endAt) && d.endAt !== '00:00' && (duurMin === undefined || duurMin >= 120)
      const endDay = eindBekend && d.endAt! < (d.startAt ?? '') ? nextDay(d.date) : d.date

      return {
        '@type': type,
        '@id': `${pageUrl}#${d.date}`,
        name,
        startDate: d.startAt ? isoAt(d.date, d.startAt) : d.date,
        ...(eindBekend ? { endDate: isoAt(endDay, d.endAt!) } : {}),
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
            // Klopt met wat ClubTickets nú zegt, niet met wat we hopen.
            // Google waarschuwt in Search Console als de beschikbaarheid in het
            // schema niet overeenkomt met wat de bezoeker op de pagina ziet, en
            // een event dat als InStock staat maar uitverkocht is, verliest zijn
            // rich result. Zie clubtickets-live.ts voor hoe die stand ontstaat.
            availability: soldOutDates.includes(d.date)
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
