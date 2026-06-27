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

function stripHtml(html: string | undefined): string {
  if (!html) return '';
  let str = html;
  
  // Remove style and script blocks and their content completely
  str = str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  str = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Strip all remaining HTML tags rigorously
  str = str.replace(/<\/?[^>]+(>|$)/g, ' ');
  
  // Clean up whitespace and duplicate dashes
  str = str.replace(/\s*-\s*(-\s*)+/g, ' - ');
  str = str.replace(/\s\s+/g, ' ');
  str = str.replace(/^-|-$/g, '').trim();
  
  // Handle HTML entities
  str = str.replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '"')
           .replace(/&#39;/g, "'")
           .replace(/&nbsp;/g, ' ');
           
  return str;
}

function cleanHtml(html: string | undefined): string {
  if (!html) return '';
  
  // 1. Remove promo garbage and standard script/style tags
  let str = html.split('.promo-hz')[0];
  str = str.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  str = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // 2. Remove raw pseudo-CSS and JS using line-by-line heuristics
  const lines = str.split('\n');
  const cleanedLines = lines.filter(line => {
    const l = line.replace(/<br \/>/g, '').trim();
    
    // CSS rules
    if (l.startsWith(':root{') || l.startsWith(':root {') || l.startsWith('}')) return false;
    if (l.startsWith('--')) return false;
    if (l.match(/^[\.#a-zA-Z0-9_\-:\s,]+{/)) return false;
    if (l.match(/^[a-zA-Z\-]+:\s*[^;]+;/)) return false;
    if (l.startsWith('/*') && l.endsWith('*/')) return false;
    if (l.startsWith('@media') || l.startsWith('@keyframes')) return false;
    if (l.match(/^[0-9]+% {/)) return false; // keyframes percentages
    if (l.includes('from{') || l.includes('to{')) return false;
    if (l.includes('outline:none!important;')) return false;
    if (l.includes('box-shadow:none!important;')) return false;
    if (l.includes('-webkit-')) return false;
    
    // JS lines
    if (
      l.includes('(function(){') || 
      l.includes('function recalc(){') || 
      l.includes('const list = document.getElementById') || 
      l.includes('const line = document.getElementById') ||
      l.includes('if(!list || !line) return;') ||
      l.includes('const icons = list.querySelectorAll') ||
      l.includes('if(icons.length') ||
      l.includes('const first = icons') ||
      l.includes('const last = icons') ||
      l.includes('const box = list') ||
      l.includes('const y1 =') ||
      l.includes('const y2 =') ||
      l.includes('line.style.') || 
      l.includes('window.addEventListener') || 
      l.includes('document.querySelectorAll') ||
      l.includes('const listEl =') ||
      l.includes('if(listEl) new MutationObserver') ||
      l.includes('})();')
    ) {
      return false;
    }
    return true;
  });
  
  str = cleanedLines.join('\n');
  
  // 3. Clean empty <br /> chains left behind
  str = str.replace(/(?:<br \/>\s*){3,}/g, '<br /><br />');
  
  return str.trim();
}

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
