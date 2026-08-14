import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from './HeroSection';
import ValuePropsSection from './ValuePropsSection';
import HowItWorksSection from './HowItWorksSection';
import PrivacyFeatureSection from './PrivacyFeatureSection';
import EmergencyRequestsSection from './EmergencyRequestsSection';
import ImpactStatsSection from './ImpactStatsSection';
import BloodCompatibilitySection from './BloodCompatibilitySection';
import FinalCTASection from './FinalCTASection';
import PulseRevealIntro from '../../components/common/PulseRevealIntro';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [introFinished, setIntroFinished] = useState(() => {
    return !!sessionStorage.getItem('lifepulse_signature_intro_shown');
  });

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        if (hash === '#hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col antialiased">
      {/* Initial Website Entry Intro Experience */}
      {!introFinished && (
        <PulseRevealIntro onComplete={() => setIntroFinished(true)} />
      )}

      {/* Main Home Page Content with Smooth Cinematic Entrance Reveal */}
      <motion.div
        initial={introFinished ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="flex flex-col min-h-screen"
      >
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <ValuePropsSection />
          <HowItWorksSection />
          <PrivacyFeatureSection />
          <EmergencyRequestsSection />
          <ImpactStatsSection />
          <BloodCompatibilitySection />
          <FinalCTASection />
        </main>
        <Footer />
      </motion.div>
    </div>
  );
}
