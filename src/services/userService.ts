import { User } from '../types';

const USERS_KEY = 'localhub_users';
const CURRENT_USER_KEY = 'localhub_current_user';

// Demo users
const DEMO_USERS: User[] = [
  {
    id: 'user_customer_1',
    name: 'John Doe',
    email: 'customer@example.com',
    phone: '+1 (555) 123-4567',
    role: 'customer',
    verified: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user_provider_1',
    name: 'Sarah Johnson',
    email: 'owner1@example.com',
    phone: '+1 (555) 234-5678',
    role: 'business',
    businessName: 'FitZone Gym',
    verified: true,
    createdAt: new Date('2024-01-01'),
  },
];

export const userService = {
  registerUser: (user: User) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check if user exists
    if (users.some((u: User) => u.email === user.email)) {
      throw new Error('User with this email already exists');
    }
    
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  login: (email: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || JSON.stringify(DEMO_USERS));
    const user = users.find((u: User) => u.email === email);
    
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  getUserById: (id: string): User | undefined => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || JSON.stringify(DEMO_USERS));
    return users.find((u: User) => u.id === id);
  },

  updateUser: (id: string, updates: Partial<User>) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || JSON.stringify(DEMO_USERS));
    const userIndex = users.findIndex((u: User) => u.id === id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      const currentUser = localStorage.getItem(CURRENT_USER_KEY);
      if (currentUser) {
        const parsedCurrentUser = JSON.parse(currentUser);
        if (parsedCurrentUser.id === id) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...parsedCurrentUser, ...updates }));
        }
      }
    }
  },
};
