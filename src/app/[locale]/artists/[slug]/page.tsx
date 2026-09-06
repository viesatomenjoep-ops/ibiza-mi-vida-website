import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Music } from 'lucide-react'
import { format } from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { getArtist, getArtistDates, getVenues, getArtistsWithUpcomingDates } from '@/lib/clubtickets'
import { eventBasePath } from '@/lib/event-path'
import { ibizaTonight } from '@/lib/date-label'
import { BackButton } from '@/components/ui/BackButton'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'
import { BreadcrumbJsonLd, homeLabel, sectionLabel } from '@/components/seo/BreadcrumbJsonLd'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

// ── Spotify lookup ────────────────────────────────────────────────────
// VERIFIED IDS ONLY. Every id below was checked against Spotify's oEmbed
// endpoint and resolves to the artist it is mapped to.
//
// This replaces a list of 26 ids of which 18 returned 404 — they were simply
// invented — and two more resolved to the wrong person entirely: "fisher"
// pointed at Dj Eduin Reyes and "mestiza" at Francesca Turchetti. The result
// was the embed rendering Spotify's own "Page not found" screen inside the
// card, which is worse than showing nothing.
//
// Rule for adding one: fetch
//   https://open.spotify.com/oembed?url=https://open.spotify.com/artist/<id>
// and confirm the returned title is the artist you expect. If you cannot
// confirm it, leave it out — the page falls back to a search link, which
// always works.
const SPOTIFY_SEARCH: Record<string, string> = {
  nl: 'Zoek op Spotify', en: 'Find on Spotify', de: 'Auf Spotify suchen',
  es: 'Buscar en Spotify', fr: 'Chercher sur Spotify',
}

const SPOTIFY_ARTISTS: Record<string, string> = {
  'carl-cox': '19SmlbABtI4bXz864MLqOS',
  'david-guetta': '1Cs0zKBU1kc0i8ypK3B9ai',
  'calvin-harris': '7CajNmpbOovFoOoasH2HaY',
  tiesto: '2o5jDhtHVPhrJdv3cEQ99Z',
  meduza: '0xRXCcSX89eobfrshSVdyu',
  'dom-dolla': '205i7E8fNVfojowcQSfK9m',
}

function getSpotifyEmbedDetails(slug: string): { type: string; id: string } | null {
  const s = (slug || '').toLowerCase().trim()
  for (const [key, id] of Object.entries(SPOTIFY_ARTISTS)) {
    if (s === key || s.includes(key)) return { type: 'artist', id }
  }
  return null
}

const DF_LOC: Record<Locale, any> = { nl, en: enUS, de, es, fr }

const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  try {
    const onlyDate = dateStr.split('T')[0];
    const [year, month, day] = onlyDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    if (isNaN(d.getTime())) return new Date();
    return d;
  } catch (e) {
    return new Date();
  }
};

interface Props {
  params: { slug: string; locale: string }
}

async function fetchArtist(slug: string, locale: string) {
  const ctArtist = await getArtist(slug, locale);
  if (!ctArtist) return null;

  const [dates, venues] = await Promise.all([
    getArtistDates(ctArtist.name, locale, ctArtist.slug),
    getVenues(locale),
  ]);
  // Venue type decides which site section hosts the event page — the
  // "artists" list also contains boat trips and activities, whose dates
  // must NOT link through /club-tickets/ (that page 404s on non-clubs).
  const typeBySlug = new Map(venues.map(v => [v.slug, v.type?.slug || '']));

  return {
    artist: {
      id: ctArtist.id || 0,
      name: ctArtist.name,
      slug: ctArtist.slug,
      image: ctArtist.image || '',
      venueName: ctArtist.venueName || '',
      venueSlug: ctArtist.venueSlug || '',
      venueBasePath: eventBasePath(typeBySlug.get(ctArtist.venueSlug || '')),
      href: ''
    },
    // lineUp, prices en lowestAvailablePrice werden hier weggegooid terwijl ze
    // in de feed staan. Juist die drie maken het verschil tussen een pagina met
    // een naam erop en een pagina die een vraag beantwoordt — zie de feitenregel
    // en de line-up per datum hieronder.
    dates: dates.map((d: any) => ({
      id: d.id,
      name: d.name,
      date: d.date,
      eventName: d.eventName,
      eventSlug: d.eventSlug,
      venueName: d.venueName,
      venueSlug: d.venueSlug,
      basePath: eventBasePath(typeBySlug.get(d.venueSlug || '')),
      eventCover: d.eventCover || d.eventLogo || '',
      venueCover: d.venueCover || '',
      lineUp: (d.lineUp || '').trim(),
      prices: (d.prices || '').trim(),
      vanafPrijs: typeof d.lowestAvailablePrice === 'number' ? d.lowestAvailablePrice : null,
    }))
  };
}

