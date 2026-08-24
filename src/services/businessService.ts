import { Business, SearchFilters, SearchParams } from '../types';
import { MOCK_BUSINESSES } from '../data/businesses';

export const businessService = {
  getAllBusinesses: (): Business[] => {
    return MOCK_BUSINESSES;
  },

  getBusinessById: (id: string): Business | null => {
    return MOCK_BUSINESSES.find(b => b.id === id) || null;
  },

  searchBusinesses: (params: SearchParams): Business[] => {
    let results = MOCK_BUSINESSES;

    // Search by query
    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.category.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.location.area.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (params.filters) {
      const { category, minPrice, maxPrice, minRating, location, verified } = params.filters;

      if (category) {
        results = results.filter(b => b.category.id === category);
      }

      if (minPrice !== undefined) {
        results = results.filter(b => b.startingPrice >= minPrice);
      }

      if (maxPrice !== undefined) {
        results = results.filter(b => b.startingPrice <= maxPrice);
      }

      if (minRating !== undefined) {
        results = results.filter(b => b.rating >= minRating);
      }

      if (location) {
        const loc = location.toLowerCase();
        results = results.filter(b =>
          b.location.city.toLowerCase().includes(loc) ||
          b.location.area.toLowerCase().includes(loc) ||
          b.location.locality.toLowerCase().includes(loc)
        );
      }

      if (verified) {
        results = results.filter(b => b.verified === verified);
      }
    }

    // Apply sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'price-low':
          results.sort((a, b) => a.startingPrice - b.startingPrice);
          break;
        case 'price-high':
          results.sort((a, b) => b.startingPrice - a.startingPrice);
          break;
        case 'recommended':
          results.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'distance':
          // Mock distance sorting - in real app would calculate actual distance
          break;
      }
    }

    return results;
  },

  getBusinessesByCategory: (categoryId: string): Business[] => {
    return MOCK_BUSINESSES.filter(b => b.category.id === categoryId);
  },

  getFeaturedBusinesses: (): Business[] => {
    return MOCK_BUSINESSES
      .filter(b => b.verified && b.rating >= 4.5)
      .slice(0, 6);
  },
};
