import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import DonorHeader from '../../components/donor/DonorHeader';
import DonorSidebar from '../../components/donor/DonorSidebar';
import SoftBlushWaveBackground from '../../components/donor/SoftBlushWaveBackground';
import Footer from '../../components/Footer';
import Card from '../../components/Card';
import { Badge } from '../../components/Badge';
import {
  Award,
  ShieldCheck,
  Heart,
  Zap,
  Flame,
  Star,
  CheckCircle2,
  Lock,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function DonorBadgesPage() {
  const { user, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, historyRes] = await Promise.all([
        donorService.getProfile(),
        donorService.getDonationHistory(),
      ]);

      if (profileRes.success) setProfileData(profileRes.data.profile);
      if (historyRes.success) setHistory(historyRes.data.history || []);
    } catch (err) {
      console.error('[Donor Badges Load Error]:', err);
      setErrorMsg(err.message || 'Failed to load achievements data.');
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

  const donationCount = history.length;
  const isAvailable = profileData?.isAvailable ?? true;
  const radius = profileData?.preferredRadiusKm || 25;

  // Calculate Real Badges
  const BADGES_LIST = [
    {
      id: 'standby_ready',
      title: 'Standby Guardian',
      subtitle: 'Active Standby Status',
      description: 'Keep your donor availability status active for emergency hospital broadcasts.',
      icon: Zap,
      unlocked: isAvailable,
      progressText: isAvailable ? 'Unlocked & Active' : 'Enable Standby Toggle to Unlock',
    },
    {
      id: 'first_donation',
      title: 'First Donation',
      subtitle: '1 Completed Donation',
      description: 'Successfully complete your first verified blood donation at a registered hospital.',
      icon: Heart,
      unlocked: donationCount >= 1,
      progressText: donationCount >= 1 ? 'Unlocked' : `${donationCount}/1 Donations Completed`,
    },
    {
      id: 'life_saver',
      title: 'Life Saver',
      subtitle: '2+ Completed Donations',
      description: 'Donate blood 2 or more times to save multiple patient lives.',
      icon: Award,
      unlocked: donationCount >= 2,
      progressText: donationCount >= 2 ? 'Unlocked' : `${donationCount}/2 Donations Completed`,
    },
    {
      id: 'emergency_hero',
      title: 'Emergency Hero',
      subtitle: 'Critical Response',
      description: 'Respond to urgent hospital requests in high-priority emergency scenarios.',
      icon: Flame,
      unlocked: donationCount >= 3,
      progressText: donationCount >= 3 ? 'Unlocked' : `${donationCount}/3 Donations Completed`,
    },
    {
      id: 'regular_donor',
      title: 'Regular Champion',
      subtitle: '5+ Completed Donations',
      description: 'Become a cornerstone donor with 5 or more verified life-saving contributions.',
      icon: Star,
      unlocked: donationCount >= 5,
      progressText: donationCount >= 5 ? 'Unlocked' : `${donationCount}/5 Donations Completed`,
    },
    {
      id: 'community_guardian',
      title: 'Community Guardian',
      subtitle: '25km+ Match Radius',
      description: 'Extend your donor reach radius to 25km or higher to protect surrounding medical zones.',
      icon: ShieldCheck,
      unlocked: radius >= 25,
      progressText: radius >= 25 ? 'Unlocked' : `Current Radius: ${radius}km / 25km Required`,
    },
  ];

  const unlockedCount = BADGES_LIST.filter((b) => b.unlocked).length;

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
          <DonorSidebar activeRoute="/donor/badges" />
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
                  activeRoute="/donor/badges"
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

          {/* Hero Banner Header */}
          <Card variant="elevated" className="p-6 sm:p-8 border border-slate-200/80 bg-gradient-to-r from-brand-navy via-slate-800 to-brand-navy text-white shadow-lg overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-rose-300 text-xs font-bold border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Donor Achievement Vault</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Your Life-Saving Milestones & Honors
                </h1>
                <p className="text-xs text-slate-300 max-w-xl font-medium">
                  Earned badges reflect real verified donation records and active standby contributions in your area.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-200">Unlocked Badges</span>
                <span className="text-3xl font-black text-white">{unlockedCount} / {BADGES_LIST.length}</span>
              </div>
            </div>
          </Card>

          {/* Badges Grid Section */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-brand-navy">Achievements & Motivations</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Complete emergency responses and keep your standby preferences active to unlock all honors.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BADGES_LIST.map((badge) => {
                const Icon = badge.icon;
                const isUnlocked = badge.unlocked;

                return (
                  <Card
                    key={badge.id}
                    variant="elevated"
                    className={`p-6 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-white via-rose-50/30 to-rose-50/60 border-rose-200/90 shadow-sm'
                        : 'bg-slate-50/60 border-slate-200/60 opacity-80'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${
                            isUnlocked
                              ? 'bg-gradient-to-br from-brand-red to-brand-crimson text-white border-rose-300'
                              : 'bg-slate-200/80 text-slate-400 border-slate-300'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        {isUnlocked ? (
                          <Badge variant="success" className="text-[10px]">
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            <Lock className="w-3 h-3 inline mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-extrabold text-brand-navy">{badge.title}</h3>
                        <span className="block text-[11px] font-bold text-slate-400 mt-0.5">{badge.subtitle}</span>
                        <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>{badge.progressText}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
