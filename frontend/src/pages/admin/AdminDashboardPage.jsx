import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import CrimsonFlowECGBackground from '../../components/admin/CrimsonFlowECGBackground';
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
import RadarPing from '../../components/common/RadarPing';
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
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState('analytics'); // analytics | hospitals | users | requests
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('adminSidebarCollapsed') === 'true';
  });
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

  const isFirstMount = useRef(true);

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
      setErrorMsg('Failed to refresh administrative data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
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
        return (
          <RadarPing size={32} color="#D7193F">
            <Badge variant="danger" pulse>CRITICAL</Badge>
          </RadarPing>
        );
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

  // 7-Phase Cinematic Assembly Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-brand-navy flex flex-col justify-between antialiased relative overflow-x-hidden">
      {/* Flowing Crimson Waves + Integrated ECG Ambient Background */}
      <CrimsonFlowECGBackground />

      {/* PHASE 1: Sweeping ECG Line Across Dashboard Top */}
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 z-40 overflow-hidden">
          <svg className="w-full h-full text-brand-red overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 10">
            <motion.path
              d="M 0 5 L 300 5 L 320 0 L 335 10 L 350 2 L 365 7 L 380 5 L 1000 5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: [1, 1, 0] }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />
          </svg>
        </div>
      )}

      <AdminHeader
        user={user}
        onLogout={logout}
        onToggleSidebar={() => {
          setIsSidebarCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem('adminSidebarCollapsed', String(next));
            return next;
          });
        }}
      />

      <div className="flex flex-1 relative overflow-hidden z-10">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
          pendingHospitalsCount={metrics?.verificationQueue?.pending || 0}
          openRequestsCount={metrics?.bloodRequests?.open || 0}
          user={user}
          onLogout={logout}
          isCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-brand-navy">
              <RefreshCw className="w-8 h-8 text-brand-red animate-spin" />
              <span className="text-sm font-semibold">Initializing Command Center Telemetry...</span>
            </div>
          ) : (
            <motion.div
              variants={shouldReduceMotion ? {} : containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {errorMsg && (
                <motion.div variants={itemVariants} className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {successMsg && (
                <motion.div variants={itemVariants} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}

              {/* Segmented Management Navigation */}
              <motion.div variants={itemVariants} className="flex items-center gap-1.5 p-1.5 bg-slate-200/60 border border-slate-200/80 rounded-2xl overflow-x-auto select-none w-full sm:w-fit shadow-xs">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-2 px-4 text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                    activeTab === 'analytics'
                      ? 'bg-white text-brand-red shadow-sm'
                      : 'text-slate-600 hover:text-brand-navy hover:bg-white/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard & Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('hospitals')}
                  className={`py-2 px-4 text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                    activeTab === 'hospitals'
                      ? 'bg-white text-brand-red shadow-sm'
                      : 'text-slate-600 hover:text-brand-navy hover:bg-white/60'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hospital Verification ({hospitals.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-2 px-4 text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                    activeTab === 'users'
                      ? 'bg-white text-brand-red shadow-sm'
                      : 'text-slate-600 hover:text-brand-navy hover:bg-white/60'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>User Management ({users.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('requests')}
                  className={`py-2 px-4 text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center gap-2 whitespace-nowrap active:scale-[0.98] ${
                    activeTab === 'requests'
                      ? 'bg-white text-brand-red shadow-sm'
                      : 'text-slate-600 hover:text-brand-navy hover:bg-white/60'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Blood Request Management ({requests.length})</span>
                </button>
              </motion.div>

              {/* Animated Tab View Panel Wrapper */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
                >
                  {/* TAB 4: PLATFORM ANALYTICS & INSIGHTS */}
                  {activeTab === 'analytics' && <AdminAnalyticsSection onNavigateTab={(t) => setActiveTab(t)} />}

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
                                  </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                  {hosp.verificationStatus === 'PENDING' && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        icon={XCircle}
                                        onClick={() => {
                                          setSelectedHospital(hosp);
                                          setVerificationAction('REJECT');
                                        }}
                                        className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                                      >
                                        Reject
                                      </Button>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        icon={CheckCircle2}
                                        onClick={() => {
                                          setSelectedHospital(hosp);
                                          setVerificationAction('APPROVE');
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                      >
                                        Approve & Verify
                                      </Button>
                                    </>
                                  )}

                                  {isVerifiedState && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      icon={RotateCcw}
                                      onClick={() => {
                                        setSelectedHospital(hosp);
                                        setVerificationAction('REVOKE');
                                      }}
                                      className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                                    >
                                      Revoke Verification
                                    </Button>
                                  )}

                                  {hosp.verificationStatus === 'REJECTED' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      icon={CheckCircle2}
                                      onClick={() => {
                                        setSelectedHospital(hosp);
                                        setVerificationAction('APPROVE');
                                      }}
                                    >
                                      Re-Verify Account
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

                  {/* TAB 2: USER DIRECTORY & ROLE MANAGEMENT */}
                  {activeTab === 'users' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">
                            Platform User Directory
                          </h2>
                          <p className="text-xs text-brand-slate">
                            Manage user accounts, assign administrative roles, and enforce account suspension.
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
                              { label: 'All User Roles', value: 'all' },
                              { label: 'Donors', value: 'DONOR' },
                              { label: 'Hospitals', value: 'HOSPITAL' },
                              { label: 'Administrators', value: 'ADMIN' },
                            ]}
                          />
                          <FilterSelect
                            label="Account Status"
                            value={userParams.status}
                            onChange={(v) => setUserParams((prev) => ({ ...prev, status: v, page: 1 }))}
                            options={[
                              { label: 'All Statuses', value: 'all' },
                              { label: 'Active Users', value: 'ACTIVE' },
                              { label: 'Suspended Accounts', value: 'SUSPENDED' },
                            ]}
                          />
                          <SortDropdown
                            sortBy={userParams.sortBy}
                            sortOrder={userParams.sortOrder}
                            options={[
                              { label: 'Registration Date', value: 'createdAt' },
                              { label: 'Full Name', value: 'name' },
                              { label: 'Email Address', value: 'email' },
                              { label: 'User Role', value: 'role' },
                            ]}
                            onSortChange={(sb, so) => setUserParams((prev) => ({ ...prev, sortBy: sb, sortOrder: so, page: 1 }))}
                          />
                          <Button variant="outline" size="sm" onClick={loadUsers} icon={RefreshCw}>
                            Refresh
                          </Button>
                        </div>
                      </div>

                      {users.length === 0 ? (
                        <Card variant="default" className="p-8 text-center border border-slate-200">
                          <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <h4 className="text-sm font-bold text-brand-navy">No Registered Users Found</h4>
                        </Card>
                      ) : (
                        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                                  <th className="py-3.5 px-4">User</th>
                                  <th className="py-3.5 px-4">Contact</th>
                                  <th className="py-3.5 px-4">Role</th>
                                  <th className="py-3.5 px-4">Status</th>
                                  <th className="py-3.5 px-4">Joined</th>
                                  <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                {users.map((usr) => {
                                  const isSelf = user?._id === usr._id;
                                  return (
                                    <tr key={usr._id} className="hover:bg-rose-50/20 transition-colors">
                                      <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-xs uppercase">
                                            {usr.name ? usr.name.substring(0, 2) : 'US'}
                                          </div>
                                          <div>
                                            <span className="font-extrabold text-brand-navy block">{usr.name}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">{usr.email}</span>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-3.5 px-4 font-mono text-slate-600">
                                        {usr.phone || 'Not Provided'}
                                      </td>
                                      <td className="py-3.5 px-4">
                                        <select
                                          disabled={isSelf || isUpdating}
                                          value={usr.role}
                                          onChange={(e) => handleUpdateUserRole(usr, e.target.value)}
                                          className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-red disabled:opacity-50"
                                        >
                                          <option value="DONOR">DONOR</option>
                                          <option value="HOSPITAL">HOSPITAL</option>
                                          <option value="ADMIN">ADMIN</option>
                                        </select>
                                      </td>
                                      <td className="py-3.5 px-4">
                                        {usr.isActive ? (
                                          <Badge variant="success">ACTIVE</Badge>
                                        ) : (
                                          <Badge variant="danger">SUSPENDED</Badge>
                                        )}
                                      </td>
                                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                                        {new Date(usr.createdAt).toLocaleDateString()}
                                      </td>
                                      <td className="py-3.5 px-4 text-right">
                                        {!isSelf && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={isUpdating}
                                            onClick={() => handleToggleUserStatus(usr)}
                                            className={usr.isActive ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}
                                          >
                                            {usr.isActive ? 'Suspend' : 'Activate'}
                                          </Button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

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
                            Platform Blood Request Management
                          </h2>
                          <p className="text-xs text-brand-slate">
                            Inspect emergency and standard requests across all verified healthcare providers.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <SearchInput
                            value={requestParams.search}
                            onChange={(s) => setRequestParams((prev) => ({ ...prev, search: s, page: 1 }))}
                            placeholder="Search patient ref, hospital..."
                            className="w-full sm:w-64"
                          />
                          <FilterSelect
                            label="Urgency"
                            value={requestParams.urgency}
                            onChange={(v) => setRequestParams((prev) => ({ ...prev, urgency: v, page: 1 }))}
                            options={[
                              { label: 'All Urgencies', value: 'all' },
                              { label: 'CRITICAL', value: 'CRITICAL' },
                              { label: 'URGENT', value: 'URGENT' },
                              { label: 'HIGH', value: 'HIGH' },
                              { label: 'NORMAL', value: 'NORMAL' },
                            ]}
                          />
                          <FilterSelect
                            label="Status"
                            value={requestParams.status}
                            onChange={(v) => setRequestParams((prev) => ({ ...prev, status: v, page: 1 }))}
                            options={[
                              { label: 'All Statuses', value: 'all' },
                              { label: 'OPEN', value: 'OPEN' },
                              { label: 'PARTIALLY_FULFILLED', value: 'PARTIALLY_FULFILLED' },
                              { label: 'FULFILLED', value: 'FULFILLED' },
                              { label: 'CANCELLED', value: 'CANCELLED' },
                            ]}
                          />
                          <Button variant="outline" size="sm" onClick={loadRequests} icon={RefreshCw}>
                            Refresh
                          </Button>
                        </div>
                      </div>

                      {requests.length === 0 ? (
                        <Card variant="default" className="p-8 text-center border border-slate-200">
                          <HeartPulse className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <h4 className="text-sm font-bold text-brand-navy">No Blood Requests Found</h4>
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
                                      <p className="text-xs text-slate-600 line-clamp-1">Reason: &quot;{reqItem.reason}&quot;</p>
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
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

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
                    ? 'Revoke Verification'
                    : 'Reject Hospital Application'}
                </h3>
                <button
                  onClick={() => setSelectedHospital(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6 text-xs text-slate-700">
                <p>
                  Target Hospital: <strong className="text-brand-navy text-sm">{selectedHospital.hospitalName}</strong>
                </p>
                <p>
                  License / Reg #: <strong className="font-mono text-brand-navy">{selectedHospital.registrationNumber || 'N/A'}</strong>
                </p>

                <div>
                  <label className="block font-bold text-brand-navy mb-1">
                    Administrative Notes / Reason (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Enter verification rationale or compliance notes..."
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
                  disabled={isUpdating}
                  onClick={handleVerifySubmit}
                  className={
                    verificationAction === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }
                >
                  {isUpdating ? 'Updating Status...' : 'Confirm Status Update'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REQUEST DETAIL MODAL */}
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
                <div>
                  <h3 className="text-lg font-extrabold text-brand-navy">Blood Request Details</h3>
                  <span className="text-xs font-mono text-slate-400">
                    Ref: {selectedRequestDetail.patientReference}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRequestDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedRequestDetail.status)}
                  {getUrgencyBadge(selectedRequestDetail.urgency)}
                  <span className="text-sm font-black text-brand-red bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg">
                    {selectedRequestDetail.bloodGroup}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Hospital Name:</span>
                    <span className="font-extrabold text-brand-navy">{selectedRequestDetail.hospitalName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Contact Person:</span>
                    <span className="font-bold text-brand-navy">{selectedRequestDetail.contactPerson?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Contact Phone:</span>
                    <span className="font-mono text-brand-navy font-bold">{selectedRequestDetail.contactPerson?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Required Date:</span>
                    <span className="font-mono text-slate-700">{new Date(selectedRequestDetail.requiredDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Units Required / Fulfilled:</span>
                    <span className="font-mono font-bold text-brand-navy">{selectedRequestDetail.unitsRequired} Required / {selectedRequestDetail.unitsFulfilled} Fulfilled</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-brand-navy mb-1">Clinical Reason / Notes</h4>
                  <p className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium">
                    {selectedRequestDetail.reason || 'No clinical rationale provided.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => setSelectedRequestDetail(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REQUEST CANCELLATION MODAL */}
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
                <h3 className="text-lg font-extrabold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Cancel Blood Request</span>
                </h3>
                <button
                  onClick={() => setCancelModalRequest(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6 text-xs text-slate-700">
                <p>
                  Target Patient Reference: <strong className="font-mono text-brand-navy">{cancelModalRequest.patientReference}</strong>
                </p>
                <p>
                  Hospital: <strong className="text-brand-navy">{cancelModalRequest.hospitalName}</strong>
                </p>

                <div>
                  <label className="block font-bold text-brand-navy mb-1">
                    Cancellation Reason / Rationale
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
