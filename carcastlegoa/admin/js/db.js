/**
 * Car Castle Goa - Database & Cloudinary Storage Module
 * Manages all Supabase CRUD operations, local storage fallbacks,
 * fleet migration, and Cloudinary image uploads.
 */

import { 
  isSupabaseConfigured, 
  getSupabaseClient, 
  getCloudinaryConfig, 
  isCloudinaryConfigured 
} from './supabase-config.js';

const LOCAL_STORAGE_CARS_KEY = 'carcastle_local_cars';

/**
 * Standard default fleet data for seed migration & local fallback
 */
export const defaultFleetSeed = [
  {
    id: "thar-4x4",
    name: "Mahindra Thar 4x4",
    brand: "Mahindra",
    category: "SUV",
    categoryGroup: "prem",
    categoryLabel: "Premium 4x4 SUV",
    pricePerDay: 3500,
    price: "3,500",
    pricePerHour: 250,
    seats: "4 Seats",
    transmission: "Automatic / 4x4",
    fuel: "Diesel",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Air Conditioning",
      "4x4 Wheel Drive",
      "Convertible Soft Top",
      "Touchscreen Infotainment",
      "Bluetooth & USB",
      "Off-Road Suspension",
      "Reverse Parking Sensors"
    ],
    description: "Goa's most iconic rental vehicle. Experience coastal backroads, beach lanes, and scenic viewpoints with open-top freedom and dependable 4x4 power.",
    images: ["images/mahindra-thar-4x4.webp"],
    image: "images/mahindra-thar-4x4.webp",
    alt: "Mahindra Thar 4x4 self drive car rental in Goa",
    slug: "mahindra-thar-rental-goa",
    url: "cars/mahindra-thar-rental-goa.html",
    ac: "Air Conditioning",
    status: "available",
    featured: true,
    order: 1
  },
  {
    id: "maruti-swift",
    name: "Maruti Suzuki Swift",
    brand: "Maruti Suzuki",
    category: "Hatchback",
    categoryGroup: "reg",
    categoryLabel: "Popular Hatchback",
    pricePerDay: 1500,
    price: "1,500",
    pricePerHour: 120,
    seats: "5 Seats",
    transmission: "Manual",
    fuel: "Petrol",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Air Conditioning",
      "Power Steering",
      "Bluetooth Music System",
      "Dual Front Airbags",
      "High Fuel Efficiency",
      "Compact City Parking"
    ],
    description: "The top-choice economy rental in Goa. Nimble, highly fuel-efficient, and easy to park anywhere across Panjim and lively North Goa beach shacks.",
    images: ["images/maruti-suzuki-swift-zxi.webp"],
    image: "images/maruti-suzuki-swift-zxi.webp",
    alt: "Maruti Suzuki Swift self drive car rental in Goa",
    slug: "maruti-swift-rental-goa",
    url: "cars/maruti-swift-rental-goa.html",
    ac: "Air Conditioning",
    status: "available",
    featured: true,
    order: 2
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner 4x4",
    brand: "Toyota",
    category: "SUV",
    categoryGroup: "prem",
    categoryLabel: "Luxury 7-Seater",
    pricePerDay: 5500,
    price: "5,500",
    pricePerHour: 450,
    seats: "7 Seats",
    transmission: "Automatic",
    fuel: "Diesel",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Dual AC Climate Control",
      "7 Full Adult Seats",
      "4x4 Drive Mode",
      "Leather Luxury Upholstery",
      "Cruise Control",
      "Touchscreen Navigation",
      "Ample Luggage Capacity"
    ],
    description: "Commanding luxury SUV for family groups and executive VIP travelers. Unbeatable highway comfort with generous luggage space for Goa airport transfers.",
    images: ["images/toyota-fortuner-4x4.webp"],
    image: "images/toyota-fortuner-4x4.webp",
    alt: "Toyota Fortuner 4x4 luxury 7-seater self drive rental in Goa",
    slug: "toyota-fortuner-rental-goa",
    url: "cars/toyota-fortuner-rental-goa.html",
    ac: "Dual AC Climate Control",
    status: "available",
    featured: true,
    order: 3
  },
  {
    id: "innova-crysta",
    name: "Toyota Innova Crysta",
    brand: "Toyota",
    category: "MPV",
    categoryGroup: "prem",
    categoryLabel: "Executive MPV",
    pricePerDay: 3200,
    price: "3,200",
    pricePerHour: 240,
    seats: "7 Seats",
    transmission: "Manual / Auto",
    fuel: "Diesel",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Dual Zone Air Conditioning",
      "7 Captain Seats",
      "Reclining Row Seating",
      "Generous Luggage Boot",
      "Smooth Highway Ride",
      "Rear AC Vents"
    ],
    description: "The gold standard for family vacations in Goa. Smooth, supremely comfortable, and reliably air-conditioned across long sightseeing routes.",
    images: ["images/toyota-innova-crysta.webp"],
    image: "images/toyota-innova-crysta.webp",
    alt: "Toyota Innova Crysta 7-seater self drive car rental in Goa",
    slug: "toyota-innova-crysta-rental-goa",
    url: "cars/toyota-innova-crysta-rental-goa.html",
    ac: "Dual AC Climate Control",
    status: "available",
    featured: true,
    order: 4
  },
  {
    id: "audi-a4",
    name: "Audi A4 Luxury Sedan",
    brand: "Audi",
    category: "Luxury",
    categoryGroup: "prem",
    categoryLabel: "Luxury Sedan",
    pricePerDay: 6500,
    price: "6,500",
    pricePerHour: 550,
    seats: "5 Seats",
    transmission: "Automatic",
    fuel: "Petrol",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Multi-Zone Climate Control",
      "Sunroof / Moonroof",
      "Audi Virtual Cockpit",
      "Premium Leather Seats",
      "Bang & Olufsen Sound System",
      "Matrix LED Lighting"
    ],
    description: "Experience German luxury on Goan avenues. Perfect for weddings, corporate executives, and discerning couples seeking refined elegance.",
    images: ["images/audi-a4-sedan.webp"],
    image: "images/audi-a4-sedan.webp",
    alt: "Audi A4 luxury sedan self drive rental in Goa",
    slug: "audi-a4-luxury-rental-goa",
    url: "cars/audi-a4-luxury-rental-goa.html",
    ac: "Multi-Zone Climate",
    status: "available",
    featured: true,
    order: 5
  },
  {
    id: "bmw-4-series",
    name: "BMW 4-Series Convertible",
    brand: "BMW",
    category: "Convertible",
    categoryGroup: "prem",
    categoryLabel: "Convertible Luxury",
    pricePerDay: 7500,
    price: "7,500",
    pricePerHour: 650,
    seats: "4 Seats",
    transmission: "Automatic",
    fuel: "Petrol",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Power Retractable Soft-Top",
      "TwinPower Turbo Engine",
      "Harman Kardon Audio",
      "Sport Leather Seats",
      "Dual Climate Control",
      "Apple CarPlay & Android Auto"
    ],
    description: "The ultimate Goa luxury statement. Drop the roof, feel the Arabian Sea breeze, and cruise through coastal avenues in unforgettable style.",
    images: ["images/bmw-4-series-convertible.webp"],
    image: "images/bmw-4-series-convertible.webp",
    alt: "BMW 4-Series Convertible luxury car rental in Goa",
    slug: "bmw-4-series-convertible-rental-goa",
    url: "cars/bmw-4-series-convertible-rental-goa.html",
    ac: "Dual Climate AC",
    status: "available",
    featured: true,
    order: 6
  },
  {
    id: "hyundai-creta",
    name: "Hyundai Creta SX",
    brand: "Hyundai",
    category: "SUV",
    categoryGroup: "prem",
    categoryLabel: "Compact Premium SUV",
    pricePerDay: 2800,
    price: "2,800",
    pricePerHour: 220,
    seats: "5 Seats",
    transmission: "Manual / Auto",
    fuel: "Petrol / Diesel",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Panoramic Sunroof",
      "Wireless Smartphone Charging",
      "10.25-inch Touchscreen",
      "Ventilated Driver Seats",
      "Bose Audio System",
      "Rear Camera & Sensors"
    ],
    description: "India's highest-selling premium compact SUV. Enjoy high seating, effortless ghat driving, and panoramic views of Goa's green hills.",
    images: ["images/hyundai-creta-sx.webp"],
    image: "images/hyundai-creta-sx.webp",
    alt: "Hyundai Creta SX self drive SUV rental in Goa",
    slug: "hyundai-creta-rental-goa",
    url: "cars/hyundai-creta-rental-goa.html",
    ac: "Panoramic Climate Control",
    status: "available",
    featured: true,
    order: 7
  },
  {
    id: "maruti-baleno",
    name: "Maruti Suzuki Baleno",
    brand: "Maruti Suzuki",
    category: "Hatchback",
    categoryGroup: "reg",
    categoryLabel: "Premium Hatchback",
    pricePerDay: 1800,
    price: "1,800",
    pricePerHour: 140,
    seats: "5 Seats",
    transmission: "Manual / Automatic",
    fuel: "Petrol",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Automatic Climate Control",
      "Heads-Up Display (HUD)",
      "360-Degree View Camera",
      "SmartPlay Pro+ Audio",
      "Generous Rear Legroom",
      "LED Projector Headlamps"
    ],
    description: "Upgraded comfort in an efficient hatchback frame. Perfect for couples or small families wanting premium features and smooth automatic driving.",
    images: ["images/maruti-baleno-alpha.webp"],
    image: "images/maruti-baleno-alpha.webp",
    alt: "Maruti Suzuki Baleno Alpha premium hatchback self drive rental in Goa",
    slug: "maruti-baleno-rental-goa",
    url: "cars/maruti-baleno-rental-goa.html",
    ac: "Automatic Climate Control",
    status: "available",
    featured: true,
    order: 8
  },
  {
    id: "maruti-ertiga",
    name: "Maruti Suzuki Ertiga",
    brand: "Maruti Suzuki",
    category: "MPV",
    categoryGroup: "reg",
    categoryLabel: "Family 7-Seater",
    pricePerDay: 2400,
    price: "2,400",
    pricePerHour: 190,
    seats: "7 Seats",
    transmission: "Manual / Automatic",
    fuel: "Petrol / Hybrid",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Roof-Mounted Rear AC Vents",
      "Smart Hybrid Tech",
      "Reclining Middle & Third Rows",
      "Flexible Luggage Space",
      "Touchscreen Music System",
      "Air Cooled Cup Holders"
    ],
    description: "Unbeatable value for group holidays and large families visiting Goa. Comfortable 7-passenger capability with excellent fuel economy.",
    images: ["images/maruti-ertiga-zxi.webp"],
    image: "images/maruti-ertiga-zxi.webp",
    alt: "Maruti Suzuki Ertiga 7-seater self drive car rental in Goa",
    slug: "maruti-ertiga-rental-goa",
    url: "cars/maruti-ertiga-rental-goa.html",
    ac: "Rear AC Vents",
    status: "available",
    featured: true,
    order: 9
  },
  {
    id: "hyundai-i20",
    name: "Hyundai i20 Asta",
    brand: "Hyundai",
    category: "Hatchback",
    categoryGroup: "reg",
    categoryLabel: "Automatic Hatchback",
    pricePerDay: 1900,
    price: "1,900",
    pricePerHour: 150,
    seats: "5 Seats",
    transmission: "Automatic",
    fuel: "Petrol",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Smooth Automatic Shift",
      "Digital Cluster Display",
      "Sunroof",
      "Chilled Automatic Climate Control",
      "Rear Parking Camera",
      "Bose Sound System"
    ],
    description: "Stylish, contemporary hatchback with responsive steering and premium interior amenities. Easy to navigate through tight village lanes.",
    images: ["images/hyundai-i20-asta.webp"],
    image: "images/hyundai-i20-asta.webp",
    alt: "Hyundai i20 Asta automatic hatchback rental in Goa",
    slug: "hyundai-i20-rental-goa",
    url: "cars/hyundai-i20-rental-goa.html",
    ac: "Air Conditioning",
    status: "available",
    featured: false,
    order: 10
  },
  {
    id: "kia-seltos",
    name: "Kia Seltos GTX",
    brand: "Kia",
    category: "SUV",
    categoryGroup: "prem",
    categoryLabel: "Premium SUV",
    pricePerDay: 2900,
    price: "2,900",
    pricePerHour: 230,
    seats: "5 Seats",
    transmission: "Automatic",
    fuel: "Diesel",
    year: 2024,
    mileage: "Unlimited km",
    features: [
      "Panoramic Dual Sunroof",
      "Ventilated Front Seats",
      "ADAS Safety Suite",
      "Diesel Torque Power",
      "Leatherette Sport Seats",
      "Ambient Mood Lighting"
    ],
    description: "Powerful diesel automatic SUV engineered for modern comfort. Ventilated seats keep you cool during warm beach afternoons.",
    images: ["images/kia-seltos-gtx.webp"],
    image: "images/kia-seltos-gtx.webp",
    alt: "Kia Seltos GTX diesel automatic SUV rental in Goa",
    slug: "kia-seltos-rental-goa",
    url: "cars/kia-seltos-rental-goa.html",
    ac: "Air Conditioning",
    status: "available",
    featured: false,
    order: 11
  }
];

