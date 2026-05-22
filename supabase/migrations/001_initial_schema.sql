-- ============================================================
-- Ibiza mi vida — Initial Schema Migration
-- Run this in your Supabase SQL editor or via Supabase CLI
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE booking_leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name   TEXT NOT NULL,
  last_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  service_type TEXT NOT NULL,
  service_name TEXT,
  arrival_date DATE,
  message      TEXT,
  source_page  TEXT,
  utm_source   TEXT,
  utm_medium   TEXT,
  utm_campaign TEXT,
  status       TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','booked','lost'))
);

CREATE TABLE clubs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  tagline      TEXT,
  description  TEXT,
  image_url    TEXT,
  logo_url     TEXT,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('promoter_link','whatsapp')),
  promoter_url TEXT,
  location     TEXT,
  capacity     INTEGER,
  music_genre  TEXT,
  active       BOOLEAN DEFAULT TRUE,
  sort_order   INTEGER DEFAULT 0
);

CREATE TABLE events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  club_id      UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  description  TEXT,
  image_url    TEXT,
  event_date   DATE NOT NULL,
  doors_open   TIME,
  price_from   NUMERIC(10,2),
  currency     TEXT DEFAULT 'EUR',
  lineup       TEXT[],
  genre_tags   TEXT[],
  booking_type TEXT NOT NULL CHECK (booking_type IN ('promoter_link','whatsapp')),
  promoter_url TEXT,
  sold_out     BOOLEAN DEFAULT FALSE,
  featured     BOOLEAN DEFAULT FALSE,
  published    BOOLEAN DEFAULT FALSE
);

CREATE TABLE experiences (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug         TEXT UNIQUE NOT NULL,
  category     TEXT NOT NULL CHECK (category IN ('boat-charter','club-ticket','boat-party','catamaran','formentera','car-rental')),
  title        TEXT NOT NULL,
  tagline      TEXT,
  description  TEXT,
  image_url    TEXT,
  price_from   NUMERIC(10,2),
  currency     TEXT DEFAULT 'EUR',
  duration     TEXT,
  capacity     INTEGER,
  available    BOOLEAN DEFAULT TRUE,
  featured     BOOLEAN DEFAULT FALSE,
  sort_order   INTEGER DEFAULT 0
);

CREATE TABLE blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  cover_image  TEXT,
  category     TEXT CHECK (category IN ('tips','guides','nightlife','boats')),
  published    BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ
);

CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body          TEXT,
  verified      BOOLEAN DEFAULT FALSE,
  published     BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE booking_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert" ON booking_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin select" ON booking_leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON booking_leads FOR UPDATE USING (auth.role() = 'authenticated');

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON clubs FOR SELECT USING (active = true);
CREATE POLICY "Admin all"   ON clubs FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON events FOR SELECT USING (published = true);
CREATE POLICY "Admin all"   ON events FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON experiences FOR SELECT USING (available = true);
CREATE POLICY "Admin all"   ON experiences FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admin all"   ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON reviews FOR SELECT USING (published = true AND verified = true);
CREATE POLICY "Admin all"   ON reviews FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — 14 Clubs
-- ============================================================

INSERT INTO clubs (slug, name, tagline, booking_type, promoter_url, location, music_genre, sort_order) VALUES
  ('amnesia',      'Amnesia',      'Underground legends since 1976',       'promoter_link', 'https://amnesia.es',     'Carretera Ibiza-Sant Antoni, Ibiza', 'House, Techno',         1),
  ('pacha',        'Pacha Ibiza',  'The original Ibiza super-club',        'promoter_link', 'https://pacha.com',      'Passeig Marítim, Ibiza Town',        'House, Disco',          2),
  ('hi-ibiza',     'Hi Ibiza',     'Ibiza''s most awarded club',           'whatsapp',      NULL,                     'Platja d''en Bossa, Ibiza',           'Techno, House',         3),
  ('ushaia',       'Ushaia Ibiza', 'The open-air beach club experience',   'whatsapp',      NULL,                     'Platja d''en Bossa, Ibiza',           'House, Commercial',     4),
  ('universe',     'Universe',     'Iconic open-air parties',              'whatsapp',      NULL,                     'San Rafael, Ibiza',                   'House, Techno',         5),
  ('o-beach',      'O Beach Ibiza','Pool parties done properly',           'whatsapp',      NULL,                     'San Antonio, Ibiza',                  'Commercial, House',     6),
  ('ibiza-rocks',  'Ibiza Rocks',  'Live music meets nightlife',           'whatsapp',      NULL,                     'San Antonio, Ibiza',                  'Rock, Pop, Commercial', 7),
  ('es-paradis',   'Es Paradis',   'The most beautiful club in Ibiza',     'whatsapp',      NULL,                     'San Antonio, Ibiza',                  'House, Electronic',     8),
  ('eden',         'Eden Ibiza',   'San Antonio''s biggest club',          'whatsapp',      NULL,                     'San Antonio, Ibiza',                  'House, Techno',         9),
  ('playa-soleil', 'Playa Soleil', 'Sunset beach vibes',                  'whatsapp',      NULL,                     'San Antonio Bay, Ibiza',              'Chill, Commercial',     10),
  ('bam-bu-ku',    'Bam-Bu-Ku',   'Bohemian jungle parties',              'whatsapp',      NULL,                     'San Antonio, Ibiza',                  'House, World',          11),
  ('chinois',      'Chinois',      'Oriental glamour and house music',     'whatsapp',      NULL,                     'Ibiza Town',                          'House, Commercial',     12),
  ('528-ibiza',    '528 Ibiza',    'Healing frequencies & good vibes',    'whatsapp',      NULL,                     'Ibiza',                               'Conscious, House',      13),
  ('swag-ibiza',   'Swag Ibiza',   'Underground sessions',                 'whatsapp',      NULL,                     'Ibiza',                               'Techno, Minimal',       14),
  ('lio',          'Lío Ibiza',    'Cabaret, dinner and dancing',          'whatsapp',      NULL,                     'Marina Botafoch, Ibiza Town',         'Commercial, Latin',     15);
