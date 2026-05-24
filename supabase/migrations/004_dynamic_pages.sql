-- ============================================================
-- Ibiza mi vida — Migration 004: Dynamic Pages
-- ============================================================

CREATE TABLE IF NOT EXISTS dynamic_pages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  subtitle     TEXT,
  description  TEXT,
  hero_img     TEXT,
  eyebrow      TEXT,
  content      JSONB, -- Can hold structured content or sections
  published    BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE dynamic_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON dynamic_pages FOR SELECT USING (published = true);
CREATE POLICY "Admin all" ON dynamic_pages FOR ALL USING (auth.role() = 'authenticated');

-- Seed an example page
INSERT INTO dynamic_pages (slug, title, subtitle, eyebrow, published)
VALUES (
  'example-dynamic-page', 
  'Dynamic Page Example', 
  'This page is generated directly from the Supabase database.', 
  'New Feature',
  true
) ON CONFLICT (slug) DO NOTHING;
