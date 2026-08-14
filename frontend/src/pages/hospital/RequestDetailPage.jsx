import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitalService } from '../../services/hospitalService';
import HospitalHeader from '../../components/hospital/HospitalHeader';
import DonorMatchCard from '../../components/hospital/DonorMatchCard';
import Container from '../../components/Container';
import Card from '../../components/Card';
import Footer from '../../components/Footer';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  AlertCircle,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Lock,
  UserCheck,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RequestDetailPage() {
  const { user, logout } = useAuth();
  const requestId = window.location.pathname.split('/hospital/requests/')[1];

  const [profile, setProfile] = useState(null);
  const [request, setRequest] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [unitsInput, setUnitsInput] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, requestRes] = await Promise.all([
        hospitalService.getHospitalProfile(),
        hospitalService.getBloodRequest(requestId),
      ]);

      if (profileRes.success) setProfile(profileRes.data.profile);
      if (requestRes.success) {
        setRequest(requestRes.data.request);
        setUnitsInput(requestRes.data.request.unitsFulfilled);
      }
    } catch (err) {
      console.error('[Load Request Detail Error]:', err);
      setErrorMsg(err.message || 'Failed to fetch blood request details.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMatches = async () => {
    setIsLoadingMatches(true);
    try {
      const res = await hospitalService.getBloodRequestMatches(requestId);
      if (res.success) {
        setMatchData(res.data);
      }
    } catch (err) {
      console.warn('[Load Matches Notice]:', err.message);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      loadData();
      loadMatches();
    }
  }, [requestId]);

  // Update Units Fulfilled Handler
  const handleUpdateFulfillment = async () => {
    if (!request) return;
    setErrorMsg('');
    setSuccessMsg('');

    if (unitsInput < 0 || unitsInput > request.unitsRequired) {
      setErrorMsg(`Units fulfilled must be between 0 and ${request.unitsRequired}.`);
      return;
    }

    setIsUpdating(true);
    try {
      const res = await hospitalService.updateBloodRequest(request._id, {
        unitsFulfilled: Number(unitsInput),
      });
      if (res.success) {
        setRequest(res.data.request);
        setSuccessMsg(`Fulfillment updated: ${res.data.request.unitsFulfilled} / ${res.data.request.unitsRequired} units (${res.data.request.status})`);
        loadMatches(); // Refresh match candidates
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update fulfillment status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel Request Handler
  const handleCancelRequest = async () => {
    if (!window.confirm('Are you sure you want to cancel this blood request?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsUpdating(true);

    try {
      const res = await hospitalService.cancelBloodRequest(request._id);
      if (res.success) {
        setRequest(res.data.request);
        setSuccessMsg('Blood request has been cancelled.');
        loadMatches();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to cancel blood request.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'FULFILLED':
        return <Badge variant="success">FULFILLED</Badge>;
      case 'PARTIALLY_FULFILLED':
        return <Badge variant="warning">PARTIALLY FULFILLED</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">CANCELLED</Badge>;
      default:
        return <Badge variant="info">OPEN</Badge>;
    }
  };

  const isMatchingAvailable = request?.status === 'OPEN' || request?.status === 'PARTIALLY_FULFILLED';

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between antialiased">
      <HospitalHeader user={user} profile={profile} onLogout={logout} currentPath="/hospital/requests" />

      <main className="flex-grow py-8">
        <Container size="md">
          <div className="mb-6">
            <a
              href="/hospital/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-red transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-brand-navy">
              <RefreshCw className="w-8 h-8 text-brand-red animate-spin" />
              <span className="text-sm font-semibold">Loading Request Details...</span>
            </div>
          ) : errorMsg && !request ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm max-w-lg mx-auto text-center my-12">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-600" />
              <p className="font-bold mb-3">{errorMsg}</p>
              <a
                href="/hospital/dashboard"
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-black transition-all inline-block"
              >
                Return to Dashboard
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Main Request Information Card */}
              <Card variant="elevated" className="p-8 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {getStatusBadge(request.status)}
                      <Badge variant={request.urgency === 'CRITICAL' ? 'danger' : 'warning'}>
                        {request.urgency} URGENCY
                      </Badge>
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        Patient Ref: {request.patientReference}
                      </span>
                    </div>

                    <h1 className="text-3xl font-black text-brand-navy">
                      {request.bloodGroup} Blood Request
                    </h1>
                    <span className="text-xs text-brand-slate block mt-1">
                      Posted by {request.hospitalName} on {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {request.status !== 'CANCELLED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelRequest}
                      disabled={isUpdating}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      icon={XCircle}
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>

                {/* Grid Info Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block font-bold text-slate-400 mb-1">Units Required</span>
                    <span className="text-2xl font-black text-brand-navy">{request.unitsRequired} Units</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block font-bold text-slate-400 mb-1">Units Received</span>
                    <span className="text-2xl font-black text-emerald-600">{request.unitsFulfilled} Units</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block font-bold text-slate-400 mb-1">Remaining Units</span>
                    <span className="text-2xl font-black text-brand-red">
                      {Math.max(request.unitsRequired - request.unitsFulfilled, 0)} Units
                    </span>
                  </div>
                </div>

                {/* Reason & Location */}
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block font-bold text-slate-400 mb-1">Reason for Request</span>
                    <p className="font-semibold text-brand-navy leading-relaxed">{request.reason}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-brand-red shrink-0" />
                      <div>
                        <span className="block font-bold text-slate-400">Required Date</span>
                        <span className="font-extrabold text-brand-navy">
                          {new Date(request.requiredDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-brand-red shrink-0" />
                      <div>
                        <span className="block font-bold text-slate-400">Location</span>
                        <span className="font-extrabold text-brand-navy">
                          {request.location?.city}, {request.location?.state}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* SMART DONOR MATCHING SECTION (OPEN / PARTIALLY_FULFILLED ONLY) */}
              {isMatchingAvailable ? (
                <Card variant="elevated" className="p-8 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-brand-navy tracking-tight">
                        Smart Donor Matching
                      </h2>
                      <p className="text-xs text-brand-slate max-w-xl mt-1 leading-relaxed">
                        Compatible donor candidates ranked by blood-group compatibility, availability, eligibility, and proximity.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadMatches}
                        disabled={isLoadingMatches}
                        icon={RefreshCw}
                        className={isLoadingMatches ? 'animate-spin' : ''}
                      >
                        Refresh Matches
                      </Button>
                    </div>
                  </div>

                  {/* Medical Disclaimer Banner */}
                  {matchData?.medicalDisclaimer && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{matchData.medicalDisclaimer}</span>
                    </div>
                  )}

                  {/* Match Results Feed */}
                  {isLoadingMatches ? (
                    <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 text-brand-red animate-spin" />
                      <span>Finding compatible donor matches...</span>
                    </div>
                  ) : !matchData || matchData.matches?.length === 0 ? (
                    <div className="p-8 bg-slate-50 rounded-2xl text-center border border-slate-100">
                      <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-brand-navy mb-1">No Compatible Donors Available</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        No active donors currently match blood group <strong className="text-brand-navy">{request.bloodGroup}</strong> with active availability and eligible status.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                        <span>Found <strong className="text-brand-navy">{matchData.totalMatchesCount}</strong> compatible donor candidates</span>
                        <span>Ranked by Match Score</span>
                      </div>

                      {matchData.matches.map((matchItem, idx) => (
                        <DonorMatchCard key={matchItem.donorId} match={matchItem} rank={idx + 1} />
                      ))}
                    </div>
                  )}
                </Card>
              ) : (
                /* Clean Message for FULFILLED or CANCELLED Requests */
                <Card variant="default" className="p-8 border border-slate-200 bg-slate-50 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-3">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-brand-navy mb-1">
                    {request.status === 'CANCELLED' ? 'Request Cancelled' : 'Request Fulfilled'}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    {request.status === 'CANCELLED'
                      ? 'Donor matching is unavailable because this request has been cancelled.'
                      : 'Donor matching is no longer required because this request has been fulfilled.'}
                  </p>
                </Card>
              )}

              {/* Fulfillment Management Section */}
              {request.status !== 'CANCELLED' && (
                <Card variant="elevated" className="p-6 border border-slate-200">
                  <h3 className="text-base font-bold text-brand-navy mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Fulfillment Status Management</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Update units received to manage fulfillment state transitions ({request.unitsFulfilled} / {request.unitsRequired} units fulfilled).
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 max-w-md">
                    <div className="w-full sm:w-48">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Units Fulfilled (0 – {request.unitsRequired})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={request.unitsRequired}
                        value={unitsInput}
                        onChange={(e) => setUnitsInput(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleUpdateFulfillment}
                      disabled={isUpdating}
                      className="w-full sm:w-auto mt-4 sm:mt-0"
                    >
                      {isUpdating ? 'Updating...' : 'Update Fulfillment'}
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
