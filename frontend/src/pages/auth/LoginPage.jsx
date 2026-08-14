import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Container from '../../components/Container';
import Card from '../../components/Card';
import { Button } from '../../components/Button';
import LifePulseLogo from '../../assets/logo/LifePulseLogo';
import { Lock, Mail, Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { user, isAuthenticated, login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    if (!formData.email || !formData.password) {
      setErrorMsg('Please provide both email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const loggedInUser = await login(formData);
      const targetPortal =
        loggedInUser.role === 'DONOR'
          ? '/donor/dashboard'
          : loggedInUser.role === 'HOSPITAL'
          ? '/hospital/dashboard'
          : '/admin/dashboard';
      window.location.href = targetPortal;
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col justify-between antialiased">
      <Navbar />

      <main className="flex-grow py-12 md:py-20 flex items-center">
        <Container size="md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Left Column: Healthcare Trust Visual Card */}
            <div className="lg:col-span-5 bg-brand-navy text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden hidden lg:flex min-h-[480px]">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-red/20 rounded-full blur-3xl pointer-events-none" />

              <div>
                <LifePulseLogo variant="light" size="lg" className="mb-8" />
                <h2 className="text-2xl font-extrabold tracking-tight leading-snug mb-4">
                  Privacy-First Blood Donation Network
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Sign in to access your secure portal. Your contact information is protected and shared strictly upon explicit consent.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Healthcare Institutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-brand-red shrink-0" />
                  <span>Logistical Compatibility Prioritization</span>
                </div>
              </div>
            </div>

            {/* Right Column: Login Form */}
            <div className="lg:col-span-7">
              <Card variant="elevated" className="p-8 sm:p-10 border border-slate-200">
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-xs text-brand-slate">
                    Please enter your credentials to access your account.
                  </p>
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

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="login-email" className="block text-xs font-bold text-brand-navy mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="login-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="login-password" className="block text-xs font-bold text-brand-navy">
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-brand-navy focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full justify-center mt-2"
                    icon={LogIn}
                  >
                    {isSubmitting ? 'Signing In...' : 'Login to Portal'}
                  </Button>
                </form>

                {/* Footer link */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-brand-slate">
                  Don&apos;t have a LifePulse account yet?{' '}
                  <a href="/register" className="font-bold text-brand-red hover:underline">
                    Register Here
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
