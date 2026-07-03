-- Add indexes for optimized lookup of venues, events, dates, and artists
CREATE INDEX IF NOT EXISTS idx_ct_venues_slug ON ct_venues(slug);
CREATE INDEX IF NOT EXISTS idx_ct_events_venue_id ON ct_events(venue_id);
CREATE INDEX IF NOT EXISTS idx_ct_events_slug ON ct_events(slug);
CREATE INDEX IF NOT EXISTS idx_ct_dates_date ON ct_dates(date);
CREATE INDEX IF NOT EXISTS idx_ct_dates_venue_id ON ct_dates(venue_id);
CREATE INDEX IF NOT EXISTS idx_ct_dates_event_id ON ct_dates(event_id);
CREATE INDEX IF NOT EXISTS idx_ct_artists_slug ON ct_artists(slug);
