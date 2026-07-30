import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowUpRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeContext';
import { logoBase64 } from '../assets/logoBase64';
import EarlyBirdBanner from './EarlyBirdBanner';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Modules', path: '/modules' },
    { name: 'Event Timeline', path: '/timeline' },
    { name: 'Our Team', path: '/team' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Early Bird Top Banner runs natively */}
      <div className="pointer-events-auto">
        <EarlyBirdBanner />
      </div>

      {/* Ribbon Wrapper Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-2 sm:mt-3">
        <div 
          className={`mx-auto max-w-7xl pointer-events-auto transition-all duration-500 rounded-full border ${
            isScrolled 
              ? 'bg-white/75 dark:bg-[#050505]/75 backdrop-blur-xl border-gray-200/40 dark:border-white/10 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.08)] py-2 px-5' 
              : 'bg-white/[0.15] dark:bg-white/5 backdrop-blur-md border-gray-200/10 dark:border-white/5 py-3 px-6'
          }`}
        >
          <div className="flex items-center justify-between relative">
            
            {/* Logo Brand (Left Corner - Only Logo, No Text as Requested) */}
            <Link 
              to="/" 
              className="group flex relative focus:outline-none shrink-0"
              onClick={(e) => {
                if (location.pathname === '/' && !location.hash) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              aria-label="TechNova '26 Home"
            >
              <div className="relative">
                <img 
                  src={logoBase64} 
                  alt="TechNova '26 Logo" 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/5 p-1 border border-black/10 dark:border-white/10 group-hover:border-blue-500/50 group-hover:scale-105 transition-all duration-300 shadow-sm"
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>

            {/* Premium Center-Aligned Ribbon Navigation Links */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 px-1.5 py-1 rounded-full bg-gray-50/40 dark:bg-white/5 border border-gray-200/20 dark:border-white/5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path && !location.hash;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-full ${
                      isActive 
                        ? 'text-blue-600 dark:text-white' 
                        : 'text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeRibbonIndicator"
                        className="absolute inset-0 bg-white dark:bg-white/10 border border-gray-200/50 dark:border-white/10 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action & Theme Controls */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100/50 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white border border-gray-200/20 dark:border-white/5 transition-all outline-none cursor-pointer"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.6, opacity: 0, rotate: 30 }}
                    transition={{ duration: 0.18 }}
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Dynamic Registrations Closed CTA button */}
              <Link
                to="/modules"
                className="relative flex items-center gap-1.5 h-10 px-5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(225,29,72,0.25)] hover:shadow-[0_8px_25px_rgba(225,29,72,0.35)] active:scale-95 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Registrations Closed
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-rose-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </div>

            {/* Mobile Interaction Bars */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className="p-2.5 h-9 w-9 flex items-center justify-center rounded-full bg-gray-100/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200/25 dark:border-white/5 outline-none"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                className="p-2.5 h-9 w-9 flex items-center justify-center rounded-full bg-gray-100/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200/25 dark:border-white/5 outline-none transition-all active:scale-95"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Floating menu drawer for mobile devices */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-x-4 top-22 z-40 pointer-events-auto lg:hidden">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: -16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: -16 }}
              transition={{ type: "spring", duration: 0.28 }}
              className="w-full bg-white/95 dark:bg-[#050505]/95 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
            >
              <div className="px-5 py-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 pb-3 border-b border-gray-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <Compass className="w-3.5 h-3.5 text-blue-500" />
                  Navigation Menu
                </div>

                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path && !location.hash;

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:text-gray-950 dark:hover:text-white'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'translate-x-0.5 text-blue-500' : 'opacity-30'}`} />
                    </Link>
                  );
                })}
                
                <Link
                  to="/modules"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-center font-bold text-xs uppercase tracking-widest shadow-[0_4px_15px_rgba(225,29,72,0.3)] hover:shadow-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrations Closed
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
