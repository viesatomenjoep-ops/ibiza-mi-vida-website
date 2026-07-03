-- Add provider_id to clubs
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS provider_id INTEGER UNIQUE;

-- Add provider_id to events to link the exact Date ID from Clubtickets
ALTER TABLE events ADD COLUMN IF NOT EXISTS provider_id INTEGER UNIQUE;

-- We also might need to store the parent event ID from clubtickets (the "party" ID)
-- because Clubtickets separates Event (e.g. David Guetta) and Date (e.g. July 25th).
-- We'll store it as 'event_group_id'
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_group_id INTEGER;