// ── i18n labels ──
type T = Record<Locale, string>
const L = (nl: string, en: string, de: string, es: string, fr: string): T => ({ nl, en, de, es, fr })

const RESIDENT_AT: T = L('Resident @', 'Resident @', 'Resident @', 'Residente @', 'Résident @')
const ARTIST_LABEL: T = L('Artiest', 'Artist', 'Künstler', 'Artista', 'Artiste')
const INTRO_TEXT: T = L(
  'Bekijk alle Ibiza-boekingen en events waar %NAME% op de line-up staat voor 2026.',
  'View all Ibiza bookings and events featuring %NAME% on the line-up for 2026.',
  'Alle Ibiza-Buchungen und Events mit %NAME% auf dem Line-up für 2026.',
  'Consulta todas las reservas y eventos en Ibiza con %NAME% en el cartel para 2026.',
  'Découvrez toutes les dates et événements à Ibiza avec %NAME% à l’affiche pour 2026.',
)
const NO_EVENTS: T = L(
  'Geen geplande events gevonden voor deze artiest in Ibiza.',
  'No upcoming events found for this artist in Ibiza.',
  'Keine geplanten Events für diesen Künstler auf Ibiza gefunden.',
  'No se han encontrado eventos programados para este artista en Ibiza.',
  'Aucun événement prévu pour cet artiste à Ibiza.',
)
const TICKETS: T = L('Tickets', 'Tickets', 'Tickets', 'Entradas', 'Billets')
const LISTEN_TO: T = L('Luister naar', 'Listen to', 'Höre', 'Escucha a', 'Écoute')
const WARM_UP: T = L(
  'Kom in de stemming met de nieuwste tracks en party-anthems van %NAME%.',
  'Warm up for the night with %NAME%\'s latest tracks and party anthems.',
  'Stimm dich mit den neuesten Tracks und Party-Hymnen von %NAME% ein.',
  'Entra en ambiente con los últimos temas e himnos de fiesta de %NAME%.',
  'Mettez-vous dans l’ambiance avec les derniers titres et hymnes de soirée de %NAME%.',
)
const EVENTS_LABEL: T = L('Events', 'Events', 'Events', 'Eventos', 'Événements')

/**
 * ── De feitenregel en de vragen hieronder ─────────────────────────────────
 *
 * Deze pagina's hadden 47 tot 77 woorden in <main>: een naam, een foto en een
 * lijstje datums. Google noemde dat terecht dun en liet 1.702 van dit soort
 * pagina's ongeindexeerd liggen. Antwoordmachines als ChatGPT en Perplexity
 * citeren bovendien alleen wat een concrete vraag beantwoordt.
 *
 * Alles wat hier bijkomt komt uit de feed die we toch al ophalen: hoe vaak
 * iemand draait, waar, tussen welke twee datums, vanaf welke prijs en met wie
 * op de line-up. Geen letter biografie, geen "een van de grootste dj's ter
 * wereld" -- dat zou verzonnen zijn en is precies waar deze site eerder al een
 * keer de mist mee in ging. Staat een gegeven niet in de feed, dan blijft de
 * zin weg.
 */
