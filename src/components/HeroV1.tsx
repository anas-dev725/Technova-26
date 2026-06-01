import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Calendar, MapPin, Users } from 'lucide-react';
import { ccsisLogoBase64 as ccsisLogo } from '../assets/ccsisLogoBase64';
import { iobmLogoBase64 as iobmLogo } from '../assets/iobmLogoBase64';
import { ieeeLogoBase64 as ieeeLogo } from '../assets/ieeeLogoBase64';

interface HeroProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export default function HeroV1({ timeLeft }: HeroProps) {
  const tagline = "CONNECT, CREATE, & CONQUER";

  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isDeleting && charIndex === tagline.length) {
      timer = setTimeout(() => setIsDeleting(true), 3000); // Wait 3 seconds at full text
    } else if (isDeleting && charIndex === 0) {
      timer = setTimeout(() => setIsDeleting(false), 500); // Small pause before typing again
    } else {
      const delay = isDeleting ? 40 : 80; // Speed of typing / deleting
      timer = setTimeout(() => {
        setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting]);

  useEffect(() => {
    setDisplayText(tagline.substring(0, charIndex));
  }, [charIndex]);

  return (
    <section className="relative w-full flex flex-col overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 dark:bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-50/50 dark:bg-blue-400/10 rounded-full blur-[120px]" />
      </div>

      {/* Screen 1: Top Fold content (Logos down to Countdown Timer, fitting first view perfectly) */}
      <div className="min-h-0 lg:min-h-[95vh] w-full flex flex-col justify-start lg:justify-center items-center pt-32 sm:pt-36 lg:pt-28 pb-6 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-grow flex flex-col items-center justify-start lg:justify-center text-center w-full">
          
          {/* Three Logos container above the heading with generous padding and spacing */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="flex flex-col items-center justify-center mb-4 sm:mb-6 mt-2 sm:mt-4"
          >
            <div className="flex items-center gap-4 sm:gap-6 px-5 py-2.5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-zinc-800/50 shadow-sm transition-all hover:bg-white/60 dark:hover:bg-zinc-900/60 duration-300">
              <img 
                src={iobmLogo} 
                alt="IoBM Logo" 
                className="h-9 sm:h-12 w-auto object-contain filter hover:scale-105 transition-transform duration-300 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="w-[1px] h-6 bg-gray-300/60 dark:bg-zinc-700/60" />
              <img 
                src={ccsisLogo} 
                alt="CCSIS Logo" 
                className="h-9 sm:h-12 w-auto object-contain filter hover:scale-105 transition-transform duration-300 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="w-[1px] h-6 bg-gray-300/60 dark:bg-zinc-700/60" />
              <img 
                src={ieeeLogo} 
                alt="IEEE Logo" 
                className="h-9 sm:h-12 w-auto object-contain filter hover:scale-105 transition-transform duration-300 pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-gray-400 dark:text-zinc-500 mt-2.5 font-bold tracking-[0.25em] uppercase select-none">
              presents
            </span>
          </motion.div>

          {/* Premium display typography block for header */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter mb-3 relative z-10 select-none text-gray-900 dark:text-white"
          >
            TECHNOVA’26
          </motion.h1>

          {/* Typing dynamic Tagline container */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-black tracking-tight mb-4 min-h-[40px] sm:min-h-[64px] flex items-center justify-center select-none"
          >
            <span className="text-blue-600 dark:text-blue-500 drop-shadow-sm font-black uppercase text-center">
              {displayText}
            </span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="inline-block ml-1.5 w-[3px] sm:w-[4px] h-[20px] sm:h-[40px] bg-blue-600 dark:bg-blue-400"
            />
          </motion.div>

          {/* Winning info trophy banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="inline-flex items-center justify-center mb-4 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500 dark:opacity-30 dark:group-hover:opacity-50"></div>
            <div className="relative px-5 py-2 bg-white dark:bg-black border border-blue-100 dark:border-blue-900/50 rounded-full flex items-center gap-3 shadow-sm">
              <Trophy className="w-4 h-4 text-blue-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
                Win Exciting Cash Prizes up to 100K!
              </span>
            </div>
          </motion.div>

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mb-6 sm:mb-8 leading-relaxed font-medium"
          >
            Grab your energy drinks and assemble your squad! The 2nd edition of Technova is back and it's bigger, bolder, and more mind-blowing than ever.
          </motion.p>

          {/* Premium Interactive Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-3 sm:gap-4 mb-8 flex-wrap"
          >
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-[0_0_30px_rgba(37,99,235,0.15)] mb-2 group-hover:border-blue-500/50 group-hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white relative z-10">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Large Elegant CTA Buttons - moved closer to the timer with no separating line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0 mb-12"
          >
            <Link
              to="/modules"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-500 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
            >
              Explore Modules <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/legacy"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm sm:text-base font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Last Year's Highlights
            </Link>
          </motion.div>

          {/* Detailed calendar, location and category badge summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pt-8 w-full border-t border-gray-200/10 dark:border-white/5 max-w-4xl"
          >
            <div className="flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">July 11-12, 2026</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">IOBM, Karachi</span>
            </div>
            <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
              <Users className="w-6 h-6 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Social Event</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
