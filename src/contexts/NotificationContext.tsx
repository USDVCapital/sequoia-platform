'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'deal_update' | 'training_reminder' | 'leaderboard_update' | 'community_mention';
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultNotifications: Notification[] = [
  { id: '1', type: 'deal_update', message: 'Your EHMP deal for Sunrise Medical Group has been approved!', timestamp: '2 hours ago', read: false },
  { id: '2', type: 'training_reminder', message: 'New training video: How to Present EHMP to Skeptical Employers', timestamp: '1 day ago', read: false },
  { id: '3', type: 'training_reminder', message: 'Wednesday training starts in 2 hours — 8 PM ET', timestamp: 'Today', read: false },
  { id: '4', type: 'leaderboard_update', message: "You've moved up to #8 on this month's leaderboard!", timestamp: '3 days ago', read: false },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('seq_notifications');
    setNotifications(stored ? JSON.parse(stored) : defaultNotifications);
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('seq_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (n: Omit<Notification, 'id' | 'read'>) => {
    const newNotif: Notification = { ...n, id: Date.now().toString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