const SAMENVATTING = (n: number, venues: string, van: string, tot: string, prijs: string): T => L(
  `${n === 1 ? 'staat één keer' : `staat ${n} keer`} op de agenda in Ibiza, in ${venues}, van ${van} tot en met ${tot}${prijs}.`,
  `${n === 1 ? 'plays once' : `plays ${n} times`} in Ibiza, at ${venues}, from ${van} through ${tot}${prijs}.`,
  `${n === 1 ? 'steht einmal' : `steht ${n} Mal`} auf Ibiza im Programm, im ${venues}, vom ${van} bis ${tot}${prijs}.`,
  `${n === 1 ? 'actúa una vez' : `actúa ${n} veces`} en Ibiza, en ${venues}, del ${van} al ${tot}${prijs}.`,
  `${n === 1 ? 'joue une fois' : `joue ${n} fois`} à Ibiza, au ${venues}, du ${van} au ${tot}${prijs}.`,
)
const VANAF = (p: string): T => L(
  `, met tickets vanaf ${p}`,
  `, with tickets from ${p}`,
  `, mit Tickets ab ${p}`,
  `, con entradas desde ${p}`,
  `, avec des billets à partir de ${p}`,
)
const LINEUP_LABEL: T = L('Line-up', 'Line-up', 'Line-up', 'Cartel', 'Line-up')
const VRAGEN_KOP: T = L('Veelgestelde vragen', 'Frequently asked questions', 'Häufige Fragen', 'Preguntas frecuentes', 'Questions fréquentes')
const V_WANNEER = (naam: string): T => L(
  `Wanneer draait ${naam} op Ibiza?`, `When does ${naam} play in Ibiza?`,
  `Wann legt ${naam} auf Ibiza auf?`, `¿Cuándo actúa ${naam} en Ibiza?`,
  `Quand ${naam} joue-t-il à Ibiza ?`,
)
const V_WAAR = (naam: string): T => L(
  `In welke club speelt ${naam}?`, `Which club does ${naam} play at?`,
  `In welchem Club spielt ${naam}?`, `¿En qué club actúa ${naam}?`,
  `Dans quel club joue ${naam} ?`,
)
const V_PRIJS = (naam: string): T => L(
  `Wat kosten tickets voor ${naam}?`, `How much are tickets for ${naam}?`,
  `Was kosten Tickets für ${naam}?`, `¿Cuánto cuestan las entradas para ${naam}?`,
  `Combien coûtent les billets pour ${naam} ?`,
)
const A_WAAR = (naam: string, venues: string): T => L(
  `${naam} draait in ${venues}. Op elke datumkaart hierboven staat de club erbij; klik erop voor de line-up van die avond en de tickets.`,
  `${naam} plays at ${venues}. Every date card above names the club; click through for that night's line-up and tickets.`,
  `${naam} legt im ${venues} auf. Auf jeder Datumskarte oben steht der Club; ein Klick zeigt das Line-up und die Tickets.`,
  `${naam} actúa en ${venues}. Cada tarjeta de fecha indica el club; haz clic para ver el cartel y las entradas.`,
  `${naam} joue au ${venues}. Chaque carte de date indique le club ; cliquez pour le line-up et les billets.`,
)
const A_PRIJS_ONBEKEND: T = L(
  'De prijzen verschillen per avond en staan op de eventpagina van die datum.',
  'Prices vary per night and are shown on the event page for that date.',
  'Die Preise unterscheiden sich pro Abend und stehen auf der Eventseite des Termins.',
  'Los precios varían por noche y se indican en la página del evento de esa fecha.',
  'Les prix varient selon la soirée et figurent sur la page de l’événement.',
)
const A_PRIJS = (p: string): T => L(
  `Tickets beginnen bij ${p}. De prijs loopt op naarmate een avond voller raakt, dus vroeg boeken is bijna altijd goedkoper.`,
  `Tickets start at ${p}. Prices rise as a night fills up, so booking early is almost always cheaper.`,
  `Tickets beginnen bei ${p}. Die Preise steigen, je voller ein Abend wird — früh buchen ist fast immer günstiger.`,
  `Las entradas empiezan en ${p}. El precio sube según se llena la noche, así que reservar pronto suele salir más barato.`,
  `Les billets démarrent à ${p}. Le prix monte à mesure que la soirée se remplit : réserver tôt revient presque toujours moins cher.`,
)
const AVAILABLE: T = L('Beschikbaar', 'Available', 'Verfügbar', 'Disponibles', 'Disponibles')
const VIEW_TICKETS: T = L('Bekijk Tickets', 'View Tickets', 'Tickets ansehen', 'Ver Entradas', 'Voir les Billets')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const result = await fetchArtist(params.slug, locale)
  if (!result) return staticMetadata(locale, 'artists')

  const meta = detailMetadata(locale, `artists/${params.slug}`, result.artist.name, {
    description: INTRO_TEXT[locale].replace('%NAME%', result.artist.name),
    image: result.artist.image || result.dates[0]?.eventCover,
    suffix: '— Ibiza 2026',
  })

  /**
   * Uitgespeelde artiesten vragen niet om indexering.
   *
   * Zonder komende datums blijft hier een naam, een foto en een Spotify-link
   * over. Google noemt dat terecht dun en laat zulke pagina's liggen op
   * "ontdekt, momenteel niet geïndexeerd". Met noindex vraag je er niet meer om
   * en gaat het crawlbudget naar de eventpagina's van 2.276 woorden.
   *
   * Midden in het seizoen raakt dit niemand: alle 149 artiesten hebben nog
   * datums staan. Het gaat om de maanden na de closings.
   *
   * `follow: true` blijft staan: de links naar clubs en events op deze pagina
   * mogen hun waarde gewoon doorgeven. En de pagina zelf blijft bestaan, want
   * iemand die op de artiestennaam zoekt en hier via een interne link belandt,
   * hoort geen 404 te krijgen.
   *
   * Dezelfde bron als de sitemap -- zie getArtistsWithUpcomingDates(). Anders
   * zou de sitemap een pagina aanbieden die zichzelf vervolgens afwijst, en dat
   * tegenstrijdige signaal is erger dan allebei de kwalen apart.
   */
  const metDatums = await getArtistsWithUpcomingDates(locale)
  if (!metDatums.has(params.slug)) {
    return { ...meta, robots: { index: false, follow: true } }
  }
  return meta
}

