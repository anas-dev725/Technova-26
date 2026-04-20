import { motion } from 'motion/react';
import { Users, Target, Zap, Globe, CheckCircle2, Award, Heart, Rocket } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs mb-4"
          >
            OUR JOURNEY & VISION
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-8 text-gray-900 dark:text-white tracking-tighter"
          >
            About <span className="text-blue-500">Technova.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium"
          >
            A collective of dreamers, builders, and innovators coming together to redefine the boundaries of technology and creativity.
          </motion.p>
        </div>

        {/* Mission & Vision Section (Enhanced Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors duration-700" />
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10">
              <Target className="w-10 h-10 text-blue-600 dark:text-blue-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-8 tracking-tighter">Our <span className="text-blue-500">Mission</span></h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium relative z-10">
              To provide an inclusive and challenging playground where students from all backgrounds can experiment with technologies, build meaningful relationships, and launch projects that have a tangible impact on the world around them.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] bg-blue-600 dark:bg-blue-600 shadow-2xl shadow-blue-500/20 overflow-hidden text-white transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 relative z-10">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 tracking-tighter font-display">Our <span className="text-blue-200">Vision</span></h2>
            <p className="text-lg text-blue-50 leading-relaxed font-medium relative z-10">
              We envision a future where every student is empowered with the tools, community, and confidence to become a creator rather than just a consumer. We aim to be the spark that ignites a lifelong passion for innovation.
            </p>
          </motion.div>
        </div>

        {/* The Story */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden mb-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center">
            <div className="p-8 md:p-20">
              <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-8">The Story So Far</h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Technova was born from a simple observation: some of the best learning happens outside the classroom. We wanted to create a space where the "hustle culture" was replaced by a "crafting culture."
                </p>
                <p>
                  In our inaugural edition, we witnessed over 1,200 registrations and saw projects ranging from AI-driven healthcare solutions to creative digital art galleries. The energy was electric, and the results were transformative.
                </p>
                <p>
                  Today, we continue to build upon that foundation. With Technova'26, we are expanding our reach, deeping our industry ties, and focusing more than ever on the quality of the experience.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-full min-h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1740" 
                alt="Highlight" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { label: 'EDITION', value: '02' },
            { label: 'DAYS', value: '02' },
            { label: 'MODULES', value: '10+' },
            { label: 'COMMUNITY', value: '5K+' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl md:text-7xl font-display font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-sm font-black text-blue-500 uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
