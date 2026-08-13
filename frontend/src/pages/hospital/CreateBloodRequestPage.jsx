import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitalService } from '../../services/hospitalService';
import HospitalHeader from '../../components/hospital/HospitalHeader';
import Container from '../../components/Container';
import Card from '../../components/Card';
import Footer from '../../components/Footer';
import { Button } from '../../components/Button';
import { BLOOD_GROUPS } from '../../data';
import { PlusCircle, AlertCircle, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreateBloodRequestPage() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    bloodGroup: 'O+',
    unitsRequired: 2,
    urgency: 'CRITICAL',
    requiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    reason: 'Emergency surgery requirement',
    patientReference: 'PT-2026-001',
    city: '',
    state: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingDev, setIsVerifyingDev] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await hospitalService.getHospitalProfile();
        if (res.success) {
          setProfile(res.data.profile);
          setFormData((prev) => ({
            ...prev,
            city: res.data.profile?.address?.city || 'Mumbai',
            state: res.data.profile?.address?.state || 'Maharashtra',
          }));
        }
      } catch (err) {
        console.error('[Load Profile Error]:', err);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMsg('');
  };

  // Dev helper to toggle verified status for testing
  const handleDevVerify = async () => {
    setIsVerifyingDev(true);
    try {
      const res = await hospitalService.updateHospitalProfile({ devSetVerified: true });
      if (res.success) {
        setProfile(res.data.profile);
        setErrorMsg('');
      }
    } catch (err) {
      alert('Dev verify error: ' + err.message);
    } finally {
      setIsVerifyingDev(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.bloodGroup) {
      setErrorMsg('Please select a blood group.');
      return;
    }
    if (!formData.unitsRequired || formData.unitsRequired < 1 || formData.unitsRequired > 20) {
      setErrorMsg('Units required must be between 1 and 20.');
      return;
    }
    if (!formData.urgency) {
      setErrorMsg('Please select urgency level.');
      return;
    }
    if (!formData.requiredDate) {
      setErrorMsg('Required date is required.');
      return;
    }
    if (!formData.reason.trim()) {
      setErrorMsg('Reason for request is required.');
      return;
    }
    if (!formData.patientReference.trim()) {
      setErrorMsg('Non-identifying patient reference (e.g. PT-2026-001) is required.');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      setErrorMsg('City and State are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        bloodGroup: formData.bloodGroup,
        unitsRequired: Number(formData.unitsRequired),
        urgency: formData.urgency,
        requiredDate: formData.requiredDate,
        reason: formData.reason.trim(),
        patientReference: formData.patientReference.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
      };

      const res = await hospitalService.createBloodRequest(payload);
      if (res.success) {
        window.location.href = `/hospital/requests/${res.data.request._id}`;
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create blood request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between antialiased">
      <HospitalHeader user={user} profile={profile} onLogout={logout} currentPath="/hospital/requests" />

      <main className="flex-grow py-8">
        <Container size="md">
          <div className="mb-6 flex items-center justify-between">
            <a
              href="/hospital/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-red transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </div>

          <Card variant="elevated" className="p-8 sm:p-10 border border-slate-200">
            <div className="mb-8 border-b border-slate-100 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-red/10 text-brand-red flex items-center justify-center mb-4">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-brand-navy mb-1">Create Emergency Blood Request</h1>
              <p className="text-xs text-brand-slate">
                Broadcast a blood requirement to compatible donors within your coverage area.
              </p>
            </div>

            {/* Unverified Hospital Gate Notice */}
            {profile && !profile.isVerified && (
              <div className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                <div className="flex items-start gap-3 mb-3">
                  <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-extrabold text-sm text-rose-950 mb-1">Verification Required</h3>
                    <p className="leading-relaxed">
                      Your hospital account is currently pending administrative verification. Unverified hospital accounts are restricted from broadcasting blood requests to protect donor privacy and safety.
                    </p>
                  </div>
                </div>

                {/* Dev helper to verify in test env */}
                <div className="pt-3 border-t border-rose-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-rose-700 font-medium">Development Testing Override:</span>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isVerifyingDev}
                    onClick={handleDevVerify}
                    className="text-[11px] py-1"
                  >
                    {isVerifyingDev ? 'Verifying...' : 'Set Dev Status to Verified'}
                  </Button>
                </div>
              </div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Blood Group & Units Required */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="req-bloodGroup" className="block text-xs font-bold text-brand-navy mb-1.5">
                    Required Blood Group
                  </label>
                  <select
                    id="req-bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg} Blood Type
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="req-unitsRequired" className="block text-xs font-bold text-brand-navy mb-1.5">
                    Units Required (1–20 Units)
                  </label>
                  <input
                    id="req-unitsRequired"
                    type="number"
                    name="unitsRequired"
                    min="1"
                    max="20"
                    value={formData.unitsRequired}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                  />
                </div>
              </div>

              {/* Urgency Level & Required Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="req-urgency" className="block text-xs font-bold text-brand-navy mb-1.5">
                    Urgency Level
                  </label>
                  <select
                    id="req-urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                  >
                    <option value="CRITICAL">CRITICAL — Immediate Life Threat</option>
                    <option value="URGENT">URGENT — Required within 24 Hours</option>
                    <option value="HIGH">HIGH — Required within 48 Hours</option>
                    <option value="NORMAL">NORMAL — Scheduled Surgery</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="req-requiredDate" className="block text-xs font-bold text-brand-navy mb-1.5">
                    Required By Date
                  </label>
                  <input
                    id="req-requiredDate"
                    type="date"
                    name="requiredDate"
                    value={formData.requiredDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                  />
                </div>
              </div>

              {/* Patient Reference (Non-identifying) & Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="req-patientRef" className="block text-xs font-bold text-brand-navy mb-1.5">
                    Patient Reference Code (Non-Identifying)
                  </label>
                  <input
                    id="req-patientRef"
                    type="text"
                    name="patientReference"
                    value={formData.patientReference}
                    onChange={handleChange}
                    placeholder="PT-2026-001"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Privacy Rule: Do NOT enter patient full name or Aadhaar.
                  </span>
                </div>

                <div>
                  <label htmlFor="req-reason" className="block text-xs font-bold text-brand-navy mb-1.5">
                    Reason for Request
                  </label>
                  <select
                    id="req-reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                  >
                    <option value="Emergency surgery requirement">Emergency surgery requirement</option>
                    <option value="Accident trauma care">Accident trauma care</option>
                    <option value="Scheduled surgical procedure">Scheduled surgical procedure</option>
                    <option value="Pediatric transfusion requirement">Pediatric transfusion requirement</option>
                    <option value="Blood bank stock replenishment">Blood bank stock replenishment</option>
                  </select>
                </div>
              </div>

              {/* City & State Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="req-city" className="block text-xs font-bold text-brand-navy mb-1.5">
                    Hospital City Location
                  </label>
                  <input
                    id="req-city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="req-state" className="block text-xs font-bold text-brand-navy mb-1.5">
                    State
                  </label>
                  <input
                    id="req-state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <a href="/hospital/dashboard" className="text-xs font-bold text-slate-500 hover:underline">
                  Cancel
                </a>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting || (profile && !profile.isVerified)}
                  icon={PlusCircle}
                >
                  {isSubmitting ? 'Creating Request...' : 'Publish Blood Request'}
                </Button>
              </div>
            </form>
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