export default async function ArtistPage({ params }: Props) {
  const locale = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const result = await fetchArtist(params.slug, locale)
  if (!result) notFound()

  const { artist, dates } = result;

  // Alleen optredens die nog komen. Hier stond `new Date()` met setHours: dat
  // keek naar de klok van de server (UTC) in plaats van naar die van Ibiza, en
  // liet de set van vanavond om middernacht al vallen terwijl de dj op dat
  // moment draait. Twee YYYY-MM-DD's vergelijken als tekst kan niet schuiven.
  const vanavond = ibizaTonight();
  const futureDates = dates
    .filter(d => d && d.date && String(d.date).slice(0, 10) >= vanavond)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const localeObj = DF_LOC[locale] || enUS;

  // ── Feiten, geteld uit de datums die we toch al hebben ──────────────────
  // Alles hieronder is afgeleid; er staat niets in dat niet in de feed zit.
  const clubs = Array.from(new Set(futureDates.map(d => d.venueName).filter(Boolean))) as string[]
  const clubsTekst = clubs.length === 0 ? ''
    : clubs.length === 1 ? clubs[0]
    : `${clubs.slice(0, -1).join(', ')} & ${clubs[clubs.length - 1]}`
  const prijzen = futureDates.map(d => d.vanafPrijs).filter((p): p is number => typeof p === 'number' && p > 0)
  const laagstePrijs = prijzen.length ? Math.min(...prijzen) : null
  const prijsTekst = laagstePrijs ? `€${laagstePrijs}` : ''
  const datumKort = (iso: string) => format(parseLocalDate(iso), 'd MMMM', { locale: localeObj })
  const heeftFeiten = futureDates.length > 0 && clubsTekst !== ''
  const feitenRegel = heeftFeiten
    ? `${artist.name} ${SAMENVATTING(
        futureDates.length,
        clubsTekst,
        datumKort(futureDates[0].date),
        datumKort(futureDates[futureDates.length - 1].date),
        prijsTekst ? VANAF(prijsTekst)[locale] : '',
      )[locale]}`
    : ''

  const rawHeaderImg = futureDates[0]?.eventCover || futureDates[0]?.venueCover || artist.image;
  const headerImage = rawHeaderImg && rawHeaderImg.trim() ? rawHeaderImg : '/hi-ibiza-2026/FB_IMG_1779623220486.jpg';
  const spotifyDetails = getSpotifyEmbedDetails(artist.slug);

  return (
    <div className="theme-monaco-vip bg-[#E14D68] text-white min-h-screen pb-24">
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: homeLabel(locale), path: '' },
          { name: sectionLabel('artists', locale), path: 'artists' },
          { name: artist.name },
        ]}
      />
      <BackButton locale={locale} fallbackHref={`/${locale}/artists`} variant="top" />
      {/* Hero Section */}
      <section className="relative h-[440px] md:h-[560px] overflow-hidden flex items-center justify-center text-center px-4 rounded-b-[36px] bg-black">
        <Image
          src={headerImage}
          alt={artist.name}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 z-10" />

        <div className="relative z-20 max-w-3xl mx-auto text-white pt-32">
          {artist.venueName && artist.venueSlug ? (
            <Link
              href={`/${locale}/${artist.venueBasePath}/${artist.venueSlug}`}
              className="inline-block bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-ibiza-green hover:bg-white/20 transition-all mb-3 hover:scale-[1.02]"
            >
              {RESIDENT_AT[locale]} {artist.venueName}
            </Link>
          ) : (
            <span className="inline-block bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-ibiza-green mb-3">
              {ARTIST_LABEL[locale]}
            </span>
          )}
          <h1 className="text-4xl md:text-7xl font-serif font-black tracking-tight mb-4 drop-shadow-md uppercase text-white">
            {artist.name}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {INTRO_TEXT[locale].split('%NAME%')[0]}
            <span className="font-bold text-white">{artist.name}</span>
            {INTRO_TEXT[locale].split('%NAME%')[1]}
          </p>
        </div>
      </section>

      {/* Eén regel harde feiten, geteld uit de agenda: hoe vaak, waar, tussen
          welke datums en vanaf welke prijs. Dit is het soort zin dat een
          antwoordmachine kan citeren, en het is per definitie actueel omdat
          hij meeschuift met de feed. */}
      {feitenRegel && (
        <div className="max-w-7xl mx-auto px-4 mt-10 sm:px-6 lg:px-8">
          <p className="max-w-3xl text-base md:text-lg leading-relaxed text-white/85">
            {feitenRegel}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Events list */}
          <div className="lg:col-span-2 flex flex-col gap-4" id="tickets">
            {futureDates.length === 0 ? (
              <div className="text-center py-12 text-velvet-obsidian/60 bg-white rounded-3xl border border-black/5 shadow-sm">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>{NO_EVENTS[locale]}</p>
              </div>
            ) : (
              futureDates.map((date, i) => (
                <Link
                  href={`/${locale}/${date.basePath}/${date.venueSlug || 'club'}/${date.eventSlug || 'event'}`}
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-black/5 flex items-center gap-4 hover:shadow-md transition-shadow group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-xl overflow-hidden bg-ibiza-mint relative flex items-center justify-center">
                    {date.eventCover ? (
                      <Image src={date.eventCover || ''} alt={date.name || 'Event'} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Music className="text-ibiza-green opacity-50" size={32} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-black text-xs font-bold tracking-wider uppercase mb-1" suppressHydrationWarning>
                      {format(parseLocalDate(date.date), 'EEE d MMM', { locale: localeObj })}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold truncate text-black mb-1">{date.eventName || date.name}</h3>
                    <div className="text-sm font-bold text-neutral-800 flex items-center gap-1">
                      <MapPin size={14} className="text-neutral-500" /> {date.venueName}
                      {date.vanafPrijs ? (
                        <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-black text-neutral-700">
                          €{date.vanafPrijs}
                        </span>
                      ) : null}
                    </div>
                    {/* De line-up van die avond stond wel in de feed maar werd
                        hier weggegooid. Het is de enige inhoud op deze pagina
                        die per datum verschilt, en precies wat iemand zoekt die
                        wil weten met wie zijn favoriet draait. Op één regel
                        afgekapt zodat twintig kaarten onder elkaar leesbaar
                        blijven; de volledige lijst staat op de eventpagina. */}
                    {date.lineUp ? (
                      <p className="mt-1 truncate text-xs text-neutral-500">
                        <span className="font-bold text-neutral-600">{LINEUP_LABEL[locale]}: </span>
                        {date.lineUp}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 hidden md:block">
                    <div className="bg-ibiza-green text-velvet-obsidian font-bold text-sm px-5 py-2.5 rounded-full hover:brightness-95 transition-all inline-block">
                      {TICKETS[locale]}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Right Column: Sticky Spotify Player */}
          <div className="lg:col-span-1 lg:sticky lg:top-32 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-lg backdrop-blur-md flex flex-col gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white mb-1">
                {LISTEN_TO[locale]} {artist.name}
              </h3>
              <p className="text-xs text-white/60">
                {WARM_UP[locale].split('%NAME%')[0]}
                {artist.name}
                {WARM_UP[locale].split('%NAME%')[1]}
              </p>
            </div>
            {spotifyDetails ? (
              <iframe
                src={`https://open.spotify.com/embed/${spotifyDetails.type}/${spotifyDetails.id}?utm_source=generator&theme=0`}
                width="100%"
                height="380"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-2xl"
              ></iframe>
            ) : (
              /* No verified Spotify id for this artist. A search link always
                 resolves; a guessed id renders Spotify's "Page not found"
                 inside the card, which looks like our page is broken. */
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(artist.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1DB954] px-6 py-4 font-serif text-sm font-black uppercase tracking-widest text-black transition-transform hover:scale-[1.02]"
              >
                {SPOTIFY_SEARCH[locale] || SPOTIFY_SEARCH.en}
              </a>
            )}
          </div>

        </div>

        {/* Drie vragen met antwoorden die uit de agenda hierboven komen. Geen
            algemeenheden over dresscode of leeftijd -- die staan al op de
            eventpagina's en zouden hier op 149 pagina's hetzelfde zijn, wat
            juist het soort duplicaat is waar dit hele opruimwerk om begonnen
            is. Deze drie verschillen per artiest en veranderen mee met de
            feed. */}
        {heeftFeiten && (
          <section className="mt-14 border-t border-white/15 pt-10">
            <h2 className="font-serif text-2xl md:text-3xl font-black text-white mb-6">
              {VRAGEN_KOP[locale]}
            </h2>
            <div className="flex flex-col gap-5 max-w-3xl">
              <div>
                <h3 className="font-bold text-white mb-1">{V_WANNEER(artist.name)[locale]}</h3>
                <p className="text-white/75 leading-relaxed">{feitenRegel}</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{V_WAAR(artist.name)[locale]}</h3>
                <p className="text-white/75 leading-relaxed">{A_WAAR(artist.name, clubsTekst)[locale]}</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{V_PRIJS(artist.name)[locale]}</h3>
                <p className="text-white/75 leading-relaxed">
                  {prijsTekst ? A_PRIJS(prijsTekst)[locale] : A_PRIJS_ONBEKEND[locale]}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
      {/* Floating Bottom Bar for mobile/desktop checkout */}
      {futureDates.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-black/10 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-black/50">{EVENTS_LABEL[locale]}</span>
            <span className="font-black text-xl text-black">{futureDates.length} {AVAILABLE[locale]}</span>
          </div>
          <a
            href="#tickets"
            className="bg-ibiza-green text-white font-black uppercase tracking-wider px-8 py-3.5 rounded-full hover:brightness-95 transition-all shadow-lg active:scale-95"
          >
            {VIEW_TICKETS[locale]}
          </a>
        </div>
      )}
    </div>
  );
}
