-- Add columns to ct_artists for profile picture and venue residency
ALTER TABLE ct_artists ADD COLUMN IF NOT EXISTS image VARCHAR;
ALTER TABLE ct_artists ADD COLUMN IF NOT EXISTS venue_name VARCHAR;
ALTER TABLE ct_artists ADD COLUMN IF NOT EXISTS venue_slug VARCHAR;
