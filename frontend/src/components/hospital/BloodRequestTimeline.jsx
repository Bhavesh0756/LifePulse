import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Circle, XCircle, HeartPulse, ShieldCheck, Clock, Users } from 'lucide-react';

export default function BloodRequestTimeline({ requestStatus, matchData }) {
  const shouldReduceMotion = useReducedMotion();

  // If Cancelled, show terminal state
  if (requestStatus === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <XCircle className="w-6 h-6" />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold text-rose-900 mb-1">Request Cancelled</h3>
          <p className="text-sm text-rose-700">This blood request has been cancelled and is no longer active.</p>
        </div>
      </div>
    );
  }

  // Calculate secondary information
  let totalConsents = 0;
  let acceptedConsents = 0;
  
  if (matchData && matchData.matches) {
    matchData.matches.forEach(m => {
      if (m.consentStatus === 'PENDING' || m.consentStatus === 'ACCEPTED') {
        totalConsents++;
      }
      if (m.consentStatus === 'ACCEPTED') {
        acceptedConsents++;
      }
    });
  }

  const stages = [
    { id: 'OPEN', label: 'Open' },
    { id: 'PARTIALLY_FULFILLED', label: 'Partially Fulfilled' },
    { id: 'FULFILLED', label: 'Fulfilled' },
  ];

  const currentIndex = stages.findIndex(s => s.id === requestStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  const animationProps = shouldReduceMotion ? {} : {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <motion.div 
      className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden mb-6"
      {...animationProps}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-lg font-bold text-brand-navy">Request Lifecycle</h2>
          <p className="text-sm text-slate-500">Tracking the progress of this blood request.</p>
        </div>
        
        {/* Secondary Information: Donor Consents */}
        {(totalConsents > 0 || acceptedConsents > 0) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800 text-sm font-semibold shadow-sm">
            <Users className="w-4 h-4 text-blue-600" />
            <span>
              {acceptedConsents > 0 
                ? `${acceptedConsents} donor${acceptedConsents > 1 ? 's' : ''} accepted connection` 
                : `${totalConsents} donor${totalConsents > 1 ? 's' : ''} responded`}
            </span>
          </div>
        )}
      </div>

      <div className="relative pt-4 pb-4">
        {/* Desktop Horizontal View */}
        <div className="hidden sm:flex items-center justify-between relative px-8">
          {/* Connecting Line Background */}
          <div className="absolute left-[15%] right-[15%] top-5 h-1.5 bg-slate-100 rounded-full z-0" />
          
          {/* Connecting Line Active */}
          {!shouldReduceMotion && (
            <motion.div 
              className="absolute left-[15%] top-5 h-1.5 bg-brand-red rounded-full z-0 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: activeIndex > 0 ? (activeIndex / (stages.length - 1)) : 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              style={{ width: '70%' }}
            />
          )}
          {shouldReduceMotion && (
             <div 
              className="absolute left-[15%] top-5 h-1.5 bg-brand-red rounded-full z-0"
              style={{ width: `${activeIndex > 0 ? (activeIndex / (stages.length - 1)) * 70 : 0}%` }}
             />
          )}

          {stages.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isUpcoming = idx > activeIndex;

            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center w-1/3">
                <motion.div
                  initial={!shouldReduceMotion ? { scale: 0 } : false}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + (idx * 0.15), type: 'spring' }}
                  className="mb-3"
                >
                  {isCompleted ? (
                    <div className="w-11 h-11 rounded-full bg-brand-red text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="relative">
                      {!shouldReduceMotion && (
                        <div className="absolute inset-0 rounded-full bg-brand-red opacity-30 animate-ping" style={{ animationDuration: '2s' }} />
                      )}
                      <div className="w-11 h-11 rounded-full bg-brand-red text-white flex items-center justify-center shadow-md ring-4 ring-rose-100 relative z-10">
                        <HeartPulse className="w-5 h-5" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center">
                      <Circle className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
                
                <motion.div 
                  initial={!shouldReduceMotion ? { opacity: 0, y: 5 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className={`text-center transition-colors duration-300 ${isCurrent ? 'text-brand-navy font-bold' : isCompleted ? 'text-slate-700 font-semibold' : 'text-slate-400 font-medium'}`}
                >
                  <div className="text-sm">{stage.label}</div>
                  {isCurrent && (
                    <div className="text-[10px] uppercase tracking-widest text-brand-red mt-1 font-extrabold bg-rose-50 px-2 py-0.5 rounded-full inline-block">Current</div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical View */}
        <div className="flex sm:hidden flex-col gap-8 relative px-4 py-2">
          {/* Vertical Connecting Line Background */}
          <div className="absolute left-[33px] top-6 bottom-6 w-1 bg-slate-100 rounded-full z-0" />
          
          {/* Vertical Connecting Line Active */}
          {!shouldReduceMotion && (
            <motion.div 
              className="absolute left-[33px] top-6 w-1 bg-brand-red rounded-full z-0 origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: activeIndex > 0 ? (activeIndex / (stages.length - 1)) : 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              style={{ bottom: '24px' }}
            />
          )}
          {shouldReduceMotion && (
             <div 
              className="absolute left-[33px] top-6 w-1 bg-brand-red rounded-full z-0"
              style={{ height: `${activeIndex > 0 ? (activeIndex / (stages.length - 1)) * 100 : 0}%` }}
             />
          )}

          {stages.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isUpcoming = idx > activeIndex;

            return (
              <div key={stage.id} className="relative z-10 flex items-center gap-5 min-h-[3rem]">
                <motion.div
                  initial={!shouldReduceMotion ? { scale: 0 } : false}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 + (idx * 0.15), type: 'spring' }}
                  className="shrink-0"
                >
                  {isCompleted ? (
                    <div className="w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="relative">
                      {!shouldReduceMotion && (
                        <div className="absolute inset-0 rounded-full bg-brand-red opacity-30 animate-ping" style={{ animationDuration: '2s' }} />
                      )}
                      <div className="w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center shadow-md ring-4 ring-rose-100 relative z-10">
                        <HeartPulse className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center">
                      <Circle className="w-3 h-3" />
                    </div>
                  )}
                </motion.div>
                
                <motion.div 
                  initial={!shouldReduceMotion ? { opacity: 0, x: -5 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className={`transition-colors duration-300 ${isCurrent ? 'text-brand-navy font-bold' : isCompleted ? 'text-slate-700 font-semibold' : 'text-slate-400 font-medium'}`}
                >
                  <div className="text-sm sm:text-base">{stage.label}</div>
                  {isCurrent && (
                    <div className="text-[10px] uppercase tracking-widest text-brand-red mt-0.5 font-bold">Current Status</div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
