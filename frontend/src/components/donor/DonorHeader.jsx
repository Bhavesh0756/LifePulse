import React from 'react';
import LifePulseLogo from '../../assets/logo/LifePulseLogo';
import AvailabilityToggle from './AvailabilityToggle';
import NotificationBell from '../notifications/NotificationBell';
import Container from '../Container';
import { Button } from '../Button';
import { LogOut, HeartPulse, ShieldCheck, User } from 'lucide-react';

export default function DonorHeader({ user, profile, onToggleAvailability, isUpdatingAvailability, onLogout }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <Container size="lg" className="py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & User Greeting */}
          <div className="flex items-center gap-4">
            <a href="/" className="focus:outline-none">
              <LifePulseLogo size="md" />
            </a>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-3">
              {/* Blood Group Pill Badge */}
              <div className="px-3 py-1 bg-brand-red text-white text-xs font-black rounded-full shadow-crimson-glow flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5" />
                <span>{user?.bloodGroup || 'O+'}</span>
              </div>

              <div>
                <h1 className="text-base font-extrabold text-brand-navy leading-tight flex items-center gap-1.5">
                  <span>{user?.name || 'Donor Portal'}</span>
                </h1>
                <span className="text-[11px] text-brand-slate block">Verified Blood Donor</span>
              </div>
            </div>
          </div>

          {/* Right Action Bar: Availability Switch, Notifications & Logout */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            <AvailabilityToggle
              isAvailable={profile?.isAvailable ?? true}
              onToggle={onToggleAvailability}
              isUpdating={isUpdatingAvailability}
            />

            <NotificationBell />

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              icon={LogOut}
              className="text-slate-600 border-slate-300 hover:text-brand-red hover:border-brand-red"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
