import React from 'react';
import Card from '../Card';
import { Badge } from '../Badge';
import { HeartPulse, MapPin, ShieldCheck, Lock, CheckCircle2, Phone, Mail, UserCheck } from 'lucide-react';

export default function DonorMatchCard({ match, rank = 1 }) {
  const isConsentUnlocked = match.contactUnlocked || match.consentStatus === 'ACCEPTED';

  return (
    <Card
      variant="elevated"
      className={`p-6 border relative overflow-hidden transition-all ${
        isConsentUnlocked ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
      }`}
    >
      {rank === 1 && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-brand-red to-blue-500" />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {/* Donor Identity Summary */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              isConsentUnlocked ? 'bg-emerald-500 text-white' : 'bg-brand-red/10 text-brand-red'
            }`}
          >
            {isConsentUnlocked ? <UserCheck className="w-6 h-6" /> : <HeartPulse className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-brand-navy text-white font-mono text-xs font-bold">
                Rank #{rank}
              </span>
              <Badge variant="brand" className="font-extrabold">
                {match.bloodGroup} Blood Type
              </Badge>
              {isConsentUnlocked ? (
                <Badge variant="success" className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CONSENT RECEIVED</span>
                </Badge>
              ) : (
                <Badge variant="success" className="text-[10px]">
                  {match.eligibilityStatus === 'ELIGIBLE' ? 'ELIGIBLE DONOR' : match.eligibilityStatus}
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-extrabold text-brand-navy">
              {isConsentUnlocked ? match.donorName : `Anonymous Candidate (Donor #${rank})`}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1 font-semibold text-brand-navy">
                <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                {match.approxDistanceKm !== null && match.approxDistanceKm !== undefined
                  ? `Approx. ${match.approxDistanceKm} km away`
                  : '📍 Distance unavailable'}
              </span>
              <span>• {match.city}</span>
            </div>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400">Match Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-brand-navy">{match.matchScore}</span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
        </div>
      </div>

      {/* UNLOCKED CONTACT DETAILS PANEL (If Consent Received) */}
      {isConsentUnlocked ? (
        <div className="mb-4 p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 border-b border-emerald-100 pb-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Contact Unlocked with Donor Permission</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700">
              {match.consentGivenAt ? `Accepted ${new Date(match.consentGivenAt).toLocaleTimeString()}` : 'Live Consent'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/60 font-semibold text-emerald-950">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Phone: <strong className="font-mono text-sm">{match.phone}</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/60 font-semibold text-emerald-950">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Email: <strong className="font-mono text-xs">{match.email}</strong></span>
            </div>
          </div>
        </div>
      ) : (
        /* Match Score Factors Breakdown (Before Consent) */
        <div className="mb-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
          <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">
            Transparent Match Factors:
          </span>
          <div className="flex flex-wrap gap-2">
            {match.matchFactors?.map((factor, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                  factor.passed
                    ? 'bg-white text-emerald-800 border-emerald-200'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{factor.label} (+{factor.score} pts)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Strict Privacy Boundary Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          {isConsentUnlocked ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span>
            {isConsentUnlocked
              ? 'Donor consent received. Contact details unlocked for direct dispatch.'
              : '🔒 Contact information remains private until donor consent'}
          </span>
        </div>

        <span className="text-[11px] font-semibold text-emerald-700">
          {isConsentUnlocked ? '✓ Consent Verified' : 'Privacy Protected'}
        </span>
      </div>
    </Card>
  );
}
