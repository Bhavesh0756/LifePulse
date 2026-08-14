import React from 'react';
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Building2,
  ShieldCheck,
  Bell,
  Activity,
  XCircle,
} from 'lucide-react';

function getRelativeTime(date) {
  if (!date) return 'Recently';
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getNotificationIcon(type) {
  switch (type) {
    case 'BLOOD_REQUEST_MATCH':
      return <HeartPulse className="w-4 h-4 text-brand-red" />;
    case 'DONOR_ACCEPTED':
      return <UserCheck className="w-4 h-4 text-emerald-600" />;
    case 'CONSENT_RECEIVED':
      return <ShieldCheck className="w-4 h-4 text-blue-600" />;
    case 'REQUEST_CANCELLED':
      return <XCircle className="w-4 h-4 text-rose-500" />;
    case 'REQUEST_FULFILLED':
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 'HOSPITAL_VERIFICATION_PENDING':
      return <Clock className="w-4 h-4 text-amber-500" />;
    case 'HOSPITAL_VERIFIED':
      return <Building2 className="w-4 h-4 text-emerald-600" />;
    case 'HOSPITAL_REJECTED':
      return <Building2 className="w-4 h-4 text-rose-600" />;
    case 'CRITICAL_REQUEST':
      return <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />;
    default:
      return <Bell className="w-4 h-4 text-brand-navy" />;
  }
}

export default function NotificationItem({ notification, onRead }) {
  const handleClick = () => {
    if (!notification.isRead && onRead) {
      onRead(notification._id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${
        notification.isRead
          ? 'bg-white border-slate-100 hover:bg-slate-50'
          : 'bg-rose-50/40 border-rose-100/80 shadow-[0_4px_14px_rgba(225,29,72,0.08)] hover:bg-rose-50/70'
      }`}
    >
      <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>

      <div className="flex-grow min-w-0 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <h5 className={`text-xs tracking-tight ${notification.isRead ? 'font-bold text-slate-700' : 'font-extrabold text-brand-navy'}`}>
            {notification.title}
          </h5>
          <span className="text-[10px] font-mono text-slate-400 shrink-0">
            {getRelativeTime(notification.createdAt)}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
          {notification.message}
        </p>

        {!notification.isRead && (
          <span className="inline-block text-[9px] font-extrabold text-brand-red bg-rose-100/70 px-1.5 py-0.2 rounded mt-1">
            NEW
          </span>
        )}
      </div>
    </div>
  );
}
