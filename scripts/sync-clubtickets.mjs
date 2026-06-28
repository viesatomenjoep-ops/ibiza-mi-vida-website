import fs from 'fs';
import path from 'path';

const LOCALES = ['en', 'nl', 'de', 'es', 'fr'];
const API_KEY = '80aac9f0b1a44b63060b083f3813271a';
const BASE_URL = `https://affiliates.clubtickets.com/api/affiliate/${API_KEY}/get`;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function deepCleanHtml(html) {
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
    if (l.match(/^[\.#a-zA-Z0-9_\-:\s,\[\]\>\*]+(?:,|{)$/)) return false;
    if (l.match(/^[a-zA-Z\-]+:\s*[^;]+;/)) return false;
    if (l.startsWith('/*') && l.endsWith('*/')) return false;
    if (l.startsWith('@media') || l.startsWith('@keyframes')) return false;
    if (l.match(/^[0-9]+% {/)) return false;
    if (l.includes('from{') || l.includes('to{')) return false;
    
    // Hardcoded aggressive CSS stripping for Clubtickets injected garbage
    if (
      l.includes('details[open]') || 
      l.includes('.detalles') || 
      l.includes('.itinerary-block') || 
      l.includes('.pill::after') ||
      l.includes('.pill{') ||
      l.includes('.included-row{') ||
      l.includes('.chip{') ||
      l.includes('.icon{') ||
      l.includes('box-sizing:border-box') ||
      l.includes('content:"–"') ||
      l.includes('outline:none!important;') ||
      l.includes('box-shadow:none!important;') ||
      l.includes('-webkit-')
    ) {
      return false;
    }
    
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
      l.includes('})();') ||
      l.includes('d.addEventListener')
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
    await delay(50); // polite delay
    
    if (!venueDetail) continue;

    if (venueDetail.description) {
      venueDetail.cleanDescription = deepCleanHtml(venueDetail.description);
    }

    allData.venues.push(venueDetail);

    if (venueDetail.events && venueDetail.events.length > 0) {
      for (const e of venueDetail.events) {
        console.log(`  [${locale}] Fetching event details: ${e.name}`);
        const eventDetail = await fetchWithRetry(`${BASE_URL}/venue/${v.id}/event/${e.id}?locale=${locale}`);
        await delay(50);
        
        if (!eventDetail) continue;

        // Clean names
        eventDetail.name = eventDetail.name ? eventDetail.name.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim() : '';

        // Deep clean description
        if (eventDetail.description) {
          eventDetail.description = deepCleanHtml(eventDetail.description);
        }

        // Enhance event with venue info
        const enhancedEvent = {
          ...eventDetail,
          venueName: v.name.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim(),
          venueSlug: v.slug,
          venueCover: v.cover || v.picture,
          venueLogo: v.whitelogo
        };

        allData.events.push(enhancedEvent);

        // Process dates
        if (eventDetail.dates && eventDetail.dates.length > 0) {
          for (const d of eventDetail.dates) {
            const dateObj = {
              ...d,
              name: d.name ? d.name.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim() : '',
              eventName: enhancedEvent.name,
              eventSlug: enhancedEvent.slug,
              venueName: enhancedEvent.venueName,
              venueSlug: enhancedEvent.venueSlug,
              venueCover: enhancedEvent.venueCover,
              venueLogo: enhancedEvent.venueLogo,
              eventCover: enhancedEvent.cover,
              eventLogo: enhancedEvent.logo,
              eventId: enhancedEvent.id,
              venueId: v.id,
              lineUp: d.lineUp ? d.lineUp.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim() : ''
            };
            allData.dates.push(dateObj);
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
  // Run all locales in parallel to speed up the build time 5x
  await Promise.all(LOCALES.map(locale => syncLocale(locale)));
}

runAll().catch(console.error);
