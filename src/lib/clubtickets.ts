import fs from 'fs';
import path from 'path';
import { stripHtml, cleanHtml } from './html-utils';

export const API_KEY = '80aac9f0b1a44b63060b083f3813271a';
export const BASE_URL = `https://affiliates.clubtickets.com/api/affiliate/${API_KEY}/get`;

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



function loadData(locale: string = 'en'): ClubTicketsData {
  if (cachedData[locale]) return cachedData[locale];
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', `clubtickets_${locale}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const rawData = JSON.parse(fileContents) as ClubTicketsData;
    
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
    
    cachedData[locale] = rawData;
    return rawData;
  } catch (e) {
    console.error(`Failed to load data for locale ${locale}:`, e);
    return { venues: [], events: [], dates: [], artists: [], lastUpdated: new Date().toISOString() };
  }
}

export async function getVenues(locale: string = 'en'): Promise<CTVenue[]> {
  const data = loadData(locale);
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
  const data = loadData(locale);
  return data.events.find(e => e.id === eventId);
}

export async function getAllEvents(locale: string = 'en'): Promise<CTEvent[]> {
  const data = loadData(locale);
  return data.events;
}

export async function getAllDates(locale: string = 'en', limit?: number): Promise<CTEventDate[]> {
  const data = loadData(locale);
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
  const data = loadData(locale);
  let artists = data.artists || [];
  if (limit && limit > 0) {
    artists = artists.slice(0, limit);
  }
  return artists;
}

export async function getArtist(slug: string, locale: string = 'en'): Promise<CTArtist | undefined> {
  const data = loadData(locale);
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
