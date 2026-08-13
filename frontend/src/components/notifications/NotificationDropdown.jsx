import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import { CheckCheck, BellOff, RefreshCw, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationDropdown({ onClose }) {
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // all | unread

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-brand-red/30 p-4 space-y-3 antialiased"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-black text-brand-navy">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-[10px] font-black text-white bg-brand-red px-2 py-0.5 rounded-full">
              {unreadCount} UNREAD
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              title="Mark all as read"
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-red hover:bg-rose-50 transition-colors text-[11px] font-bold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mark read</span>
            </button>
          )}
          <button
            onClick={() => fetchNotifications(1, 20, filter === 'unread')}
            title="Refresh"
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-[11px] font-bold">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1 rounded-lg transition-all ${
            filter === 'all' ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-brand-navy'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 py-1 rounded-lg transition-all ${
            filter === 'unread' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-brand-navy'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {filteredNotifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <BellOff className="w-7 h-7 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No new notifications</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <NotificationItem key={n._id} notification={n} onRead={markAsRead} />
          ))
        )}
      </div>
    </motion.div>
  );
}
