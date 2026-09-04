import { stripHtml, cleanHtml } from './html-utils';
import { isBlankCover } from './blank-covers';

// ClubTickets affiliate key. Read from the environment so the repo is not the
// only place it lives; the literal stays as a fallback so `next build` and CI
// (which have no env set) keep working with no behaviour change. The same var
// feeds scripts/sync-clubtickets.mjs — one key, two callers.
export const API_KEY = process.env.CLUBTICKETS_API_KEY || '80aac9f0b1a44b63060b083f3813271a';
export const BASE_URL = `https://affiliates.clubtickets.com/api/affiliate/${API_KEY}/get`;

const SUPPORTED_LOCALES = ['en', 'nl', 'de', 'es', 'fr'] as const;

// PERF: load only the requested locale, on demand. Static top-level imports of
// all five ~8.5MB JSON files (≈42MB) bloated the server bundle and cold starts.
// Dynamic import() lets webpack split each locale into its own chunk that is
// loaded (and parsed) only when that language is actually requested.
async function importLocale(locale: string): Promise<any> {
  switch (locale) {
    case 'nl': return (await import('@/data/clubtickets_nl.json')).default;
    case 'de': return (await import('@/data/clubtickets_de.json')).default;
    case 'es': return (await import('@/data/clubtickets_es.json')).default;
    case 'fr': return (await import('@/data/clubtickets_fr.json')).default;
    default:   return (await import('@/data/clubtickets_en.json')).default;
  }
}

export interface CTType {
  id: number;
  slug: string;
  name: string;
}

export interface CTVenueEvent {
  id: number;
  name: string;
  slug: string;
  affLink: string;
  apiEndpoint: string;
  description?: string;
  requirements?: string;
  startAt?: string;
  startAtNextDay?: boolean;
  endIsDefined?: boolean;
  endAt?: string;
  endAtNextDay?: boolean;
  logo?: string;
  cover?: string;
  whitelogo?: string;
  dates?: CTEventDate[];
}

export interface CTVenue {
  id: number;
  name: string;
  slug: string;
  description: string;
  cleanDescription?: string;
  picture: string;
  cover: string;
  whitelogo: string;
  isDayClub: boolean;
  type: CTType;
  activeEvents: number;
  affLink: string;
  apiEndpoint: string;
  events: CTVenueEvent[];
}

export interface CTEventDate {
  id: number;
  name: string;
  date: string;
  lineUp: string;
  prices: string;
  affLink: string;
  /**
   * Cheapest currently in-stock ticket as a number; `null` when every tier is
   * sold out. Populated by the nightly sync and overlaid live on the event
   * detail pages (see src/lib/clubtickets-live.ts). Optional so historical JSON
   * without the field still typechecks.
   */
  lowestAvailablePrice?: number | null;
  // Enhanced properties added by sync script:
  eventName?: string;
  eventSlug?: string;
  venueName?: string;
  venueSlug?: string;
  venueCover?: string;
  venueLogo?: string;
  eventCover?: string;
  eventLogo?: string;
  eventId?: number;
  venueId?: number;
}

export interface CTEvent {
  id: number;
  name: string;
  slug: string;
  description: string;
  requirements: string;
  startAt: string;
  startAtNextDay: boolean;
  endIsDefined: boolean;
  endAt: string;
  endAtNextDay: boolean;
  logo: string;
  cover: string;
  whitelogo: string;
  affLink: string;
  apiEndpoint: string;
  venue: {
    id: number;
    name: string;
    slug: string;
    affLink: string;
    apiEndpoint: string;
  };
  type: CTType;
  dates: CTEventDate[];
  venueName?: string;
  venueSlug?: string;
  venueCover?: string;
  venueLogo?: string;
  venueId?: number;
}

export interface CTArtist {
  id: number;
  name: string;
  slug: string;
  image: string;
  venueName: string;
  venueSlug: string;
  href: string;
}

export interface ClubTicketsData {
  venues: CTVenue[];
  events: CTEvent[];
  dates: CTEventDate[];
  artists: CTArtist[];
  lastUpdated: string;
}

let cachedData: Record<string, ClubTicketsData> = {};



