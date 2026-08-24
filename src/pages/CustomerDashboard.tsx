import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';
import { businessService } from '../services/businessService';
import { formatCurrency, formatDate } from '../lib/utils';
import { Calendar, MapPin, Phone, MessageSquare, Star, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { StarRating } from '../components/common/StarRating';

export const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'canceled'>('upcoming');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const currentUser = userService.getCurrentUser();
  const bookings = bookingService.getUserBookings(currentUser?.id || '');
  const stats = bookingService.getCustomerStats(currentUser?.id || '');

  const menuItems = [
    { label: 'Dashboard', icon: <TrendingUp size={20} />, path: '/dashboard/customer' },
    { label: 'My Bookings', icon: <Calendar size={20} />, path: '/dashboard/customer' },
    { label: 'Favorites', icon: <Star size={20} />, path: '/dashboard/customer/favorites' },
    { label: 'Reviews', icon: <MessageSquare size={20} />, path: '/dashboard/customer/reviews' },
  ];

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const canceledBookings = bookings.filter(b => b.status === 'canceled');

  const currentBookings = 
    activeTab === 'upcoming' ? upcomingBookings :
    activeTab === 'completed' ? completedBookings :
    canceledBookings;

  const handleReviewSubmit = () => {
    if (selectedBooking && reviewData.rating > 0) {
      // Submit review logic here
      console.log('Review submitted:', { bookingId: selectedBooking.id, ...reviewData });
      setShowReviewModal(false);
      setReviewData({ rating: 0, comment: '' });
    }
  };

  return (
    <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Bookings</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
          <div className="text-xs text-gray-500 mt-2">All time bookings</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Upcoming</div>
          <div className="text-3xl font-bold text-primary-600">{stats.upcomingBookings}</div>
          <div className="text-xs text-gray-500 mt-2">Next bookings</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Completed</div>
          <div className="text-3xl font-bold text-green-600">{stats.completedBookings}</div>
          <div className="text-xs text-gray-500 mt-2">Finished bookings</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Spent</div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</div>
          <div className="text-xs text-gray-500 mt-2">All bookings</div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 p-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({completedBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('canceled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'canceled'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Canceled ({canceledBookings.length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="divide-y divide-gray-200">
          {currentBookings.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarIcon size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No {activeTab} bookings found</p>
            </div>
          ) : (
            currentBookings.map((booking) => {
              const business = businessService.getBusinessById(booking.businessId);
              return (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      <img
                        src={business?.image}
                        alt={business?.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{business?.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{booking.serviceName || 'Service'}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={16} />
                            {formatDate(booking.date)}
                          </span>
                          <span>{booking.time}</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={16} />
                            {business?.location.city}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {formatCurrency(booking.totalAmount)}
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {activeTab === 'completed' && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowReviewModal(true);
                          }}
                          className="block mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Write a Review"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowReviewModal(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleReviewSubmit}
              className="btn-primary"
            >
              Submit Review
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating*</label>
            <StarRating
              rating={reviewData.rating}
              onRatingChange={(rating) => setReviewData({...reviewData, rating})}
              interactive
              size={32}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              placeholder="Share your experience..."
              className="input-base h-24 resize-none"
            />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
