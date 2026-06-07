import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { 
  Globe, 
  Map, 
  ArrowRight, 
  Grid, 
  Sparkle, 
  User, 
  Calendar, 
  Award, 
  ExternalLink 
} from 'lucide-react';

export default function Sitemap() {
  // Group modules by category automatically
  const categories = modules.reduce((acc, mod) => {
    if (!acc[mod.category]) {
      acc[mod.category] = [];
    }
    acc[mod.category].push(mod);
    return acc;
  }, {} as Record<string, typeof modules>);

  return (
    <div className="py-24 relative overflow-hidden bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white min-h-screen">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 rounded-full border border-blue-600/20 mb-6 text-sm font-bold text-blue-600 uppercase tracking-widest"
          >
            <Map className="w-4 h-4" />
            Automatic Directory
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6"
          >
            Site <span className="text-blue-600">Sitemap</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed"
          >
            Easily navigate around all platform sections, core modules, registration gates, and interactive dashboards, kept dynamically up to date.
          </motion.p>
        </div>

        {/* Content Organiser */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Navigation Map */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <Globe className="text-blue-600 w-5 h-5" />
                </div>
                <h2 className="text-xl font-display font-bold uppercase tracking-wide">Main Portals</h2>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Home Landing', desc: 'Main hub, introductory guidelines, and registration countdown', path: '/' },
                  { name: 'Event Modules', desc: 'Browse and filter available challenge fields with specifications', path: '/modules' },
                  { name: 'Strategic Partners', desc: 'Review the brands and sponsors supporting TechNova\'26', path: '/sponsors' },
                  { name: 'About Mission', desc: 'The team, leadership, goals, and legacy overview', path: '/about' },
                  { name: 'Our Team', desc: 'Organizers, directors, department executives, and faculty', path: '/team' },
                  { name: 'Event Timeline', desc: 'Daily schedules, module durations, and venue placements', path: '/timeline' },
                  { name: 'Legacy Archive', desc: 'Relive the past footprints of IoBM technical festivals', path: '/legacy' },
                  { name: 'Admin Gate', desc: 'Private portal for registrations review and operations control', path: '/admin' }
                ].map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.path}
                    className="group/link block p-3 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm tracking-wide text-gray-800 dark:text-gray-200 group-hover/link:text-blue-500 transition-colors">
                        {item.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 -translate-x-1 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Static XML Info */}
            <div className="bg-gradient-to-r from-blue-900/10 to-indigo-900/10 border border-blue-500/10 p-6 rounded-2xl">
              <div className="flex items-start gap-3">
                <Sparkle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Search Engine File</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                    Our platform automatically builds a standardized XML index at compile time, providing immediate discoverability for crawlers.
                  </p>
                  <a 
                    href="/sitemap.xml" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs font-black text-blue-500 uppercase hover:underline"
                  >
                    Open raw XML <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Categorized Modules Map */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-white/10">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
                  <Grid className="text-purple-500 w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold uppercase tracking-wide">Competitions & Modules Directory</h2>
                  <p className="text-xs text-gray-500">Links are generated automatically from our technical database.</p>
                </div>
              </div>

              <div className="space-y-8">
                {Object.entries(categories).map(([category, items]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="font-display font-bold text-xs text-blue-500 uppercase tracking-[0.2em]">{category} Division</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((mod) => (
                        <div 
                          key={mod.id} 
                          className="p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:border-blue-500/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                              {mod.title}
                            </span>
                            <span className="text-[10px] font-black uppercase text-gray-400 border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded">
                              {mod.mode === 'Duo' ? '2-3 Team' : mod.mode}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-8">
                            {mod.description}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                            <Link 
                              to={`/modules/${mod.id}`}
                              className="text-xs font-black uppercase tracking-wider text-blue-500 hover:text-blue-600 flex items-center gap-1 group/link"
                            >
                              Explore <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>

                            <Link 
                              to={`/register/${mod.id}`}
                              className="text-[10px] font-black uppercase tracking-wider bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-lg border border-blue-500/20 transition-all"
                            >
                              Join Module
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                  <Grid className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{modules.length}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Modules</p>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center shrink-0">
                  <Calendar className="text-purple-500 w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{Object.keys(categories).length}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tech Divisions</p>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center shrink-0">
                  <Award className="text-emerald-500 w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">100K PKR</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Highest Grand Prize</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
