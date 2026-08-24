import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { BusinessCard } from '../components/common/BusinessCard';
import { EmptyState } from '../components/common/EmptyState';
import { businessService } from '../services/businessService';
import { CATEGORIES } from '../data/categories';
import { MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const featured = businessService.getFeaturedBusinesses();

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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Find Everything Local</h1>
            <p className="text-xl text-primary-100 mb-8">
              Book services from verified local businesses near you
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Location"
                  className="pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 w-40"
                />
              </div>
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="categories">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.slice(0, 12).map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/explore?category=${category.id}`)}
              className="card p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-sm text-gray-900">{category.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{category.providerCount} providers</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Providers</h2>
        {featured.length === 0 ? (
          <EmptyState
            title="No Providers Found"
            message="Featured providers will appear here soon"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((business) => (
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
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">For Business Owners</h2>
              <p className="text-gray-600 mb-6">
                List your business on LocalHub and reach thousands of customers in your area. Grow your business with our powerful booking platform.
              </p>
              <button
                onClick={() => navigate('/for-business')}
                className="btn-primary"
              >
                Get Started as a Provider
              </button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                  <span className="text-gray-700">Easy business setup</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                  <span className="text-gray-700">Automated booking system</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                  <span className="text-gray-700">Online payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                  <span className="text-gray-700">Customer analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
