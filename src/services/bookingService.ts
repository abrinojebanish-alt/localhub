import { Booking, BookingStatus } from '../types';

const BOOKINGS_KEY = 'localhub_bookings';

export const bookingService = {
  getAllBookings: (): Booking[] => {
    const stored = localStorage.getItem(BOOKINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getBookingsByUser: (userId: string): Booking[] => {
    const bookings = bookingService.getAllBookings();
    return bookings.filter(b => b.customerId === userId);
  },

  getBookingsByBusiness: (businessId: string): Booking[] => {
    const bookings = bookingService.getAllBookings();
    return bookings.filter(b => b.businessId === businessId);
  },

  getBookingById: (id: string): Booking | null => {
    const bookings = bookingService.getAllBookings();
    return bookings.find(b => b.id === id) || null;
  },

  createBooking: (booking: Booking): Booking => {
    const bookings = bookingService.getAllBookings();
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return booking;
  },

  updateBookingStatus: (id: string, status: BookingStatus): Booking | null => {
    const bookings = bookingService.getAllBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    bookings[index].status = status;
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return bookings[index];
  },

  cancelBooking: (id: string): Booking | null => {
    return bookingService.updateBookingStatus(id, 'cancelled');
  },

  getAvailableTimeSlots: (): string[] => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
    return slots;
  },
};
