import { motion } from 'motion/react';
import { Trophy, Users, Globe, Zap, Calendar, MapPin, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { technova1Base64 } from '../assets/technova1Base64';
import { technova5Base64 } from '../assets/technova5Base64';
import { technova4Base64 } from '../assets/technova4Base64';
import { technova10Base64 } from '../assets/technova10Base64';

export default function Legacy() {
  const stats = [
    { label: 'Total Footfall', value: '3,000+', icon: Users },
    { label: 'Universities', value: '25+', icon: Globe },
    { label: 'Modules', value: '5+', icon: Zap },
    { label: 'Prize Awards', value: 'Upto PKR 200K', icon: Trophy }
  ];

  const highlights = [
    {
      title: "A Historic First for IoBM",
      desc: "Organized under the College of Computer Science and Information Systems and the IEEE student branch, Technova'25 marked IoBM's very first technology-centric competition. It launched with a special AI symposium featuring IoBM Rector Prof. Dr. Tariq Rahim Soomro, alongside industry leaders from Microsoft Pakistan and Telec Group, exploring the future of artificial intelligence.",
      quote: {
        text: "This was the first tech-centric event in the history of IoBM... Around 500+ participants and visitors, excluding university students and staff who made up a footfall of around 2500 to 3000 people.",
        author: "Muhammad Anas",
        role: "Vice President, Technova"
      },
      img: technova1Base64
    },
    {
      title: "A Fusion of Tech and Creativity",
      desc: "Challenging minds from over 25 universities, the event featured a unique blend of technical and non-technical modules. Participants demonstrated accurate coding under pressure in Speed Programming, while others showcased creative flair in Web and Logo Designing, Prompt Engineering, and Maths Mania. During the Final Year Project showcase, teams presented innovative ideas that even received instant investment offers.",
      img: technova5Base64
    },
    {
      title: "Igniting Startups & Innovation",
      desc: "The Startup Launchpad provided a platform for the youth to pitch impactful business ideas. The top spot was claimed by mechanical engineering student Ayaan Amir with his startup 'GreenBite'. The judges were so impressed by the health-conscious solution that they explicitly encouraged his team to reach out to them for further development and backing.",
      quote: {
        text: "There is a demand for a service for health-conscious individuals who want a reliable, daily meal solution without compromising on flavour or budget.",
        author: "Ayaan Amir",
        role: "Winner, Startup Launchpad"
      },
      img: technova10Base64
    }
  ];

  const winners = [
    { module: "Speed Programming", team: "Code Ninjas", uni: "FAST NUCES" },
    { module: "Capture The Flag", team: "Byte Busters", uni: "ITU Lahore" },
    { module: "Website Designing", team: "Pixel Perfect", uni: "IOBM Karachi" },
    { module: "Esports (Valorant)", team: "Legacy Esports", uni: "NED University" },
    { module: "UI/UX Battle", team: "Design Labs", uni: "GIKI" },
    { module: "Datathon", team: "Data Wizards", uni: "LUMS" }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-black mb-6 uppercase tracking-widest"
          >
            Looking Back at Greatness
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-8 text-gray-900 dark:text-white tracking-tighter"
          >
            Legacy of <span className="text-blue-500">Technova'25</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium"
          >
            The benchmark of innovation. Last year, we gathered the brightest minds from across the country for a weekend that redefined the campus tech scene.
          </motion.p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center group hover:bg-white dark:hover:bg-white/[0.08] hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="w-7 h-7 text-blue-600 dark:text-blue-500" />
              </div>
              <div className="text-3xl font-display font-black text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Video Highlights Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4 tracking-tighter">
              Relive the <span className="text-blue-500">Intensity</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Experience the raw energy of Technova'25 in 4K.</p>
          </div>

          <div className="relative group aspect-video max-w-5xl mx-auto rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white dark:border-white/5 bg-gray-900">
            {/* Placeholder for when video is actually uploaded */}
            <video 
              autoPlay
              muted
              loop
              playsInline
              controls 
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1740"
            >
              <source src="/technova-showcase-final.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>

        {/* Section 1: The Glimpses */}
        <div className="space-y-32 mb-32">
          {highlights.map((item, i) => (
            <div key={i} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={i % 2 !== 0 ? 'lg:order-2' : ''}
              >
                <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6 tracking-tight underline decoration-blue-500/30 underline-offset-8">
                  {item.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-6">
                  {item.desc}
                </p>
                {item.quote && (
                  <div className="pl-6 border-l-4 border-blue-500 space-y-3">
                    <p className="text-gray-800 dark:text-gray-200 italic font-medium leading-relaxed">"{item.quote.text}"</p>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{item.quote.author}</p>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">{item.quote.role}</p>
                    </div>
                  </div>
                )}
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl ${i % 2 !== 0 ? 'lg:order-1' : ''}`}
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>
            </div>
          ))}
        </div>

        {/* Prize Winners Section */}
        <div className="bg-gray-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 overflow-hidden relative mb-32">

          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tighter text-center">
                Champions of <span className="text-blue-500">'25</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Acknowledging the exceptional talent that dominated the arena last year.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {winners.map((winner, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors group"
                >
                  <Trophy className="w-10 h-10 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
                  <div className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{winner.module}</div>
                  <div className="text-2xl font-bold text-white mb-1">{winner.team}</div>
                  <div className="text-sm text-gray-400 font-medium">{winner.uni}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-8 tracking-tighter">
            Think you have what it takes?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 font-medium leading-relaxed">
            The arena is bigger, the stakes are higher, and the glory is waiting. Reclaim your title or make a new legacy at Technova'26.
          </p>
          <Link 
            to="/modules"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-blue-600 text-white font-black text-lg hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
          >
            Register for Technova'26 <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
