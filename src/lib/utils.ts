export const generateId = (prefix: string = ''): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateBookingId = (): string => {
  return `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(`2000-01-01T${hours}:${minutes}`));
};

export const getDayOfWeek = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(date);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

export const getNextNDays = (n: number): Date[] => {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};
