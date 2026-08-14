import React, { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../../../services/analyticsService';
import BloodGroupDemandChart from './BloodGroupDemandChart';
import RequestTrendsChart from './RequestTrendsChart';
import FulfillmentDonutChart from './FulfillmentDonutChart';
import HospitalActivityTable from './HospitalActivityTable';
import {
  Activity,
  Users,
  Building2,
  HeartPulse,
  Filter,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function AdminAnalyticsSection() {
  const [filters, setFilters] = useState({
    range: '30d',
    bloodGroup: 'ALL',
    city: 'ALL',
  });

  const [analyticsData, setAnalyticsData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [overviewRes, trendsRes] = await Promise.all([
        analyticsService.getOverviewAnalytics(filters),
        analyticsService.getTrendsAnalytics(filters),
      ]);

      if (overviewRes.success) {
        setAnalyticsData(overviewRes.data);
      }
      if (trendsRes.success) {
        setTrendsData(trendsRes.data.trends || []);
      }
    } catch (err) {
      console.error('[Admin Analytics Fetch Error]:', err);
      setError(err.message || 'Failed to load platform analytics.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const overview = analyticsData?.platformOverview || {};
  const fulfillment = analyticsData?.fulfillment || {};
  const bloodGroups = analyticsData?.bloodGroupDemand || [];
  const hospitals = analyticsData?.hospitalActivity || [];
  const donorStats = analyticsData?.donorAnalytics || {};

  return (
    <div className="space-y-6 antialiased">
      {/* Analytics Control & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 text-brand-red flex items-center justify-center font-bold">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-brand-navy">Platform Analytics Controls</h2>
            <p className="text-[11px] text-slate-500 font-medium">Filter real MongoDB aggregate statistics</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Blood Group Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600">Group:</span>
            <select
              value={filters.bloodGroup}
              onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-brand-navy focus:outline-none focus-red-glow text-xs"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg === 'ALL' ? 'All Blood Groups' : bg}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-600">Range:</span>
            <select
              value={filters.range}
              onChange={(e) => handleFilterChange('range', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-brand-navy focus:outline-none focus-red-glow text-xs"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadAnalytics}
            className="p-2 rounded-xl text-slate-500 hover:text-brand-red hover:bg-rose-50 border border-slate-200 transition-all"
            title="Refresh Analytics Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* KPI Cards — Preserving Organic Silhouette Shape (rounded-[40px_20px_48px_20px]) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Platform Fulfillment % */}
        <div className="bg-white border-2 border-brand-red rounded-[40px_20px_48px_20px] p-5 shadow-sm hover-red-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-brand-red">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
              {fulfillment.overallFulfillmentRate || 0}% RATE
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black text-brand-navy tracking-tight">
              {fulfillment.unitsFulfilled || 0} / {fulfillment.unitsRequested || 0}
            </h4>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Units Fulfilled vs Requested</p>
          </div>
        </div>

        {/* Card 2: Registered Donors */}
        <div className="bg-white border-2 border-brand-red rounded-[40px_20px_48px_20px] p-5 shadow-sm hover-red-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-brand-red">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-brand-navy bg-slate-100 px-2 py-0.5 rounded-full uppercase">
              {donorStats.availableDonors || 0} AVAILABLE
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black text-brand-navy tracking-tight">
              {overview.totalDonors || 0}
            </h4>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Registered Blood Donors</p>
          </div>
        </div>

        {/* Card 3: Healthcare Hospitals */}
        <div className="bg-white border-2 border-brand-red rounded-[40px_20px_48px_20px] p-5 shadow-sm hover-red-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-brand-red">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
              {overview.verifiedHospitals || 0} VERIFIED
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black text-brand-navy tracking-tight">
              {overview.totalHospitals || 0}
            </h4>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Healthcare Hospitals</p>
          </div>
        </div>

        {/* Card 4: Donor Consent Acceptance Rate */}
        <div className="bg-white border-2 border-brand-red rounded-[40px_20px_48px_20px] p-5 shadow-sm hover-red-glow transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-brand-red">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-brand-red bg-rose-50 px-2 py-0.5 rounded-full uppercase">
              {donorStats.consentAcceptanceRate || 0}% ACCEPTED
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-black text-brand-navy tracking-tight">
              {donorStats.acceptedConsents || 0} / {donorStats.totalConsents || 0}
            </h4>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Stage 6 Donor Consents Granted</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BloodGroupDemandChart data={bloodGroups} />
        <RequestTrendsChart
          data={trendsData}
          range={filters.range}
          onRangeChange={(r) => handleFilterChange('range', r)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FulfillmentDonutChart statusCounts={fulfillment.statusCounts} />
        </div>
        <div className="lg:col-span-2">
          <HospitalActivityTable hospitals={hospitals} />
        </div>
      </div>
    </div>
  );
}
