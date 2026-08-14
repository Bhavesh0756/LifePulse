import React, { useState } from 'react';
import Card from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { donorService } from '../../services/donorService';
import { Hospital, MapPin, Clock, ShieldCheck, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LockUnlockIcon from '../animations/LockUnlockIcon';
import RadarPing from '../../animations/RadarPing';

export default function IncomingRequestCard({ request }) {
  const [status, setStatus] = useState(request.consentStatus || 'NONE'); // NONE | ACCEPTED | DECLINED
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isCritical = request.urgency === 'CRITICAL';
  const unitsNeeded = request.unitsNeeded || request.unitsRequired || 1;
  const notesText = request.notes || request.reason || 'Emergency blood requirement.';
  const timeAgoText = request.postedTimeAgo || (request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Recently');

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
      <motion.div
        initial={{ filter: 'blur(8px)', opacity: 0, scale: 0.95 }}
        animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} // spring-like custom ease
      >
        <Card variant="elevated" className="p-6 border border-emerald-200 bg-emerald-50/50 relative">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm relative z-10">
              <LockUnlockIcon isUnlocked={true} className="w-6 h-6" />
            </div>
            <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="success">✓ ACCEPTED & CONNECTED</Badge>
              <span className="text-[11px] font-bold text-emerald-700">Consent Shared</span>
            </div>
            <h4 className="text-base font-extrabold text-emerald-950 mb-1">
              You're connected with {request.hospitalName}
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed mb-3">
              Your consent has been recorded. The hospital can now view the contact information you agreed to share for coordination.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/60 px-3 py-1.5 rounded-lg inline-block">
              Request Details: {request.bloodGroup} Blood • {unitsNeeded} Unit(s) • {request.locationAddress || 'Local Area'}
            </div>
          </div>
        </div>
      </Card>
      </motion.div>
    );
  }

  if (status === 'DECLINED') {
    return (
      <Card variant="default" className="p-4 border border-slate-200 opacity-60 bg-slate-50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Request from <strong>{request.hospitalName}</strong> declined.</span>
          <Badge variant="neutral">DECLINED</Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="p-6 border border-slate-200 relative overflow-hidden">
      {isCritical && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-brand-red animate-pulse" />
      )}

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {isCritical ? (
            <RadarPing color="#E11D48" size={60}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-rose-100 text-rose-600 relative z-10">
                <Hospital className="w-6 h-6" />
              </div>
            </RadarPing>
          ) : (
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-amber-100 text-amber-700">
              <Hospital className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={isCritical ? 'danger' : 'warning'}>
                {request.urgency} EMERGENCY
              </Badge>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgoText}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-brand-navy">{request.hospitalName}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-100 rounded-xl text-center">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Required</span>
            <span className="block text-sm font-black text-brand-red">{request.bloodGroup} ({unitsNeeded} Unit{unitsNeeded > 1 ? 's' : ''})</span>
          </div>
          <div className="px-3 py-1 bg-slate-100 rounded-xl text-center">
            <span className="block text-[10px] uppercase font-bold text-slate-500">Distance</span>
            <span className="block text-xs font-bold text-brand-navy">
              {request.distanceKm !== null && request.distanceKm !== undefined
                ? `${request.distanceKm} km`
                : 'Location unavailable'}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
        "{notesText}"
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <LockUnlockIcon isUnlocked={false} className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Contact info hidden until explicit acceptance</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            onClick={handleDecline}
            className="text-slate-500 hover:text-slate-800"
          >
            Decline
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={isSubmitting ? RefreshCw : CheckCircle}
            disabled={isSubmitting}
            onClick={handleAccept}
            className={isSubmitting ? 'animate-spin' : ''}
          >
            {isSubmitting ? 'Connecting...' : 'Accept & Connect'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
