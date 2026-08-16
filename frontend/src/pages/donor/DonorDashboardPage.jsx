import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import DonorStatsCards from '../../components/donor/DonorStatsCards';
import SoftBlushWaveBackground from '../../components/donor/SoftBlushWaveBackground';
import IncomingRequestCard from '../../components/donor/IncomingRequestCard';
import DonationHistoryList from '../../components/donor/DonationHistoryList';
import DonorProfileForm from '../../components/donor/DonorProfileForm';
import Footer from '../../components/Footer';
import SearchInput from '../../components/common/SearchInput';
import FilterSelect from '../../components/common/FilterSelect';
import SortDropdown from '../../components/common/SortDropdown';
import PaginationControls from '../../components/common/PaginationControls';
import EmptyState from '../../components/common/EmptyState';
import SkeletonRow from '../../components/common/SkeletonRow';
import {
  HeartPulse,
  User,
  Award,
  Bell,
  RefreshCw,
  AlertCircle,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const URGENCY_OPTIONS = [
  { label: 'All Urgencies', value: 'ALL' },
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'Urgent', value: 'URGENT' },
  { label: 'High', value: 'HIGH' },
  { label: 'Normal', value: 'NORMAL' },
];

const DONOR_SORT_OPTIONS = [
  { label: 'Nearest Distance', value: 'distance' },
  { label: 'Highest Urgency', value: 'urgency' },
  { label: 'Required Date', value: 'requiredDate' },
  { label: 'Recently Created', value: 'createdAt' },
];

export default function DonorDashboardPage() {
  const { user, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState('overview'); // overview | profile | history
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [history, setHistory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [filters, setFilters] = useState({
    search: '',
    urgency: 'ALL',
    bloodGroup: 'ALL',
    sortBy: 'distance',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch initial Donor Data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, historyRes, requestsRes] = await Promise.all([
        donorService.getProfile(),
        donorService.getDonationHistory(),
        donorService.getIncomingRequests(filters),
      ]);

      if (profileRes.success) setProfileData(profileRes.data.profile);
      if (historyRes.success) setHistory(historyRes.data.history || []);
      if (requestsRes.success) {
        setRequests(requestsRes.data.requests || []);
        if (requestsRes.data.pagination) {
          setPagination(requestsRes.data.pagination);
        }
      }
    } catch (err) {
      console.error('[Donor Dashboard Load Error]:', err);
      setErrorMsg(err.message || 'Failed to load donor dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Availability Toggle Switch
  const handleToggleAvailability = async () => {
    if (!profileData) return;
    const nextState = !profileData.isAvailable;

    setProfileData((prev) => ({ ...prev, isAvailable: nextState }));
    setIsUpdatingAvailability(true);

    try {
      const res = await donorService.toggleAvailability(nextState);
      if (res.success && res.data) {
        setProfileData((prev) => ({ ...prev, isAvailable: res.data.isAvailable }));
        fetchData();
      }
    } catch (err) {
      setProfileData((prev) => ({ ...prev, isAvailable: !nextState }));
      alert('Failed to update availability status. Please try again.');
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  // Handle Profile Save
  const handleSaveProfile = async (updatedFields) => {
    setIsSavingProfile(true);
    try {
      const res = await donorService.updateProfile(updatedFields);
      if (res.success && res.data.profile) {
        setProfileData((prev) => ({ ...prev, ...res.data.profile }));
        fetchData();
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      urgency: 'ALL',
      bloodGroup: 'ALL',
      sortBy: 'distance',
      sortOrder: 'asc',
      page: 1,
      limit: 10,
    });
  };

  // Cinematic Entry Container Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen text-brand-navy flex flex-col justify-between antialiased relative select-none overflow-x-hidden">
      {/* Soft Blush Wave Background */}
      <SoftBlushWaveBackground />

      {/* Main Layout Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-1 p-4 sm:p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto w-full relative z-10"
      >
        {/* Desktop Left Sidebar */}
        <motion.div variants={itemVariants} className="hidden lg:block">
          <DonorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
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
                <DonorSidebar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
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
          <motion.div variants={itemVariants}>
            <DonorHeader
              user={user}
              profile={profileData}
              onToggleAvailability={handleToggleAvailability}
              isUpdatingAvailability={isUpdatingAvailability}
              onLogout={logout}
              onToggleSidebar={() => setIsSidebarOpen(true)}
            />
          </motion.div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={fetchData} className="font-bold underline text-rose-800">
                Retry
              </button>
            </div>
          )}

          {/* KPI Glass Cards */}
          <motion.div variants={itemVariants}>
            <DonorStatsCards profile={profileData} historyCount={history.length} />
          </motion.div>

          {/* Main Content Tabs & Stream */}
          <motion.div
            variants={itemVariants}
            className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6"
          >
            {/* Tab Header Bar */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2.5 px-4 text-xs font-black rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-rose-50 text-brand-red border border-rose-100 shadow-2xs'
                    : 'text-slate-500 hover:text-brand-navy hover:bg-slate-50'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Incoming Requests ({pagination.total || requests.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2.5 px-4 text-xs font-black rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-rose-50 text-brand-red border border-rose-100 shadow-2xs'
                    : 'text-slate-500 hover:text-brand-navy hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile & Location</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`py-2.5 px-4 text-xs font-black rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'bg-rose-50 text-brand-red border border-rose-100 shadow-2xs'
                    : 'text-slate-500 hover:text-brand-navy hover:bg-slate-50'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Donation History ({history.length})</span>
              </button>
            </div>

            {/* Tab Body Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="tab-overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-brand-navy tracking-tight">
                        Active Incoming Emergency Blood Requests
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Compatible requests from verified hospitals matching your blood group ({user?.bloodGroup || profileData?.bloodGroup || 'A+'}).
                      </p>
                    </div>

                    <button
                      onClick={fetchData}
                      className="p-2.5 rounded-2xl border border-slate-200/80 text-slate-500 hover:text-brand-red hover:bg-rose-50 transition-all self-start sm:self-auto shadow-2xs"
                      title="Refresh requests"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Search, Filter & Sort Toolbar */}
                  <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <SearchInput
                      value={filters.search}
                      onChange={(s) => handleFilterChange('search', s)}
                      placeholder="Search hospital name or city..."
                      className="w-full md:w-80"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                      <FilterSelect
                        label="Urgency"
                        value={filters.urgency}
                        onChange={(v) => handleFilterChange('urgency', v)}
                        options={URGENCY_OPTIONS}
                      />

                      <SortDropdown
                        sortBy={filters.sortBy}
                        sortOrder={filters.sortOrder}
                        options={DONOR_SORT_OPTIONS}
                        onSortChange={handleSortChange}
                      />
                    </div>
                  </div>

                  {isLoading ? (
                    <SkeletonRow count={3} type="card" />
                  ) : requests.length === 0 ? (
                    <EmptyState
                      title="No compatible blood requests found"
                      message="You are active on standby. No matching emergency requests found for your active search or filters."
                      onClearFilters={handleClearFilters}
                      icon={HeartPulse}
                    />
                  ) : (
                    <div className="space-y-4">
                      {requests.map((req) => (
                        <IncomingRequestCard key={req.id} request={req} />
                      ))}

                      <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="tab-profile"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <DonorProfileForm
                    profile={profileData}
                    user={user}
                    onSave={handleSaveProfile}
                    isSaving={isSavingProfile}
                  />
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="tab-history"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <DonationHistoryList history={history} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
