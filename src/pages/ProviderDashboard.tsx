import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { businessService } from '../services/businessService';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';
import { formatCurrency, formatDate } from '../lib/utils';
import { TrendingUp, Calendar, Users, DollarSign, BarChart3, Clock, CheckCircle } from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed'>('confirmed');
  const currentUser = userService.getCurrentUser();
  const userBusinesses = businessService.getBusinessesByOwner(currentUser?.id || '');
  const allBookings = userBusinesses.flatMap(b => bookingService.getBusinessBookings(b.id));
  const stats = bookingService.getProviderStats(userBusinesses.map(b => b.id));

  const menuItems = [
    { label: 'Dashboard', icon: <TrendingUp size={20} />, path: '/dashboard/provider' },
    { label: 'Bookings', icon: <Calendar size={20} />, path: '/dashboard/provider/bookings' },
    { label: 'Businesses', icon: <BarChart3 size={20} />, path: '/dashboard/provider/businesses' },
    { label: 'Earnings', icon: <DollarSign size={20} />, path: '/dashboard/provider/earnings' },
  ];

  const pendingBookings = allBookings.filter(b => b.status === 'pending');
  const confirmedBookings = allBookings.filter(b => b.status === 'confirmed');
  const completedBookings = allBookings.filter(b => b.status === 'completed');

  const currentBookings = 
    activeTab === 'pending' ? pendingBookings :
    activeTab === 'confirmed' ? confirmedBookings :
    completedBookings;

  return (
    <DashboardLayout title="Provider Dashboard" menuItems={menuItems}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Bookings</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
          <div className="text-xs text-gray-500 mt-2">All bookings</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</div>
          <div className="text-xs text-gray-500 mt-2">Awaiting confirmation</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Confirmed</div>
          <div className="text-3xl font-bold text-blue-600">{stats.confirmedBookings}</div>
          <div className="text-xs text-gray-500 mt-2">Scheduled bookings</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Earnings</div>
          <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalEarnings)}</div>
          <div className="text-xs text-gray-500 mt-2">All time</div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 p-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending ({pendingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'confirmed'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Confirmed ({confirmedBookings.length})
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
          </div>
        </div>

        {/* Bookings List */}
        <div className="divide-y divide-gray-200">
          {currentBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No {activeTab} bookings found</p>
            </div>
          ) : (
            currentBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {booking.customerDetails.name}
                      </h3>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        Booking #{booking.bookingId}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{booking.serviceName || 'Service'}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(booking.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {booking.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {booking.customerDetails.phone}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {booking.status === 'pending' && <Clock size={12} className="inline mr-1" />}
                        {booking.status === 'confirmed' && <CheckCircle size={12} className="inline mr-1" />}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {activeTab === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                            Accept
                          </button>
                          <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
