import { Business, Service } from '../types';
import { generateId } from '../lib/utils';

const BUSINESSES_KEY = 'localhub_businesses';

// Demo businesses
const DEMO_BUSINESSES: Business[] = [
  {
    id: 'biz_1',
    ownerId: 'user_provider_1',
    name: 'FitZone Gym',
    description: 'Modern fitness center with state-of-the-art equipment and professional trainers',
    category: { id: 'cat_sports', name: 'Sports & Fitness' },
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop',
    images: [],
    location: {
      address: '123 Main Street',
      locality: 'Downtown',
      area: 'Central',
      city: 'New York',
      coordinates: { lat: 40.7128, lng: -74.0060 },
    },
    rating: 4.8,
    reviewCount: 245,
    startingPrice: 1000,
    verified: true,
    featured: true,
    services: [
      {
        id: 'svc_1',
        name: 'Monthly Membership',
        description: 'Unlimited access to all gym facilities',
        price: 1500,
        duration: 1440,
      },
      {
        id: 'svc_2',
        name: 'Personal Training Session',
        description: '1-on-1 training with certified trainer',
        price: 2000,
        duration: 60,
      },
    ],
    openingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '07:00', close: '20:00' },
      sunday: { open: '07:00', close: '20:00' },
    },
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'biz_2',
    ownerId: 'user_provider_1',
    name: 'Beauty Salon Pro',
    description: 'Premium salon services for hair, makeup, and skincare',
    category: { id: 'cat_beauty', name: 'Salon & Beauty' },
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=300&fit=crop',
    images: [],
    location: {
      address: '456 Park Avenue',
      locality: 'Midtown',
      area: 'West',
      city: 'New York',
      coordinates: { lat: 40.7580, lng: -73.9855 },
    },
    rating: 4.6,
    reviewCount: 180,
    startingPrice: 800,
    verified: true,
    featured: true,
    services: [
      {
        id: 'svc_3',
        name: 'Hair Styling',
        description: 'Professional hair cutting and styling',
        price: 1200,
        duration: 60,
      },
      {
        id: 'svc_4',
        name: 'Facial Treatment',
        description: 'Complete facial with skincare products',
        price: 1500,
        duration: 45,
      },
    ],
    openingHours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '19:00' },
    },
    createdAt: new Date('2024-02-01'),
  },
];

export const businessService = {
  getAllBusinesses: (): Business[] => {
    return JSON.parse(localStorage.getItem(BUSINESSES_KEY) || JSON.stringify(DEMO_BUSINESSES));
  },

  getBusinessById: (id: string): Business | undefined => {
    const businesses = businessService.getAllBusinesses();
    return businesses.find(b => b.id === id);
  },

  getBusinessesByOwner: (ownerId: string): Business[] => {
    const businesses = businessService.getAllBusinesses();
    return businesses.filter(b => b.ownerId === ownerId);
  },

  getFeaturedBusinesses: (): Business[] => {
    const businesses = businessService.getAllBusinesses();
    return businesses.filter(b => b.featured).slice(0, 6);
  },

  searchBusinesses: (
    {
      query = '',
      filters = {},
      sortBy = 'recommended',
    }: {
      query?: string;
      filters?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
      };
      sortBy?: 'recommended' | 'rating' | 'price-low' | 'price-high';
    }
  ): Business[] => {
    let businesses = businessService.getAllBusinesses();

    // Filter by query
    if (query) {
      const lowerQuery = query.toLowerCase();
      businesses = businesses.filter(b =>
        b.name.toLowerCase().includes(lowerQuery) ||
        b.description.toLowerCase().includes(lowerQuery) ||
        b.category.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply filters
    if (filters.category) {
      businesses = businesses.filter(b => b.category.id === filters.category);
    }
    if (filters.minPrice !== undefined) {
      businesses = businesses.filter(b => b.startingPrice >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      businesses = businesses.filter(b => b.startingPrice <= filters.maxPrice);
    }
    if (filters.minRating !== undefined) {
      businesses = businesses.filter(b => b.rating >= filters.minRating);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        businesses.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        businesses.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price-high':
        businesses.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'recommended':
      default:
        businesses.sort((a, b) => b.rating - a.rating);
    }

    return businesses;
  },

  createBusiness: (business: Business) => {
    const businesses = businessService.getAllBusinesses();
    businesses.push(business);
    localStorage.setItem(BUSINESSES_KEY, JSON.stringify(businesses));
  },

  updateBusiness: (id: string, updates: Partial<Business>) => {
    const businesses = businessService.getAllBusinesses();
    const index = businesses.findIndex(b => b.id === id);
    if (index !== -1) {
      businesses[index] = { ...businesses[index], ...updates };
      localStorage.setItem(BUSINESSES_KEY, JSON.stringify(businesses));
    }
  },
};
