import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import SoftBlushWaveBackground from '../../components/donor/SoftBlushWaveBackground';
import DonorProfileForm from '../../components/donor/DonorProfileForm';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import { Badge } from '../../components/Badge';
import {
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Heart,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function DonorProfilePage() {
  const { user, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await donorService.getProfile();
      if (res.success) {
        setProfileData(res.data.profile);
      }
    } catch (err) {
      console.error('[Donor Profile Load Error]:', err);
      setErrorMsg(err.message || 'Failed to load profile data.');
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

  const name = user?.name || profileData?.name || 'Verified Donor';
  const email = user?.email || profileData?.email || 'donor@lifepulse.org';
  const bloodGroup = user?.bloodGroup || profileData?.bloodGroup || 'A+';
  const isAvailable = profileData?.isAvailable ?? true;
  const eligibilityStatus = profileData?.eligibilityStatus || 'ELIGIBLE';

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
          <DonorSidebar activeRoute="/donor/profile" />
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
                  activeRoute="/donor/profile"
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

          {/* Large Donor Identity Card */}
          <Card variant="elevated" className="p-6 sm:p-8 border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar Circle with Blood Group Badge */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-navy to-slate-800 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-xl bg-brand-red text-white text-xs font-black shadow-md border-2 border-white">
                  {bloodGroup}
                </div>
              </div>

              {/* Identity Metadata */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-black text-brand-navy tracking-tight">{name}</h2>
                    <p className="text-xs font-semibold text-slate-400">Verified LifePulse Donor Identity</p>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                    <Badge variant={eligibilityStatus === 'ELIGIBLE' ? 'success' : 'warning'} className="text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                      {eligibilityStatus}
                    </Badge>

                    <Badge variant={isAvailable ? 'brand' : 'secondary'} className="text-xs">
                      <Heart className="w-3.5 h-3.5 inline mr-1" />
                      {isAvailable ? 'Available for Standby' : 'Standby Paused'}
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap justify-center sm:justify-start items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profileData?.address?.city
                      ? `${profileData.address.city}, ${profileData.address.state || ''}`
                      : 'Location Not Set'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    Match Radius: {profileData?.preferredRadiusKm || 25} km
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Donor Profile Form Container */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-brand-navy">Donor Information & Preferences</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Update your preferred location, match radius, emergency contact details, and clearance status.
              </p>
            </div>

            <DonorProfileForm
              profile={profileData}
              user={user}
              onSave={handleSaveProfile}
              isSaving={isSavingProfile}
            />
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
