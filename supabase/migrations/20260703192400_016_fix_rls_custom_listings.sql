-- Migration: 016_fix_rls_custom_listings.sql
-- Allow anonymous inserts and updates for the admin dashboard since auth is not yet enforced

CREATE POLICY "Allow public insert on custom_listings" 
  ON custom_listings FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Allow public update on custom_listings" 
  ON custom_listings FOR UPDATE 
  TO public 
  USING (true);

CREATE POLICY "Allow public delete on custom_listings" 
  ON custom_listings FOR DELETE 
  TO public 
  USING (true);
