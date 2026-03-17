import { motion } from 'motion/react';
import { Users, Target, Zap, Globe, CheckCircle2 } from 'lucide-react';

export default function About() {
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
            About <span className="text-blue-500">Technova'26</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            We are on a mission to ignite the spark of innovation in the minds of the next generation of tech leaders. Technova is more than an event; it's a movement.
          </motion.p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl"
          >
            <Target className="w-12 h-12 text-blue-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To provide a platform where students can push their boundaries, learn cutting-edge technologies, and build solutions that solve real-world problems. We believe in learning by doing, and there's no better way to learn than by building something from scratch in 48 hours.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl"
          >
            <Globe className="w-12 h-12 text-blue-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To become the premier technology festival in the region, fostering a vibrant community of developers, designers, and entrepreneurs who collaborate to shape the future of technology. We envision a world where every student has the opportunity to unleash their creative potential.
            </p>
          </motion.div>
        </div>

        {/* Why Participate */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Why Join the Movement?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Learn & Grow', icon: Zap, desc: 'Gain hands-on experience with new technologies and frameworks. Learn from industry experts and mentors.' },
              { title: 'Network', icon: Users, desc: 'Connect with like-minded peers, potential co-founders, and top-tier companies looking for fresh talent.' },
              { title: 'Build Your Portfolio', icon: CheckCircle2, desc: 'Walk away with a working prototype or project that you can proudly showcase on your resume and GitHub.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/5 p-8 rounded-2xl text-center"
              >
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The Story */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">The Story So Far</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  It all started in a small dorm room with a simple idea: what if we brought together the most passionate tech students for a weekend of pure building?
                </p>
                <p>
                  The first edition of Technova exceeded all our expectations. We saw incredible projects, from AI-powered accessibility tools to innovative blockchain solutions. But more importantly, we saw a community come together.
                </p>
                <p>
                  Now, we are back for round two. Bigger, bolder, and more ambitious than ever. We've expanded our modules, partnered with industry giants, and prepared an experience you won't forget.
                </p>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1740&auto=format&fit=crop" 
                alt="Team working together" 
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
