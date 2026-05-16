import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Calendar, MapPin, Users } from 'lucide-react';

interface HeroProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export default function HeroV1({ timeLeft }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 sm:pt-40 pb-12">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 dark:bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-50/50 dark:bg-blue-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-[10px] sm:text-sm font-medium mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Registrations Are Live! Grab Your Squad.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter mb-4 text-gray-900 dark:text-white"
          >
            TECHNOVA'26
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#2563eb] text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6"
          >
            Connect, Create, & Conquer
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="inline-flex items-center justify-center mb-6 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-500 dark:opacity-40 dark:group-hover:opacity-60"></div>
            <div className="relative px-6 py-2.5 bg-white dark:bg-black border border-blue-100 dark:border-blue-900/50 rounded-full flex items-center gap-3 shadow-sm">
              <Trophy className="w-5 h-5 text-blue-500 animate-pulse" />
              <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                Win Exciting Cash Prizes up to 100K!
              </span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10 leading-relaxed"
          >
            Grab your energy drinks and assemble your squad! The 2nd edition of Technova is back and it's bigger, bolder, and more mind-blowing than ever.
          </motion.p>

          {/* Premium Interactive Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-3 md:gap-6 mb-12 flex-wrap"
          >
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-[0_0_30px_rgba(37,99,235,0.15)] mb-3 group-hover:border-blue-500/50 group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white relative z-10">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{item.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0"
          >
            <Link
              to="/modules"
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-500 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
            >
              Explore Modules <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/legacy"
              className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm sm:text-base font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              Last Year's Highlights
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pt-8 border-t border-gray-200 dark:border-white/10"
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
