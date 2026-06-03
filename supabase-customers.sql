-- Mevcut profiles tablosunu sil (varsa)
DROP TABLE IF EXISTS profiles CASCADE;

-- Kapsamlı müşteri profili tablosu
CREATE TABLE profiles (
  id            uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,

  -- Kişisel bilgiler
  full_name     text,
  email         text,
  phone         text,

  -- Adres
  address       text,
  city          text,
  postal_code   text,
  country       text DEFAULT 'Türkiye',

  -- Kahve tercihleri
  default_grind text DEFAULT 'cekirdek',
  -- cekirdek | v60 | french-press | espresso | moka

  -- Pazarlama
  newsletter    boolean DEFAULT false,

  -- Admin notu
  notes         text,

  -- Otomatik
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Yeni kayıt → otomatik profil oluştur
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi profilini görür/düzenler
DROP POLICY IF EXISTS "users_own_profile" ON profiles;
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Admin her profili görebilir
DROP POLICY IF EXISTS "service_role_all_profiles" ON profiles;
CREATE POLICY "service_role_all_profiles" ON profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Siparişler tablosu (varsa yeniden oluştur)
CREATE TABLE IF NOT EXISTS orders (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id text UNIQUE,
  status            text NOT NULL DEFAULT 'pending',
  total             integer NOT NULL,
  items             jsonb NOT NULL DEFAULT '[]',
  tracking_number   text,
  tracking_carrier  text DEFAULT 'Yurtiçi Kargo',
  shipping_address  jsonb,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_orders" ON orders;
CREATE POLICY "users_own_orders" ON orders
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "service_role_all_orders" ON orders;
CREATE POLICY "service_role_all_orders" ON orders
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Özet view: müşteri + sipariş istatistikleri (admin için)
CREATE OR REPLACE VIEW customer_summary AS
SELECT
  p.id,
  p.full_name,
  p.email,
  p.phone,
  p.city,
  p.newsletter,
  p.default_grind,
  p.notes,
  p.created_at,
  COUNT(o.id)            AS order_count,
  COALESCE(SUM(o.total), 0) AS total_spent
FROM profiles p
LEFT JOIN orders o ON o.user_id = p.id AND o.status != 'cancelled'
GROUP BY p.id, p.full_name, p.email, p.phone, p.city,
         p.newsletter, p.default_grind, p.notes, p.created_at;
