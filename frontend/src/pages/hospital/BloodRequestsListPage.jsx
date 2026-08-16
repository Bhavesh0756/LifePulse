import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitalService } from '../../services/hospitalService';
import HospitalHeader from '../../components/hospital/HospitalHeader';
import HospitalSidebar from '../../components/hospital/HospitalSidebar';
import RequestCard from '../../components/hospital/RequestCard';
import SoftBlushWaveBackground from '../../components/donor/SoftBlushWaveBackground';
import Footer from '../../components/Footer';
import { Button } from '../../components/Button';
import SearchInput from '../../components/common/SearchInput';
import FilterSelect from '../../components/common/FilterSelect';
import SortDropdown from '../../components/common/SortDropdown';
import PaginationControls from '../../components/common/PaginationControls';
import EmptyState from '../../components/common/EmptyState';
import SkeletonRow from '../../components/common/SkeletonRow';
import { PlusCircle, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BLOOD_GROUPS = [
  { label: 'All Blood Groups', value: 'ALL' },
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
];

const URGENCY_OPTIONS = [
  { label: 'All Urgencies', value: 'ALL' },
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'Urgent', value: 'URGENT' },
  { label: 'High', value: 'HIGH' },
  { label: 'Normal', value: 'NORMAL' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt' },
  { label: 'Required Date', value: 'requiredDate' },
  { label: 'Urgency', value: 'urgency' },
  { label: 'Units Needed', value: 'unitsRequired' },
];

export default function BloodRequestsListPage() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    urgency: 'ALL',
    bloodGroup: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, requestsRes] = await Promise.all([
        hospitalService.getHospitalProfile(),
        hospitalService.getBloodRequests(filters),
      ]);

      if (profileRes.success) setProfile(profileRes.data.profile);
      if (requestsRes.success) {
        setRequests(requestsRes.data.requests || []);
        if (requestsRes.data.pagination) {
          setPagination(requestsRes.data.pagination);
        }
      }
    } catch (err) {
      console.error('[Load Requests Error]:', err);
      setErrorMsg(err.message || 'Failed to fetch blood requests.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      status: 'ALL',
      urgency: 'ALL',
      bloodGroup: 'ALL',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className="min-h-screen text-brand-navy flex flex-col justify-between antialiased relative select-none overflow-x-hidden">
      <SoftBlushWaveBackground />

      <HospitalHeader
        user={user}
        profile={profile}
        onLogout={logout}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        currentPath="/hospital/requests"
      />

      <div className="flex flex-1 p-4 sm:p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto w-full relative z-10">
        {/* Left Sidebar */}
        <div className="hidden lg:block shrink-0">
          <HospitalSidebar
            activeRoute="/hospital/requests"
            requestCount={requests.length}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
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
                  activeRoute="/hospital/requests"
                  requestCount={requests.length}
                  onCloseMobile={() => setIsSidebarOpen(false)}
                  className="h-full shadow-2xl"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Right Content */}
        <div className="flex-1 space-y-6 overflow-hidden min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight mb-1">
                Hospital Blood Requests Directory
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                All blood requirements issued by {profile?.hospitalName || 'your hospital'}.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              onClick={() => { window.location.href = '/hospital/requests/new'; }}
            >
              + Create Blood Request
            </Button>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
            {['ALL', 'OPEN', 'PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => handleFilterChange('status', st)}
                className={`py-2 px-4 text-xs font-bold rounded-t-2xl transition-all border-b-2 whitespace-nowrap ${
                  filters.status === st
                    ? 'border-brand-red text-brand-red bg-white/90 shadow-2xs'
                    : 'border-transparent text-slate-500 hover:text-brand-navy'
                }`}
              >
                {st === 'ALL' ? 'All Requests' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search, Filter & Sort Toolbar */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <SearchInput
              value={filters.search}
              onChange={(s) => handleFilterChange('search', s)}
              placeholder="Search by patient reference or reason..."
              className="w-full lg:w-72"
            />

            <div className="flex flex-wrap items-center gap-3">
              <FilterSelect
                label="Blood Group"
                value={filters.bloodGroup}
                onChange={(v) => handleFilterChange('bloodGroup', v)}
                options={BLOOD_GROUPS}
              />

              <FilterSelect
                label="Urgency"
                value={filters.urgency}
                onChange={(v) => handleFilterChange('urgency', v)}
                options={URGENCY_OPTIONS}
              />

              <SortDropdown
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                options={SORT_OPTIONS}
                onSortChange={handleSortChange}
              />
            </div>
          </div>

          {isLoading ? (
            <SkeletonRow count={4} type="card" />
          ) : errorMsg ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs max-w-lg mx-auto text-center my-12">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-600" />
              <p className="font-bold mb-3">{errorMsg}</p>
              <Button variant="outline" size="sm" onClick={loadData} icon={RefreshCw}>
                Retry Loading
              </Button>
            </div>
          ) : requests.length === 0 ? (
            <EmptyState
              title="No blood requests found"
              message="There are no blood requests matching your active filters or search criteria."
              onClearFilters={handleClearFilters}
              icon={FileText}
            />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((request) => (
                  <RequestCard key={request._id} request={request} />
                ))}
              </div>

              <PaginationControls pagination={pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
