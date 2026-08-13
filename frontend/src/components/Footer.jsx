import React from 'react';
import LifePulseLogo from '../assets/logo/LifePulseLogo';
import Container from './Container';
import { HeartPulse, ShieldCheck, Lock, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-12 border-t border-slate-800">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <LifePulseLogo variant="light" size="lg" />
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mt-2">
              Connecting verified healthcare institutions with compatible blood donors when every second matters. Privacy-first, consent-based coordination.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 w-fit">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Donor Contact Shared Only Upon Explicit Consent
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li><a href="#hero" className="hover:text-brand-red transition-colors">Home</a></li>
              <li><a href="#how-it-works" className="hover:text-brand-red transition-colors">How It Works</a></li>
              <li><a href="#privacy" className="hover:text-brand-red transition-colors">Privacy Model</a></li>
              <li><a href="#emergency" className="hover:text-brand-red transition-colors">Emergency Requests</a></li>
              <li><a href="#compatibility" className="hover:text-brand-red transition-colors">Blood Compatibility Guide</a></li>
            </ul>
          </div>

          {/* Col 3: For Donors */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">For Donors</h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li><a href="#" className="hover:text-brand-red transition-colors">Register as Donor</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Donor Portal</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Donation Eligibility Guide</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Privacy Protections</a></li>
            </ul>
          </div>

          {/* Col 4: For Hospitals & Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hospitals & Legal</h3>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li><a href="#" className="hover:text-brand-red transition-colors">Hospital Verification</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Submit Blood Request</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            LifePulse &copy; {new Date().getFullYear()} — Privacy-First HealthTech Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-slate-400">
              Educational & Platform Prioritization Service — Not a Medical Diagnosis Tool
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
