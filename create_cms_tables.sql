CREATE TABLE IF NOT EXISTS page_contents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name    TEXT UNIQUE NOT NULL,
  hero_title   TEXT,
  hero_sub     TEXT,
  description  TEXT,
  cta_text     TEXT,
  hero_img     TEXT,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key          TEXT UNIQUE NOT NULL,
  value        TEXT NOT NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON page_contents FOR SELECT USING (true);
CREATE POLICY "Admin all" ON page_contents FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin all" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
