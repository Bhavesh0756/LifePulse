import React from 'react';
import Container from '../../components/Container';
import SectionHeading from '../../components/SectionHeading';
import Card from '../../components/Card';
import { HOW_IT_WORKS_STEPS } from '../../data/landingData';
import { Hospital, Cpu, UserCheck, PhoneCall, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Hospital: Hospital,
  Cpu: Cpu,
  UserCheck: UserCheck,
  PhoneCall: PhoneCall,
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-brand-bg relative">
      <Container size="lg">
        <SectionHeading
          badgeText="WORKFLOW TRANSPARENCY"
          badgeIcon={Shield}
          title="How LifePulse"
          highlightWord="Works"
          subtitle="Four seamless steps connecting hospital emergency requests with willing donors, preserving privacy at every stage."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const IconComponent = iconMap[step.icon] || Hospital;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative"
              >
                <Card variant="elevated" className="h-full flex flex-col justify-between p-6 relative overflow-hidden group hover:border-brand-red/40">
                  {/* Watermark Step Number */}
                  <span className="absolute -top-3 -right-2 text-6xl font-black text-slate-100 group-hover:text-brand-red/10 transition-colors select-none">
                    {step.step}
                  </span>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-6 shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-bold text-brand-red uppercase tracking-wider block mb-1">
                      Step {step.step}
                    </span>
                    <h3 className="text-lg font-bold text-brand-navy mb-3 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-brand-slate leading-relaxed mb-4">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-brand-navy">
                    <span>{step.detail}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-red transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
