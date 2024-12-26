import { useState } from 'react';

export type Notification = {
  id: number;
  message: string;
  isRead: boolean;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'Low stock alert: Tire A is below the threshold!',
      isRead: false,
    },
    {
      id: 2,
      message: 'Order #10234 has been placed successfully.',
      isRead: false,
    },
    {
      id: 3,
      message: 'Low stock alert: Tire B is below the threshold!',
      isRead: true,
    },
    {
      id: 4,
      message: 'Reminder: Inventory check scheduled for tomorrow.',
      isRead: false,
    },
    {
      id: 5,
      message: 'Order #10235 has been shipped.',
      isRead: true,
    },
  ]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), message, isRead: false },
    ]);
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const clearNotifications = () => setNotifications([]);

  return {
    notifications,
    addNotification,
    markAsRead,
    clearNotifications,
  };
};
