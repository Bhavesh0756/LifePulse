import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitalService } from '../../services/hospitalService';
import HospitalHeader from '../../components/hospital/HospitalHeader';
import Container from '../../components/Container';
import Card from '../../components/Card';
import Footer from '../../components/Footer';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Hospital, MapPin, Phone, ShieldCheck, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HospitalProfilePage() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    hospitalName: '',
    registrationNumber: '',
    phone: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyEmail: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const res = await hospitalService.getHospitalProfile();
        if (res.success && res.data.profile) {
          const p = res.data.profile;
          setProfile(p);
          setFormData({
            hospitalName: p.hospitalName || user?.hospitalName || '',
            registrationNumber: p.registrationNumber || '',
            phone: p.phone || user?.phone || '',
            emergencyName: p.emergencyContact?.name || '',
            emergencyPhone: p.emergencyContact?.phone || '',
            emergencyEmail: p.emergencyContact?.email || '',
            street: p.address?.street || '',
            city: p.address?.city || '',
            state: p.address?.state || '',
            zipCode: p.address?.zipCode || '',
          });
        }
      } catch (err) {
        console.error('[Load Hospital Profile Error]:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.hospitalName.trim()) {
      setMessage({ type: 'error', text: 'Hospital Name is required.' });
      return;
    }
    if (!formData.phone.trim()) {
      setMessage({ type: 'error', text: 'Hospital Phone number is required.' });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        hospitalName: formData.hospitalName.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        phone: formData.phone.trim(),
        emergencyContact: {
          name: formData.emergencyName.trim(),
          phone: formData.emergencyPhone.trim(),
          email: formData.emergencyEmail.trim(),
        },
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zipCode: formData.zipCode.trim(),
        },
      };

      const res = await hospitalService.updateHospitalProfile(payload);
      if (res.success && res.data.profile) {
        setProfile(res.data.profile);
        setMessage({ type: 'success', text: 'Hospital profile saved successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between antialiased">
      <HospitalHeader user={user} profile={profile} onLogout={logout} currentPath="/hospital/profile" />

      <main className="flex-grow py-8">
        <Container size="md">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-brand-navy">
              <RefreshCw className="w-8 h-8 text-brand-red animate-spin" />
              <span className="text-sm font-semibold">Loading Hospital Profile...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                    message.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{message.text}</span>
                </motion.div>
              )}

              {/* Institution Credentials & Verification Header */}
              <Card variant="elevated" className="p-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-navy text-white flex items-center justify-center font-bold">
                      <Hospital className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-extrabold text-brand-navy">
                        {profile?.hospitalName || user?.hospitalName}
                      </h1>
                      <span className="text-xs text-brand-slate block">Account Email: {user?.email}</span>
                    </div>
                  </div>

                  <div>
                    <Badge variant={profile?.isVerified ? 'success' : 'warning'} className="py-1 px-3 text-xs uppercase">
                      {profile?.isVerified ? 'VERIFIED HEALTHCARE INSTITUTION' : 'VERIFICATION PENDING'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">
                      Medical Registration / License Code
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="REG-MH-2026-990"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                    />
                  </div>
                </div>
              </Card>

              {/* Location Address */}
              <Card variant="elevated" className="p-6 border border-slate-200">
                <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-red" />
                  <span>Hospital Facility Location</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="100 Medical Center Drive"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="400001"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Phone & Emergency Dispatch Contact */}
              <Card variant="elevated" className="p-6 border border-slate-200">
                <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-brand-red" />
                  <span>Hospital Contacts & Emergency Dispatch</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1">Main Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1">Dispatch Contact Person</label>
                      <input
                        type="text"
                        name="emergencyName"
                        value={formData.emergencyName}
                        onChange={handleChange}
                        placeholder="Dr. Robert Smith"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1">Dispatch Direct Phone</label>
                      <input
                        type="text"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        placeholder="+91 98765 11111"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-navy mb-1">Dispatch Direct Email</label>
                      <input
                        type="email"
                        name="emergencyEmail"
                        value={formData.emergencyEmail}
                        onChange={handleChange}
                        placeholder="dispatch@hospital.org"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" variant="primary" size="lg" disabled={isSaving} icon={Save}>
                  {isSaving ? 'Saving Profile...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
