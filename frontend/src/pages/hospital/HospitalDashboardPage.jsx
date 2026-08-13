import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitalService } from '../../services/hospitalService';
import HospitalHeader from '../../components/hospital/HospitalHeader';
import HospitalStatsCards from '../../components/hospital/HospitalStatsCards';
import RequestCard from '../../components/hospital/RequestCard';
import Container from '../../components/Container';
import Card from '../../components/Card';
import Footer from '../../components/Footer';
import { Button } from '../../components/Button';
import { PlusCircle, RefreshCw, AlertCircle, FileText, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HospitalDashboardPage() {
  const { user, logout } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = async () => {
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
      setErrorMsg(err.message || 'Failed to load hospital dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between antialiased">
      {/* Master Hospital Header */}
      <HospitalHeader user={user} profile={profileData} onLogout={logout} currentPath="/hospital/dashboard" />

      <main className="flex-grow py-8">
        <Container size="lg">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-brand-navy">
              <RefreshCw className="w-8 h-8 text-brand-red animate-spin" />
              <span className="text-sm font-semibold">Loading Hospital Portal...</span>
            </div>
          ) : errorMsg ? (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm max-w-lg mx-auto text-center my-12">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-600" />
              <p className="font-bold mb-3">{errorMsg}</p>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <>
              {/* Unverified Hospital Banner Alert */}
              {profileData && !profileData.isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-sm"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-extrabold text-amber-950 block text-sm mb-0.5">
                      Verification Pending
                    </strong>
                    <span>
                      Your hospital registration is currently under administrative verification. You may inspect your profile, but creating new blood requests requires verification clearance.
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Statistics Counters */}
              <HospitalStatsCards stats={stats} />

              {/* Header Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-brand-navy tracking-tight flex items-center gap-2">
                    <Activity className="w-5 h-5 text-brand-red" />
                    <span>Hospital Blood Requests Feed</span>
                  </h2>
                  <p className="text-xs text-brand-slate">
                    Manage active blood requests and track fulfillment progress in real-time.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  icon={PlusCircle}
                  disabled={profileData && !profileData.isVerified}
                  onClick={() => { window.location.href = '/hospital/requests/new'; }}
                >
                  + Create Blood Request
                </Button>
              </div>

              {/* Request Feed */}
              {requests.length === 0 ? (
                <Card variant="default" className="p-10 text-center border border-slate-200">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy mb-1">No blood requests yet.</h3>
                  <p className="text-xs text-brand-slate max-w-md mx-auto mb-6 leading-relaxed">
                    Create a blood request when your hospital needs blood support.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    icon={PlusCircle}
                    disabled={profileData && !profileData.isVerified}
                    onClick={() => { window.location.href = '/hospital/requests/new'; }}
                  >
                    Create Blood Request
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <RequestCard key={req._id} request={req} />
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
