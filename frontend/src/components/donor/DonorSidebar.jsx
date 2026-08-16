import React from 'react';
import LifePulseLogo from '../../assets/logo/LifePulseLogo';
import { motion, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Bell,
  User,
  History,
  Award,
  Settings,
  X,
} from 'lucide-react';

export default function DonorSidebar({
  activeRoute = '/donor/dashboard',
  className = '',
  onCloseMobile,
}) {
  const shouldReduceMotion = useReducedMotion();
  const currentPath = window.location.pathname;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/donor/dashboard' },
    { id: 'requests', label: 'Requests', icon: Bell, path: '/donor/requests' },
    { id: 'profile', label: 'My Profile', icon: User, path: '/donor/profile' },
    { id: 'history', label: 'History', icon: History, path: '/donor/history' },
    { id: 'badges', label: 'Badges', icon: Award, path: '/donor/badges' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/donor/settings' },
  ];

  const ecgPath = 'M0 25 H30 L35 15 L40 35 L45 5 L50 45 L55 20 L60 30 L65 25 H120';

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
      {/* Top Header & Brand */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-1">
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

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPath === item.path ||
              (item.path === '/donor/dashboard' && (currentPath === '/donor' || currentPath === '/donor/'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-50 text-brand-red border border-rose-100 shadow-xs'
                    : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-red' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hero Bottom Card with Continuous ECG Heartbeat Animation */}
      <div className="mt-8 pt-4">
        <div className="bg-gradient-to-br from-rose-50/70 via-white to-rose-50/40 border border-rose-100/80 rounded-2xl p-4 relative overflow-hidden shadow-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <h4 className="text-xs font-black text-brand-navy">You're a Hero!</h4>
            <span className="text-sm animate-pulse">❤️</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-3">
            Thank you for saving lives.
          </p>

          {/* Continuous ECG Animated Heartbeat Line */}
          <div className="h-9 w-full flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full text-brand-red overflow-visible" viewBox="0 0 120 50" fill="none">
              <defs>
                <filter id="heroEcgGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Static Background Path */}
              <path
                d={ecgPath}
                stroke="#E11D48"
                strokeWidth="1.8"
                strokeOpacity="0.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Self-drawing Continuous Heartbeat Wave Path */}
              {!shouldReduceMotion && (
                <motion.path
                  d={ecgPath}
                  stroke="#E11D48"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#heroEcgGlow)"
                  initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 0.45, 0.45, 0],
                    pathOffset: [0, 0, 0.55, 1],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 3.0,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}
