import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import AnimatedCheckmark from '../animations/AnimatedCheckmark';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const shouldReduceMotion = useReducedMotion();

  const addToast = useCallback((message, type = 'info') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: [1.1, 0.95, 1], y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20
              }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border w-80 ${
                toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' :
                'bg-white border-slate-200 text-brand-navy'
              }`}
            >
              <div className="mt-0.5 shrink-0 flex items-center justify-center w-6 h-6">
                {toast.type === 'success' && <AnimatedCheckmark size={24} color="#059669" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-brand-red" />}
              </div>
              <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
