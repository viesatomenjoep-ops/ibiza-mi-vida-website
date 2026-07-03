-- 1:1 Mirror of Clubtickets API

-- 1. Venues (Clubs)
CREATE TABLE ct_venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id VARCHAR UNIQUE NOT NULL, -- e.g., '14'
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  picture VARCHAR,
  cover VARCHAR,
  whitelogo VARCHAR,
  is_day_club BOOLEAN DEFAULT false,
  type_id VARCHAR,
  type_slug VARCHAR,
  type_name VARCHAR,
  aff_link VARCHAR,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events (Event Groups, e.g., "Flower Power")
CREATE TABLE ct_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id VARCHAR UNIQUE NOT NULL, -- e.g., '2001'
  venue_id UUID REFERENCES ct_venues(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL,
  description TEXT,
  requirements TEXT,
  start_at TIME,
  start_at_next_day BOOLEAN DEFAULT false,
  end_is_defined BOOLEAN DEFAULT false,
  end_at TIME,
  end_at_next_day BOOLEAN DEFAULT false,
  logo VARCHAR,
  cover VARCHAR,
  whitelogo VARCHAR,
  aff_link VARCHAR,
  api_endpoint VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dates (Specific party days, e.g., "2026-07-25")
CREATE TABLE ct_dates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id VARCHAR UNIQUE NOT NULL, -- e.g., '5501'
  event_id UUID REFERENCES ct_events(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES ct_venues(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  date DATE NOT NULL,
  prices DECIMAL(10, 2), -- Extracted lowest price from "45 € - 350 €"
  raw_prices VARCHAR,
  raw_lineup VARCHAR, -- The original unparsed string
  aff_link VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Artists
CREATE TABLE ct_artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Date Artists (Many-to-Many between Dates and Artists)
CREATE TABLE ct_date_artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date_id UUID REFERENCES ct_dates(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES ct_artists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date_id, artist_id)
);

-- Grant Access (Service Role)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- Allow Anon Read (So Next.js can fetch public data without keys)
GRANT SELECT ON ct_venues TO anon, authenticated;
GRANT SELECT ON ct_events TO anon, authenticated;
GRANT SELECT ON ct_dates TO anon, authenticated;
GRANT SELECT ON ct_artists TO anon, authenticated;
GRANT SELECT ON ct_date_artists TO anon, authenticated;
