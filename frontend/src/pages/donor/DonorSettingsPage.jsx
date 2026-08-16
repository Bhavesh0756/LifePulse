import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import SoftBlushWaveBackground from '../../components/donor/SoftBlushWaveBackground';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import { Button } from '../../components/Button';
import {
  Settings,
  Bell,
  ShieldCheck,
  Zap,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  Moon,
  Eye,
  Smartphone,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function DonorSettingsPage() {
  const { user, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Preference Toggle States
  const [settings, setSettings] = useState({
    smsAlerts: true,
    emailAlerts: true,
    emergencyPush: true,
    anonymizeBroadcasts: false,
    radiusKm: 25,
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await donorService.getProfile();
      if (res.success && res.data.profile) {
        setProfileData(res.data.profile);
        setSettings((prev) => ({
          ...prev,
          radiusKm: res.data.profile.preferredRadiusKm || 25,
        }));
      }
    } catch (err) {
      console.error('[Donor Settings Load Error]:', err);
      setErrorMsg(err.message || 'Failed to load preferences.');
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

  const handleToggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setMessage(null);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await donorService.updateProfile({
        preferredRadiusKm: Number(settings.radiusKm),
      });
      setMessage({ type: 'success', text: 'Application settings and notification preferences updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setIsSaving(false);
    }
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
          <DonorSidebar activeRoute="/donor/settings" />
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
                  activeRoute="/donor/settings"
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

          {message && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Settings Body */}
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Section 1: Notifications & Emergency Broadcast Preferences */}
            <Card variant="elevated" className="p-6 sm:p-8 border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
                  <Bell className="w-5 h-5 text-brand-red" />
                  <span>Emergency Alerts & Notification Preferences</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Control how and when LifePulse alerts you about urgent blood requests matching your blood group.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="block font-bold text-brand-navy">Emergency SMS Alerts</span>
                    <span className="text-[11px] text-slate-400 font-medium">Receive direct SMS notifications for critical hospital requests.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsAlerts}
                    onChange={() => handleToggleSetting('smsAlerts')}
                    className="w-4 h-4 accent-brand-red cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="block font-bold text-brand-navy">Email Digest & Match Updates</span>
                    <span className="text-[11px] text-slate-400 font-medium">Get email notifications for nearby requests and digital certificates.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={() => handleToggleSetting('emailAlerts')}
                    className="w-4 h-4 accent-brand-red cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="block font-bold text-brand-navy">Real-Time In-App Push Alerts</span>
                    <span className="text-[11px] text-slate-400 font-medium">Show real-time toast alerts when logged into the LifePulse Portal.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emergencyPush}
                    onChange={() => handleToggleSetting('emergencyPush')}
                    className="w-4 h-4 accent-brand-red cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            {/* Section 2: Privacy & Broadcast Preferences */}
            <Card variant="elevated" className="p-6 sm:p-8 border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
                  <Eye className="w-5 h-5 text-brand-red" />
                  <span>Privacy & Donor Anonymity Settings</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Protect your identity details during initial hospital matching until you explicitly consent.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="block font-bold text-brand-navy">Anonymize Identity on Broadcasts</span>
                    <span className="text-[11px] text-slate-400 font-medium">Show only anonymous ID to hospitals until you accept an emergency request.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.anonymizeBroadcasts}
                    onChange={() => handleToggleSetting('anonymizeBroadcasts')}
                    className="w-4 h-4 accent-brand-red cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            {/* Section 3: Match Radius Setting */}
            <Card variant="elevated" className="p-6 sm:p-8 border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-red" />
                  <span>Match Distance Radius</span>
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-brand-navy">
                    Current Preferred Distance Radius: <span className="text-brand-red font-black">{settings.radiusKm} km</span>
                  </label>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={settings.radiusKm}
                  onChange={(e) => setSettings({ ...settings, radiusKm: e.target.value })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5 km</span>
                  <span>50 km</span>
                  <span>100 km</span>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSaving}
                icon={Save}
              >
                {isSaving ? 'Saving Settings...' : 'Save Settings Preferences'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
