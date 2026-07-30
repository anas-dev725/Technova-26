import React from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

const EarlyBirdBanner = () => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.5, ease: 'circOut' }}
      className="relative z-40 overflow-hidden bg-gradient-to-r from-red-800 via-rose-700 to-red-900 py-1.5 sm:py-2 border-b border-white/10"
    >
      <div className="flex whitespace-nowrap animate-[marquee_18s_linear_infinite]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 px-8">
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-rose-200 fill-rose-200" />
              <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">
                REGISTRATIONS CLOSED
              </p>
            </div>
            <p className="text-[11px] sm:text-sm font-black text-yellow-300 uppercase tracking-tight">
              WE HAVE RECEIVED MAXIMUM RESPONSE — THANK YOU FOR YOUR OVERWHELMING INTEREST!
            </p>
          </div>
        ))}
      </div>
      
      {/* Decorative pulse effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none" />
      
      {/* Gradient Mask for edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-red-800 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-red-900 to-transparent pointer-events-none z-10" />
    </motion.div>
  );
};

export default EarlyBirdBanner;
