import { motion } from 'motion/react';
import { 
  Users, 
  Target, 
  Zap, 
  Globe, 
  BookOpen, 
  Cpu, 
  Network, 
  Rocket, 
  Award,
  GraduationCap,
  Heart,
  Binary,
  ShieldCheck
} from 'lucide-react';
import { logoBase64 } from '../assets/logoBase64';
import { ccsisBase64 } from '../assets/ccsisBase64';
import { ccsisLogoBase64 } from '../assets/ccsisLogoBase64';
import { iobmBase64 } from '../assets/iobmBase64';
import { iobmLogoBase64 } from '../assets/iobmLogoBase64';
import { ieeeLogoBase64 } from '../assets/ieeeLogoBase64';

import { technova10Base64 } from '../assets/technova10Base64';
import { technova4Base64 } from '../assets/technova4Base64';

export default function About() {
  const sections = [
    {
      id: "iobm",
      title: "Institute of Business Management",
      subtitle: "The Foundation",
      shortTitle: "IoBM",
      content: "It all starts here, at the Institute of Business Management. More than just a university, IoBM is a place that challenges you to think differently. It’s where the drive for academic excellence meets a real passion for societal impact. For us, this is the ground where innovation is nurtured and where we're taught that being a leader means more than just having a title; it means building a sustainable future.",
      image: iobmBase64,
      logo: iobmLogoBase64,
      icon: GraduationCap,
      color: "from-blue-600 to-indigo-700"
    },
    {
      id: "ccsis",
      title: "College of Computer Science & Information Systems",
      subtitle: "The Academic Backbone",
      shortTitle: "CCSIS",
      content: "CCSIS is the dedicated department of Computer Science and Information Systems at IoBM. It serves as the academic home for students diving into software engineering, data science, and modern technology. Through specialized research, industry-led workshops, and prestigious project showcases, CCSIS disciplines us to become technical leaders who solve real-world problems with both skill and integrity.",
      image: ccsisBase64,
      logo: ccsisLogoBase64,
      icon: Binary,
      color: "from-indigo-600 to-violet-700"
    },
    {
      id: "ieee",
      title: "IEEE IoBM Student Branch",
      subtitle: "The Catalyst",
      shortTitle: "IEEE",
      content: "The IEEE IoBM Student Branch serves as a vital bridge, connecting classroom learning to the fast-paced tech industry. As part of a massive global network, we are dedicated to creating meaningful opportunities on campus. By hosting workshops and hackathons, we foster a community that transforms curious students into visionary pioneers.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1740",
      logo: ieeeLogoBase64,
      icon: Network,
      color: "from-blue-700 to-blue-900"
    },
    {
      id: "technova",
      title: "Technova",
      subtitle: "The Flagship Project",
      shortTitle: "Technova",
      content: "Technova is the premier flagship event organized by the IEEE IoBM Student Branch. It represents a shared vision brought to life, where students, professionals, and tech enthusiasts unite for an immersive experience. From high-stakes coding modules to networking opportunities, Technova is a celebration of talent and a cornerstone of our thriving tech community.",
      image: technova4Base64,
      logo: logoBase64,
      icon: Rocket,
      color: "from-blue-600 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs mb-4"
          >
            OUR STORY
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-8 text-gray-900 dark:text-white tracking-tighter"
          >
            Behind <span className="text-blue-500">Technova.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium"
          >
            A collaborative journey driven by institutional excellence and technical passion.
          </motion.p>
        </div>

        {/* The Story Sections */}
        <div className="space-y-40 mb-32">
          {sections.map((section, index) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
            >
              <div className="flex-1 space-y-8">
                {/* Identity Logo Section */}
                <div className="flex items-center gap-6">
                  {section.logo ? (
                    <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                      <img src={section.logo} alt={`${section.shortTitle} Logo`} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white shadow-xl shadow-blue-500/10 overflow-hidden`}>
                      <section.icon className="w-10 h-10" />
                    </div>
                  )}
                  <div>
                    <div className="text-blue-500 font-black text-xs uppercase tracking-widest mb-1">{section.subtitle}</div>
                    <div className="text-2xl font-display font-bold text-gray-900 dark:text-white">{section.shortTitle}</div>
                  </div>
                </div>

                <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white tracking-tighter leading-tight">
                  {section.title}
                </h2>
                
                <div className="h-1.5 w-16 bg-blue-500 rounded-full" />
                
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic">
                  "{section.content}"
                </p>

                {section.id === 'technova' && (
                  <div className="pt-6 flex items-center gap-4">
                    <img src={logoBase64} alt="Technova Logo" className="h-12 dark:invert p-1 bg-white/5 rounded-lg border border-white/10" />
                    <div className="h-8 w-px bg-gray-200 dark:bg-white/10" />
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-tighter">The Official Flagship</span>
                  </div>
                )}
              </div>
              <div className="flex-1 w-full relative">
                <div className="relative group overflow-hidden rounded-[2.5rem] md:rounded-[4rem] aspect-[16/11] shadow-2xl">
                  <img 
                    src={section.image} 
                    alt={section.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-bottom p-8 md:p-12">
                    <div className="mt-auto">
                      <div className="text-3xl font-display font-bold text-white mb-2">{section.shortTitle}</div>
                      <div className="text-blue-300 font-bold text-sm uppercase tracking-widest">{section.subtitle}</div>
                    </div>
                  </div>
                </div>
                {/* Decorative Element */}
                <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${section.color} opacity-20 blur-3xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32 border-t border-gray-100 dark:border-white/5 pt-32">
          {[
            { label: 'EDITION', value: '2nd' },
            { label: 'IMPACT', value: '5K+' },
            { label: 'MODULES', value: '10+' },
            { label: 'LEGACY', value: '2025' }
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
