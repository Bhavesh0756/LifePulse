import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorStatsCards from '../../components/donor/DonorStatsCards';
import IncomingRequestCard from '../../components/donor/IncomingRequestCard';
import DonationHistoryList from '../../components/donor/DonationHistoryList';
import DonorProfileForm from '../../components/donor/DonorProfileForm';
import Container from '../../components/Container';
import Footer from '../../components/Footer';
import SearchInput from '../../components/common/SearchInput';
import FilterSelect from '../../components/common/FilterSelect';
import SortDropdown from '../../components/common/SortDropdown';
import PaginationControls from '../../components/common/PaginationControls';
import EmptyState from '../../components/common/EmptyState';
import SkeletonRow from '../../components/common/SkeletonRow';
import { HeartPulse, User, Award, Bell, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [activeTab, setActiveTab] = useState('overview'); // overview | profile | history
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

  // Fetch all initial Donor data
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
      if (historyRes.success) setHistory(historyRes.data.history);
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

  // Handle Profile Form Save
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

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between antialiased">
      <DonorHeader
        user={user}
        profile={profileData}
        onToggleAvailability={handleToggleAvailability}
        isUpdatingAvailability={isUpdatingAvailability}
        onLogout={logout}
      />

      <main className="flex-grow py-8">
        <Container size="lg">
          {isLoading && !profileData ? (
            <SkeletonRow count={4} type="card" />
          ) : (
            <>
              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                  <button onClick={fetchData} className="font-bold underline text-rose-800">
                    Retry
                  </button>
                </div>
              )}

              {/* Master KPI Stats Grid */}
              <DonorStatsCards user={user} profile={profileData} historyCount={history.length} />

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1 mt-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-3 px-5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'border-brand-red text-brand-red bg-white shadow-sm'
                      : 'border-transparent text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Incoming Requests ({pagination.total || requests.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-3 px-5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'border-brand-red text-brand-red bg-white shadow-sm'
                      : 'border-transparent text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>My Profile & Location</span>
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-3 px-5 text-xs font-extrabold rounded-t-xl transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'history'
                      ? 'border-brand-red text-brand-red bg-white shadow-sm'
                      : 'border-transparent text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Donation History ({history.length})</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="tab-overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">
                          Active Incoming Emergency Blood Requests
                        </h2>
                        <p className="text-xs text-brand-slate">
                          Compatible requests from verified hospitals matching your blood group ({user?.bloodGroup}).
                        </p>
                      </div>

                      <button
                        onClick={fetchData}
                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-brand-red hover:bg-rose-50 transition-all self-start md:self-auto"
                        title="Refresh requests"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    {/* Toolbar: Search, Filter, Sort */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                      <SearchInput
                        value={filters.search}
                        onChange={(s) => handleFilterChange('search', s)}
                        placeholder="Search hospital name or city..."
                        className="w-full md:w-72"
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
                        message="You are active on standby. No matching requests found for your active search or filters."
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DonationHistoryList history={history} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
