-- Rezervasyonlar tablosu
CREATE TABLE IF NOT EXISTS reservations (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date         text NOT NULL,
  start_time   text NOT NULL,
  duration     integer NOT NULL,
  service      text NOT NULL,
  event_type   text NOT NULL,
  location     text NOT NULL,
  guest_count  text NOT NULL,
  notes        text,
  name         text NOT NULL,
  email        text NOT NULL,
  phone        text NOT NULL,
  company      text,
  status       text NOT NULL DEFAULT 'new',
  admin_notes  text,
  estimated_price integer,
  created_at   timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Herkese ekleme izni (form submit için auth gerekmez)
CREATE POLICY "anyone can insert reservations"
  ON reservations FOR INSERT
  WITH CHECK (true);

-- Service role okuyabilir
CREATE POLICY "service role can read reservations"
  ON reservations FOR SELECT
  USING (true);

CREATE POLICY "service role can update reservations"
  ON reservations FOR UPDATE
  USING (true);
