-- ─────────────────────────────────────────────────────────────────────────────
-- GÜVENLİK YAMASI (Faz 1) — Supabase SQL Editor'de bir kez çalıştırın.
--
-- Kapatılan açıklar:
--   1. customer_summary view'i RLS'i bypass ediyordu → anon key ile tüm
--      müşteri adları/e-postaları/telefonları okunabiliyordu.
--   2. site_content, popup_settings, page_views üzerindeki "USING (true)"
--      politikaları TO service_role içermediği için HERKESE yazma izni
--      veriyordu (siteyi tahrif etme açığı).
--   3. subscribers SELECT politikası herkese açıktı → abone e-postaları
--      sızıyordu.
--
-- Uygulama kodu artık tüm bu tablolara yalnızca sunucu tarafındaki
-- service-role istemcileriyle erişiyor; anon erişimi gerekmiyor.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) customer_summary: view RLS bypass'ını kapat
ALTER VIEW customer_summary SET (security_invoker = true);
REVOKE ALL ON customer_summary FROM anon, authenticated;

-- 2) site_content: herkes okur, yalnızca service_role yazar
DROP POLICY IF EXISTS "service_all" ON site_content;
DROP POLICY IF EXISTS "public_read_content" ON site_content;
DROP POLICY IF EXISTS "service_write_content" ON site_content;
CREATE POLICY "public_read_content" ON site_content
  FOR SELECT USING (true);
CREATE POLICY "service_write_content" ON site_content
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3) popup_settings: herkes okur, yalnızca service_role yazar
DROP POLICY IF EXISTS "service role update popup" ON popup_settings;
DROP POLICY IF EXISTS "service_write_popup" ON popup_settings;
CREATE POLICY "service_write_popup" ON popup_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);
-- ("public read popup" politikası kalıyor — popup içeriği zaten herkese açık.)

-- 4) subscribers: yalnızca service_role okur/yazar
--    (kayıtlar /api/popup/subscribe üzerinden service key ile yapılıyor)
DROP POLICY IF EXISTS "anyone insert subscriber" ON subscribers;
DROP POLICY IF EXISTS "service role read subscribers" ON subscribers;
DROP POLICY IF EXISTS "service_rw_subscribers" ON subscribers;
CREATE POLICY "service_rw_subscribers" ON subscribers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 5) page_views: yalnızca service_role
DROP POLICY IF EXISTS "service role full access" ON page_views;
DROP POLICY IF EXISTS "service_rw_page_views" ON page_views;
CREATE POLICY "service_rw_page_views" ON page_views
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 6) reservations: insert yalnızca service_role
--    (form gönderimi /api/rezervasyon üzerinden service key ile yapılıyor)
DROP POLICY IF EXISTS "anyone can insert reservations" ON reservations;
DROP POLICY IF EXISTS "service_insert_reservations" ON reservations;
CREATE POLICY "service_insert_reservations" ON reservations
  FOR INSERT TO service_role WITH CHECK (true);
