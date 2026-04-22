import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Users, User, UsersRound, Trophy } from 'lucide-react';
import { modules } from '../data/modules';

const categories = ['All', ...Array.from(new Set(modules.map(m => m.category)))];
const teamSizes = ['All', 'Individual', 'Duo', 'Squad'];

export default function Modules() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTeamSize, setActiveTeamSize] = useState('All');

  const filteredModules = modules.filter(mod => {
    const matchesCategory = activeCategory === 'All' || mod.category === activeCategory;
    const matchesTeamSize = activeTeamSize === 'All' || mod.mode === activeTeamSize;
    return matchesCategory && matchesTeamSize;
  });

  const getTeamIcon = (size: string) => {
    switch (size) {
      case 'Individual': return <User className="w-4 h-4" />;
      case 'Duo': return <Users className="w-4 h-4" />;
      case 'Squad': return <UsersRound className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white"
          >
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Challenge</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-lg md:text-xl"
          >
            Whether you are working solo, teaming up as a duo, or bringing your whole squad, dive in and find the perfect challenge to showcase your skills and satisfy your curiosity.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Category Filter */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter by Domain</span>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                      : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Team Size Filter */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter by Squad Size</span>
            <div className="flex flex-wrap justify-center gap-2">
              {teamSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setActiveTeamSize(size)}
                  className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    activeTeamSize === size 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                      : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5'
                  }`}
                >
                  {size !== 'All' && getTeamIcon(size)}
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  layout
                  key={mod.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-8 hover:bg-gray-50 dark:hover:bg-[#151515] transition-all duration-500 flex flex-col h-full shadow-lg hover:shadow-2xl"
                >
                  <Link to={`/modules/${mod.id}`} className="absolute inset-0 z-10" />
                  
                  <div className="absolute top-6 right-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
                    <ArrowRight className="w-6 h-6 text-blue-500 -rotate-45" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-blue-600/20">
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200 dark:border-white/10">
                        {mod.category}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-600/20 flex items-center gap-1.5">
                        {getTeamIcon(mod.mode)}
                        {mod.mode}
                      </span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {mod.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-500 font-bold">
                        <Trophy className="w-5 h-5" />
                        <span className="text-sm tracking-tight">{mod.prize}</span>
                      </div>
                    </div>
                    
                    <div className="w-full h-12 bg-blue-600/5 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-sm flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      View Details
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredModules.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-[#111] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-gray-600 dark:text-gray-400 text-xl font-bold mb-4">No modules found matching those filters</p>
            <button 
              onClick={() => { setActiveCategory('All'); setActiveTeamSize('All'); }}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