/**
 * Active in-memory subscribers for fleet updates
 */
const localSubscribers = new Set();

/**
 * Notify all subscribers of updated car fleet and sync across tabs
 */
export function notifySubscribers(cars) {
  localSubscribers.forEach(cb => {
    try {
      cb(cars);
    } catch (err) {
      console.error("Local fleet subscriber error:", err);
    }
  });

  // Cross-tab broadcast via custom event
  try {
    window.dispatchEvent(new CustomEvent('carcastle:fleet-updated', { detail: { cars } }));
  } catch (e) {
    // Ignore in non-browser envs
  }
}

/**
 * Get fallback cars from localStorage (used on localhost or offline)
 */
export function getLocalFallbackCars() {
  const stored = localStorage.getItem(LOCAL_STORAGE_CARS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse local cars cache", e);
    }
  }
  // Initialize and persist default fleet
  saveLocalFallbackCars(defaultFleetSeed);
  return [...defaultFleetSeed];
}

/**
 * Save cars to local fallback cache
 */
export function saveLocalFallbackCars(cars) {
  try {
    const serialized = JSON.stringify(cars);
    localStorage.setItem(LOCAL_STORAGE_CARS_KEY, serialized);
  } catch (err) {
    console.error("LocalStorage write failed:", err);
  }

  // Cross-tab broadcast via BroadcastChannel (0ms latency, zero-copy across tabs)
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('carcastle_fleet_sync');
      bc.postMessage({ type: 'FLEET_UPDATED', fleet: cars });
      bc.close();
    }
  } catch (e) {}

  // Persist directly to server /api/cars (saves to cars.json & broadcasts live SSE to all open tabs)
  try {
    if (typeof fetch === 'function') {
      fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fleet: cars })
      }).catch(() => {
        // Quiet fail if in offline/static environment
      });
    }
  } catch (e) {}
}

