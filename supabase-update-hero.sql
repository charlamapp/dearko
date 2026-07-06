-- Slide 1: Unsplash kahve fotoğrafı (koyu, hero için uygun)
UPDATE site_content
SET data = jsonb_set(
  jsonb_set(data, '{0,image}', '"https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1800&q=90"'),
  '{0,position}', '"center 40%"'
)
WHERE id = 'hero';

-- Slide 3: DearKo araç görseli (Mobil Araç slaydı)
UPDATE site_content
SET data = jsonb_set(data, '{2,image}', '"/uploads/dearko-arac.png"')
WHERE id = 'hero';

-- Kontrol
SELECT
  data->0->>'image' AS slide1,
  data->2->>'image' AS slide3
FROM site_content WHERE id = 'hero';
