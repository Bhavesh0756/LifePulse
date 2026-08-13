import React from 'react';
import Container from '../Container';
import NotificationBell from '../notifications/NotificationBell';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { ShieldCheck, LogOut, HeartPulse, User } from 'lucide-react';

export default function AdminHeader({ user, onLogout }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <Container size="lg">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Role Badge */}
          <div className="flex items-center gap-3">
            <a href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-red text-white flex items-center justify-center font-black shadow-sm">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-brand-navy tracking-tight">
                LifePulse <span className="text-brand-red text-xs uppercase px-2 py-0.5 rounded bg-rose-50 border border-rose-100 font-bold ml-1">Admin</span>
              </span>
            </a>
          </div>

          {/* Admin Identity, Notifications & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-brand-navy text-white flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left text-xs">
                <span className="block font-bold text-brand-navy leading-tight">{user?.name || 'Administrator'}</span>
                <span className="block text-[10px] text-slate-500 font-mono">{user?.email}</span>
              </div>
            </div>

            <NotificationBell />

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              icon={LogOut}
              className="text-slate-600 hover:text-rose-600"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
