import React from 'react';
import Container from '../../components/Container';
import { Button } from '../../components/Button';
import { HeartPulse, Hospital, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-navy via-brand-navy to-slate-900 text-white relative overflow-hidden">
      {/* Glow Overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/20 rounded-full blur-[140px] pointer-events-none" />

      <Container size="md" className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center max-w-3xl mx-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-red text-white flex items-center justify-center mb-6 shadow-crimson-glow">
            <HeartPulse className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Someone May Need Your <span className="text-brand-red">Blood Today.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
            Become part of a privacy-first trusted network connecting verified hospitals with available blood donors when every minute counts.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
            <Button
              variant="primary"
              size="lg"
              icon={HeartPulse}
              onClick={() => { window.location.href = '/register'; }}
            >
              Become a Donor
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-slate-700 hover:bg-slate-800 hover:border-slate-500"
              icon={Hospital}
              onClick={() => { window.location.href = '/register'; }}
            >
              Request Blood
            </Button>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Consent-Based Contact Sharing • Zero Unwanted Calls</span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
