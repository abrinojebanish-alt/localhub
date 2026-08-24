import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Modal } from '../components/common/Modal';
import { Alert } from '../components/common/Alert';
import { StarRating } from '../components/common/StarRating';
import { useParams, useNavigate } from 'react-router-dom';
import { businessService } from '../services/businessService';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';
import { formatCurrency, formatDate, generateBookingId, generateId } from '../lib/utils';
import { Star, MapPin, Clock, Phone, Mail, ChevronLeft, ImageOff } from 'lucide-react';

export const BusinessDetailsPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const business = businessId ? businessService.getBusinessById(businessId) : null;
  const currentUser = userService.getCurrentUser();

  if (!business) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Not Found</h1>
          <button
            onClick={() => navigate('/explore')}
            className="btn-primary"
          >
            Back to Explore
          </button>
        </div>
      </Layout>
    );
  }

  const timeSlots = bookingService.getAvailableTimeSlots();
  const selectedServiceData = business.services.find(s => s.id === selectedService);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService || !customerName || !customerPhone) {
      alert('Please fill all required fields');
      return;
    }

    if (!currentUser) {
      alert('Please login to book');
      navigate('/login');
      return;
    }

    const booking = {
      id: generateId('booking'),
      bookingId: generateBookingId(),
      customerId: currentUser.id,
      businessId: business.id,
      serviceId: selectedService,
      date: new Date(selectedDate),
      time: selectedTime,
      status: 'pending' as const,
      customerDetails: {
        name: customerName,
        email: customerEmail || currentUser.email,
        phone: customerPhone,
      },
      totalAmount: selectedServiceData?.price || 0,
      platformFee: Math.round((selectedServiceData?.price || 0) * 0.05),
      paymentStatus: 'pending' as const,
      createdAt: new Date(),
    };

    bookingService.createBooking(booking);
    setShowBookingModal(false);
    setShowSuccessAlert(true);
    
    setTimeout(() => {
      navigate(`/dashboard/customer`);
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
        >
          <ChevronLeft size={20} /> Back to Explore
        </button>

        {showSuccessAlert && (
          <Alert
            type="success"
            title="Booking Confirmed!"
            message="Your booking has been submitted successfully. You'll be redirected to your dashboard."
            onClose={() => setShowSuccessAlert(false)}
          />
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Info */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
              {business.image ? (
                <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
              ) : (
                <ImageOff size={48} className="text-gray-400" />
              )}
            </div>

            {/* Image Gallery */}
            {business.images.length > 0 && (
              <div className="mb-8 grid grid-cols-4 gap-2">
                {business.images.map((img, idx) => (
                  <div key={idx} className="bg-gray-100 rounded-lg overflow-hidden h-24 cursor-pointer hover:opacity-75">
                    <img src={img} alt={`${business.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Business Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
                  <p className="text-gray-600 mb-3">{business.category.name}</p>
                </div>
                {business.verified && (
                  <div className="badge-success">✓ Verified</div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <StarRating rating={business.rating} />
                  <span className="font-semibold text-gray-900">{business.rating}</span>
                  <span className="text-gray-600 text-sm">({business.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
                <p className="text-gray-600">{business.description}</p>
              </div>

              {/* Location */}
              <div className="mb-4 flex items-start gap-3">
                <MapPin className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-900">{business.location.address}</p>
                  <p className="text-gray-600 text-sm">
                    {business.location.locality}, {business.location.area}, {business.location.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
              <div className="space-y-3">
                {business.services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock size={16} /> {service.duration} mins
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-600">{formatCurrency(service.price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Booking</h3>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Starting from</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(business.startingPrice)}</p>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-green-600" />
                  <span>Available today</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} className="text-primary-600" />
                  <span>Direct contact available</span>
                </div>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="btn-primary w-full mb-3"
              >
                Book Now
              </button>
              <button className="btn-outline w-full">
                Contact Provider
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book Service"
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowBookingModal(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              className="btn-primary"
            >
              Confirm Booking
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Select Service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Service*</label>
            <select
              value={selectedService || ''}
              onChange={(e) => setSelectedService(e.target.value)}
              className="input-base"
            >
              <option value="">Choose a service...</option>
              {business.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {formatCurrency(service.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-base"
            />
          </div>

          {/* Select Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time*</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="input-base"
            >
              <option value="">Choose a time...</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Your Details</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name*"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-base"
              />
              <input
                type="email"
                placeholder="Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="input-base"
              />
              <input
                type="tel"
                placeholder="Phone Number*"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="input-base"
              />
            </div>
          </div>

          {/* Price Summary */}
          {selectedServiceData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service Price</span>
                <span className="font-medium">{formatCurrency(selectedServiceData.price)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Platform Fee (5%)</span>
                <span className="font-medium">{formatCurrency(Math.round(selectedServiceData.price * 0.05))}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-semibold">Total Amount</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency(selectedServiceData.price + Math.round(selectedServiceData.price * 0.05))}
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Layout>
  );
};
