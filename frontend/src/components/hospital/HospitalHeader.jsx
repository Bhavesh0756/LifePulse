import React, { useState } from 'react';
import LifePulseLogo from '../../assets/logo/LifePulseLogo';
import NotificationBell from '../notifications/NotificationBell';
import Container from '../Container';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Hospital, PlusCircle, LayoutDashboard, FileText, User, LogOut, ShieldCheck, AlertCircle, Menu, X } from 'lucide-react';

export default function HospitalHeader({ user, profile, onLogout, currentPath = '/hospital/dashboard' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const status = profile?.verificationStatus || (profile?.isVerified ? 'VERIFIED' : 'PENDING');

  const navItems = [
    { name: 'Dashboard', href: '/hospital/dashboard', icon: LayoutDashboard },
    { name: 'Blood Requests', href: '/hospital/requests', icon: FileText },
    { name: 'Hospital Profile', href: '/hospital/profile', icon: User },
  ];

  const getBadgeVariant = (st) => {
    if (st === 'VERIFIED') return 'success';
    if (st === 'REJECTED') return 'danger';
    return 'warning';
  };

  const getBadgeText = (st) => {
    if (st === 'VERIFIED') return 'VERIFIED HOSPITAL';
    if (st === 'REJECTED') return 'VERIFICATION REJECTED';
    return 'VERIFICATION PENDING';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <Container size="lg" className="py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand & Hospital Greeting */}
          <div className="flex items-center gap-4">
            <a href="/" className="focus:outline-none">
              <LifePulseLogo size="md" />
            </a>

            <div className="h-8 w-px bg-slate-200 hidden md:block" />

            <div className="hidden md:flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-sm">
                <Hospital className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-extrabold text-brand-navy leading-tight">
                    {profile?.hospitalName || user?.hospitalName || 'Hospital Center'}
                  </h1>
                  <Badge variant={getBadgeVariant(status)} className="text-[10px] uppercase py-0.5 font-extrabold">
                    {getBadgeText(status)}
                  </Badge>
                </div>
                <span className="text-[11px] text-brand-slate block">Healthcare Institution Portal</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links & Create CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-slate-100 text-brand-red'
                        : 'text-brand-navy hover:text-brand-red hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <NotificationBell />

              <Button
                variant="primary"
                size="sm"
                icon={PlusCircle}
                onClick={() => { window.location.href = '/hospital/requests/new'; }}
              >
                + Create Request
              </Button>

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

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-brand-navy hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-brand-navy">{profile?.hospitalName || 'Hospital Portal'}</span>
            <Badge variant={getBadgeVariant(status)} className="text-[10px]">
              {status}
            </Badge>
          </div>

          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 text-xs font-bold text-brand-navy hover:text-brand-red hover:bg-slate-50 rounded-lg"
            >
              {item.name}
            </a>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full justify-center"
              icon={PlusCircle}
              onClick={() => { window.location.href = '/hospital/requests/new'; }}
            >
              + Create Blood Request
            </Button>
            <Button variant="outline" className="w-full justify-center" icon={LogOut} onClick={onLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
