import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import SoftBlushWaveBackground from '../../components/donor/SoftBlushWaveBackground';
import DonationHistoryList from '../../components/donor/DonationHistoryList';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import {
  Award,
  Heart,
  Droplet,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function DonorHistoryPage() {
  const { user, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, historyRes] = await Promise.all([
        donorService.getProfile(),
        donorService.getDonationHistory(),
      ]);

      if (profileRes.success) setProfileData(profileRes.data.profile);
      if (historyRes.success) setHistory(historyRes.data.history || []);
    } catch (err) {
      console.error('[Donor History Load Error]:', err);
      setErrorMsg(err.message || 'Failed to load donation history.');
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

  const totalDonations = history.length;
  const totalUnits = history.reduce((sum, item) => sum + (Number(item.unitsDonated) || 1), 0);
  const livesSaved = totalDonations > 0 ? totalDonations * 3 : 0;

  return (
    <div className="min-h-screen text-brand-navy flex flex-col justify-between antialiased relative select-none overflow-x-hidden">
      <SoftBlushWaveBackground />

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-1 p-4 sm:p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto w-full relative z-10"
      >
        <div className="hidden lg:block">
          <DonorSidebar activeRoute="/donor/history" />
        </div>

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
                  activeRoute="/donor/history"
                  onCloseMobile={() => setIsSidebarOpen(false)}
                  className="h-full shadow-2xl"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 space-y-6 overflow-hidden">
          <DonorHeader
            user={user}
            profile={profileData}
            onToggleAvailability={handleToggleAvailability}
            isUpdatingAvailability={isUpdatingAvailability}
            onLogout={logout}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />

          <div className="flex items-center justify-between">
            <a
              href="/donor/dashboard"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-brand-red transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={fetchData} className="font-bold underline text-rose-800">
                Retry
              </button>
            </div>
          )}

          {/* Top History Summary KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="elevated" className="p-5 border border-slate-200/80 bg-white/90 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-brand-red flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Total Completed</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy">{totalDonations} Donations</div>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-5 border border-slate-200/80 bg-white/90 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-brand-red flex items-center justify-center shrink-0">
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Units Contributed</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy">{totalUnits} Units</div>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-5 border border-slate-200/80 bg-white/90 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Impact</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{livesSaved} Lives Saved</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Donation History List Section */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-navy tracking-tight">
                  Verified Donation Records
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Complete historical record of hospital donations, verified digital certificates, and dates.
                </p>
              </div>
            </div>

            <DonationHistoryList history={history} />
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
