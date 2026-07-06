-- Hero slide 1 görselini güncelle
UPDATE site_content
SET data = jsonb_set(data, '{0,image}', '"/uploads/dearko-arac.png"')
WHERE id = 'hero';

-- Kontrol
SELECT data->0->>'image' AS slide1_image FROM site_content WHERE id = 'hero';