async function loadData(locale: string = 'en'): Promise<ClubTicketsData> {
  const normLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale) ? locale : 'en';
  if (cachedData[normLocale]) return cachedData[normLocale];
  try {
    // OPTIMIZATION: Do not deep clone the 8.5MB JSON data.
    // Mutate the imported module object directly — it's only done once per Node process.
    const rawData = (await importLocale(normLocale)) as ClubTicketsData;
    
    // Clean HTML from all venues
    if (rawData.venues) {
      rawData.venues.forEach(v => {
        v.name = stripHtml(v.name);
        v.description = cleanHtml(v.description);
        v.cleanDescription = v.description;
        if (v.events) {
          v.events.forEach(e => {
            e.name = stripHtml(e.name);
            e.description = cleanHtml(e.description);
            e.requirements = cleanHtml(e.requirements);
            if (e.dates) {
              e.dates.forEach(d => {
                d.name = stripHtml(d.name);
                d.eventName = stripHtml(d.eventName);
                d.lineUp = stripHtml(d.lineUp);
              });
            }
          });
        }
      });
    }
    
    // Clean HTML from all events
    if (rawData.events) {
      rawData.events.forEach(e => {
        e.name = stripHtml(e.name);
        e.description = cleanHtml(e.description);
        e.requirements = cleanHtml(e.requirements);
        if (e.dates) {
          e.dates.forEach(d => {
            d.name = stripHtml(d.name);
            d.eventName = stripHtml(d.eventName);
            d.lineUp = stripHtml(d.lineUp);
          });
        }
      });
    }
    
    // Clean HTML from all dates directly
    if (rawData.dates) {
      rawData.dates.forEach(d => {
        d.name = stripHtml(d.name);
        d.eventName = stripHtml(d.eventName);
        d.venueName = stripHtml(d.venueName);
        d.lineUp = stripHtml(d.lineUp);
      });
    }
    
    // Clean HTML from artists
    if (rawData.artists) {
      rawData.artists.forEach(a => {
        a.name = stripHtml(a.name);
        a.venueName = stripHtml(a.venueName);
      });
    }
    
    // ── Blank placeholders, stripped once at the source ──────────────────
    // ClubTickets serves a solid-black JPEG for events that have no artwork.
    // A card rendering it looks broken, but nothing is broken: the source has
    // no picture. `pickCover()` skips them, except it was only ever wired into
    // three call sites while roughly twenty other files read these fields
    // straight — so the same black box kept resurfacing somewhere new and got
    // fixed one page at a time.
    //
    // Clearing the field here instead means every consumer, including ones
    // written later, gets clean data without having to know the problem
    // exists. Downstream `cover || logo` fallbacks then reach the next
    // candidate on their own: Swedish House Mafia, the case that exposed this,
    // has a blank eventCover and perfectly good gold artwork sitting in
    // eventLogo right behind it.
    const scrub = (o: Record<string, any> | undefined, keys: string[]) => {
      if (!o) return;
      for (const k of keys) if (isBlankCover(o[k])) o[k] = undefined;
    };
    const IMG_KEYS = ['cover', 'logo', 'picture', 'image', 'whitelogo',
                      'eventCover', 'eventLogo', 'venueCover', 'venueLogo'];
    rawData.dates?.forEach(d => scrub(d as any, IMG_KEYS));
    rawData.events?.forEach(e => scrub(e as any, IMG_KEYS));
    rawData.artists?.forEach(a => scrub(a as any, IMG_KEYS));
    rawData.venues?.forEach(v => {
      scrub(v as any, IMG_KEYS);
      // Venues carry their own nested events array, and the venue detail page
      // reads from that rather than from `dates` — which is why scrubbing only
      // the top-level collections left the black card standing on exactly the
      // pages built from a venue.
      (v as any).events?.forEach((e: any) => scrub(e, IMG_KEYS));
    });

    cachedData[normLocale] = rawData;
    return rawData;
  } catch (e) {
    console.error(`Failed to load data for locale ${locale}:`, e);
    return { venues: [], events: [], dates: [], artists: [], lastUpdated: new Date().toISOString() };
  }
}

export async function getVenues(locale: string = 'en'): Promise<CTVenue[]> {
  const data = await loadData(locale);
  return data.venues;
}

export async function getVenue(id: number, locale: string = 'en'): Promise<CTVenue | undefined> {
  const venues = await getVenues(locale);
  return venues.find(v => v.id === id);
}

export async function getVenueEvents(venueId: number, locale: string = 'en'): Promise<CTVenueEvent[]> {
  const venue = await getVenue(venueId, locale);
  return venue?.events || [];
}

export async function getEvent(eventId: number, locale: string = 'en'): Promise<CTEvent | undefined> {
  const data = await loadData(locale);
  return data.events.find(e => e.id === eventId);
}

export async function getAllEvents(locale: string = 'en'): Promise<CTEvent[]> {
  const data = await loadData(locale);
  return data.events;
}

/**
 * When the ClubTickets dataset was last synced.
 *
 * Used as a real `lastModified` in the sitemap for event and venue URLs.
 * Previously every sitemap entry claimed `new Date()`, i.e. "the entire site
 * changed just now", on every regeneration — a signal Google learns to ignore.
 * This is the actual date the underlying content changed.
 */
export async function getDataLastUpdated(locale: string = 'en'): Promise<Date | undefined> {
  const data = await loadData(locale);
  const d = data.lastUpdated ? new Date(data.lastUpdated) : undefined;
  return d && !Number.isNaN(d.getTime()) ? d : undefined;
}

export async function getAllDates(locale: string = 'en', limit?: number): Promise<CTEventDate[]> {
  const data = await loadData(locale);
  let dates = data.dates || [];
  
  // Ensure we only return dates in the future
  const now = new Date().getTime() - (24 * 60 * 60 * 1000);
  dates = dates.filter(d => new Date(d.date).getTime() > now);
  
  if (limit && limit > 0) {
    dates = dates.slice(0, limit);
  }
  return dates;
}

export async function getArtists(locale: string = 'en', limit?: number): Promise<CTArtist[]> {
  const data = await loadData(locale);
  let artists = data.artists || [];
  if (limit && limit > 0) {
    artists = artists.slice(0, limit);
  }
  return artists;
}

export async function getArtist(slug: string, locale: string = 'en'): Promise<CTArtist | undefined> {
  const data = await loadData(locale);
  return data.artists?.find(a => a.slug === slug);
}

export async function getArtistDates(artistName: string, locale: string = 'en', artistSlug?: string): Promise<CTEventDate[]> {
  const dates = await getAllDates(locale);
  const searchName = artistName.toLowerCase();
  
  const mainName = searchName
    .replace(/\s+presents.*$/i, '')
    .replace(/\s+at\s+ushuaïa.*$/i, '')
    .replace(/\s+at\s+hï\s+ibiza.*$/i, '')
    .replace(/\s+at\s+club.*$/i, '')
    .trim();

  return dates.filter(d => {
    if (d.lineUp && d.lineUp.toLowerCase().includes(mainName)) {
      return true;
    }
    if (artistSlug && d.eventSlug === artistSlug) {
      return true;
    }
    if (d.eventName && d.eventName.toLowerCase().includes(mainName)) {
      return true;
    }
    return false;
  });
}
