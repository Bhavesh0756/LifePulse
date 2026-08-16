import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import CrimsonFlowECGBackground from '../../components/admin/CrimsonFlowECGBackground';
import Footer from '../../components/Footer';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  User,
  ShieldCheck,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Save,
  Key,
  Building2,
  LayoutDashboard,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function AdminProfilePage() {
  const { user, logout, updateUserProfile } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updatedUser = await updateUserProfile({ name, phone });
      if (updatedUser) {
        setSuccessMsg('Profile updated successfully.');
      } else {
        setErrorMsg('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('[Profile Update Error]:', err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-brand-navy flex flex-col justify-between antialiased relative overflow-x-hidden select-none">
      <CrimsonFlowECGBackground />

      <AdminHeader
        user={user}
        onLogout={logout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 relative overflow-hidden z-10">
        <AdminSidebar
          activeTab="profile"
          onTabChange={(tab) => {
            if (tab === 'analytics' || tab === 'hospitals' || tab === 'users' || tab === 'requests') {
              window.location.href = '/admin/dashboard';
            }
          }}
          user={user}
          onLogout={logout}
          className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-[1200px] mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-rose-50 text-brand-red border border-rose-200/80 inline-block mb-1">
                ACCOUNT & SECURITY
              </span>
              <h1 className="text-2xl font-black text-brand-navy tracking-tight">
                Admin Profile
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage your administrative identity and profile information.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={LayoutDashboard}
              onClick={() => (window.location.href = '/admin/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Profile Identity Overview Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-brand-navy text-white flex items-center justify-center font-black text-3xl shadow-lg border-2 border-brand-red mb-4">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <h2 className="text-xl font-black text-brand-navy">{user?.name || 'System Administrator'}</h2>
            <span className="text-xs font-bold text-slate-500 mt-0.5">{user?.role || 'Super Administrator'}</span>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="success">Active System Administrator</Badge>
            </div>
          </div>

          {/* Account Information Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
                <User className="w-4 h-4 text-brand-red" />
                <span>Account Information</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Update your administrative display name and contact phone number.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-extrabold text-brand-navy mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-extrabold text-brand-navy mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter contact phone..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all"
                  />
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-xs font-extrabold text-brand-navy mb-1 flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Read Only
                    </span>
                  </label>
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={user?.email || 'admin@lifepulse.org'}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>

                {/* Role (Read Only) */}
                <div>
                  <label className="block text-xs font-extrabold text-brand-navy mb-1 flex items-center justify-between">
                    <span>System Role</span>
                    <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Read Only
                    </span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={user?.role || 'ADMIN'}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  disabled={isSaving}
                  icon={Save}
                  className="bg-brand-red hover:bg-rose-700 text-white"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Security</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Password and account authentication security settings.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={Key}
              onClick={() => alert('Password management is managed securely via system authentication credentials.')}
            >
              Change Password
            </Button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