/**
 * Realtime subscription to the cars collection
 * @param {Function} onCarsUpdate - callback receiving cars array
 * @param {Function} onError - error callback
 * @returns {Function} unsubscribe function
 */
export function subscribeCars(onCarsUpdate, onError) {
  localSubscribers.add(onCarsUpdate);

  // Deliver local cache immediately (0ms latency, works on localhost instantly)
  const localCars = getLocalFallbackCars();
  onCarsUpdate(localCars);

  // Asynchronously synchronize with server /api/cars if available
  if (typeof fetch === 'function') {
    fetch('/api/cars')
      .then(res => res.ok ? res.json() : null)
      .then(serverFleet => {
        if (Array.isArray(serverFleet) && serverFleet.length > 0) {
          try {
            localStorage.setItem(LOCAL_STORAGE_CARS_KEY, JSON.stringify(serverFleet));
          } catch (e) {}
          onCarsUpdate(serverFleet);
        }
      })
      .catch(() => {});
  }

  if (!isSupabaseConfigured()) {
    return () => {
      localSubscribers.delete(onCarsUpdate);
    };
  }

  let isSubscribed = true;

  // Asynchronously synchronize with Supabase
  getSupabaseClient().then(async (client) => {
    if (!client || !isSubscribed) return;

    try {
      const { data, error } = await client
        .from('cars')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.warn('Supabase fetch error:', error);
        if (onError) onError(error);
        return;
      }

      if (Array.isArray(data) && data.length > 0 && isSubscribed) {
        saveLocalFallbackCars(data);
        onCarsUpdate(data);
      }
    } catch (err) {
      console.warn('Supabase sync failure (using local fallback):', err);
      if (onError) onError(err);
    }
  });

  return () => {
    isSubscribed = false;
    localSubscribers.delete(onCarsUpdate);
  };
}

