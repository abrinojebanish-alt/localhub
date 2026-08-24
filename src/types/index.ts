// User Types
export type UserRole = 'customer' | 'business' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  verified?: boolean;
}

export interface CustomerUser extends User {
  role: 'customer';
  favorites: string[]; // business ids
  bookings: string[]; // booking ids
}

export interface BusinessUser extends User {
  role: 'business';
  businessId: string;
}

export interface AdminUser extends User {
  role: 'admin';
}

// Business Types
export interface Business {
  id: string;
  ownerId: string;
  name: string;
  category: Category;
  description: string;
  location: Location;
  image: string;
  images: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  openingHours: OpeningHours;
  amenities: string[];
  services: Service[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  city: string;
  area: string;
  locality: string;
  latitude?: number;
  longitude?: number;
  address: string;
}

export interface OpeningHours {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
}

export interface TimeSlot {
  open: string;
  close: string;
  closed: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  providerCount?: number;
}

// Service Types
export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image?: string;
}

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  bookingId: string;
  customerId: string;
  businessId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: BookingStatus;
  customerDetails: CustomerDetails;
  totalAmount: number;
  platformFee: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

// Review Types
export interface Review {
  id: string;
  businessId: string;
  customerId: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  images?: string[];
  createdAt: Date;
}

// Payment Types
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

// Notification Types
export type NotificationType = 'booking' | 'review' | 'verification' | 'payment' | 'message';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Favorites Types
export interface Favorite {
  userId: string;
  businessId: string;
  createdAt: Date;
}

// Search/Filter Types
export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  location?: string;
  verified?: boolean;
  availableToday?: boolean;
}

export interface SearchParams {
  query: string;
  filters: SearchFilters;
  sortBy?: 'recommended' | 'rating' | 'price-low' | 'price-high' | 'distance';
}
