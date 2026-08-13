import React, { useState } from 'react';
import Container from '../../components/Container';
import SectionHeading from '../../components/SectionHeading';
import Card from '../../components/Card';
import { Badge } from '../../components/Badge';
import { BLOOD_COMPATIBILITY_MATRIX } from '../../data/landingData';
import { HeartPulse, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BloodCompatibilitySection() {
  const [selectedType, setSelectedType] = useState('O-');

  const selectedData = BLOOD_COMPATIBILITY_MATRIX.find(item => item.type === selectedType) || BLOOD_COMPATIBILITY_MATRIX[0];

  return (
    <section id="compatibility" className="py-20 bg-white relative">
      <Container size="lg">
        <SectionHeading
          badgeText="EDUCATIONAL REFERENCE"
          badgeIcon={HeartPulse}
          title="Blood Group"
          highlightWord="Compatibility"
          subtitle="Understand general red cell donor and recipient compatibility dynamics across all 8 major blood groups."
        />

        {/* Mandatory Educational Disclaimer Banner */}
        <div className="max-w-4xl mx-auto mb-10 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-amber-950 mb-0.5">Educational Reference Notice</strong>
            <span>
              This compatibility guide is provided strictly for general educational context and platform logistics demonstration. It does not constitute medical diagnosis, clinical matching rules, or personalized health advice. Clinical blood transfusions require laboratory cross-matching by authorized medical personnel.
            </span>
          </div>
        </div>

        {/* Blood Group Selector Grid */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {BLOOD_COMPATIBILITY_MATRIX.map((item) => (
              <button
                type="button"
                key={item.type}
                onClick={() => setSelectedType(item.type)}
                className={`py-3 px-2 rounded-xl font-extrabold text-sm border transition-all duration-200 ${
                  selectedType === item.type
                    ? 'bg-brand-red text-white border-brand-red shadow-crimson-glow scale-105'
                    : 'bg-white text-brand-navy border-slate-200 hover:bg-slate-50'
                }`}
              >
                {item.type}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Blood Group Details Panel */}
        <div className="max-w-4xl mx-auto">
          <Card variant="elevated" className="p-8 border border-slate-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-red/10 text-brand-red font-black text-2xl flex items-center justify-center border border-brand-red/20 shadow-sm">
                  {selectedData.type}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-navy">{selectedData.name}</h3>
                  <span className="text-xs text-brand-slate block mt-1">Populations Rarity: {selectedData.rarity}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${selectedData.badgeColor}`}>
                {selectedData.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              {/* Can Donate To */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Can Donate Red Cells To ({selectedData.canDonateTo.length} Types)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedData.canDonateTo.map((type) => (
                    <span key={type} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-brand-navy shadow-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Can Receive From */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Can Receive Red Cells From ({selectedData.canReceiveFrom.length} Types)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedData.canReceiveFrom.map((type) => (
                    <span key={type} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-brand-navy shadow-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
