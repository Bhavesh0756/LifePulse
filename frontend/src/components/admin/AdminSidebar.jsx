import React, { useState, useEffect } from 'react';
import LifePulseLogo from '../../assets/logo/LifePulseLogo';
import { motion, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  HeartPulse,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  onTabChange,
  pendingHospitalsCount = 0,
  openRequestsCount = 0,
  user,
  onLogout,
  isCollapsed = false,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  const navItems = [
    {
      id: 'analytics',
      label: 'Dashboard & Analytics',
      icon: LayoutDashboard,
    },
    {
      id: 'hospitals',
      label: 'Hospitals Verification',
      icon: Building2,
      badge: pendingHospitalsCount > 0 ? pendingHospitalsCount : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'users',
      label: 'Users Directory',
      icon: Users,
    },
    {
      id: 'requests',
      label: 'Blood Requests',
      icon: HeartPulse,
      badge: openRequestsCount > 0 ? openRequestsCount : null,
      badgeColor: 'bg-brand-red text-white',
    },
  ];

  const ecgPath = 'M0 15 H40 L45 5 L50 25 L55 0 L60 30 L65 10 L70 20 L75 15 H120';

  const handleProfileClick = () => {
    window.location.href = '/admin/profile';
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col justify-start p-4 select-none shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      {/* Brand & Header */}
      <div className="space-y-6">
        <div className={`px-2 pt-2 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? (
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-brand-red flex items-center justify-center font-black text-lg border border-rose-200">
              LP
            </div>
          ) : (
            <>
              <LifePulseLogo size="md" />
              <span className="block text-[10px] font-extrabold tracking-widest text-slate-400 uppercase mt-1">
                Every Drop Saves Lives
              </span>
            </>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-extrabold tracking-wider uppercase text-slate-400 block mb-2">
              Main Navigation
            </span>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                } rounded-2xl text-xs font-extrabold transition-all duration-200 active:scale-[0.98] relative group ${
                  isActive
                    ? 'bg-rose-50 text-brand-red border border-rose-100 shadow-sm'
                    : 'text-slate-600 hover:text-brand-navy hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-red' : 'text-slate-400'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isCollapsed ? 'absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px]' : ''
                    } ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Utility Section: System Status + Admin Profile (Fixed 24-40px spacing from Navigation) */}
      <div className="mt-8 space-y-4">
        {/* Signature System Status Card */}
        <div className="pt-4 border-t border-slate-100">
          {isCollapsed ? (
            <div
              title="System Status: All systems operational"
              className="flex justify-center items-center py-2"
            >
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981] animate-pulse" />
            </div>
          ) : (
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      boxShadow: [
                        '0 1px 2px rgba(0,0,0,0.05)',
                        '0 1px 2px rgba(0,0,0,0.05)',
                        '0 0 16px rgba(16,185,129,0.28)',
                        '0 1px 2px rgba(0,0,0,0.05)',
                      ],
                    }
              }
              transition={{
                duration: 4.0,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.6, 0.75, 1],
              }}
              className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-3.5 space-y-2.5 transition-all duration-300 group hover:bg-emerald-50/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center relative">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-brand-navy">System Status</span>
                    <span className="block text-[10px] text-emerald-600 font-bold">All systems operational</span>
                  </div>
                </div>

                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }
                  }
                  transition={{
                    duration: 2.0,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] shrink-0"
                />
              </div>

              <div className="h-7 w-full flex items-center justify-center relative overflow-hidden">
                <svg className="w-full h-full text-emerald-500 overflow-visible" viewBox="0 0 120 30" fill="none">
                  <defs>
                    <filter id="emeraldPulseGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d={ecgPath}
                    stroke="#10B981"
                    strokeWidth="1.8"
                    strokeOpacity="0.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {!shouldReduceMotion && (
                    <motion.path
                      d={ecgPath}
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#emeraldPulseGlow)"
                      initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                      animate={{
                        pathLength: [0, 0.35, 0.35, 0],
                        pathOffset: [0, 0, 0.65, 1],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 4.0,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        times: [0, 0.2, 0.6, 0.75],
                      }}
                    />
                  )}
                </svg>
              </div>
            </motion.div>
          )}
        </div>

        {/* Dedicated Admin Profile Section */}
        <div className="pt-2 border-t border-slate-100 relative">
          {isCollapsed ? (
            <button
              onClick={handleProfileClick}
              title="Admin Profile"
              className="w-full flex justify-center py-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-black text-sm shadow-xs border-2 border-brand-red group-hover:scale-105 transition-transform">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </button>
          ) : (
            <button
              onClick={handleProfileClick}
              className="w-full bg-slate-50 hover:bg-rose-50/50 border border-slate-200/80 hover:border-rose-200 rounded-2xl p-3 flex items-center justify-between transition-all duration-200 group text-left"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-brand-navy text-white flex items-center justify-center font-black text-sm shadow-xs border border-brand-navy/20 shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="truncate">
                  <span className="block text-xs font-black text-brand-navy truncate">
                    {user?.name || 'System Admin'}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-bold truncate">
                    {user?.role || 'Super Administrator'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-red group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
