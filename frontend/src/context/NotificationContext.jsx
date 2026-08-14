import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('[Notification Context Unread Count Error]:', err);
    }
  }, [user]);

  const fetchNotifications = useCallback(
    async (page = 1, limit = 20, unreadOnly = false) => {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await notificationService.getNotifications(page, limit, unreadOnly);
        if (res.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unreadCount);
        }
      } catch (err) {
        console.error('[Notification Context Fetch Error]:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        const res = await notificationService.markAsRead(notificationId);
        if (res.success) {
          setNotifications((prev) =>
            prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
          );
          setUnreadCount(res.data.unreadCount);
        }
      } catch (err) {
        console.error('[Notification Context Mark Read Error]:', err);
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('[Notification Context Mark All Error]:', err);
    }
  }, []);

  // Socket.IO Lifecycle Connection
  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const socketUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:5000';

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.IO Frontend] Connected to real-time notification gateway');
    });

    socketInstance.on('notification:new', (payload) => {
      console.log('[Socket.IO Frontend] New Notification Received:', payload);
      if (payload.notification) {
        setNotifications((prev) => [payload.notification, ...prev]);
      }
      if (typeof payload.unreadCount === 'number') {
        setUnreadCount(payload.unreadCount);
      }
    });

    socketInstance.on('notification:read', (payload) => {
      if (typeof payload.unreadCount === 'number') {
        setUnreadCount(payload.unreadCount);
      }
    });

    socketInstance.on('notification:read_all', (payload) => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    });

    setSocket(socketInstance);

    // Initial fetch on mount / user login
    fetchNotifications();

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        socket,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
