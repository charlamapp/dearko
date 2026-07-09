-- ─────────────────────────────────────────────────────────────────────────────
-- DEARKO GÜVENLİK YAMASI (Faz 1)
-- Supabase SQL Editor'de çalıştırın. Tamamı idempotent'tir: birden fazla kez
-- çalıştırılabilir, eksik tablolar otomatik oluşturulur, olmayanlar atlanır.
--
-- Kapatılan açıklar:
--   1. customer_summary view'i RLS'i bypass ediyordu → anon key ile tüm müşteri
--      adları / e-postaları / telefonları okunabiliyordu.
--   2. site_content, popup_settings, page_views üzerindeki "USING (true)"
--      politikaları TO service_role içermediği için HERKESE yazma izni
--      veriyordu (siteyi tahrif etme açığı).
--   3. subscribers SELECT politikası herkese açıktı → abone e-postaları sızıyordu.
--
-- Uygulama kodu bu tabloların hepsine yalnızca sunucu tarafındaki service-role
-- istemcileriyle erişir; anon erişimi gerekmez.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 0) Uygulamanın ihtiyaç duyduğu ama eksik olabilen tablolar ───────────────
--     (popup_settings ve subscribers olmadan pop-up ve bülten formu çalışmaz)

CREATE TABLE IF NOT EXISTS popup_settings (
  id              int PRIMARY KEY DEFAULT 1,
  enabled         boolean DEFAULT true,
  headline        text    DEFAULT 'İlk Siparişinde %10 İndirim',
  description     text    DEFAULT 'Specialty kahve dünyasına adım at. İlk siparişinde bu kodu kullan, taze kavrum kapına gelsin.',
  discount_code   text    DEFAULT 'HOSGELDIN10',
  discount_amount text    DEFAULT '%10',
  button_text     text    DEFAULT 'Kuponu Al',
  delay_seconds   int     DEFAULT 4
);
INSERT INTO popup_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS subscribers (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email         text UNIQUE NOT NULL,
  source        text DEFAULT 'popup',
  discount_code text,
  created_at    timestamptz DEFAULT now()
);

-- ── 1) customer_summary: view'in RLS bypass'ını kapat ───────────────────────
DO $$
BEGIN
  IF to_regclass('public.customer_summary') IS NOT NULL THEN
    EXECUTE 'ALTER VIEW public.customer_summary SET (security_invoker = true)';
    EXECUTE 'REVOKE ALL ON public.customer_summary FROM anon, authenticated';
  END IF;
END $$;

-- ── 2) site_content: herkes okur, yalnızca service_role yazar ───────────────
DO $$
BEGIN
  IF to_regclass('public.site_content') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "service_all" ON public.site_content';
    EXECUTE 'DROP POLICY IF EXISTS "public_read_content" ON public.site_content';
    EXECUTE 'DROP POLICY IF EXISTS "service_write_content" ON public.site_content';
    EXECUTE 'CREATE POLICY "public_read_content" ON public.site_content FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "service_write_content" ON public.site_content FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- ── 3) popup_settings: herkes okur, yalnızca service_role yazar ─────────────
ALTER TABLE popup_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read popup"        ON popup_settings;
DROP POLICY IF EXISTS "service role update popup" ON popup_settings;
DROP POLICY IF EXISTS "public_read_popup"        ON popup_settings;
DROP POLICY IF EXISTS "service_write_popup"      ON popup_settings;
CREATE POLICY "public_read_popup" ON popup_settings
  FOR SELECT USING (true);
CREATE POLICY "service_write_popup" ON popup_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 4) subscribers: yalnızca service_role okur/yazar ────────────────────────
--     (kayıtlar /api/popup/subscribe üzerinden service key ile yapılır)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone insert subscriber"      ON subscribers;
DROP POLICY IF EXISTS "service role read subscribers" ON subscribers;
DROP POLICY IF EXISTS "service_rw_subscribers"        ON subscribers;
CREATE POLICY "service_rw_subscribers" ON subscribers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 5) page_views: yalnızca service_role ────────────────────────────────────
DO $$
BEGIN
  IF to_regclass('public.page_views') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "service role full access" ON public.page_views';
    EXECUTE 'DROP POLICY IF EXISTS "service_rw_page_views" ON public.page_views';
    EXECUTE 'CREATE POLICY "service_rw_page_views" ON public.page_views FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- ── 6) reservations: insert yalnızca service_role ───────────────────────────
--     (form gönderimi /api/rezervasyon üzerinden service key ile yapılır)
DO $$
BEGIN
  IF to_regclass('public.reservations') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "anyone can insert reservations" ON public.reservations';
    EXECUTE 'DROP POLICY IF EXISTS "service_insert_reservations" ON public.reservations';
    EXECUTE 'CREATE POLICY "service_insert_reservations" ON public.reservations FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- ── 7) products: vitrin herkese açık okur, yazma service_role ───────────────
DO $$
BEGIN
  IF to_regclass('public.products') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.products ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "public_read_products" ON public.products';
    EXECUTE 'DROP POLICY IF EXISTS "service_write_products" ON public.products';
    EXECUTE 'CREATE POLICY "public_read_products" ON public.products FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "service_write_products" ON public.products FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;
