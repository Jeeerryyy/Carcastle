const fs = require('fs');
const path = require('path');

const cars = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'carcastlegoa', 'data', 'cars.json'), 'utf8'));

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = `-- ==============================================================================
-- Car Castle Goa — Production Supabase Schema & Realtime Setup
-- Execute this script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Click "Run"
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create the cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  "categoryGroup" TEXT NOT NULL DEFAULT 'reg',
  "categoryLabel" TEXT NOT NULL DEFAULT '',
  "pricePerDay" INTEGER NOT NULL,
  price TEXT NOT NULL,
  "pricePerHour" INTEGER DEFAULT 0,
  seats TEXT NOT NULL DEFAULT '5 Seats',
  transmission TEXT NOT NULL DEFAULT 'Manual',
  fuel TEXT NOT NULL DEFAULT 'Petrol',
  year INTEGER DEFAULT 2024,
  mileage TEXT DEFAULT 'Unlimited km',
  features JSONB DEFAULT '[]'::jsonb,
  description TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  image TEXT NOT NULL,
  alt TEXT DEFAULT '',
  slug TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  ac TEXT DEFAULT 'Air Conditioning',
  status TEXT DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 99,
  "isArchived" BOOLEAN DEFAULT false,
  "archivedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for high-throughput queries
CREATE INDEX IF NOT EXISTS idx_cars_order ON public.cars ("order" ASC);
CREATE INDEX IF NOT EXISTS idx_cars_status ON public.cars (status);
CREATE INDEX IF NOT EXISTS idx_cars_category_group ON public.cars ("categoryGroup");
CREATE INDEX IF NOT EXISTS idx_cars_featured ON public.cars (featured);
CREATE INDEX IF NOT EXISTS idx_cars_slug ON public.cars (slug);

-- 4. Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id TEXT REFERENCES public.cars(id) ON DELETE SET NULL,
  car_name TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  pickup_date DATE,
  dropoff_date DATE,
  pickup_location TEXT,
  dropoff_location TEXT,
  status TEXT DEFAULT 'pending',
  total_price NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Configure Row Level Security (RLS)
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public Read Cars" ON public.cars;
DROP POLICY IF EXISTS "Allow All Cars Modifications" ON public.cars;
DROP POLICY IF EXISTS "Allow Public Insert Bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow Read Bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow Public Insert Contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow Read Contact" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow All Settings" ON public.site_settings;

-- Public read access for visitors
CREATE POLICY "Public Read Cars"
  ON public.cars FOR SELECT
  USING (true);

-- Full CRUD permissions for anon/authenticated API access
CREATE POLICY "Allow All Cars Modifications"
  ON public.cars FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow Public Insert Bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow Read Bookings"
  ON public.bookings FOR SELECT
  USING (true);

CREATE POLICY "Allow Public Insert Contact"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow Read Contact"
  ON public.contact_messages FOR SELECT
  USING (true);

CREATE POLICY "Allow All Settings"
  ON public.site_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- 8. Enable Supabase Realtime for instant WebSocket updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'cars'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cars;
  END IF;
END $$;

-- 9. Automatic UpdatedAt Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_cars_updated_at ON public.cars;
CREATE TRIGGER set_cars_updated_at
BEFORE UPDATE ON public.cars
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 10. Seed Initial Fleet Data (11 Vehicles)
`;

sql += `INSERT INTO public.cars (
  id, name, brand, category, "categoryGroup", "categoryLabel",
  "pricePerDay", price, "pricePerHour", seats, transmission, fuel,
  year, mileage, features, description, images, image, alt, slug,
  url, ac, status, featured, "order"
) VALUES\n`;

const values = cars.map(car => {
  return `  (
    ${escapeSql(car.id)},
    ${escapeSql(car.name)},
    ${escapeSql(car.brand)},
    ${escapeSql(car.category)},
    ${escapeSql(car.categoryGroup || 'reg')},
    ${escapeSql(car.categoryLabel || '')},
    ${car.pricePerDay || 1500},
    ${escapeSql(car.price || '1,500')},
    ${car.pricePerHour || 0},
    ${escapeSql(car.seats || '5 Seats')},
    ${escapeSql(car.transmission || 'Manual')},
    ${escapeSql(car.fuel || 'Petrol')},
    ${car.year || 2024},
    ${escapeSql(car.mileage || 'Unlimited km')},
    ${escapeSql(JSON.stringify(car.features || []))}::jsonb,
    ${escapeSql(car.description || '')},
    ${escapeSql(JSON.stringify(car.images || [car.image]))}::jsonb,
    ${escapeSql(car.image || 'images/default-car.webp')},
    ${escapeSql(car.alt || '')},
    ${escapeSql(car.slug)},
    ${escapeSql(car.url || `cars/${car.slug}.html`)},
    ${escapeSql(car.ac || 'Air Conditioning')},
    ${escapeSql(car.status || 'available')},
    ${car.featured ? 'true' : 'false'},
    ${car.order || 99}
  )`;
});

sql += values.join(',\n') + '\n';
sql += `ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  "categoryGroup" = EXCLUDED."categoryGroup",
  "categoryLabel" = EXCLUDED."categoryLabel",
  "pricePerDay" = EXCLUDED."pricePerDay",
  price = EXCLUDED.price,
  "pricePerHour" = EXCLUDED."pricePerHour",
  seats = EXCLUDED.seats,
  transmission = EXCLUDED.transmission,
  fuel = EXCLUDED.fuel,
  year = EXCLUDED.year,
  mileage = EXCLUDED.mileage,
  features = EXCLUDED.features,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  image = EXCLUDED.image,
  alt = EXCLUDED.alt,
  slug = EXCLUDED.slug,
  url = EXCLUDED.url,
  ac = EXCLUDED.ac,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  "order" = EXCLUDED."order",
  "updatedAt" = NOW();

-- End of Supabase Schema & Fleet Seed
`;

fs.mkdirSync(path.join(__dirname, '..', 'supabase'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'supabase', 'schema.sql'), sql, 'utf8');
fs.writeFileSync(path.join(__dirname, '..', 'schema.sql'), sql, 'utf8');
console.log('Successfully generated supabase/schema.sql and schema.sql!');
