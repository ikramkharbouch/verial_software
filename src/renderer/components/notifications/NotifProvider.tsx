import React, { createContext, useContext } from 'react';
import { useNotifications, Notification } from '../../../hooks/useNotifications';

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (message: string) => void;
  markAsRead: (id: number) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextProps | null>(
  null
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notifications, addNotification, markAsRead, clearNotifications } =
    useNotifications();

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    );
  }
  return context;
};
