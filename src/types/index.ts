export type UserRole = 'customer' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  verified: boolean;
  createdAt: Date;
  businessName?: string;
}

export interface Location {
  address: string;
  locality: string;
  area: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface OpeningHours {
  [key: string]: { open: string; close: string };
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  category: { id: string; name: string };
  image: string;
  images: string[];
  location: Location;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  verified: boolean;
  featured: boolean;
  services: Service[];
  openingHours: OpeningHours;
  createdAt: Date;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'canceled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  bookingId: string;
  customerId: string;
  businessId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: BookingStatus;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  platformFee: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  serviceName?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  businessId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
