import React, { useState } from 'react';
import { Button } from '../Button';
import { donorService } from '../../services/donorService';
import {
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  HeartPulse,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function IncomingRequestCard({ request }) {
  const [status, setStatus] = useState(request.consentStatus || 'NONE'); // NONE | ACCEPTED | DECLINED
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isCritical = request.urgency === 'CRITICAL' || request.urgency === 'URGENT';
  const unitsNeeded = request.unitsNeeded || request.unitsRequired || 1;
  const hospitalName = request.hospitalName || 'Verified Medical Center';
  const locationText = request.locationAddress || request.city || 'Chembur, Mumbai';
  const distanceText = request.distanceKm !== null && request.distanceKm !== undefined
    ? `${request.distanceKm} km away`
    : '2.1 km away';

  const handleAccept = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await donorService.acceptRequest(request.id);
      if (res.success) {
        setStatus('ACCEPTED');
      }
    } catch (err) {
      console.error('[Accept Request Error]:', err);
      setErrorMsg(err.message || 'Failed to record consent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await donorService.declineRequest(request.id);
      if (res.success) {
        setStatus('DECLINED');
      }
    } catch (err) {
      console.error('[Decline Request Error]:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'ACCEPTED') {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 shadow-xs relative">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                ✓ ACCEPTED & CONNECTED
              </span>
              <span className="text-[11px] font-bold text-emerald-700">Consent Shared</span>
            </div>
            <h4 className="text-base font-extrabold text-emerald-950 mb-1">
              You're connected with {hospitalName}
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed mb-2">
              Your consent has been recorded. The hospital can now view your shared contact details for urgent coordination.
            </p>
            <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 px-3 py-1 rounded-xl inline-block">
              Request Details: {request.bloodGroup || 'A+'} Blood • {unitsNeeded} Unit(s) • {locationText}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'DECLINED') {
    return (
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-4 flex items-center justify-between opacity-70">
        <span className="text-xs text-slate-500 font-medium">
          Request from <strong className="text-slate-700">{hospitalName}</strong> declined.
        </span>
        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-slate-200 text-slate-600">
          DECLINED
        </span>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white/90 backdrop-blur-md rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-md ${
        isCritical
          ? 'border-rose-300/80 ring-1 ring-rose-100 shadow-[0_4px_20px_rgba(225,29,72,0.08)]'
          : 'border-slate-200/80'
      }`}
    >
      {/* Top Accent Bar for Critical */}
      {isCritical && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-red animate-pulse" />
      )}

      {errorMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Hospital Name, Location, Distance */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-rose-50 text-brand-red border border-rose-200/80 inline-block">
              EMERGENCY
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-brand-navy leading-tight">
            {hospitalName}
          </h3>

          <div className="flex flex-col space-y-1 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{locationText}</span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-red font-bold">
              <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
              <span>{distanceText}</span>
            </div>
          </div>
        </div>

        {/* Center Column: Blood Group & Units Needed */}
        <div className="md:col-span-4 border-y md:border-y-0 md:border-x border-slate-100 py-3 md:py-0 md:px-6 grid grid-cols-2 gap-4">
          <div>
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Blood Group
            </span>
            <div className="text-2xl font-black text-brand-navy">
              {request.bloodGroup || 'A+'}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 mt-1">
              <span>You're a Match!</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            </div>
          </div>

          <div>
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Units Needed
            </span>
            <div className="text-xl font-black text-brand-navy">
              {unitsNeeded} Unit{unitsNeeded > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Right Column: Urgency & Action Button */}
        <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end space-y-3">
          <div className="text-left md:text-right">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
              Urgently Needed
            </span>
            <div className="text-base font-black text-brand-red">
              {request.urgency || 'ASAP'}
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-100 text-brand-red inline-block mt-0.5">
              Very Critical
            </span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="ghost"
              size="sm"
              disabled={isSubmitting}
              onClick={handleDecline}
              className="text-slate-400 hover:text-slate-600 rounded-2xl text-xs font-extrabold"
            >
              Decline
            </Button>

            <motion.div
              animate={isCritical ? { scale: [1, 1.03, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
              className="w-full md:w-auto"
            >
              <Button
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                onClick={handleAccept}
                className="w-full md:w-auto bg-brand-red hover:bg-rose-700 text-white rounded-2xl px-5 py-2.5 shadow-md shadow-rose-200 text-xs font-black"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  'Respond Now'
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
