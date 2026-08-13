import React from 'react';
import Container from '../../components/Container';
import Card from '../../components/Card';
import { VALUE_PROPOSITIONS } from '../../data/landingData';
import { Network, ShieldCheck, Zap, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Network: Network,
  ShieldCheck: ShieldCheck,
  Zap: Zap,
  HeartPulse: HeartPulse,
};

export default function ValuePropsSection() {
  return (
    <section className="relative -mt-10 z-20 pb-16">
      <Container size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPOSITIONS.map((item, index) => {
            const IconComponent = iconMap[item.icon] || HeartPulse;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card variant="interactive" className="h-full flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                        {item.code}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-brand-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-slate leading-relaxed">
                      {item.description}
                    </p>
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
