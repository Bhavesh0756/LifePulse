import React from 'react';
import Container from '../../components/Container';
import Card from '../../components/Card';
import { IMPACT_STATS } from '../../data/landingData';
import { Users, Building2, CheckCircle2, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Users: Users,
  Building2: Building2,
  CheckCircle2: CheckCircle2,
  Activity: Activity,
};

export default function ImpactStatsSection() {
  return (
    <section id="impact" className="py-20 bg-brand-navy text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

      <Container size="lg" className="relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red mb-3 block">
            DEMONSTRATION PLATFORM METRICS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Saving Lives at Scale
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            Our platform framework is engineered for instant scalability across verified hospital networks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {IMPACT_STATS.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Activity;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card variant="dark" className="text-center p-8 border border-slate-800/80 hover:border-brand-red/40 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-brand-red/20 text-brand-red flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {stat.label}
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
