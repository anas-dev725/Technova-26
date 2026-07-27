import React from 'react';
import { motion } from 'motion/react';
import { Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EarlyBirdBanner = () => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.5, ease: 'circOut' }}
      className="relative z-40 overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 py-1.5 sm:py-2 border-b border-white/10"
    >
      <div className="flex whitespace-nowrap animate-[marquee_15s_linear_infinite]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 px-8">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-300 fill-yellow-300" />
              <p className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest">
                REGISTRATION CLOSING SOON
              </p>
            </div>
            <p className="text-[11px] sm:text-sm font-black text-white uppercase tracking-tighter">
              REGULAR REGISTRATION WILL CLOSE ON 30TH JULY AT 11:59 PM
            </p>
          </div>
        ))}
      </div>
      
      {/* Decorative pulse effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none" />
      
      {/* Gradient Mask for edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-blue-700 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-indigo-600 to-transparent pointer-events-none z-10" />
    </motion.div>
  );
};

export default EarlyBirdBanner;
