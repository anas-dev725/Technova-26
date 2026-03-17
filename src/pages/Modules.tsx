import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Shield, Database, Gamepad2, Calculator, Zap, MonitorPlay, Palette, Rocket, MessageSquare, ArrowRight, Users, User, UsersRound, Trophy } from 'lucide-react';

const modules = [
  {
    id: 'website-designing',
    title: 'Website Designing',
    description: 'Craft stunning, responsive, and buttery-smooth user experiences. Flex your frontend muscles and wow the judges with pixel-perfect designs.',
    icon: Palette,
    category: 'Design',
    teamSize: 'Duo',
    prize: 'PKR 60K'
  },
  {
    id: 'capture-the-flag',
    title: 'Capture The Flag',
    description: 'Test your cybersecurity chops in a fast-paced CTF. Find vulnerabilities, exploit systems, and secure the flags before time runs out.',
    icon: Shield,
    category: 'Security',
    teamSize: 'Squad',
    prize: 'PKR 75K'
  },
  {
    id: 'database-designing',
    title: 'Database Designing',
    description: 'Architect efficient, scalable, and perfectly normalized databases. Solve complex data modeling puzzles under pressure.',
    icon: Database,
    category: 'Engineering',
    teamSize: 'Duo',
    prize: 'PKR 50K'
  },
  {
    id: 'esports',
    title: 'Esports Tournament',
    description: 'Compete in our ultimate multiplayer gaming showdown (FIFA, PUBG, Valorant, Tekken). Show off your reflexes and strategic teamwork.',
    icon: Gamepad2,
    category: 'Gaming',
    teamSize: 'Squad',
    prize: 'PKR 70K'
  },
  {
    id: 'maths-mania',
    title: 'Maths Mania',
    description: 'A true test of logic and quantitative reasoning. Solve mind-bending mathematical puzzles and prove you\'re the ultimate human calculator.',
    icon: Calculator,
    category: 'Analytical',
    teamSize: 'Individual',
    prize: 'PKR 40K'
  },
  {
    id: 'speed-programming',
    title: 'Speed Programming',
    description: 'Write hyper-efficient algorithms against a ticking clock. Fast, furious, and strictly for the coding elite.',
    icon: Zap,
    category: 'Programming',
    teamSize: 'Individual',
    prize: 'PKR 65K'
  },
  {
    id: 'fyp-displays',
    title: 'FYP Showcase',
    description: 'Pitch your innovative Final Year Project to industry experts and judges. Grab the spotlight and score potential funding or job offers.',
    icon: MonitorPlay,
    category: 'Showcase',
    teamSize: 'Squad',
    prize: 'PKR 75K'
  },
  {
    id: 'web-logo-design',
    title: 'Logo & Branding',
    description: 'Create compelling brand identities and striking visual assets. The ultimate playground for creative minds to leave a lasting impact.',
    icon: Code,
    category: 'Design',
    teamSize: 'Individual',
    prize: 'PKR 45K'
  },
  {
    id: 'startup-launchpad',
    title: 'Startup Launchpad',
    description: 'Pitch your billion-dollar startup vision to real-world investors. Turn your late-night brainstorming sessions into reality.',
    icon: Rocket,
    category: 'Business',
    teamSize: 'Squad',
    prize: 'PKR 75K'
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Master the art of whispering to AI. Craft perfect prompts to generate specific, high-quality, and mind-blowing outputs.',
    icon: MessageSquare,
    category: 'AI',
    teamSize: 'Individual',
    prize: 'PKR 55K'
  }
];

const categories = ['All', ...Array.from(new Set(modules.map(m => m.category)))];
const teamSizes = ['All', 'Individual', 'Duo', 'Squad'];

export { modules };

export default function Modules() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTeamSize, setActiveTeamSize] = useState('All');

  const filteredModules = modules.filter(mod => {
    const matchesCategory = activeCategory === 'All' || mod.category === activeCategory;
    const matchesTeamSize = activeTeamSize === 'All' || mod.teamSize === activeTeamSize;
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
            className="text-4xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white"
          >
            Pick Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Poison</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-lg md:text-xl"
          >
            Whether you're a lone wolf coder, a dynamic duo, or a full-blown squad, we've got a challenge that has your name written all over it. Let's see what you're made of!
          </motion.p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Category Filter */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Filter by Vibe</span>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Team Size Filter */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Filter by Squad Size</span>
            <div className="flex flex-wrap justify-center gap-2">
              {teamSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setActiveTeamSize(size)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTeamSize === size 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-transparent'
                  }`}
                >
                  {size !== 'All' && getTeamIcon(size)}
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid - 3 columns with hover effects */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredModules.map((mod, index) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  layout
                  key={mod.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-3xl p-8 hover:bg-gray-50 dark:hover:bg-[#151515] hover:-translate-y-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(37,99,235,0.15)] flex flex-col h-full"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-6 h-6 text-blue-500 dark:text-blue-400 -rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-all duration-300 border border-blue-100 dark:border-blue-800/30">
                      <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="px-3 py-1 rounded-full bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors">
                        {mod.category}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-500/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                        {getTeamIcon(mod.teamSize)}
                        {mod.teamSize}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-500/20 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                        <Trophy className="w-3 h-3" />
                        {mod.prize}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {mod.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-grow group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                    {mod.description}
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <Link to={`/register/${mod.id}`} className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 group-hover:bg-blue-600 group-hover:text-white px-6 py-3 rounded-xl transition-colors w-full text-center border border-blue-100 dark:border-blue-800/30 group-hover:border-transparent">
                      Register Now
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredModules.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-xl">Whoops! No modules match that exact combo. Try mixing up your filters!</p>
            <button 
              onClick={() => { setActiveCategory('All'); setActiveTeamSize('All'); }}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
