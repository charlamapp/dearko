-- Ziyaretçi takip tablosu
CREATE TABLE IF NOT EXISTS page_views (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  country    text,         -- "TR", "US", vb.
  country_name text,       -- "Turkey", "United States"
  city       text,
  lat        numeric,
  lng        numeric,
  page       text,         -- "/magazin", "/" vb.
  created_at timestamptz DEFAULT now()
);

-- RLS — sadece service role yazabilir/okuyabilir
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role full access"
  ON page_views FOR ALL
  USING (true)
  WITH CHECK (true);

-- Eski kayıtları temizleyen index (30 günden eski)
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS page_views_country_idx ON page_views (country);
