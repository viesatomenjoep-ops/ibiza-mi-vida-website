import fs from 'fs';
import path from 'path';

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

let cachedData: ClubTicketsData | null = null;

function loadData(): ClubTicketsData {
  if (cachedData) return cachedData;
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'clubtickets.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    cachedData = JSON.parse(fileContents);
    return cachedData!;
  } catch (error) {
    console.error('Failed to load local clubtickets.json data:', error);
    return { venues: [], events: [], dates: [], artists: [], lastUpdated: '' };
  }
}

export async function getVenues(locale = 'en'): Promise<CTVenue[]> {
  const data = loadData();
  return data.venues || [];
}

export async function getVenue(venueId: number, locale = 'en'): Promise<CTVenue | null> {
  const data = loadData();
  return data.venues.find(v => v.id === venueId) || null;
}

export async function getEvent(venueId: number, eventId: number, locale = 'en'): Promise<CTEvent | null> {
  const data = loadData();
  return data.events.find(e => e.id === eventId && (e.venueId === venueId || e.venue?.id === venueId)) || null;
}

export async function getEventBySlugs(venueSlug: string, eventSlug: string): Promise<CTEvent | null> {
  const data = loadData();
  return data.events.find(e => (e.venueSlug === venueSlug || e.venue?.slug === venueSlug) && e.slug === eventSlug) || null;
}

export async function getAllDates(limit?: number): Promise<CTEventDate[]> {
  const data = loadData();
  let dates = data.dates || [];
  
  // Ensure we only return dates in the future
  const now = new Date().getTime() - (24 * 60 * 60 * 1000);
  dates = dates.filter(d => new Date(d.date).getTime() > now);
  
  if (limit && limit > 0) {
    dates = dates.slice(0, limit);
  }
  return dates;
}

export async function getArtists(limit?: number): Promise<CTArtist[]> {
  const data = loadData();
  let artists = data.artists || [];
  if (limit && limit > 0) {
    artists = artists.slice(0, limit);
  }
  return artists;
}
