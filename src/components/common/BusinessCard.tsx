import React from 'react';
import { Star, MapPin, Heart, Clock } from 'lucide-react';
import { Business } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface BusinessCardProps {
  business: Business;
  onViewDetails: (id: string) => void;
  onBookNow: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite?: boolean;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onViewDetails,
  onBookNow,
  onToggleFavorite,
  isFavorite = false,
}) => {
  return (
    <div className="card overflow-hidden">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onViewDetails(business.id)}
            className="btn-primary text-sm"
          >
            View Details
          </button>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(business.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          aria-label="Add to favorites"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>

        {/* Verified Badge */}
        {business.verified && (
          <div className="absolute top-3 left-3 badge-success text-xs">
            ✓ Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Business Name */}
        <h3 className="font-semibold text-gray-900 truncate mb-1">{business.name}</h3>

        {/* Category */}
        <p className="text-sm text-gray-600 mb-2">{business.category.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">{business.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({business.reviewCount} reviews)</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-gray-600 line-clamp-2">
            {business.location.area}, {business.location.city}
          </span>
        </div>

        {/* Price and Availability */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-600">Starting from</p>
            <p className="font-bold text-primary-600">{formatCurrency(business.startingPrice)}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <Clock size={16} />
            <span>Available</span>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          onClick={() => onBookNow(business.id)}
          className="btn-primary w-full"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};
