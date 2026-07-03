-- Migration: 015_create_custom_listings.sql
-- Unified table for all custom categories managed in the admin dashboard

CREATE TABLE IF NOT EXISTS custom_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_from NUMERIC(10,2),
  image_url TEXT,
  features TEXT[] DEFAULT '{}'::TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE custom_listings ENABLE ROW LEVEL SECURITY;

-- Select policy: public read
CREATE POLICY "Allow public read access on custom_listings" 
  ON custom_listings FOR SELECT 
  TO public 
  USING (true);

-- Full access for service_role and authenticated users
CREATE POLICY "Allow admin full access on custom_listings" 
  ON custom_listings FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_listings_modtime
BEFORE UPDATE ON custom_listings
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
