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
  // Included in getVenue but not necessarily getVenues:
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
}

export interface CTVenue {
  id: number;
  name: string;
  slug: string;
  description: string;
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
}

interface ApiResponse<T> {
  locale: string;
  data: T;
  error?: number;
  message?: string;
}

const REVALIDATE_TIME = 3600; // 1 hour

export async function getVenues(locale = 'en'): Promise<CTVenue[]> {
  const url = `${BASE_URL}/venues?locale=${locale}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) return [];
    const json = await res.json() as ApiResponse<CTVenue[]>;
    if (json.error) {
      console.error('ClubTickets API Error:', json.message);
      return [];
    }
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    return [];
  }
}

export async function getVenue(venueId: number, locale = 'en'): Promise<CTVenue | null> {
  const url = `${BASE_URL}/venue/${venueId}?locale=${locale}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) return null;
    const json = await res.json() as ApiResponse<CTVenue>;
    if (json.error) return null;
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch venue ${venueId}:`, error);
    return null;
  }
}

export async function getEvent(venueId: number, eventId: number, locale = 'en'): Promise<CTEvent | null> {
  const url = `${BASE_URL}/venue/${venueId}/event/${eventId}?locale=${locale}`;
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_TIME } });
    if (!res.ok) return null;
    const json = await res.json() as ApiResponse<CTEvent>;
    if (json.error) return null;
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch event ${eventId} for venue ${venueId}:`, error);
    return null;
  }
}
