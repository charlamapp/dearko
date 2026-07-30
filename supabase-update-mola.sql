-- Slide 1: Mola banner görseli
UPDATE site_content
SET data = jsonb_set(
  jsonb_set(data, '{0,image}', '"/mola.png"'),
  '{0,position}', '"center center"'
)
WHERE id = 'hero';

-- Kontrol
SELECT data->0->>'image' AS slide1 FROM site_content WHERE id = 'hero';
