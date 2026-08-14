import React from 'react';
import Container from '../../components/Container';
import SectionHeading from '../../components/SectionHeading';
import Card from '../../components/Card';
import { Badge, StatusBadge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { EMERGENCY_REQUESTS } from '../../data/landingData';
import { AlertCircle, Hospital, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmergencyRequestsSection() {
  return (
    <section id="emergency" className="py-20 bg-brand-bg relative">
      <Container size="lg">
        <SectionHeading
          badgeText="URGENT DISPATCH RADAR"
          badgeIcon={AlertCircle}
          title="When Every Second"
          highlightWord="Matters."
          subtitle="Real-time hospital blood requests queued on LifePulse for immediate donor coordination."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {EMERGENCY_REQUESTS.map((req, index) => {
            const percentFulfilled = Math.round((req.unitsConfirmed / req.unitsRequired) * 100);
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card variant="borderAccent" className="h-full flex flex-col justify-between p-6">
                  <div>
                    {/* Top Header */}
                    <div className="flex items-center justify-between mb-4">
                      <StatusBadge status="Emergency" />
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-red" />
                        {req.timeLabel}
                      </span>
                    </div>

                    {/* Blood Group Badge */}
                    <div className="flex items-center justify-between my-3">
                      <div>
                        <span className="text-3xl font-black text-brand-red">{req.bloodGroup}</span>
                        <span className="text-xs font-bold text-brand-navy block mt-0.5">Blood Needed</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-brand-navy">{req.unitsRequired} Units</span>
                        <span className="text-xs text-slate-500 block">{req.unitsConfirmed} Confirmed</span>
                      </div>
                    </div>

                    {/* Hospital & Location */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                        <Hospital className="w-4 h-4 text-brand-navy shrink-0" />
                        <span className="truncate">{req.hospitalName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-brand-slate">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{req.location} • {req.distance}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>Fulfillment Progress</span>
                        <span>{percentFulfilled}% ({req.unitsConfirmed}/{req.unitsRequired})</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-brand-red to-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentFulfilled}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button variant="primary" size="sm" className="w-full justify-center" icon={ArrowRight} iconPosition="right">
                      Respond to Request
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="text-center">
          <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
            View All Active Requests
          </Button>
        </div>
      </Container>
    </section>
  );
}
