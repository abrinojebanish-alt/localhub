import React, { useState, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { BusinessCard } from '../components/common/BusinessCard';
import { EmptyState } from '../components/common/EmptyState';
import { Loading } from '../components/common/Loading';
import { businessService } from '../services/businessService';
import { CATEGORIES } from '../data/categories';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price-low' | 'price-high'>('recommended');

  const filteredBusinesses = useMemo(() => {
    return businessService.searchBusinesses({
      query: searchQuery,
      filters: {
        category: selectedCategory || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        minRating: minRating,
      },
      sortBy: sortBy,
    });
  }, [searchQuery, selectedCategory, priceRange, minRating, sortBy]);

  const handleBookNow = (businessId: string) => {
    navigate(`/business/${businessId}`);
  };

  const handleViewDetails = (businessId: string) => {
    navigate(`/business/${businessId}`);
  };

  const handleToggleFavorite = (businessId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(businessId)) {
      newFavorites.delete(businessId);
    } else {
      newFavorites.add(businessId);
    }
    setFavorites(newFavorites);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Services</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter size={18} /> Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="input-base pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-base text-sm"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="input-base text-sm"
                >
                  <option value="0">All Ratings</option>
                  <option value="3">3+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="input-base text-sm"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Businesses Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredBusinesses.length}</span> results
            </div>

            {filteredBusinesses.length === 0 ? (
              <EmptyState
                title="No Businesses Found"
                message="Try adjusting your filters or search query"
                action={{
                  label: 'Clear Filters',
                  onClick: () => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setPriceRange([0, 5000]);
                    setMinRating(0);
                  },
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onViewDetails={handleViewDetails}
                    onBookNow={handleBookNow}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.has(business.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
