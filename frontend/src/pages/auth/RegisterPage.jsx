import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Container from '../../components/Container';
import Card from '../../components/Card';
import { Button } from '../../components/Button';
import LifePulseLogo from '../../assets/logo/LifePulseLogo';
import { BLOOD_GROUPS } from '../../data';
import { User, Hospital, Lock, Mail, Phone, Eye, EyeOff, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const { user, isAuthenticated, register } = useAuth();

  const [role, setRole] = useState('DONOR'); // DONOR | HOSPITAL
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodGroup: 'O+',
    hospitalName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to appropriate role portal
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath =
        user.role === 'DONOR'
          ? '/donor/dashboard'
          : user.role === 'HOSPITAL'
          ? '/hospital/dashboard'
          : '/admin/dashboard';
      window.location.href = redirectPath;
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Frontend Validations
    if (!formData.name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!formData.email.trim() || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (role === 'DONOR' && !formData.bloodGroup) {
      setErrorMsg('Please select your blood group.');
      return;
    }
    if (role === 'HOSPITAL' && !formData.hospitalName.trim()) {
      setErrorMsg('Hospital Name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: role,
        bloodGroup: role === 'DONOR' ? formData.bloodGroup : undefined,
        hospitalName: role === 'HOSPITAL' ? formData.hospitalName.trim() : undefined,
      };

      const newUser = await register(payload);
      const targetPortal =
        newUser.role === 'DONOR'
          ? '/donor/dashboard'
          : newUser.role === 'HOSPITAL'
          ? '/hospital/dashboard'
          : '/admin/dashboard';
      window.location.href = targetPortal;
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between antialiased">
      <Navbar />

      <main className="flex-grow py-12 md:py-16 flex items-center">
        <Container size="md">
          <div className="max-w-2xl mx-auto">
            <Card variant="elevated" className="p-8 sm:p-10 border border-slate-200">
              <div className="text-center mb-8">
                <LifePulseLogo size="md" className="mx-auto mb-4" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight mb-2">
                  Join LifePulse
                </h1>
                <p className="text-xs text-brand-slate max-w-md mx-auto leading-relaxed">
                  Connect with a trusted network helping hospitals and donors coordinate when it matters most.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setRole('DONOR');
                    setErrorMsg('');
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === 'DONOR'
                      ? 'bg-brand-red text-white shadow-crimson-glow'
                      : 'text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Register as Donor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('HOSPITAL');
                    setErrorMsg('');
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    role === 'HOSPITAL'
                      ? 'bg-brand-navy text-white shadow-card'
                      : 'text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  <Hospital className="w-4 h-4" />
                  <span>Register Hospital</span>
                </button>
              </div>

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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-bold text-brand-navy mb-1">
                    {role === 'HOSPITAL' ? 'Authorized Contact Person Name' : 'Full Name'}
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={role === 'HOSPITAL' ? 'Dr. Sarah Connor' : 'Jane Doe'}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all"
                  />
                </div>

                {/* Role Specific Fields */}
                {role === 'DONOR' ? (
                  <div>
                    <label htmlFor="reg-bloodGroup" className="block text-xs font-bold text-brand-navy mb-1">
                      Blood Group
                    </label>
                    <select
                      id="reg-bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg} Blood Group
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="reg-hospitalName" className="block text-xs font-bold text-brand-navy mb-1">
                      Hospital / Healthcare Institution Name
                    </label>
                    <input
                      id="reg-hospitalName"
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      placeholder="St. Jude Memorial Hospital"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all"
                    />
                  </div>
                )}

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-bold text-brand-navy mb-1">
                      Email Address
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="block text-xs font-bold text-brand-navy mb-1">
                      Phone Number
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 019-2834"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reg-password" className="block text-xs font-bold text-brand-navy mb-1">
                      Password (min 6 chars)
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-navy"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-confirmPassword" className="block text-xs font-bold text-brand-navy mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="reg-confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full justify-center mt-4"
                  icon={UserPlus}
                >
                  {isSubmitting ? 'Creating Account...' : `Create ${role === 'DONOR' ? 'Donor' : 'Hospital'} Account`}
                </Button>
              </form>

              {/* Footer link */}
              <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-brand-slate">
                Already registered on LifePulse?{' '}
                <a href="/login" className="font-bold text-brand-red hover:underline">
                  Sign In
                </a>
              </div>
            </Card>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
