import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, HeartPulse, ChevronDown } from 'lucide-react';

export default function LiveDonorNetworkMap({ donors = [], onSelectDonor }) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('A+');
  const [selectedRadius, setSelectedRadius] = useState('25 km');
  const [activeDonorHover, setActiveDonorHover] = useState(null);

  const defaultDonors = [
    { id: 1, name: 'Rahul S.', bloodGroup: 'A+', distanceKm: 1.2, status: 'AVAILABLE', x: 28, y: 32, location: 'Andheri' },
    { id: 2, name: 'Priya M.', bloodGroup: 'A+', distanceKm: 2.5, status: 'AVAILABLE', x: 50, y: 18, location: 'Borivali' },
    { id: 3, name: 'Arjun K.', bloodGroup: 'A+', distanceKm: 3.1, status: 'AVAILABLE', x: 74, y: 38, location: 'Powai' },
    { id: 4, name: 'Sneha P.', bloodGroup: 'A+', distanceKm: 4.1, status: 'ON_THE_WAY', x: 68, y: 65, location: 'Chembur' },
    { id: 5, name: 'Vikram T.', bloodGroup: 'A+', distanceKm: 4.6, status: 'AVAILABLE', x: 44, y: 78, location: 'Dadar' },
    { id: 6, name: 'Karan V.', bloodGroup: 'O+', distanceKm: 5.2, status: 'AVAILABLE', x: 32, y: 62, location: 'Bandra' },
  ];

  const displayDonors = donors.length > 0 ? donors : defaultDonors;

  const filteredDonors = displayDonors.filter((d) => {
    const matchGroup = selectedBloodGroup === 'ALL' || d.bloodGroup === selectedBloodGroup;
    return matchGroup;
  });

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-[460px] relative overflow-hidden select-none">
      {/* Compact Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold text-brand-navy flex items-center gap-2">
              <span>Live Donor Network</span>
              <HeartPulse className="w-4 h-4 text-brand-red" />
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time healthcare command network
          </p>
        </div>

        {/* Filter Controls Aligned Right */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-brand-navy text-xs font-bold py-1.5 px-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red cursor-pointer"
            >
              <option value="ALL">All Groups</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
              <option value="O-">O-</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-brand-navy text-xs font-bold py-1.5 px-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red cursor-pointer"
            >
              <option value="5 km">5 km</option>
              <option value="15 km">15 km</option>
              <option value="25 km">25 km</option>
              <option value="50 km">50 km</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Map Visualization Area - Occupies majority of card */}
      <div className="relative flex-1 w-full rounded-2xl bg-[#F6F8FA] border border-slate-200/70 overflow-hidden">
        {/* SVG Styled Medical Map Grid */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.75" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />

          {/* Map Land Shape Accents */}
          <path d="M 0 100 Q 150 180 300 120 T 600 200 T 900 150 V 400 H 0 Z" fill="#EFF6FF" opacity="0.6" />
          <path d="M 200 0 Q 350 100 500 40 T 800 90 V 0 H 200 Z" fill="#F0FDF4" opacity="0.5" />

          {/* Concentric Radar Rings around Hospital Pin */}
          <circle cx="50%" cy="50%" r="55" fill="none" stroke="#FDA4AF" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="50%" cy="50%" r="105" fill="none" stroke="#FDA4AF" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="155" fill="none" stroke="#FDA4AF" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="6 6" />

          {/* Slow Ambient Radar Expanding Pulse (3.5s loop) */}
          {!shouldReduceMotion && (
            <motion.circle
              cx="50%"
              cy="50%"
              r="60"
              fill="none"
              stroke="#E11D48"
              strokeWidth="1.5"
              initial={{ opacity: 0.7, r: 40 }}
              animate={{ opacity: 0, r: 145 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </svg>

        {/* Location Labels (Mumbai Landmarks) */}
        <div className="absolute top-[16%] left-[48%] text-[10px] font-bold text-slate-400 select-none">Borivali</div>
        <div className="absolute top-[34%] left-[24%] text-[10px] font-bold text-slate-400 select-none">Andheri</div>
        <div className="absolute top-[36%] left-[72%] text-[10px] font-bold text-slate-400 select-none">Powai</div>
        <div className="absolute top-[60%] left-[28%] text-[10px] font-bold text-slate-400 select-none">Bandra</div>
        <div className="absolute top-[64%] left-[68%] text-[10px] font-bold text-slate-400 select-none">Ghatkopar / Chembur</div>
        <div className="absolute top-[78%] left-[42%] text-[10px] font-bold text-slate-400 select-none">Dadar</div>

        {/* CENTER HOSPITAL PIN (Command Center Pin) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative flex items-center justify-center">
            {!shouldReduceMotion && (
              <span className="absolute w-12 h-12 rounded-full bg-brand-red/20 animate-ping opacity-75" />
            )}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-red to-brand-crimson text-white flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-105 transition-transform cursor-pointer">
              <HeartPulse className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* LIVE DONOR MARKERS */}
        {filteredDonors.map((donor) => {
          const isAvailable = donor.status === 'AVAILABLE';
          const isHovered = activeDonorHover === donor.id;

          return (
            <div
              key={donor.id}
              style={{ left: `${donor.x}%`, top: `${donor.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
              onMouseEnter={() => setActiveDonorHover(donor.id)}
              onMouseLeave={() => setActiveDonorHover(null)}
              onClick={() => onSelectDonor && onSelectDonor(donor)}
            >
              <div className="relative group flex flex-col items-center">
                {/* Hover Tooltip Popup */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-11 bg-brand-navy text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap z-40 border border-slate-700"
                  >
                    <div>{donor.name} • {donor.bloodGroup}</div>
                    <div className="text-[9px] font-medium text-slate-300">{donor.distanceKm} km away • {isAvailable ? 'Available' : 'On The Way'}</div>
                  </motion.div>
                )}

                {/* Donor Avatar Circle Pin */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-rose-300 p-0.5 shadow-md flex items-center justify-center overflow-hidden hover:scale-110 transition-transform">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-navy to-slate-700 text-white flex items-center justify-center font-bold text-[10px]">
                      {donor.name.charAt(0)}
                    </div>
                  </div>

                  {/* Status Breathing Dot */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  >
                    {!shouldReduceMotion && isAvailable && (
                      <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-pulse" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Map Legend at Bottom-Left */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 text-[10px] font-bold text-brand-navy z-20">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live & Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>On The Way</span>
          </div>
        </div>
      </div>
    </div>
  );
}
