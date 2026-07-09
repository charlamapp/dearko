-- ─────────────────────────────────────────────────────────────────────────────
-- ÜRÜN TABLOSU (Faz 1) — Supabase SQL Editor'de bir kez çalıştırın.
--
-- Neden: /api/products daha önce data/products.json dosyasına yazıyordu;
-- Vercel'in dosya sistemi kalıcı olmadığı için üründe yapılan değişiklikler
-- production'da kayboluyordu. Bu tablo oluşturulduğunda uygulama otomatik
-- olarak Supabase'i kullanır (lib/products.ts); tablo yoksa lokal JSON'a düşer.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id         text PRIMARY KEY,
  data       jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Vitrin herkese açık okur; yazma yalnızca service_role (admin API'leri).
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "service_write_products" ON products;
CREATE POLICY "service_write_products" ON products
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Mevcut katalog (data/products.json'dan aktarıldı)
INSERT INTO products (id, data) VALUES ('ethiopia-yirgacheffe', '{"name":"Etiyopya Yirgacheffe","category":"coffee","origin":"Etiyopya","region":"Yirgacheffe","process":"Yıkama","roast":"Açık Kavrum","flavor":["Bergamot","Şeftali","Çiçeksi"],"price":320,"weight":"250g","image":"/uploads/ethiopia.jpg","description":"Yirgacheffe''nin yüksek rakımlarında yetişen bu kahve, parlak asitliği ve çiçeksi aromalarıyla specialty dünyasının en ikonik tatlarından birini sunar."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('colombia-huila', '{"name":"Kolombiya Huila","category":"coffee","origin":"Kolombiya","region":"Huila","process":"Yıkama","roast":"Orta Kavrum","flavor":["Karamel","Fındık","Elma"],"price":290,"weight":"250g","image":"/uploads/colombia.jpg","description":"And Dağları''nın volkanik topraklarında küçük çiftçiler tarafından yetiştirilen bu kahve, dengeli yapısı ve tatlı bitimiyle her damağa hitap eder."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('guatemala-antigua', '{"name":"Guatemala Antigua","category":"coffee","origin":"Guatemala","region":"Antigua","process":"Doğal","roast":"Orta-Koyu","flavor":["Bitter Çikolata","Kahverengi Şeker","Tam Gövde"],"price":275,"weight":"250g","image":"/uploads/dearko-all.jpg","description":"Volkanik toprak ve serin iklimin armağanı olan bu kahve, tam gövdesi ve çikolata notalarıyla espresso sevenlerin favorisi."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('kenya-kiambu', '{"name":"Kenya Kiambu","category":"coffee","origin":"Kenya","region":"Kiambu","process":"Yıkama","roast":"Açık Kavrum","flavor":["Kırmızı Üzüm","Siyah Frenk Üzümü","Parlak Asit"],"price":345,"weight":"250g","image":"/uploads/dearko-all.jpg","description":"Kenya''nın SL-28 ve SL-34 çeşitlerinden oluşan bu seçki, karakteristik kırmızı meyve asitliği ve şarap benzeri karmaşıklığıyla benzersiz bir deneyim sunar."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('brazil-cerrado', '{"name":"Brezilya Cerrado","category":"coffee","origin":"Brezilya","region":"Cerrado","process":"Doğal","roast":"Orta Kavrum","flavor":["Fındık","Fıstık Ezmesi","Tatlı Kakao"],"price":245,"weight":"250g","image":"/uploads/brazil.jpg","description":"Klasik Brezilya karakteri: fındıksı, tatlı ve yumuşak asitliğiyle mükemmel bir günlük içecek."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('costa-rica-tarrazu', '{"name":"Kosta Rika Tarrazu","category":"coffee","origin":"Kosta Rika","region":"Tarrazu","process":"Bal","roast":"Açık-Orta","flavor":["Bal","Şeftali","Mandalina"],"price":310,"weight":"250g","image":"/uploads/dearko-all.jpg","description":"Bal işleme yöntemiyle hazırlanan bu kahve, meyvemsi tatlılık ve hafif asitliğin mükemmel dengesini yakalar."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('portable-coffee-maker', '{"name":"Portable Coffee Maker","category":"equipment","brand":"DearKo","price":890,"image":"/uploads/portable-coffee-maker.png","images":["/uploads/portable-coffee-maker.png","/uploads/portable-coffee-maker-2.png"],"video":"/uploads/portable-coffee-maker.mp4","description":"Nereye gidersen git, kaliteli kahveni yanında götür. Kompakt tasarımı ve güçlü basınç mekanizmasıyla seyahatte de barista kalitesinde espresso."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('hario-v60', '{"name":"Hario V60 Seramik","category":"equipment","brand":"Hario","price":420,"image":"https://images.unsplash.com/photo-1598908314732-07113901949e?w=800&q=85","description":"Japon el yapımı seramik dripper. Spiral yivleri ve geniş deliğiyle akış hızını tam kontrol altında tutar."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('chemex-6-cup', '{"name":"Chemex 6 Fincan","category":"equipment","brand":"Chemex","price":680,"image":"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=85","description":"1941''den bu yana değişmeyen ikonik tasarım. Temiz ve berrak bir fincan için tercih."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('comandante-c40', '{"name":"Comandante C40","category":"equipment","brand":"Comandante","price":3200,"image":"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=85","description":"El değirmenlerinin Rolls-Royce''u. Nitro Blade çelik bıçakları ile mükemmel tutarlı öğütme."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, data) VALUES ('fellow-stagg-kettle', '{"name":"Fellow Stagg EKG","category":"equipment","brand":"Fellow","price":2400,"image":"https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=85","description":"0.1°C hassasiyetinde sıcaklık kontrolü. İnce gaga ve PID kontrolör ile pour-over için tasarlandı."}'::jsonb)
  ON CONFLICT (id) DO NOTHING;
