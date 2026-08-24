import { Notification } from '../types';

const NOTIFICATIONS_KEY = 'localhub_notifications';

export const notificationService = {
  getAllNotifications: (): Notification[] => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getNotificationsByUser: (userId: string): Notification[] => {
    const notifications = notificationService.getAllNotifications();
    return notifications.filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getUnreadCount: (userId: string): number => {
    const notifications = notificationService.getNotificationsByUser(userId);
    return notifications.filter(n => !n.read).length;
  },

  createNotification: (notification: Notification): Notification => {
    const notifications = notificationService.getAllNotifications();
    notifications.push(notification);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return notification;
  },

  markAsRead: (id: string): Notification | null => {
    const notifications = notificationService.getAllNotifications();
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) return null;
    
    notifications[index].read = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return notifications[index];
  },
};
