import fs from 'fs';
import path from 'path';

const LOCALES = ['en', 'nl', 'de', 'es', 'fr'];
const API_KEY = '80aac9f0b1a44b63060b083f3813271a';
const BASE_URL = `https://affiliates.clubtickets.com/api/affiliate/${API_KEY}/get`;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status} on ${url}`);
        if (response.status === 429) {
          console.log(`Rate limited. Waiting ${5000 * (i + 1)}ms before retry...`);
          await delay(5000 * (i + 1));
          continue;
        }
        return null;
      }
      const json = await response.json();
      if (json.error) {
        console.error(`API error: ${json.message} on ${url}`);
        return null;
      }
      return json.data;
    } catch (e) {
      console.error(`Fetch error on ${url}: ${e.message}`);
      await delay(2000);
    }
  }
  return null;
}

async function syncLocale(locale) {
  console.log(`\n=== Starting Clubtickets synchronization for locale: ${locale} ===\n`);
  const OUTPUT_FILE = path.resolve(process.cwd(), `src/data/clubtickets_${locale}.json`);
  
  const allData = {
    venues: [],
    events: [],
    dates: [],
    artists: [],
    lastUpdated: new Date().toISOString()
  };

  const artistsMap = new Map();

  console.log(`[${locale}] Fetching venues list...`);
  const venuesList = await fetchWithRetry(`${BASE_URL}/venues?locale=${locale}`);
  
  if (!venuesList) {
    console.error('Failed to fetch venues list. Aborting sync.');
    process.exit(1);
  }

  console.log(`Found ${venuesList.length} venues. Fetching details...`);

  for (const v of venuesList) {
    console.log(`[${locale}] Fetching details for venue: ${v.name}`);
    const venueDetail = await fetchWithRetry(`${BASE_URL}/venue/${v.id}?locale=${locale}`);
    await delay(200); // polite delay
    
    if (!venueDetail) continue;

    // Clean up HTML from description
    if (venueDetail.description) {
      venueDetail.cleanDescription = venueDetail.description
        .split('.promo-hz')[0]
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    allData.venues.push(venueDetail);

    if (venueDetail.events && venueDetail.events.length > 0) {
      for (const e of venueDetail.events) {
        console.log(`  [${locale}] Fetching event details: ${e.name}`);
        const eventDetail = await fetchWithRetry(`${BASE_URL}/venue/${v.id}/event/${e.id}?locale=${locale}`);
        await delay(200);
        
        if (!eventDetail) continue;

        // Enhance event with venue info
        const enhancedEvent = {
          ...eventDetail,
          venueName: v.name,
          venueSlug: v.slug,
          venueCover: v.cover || v.picture,
          venueLogo: v.whitelogo
        };

        allData.events.push(enhancedEvent);

        // Process dates
        if (eventDetail.dates && eventDetail.dates.length > 0) {
          for (const d of eventDetail.dates) {
            allData.dates.push({
              ...d,
              eventName: eventDetail.name,
              eventSlug: eventDetail.slug,
              venueName: v.name,
              venueSlug: v.slug,
              venueCover: v.cover || v.picture,
              venueLogo: v.whitelogo,
              eventCover: eventDetail.cover,
              eventLogo: eventDetail.logo,
              eventId: eventDetail.id,
              venueId: v.id
            });
          }
        }

        // Process artist extraction (heuristics based on existing website logic)
        // Only add if it has a good image
        if (eventDetail.cover || eventDetail.logo) {
          if (!artistsMap.has(eventDetail.slug)) {
            artistsMap.set(eventDetail.slug, {
              id: eventDetail.id,
              name: eventDetail.name,
              slug: eventDetail.slug,
              image: eventDetail.cover || eventDetail.logo,
              venueName: v.name,
              venueSlug: v.slug,
              href: `/club-tickets/${v.slug}/${eventDetail.slug}`
            });
          }
        }
      }
    }
  }

  // Finalize dates: sort chronologically and filter out past dates
  const now = new Date().getTime() - (24 * 60 * 60 * 1000);
  allData.dates = allData.dates
    .filter(d => new Date(d.date).getTime() > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  allData.artists = Array.from(artistsMap.values());

  // Ensure directory exists
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 2));
  console.log(`[${locale}] Synchronization complete! Saved ${allData.venues.length} venues, ${allData.events.length} events, ${allData.dates.length} future dates, and ${allData.artists.length} artists to ${OUTPUT_FILE}`);
}

async function runAll() {
  for (const locale of LOCALES) {
    await syncLocale(locale);
  }
}

runAll().catch(console.error);
