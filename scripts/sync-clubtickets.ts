import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client with Service Role (Bypasses RLS for admin sync)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const API_KEY = '80aac9f0b1a44b63060b083f3813271a';
const BASE_URL = `https://affiliates.clubtickets.com/api/affiliate/${API_KEY}`;

async function fetchFromAPI(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status} on ${endpoint}`);
  const json = await res.json();
  return json.data;
}

// Helper to create a slug from a string
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function syncVenues() {
  console.log('🔄 Fetching venues from Clubtickets...');
  const venues = await fetchFromAPI('/get/venues?locale=en');
  console.log(`Found ${venues.length} venues.`);

  for (const v of venues) {
    console.log(`Syncing venue: ${v.name}`);
    
    // 1. Upsert Venue
    const { data: club, error: clubErr } = await supabase
      .from('ct_venues')
      .upsert(
        {
          provider_id: String(v.id),
          name: v.name,
          slug: v.slug || slugify(v.name),
          description: v.description,
          picture: v.picture,
          cover: v.cover,
          whitelogo: v.whitelogo,
          is_day_club: v.isDayClub === true,
          type_id: v.type?.id ? String(v.type.id) : null,
          type_slug: v.type?.slug,
          type_name: v.type?.name,
          aff_link: v.affLink,
          active: true
        },
        { onConflict: 'provider_id' }
      )
      .select('id')
      .single();

    if (clubErr || !club) {
      console.error(`Error upserting venue ${v.name}:`, clubErr);
      continue;
    }

    // Now fetch details to get events
    const venueDetails = await fetchFromAPI(`/get/venue/${v.id}?locale=en`);
    if (!venueDetails.events) continue;

    console.log(`  Found ${venueDetails.events.length} events for ${v.name}.`);
    
    for (const evt of venueDetails.events) {
      // 2. Upsert Event Group
      const { data: eventRow, error: evGrpErr } = await supabase
        .from('ct_events')
        .upsert(
          {
            provider_id: String(evt.id),
            venue_id: club.id,
            name: evt.name,
            slug: evt.slug || slugify(evt.name),
            description: evt.description,
            requirements: evt.requirements,
            start_at: evt.startAt || null,
            start_at_next_day: evt.startAtNextDay === true,
            end_is_defined: evt.endIsDefined === true,
            end_at: evt.endAt || null,
            end_at_next_day: evt.endAtNextDay === true,
            logo: evt.logo,
            cover: evt.cover,
            whitelogo: evt.whitelogo,
            aff_link: evt.affLink,
            api_endpoint: evt.apiEndpoint
          },
          { onConflict: 'provider_id' }
        )
        .select('id')
        .single();

      if (evGrpErr || !eventRow) {
        console.error(`  Error upserting event ${evt.name}:`, evGrpErr);
        continue;
      }

      await new Promise(res => setTimeout(res, 200)); // Rate limit

      try {
        const eventData = await fetchFromAPI(`/get/venue/${v.id}/event/${evt.id}?locale=en`);
        if (!eventData.dates) continue;

        for (const d of eventData.dates) {
          // Parse price
          const priceMatch = d.prices ? String(d.prices).match(/(\d+)/) : null;
          const price = priceMatch ? parseFloat(priceMatch[0]) : null;

          // 3. Upsert Date
          const { data: dateRow, error: dateErr } = await supabase
            .from('ct_dates')
            .upsert(
              {
                provider_id: String(d.id),
                event_id: eventRow.id,
                venue_id: club.id,
                name: d.name || evt.name,
                date: d.date,
                prices: price,
                raw_prices: d.prices,
                raw_lineup: d.lineUp,
                aff_link: d.affLink
              },
              { onConflict: 'provider_id' }
            )
            .select('id')
            .single();
            
          if (dateErr || !dateRow) {
             console.error(`    Error upserting date ${d.date}:`, dateErr);
             continue;
          }

          // 4. Parse LineUp and Upsert Artists
          if (d.lineUp) {
            // Clean HTML paragraphs and list tags by converting them to commas before splitting
            const cleanedLineUp = d.lineUp
              .replace(/<\/p>\s*<p>/gi, ', ')
              .replace(/<br\s*\/?>/gi, ', ')
              .replace(/<\/div>\s*<div>/gi, ', ')
              .replace(/<\/?[^>]+(>|$)/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();

            // Split by comma, pipe, or " & "
            const artistNames = cleanedLineUp.split(/[,|&]|(\band\b)/i)
              .map((a: string) => a?.trim())
              .filter((a: string) => a && a.toLowerCase() !== 'and' && a.toLowerCase() !== 'tba');
            
            for (const artistName of artistNames) {
               const artistSlug = slugify(artistName);
               if (!artistSlug) continue;

                // Heuristic to get a cover image and venue for the artist
                // We use the event's cover/logo and the venue's details
                const artistImage = evt.cover || evt.logo || '';
                const vName = v.name || '';
                const vSlug = v.slug || '';

                // Upsert artist
                const { data: artistRow } = await supabase
                  .from('ct_artists')
                  .upsert(
                    { 
                      name: artistName, 
                      slug: artistSlug,
                      image: artistImage,
                      venue_name: vName,
                      venue_slug: vSlug
                    },
                    { onConflict: 'slug' }
                  )
                  .select('id')
                  .single();
                 
               if (artistRow) {
                 // Link artist to date
                 await supabase
                   .from('ct_date_artists')
                   .upsert(
                     { date_id: dateRow.id, artist_id: artistRow.id },
                     { onConflict: 'date_id,artist_id' }
                   );
               }
            }
          }
        }
        console.log(`  ✅ Synced ${eventData.dates.length} dates for ${evt.name}`);
      } catch (err) {
        console.error(`  Failed to fetch dates for event ${evt.id}:`, err);
      }
    }
  }

  console.log('🎉 Sync completed!');
}

syncVenues().catch(console.error);
