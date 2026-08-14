import React, { useState } from 'react';
import Container from '../../components/Container';
import SectionHeading from '../../components/SectionHeading';
import Card from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Lock, Unlock, CheckCircle2, ShieldCheck, EyeOff, Phone, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivacyFeatureSection() {
  const [accepted, setAccepted] = useState(false);

  return (
    <section id="privacy" className="py-20 bg-white relative overflow-hidden">
      <Container size="lg">
        <SectionHeading
          badgeText="PRIVACY-FIRST GUARANTEE"
          badgeIcon={ShieldCheck}
          title="Your Contact."
          highlightWord="Your Choice."
          subtitle="LifePulse ensures complete donor anonymity. Hospitals can never view donor contact details until the donor explicitly accepts a request."
        />

        {/* Interactive Privacy Demonstration Box */}
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-card">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-brand-navy text-white text-xs font-bold uppercase tracking-wider mb-2">
                Live Privacy Demonstration
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Donor Consent Simulation</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={accepted ? "outline" : "primary"}
                size="sm"
                onClick={() => setAccepted(!accepted)}
              >
                {accepted ? "Reset Simulation (Revoke)" : "Simulate Donor 'Accept Request'"}
              </Button>
            </div>
          </div>

          {/* Workflow Sequence Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            {/* Step 1: Request */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Step 1</span>
                <h4 className="font-bold text-brand-navy text-sm mb-2">Hospital Submits Request</h4>
                <p className="text-xs text-brand-slate">Hospital specifies O- blood needed (2 units) for urgent surgery.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-navy">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                Matching Engine Active
              </div>
            </div>

            {/* Step 2: Matching */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Step 2</span>
                <h4 className="font-bold text-brand-navy text-sm mb-2">Donor Receives Alert</h4>
                <p className="text-xs text-brand-slate">Compatible donors in 5km radius receive notification with location.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-600">
                <Lock className="w-3.5 h-3.5 mr-1.5" />
                Contact Info Hidden
              </div>
            </div>

            {/* Step 3: Consent */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${accepted ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'}`}>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Step 3</span>
                <h4 className="font-bold text-brand-navy text-sm mb-2">Donor Decision</h4>
                <p className="text-xs text-brand-slate">Donor clicks Accept to grant explicit contact sharing consent.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                {accepted ? (
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Consent Granted
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-semibold text-slate-400">
                    Awaiting Donor Action
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Hospital View Card Comparison */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Hospital View — Donor Details Card
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Profile summary */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-lg">
                  JD
                </div>
                <div>
                  <h5 className="font-bold text-brand-navy">Donor Match #4092</h5>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <Badge variant="brand" size="sm">O- Donor</Badge>
                    <span>Logistical Match Score: 96%</span>
                  </div>
                </div>
              </div>

              {/* Contact Data Field Privacy Box */}
              <AnimatePresence mode="wait">
                {!accepted ? (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number:</span>
                      <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-600 flex items-center gap-1">
                        <EyeOff className="w-3 h-3 text-brand-red" /> 🔒 Hidden Until Consent
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address:</span>
                      <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-600 flex items-center gap-1">
                        <EyeOff className="w-3 h-3 text-brand-red" /> 🔒 Hidden Until Consent
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-emerald-900 font-medium">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone:</span>
                      <span className="font-mono font-bold text-emerald-800">+1 (555) 019-2834</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-900 font-medium">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-600" /> Email:</span>
                      <span className="font-mono font-bold text-emerald-800">donor.j.doe@example.com</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
