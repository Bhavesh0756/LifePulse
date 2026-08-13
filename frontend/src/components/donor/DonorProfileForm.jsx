import React, { useState } from 'react';
import Card from '../Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { MapPin, Phone, ShieldCheck, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DonorProfileForm({ profile, user, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    street: profile?.address?.street || '',
    city: profile?.address?.city || '',
    state: profile?.address?.state || '',
    zipCode: profile?.address?.zipCode || '',
    preferredRadiusKm: profile?.preferredRadiusKm || 25,
    emergencyName: profile?.emergencyContact?.name || '',
    emergencyPhone: profile?.emergencyContact?.phone || '',
    emergencyRelation: profile?.emergencyContact?.relation || '',
    eligibilityStatus: profile?.eligibilityStatus || 'ELIGIBLE',
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const payload = {
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        preferredRadiusKm: Number(formData.preferredRadiusKm),
        emergencyContact: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
          relation: formData.emergencyRelation,
        },
        eligibilityStatus: formData.eligibilityStatus,
      };

      await onSave(payload);
      setMessage({ type: 'success', text: 'Donor profile and preferences saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    }
  };

  return (
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

      {/* Basic Account Overview Card */}
      <Card variant="elevated" className="p-6 border border-slate-200">
        <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-red" />
          <span>Account & Identity (Read-Only)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block font-bold text-slate-400 mb-0.5">Full Name</span>
            <span className="font-semibold text-brand-navy">{user?.name}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block font-bold text-slate-400 mb-0.5">Email Address</span>
            <span className="font-semibold text-brand-navy">{user?.email}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="block font-bold text-slate-400 mb-0.5">Blood Group</span>
            <span className="font-black text-brand-red">{user?.bloodGroup}</span>
          </div>
        </div>
      </Card>

      {/* Location & Radius Settings Card */}
      <Card variant="elevated" className="p-6 border border-slate-200">
        <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-red" />
          <span>Location & Match Radius</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Street Address</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="123 Health Ave, Suite 4"
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

          {/* Preferred Radius Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-brand-navy">
                Maximum Match Radius: <span className="text-brand-red font-extrabold">{formData.preferredRadiusKm} km</span>
              </label>
              <span className="text-[10px] text-slate-400">Radius for hospital alerts</span>
            </div>
            <input
              type="range"
              name="preferredRadiusKm"
              min="5"
              max="100"
              step="5"
              value={formData.preferredRadiusKm}
              onChange={handleChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>5 km</span>
              <span>50 km</span>
              <span>100 km</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Contact & Medical Status Card */}
      <Card variant="elevated" className="p-6 border border-slate-200">
        <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-brand-red" />
          <span>Emergency Contact & Medical Clearance</span>
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Contact Name</label>
              <input
                type="text"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                placeholder="John Connor"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Phone Number</label>
              <input
                type="text"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1">Relationship</label>
              <input
                type="text"
                name="emergencyRelation"
                value={formData.emergencyRelation}
                onChange={handleChange}
                placeholder="Spouse / Parent"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Eligibility Clearance Status</label>
            <select
              name="eligibilityStatus"
              value={formData.eligibilityStatus}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white"
            >
              <option value="ELIGIBLE">ELIGIBLE — Ready to donate</option>
              <option value="TEMPORARILY_INELIGIBLE">TEMPORARILY INELIGIBLE — Recent donation or travel</option>
              <option value="PERMANENTLY_INELIGIBLE">PERMANENTLY INELIGIBLE — Medical deferral</option>
            </select>
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
          {isSaving ? 'Saving Profile...' : 'Save Profile Changes'}
        </Button>
      </div>
    </form>
  );
}
