-- Create boat_charters table
CREATE TABLE boat_charters (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  type         TEXT,
  capacity     TEXT,
  length       TEXT,
  engine       TEXT,
  price_from   NUMERIC(10,2) NOT NULL,
  features     TEXT[] DEFAULT '{}'::TEXT[],
  image_url    TEXT,
  is_available BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE boat_charters ENABLE ROW LEVEL SECURITY;

-- Select policy: public read
CREATE POLICY "Allow public read access on boat_charters" 
  ON boat_charters FOR SELECT 
  TO public 
  USING (true);

-- Full access for service_role
CREATE POLICY "Allow service role full access on boat_charters" 
  ON boat_charters FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);