/**
 * Add a new car to Supabase / Local Storage
 */
export async function addCar(carData) {
  const sanitized = sanitizeCarData(carData);
  sanitized.createdAt = new Date().toISOString();
  sanitized.updatedAt = new Date().toISOString();

  // Save to local storage cache immediately (newest at top)
  const localCars = getLocalFallbackCars();
  const newId = 'car-' + Date.now();
  const newCar = { id: newId, ...sanitized };
  localCars.unshift(newCar);
  saveLocalFallbackCars(localCars);
  notifySubscribers(localCars);

  if (isSupabaseConfigured()) {
    try {
      const client = await getSupabaseClient();
      if (client) {
        const { error } = await client.from('cars').insert([newCar]);
        if (error) {
          console.warn('Supabase addCar warning (saved locally):', error);
        }
      }
    } catch (e) {
      console.warn('Supabase addCar error (saved locally):', e);
    }
  }

  return newId;
}

/**
 * Update an existing car in Supabase / Local Storage
 */
export async function updateCar(id, carData) {
  const localCars = getLocalFallbackCars();
  const index = localCars.findIndex(c => String(c.id) === String(id));
  if (index === -1) return;

  // Merge existing vehicle attributes with partial updates before sanitizing
  const merged = { ...localCars[index], ...carData };
  const sanitized = sanitizeCarData(merged);
  sanitized.updatedAt = new Date().toISOString();

  localCars[index] = { ...sanitized, id: localCars[index].id };
  saveLocalFallbackCars(localCars);
  notifySubscribers(localCars);

  if (isSupabaseConfigured()) {
    try {
      const client = await getSupabaseClient();
      if (client) {
        const { error } = await client.from('cars').update(sanitized).eq('id', id);
        if (error) {
          console.warn('Supabase updateCar warning (saved locally):', error);
        }
      }
    } catch (e) {
      console.warn('Supabase updateCar error (saved locally):', e);
    }
  }
}

