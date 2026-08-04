import React from 'react';
import { motion } from 'motion/react';
import { Heart, PartyPopper } from 'lucide-react';

const EarlyBirdBanner = () => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.5, ease: 'circOut' }}
      className="relative z-40 overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 py-2 border-b border-white/10"
    >
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 px-8">
            <div className="flex items-center gap-2.5">
              <PartyPopper className="h-4 w-4 text-amber-300" />
              <p className="text-[11px] sm:text-xs font-black text-amber-200 uppercase tracking-widest">
                THANK YOU FOR YOUR RESPONSE, SEE YOU IN THE NEXT EDITIONS
              </p>
            </div>
            <span className="text-white/30 text-xs">✦</span>
          </div>
        ))}
      </div>
      
      {/* Decorative pulse effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_infinite] pointer-events-none" />
      
      {/* Gradient Mask for edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-blue-900 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-purple-900 to-transparent pointer-events-none z-10" />
    </motion.div>
  );
};

export default EarlyBirdBanner;
