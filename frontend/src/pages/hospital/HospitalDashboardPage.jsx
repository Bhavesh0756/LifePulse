import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitalService } from '../../services/hospitalService';

// Hospital Layout Components
import HospitalHeader from '../../components/hospital/HospitalHeader';
import HospitalSidebar from '../../components/hospital/HospitalSidebar';
import HospitalOverviewStrip from '../../components/hospital/HospitalOverviewStrip';
import LiveDonorNetworkMap from '../../components/hospital/LiveDonorNetworkMap';
import NearbyDonorsPanel from '../../components/hospital/NearbyDonorsPanel';
import CriticalRequestsPanel from '../../components/hospital/CriticalRequestsPanel';
import BloodInventorySnapshot from '../../components/hospital/BloodInventorySnapshot';
import HospitalQuickActions from '../../components/hospital/HospitalQuickActions';
import HospitalRecentActivity from '../../components/hospital/HospitalRecentActivity';

import SoftBlushWaveBackground from '../../components/donor/SoftBlushWaveBackground';
import Footer from '../../components/Footer';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function HospitalDashboardPage() {
  const { user, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, requestsRes] = await Promise.all([
        hospitalService.getHospitalProfile().catch((err) => {
          console.error('[Hospital Profile Load Warning]:', err);
          return null;
        }),
        hospitalService.getBloodRequests().catch((err) => {
          console.error('[Hospital Requests Load Warning]:', err);
          return { success: true, data: { requests: [] } };
        }),
      ]);

      if (profileRes && profileRes.success) {
        setProfileData(profileRes.data.profile);
        setStats(profileRes.data.stats);
      }

      if (requestsRes && requestsRes.success) {
        setRequests(requestsRes.data.requests || []);
      }
    } catch (err) {
      console.error('[Hospital Dashboard Load Error]:', err);
      setErrorMsg(err.message || 'Failed to load hospital command center.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen text-brand-navy flex flex-col justify-between antialiased relative select-none overflow-x-hidden">
      {/* Soft Blush Wave Background */}
      <SoftBlushWaveBackground />

      {/* Master Hospital Header */}
      <HospitalHeader
        user={user}
        profile={profileData}
        onLogout={logout}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        currentPath="/hospital/dashboard"
      />

      {/* Main Command Center Layout */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-1 p-4 sm:p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto w-full relative z-10"
      >
        {/* Desktop Left Sidebar */}
        <motion.div variants={itemVariants} className="hidden lg:block shrink-0">
          <HospitalSidebar
            activeRoute="/hospital/dashboard"
            requestCount={requests.length}
          />
        </motion.div>

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
                <HospitalSidebar
                  activeRoute="/hospital/dashboard"
                  requestCount={requests.length}
                  onCloseMobile={() => setIsSidebarOpen(false)}
                  className="h-full shadow-2xl"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Right Main Operational Workspace */}
        <div className="flex-1 space-y-6 overflow-hidden min-w-0">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-brand-navy bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80">
              <RefreshCw className="w-8 h-8 text-brand-red animate-spin" />
              <span className="text-xs font-bold">Initializing Healthcare Operations Center...</span>
            </div>
          ) : errorMsg ? (
            <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 text-xs max-w-lg mx-auto text-center my-12">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-600" />
              <p className="font-bold mb-3">{errorMsg}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all"
              >
                Retry Operations Load
              </button>
            </div>
          ) : (
            <>
              {/* Unverified Hospital Pending Banner */}
              {profileData && !profileData.isVerified && (
                <motion.div
                  variants={itemVariants}
                  className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-xs"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-amber-950 block text-xs mb-0.5">
                      Hospital Verification Pending Clearance
                    </strong>
                    <span>
                      Your healthcare portal is under administrative review. Inspection functions remain active, while emergency blood broadcast creation requires clearance verification.
                    </span>
                  </div>
                </motion.div>
              )}

              {/* 1. TOP KPI ROW (5 Equal Cards) */}
              <motion.div variants={itemVariants}>
                <HospitalOverviewStrip stats={stats} requests={requests} />
              </motion.div>

              {/* 2 & 3. MAIN HERO ROW (Map 8 cols + Nearby Donors 4 cols) */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LIVE DONOR NETWORK MAP (8 COLS) */}
                <div className="lg:col-span-8">
                  <LiveDonorNetworkMap
                    donors={[]}
                    onSelectDonor={() => { window.location.href = '/hospital/requests'; }}
                  />
                </div>

                {/* NEARBY DONORS PANEL (4 COLS) */}
                <div className="lg:col-span-4">
                  <NearbyDonorsPanel
                    donors={[]}
                    onViewAll={() => { window.location.href = '/hospital/requests'; }}
                  />
                </div>
              </motion.div>

              {/* 4-COLUMN LOWER OPERATIONS ROW (EQUAL HEIGHT h-[308px] & PERFECT ALIGNMENT) */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
                {/* 1. CRITICAL REQUESTS (4 COLS = ~33%) */}
                <div className="lg:col-span-4" id="requests">
                  <CriticalRequestsPanel
                    requests={requests}
                    onViewAll={() => { window.location.href = '/hospital/requests'; }}
                  />
                </div>

                {/* 2. BLOOD INVENTORY SNAPSHOT (3 COLS = ~25%) */}
                <div className="lg:col-span-3" id="inventory">
                  <BloodInventorySnapshot />
                </div>

                {/* 3. QUICK ACTIONS (2 COLS = ~17%) */}
                <div className="lg:col-span-2">
                  <HospitalQuickActions isVerified={profileData ? profileData.isVerified : true} />
                </div>

                {/* 4. RECENT ACTIVITY (3 COLS = ~25%) */}
                <div className="lg:col-span-3" id="activity">
                  <HospitalRecentActivity
                    onViewAll={() => { window.location.href = '/hospital/requests'; }}
                  />
                </div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
