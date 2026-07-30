import React from 'react';
import { motion } from 'motion/react';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const EarlyBirdBanner = () => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.5, ease: 'circOut' }}
      className="relative z-40 overflow-hidden bg-gradient-to-r from-red-700 via-rose-600 to-red-800 py-1.5 sm:py-2 border-b border-white/10"
    >
      <div className="flex whitespace-nowrap animate-[marquee_18s_linear_infinite]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-8">
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-amber-300" />
              <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">
                REGISTRATIONS CLOSED
              </p>
            </div>
            <p className="text-[11px] sm:text-sm font-black text-amber-200 uppercase tracking-tighter flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-300" />
              REGISTRATIONS ARE NOW OFFICIALLY CLOSED AS WE HAVE RECEIVED MAXIMUM RESPONSES. THANK YOU FOR THE OVERWHELMING RESPONSE!
            </p>
          </div>
        ))}
      </div>
      
      {/* Decorative pulse effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none" />
      
      {/* Gradient Mask for edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-red-700 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-red-800 to-transparent pointer-events-none z-10" />
    </motion.div>
  );
};

export default EarlyBirdBanner;
