import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Sparkles, Calendar, MapPin } from 'lucide-react';
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

export default function HeroV2({ timeLeft }: HeroProps) {
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
    <section className="relative min-h-screen flex items-center pt-32 sm:pt-36 lg:pt-40 overflow-hidden bg-white dark:bg-[#050505]">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Content */}
          <div className="flex flex-col items-start text-left">
            {/* Three Logos container above the heading */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex flex-col items-center lg:items-start justify-start mb-6 sm:mb-8 w-fit gap-2"
            >
              <div className="flex items-center gap-4 sm:gap-6 px-6 py-3 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-zinc-800/50 shadow-sm transition-all hover:bg-white/60 dark:hover:bg-zinc-900/60 duration-300">
                <img 
                  src={iobmLogo} 
                  alt="IoBM Logo" 
                  className="h-12 sm:h-16 w-auto object-contain filter hover:scale-105 transition-transform duration-300 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="w-[1px] h-8 bg-gray-300/60 dark:bg-zinc-700/60" />
                <img 
                  src={ccsisLogo} 
                  alt="CCSIS Logo" 
                  className="h-12 sm:h-16 w-auto object-contain filter hover:scale-105 transition-transform duration-300 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="w-[1px] h-8 bg-gray-300/60 dark:bg-zinc-700/60" />
                <img 
                  src={ieeeLogo} 
                  alt="IEEE Logo" 
                  className="h-12 sm:h-16 w-auto object-contain filter hover:scale-105 transition-transform duration-300 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs sm:text-sm font-mono text-gray-400 dark:text-zinc-500 font-bold tracking-[0.25em] uppercase select-none self-center lg:self-start pl-2">
                presents
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter mb-4 text-gray-900 dark:text-white leading-[0.9]"
            >
              TECHNOVA<span className="text-blue-600">'26</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-4xl font-display font-black tracking-tight mb-8 min-h-[40px] sm:min-h-[50px] flex items-center justify-start select-none"
            >
              <span className="text-blue-600 dark:text-blue-500 drop-shadow-sm font-black uppercase text-left">
                {displayText}
              </span>
              <motion.span 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="inline-block ml-1.5 w-[3.5px] sm:w-[5px] h-[24px] sm:h-[36px] bg-blue-600 dark:bg-blue-400"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-2xl mb-10 shadow-xl backdrop-blur-md"
            >
              <Trophy className="w-6 h-6 text-blue-500" />
              <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
                Win Cash Prizes up to 100K!
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-10 leading-relaxed"
            >
              Grab your energy drinks and assemble your squad! The 2nd edition of Technova is back and it's bigger, bolder, and more mind-blowing than ever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/modules"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 group"
              >
                Explore Modules <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/legacy"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Last Year's Highlights
              </Link>
            </motion.div>
          </div>

          {/* Right Asset */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
            <img 
              src="https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=1000&auto=format&fit=crop" 
              alt="Technova Robot" 
              className="relative z-10 w-full max-w-[500px] h-auto drop-shadow-[0_0_50px_rgba(37,99,235,0.3)] filter brightness-110 contrast-110"
            />
          </motion.div>
        </div>

        {/* Bottom Countdown Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-20 border-t border-gray-200 dark:border-white/10 pt-12 pb-12 w-full"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-start border-r border-gray-100 dark:border-white/5 last:border-0 pr-8">
                <span className="text-4xl sm:text-5xl font-display font-black text-gray-900 dark:text-white tracking-tighter">
                  {stat.value.toString().padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">
                  {stat.label}
                </span>
              </div>
            ))}
            
            {/* Event Info Integrated as a final item */}
            <div className="col-span-2 lg:col-span-1 flex flex-col items-start gap-1">
               <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider">July 11-12</span>
               </div>
               <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider">IOBM, Karachi</span>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
