import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Handshake, ArrowRight, CheckCircle2, Shield, Trophy, Zap, X } from 'lucide-react';
import { bBraunLogo, telecLogo, expressNewsLogo, texitechLogo } from '../assets/sponsor-logos';

export default function Sponsors() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const tiers = [
    {
      name: 'Platinum',
      price: 'Contact Us',
      icon: Shield,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'The ultimate partnership experience with maximum brand exposure and recruitment access.',
      benefits: [
        'Premium placement of logo on all promotional materials',
        'Large double-booth at the main venue entrance',
        '30-minute keynote session on the main stage',
        'Access to full participant resume database',
        'Custom social media campaign across all platforms',
        'Company branding on event lanyards and swag bags'
      ]
    },
    {
      name: 'Gold',
      price: 'Contact Us',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      description: 'Strategic placement and engagement opportunities with the most active tech talent.',
      benefits: [
        'Prominent logo placement on website and venue',
        'Standard booth at a central location',
        '15-minute technical workshop slot',
        'Resumes of top 50 participants',
        'Mention in newsletter and social media posts',
        'Dedicated discord channel for recruitment'
      ]
    },
    {
      name: 'Silver',
      price: 'Contact Us',
      icon: Zap,
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
      description: 'Perfect for local brands and startups looking to support the tech community.',
      benefits: [
        'Logo placement on website and venue reels',
        'Standard booth space',
        'Shoutout during opening ceremony',
        'Include promotional items in swag bags',
        'Logo on the official event shirt'
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6"
          >
            Empowering Innovation Together
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white tracking-tight"
          >
            Our Strategic <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Partners</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            Meet the visionary organizations supporting Technova'26. Their commitment to technology and education drives the future of our ecosystem.
          </motion.p>
        </div>

        {/* Current Sponsors Grid */}
        <div className="mb-32">
          <div className="grid grid-cols-1 gap-12">
            {/* Platinum Partners */}
            <div className="mb-8">
              <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-12 text-center">Platinum Partners</h2>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-5xl mx-auto px-4">
                {[
                  { name: 'Texitech', logo: texitechLogo },
                  { name: 'Telec', logo: telecLogo }
                ].map((sponsor) => (
                  <motion.div 
                    key={sponsor.name} 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 p-6 md:p-10 rounded-[2rem] flex flex-col items-center justify-center hover:border-blue-500/50 transition-all group cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 min-w-[280px] md:min-w-[380px]"
                  >
                    <div className="relative w-full aspect-video flex items-center justify-center p-6 bg-white rounded-2xl">
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        className="max-w-[85%] max-h-[85%] object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                    <div className="mt-8 text-xs font-black text-gray-400 group-hover:text-blue-500 transition-colors uppercase tracking-[0.3em]">{sponsor.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Gold & Strategic Partners */}
            <div>
              <h2 className="text-xs font-black text-yellow-500 uppercase tracking-[0.4em] mb-12 text-center">Gold & Strategic Partners</h2>
              <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto px-4">
                {[
                  { name: 'B Braun', logo: bBraunLogo },
                  { name: 'Express News', logo: expressNewsLogo }
                ].map((sponsor: any) => (
                  <motion.div 
                    key={sponsor.name} 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 p-5 md:p-8 rounded-[1.5rem] flex flex-col items-center justify-center hover:border-yellow-500/50 transition-all group cursor-pointer shadow-sm hover:shadow-xl min-w-[200px] md:min-w-[260px]"
                  >
                    {sponsor.logo ? (
                      <div className="relative w-full aspect-video flex items-center justify-center p-4 bg-white rounded-xl">
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name} 
                          className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-500 group-hover:scale-110" 
                        />
                      </div>
                    ) : (
                      <span className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">{sponsor.icon}</span>
                    )}
                    <div className="mt-4 text-[10px] font-black text-gray-400 group-hover:text-yellow-500 transition-colors uppercase tracking-[0.3em] text-center">{sponsor.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sponsorship Tiers */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">Support the <span className="text-blue-500">Movement</span></h2>
            <p className="text-gray-600 dark:text-gray-400">Choose a tier that aligns with your brand's goals and vision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:shadow-2xl transition-all group"
              >
                <div className={`w-14 h-14 ${tier.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                  <tier.icon className={`w-8 h-8 ${tier.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tier.name} Tier</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{tier.description}</p>
                
                <div className="space-y-4 mb-10">
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                  <div className="text-sm font-bold text-blue-500 mb-4">{tier.price}</div>
                  <button 
                    onClick={() => setIsFormOpen(true)}
                    className="w-full py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                  >
                    Select Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA Banner (Updated to match image) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#2563eb] rounded-[2rem] md:rounded-[3rem] p-10 md:p-14 text-center overflow-hidden shadow-2xl"
        >

          
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
              Want to sponsor Technova'26?
            </h2>
            
            <p className="text-blue-50 text-base md:text-lg mb-10 font-medium max-w-xl leading-relaxed">
              Join us in shaping the future of technology. Get your brand in front of thousands of top-tier students, developers, and innovators.
            </p>
            
            <button 
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#2563eb] font-bold text-base md:text-lg hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 shadow-xl group"
            >
              Become a Sponsor <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>

      {/* Sponsor Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#111] rounded-[2.5rem] shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Partner with Us</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Fill out the form and our team will get back to you shortly.</p>
                  </div>
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsFormOpen(false); alert('Thank you for your interest! We will contact you soon.'); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1">Company Name</label>
                      <input type="text" required placeholder="Acme Inc." className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:border-blue-500 transition-colors outline-none text-gray-900 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1">Work Email</label>
                      <input type="email" required placeholder="contact@acme.com" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:border-blue-500 transition-colors outline-none text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1">Phone Number</label>
                      <input type="tel" required placeholder="+92 3XX XXXXXXX" className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:border-blue-500 transition-colors outline-none text-gray-900 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1">Interested Tier</label>
                      <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:border-blue-500 transition-colors outline-none text-gray-900 dark:text-white appearance-none">
                        <option>Platinum Partner</option>
                        <option>Gold Partner</option>
                        <option>Silver Partner</option>
                        <option>Custom / Media Partner</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest ml-1">Business Objectives</label>
                    <textarea rows={3} placeholder="Recruitment, Brand Awareness, Product Launch..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:border-blue-500 transition-colors outline-none text-gray-900 dark:text-white resize-none" />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
