import React from 'react';
import { Star } from 'lucide-react';

interface BusinessCardProps {
  business: any;
  onViewDetails: (businessId: string) => void;
  onBookNow: (businessId: string) => void;
  onToggleFavorite: (businessId: string) => void;
  isFavorite: boolean;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onViewDetails,
  onBookNow,
  onToggleFavorite,
  isFavorite,
}) => {
  return (
    <div className="card-hover overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {business.image ? (
          <img
            src={business.image}
            alt={business.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(business.id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <Star
            size={20}
            className={isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
          />
        </button>

        {/* Verified Badge */}
        {business.verified && (
          <div className="absolute bottom-3 left-3 badge-success">
            ✓ Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">{business.name}</h3>
        <p className="text-xs text-gray-600 mb-3">{business.category.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(business.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900">{business.rating}</span>
          <span className="text-xs text-gray-600">({business.reviewCount})</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{business.description}</p>

        {/* Location */}
        <p className="text-xs text-gray-500 mb-4">
          📍 {business.location.city}
        </p>

        {/* Price */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-2xl font-bold text-primary-600">
            ₹{business.startingPrice.toLocaleString()}
            <span className="text-xs font-normal text-gray-600 ml-1">onwards</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(business.id)}
            className="flex-1 btn-outline text-sm"
          >
            View Details
          </button>
          <button
            onClick={() => onBookNow(business.id)}
            className="flex-1 btn-primary text-sm"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
