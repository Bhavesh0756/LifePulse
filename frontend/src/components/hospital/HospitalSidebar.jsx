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
  requestCount = 0,
  activeEmergenciesCount = null,
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

      {/* Bottom Network Status Card */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
          <h4 className="text-xs font-black text-brand-navy tracking-wide mb-3 uppercase">
            Network Status
          </h4>
          
          <ul className="space-y-2.5 text-xs font-bold text-slate-600">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Donors Online</span>
              </div>
              {/* No fake data */}
            </li>
            
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Verified Hospitals</span>
              </div>
              {/* No fake data */}
            </li>
            
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                <span className={activeEmergenciesCount > 0 ? "text-brand-red" : ""}>Active Emergencies</span>
              </div>
              {activeEmergenciesCount !== null && (
                <span className={activeEmergenciesCount > 0 ? "text-brand-red font-black" : "text-slate-400 font-bold"}>
                  {activeEmergenciesCount}
                </span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
