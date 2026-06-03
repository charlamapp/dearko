-- Siparişler tablosu
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  -- pending | paid | preparing | shipped | delivered | cancelled
  total integer NOT NULL, -- kuruş cinsinden (₺320 = 32000)
  items jsonb NOT NULL DEFAULT '[]',
  -- [{ id, name, price, qty, image, weight? }]
  tracking_number text,
  tracking_carrier text DEFAULT 'Yurtiçi Kargo',
  shipping_address jsonb,
  -- { name, email, phone, address, city, zip }
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Kullanıcı profil tablosu (auth.users'ı genişletir)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  phone text,
  address text,
  city text,
  created_at timestamptz DEFAULT now()
);

-- Yeni kullanıcı kayıt olduğunda otomatik profil oluştur
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE orders  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi siparişlerini görebilir
CREATE POLICY "users_own_orders" ON orders
  FOR ALL USING (auth.uid() = user_id);

-- Kullanıcı sadece kendi profilini görebilir/düzenleyebilir
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Service role her şeyi görebilir (admin panel için)
CREATE POLICY "service_role_all_orders" ON orders
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_profiles" ON profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);
