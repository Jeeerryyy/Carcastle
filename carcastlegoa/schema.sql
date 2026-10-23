-- ==============================================================================
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
INSERT INTO public.cars (
  id, name, brand, category, "categoryGroup", "categoryLabel",
  "pricePerDay", price, "pricePerHour", seats, transmission, fuel,
  year, mileage, features, description, images, image, alt, slug,
  url, ac, status, featured, "order"
) VALUES
  (
    'thar-4x4',
    'Mahindra Thar 4x4',
    'Mahindra',
    'SUV',
    'prem',
    'Premium 4x4 SUV',
    3500,
    '3,500',
    250,
    '4 Seats',
    'Automatic / 4x4',
    'Diesel',
    2024,
    'Unlimited km',
    '["Air Conditioning","4x4 Wheel Drive","Convertible Soft Top","Touchscreen Infotainment","Bluetooth & USB","Off-Road Suspension","Reverse Parking Sensors"]'::jsonb,
    'Goa''s most iconic rental vehicle. Experience coastal backroads, beach lanes, and scenic viewpoints with open-top freedom and dependable 4x4 power.',
    '["images/mahindra-thar-4x4.webp"]'::jsonb,
    'images/mahindra-thar-4x4.webp',
    'Mahindra Thar 4x4 self drive car rental in Goa',
    'mahindra-thar-rental-goa',
    'cars/mahindra-thar-rental-goa.html',
    'Air Conditioning',
    'available',
    true,
    1
  ),
  (
    'maruti-swift',
    'Maruti Suzuki Swift',
    'Maruti Suzuki',
    'Hatchback',
    'reg',
    'Popular Hatchback',
    1500,
    '1,500',
    120,
    '5 Seats',
    'Manual',
    'Petrol',
    2024,
    'Unlimited km',
    '["Air Conditioning","Power Steering","Bluetooth Music System","Dual Front Airbags","High Fuel Efficiency","Compact City Parking"]'::jsonb,
    'The top-choice economy rental in Goa. Nimble, highly fuel-efficient, and easy to park anywhere across Panjim and lively North Goa beach shacks.',
    '["images/maruti-suzuki-swift-zxi.webp"]'::jsonb,
    'images/maruti-suzuki-swift-zxi.webp',
    'Maruti Suzuki Swift self drive car rental in Goa',
    'maruti-swift-rental-goa',
    'cars/maruti-swift-rental-goa.html',
    'Air Conditioning',
    'available',
    true,
    2
  ),
  (
    'toyota-fortuner',
    'Toyota Fortuner 4x4',
    'Toyota',
    'SUV',
    'prem',
    'Luxury 7-Seater',
    5500,
    '5,500',
    450,
    '7 Seats',
    'Automatic',
    'Diesel',
    2024,
    'Unlimited km',
    '["Dual AC Climate Control","7 Full Adult Seats","4x4 Drive Mode","Leather Luxury Upholstery","Cruise Control","Touchscreen Navigation","Ample Luggage Capacity"]'::jsonb,
    'Commanding luxury SUV for family groups and executive VIP travelers. Unbeatable highway comfort with generous luggage space for Goa airport transfers.',
    '["images/toyota-fortuner-4x4.webp"]'::jsonb,
    'images/toyota-fortuner-4x4.webp',
    'Toyota Fortuner 4x4 luxury 7-seater self drive rental in Goa',
    'toyota-fortuner-rental-goa',
    'cars/toyota-fortuner-rental-goa.html',
    'Dual AC Climate Control',
    'available',
    true,
    3
  ),
  (
    'innova-crysta',
    'Toyota Innova Crysta',
    'Toyota',
    'MPV',
    'prem',
    'Executive MPV',
    3200,
    '3,200',
    240,
    '7 Seats',
    'Manual / Auto',
    'Diesel',
    2024,
    'Unlimited km',
    '["Dual Zone Air Conditioning","7 Captain Seats","Reclining Row Seating","Generous Luggage Boot","Smooth Highway Ride","Rear AC Vents"]'::jsonb,
    'The gold standard for family vacations in Goa. Smooth, supremely comfortable, and reliably air-conditioned across long sightseeing routes.',
    '["images/toyota-innova-crysta.webp"]'::jsonb,
    'images/toyota-innova-crysta.webp',
    'Toyota Innova Crysta 7-seater self drive car rental in Goa',
    'toyota-innova-crysta-rental-goa',
    'cars/toyota-innova-crysta-rental-goa.html',
    'Dual AC Climate Control',
    'available',
    true,
    4
  ),
  (
    'audi-a4',
    'Audi A4 Luxury Sedan',
    'Audi',
    'Luxury',
    'prem',
    'Luxury Sedan',
    6500,
    '6,500',
    550,
    '5 Seats',
    'Automatic',
    'Petrol',
    2024,
    'Unlimited km',
    '["Multi-Zone Climate Control","Sunroof / Moonroof","Audi Virtual Cockpit","Premium Leather Seats","Bang & Olufsen Sound System","Matrix LED Lighting"]'::jsonb,
    'Experience German luxury on Goan avenues. Perfect for weddings, corporate executives, and discerning couples seeking refined elegance.',
    '["images/audi-a4-sedan.webp"]'::jsonb,
    'images/audi-a4-sedan.webp',
    'Audi A4 luxury sedan self drive rental in Goa',
    'audi-a4-luxury-rental-goa',
    'cars/audi-a4-luxury-rental-goa.html',
    'Multi-Zone Climate',
    'available',
    true,
    5
  ),
  (
    'bmw-4-series',
    'BMW 4-Series Convertible',
    'BMW',
    'Convertible',
    'prem',
    'Convertible Luxury',
    7500,
    '7,500',
    650,
    '4 Seats',
    'Automatic',
    'Petrol',
    2024,
    'Unlimited km',
    '["Power Retractable Soft-Top","TwinPower Turbo Engine","Harman Kardon Audio","Sport Leather Seats","Dual Climate Control","Apple CarPlay & Android Auto"]'::jsonb,
    'The ultimate Goa luxury statement. Drop the roof, feel the Arabian Sea breeze, and cruise through coastal avenues in unforgettable style.',
    '["images/bmw-4-series-convertible.webp"]'::jsonb,
    'images/bmw-4-series-convertible.webp',
    'BMW 4-Series Convertible luxury car rental in Goa',
    'bmw-4-series-convertible-rental-goa',
    'cars/bmw-4-series-convertible-rental-goa.html',
    'Dual Climate AC',
    'available',
    true,
    6
  ),
  (
    'hyundai-creta',
    'Hyundai Creta SX',
    'Hyundai',
    'SUV',
    'prem',
    'Compact Premium SUV',
    2800,
    '2,800',
    220,
    '5 Seats',
    'Manual / Auto',
    'Petrol / Diesel',
    2024,
    'Unlimited km',
    '["Panoramic Sunroof","Wireless Smartphone Charging","10.25-inch Touchscreen","Ventilated Driver Seats","Bose Audio System","Rear Camera & Sensors"]'::jsonb,
    'India''s highest-selling premium compact SUV. Enjoy high seating, effortless ghat driving, and panoramic views of Goa''s green hills.',
    '["images/hyundai-creta-sx.webp"]'::jsonb,
    'images/hyundai-creta-sx.webp',
    'Hyundai Creta SX self drive SUV rental in Goa',
    'hyundai-creta-rental-goa',
    'cars/hyundai-creta-rental-goa.html',
    'Panoramic Climate Control',
    'available',
    true,
    7
  ),
  (
    'maruti-baleno',
    'Maruti Suzuki Baleno',
    'Maruti Suzuki',
    'Hatchback',
    'reg',
    'Premium Hatchback',
    1800,
    '1,800',
    140,
    '5 Seats',
    'Manual / Automatic',
    'Petrol',
    2024,
    'Unlimited km',
    '["Automatic Climate Control","Heads-Up Display (HUD)","360-Degree View Camera","SmartPlay Pro+ Audio","Generous Rear Legroom","LED Projector Headlamps"]'::jsonb,
    'Upgraded comfort in an efficient hatchback frame. Perfect for couples or small families wanting premium features and smooth automatic driving.',
    '["images/maruti-baleno-alpha.webp"]'::jsonb,
    'images/maruti-baleno-alpha.webp',
    'Maruti Suzuki Baleno Alpha premium hatchback self drive rental in Goa',
    'maruti-baleno-rental-goa',
    'cars/maruti-baleno-rental-goa.html',
    'Automatic Climate Control',
    'available',
    true,
    8
  ),
  (
    'maruti-ertiga',
    'Maruti Suzuki Ertiga',
    'Maruti Suzuki',
    'MPV',
    'reg',
    'Family 7-Seater',
    2400,
    '2,400',
    190,
    '7 Seats',
    'Manual / Automatic',
    'Petrol / Hybrid',
    2024,
    'Unlimited km',
    '["Roof-Mounted Rear AC Vents","Smart Hybrid Tech","Reclining Middle & Third Rows","Flexible Luggage Space","Touchscreen Music System","Air Cooled Cup Holders"]'::jsonb,
    'Unbeatable value for group holidays and large families visiting Goa. Comfortable 7-passenger capability with excellent fuel economy.',
    '["images/maruti-ertiga-zxi.webp"]'::jsonb,
    'images/maruti-ertiga-zxi.webp',
    'Maruti Suzuki Ertiga 7-seater self drive car rental in Goa',
    'maruti-ertiga-rental-goa',
    'cars/maruti-ertiga-rental-goa.html',
    'Rear AC Vents',
    'available',
    true,
    9
  ),
  (
    'hyundai-i20',
    'Hyundai i20 Asta',
    'Hyundai',
    'Hatchback',
    'reg',
    'Automatic Hatchback',
    1900,
    '1,900',
    150,
    '5 Seats',
    'Automatic',
    'Petrol',
    2024,
    'Unlimited km',
    '["Smooth Automatic Shift","Digital Cluster Display","Sunroof","Chilled Automatic Climate Control","Rear Parking Camera","Bose Sound System"]'::jsonb,
    'Stylish, contemporary hatchback with responsive steering and premium interior amenities. Easy to navigate through tight village lanes.',
    '["images/hyundai-i20-asta.webp"]'::jsonb,
    'images/hyundai-i20-asta.webp',
    'Hyundai i20 Asta automatic hatchback rental in Goa',
    'hyundai-i20-rental-goa',
    'cars/hyundai-i20-rental-goa.html',
    'Air Conditioning',
    'available',
    false,
    10
  ),
  (
    'kia-seltos',
    'Kia Seltos GTX',
    'Kia',
    'SUV',
    'prem',
    'Premium SUV',
    2900,
    '2,900',
    230,
    '5 Seats',
    'Automatic',
    'Diesel',
    2024,
    'Unlimited km',
    '["Panoramic Dual Sunroof","Ventilated Front Seats","ADAS Safety Suite","Diesel Torque Power","Leatherette Sport Seats","Ambient Mood Lighting"]'::jsonb,
    'Powerful diesel automatic SUV engineered for modern comfort. Ventilated seats keep you cool during warm beach afternoons.',
    '["images/kia-seltos-gtx.webp"]'::jsonb,
    'images/kia-seltos-gtx.webp',
    'Kia Seltos GTX diesel automatic SUV rental in Goa',
    'kia-seltos-rental-goa',
    'cars/kia-seltos-rental-goa.html',
    'Air Conditioning',
    'available',
    false,
    11
  )
ON CONFLICT (id) DO UPDATE SET
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
