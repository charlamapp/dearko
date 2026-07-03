-- Pop-up ayarları (tek satır)
CREATE TABLE IF NOT EXISTS popup_settings (
  id            int PRIMARY KEY DEFAULT 1,
  enabled       boolean  DEFAULT true,
  headline      text     DEFAULT 'İlk Siparişinde %10 İndirim',
  description   text     DEFAULT 'Specialty kahve dünyasına adım at. İlk siparişinde bu kodu kullan, taze kavrum kapına gelsin.',
  discount_code text     DEFAULT 'HOSGELDIN10',
  discount_amount text   DEFAULT '%10',
  button_text   text     DEFAULT 'Kuponu Al',
  delay_seconds int      DEFAULT 4
);
INSERT INTO popup_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE popup_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read popup"       ON popup_settings FOR SELECT USING (true);
CREATE POLICY "service role update popup" ON popup_settings FOR ALL   USING (true);

-- E-posta aboneleri
CREATE TABLE IF NOT EXISTS subscribers (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email         text UNIQUE NOT NULL,
  source        text DEFAULT 'popup',
  discount_code text,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone insert subscriber"      ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "service role read subscribers" ON subscribers FOR SELECT USING (true);
