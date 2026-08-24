import { User, CustomerUser, BusinessUser } from '../types';

const USERS_KEY = 'localhub_users';
const CURRENT_USER_KEY = 'localhub_current_user';

export const userService = {
  getAllUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getUserById: (id: string): User | null => {
    const users = userService.getAllUsers();
    return users.find(u => u.id === id) || null;
  },

  registerUser: (user: User): User => {
    const users = userService.getAllUsers();
    const existing = users.find(u => u.email === user.email);
    if (existing) throw new Error('Email already registered');
    
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return user;
  },

  login: (email: string, password: string): User | null => {
    const users = userService.getAllUsers();
    const user = users.find(u => u.email === email);
    if (!user) return null;
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  isLoggedIn: (): boolean => {
    return userService.getCurrentUser() !== null;
  },

  updateUser: (user: User): User => {
    const users = userService.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) throw new Error('User not found');
    
    users[index] = user;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Update current user if it's the same
    const current = userService.getCurrentUser();
    if (current && current.id === user.id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    
    return user;
  },
};
