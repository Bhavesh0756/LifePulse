import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import AdminHeader from '../../components/admin/AdminHeader';
import Container from '../../components/Container';
import Card from '../../components/Card';
import Footer from '../../components/Footer';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { BLOOD_GROUPS } from '../../data';
import AdminAnalyticsSection from '../../components/admin/analytics/AdminAnalyticsSection';
import SearchInput from '../../components/common/SearchInput';
import FilterSelect from '../../components/common/FilterSelect';
import SortDropdown from '../../components/common/SortDropdown';
import PaginationControls from '../../components/common/PaginationControls';
import EmptyState from '../../components/common/EmptyState';
import SkeletonRow from '../../components/common/SkeletonRow';
import {
  ShieldCheck,
  Building2,
  Users,
  HeartPulse,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Search,
  Check,
  X,
  Lock,
  AlertTriangle,
  RotateCcw,
  Eye,
  Ban,
  Activity,
  MapPin,
  Calendar,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('hospitals'); // hospitals | users | requests
  const [metrics, setMetrics] = useState(null);

  // Hospital Verification Queue State
  const [hospitals, setHospitals] = useState([]);
  const [hospitalPagination, setHospitalPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [hospitalParams, setHospitalParams] = useState({
    status: 'all',
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  // User Management State
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [userParams, setUserParams] = useState({
    role: 'all',
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  // Blood Request Management State
  const [requests, setRequests] = useState([]);
  const [requestPagination, setRequestPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [requestParams, setRequestParams] = useState({
    status: 'all',
    urgency: 'all',
    bloodGroup: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected Hospital for Approval/Rejection/Revocation Modal
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [verificationAction, setVerificationAction] = useState(''); // APPROVE | REJECT | REVOKE
  const [verificationNotes, setVerificationNotes] = useState('');

  // Selected Request for Detail View / Cancellation Modal
  const [selectedRequestDetail, setSelectedRequestDetail] = useState(null);
  const [cancelModalRequest, setCancelModalRequest] = useState(null);
  const [cancelReasonNotes, setCancelReasonNotes] = useState('');

  const loadMetrics = async () => {
    try {
      const res = await adminService.getMetrics();
      if (res.success) setMetrics(res.data);
    } catch (err) {
      console.error('[Load Metrics Error]:', err);
    }
  };

  const loadHospitals = useCallback(async () => {
    try {
      const res = await adminService.getHospitals(hospitalParams);
      if (res.success) {
        setHospitals(res.data.hospitals || []);
        if (res.data.pagination) setHospitalPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('[Load Hospitals Error]:', err);
    }
  }, [hospitalParams]);

  const loadUsers = useCallback(async () => {
    try {
      const res = await adminService.getUsers(userParams);
      if (res.success) {
        setUsers(res.data.users || []);
        if (res.data.pagination) setUserPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('[Load Users Error]:', err);
    }
  }, [userParams]);

  const loadRequests = useCallback(async () => {
    try {
      const res = await adminService.getAllRequests(requestParams);
      if (res.success) {
        setRequests(res.data.requests || []);
        if (res.data.pagination) setRequestPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('[Load Requests Error]:', err);
    }
  }, [requestParams]);

  const refreshAll = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await Promise.all([loadMetrics(), loadHospitals(), loadUsers(), loadRequests()]);
    } catch (err) {
      console.error('[Refresh All Admin Data Error]:', err);
      setErrorMsg(err.message || 'Failed to load administration dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Sync parameter changes after initial mount
  const isFirstMount = React.useRef(true);
  useEffect(() => {
    if (isFirstMount.current) return;
    loadHospitals();
  }, [loadHospitals]);

  useEffect(() => {
    if (isFirstMount.current) return;
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    loadRequests();
  }, [loadRequests]);

  // Handle Hospital Verification Status Update
  const handleVerifySubmit = async () => {
    if (!selectedHospital || !verificationAction) return;
    setIsUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await adminService.verifyHospital(
        selectedHospital._id,
        verificationAction,
        verificationNotes
      );
      if (res.success) {
        const actionLabel =
          verificationAction === 'APPROVE'
            ? 'VERIFIED'
            : verificationAction === 'REVOKE'
            ? 'REVOKED (REJECTED)'
            : 'REJECTED';
        setSuccessMsg(`Hospital ${selectedHospital.hospitalName} status updated to ${actionLabel}.`);
        setSelectedHospital(null);
        setVerificationNotes('');
        loadMetrics();
        loadHospitals();
      }
    } catch (err) {
      console.error('[Verify Submit Error]:', err);
      setErrorMsg(err.message || 'Failed to submit verification status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Protected User Role Update
  const handleUpdateUserRole = async (targetUser, newRole) => {
    if (user?._id && targetUser._id === user._id) return;
    setIsUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await adminService.updateUserRole(targetUser._id, newRole);
      if (res.success) {
        setSuccessMsg(`User ${targetUser.name} role updated to ${newRole}.`);
        loadUsers();
        loadMetrics();
      }
    } catch (err) {
      console.error('[Update Role Error]:', err);
      setErrorMsg(err.message || 'Failed to update user role.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle User Account Status Toggle (Suspend / Activate)
  const handleToggleUserStatus = async (targetUser) => {
    setIsUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await adminService.toggleUserStatus(targetUser._id, !targetUser.isActive);
      if (res.success) {
        setSuccessMsg(`User ${targetUser.name} account status updated.`);
        loadUsers();
        loadMetrics();
      }
    } catch (err) {
      console.error('[Toggle User Error]:', err);
      setErrorMsg(err.message || 'Failed to update user account status.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Admin Request Cancellation
  const handleAdminCancelRequest = async () => {
    if (!cancelModalRequest) return;
    setIsUpdating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await adminService.cancelRequest(cancelModalRequest._id, cancelReasonNotes);
      if (res.success) {
        setSuccessMsg(`Blood Request ${cancelModalRequest.patientReference} has been cancelled.`);
        setCancelModalRequest(null);
        setSelectedRequestDetail(null);
        setCancelReasonNotes('');
        loadMetrics();
        loadRequests();
      }
    } catch (err) {
      console.error('[Cancel Request Error]:', err);
      setErrorMsg(err.message || 'Failed to cancel blood request.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge variant="success">VERIFIED</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">REJECTED</Badge>;
      default:
        return <Badge variant="warning">PENDING REVIEW</Badge>;
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL':
        return <Badge variant="danger">CRITICAL</Badge>;
      case 'URGENT':
        return <Badge variant="warning">URGENT</Badge>;
      case 'HIGH':
        return <Badge variant="info">HIGH</Badge>;
      default:
        return <Badge variant="neutral">NORMAL</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'FULFILLED':
        return <Badge variant="success">FULFILLED</Badge>;
      case 'PARTIALLY_FULFILLED':
        return <Badge variant="info">PARTIALLY FULFILLED</Badge>;
      case 'CANCELLED':
        return <Badge variant="neutral">CANCELLED</Badge>;
      default:
        return <Badge variant="brand">OPEN</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between antialiased">
      <AdminHeader user={user} onLogout={logout} />

      <main className="flex-grow py-8">
        <Container size="lg">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-brand-navy">
              <RefreshCw className="w-8 h-8 text-brand-red animate-spin" />
              <span className="text-sm font-semibold">Loading Administration Portal...</span>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Platform Overview Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Card 1: Platform Accounts */}
                <div className="bg-white rounded-[40px_20px_48px_20px] border-2 border-brand-red p-6 shadow-[0_8px_24px_rgba(225,29,72,0.1)] hover:shadow-[0_12px_32px_rgba(225,29,72,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                      Platform Accounts
                    </span>
                    <div className="w-11 h-11 rounded-full bg-brand-navy text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-4xl font-black text-brand-navy tracking-tight">
                      {metrics?.users?.totalUsers || 0}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-100/90">
                    <span className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-1 rounded-full">
                      {metrics?.users?.totalDonors || 0} Donors • {metrics?.users?.totalHospitals || 0} Hospitals
                    </span>
                  </div>
                </div>

                {/* Card 2: Hospital Verification */}
                <div className="bg-white rounded-[40px_20px_48px_20px] border-2 border-brand-red p-6 shadow-[0_8px_24px_rgba(225,29,72,0.1)] hover:shadow-[0_12px_32px_rgba(225,29,72,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                      Hospital Verification
                    </span>
                    <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-4xl font-black text-brand-navy tracking-tight">
                      {metrics?.verificationQueue?.pending || 0}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-100/90">
                    <span className="inline-flex items-center text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-3.5 py-1 rounded-full">
                      {metrics?.verificationQueue?.pending || 0} Pending • {metrics?.verificationQueue?.verified || 0} Verified
                    </span>
                  </div>
                </div>

                {/* Card 3: Blood Requests */}
                <div className="bg-white rounded-[40px_20px_48px_20px] border-2 border-brand-red p-6 shadow-[0_8px_24px_rgba(225,29,72,0.1)] hover:shadow-[0_12px_32px_rgba(225,29,72,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                      Blood Requests
                    </span>
                    <div className="w-11 h-11 rounded-full bg-brand-red text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-4xl font-black text-brand-navy tracking-tight">
                      {metrics?.bloodRequests?.total || 0}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-100/90">
                    <span className="inline-flex items-center text-xs font-bold text-rose-900 bg-rose-50 border border-rose-200/80 px-3.5 py-1 rounded-full">
                      {metrics?.bloodRequests?.open || 0} Open • {metrics?.bloodRequests?.critical || 0} Critical
                    </span>
                  </div>
                </div>

                {/* Card 4: Units Fulfillment */}
                <div className="bg-white rounded-[40px_20px_48px_20px] border-2 border-brand-red p-6 shadow-[0_8px_24px_rgba(225,29,72,0.1)] hover:shadow-[0_12px_32px_rgba(225,29,72,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                      Units Fulfillment
                    </span>
                    <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
                      {metrics?.bloodRequests?.unitsFulfilled || 0} / {metrics?.bloodRequests?.unitsRequested || 0}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-100/90">
                    <span className="inline-flex items-center text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full">
                      {metrics?.bloodRequests?.fulfilled || 0} Fully Fulfilled Requests
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className={`py-3 px-5 text-xs font-extrabold rounded-t-xl transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'hospitals'
                      ? 'border-brand-red text-brand-red bg-white shadow-[0_4px_16px_rgba(225,29,72,0.14)]'
                      : 'border-transparent text-brand-slate hover:text-brand-red hover:bg-rose-50/50 hover:border-brand-red/30 hover:shadow-[0_4px_16px_rgba(225,29,72,0.12)]'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Hospital Verification ({hospitals.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-3 px-5 text-xs font-extrabold rounded-t-xl transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'users'
                      ? 'border-brand-red text-brand-red bg-white shadow-[0_4px_16px_rgba(225,29,72,0.14)]'
                      : 'border-transparent text-brand-slate hover:text-brand-red hover:bg-rose-50/50 hover:border-brand-red/30 hover:shadow-[0_4px_16px_rgba(225,29,72,0.12)]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>User Management ({users.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('requests')}
                  className={`py-3 px-5 text-xs font-extrabold rounded-t-xl transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'requests'
                      ? 'border-brand-red text-brand-red bg-white shadow-[0_4px_16px_rgba(225,29,72,0.14)]'
                      : 'border-transparent text-brand-slate hover:text-brand-red hover:bg-rose-50/50 hover:border-brand-red/30 hover:shadow-[0_4px_16px_rgba(225,29,72,0.12)]'
                  }`}
                >
                  <HeartPulse className="w-4 h-4" />
                  <span>Blood Request Management ({requests.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-3 px-5 text-xs font-extrabold rounded-t-xl transition-all duration-200 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'border-brand-red text-brand-red bg-white shadow-[0_4px_16px_rgba(225,29,72,0.14)]'
                      : 'border-transparent text-brand-slate hover:text-brand-red hover:bg-rose-50/50 hover:border-brand-red/30 hover:shadow-[0_4px_16px_rgba(225,29,72,0.12)]'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Platform Analytics & Insights</span>
                </button>
              </div>

              {/* TAB 4: PLATFORM ANALYTICS & INSIGHTS */}
              {activeTab === 'analytics' && <AdminAnalyticsSection />}

              {/* TAB 1: HOSPITAL VERIFICATION QUEUE & LIFECYCLE MANAGEMENT */}
              {activeTab === 'hospitals' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">
                        Hospital Verification & Lifecycle
                      </h2>
                      <p className="text-xs text-brand-slate">
                        Review pending applications, inspect verified institutions, and manage verification status.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <SearchInput
                        value={hospitalParams.search}
                        onChange={(s) => setHospitalParams((prev) => ({ ...prev, search: s, page: 1 }))}
                        placeholder="Search hospital, email..."
                        className="w-full sm:w-64"
                      />
                      <FilterSelect
                        label="Status"
                        value={hospitalParams.status}
                        onChange={(v) => setHospitalParams((prev) => ({ ...prev, status: v, page: 1 }))}
                        options={[
                          { label: 'All Hospital Statuses', value: 'all' },
                          { label: 'Pending Review', value: 'PENDING' },
                          { label: 'Verified Hospitals', value: 'VERIFIED' },
                          { label: 'Rejected Hospitals', value: 'REJECTED' },
                        ]}
                      />
                      <SortDropdown
                        sortBy={hospitalParams.sortBy}
                        sortOrder={hospitalParams.sortOrder}
                        options={[
                          { label: 'Recently Updated', value: 'updatedAt' },
                          { label: 'Registration Date', value: 'createdAt' },
                          { label: 'Hospital Name', value: 'hospitalName' },
                          { label: 'Verification Status', value: 'verificationStatus' },
                        ]}
                        onSortChange={(sb, so) => setHospitalParams((prev) => ({ ...prev, sortBy: sb, sortOrder: so, page: 1 }))}
                      />
                      <Button variant="outline" size="sm" onClick={loadHospitals} icon={RefreshCw}>
                        Refresh
                      </Button>
                    </div>
                  </div>

                  {hospitals.length === 0 ? (
                    <Card variant="default" className="p-8 text-center border border-slate-200">
                      <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-brand-navy">No Hospital Accounts Match Filter</h4>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {hospitals.map((hosp) => {
                        const isVerifiedState = hosp.verificationStatus === 'VERIFIED' && hosp.isVerified;
                        return (
                          <Card
                            key={hosp._id}
                            variant="elevated"
                            className="p-6 border border-slate-200 hover:border-brand-red/40 hover:shadow-[0_8px_25px_-4px_rgba(225,29,72,0.16)] hover:-translate-y-0.5 transition-all duration-200 relative flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                {getVerificationBadge(hosp.verificationStatus)}
                                <span className="text-[10px] font-mono text-slate-400">
                                  Reg #: {hosp.registrationNumber || 'Not Provided'}
                                </span>
                              </div>

                              <h3 className="text-lg font-extrabold text-brand-navy mb-1">{hosp.hospitalName}</h3>
                              <p className="text-xs text-slate-500 mb-4">
                                Contact Person: <strong className="text-brand-navy">{hosp.userId?.name || 'N/A'}</strong> ({hosp.userId?.email || 'N/A'})
                              </p>

                              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2 mb-4">
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Hospital Phone:</span>
                                  <span className="font-mono text-brand-navy font-bold">{hosp.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Location:</span>
                                  <span className="text-brand-navy font-semibold">{hosp.address?.city || 'City N/A'}, {hosp.address?.state || ''}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Registered On:</span>
                                  <span className="text-slate-600 font-mono">{new Date(hosp.createdAt).toLocaleDateString()}</span>
                                </div>

                                {isVerifiedState && (
                                  <>
                                    <div className="flex justify-between pt-1 border-t border-slate-200/60 text-emerald-800">
                                      <span className="font-medium">Verified On:</span>
                                      <span className="font-mono font-bold">
                                        {hosp.verifiedAt ? new Date(hosp.verifiedAt).toLocaleString() : 'System Verified'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-emerald-800">
                                      <span className="font-medium">Verified By:</span>
                                      <span className="font-bold">
                                        {hosp.verifiedBy?.name || hosp.verifiedBy?.email || 'System Administrator'}
                                      </span>
                                    </div>
                                  </>
                                )}

                                {hosp.verificationNotes && (
                                  <div className="pt-2 border-t border-slate-200 text-rose-700">
                                    <strong>Admin Notes:</strong> "{hosp.verificationNotes}"
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                              {hosp.verificationStatus === 'PENDING' && (
                                <>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    icon={Check}
                                    onClick={() => {
                                      setSelectedHospital(hosp);
                                      setVerificationAction('APPROVE');
                                    }}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                  >
                                    Approve Hospital
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    icon={X}
                                    onClick={() => {
                                      setSelectedHospital(hosp);
                                      setVerificationAction('REJECT');
                                    }}
                                    className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                                  >
                                    Reject Hospital
                                  </Button>
                                </>
                              )}

                              {isVerifiedState && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  icon={AlertTriangle}
                                  onClick={() => {
                                    setSelectedHospital(hosp);
                                    setVerificationAction('REVOKE');
                                  }}
                                  className="w-full text-rose-700 border-rose-300 hover:bg-rose-50 font-bold"
                                >
                                  Revoke Verification
                                </Button>
                              )}

                              {hosp.verificationStatus === 'REJECTED' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  icon={RotateCcw}
                                  onClick={() => {
                                    setSelectedHospital(hosp);
                                    setVerificationAction('APPROVE');
                                  }}
                                  className="w-full text-emerald-700 border-emerald-300 hover:bg-emerald-50 font-bold"
                                >
                                  Re-Evaluate & Approve
                                </Button>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  <PaginationControls
                    pagination={hospitalPagination}
                    onPageChange={(p) => setHospitalParams((prev) => ({ ...prev, page: p }))}
                  />
                </div>
              )}

              {/* TAB 2: USER MANAGEMENT DIRECTORY */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">
                        Platform User Directory
                      </h2>
                      <p className="text-xs text-brand-slate">
                        Inspect active accounts, update roles, and manage suspension states with security self-protection.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <SearchInput
                        value={userParams.search}
                        onChange={(s) => setUserParams((prev) => ({ ...prev, search: s, page: 1 }))}
                        placeholder="Search name, email, phone..."
                        className="w-full sm:w-64"
                      />
                      <FilterSelect
                        label="Role"
                        value={userParams.role}
                        onChange={(v) => setUserParams((prev) => ({ ...prev, role: v, page: 1 }))}
                        options={[
                          { label: 'All Roles', value: 'all' },
                          { label: 'Donors', value: 'DONOR' },
                          { label: 'Hospitals', value: 'HOSPITAL' },
                          { label: 'Admins', value: 'ADMIN' },
                        ]}
                      />
                      <FilterSelect
                        label="Status"
                        value={userParams.status}
                        onChange={(v) => setUserParams((prev) => ({ ...prev, status: v, page: 1 }))}
                        options={[
                          { label: 'All Statuses', value: 'all' },
                          { label: 'Active Only', value: 'active' },
                          { label: 'Suspended Only', value: 'suspended' },
                        ]}
                      />
                      <SortDropdown
                        sortBy={userParams.sortBy}
                        sortOrder={userParams.sortOrder}
                        options={[
                          { label: 'Registration Date', value: 'createdAt' },
                          { label: 'Full Name', value: 'name' },
                          { label: 'Email Address', value: 'email' },
                          { label: 'Role', value: 'role' },
                        ]}
                        onSortChange={(sb, so) => setUserParams((prev) => ({ ...prev, sortBy: sb, sortOrder: so, page: 1 }))}
                      />
                    </div>
                  </div>

                  <Card variant="elevated" className="overflow-hidden border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-4">User Name</th>
                            <th className="p-4">Email Address</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Registered</th>
                            <th className="p-4 text-right">Account Control</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {users.map((usr) => {
                            const isSelf = Boolean(user?._id && usr._id === user._id);
                            return (
                              <tr
                                key={usr._id}
                                className="hover:bg-rose-50/40 hover:shadow-[0_4px_16px_rgba(225,29,72,0.08)] transition-all duration-200"
                              >
                                <td className="p-4 font-bold text-brand-navy">
                                  {usr.name}
                                  {isSelf && (
                                    <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                                      YOU
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 font-mono text-slate-600">{usr.email}</td>
                                <td className="p-4">
                                  {isSelf || usr.role === 'ADMIN' ? (
                                    <Badge variant="warning">ADMIN</Badge>
                                  ) : (
                                    <select
                                      value={usr.role}
                                      onChange={(e) => handleUpdateUserRole(usr, e.target.value)}
                                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-brand-navy focus:outline-none cursor-pointer hover:border-brand-red/40 hover:shadow-[0_4px_12px_rgba(225,29,72,0.12)] transition-all duration-200"
                                    >
                                      <option value="DONOR">DONOR</option>
                                      <option value="HOSPITAL">HOSPITAL</option>
                                    </select>
                                  )}
                                </td>
                                <td className="p-4">
                                  {usr.isActive ? (
                                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                                      <XCircle className="w-3.5 h-3.5" /> SUSPENDED
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-slate-500">{new Date(usr.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                  {isSelf ? (
                                    <span className="text-[11px] font-semibold text-slate-400 flex items-center justify-end gap-1">
                                      <Lock className="w-3 h-3" /> Protected
                                    </span>
                                  ) : (
                                    <Button
                                      variant={usr.isActive ? 'outline' : 'primary'}
                                      size="sm"
                                      onClick={() => handleToggleUserStatus(usr)}
                                      className={usr.isActive ? 'text-rose-600 border-rose-200 hover:bg-rose-50' : 'bg-emerald-600'}
                                    >
                                      {usr.isActive ? 'Suspend Account' : 'Activate Account'}
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  <PaginationControls
                    pagination={userPagination}
                    onPageChange={(p) => setUserParams((prev) => ({ ...prev, page: p }))}
                  />
                </div>
              )}

              {/* TAB 3: BLOOD REQUEST MANAGEMENT */}
              {activeTab === 'requests' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">
                        Blood Request Management
                      </h2>
                      <p className="text-xs text-brand-slate">
                        Platform-wide emergency blood requests overview, fulfillment tracking, and administrative governance.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <SearchInput
                        value={requestParams.search}
                        onChange={(s) => setRequestParams((prev) => ({ ...prev, search: s, page: 1 }))}
                        placeholder="Search hospital, ref, city..."
                        className="w-full sm:w-64"
                      />
                      <FilterSelect
                        label="Status"
                        value={requestParams.status}
                        onChange={(v) => setRequestParams((prev) => ({ ...prev, status: v, page: 1 }))}
                        options={[
                          { label: 'All Statuses', value: 'all' },
                          { label: 'Open', value: 'OPEN' },
                          { label: 'Partially Fulfilled', value: 'PARTIALLY_FULFILLED' },
                          { label: 'Fulfilled', value: 'FULFILLED' },
                          { label: 'Cancelled', value: 'CANCELLED' },
                        ]}
                      />
                      <FilterSelect
                        label="Urgency"
                        value={requestParams.urgency}
                        onChange={(v) => setRequestParams((prev) => ({ ...prev, urgency: v, page: 1 }))}
                        options={[
                          { label: 'All Urgencies', value: 'all' },
                          { label: 'Critical', value: 'CRITICAL' },
                          { label: 'Urgent', value: 'URGENT' },
                          { label: 'High', value: 'HIGH' },
                          { label: 'Normal', value: 'NORMAL' },
                        ]}
                      />
                      <FilterSelect
                        label="Blood Group"
                        value={requestParams.bloodGroup}
                        onChange={(v) => setRequestParams((prev) => ({ ...prev, bloodGroup: v, page: 1 }))}
                        options={[
                          { label: 'All Blood Groups', value: 'all' },
                          ...BLOOD_GROUPS.map((bg) => ({ label: bg, value: bg })),
                        ]}
                      />
                      <SortDropdown
                        sortBy={requestParams.sortBy}
                        sortOrder={requestParams.sortOrder}
                        options={[
                          { label: 'Newest First', value: 'createdAt' },
                          { label: 'Required Date', value: 'requiredDate' },
                          { label: 'Urgency', value: 'urgency' },
                          { label: 'Units Needed', value: 'unitsRequired' },
                        ]}
                        onSortChange={(sb, so) => setRequestParams((prev) => ({ ...prev, sortBy: sb, sortOrder: so, page: 1 }))}
                      />
                      <Button variant="outline" size="sm" onClick={loadRequests} icon={RefreshCw}>
                        Refresh
                      </Button>
                    </div>
                  </div>

                  {requests.length === 0 ? (
                    <Card variant="default" className="p-8 text-center border border-slate-200">
                      <HeartPulse className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-brand-navy">No Blood Requests Match Current Filters</h4>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((reqItem) => {
                        const percent = Math.round((reqItem.unitsFulfilled / reqItem.unitsRequired) * 100);
                        const isCanCancel = reqItem.status === 'OPEN' || reqItem.status === 'PARTIALLY_FULFILLED';
                        return (
                          <Card
                            key={reqItem._id}
                            variant="elevated"
                            className="p-6 border border-slate-200 hover:border-brand-red/40 hover:shadow-[0_8px_25px_-4px_rgba(225,29,72,0.16)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {getStatusBadge(reqItem.status)}
                                  {getUrgencyBadge(reqItem.urgency)}
                                  <span className="text-sm font-black text-brand-red bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">
                                    {reqItem.bloodGroup}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400">
                                    Ref: {reqItem.patientReference}
                                  </span>
                                </div>

                                <span className="text-[11px] text-slate-500 font-mono">
                                  Created: {new Date(reqItem.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                <div className="md:col-span-7 space-y-1">
                                  <h3 className="text-lg font-extrabold text-brand-navy">{reqItem.hospitalName}</h3>
                                  <p className="text-xs text-slate-600 line-clamp-1">Reason: "{reqItem.reason}"</p>
                                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                      {reqItem.location?.city}, {reqItem.location?.state}
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold text-brand-navy">
                                      <Calendar className="w-3.5 h-3.5 text-brand-red" />
                                      Required: {new Date(reqItem.requiredDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                                      Fulfillment Progress
                                    </span>
                                    <span className="font-black text-brand-navy text-sm">
                                      {reqItem.unitsFulfilled} / {reqItem.unitsRequired} Units ({percent}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        reqItem.status === 'FULFILLED'
                                          ? 'bg-emerald-500'
                                          : reqItem.status === 'CANCELLED'
                                          ? 'bg-slate-400'
                                          : 'bg-gradient-to-r from-brand-red to-amber-500'
                                      }`}
                                      style={{ width: `${Math.min(100, percent)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
                              <Button
                                variant="outline"
                                size="sm"
                                icon={Eye}
                                onClick={() => setSelectedRequestDetail(reqItem)}
                              >
                                Request Details
                              </Button>

                              {isCanCancel && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={Ban}
                                  onClick={() => setCancelModalRequest(reqItem)}
                                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                >
                                  Cancel Request
                                </Button>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  <PaginationControls
                    pagination={requestPagination}
                    onPageChange={(p) => setRequestParams((prev) => ({ ...prev, page: p }))}
                  />
                </div>
              )}
            </>
          )}
        </Container>
      </main>

      {/* VERIFICATION / REVOCATION DECISION MODAL */}
      <AnimatePresence>
        {selectedHospital && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-extrabold text-brand-navy">
                  {verificationAction === 'APPROVE'
                    ? 'Approve Hospital Account'
                    : verificationAction === 'REVOKE'
                    ? 'Revoke Hospital Verification'
                    : 'Reject Hospital Account'}
                </h3>
                <button onClick={() => setSelectedHospital(null)} className="p-1 text-slate-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <p className="font-bold text-brand-navy text-sm">{selectedHospital.hospitalName}</p>
                  <p className="text-slate-500">Contact: {selectedHospital.userId?.name} ({selectedHospital.userId?.email})</p>
                  <p className="text-slate-500 font-mono">Reg #: {selectedHospital.registrationNumber || 'Not provided'}</p>
                </div>

                {verificationAction === 'REVOKE' && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 font-extrabold text-rose-900">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Warning: Immediate Permission Revocation</span>
                    </div>
                    <p className="leading-relaxed">
                      Revoking verification will immediately block <strong>{selectedHospital.hospitalName}</strong> from posting new emergency blood requests. Existing historical requests and donor consents will remain preserved in the system.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    {verificationAction === 'REVOKE' ? 'Reason for Revocation (Required):' : 'Verification Notes / Feedback (Optional):'}
                  </label>
                  <textarea
                    rows="3"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder={
                      verificationAction === 'REVOKE'
                        ? 'State the reason for revoking hospital verification status...'
                        : 'Enter review notes for record keeping...'
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => setSelectedHospital(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isUpdating || (verificationAction === 'REVOKE' && !verificationNotes.trim())}
                  onClick={handleVerifySubmit}
                  className={
                    verificationAction === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }
                >
                  {isUpdating
                    ? 'Submitting...'
                    : verificationAction === 'APPROVE'
                    ? 'Confirm Approval'
                    : verificationAction === 'REVOKE'
                    ? 'Confirm Revocation'
                    : 'Confirm Rejection'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REQUEST DETAILS MODAL */}
      <AnimatePresence>
        {selectedRequestDetail && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-brand-navy">Blood Request Details</h3>
                  {getStatusBadge(selectedRequestDetail.status)}
                </div>
                <button onClick={() => setSelectedRequestDetail(null)} className="p-1 text-slate-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6 text-xs">
                {/* Hospital Header info */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-brand-navy text-sm">{selectedRequestDetail.hospitalName}</span>
                    {getUrgencyBadge(selectedRequestDetail.urgency)}
                  </div>
                  <p className="text-slate-500 font-mono">Patient Ref: {selectedRequestDetail.patientReference}</p>
                  <p className="text-slate-500">
                    Hospital Contact Phone: <strong className="text-brand-navy font-mono">{selectedRequestDetail.hospitalId?.phone || 'Provided upon coordination'}</strong>
                  </p>
                </div>

                {/* Blood & Fulfillment Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Required Blood Group</span>
                    <span className="text-2xl font-black text-brand-red">{selectedRequestDetail.bloodGroup}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Fulfillment Progress</span>
                    <span className="text-lg font-black text-brand-navy">
                      {selectedRequestDetail.unitsFulfilled} / {selectedRequestDetail.unitsRequired} Units
                    </span>
                  </div>
                </div>

                {/* Full Details */}
                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <strong className="text-slate-500 block text-[10px] uppercase">Reason for Blood Request:</strong>
                    <p className="text-brand-navy font-medium mt-0.5">"{selectedRequestDetail.reason}"</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                    <div>
                      <strong className="text-slate-500 block text-[10px] uppercase">Required Date:</strong>
                      <span className="text-brand-navy font-semibold">
                        {new Date(selectedRequestDetail.requiredDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <strong className="text-slate-500 block text-[10px] uppercase">Location:</strong>
                      <span className="text-brand-navy font-semibold">
                        {selectedRequestDetail.location?.city}, {selectedRequestDetail.location?.state}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-slate-500">
                    <div>
                      <span>Created: {new Date(selectedRequestDetail.createdAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span>Updated: {new Date(selectedRequestDetail.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {(selectedRequestDetail.status === 'OPEN' || selectedRequestDetail.status === 'PARTIALLY_FULFILLED') ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Ban}
                    onClick={() => {
                      setCancelModalRequest(selectedRequestDetail);
                    }}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    Cancel Request
                  </Button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">Status: {selectedRequestDetail.status}</span>
                )}

                <Button variant="ghost" size="sm" onClick={() => setSelectedRequestDetail(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CANCEL REQUEST CONFIRMATION MODAL */}
      <AnimatePresence>
        {cancelModalRequest && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-extrabold text-brand-navy">Cancel Blood Request</h3>
                <button onClick={() => setCancelModalRequest(null)} className="p-1 text-slate-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <p className="font-bold text-brand-navy text-sm">{cancelModalRequest.hospitalName}</p>
                  <p className="text-slate-500 font-mono">Patient Ref: {cancelModalRequest.patientReference} • {cancelModalRequest.bloodGroup} Blood ({cancelModalRequest.unitsRequired} Units)</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <p className="font-bold">Administrative Cancellation Control</p>
                  <p className="text-amber-800">
                    Cancelling this request will update its status to CANCELLED and remove it from active donor matching feeds. Historical records will be preserved.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Reason for Cancellation (Optional):
                  </label>
                  <textarea
                    rows="3"
                    value={cancelReasonNotes}
                    onChange={(e) => setCancelReasonNotes(e.target.value)}
                    placeholder="Enter reason for administrative cancellation..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => setCancelModalRequest(null)}>
                  Keep Active
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isUpdating}
                  onClick={handleAdminCancelRequest}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  {isUpdating ? 'Cancelling...' : 'Confirm Request Cancellation'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
