/**
 * TypeScript Type Definitions for Car Castle Goa Fleet Data
 */

export interface CarFleetItem {
  id: number | string;
  type: 'car';
  name: string;
  brand: string;
  slug: string;
  url: string;
  category: 'reg' | 'prem';
  categoryType: 'SUV' | 'Hatchback' | 'Sedan' | 'Luxury' | 'MPV';
  categoryLabel: string;
  price: string;
  pricePerDay: number;
  pricePerHour?: number;
  image: string;
  alt: string;
  seats: string;
  transmission: string;
  fuel: string;
  ac: string;
  features: string[];
  status?: 'available' | 'booked' | 'maintenance' | 'hidden';
  isArchived?: boolean;
  archivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingSearchParams {
  location?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
}
