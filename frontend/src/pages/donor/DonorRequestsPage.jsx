import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import SoftBlushWaveBackground from '../../components/donor/SoftBlushWaveBackground';
import IncomingRequestCard from '../../components/donor/IncomingRequestCard';
import Footer from '../../components/Footer';
import SearchInput from '../../components/common/SearchInput';
import FilterSelect from '../../components/common/FilterSelect';
import SortDropdown from '../../components/common/SortDropdown';
import PaginationControls from '../../components/common/PaginationControls';
import EmptyState from '../../components/common/EmptyState';
import SkeletonRow from '../../components/common/SkeletonRow';
import {
  HeartPulse,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Filter,
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

export default function DonorRequestsPage() {
  const { user, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
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
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, requestsRes] = await Promise.all([
        donorService.getProfile(),
        donorService.getIncomingRequests(filters),
      ]);

      if (profileRes.success) setProfileData(profileRes.data.profile);
      if (requestsRes.success) {
        setRequests(requestsRes.data.requests || []);
        if (requestsRes.data.pagination) {
          setPagination(requestsRes.data.pagination);
        }
      }
    } catch (err) {
      console.error('[Donor Requests Load Error]:', err);
      setErrorMsg(err.message || 'Failed to load blood requests.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

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
          <DonorSidebar activeRoute="/donor/requests" />
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
                  activeRoute="/donor/requests"
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
              className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-brand-red transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Filter className="w-3.5 h-3.5 text-brand-red" />
              <span>{pagination.total || requests.length} Requests Available</span>
            </div>
          </div>

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

          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-brand-navy tracking-tight">
                  Emergency Blood Requests Management
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Browse and respond to emergency blood requests matching your group ({user?.bloodGroup || profileData?.bloodGroup || 'A+'}).
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
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
