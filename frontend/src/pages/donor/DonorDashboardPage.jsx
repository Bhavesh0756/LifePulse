import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import DonorStatsCards from '../../components/donor/DonorStatsCards';
import SoftBlushWaveBackground from '../../components/donor/SoftBlushWaveBackground';
import IncomingRequestCard from '../../components/donor/IncomingRequestCard';
import Footer from '../../components/Footer';
import { Badge } from '../../components/Badge';
import {
  HeartPulse,
  User,
  Award,
  Bell,
  RefreshCw,
  AlertCircle,
  MapPin,
  ShieldCheck,
  ArrowRight,
  History,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function DonorDashboardPage() {
  const { user, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [history, setHistory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, historyRes, requestsRes] = await Promise.all([
        donorService.getProfile(),
        donorService.getDonationHistory(),
        donorService.getIncomingRequests({ limit: 3, page: 1 }),
      ]);

      if (profileRes.success) setProfileData(profileRes.data.profile);
      if (historyRes.success) setHistory(historyRes.data.history || []);
      if (requestsRes.success) {
        setRequests(requestsRes.data.requests || []);
      }
    } catch (err) {
      console.error('[Donor Dashboard Load Error]:', err);
      setErrorMsg(err.message || 'Failed to load donor dashboard overview.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleAvailability = async () => {
    if (!profileData) return;
    const nextState = !profileData.isAvailable;
    setProfileData((prev) => ({ ...prev, isAvailable: nextState }));
    setIsUpdatingAvailability(true);

    try {
      const res = await donorService.toggleAvailability(nextState);
      if (res.success && res.data) {
        setProfileData((prev) => ({ ...prev, isAvailable: res.data.isAvailable }));
      }
    } catch (err) {
      setProfileData((prev) => ({ ...prev, isAvailable: !nextState }));
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  const name = user?.name || profileData?.name || 'Verified Donor';
  const bloodGroup = user?.bloodGroup || profileData?.bloodGroup || 'A+';
  const isAvailable = profileData?.isAvailable ?? true;
  const radius = profileData?.preferredRadiusKm || 25;
  const city = profileData?.address?.city || 'Mumbai';

  return (
    <div className="min-h-screen text-brand-navy flex flex-col justify-between antialiased relative select-none overflow-x-hidden">
      {/* Soft Blush Wave Background */}
      <SoftBlushWaveBackground />

      {/* Main Layout Container */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-1 p-4 sm:p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto w-full relative z-10"
      >
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block">
          <DonorSidebar activeRoute="/donor/dashboard" />
        </div>

        {/* Mobile Sidebar Drawer Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 lg:hidden"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 z-50 p-4 lg:hidden"
              >
                <DonorSidebar
                  activeRoute="/donor/dashboard"
                  onCloseMobile={() => setIsSidebarOpen(false)}
                  className="h-full shadow-2xl"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Dashboard Stream */}
        <div className="flex-1 space-y-6 overflow-hidden">
          {/* Header */}
          <DonorHeader
            user={user}
            profile={profileData}
            onToggleAvailability={handleToggleAvailability}
            isUpdatingAvailability={isUpdatingAvailability}
            onLogout={logout}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between font-medium">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={fetchData} className="font-bold underline text-rose-800">
                Retry
              </button>
            </div>
          )}

          {/* MAIN HIERARCHY ITEM 1: 4 Main KPI Glass Cards */}
          <DonorStatsCards profile={profileData} historyCount={history.length} />

          {/* SECONDARY HIERARCHY ITEM 2: Lightweight, Compact Information Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Secondary 1: Standby Coverage */}
            <div className="bg-white/60 hover:bg-white/95 backdrop-blur-xs border border-slate-200/60 rounded-2xl p-4 transition-all duration-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100/80 text-brand-red flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-brand-navy">Standby Coverage</span>
                    <span className="text-xs text-slate-500 font-medium">{radius} km Radius • {city}</span>
                  </div>
                </div>
                <Badge variant={isAvailable ? 'success' : 'secondary'} className="text-xs">
                  {isAvailable ? 'Active' : 'Paused'}
                </Badge>
              </div>

              <div className="pt-2 border-t border-slate-100/80 flex justify-end">
                <a
                  href="/donor/profile"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
                >
                  <span>Edit Location</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Secondary 2: Historical Records */}
            <div className="bg-white/60 hover:bg-white/95 backdrop-blur-xs border border-slate-200/60 rounded-2xl p-4 transition-all duration-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100/80 text-brand-red flex items-center justify-center shrink-0">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-brand-navy">Historical Records</span>
                    <span className="text-xs text-slate-500 font-medium">{history.length} Verified Logged</span>
                  </div>
                </div>
                <Badge variant="brand" className="text-xs">{history.length} Logged</Badge>
              </div>

              <div className="pt-2 border-t border-slate-100/80 flex justify-end">
                <a
                  href="/donor/history"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
                >
                  <span>View History</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Secondary 3: Achievements */}
            <div className="bg-white/60 hover:bg-white/95 backdrop-blur-xs border border-slate-200/60 rounded-2xl p-4 transition-all duration-200 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-brand-navy">Achievements</span>
                    <span className="text-xs text-slate-500 font-medium">Donor Honors Vault</span>
                  </div>
                </div>
                <Badge variant="success" className="text-xs">Honors Active</Badge>
              </div>

              <div className="pt-2 border-t border-slate-100/80 flex justify-end">
                <a
                  href="/donor/badges"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
                >
                  <span>Explore Badges</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* MAIN OPERATIONAL WORKSPACE: Incoming Emergency Requests Workspace Container */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-brand-red border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-ping" />
                    LIVE OPERATIONAL STREAM
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-navy tracking-tight flex items-center gap-2 pt-1">
                  <Bell className="w-5 h-5 text-brand-red" />
                  <span>Recent Emergency Blood Requests</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Active hospital broadcasts matching your blood group ({bloodGroup}) within {radius} km.
                </p>
              </div>

              <a
                href="/donor/requests"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-red text-white text-xs sm:text-sm font-bold hover:bg-brand-crimson transition-all shadow-sm self-start sm:self-auto"
              >
                <span>View All Requests</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium animate-pulse">
                Loading live operational stream...
              </div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-center text-xs sm:text-sm text-slate-500 font-medium bg-slate-50 rounded-2xl border border-slate-100">
                No active emergency requests found at this moment. You are on active standby.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 2).map((req) => (
                  <IncomingRequestCard key={req.id} request={req} />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
