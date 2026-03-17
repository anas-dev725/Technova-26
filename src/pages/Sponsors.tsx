import { motion } from 'motion/react';
import { Building2, Handshake, ArrowRight } from 'lucide-react';

export default function Sponsors() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white"
          >
            Our <span className="text-blue-500">Sponsors</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Meet the incredible organizations that make Technova'26 possible. Their support drives innovation and empowers the next generation of tech leaders.
          </motion.p>
        </div>

        {/* Platinum Sponsors */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10 uppercase tracking-wider">Platinum Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-12 rounded-2xl flex items-center justify-center hover:border-blue-500/50 transition-colors group cursor-pointer">
                <div className="text-3xl font-display font-bold text-gray-400 group-hover:text-blue-500 transition-colors">SPONSOR LOGO</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-20">
          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-8 uppercase tracking-wider">Gold Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-8 rounded-2xl flex items-center justify-center hover:border-blue-500/50 transition-colors group cursor-pointer">
                <div className="text-xl font-display font-bold text-gray-400 group-hover:text-blue-500 transition-colors">SPONSOR LOGO</div>
              </div>
            ))}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div className="mb-20">
          <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-8 uppercase tracking-wider">Silver Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-6 rounded-xl flex items-center justify-center hover:border-blue-500/50 transition-colors group cursor-pointer">
                <div className="text-lg font-display font-bold text-gray-400 group-hover:text-blue-500 transition-colors">SPONSOR LOGO</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <Handshake className="w-12 h-12 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Want to sponsor Technova'26?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Join us in shaping the future of technology. Get your brand in front of thousands of top-tier students, developers, and innovators.
            </p>
            <a 
              href="mailto:sponsor@technova.com" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-blue-600 font-bold hover:bg-gray-100 transition-colors"
            >
              Become a Sponsor <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