/**
 * Delete a car from Supabase / Local Storage
 */
export async function deleteCar(id) {
  const localCars = getLocalFallbackCars();
  const filtered = localCars.filter(c => String(c.id) !== String(id));
  saveLocalFallbackCars(filtered);
  notifySubscribers(filtered);

  if (isSupabaseConfigured()) {
    try {
      const client = await getSupabaseClient();
      if (client) {
        const { error } = await client.from('cars').delete().eq('id', id);
        if (error) {
          console.warn('Supabase deleteCar warning (deleted locally):', error);
        }
      }
    } catch (e) {
      console.warn('Supabase deleteCar error (deleted locally):', e);
    }
  }
}

/**
 * Toggle car status (available / booked / maintenance / hidden)
 */
export async function toggleCarStatus(id, newStatus) {
  const localCars = getLocalFallbackCars();
  const car = localCars.find(c => String(c.id) === String(id));
  if (car) {
    car.status = newStatus;
    car.updatedAt = new Date().toISOString();
    saveLocalFallbackCars(localCars);
    notifySubscribers(localCars);
  }

  if (isSupabaseConfigured()) {
    try {
      const client = await getSupabaseClient();
      if (client) {
        await client.from('cars').update({
          status: newStatus,
          updatedAt: new Date().toISOString()
        }).eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase toggleCarStatus error (updated locally):', e);
    }
  }
}

/**
 * Toggle car featured boolean
 */
export async function toggleCarFeatured(id, currentFeatured) {
  const newFeatured = !currentFeatured;

  const localCars = getLocalFallbackCars();
  const car = localCars.find(c => String(c.id) === String(id));
  if (car) {
    car.featured = newFeatured;
    car.updatedAt = new Date().toISOString();
    saveLocalFallbackCars(localCars);
    notifySubscribers(localCars);
  }

  if (isSupabaseConfigured()) {
    try {
      const client = await getSupabaseClient();
      if (client) {
        await client.from('cars').update({
          featured: newFeatured,
          updatedAt: new Date().toISOString()
        }).eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase toggleCarFeatured error (updated locally):', e);
    }
  }

  return newFeatured;
}

/**
 * Duplicate an existing car
 */
export async function duplicateCar(sourceCar) {
  const clone = { ...sourceCar };
  delete clone.id;
  clone.name = `${sourceCar.name} (Copy)`;
  clone.order = (sourceCar.order || 1) + 1;
  clone.createdAt = new Date().toISOString();
  clone.updatedAt = new Date().toISOString();

  return await addCar(clone);
}

/**
 * Soft delete (archive) a car
 */
export async function archiveCar(id) {
  const localCars = getLocalFallbackCars();
  const car = localCars.find(c => String(c.id) === String(id));
  if (car) {
    car.isArchived = true;
    car.archivedAt = new Date().toISOString();
    car.updatedAt = new Date().toISOString();
    saveLocalFallbackCars(localCars);
    notifySubscribers(localCars);
  }

  if (isSupabaseConfigured()) {
    try {
      const client = await getSupabaseClient();
      if (client) {
        await client.from('cars').update({
          isArchived: true,
          archivedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }).eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase archiveCar error (archived locally):', e);
    }
  }
}

/**
 * Restore an archived car
 */
export async function restoreCar(id) {
  const localCars = getLocalFallbackCars();
  const car = localCars.find(c => String(c.id) === String(id));
  if (car) {
    car.isArchived = false;
    delete car.archivedAt;
    car.updatedAt = new Date().toISOString();
    saveLocalFallbackCars(localCars);
    notifySubscribers(localCars);
  }

  if (isSupabaseConfigured()) {
    try {
      const client = await getSupabaseClient();
      if (client) {
        await client.from('cars').update({
          isArchived: false,
          updatedAt: new Date().toISOString()
        }).eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase restoreCar error (restored locally):', e);
    }
  }
}

/**
 * Export full fleet backup as JSON string
 */
export function exportFleetBackup() {
  const localCars = getLocalFallbackCars();
  return JSON.stringify({
    version: '1.0',
    exportedAt: new Date().toISOString(),
    count: localCars.length,
    fleet: localCars
  }, null, 2);
}

/**
 * Import and validate fleet backup
 */
export function importFleetBackup(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const cars = Array.isArray(data) ? data : (data.fleet && Array.isArray(data.fleet) ? data.fleet : null);
    if (!cars || cars.length === 0) {
      throw new Error('Invalid backup file format or empty fleet array.');
    }
    saveLocalFallbackCars(cars);
    notifySubscribers(cars);
    return { success: true, count: cars.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Reorder cars by array of { id, order }
 */
export async function reorderCars(orderUpdates) {
  const localCars = getLocalFallbackCars();
  orderUpdates.forEach(item => {
    const car = localCars.find(c => String(c.id) === String(item.id));
    if (car) car.order = item.order;
  });
  localCars.sort((a, b) => a.order - b.order);
  saveLocalFallbackCars(localCars);
  notifySubscribers(localCars);

  if (isSupabaseConfigured()) {
    try {
      const client = await getSupabaseClient();
      if (client) {
        for (const item of orderUpdates) {
          await client.from('cars').update({ order: item.order, updatedAt: new Date().toISOString() }).eq('id', item.id);
        }
      }
    } catch (e) {
      console.warn('Supabase reorderCars error (reordered locally):', e);
    }
  }
}

/**
 * Seed initial website fleet into Supabase / Local Storage (One-Click Sync)
 */
export async function seedCarsFromLocal(customCarsList = null) {
  const fleetToSeed = customCarsList || defaultFleetSeed;

  saveLocalFallbackCars(fleetToSeed);
  notifySubscribers(fleetToSeed);

  if (!isSupabaseConfigured()) {
    return fleetToSeed.length;
  }

  let count = 0;
  try {
    const client = await getSupabaseClient();
    if (client) {
      for (const car of fleetToSeed) {
        const sanitized = sanitizeCarData(car);
        sanitized.id = car.id || `car-${car.slug || count + 1}`;
        sanitized.createdAt = new Date().toISOString();
        sanitized.updatedAt = new Date().toISOString();

        const { error } = await client.from('cars').upsert(sanitized, { onConflict: 'id' });
        if (!error) count++;
      }
    }
  } catch (e) {
    console.warn('Supabase seed error (seeded locally):', e);
  }

  return count || fleetToSeed.length;
}

/**
 * Sanitize and normalize car data fields before saving
 */
function sanitizeCarData(data) {
  const numPrice = typeof data.pricePerDay === 'number' 
    ? data.pricePerDay 
    : parseInt(String(data.pricePerDay || data.price || '0').replace(/[^0-9]/g, ''), 10) || 1500;

  const formattedPrice = numPrice.toLocaleString('en-IN');

  const images = Array.isArray(data.images) && data.images.length > 0
    ? data.images.filter(img => typeof img === 'string' && img.trim().length > 0)
    : [data.image || 'images/mahindra-thar-4x4.webp'];

  const primaryImage = images[0] || 'images/mahindra-thar-4x4.webp';

  const category = data.category || 'Hatchback';
  let categoryGroup = data.categoryGroup;
  if (!categoryGroup) {
    categoryGroup = (['Luxury', 'Convertible', 'SUV'].includes(category) || numPrice > 2500) ? 'prem' : 'reg';
  }

  const categoryLabel = data.categoryLabel || `${categoryGroup === 'prem' ? 'Premium' : 'Popular'} ${category}`;

  return {
    name: String(data.name || 'Unnamed Car').trim(),
    brand: String(data.brand || 'Automobile').trim(),
    category: category,
    categoryGroup: categoryGroup,
    categoryLabel: categoryLabel,
    pricePerDay: numPrice,
    price: formattedPrice,
    pricePerHour: data.pricePerHour ? parseInt(data.pricePerHour, 10) : null,
    seats: String(data.seats || '5 Seats').trim(),
    transmission: String(data.transmission || 'Manual').trim(),
    fuel: String(data.fuel || 'Petrol').trim(),
    year: data.year ? parseInt(data.year, 10) : 2024,
    mileage: String(data.mileage || 'Unlimited km').trim(),
    features: Array.isArray(data.features) ? data.features : [],
    description: String(data.description || '').trim(),
    images: images,
    image: primaryImage,
    alt: data.alt || `${data.name || 'Car'} self drive rental in Goa`,
    slug: data.slug || String(data.name || 'car').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    url: data.url || `cars/${data.slug || 'car'}.html`,
    ac: data.ac || 'Air Conditioning',
    status: data.status || 'available', // available | booked | maintenance | hidden
    featured: Boolean(data.featured),
    order: data.order ? parseInt(data.order, 10) : 99
  };
}

/**
 * Upload image to Cloudinary using unsigned upload preset or local preview fallback
 * @param {File} file - image file from file picker or drag-drop
 * @param {Function} onProgress - optional upload progress callback
 * @returns {Promise<string>} secure image URL
 */
export async function uploadImageToCloudinary(file, onProgress) {
  if (!file) throw new Error("No file selected.");

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, WebP, or AVIF image.");
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("File is too large. Maximum size is 10MB.");
  }

  const { cloudName, uploadPreset } = getCloudinaryConfig();

  // If Cloudinary is not configured yet, convert to Data URL for instant local test preview
  if (!cloudName || !uploadPreset) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.readAsDataURL(file);
    });
  }

  // Upload to Cloudinary API
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'carcastle_fleet');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (e) {
          reject(new Error("Invalid response from Cloudinary."));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.error?.message || "Cloudinary upload failed. Check your Cloud Name and Preset."));
        } catch (e) {
          reject(new Error(`Upload failed with HTTP ${xhr.status}. Verify Cloudinary settings.`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error during Cloudinary upload."));
    xhr.send(formData);
  });
}
