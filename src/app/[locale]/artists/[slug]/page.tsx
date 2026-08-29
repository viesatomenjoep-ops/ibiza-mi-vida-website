import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Music } from 'lucide-react'
import { format } from 'date-fns'
import { nl, enUS, de, es, fr } from 'date-fns/locale'
import { getArtist, getArtistDates, getVenues } from '@/lib/clubtickets'
import { eventBasePath } from '@/lib/event-path'
import { BackButton } from '@/components/ui/BackButton'
import { detailMetadata, staticMetadata } from '@/lib/seo-pages'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/seo'

export const revalidate = 3600

// ── Spotify embed lookup (artist name/slug → known Spotify id) ──
function getSpotifyEmbedDetails(slug: string) {
  const normalized = slug.toLowerCase().trim();

  if (normalized.includes('david-guetta') || normalized.includes('future-rave')) {
    return { type: 'artist', id: '1Cs0zKBU1kc0i8ypK3B9ai' };
  }
  if (normalized.includes('carl-cox')) {
    return { type: 'artist', id: '19SmlbABtI4bXz864MLqOS' };
  }
  if (normalized.includes('fisher')) {
    return { type: 'artist', id: '7oxj2wIMrWtw6FNaMrfbe3' };
  }
  if (normalized.includes('martin-garrix')) {
    return { type: 'artist', id: '60d24wfXmWzDZfLVUQ3Yex' };
  }
  if (normalized.includes('calvin-harris')) {
    return { type: 'artist', id: '7CajNmpbOovFoOoasH2HaY' };
  }
  if (normalized.includes('armin-van-buuren') || normalized.includes('state-of-trance')) {
    return { type: 'artist', id: '0d8t2a5sWzi0rkcVq6Qa5S' };
  }
  if (normalized.includes('tiesto')) {
    return { type: 'artist', id: '2o5jDhtHVPhrJdv3cEQ99Z' };
  }
  if (normalized.includes('black-coffee')) {
    return { type: 'artist', id: '23HQ6V00W7V02FqfWnEw02' };
  }
  if (normalized.includes('swedish-house-mafia')) {
    return { type: 'artist', id: '1h0ceXBpq1d58XwVPRJPg3' };
  }
  if (normalized.includes('anyma')) {
    return { type: 'artist', id: '4u1C6C5VbK3161c5LzK17e' };
  }
  if (normalized.includes('john-summit') || normalized.includes('experts-only')) {
    return { type: 'artist', id: '7331Gn1ay40E3ZpYxjgBUP' };
  }
  if (normalized.includes('dimitri-vegas') || normalized.includes('like-mike') || normalized.includes('tomorrowland')) {
    return { type: 'artist', id: '2052Y92GZz593zF85p8o6c' };
  }
  if (normalized.includes('peggy-gou')) {
    return { type: 'artist', id: '2S6tMv8628G3p681F0qQy2' };
  }
  if (normalized.includes('charlotte-de-witte')) {
    return { type: 'artist', id: '2T753C4h6D9YjE31B29o6q' };
  }
  if (normalized.includes('amelie-lens')) {
    return { type: 'artist', id: '7z51l3Qn3rG0sYq6Qj1q05' };
  }
  if (normalized.includes('jamie-jones') || normalized.includes('paradise')) {
    return { type: 'artist', id: '7r50RzR317W8c6zU5oJ6T3' };
  }
  if (normalized.includes('no-art') || normalized.includes('anotr')) {
    return { type: 'artist', id: '4X9i0mU0g91g57qT5n8c9h' };
  }
  if (normalized.includes('adriatique')) {
    return { type: 'artist', id: '3o9ZNDJ6Yx5Xq1Xp9mX0L5' };
  }
  if (normalized.includes('indira-paganotto') || normalized.includes('artcore')) {
    return { type: 'artist', id: '7r5k1E8T0Wl4y1t3hO5a8C' };
  }
  if (normalized.includes('meduza')) {
    return { type: 'artist', id: '0xRXCcSX89eobfrshSVdyu' };
  }
  if (normalized.includes('james-hype')) {
    return { type: 'artist', id: '3B3n1a87K365gL47t52G4q' };
  }
  if (normalized.includes('dom-dolla')) {
    return { type: 'artist', id: '205i7E8fNVfojowcQSfK9m' };
  }
  if (normalized.includes('mestiza')) {
    return { type: 'artist', id: '4LnJKzcbJ83JNh2zEe4Dmy' };
  }
  if (normalized.includes('hugel')) {
    return { type: 'artist', id: '6S118F3hNq0O0c0FwK4PqZ' };
  }
  if (normalized.includes('francis-mercier')) {
    return { type: 'artist', id: '7zH6m3N2j6K83x4rB2w1cI' };
  }
  if (normalized.includes('elrow')) {
    return { type: 'playlist', id: '37i9dQZF1DXbK717SV5PL9' };
  }
  if (normalized.includes('ants')) {
    return { type: 'playlist', id: '37i9dQZF1DXbK717SV5PL9' };
  }

  // Default working Spotify Playlist: Ibiza Deep House (37i9dQZF1DXbK717SV5PL9)
  return { type: 'playlist', id: '37i9dQZF1DXbK717SV5PL9' };
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
      venueCover: d.venueCover || ''
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
const AVAILABLE: T = L('Beschikbaar', 'Available', 'Verfügbar', 'Disponibles', 'Disponibles')
const VIEW_TICKETS: T = L('Bekijk Tickets', 'View Tickets', 'Tickets ansehen', 'Ver Entradas', 'Voir les Billets')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const result = await fetchArtist(params.slug, locale)
  if (!result) return staticMetadata(locale, 'artists')

  return detailMetadata(locale, `artists/${params.slug}`, result.artist.name, {
    description: INTRO_TEXT[locale].replace('%NAME%', result.artist.name),
    image: result.artist.image || result.dates[0]?.eventCover,
    suffix: '— Ibiza 2026',
  })
}

export default async function ArtistPage({ params }: Props) {
  const locale = (LOCALES as readonly string[]).includes(params.locale) ? (params.locale as Locale) : DEFAULT_LOCALE
  const result = await fetchArtist(params.slug, locale)
  if (!result) notFound()

  const { artist, dates } = result;

  // Filter for future dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDates = dates
    .filter(d => d && d.date && parseLocalDate(d.date) >= today)
    .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime());

  const localeObj = DF_LOC[locale] || enUS;
  const rawHeaderImg = futureDates[0]?.eventCover || futureDates[0]?.venueCover || artist.image;
  const headerImage = rawHeaderImg && rawHeaderImg.trim() ? rawHeaderImg : '/hi-ibiza-2026/FB_IMG_1779623220486.jpg';
  const spotifyDetails = getSpotifyEmbedDetails(artist.slug);

  return (
    <div className="theme-monaco-vip bg-[#E14D68] text-white min-h-screen pb-24">
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
                    </div>
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
          </div>

        </div>
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
