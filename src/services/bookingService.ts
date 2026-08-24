import { Booking } from '../types';

const BOOKINGS_KEY = 'localhub_bookings';

export const bookingService = {
  createBooking: (booking: Booking) => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  },

  getUserBookings: (userId: string): Booking[] => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    return bookings.filter((b: Booking) => b.customerId === userId);
  },

  getBusinessBookings: (businessId: string): Booking[] => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    return bookings.filter((b: Booking) => b.businessId === businessId);
  },

  getBookingById: (id: string): Booking | undefined => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    return bookings.find((b: Booking) => b.id === id);
  },

  updateBooking: (id: string, updates: Partial<Booking>) => {
    const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    const index = bookings.findIndex((b: Booking) => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    }
  },

  getCustomerStats: (userId: string) => {
    const bookings = bookingService.getUserBookings(userId);
    return {
      totalBookings: bookings.length,
      upcomingBookings: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      totalSpent: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
    };
  },

  getProviderStats: (businessIds: string[]) => {
    let allBookings: Booking[] = [];
    businessIds.forEach(bid => {
      allBookings = [...allBookings, ...bookingService.getBusinessBookings(bid)];
    });
    
    return {
      totalBookings: allBookings.length,
      pendingBookings: allBookings.filter(b => b.status === 'pending').length,
      confirmedBookings: allBookings.filter(b => b.status === 'confirmed').length,
      completedBookings: allBookings.filter(b => b.status === 'completed').length,
      totalEarnings: allBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.totalAmount - b.platformFee), 0),
    };
  },

  getAvailableTimeSlots: (): string[] => {
    const slots = [];
    for (let i = 8; i < 20; i++) {
      slots.push(`${String(i).padStart(2, '0')}:00`);
      slots.push(`${String(i).padStart(2, '0')}:30`);
    }
    return slots;
  },
};
