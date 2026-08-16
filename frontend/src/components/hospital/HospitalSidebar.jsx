import React from 'react';
import LifePulseLogo from '../../assets/logo/LifePulseLogo';
import { motion, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Droplet,
  Settings,
  X,
  Ambulance,
} from 'lucide-react';

export default function HospitalSidebar({
  activeRoute = '/hospital/dashboard',
  requestCount = 5,
  className = '',
  onCloseMobile,
}) {
  const shouldReduceMotion = useReducedMotion();
  const currentPath = window.location.pathname;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/hospital/dashboard' },
    { id: 'requests', label: 'Blood Requests', icon: Droplet, path: '/hospital/requests', badge: requestCount ? String(requestCount) : '5' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/hospital/settings' },
  ];

  const handleNavClick = (targetPath) => {
    if (onCloseMobile) onCloseMobile();
    if (window.location.pathname !== targetPath) {
      window.location.href = targetPath;
    }
  };

  return (
    <aside
      className={`bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 select-none shrink-0 flex flex-col justify-between w-64 shadow-xs transition-all duration-300 ${className}`}
    >
      {/* Top Brand & Clean Navigation Links */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1 pt-1">
          <LifePulseLogo size="md" />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-xl text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Clean 3-Item Navigation Menu */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              (item.path === '/hospital/dashboard' && (currentPath === '/hospital/dashboard' || currentPath === '/hospital' || currentPath === '/hospital/')) ||
              (item.path === '/hospital/requests' && currentPath.startsWith('/hospital/requests')) ||
              (item.path === '/hospital/settings' && (currentPath === '/hospital/settings' || currentPath === '/hospital/profile'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-50 text-brand-red border border-rose-100 shadow-xs'
                    : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-brand-red' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-brand-red text-white'
                        : 'bg-rose-100 text-brand-red'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Motivational LifePulse Card */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-rose-50/80 via-white to-rose-50/50 border border-rose-100 rounded-2xl p-4 relative overflow-hidden text-center shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <Ambulance className="w-5 h-5" />
          </div>

          <h4 className="text-xs font-bold text-brand-navy leading-tight mb-1">
            Every Request Saves a Life
          </h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Healthcare Command Center
          </p>

          <div className="mt-3 flex justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Network Active</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
