// Technova'26 - Dream It & Ship It
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { anasProfileBase64 } from '../assets/anas-profile-base64';
import { ChevronRight, Calendar, MapPin, Users, Trophy, Code, Shield, Zap, ArrowRight, CheckCircle2, User, UsersRound, Github, Linkedin, Globe } from 'lucide-react';

function CountUp({ end, suffix = '', prefix = '', duration = 2 }: { end: number, suffix?: string, prefix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (inView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, end, duration]);

  return <span ref={nodeRef}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Smooth scroll for anchor links
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    const targetDate = new Date('2026-07-11T00:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 dark:bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-50/50 dark:bg-blue-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Registrations Are Live! Grab Your Spot.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter mb-6 text-gray-900 dark:text-white"
            >
              TECHNOVA'26<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-600 text-3xl md:text-5xl lg:text-6xl mt-4 block">
                Dream It & Ship It
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-10"
            >
              Grab your energy drinks and assemble your squad! The 2nd edition of Technova is back and it's bigger, bolder, and more mind-blowing than ever.
            </motion.p>

            {/* Premium Interactive Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-3 md:gap-6 mb-12 flex-wrap"
            >
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center group">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-[0_0_30px_rgba(37,99,235,0.1)] mb-3 group-hover:border-blue-500/50 group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-2xl md:text-4xl font-display font-bold text-gray-900 dark:text-white relative z-10">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{item.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/modules"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
              >
                Explore Modules <ChevronRight className="w-5 h-5" />
              </Link>
              <a
                href="#highlights"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Last Year's Highlights
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pt-8 border-t border-gray-200 dark:border-white/10"
            >
              <div className="flex flex-col items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">July 11-12, 2026</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">IOBM, Karachi</span>
              </div>
              <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
                <Users className="w-6 h-6 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Social Event</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-[#0a0a0a] relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-gray-900 dark:text-white">
                What's the hype about <span className="text-blue-500">Technova'26?</span>
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                <p>
                  Technova'26 isn't just another tech event - it's a massive, 2-day festival celebrating code, creativity, and pure innovation. It's where the brightest minds on campus come to break things and build them better.
                </p>
                <p>
                  Whether you're a hardcore programmer, a pixel-perfect designer, a strategic gamer, or a visionary entrepreneur, we've got a playground set up just for you. Come test your limits, learn some crazy new skills, and vibe with industry pros.
                </p>
                <ul className="space-y-3 mt-6">
                  {[
                    '10+ mind-bending competition modules',
                    'Industry experts ready to judge (and mentor!)',
                    'Epic networking with top-tier tech companies',
                    'A massive prize pool and swag you\'ll actually wear'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 relative">
                <img 
                  src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1740&auto=format&fit=crop" 
                  alt="Hackathon event" 
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-2xl hidden md:block group hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white"><CountUp end={500} prefix="PKR " suffix="K+" /></div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">In Prizes & Swag</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 text-center">
            {[
              { label: 'Participants', value: 1000, suffix: '+' },
              { label: 'Prize Pool', value: 500, prefix: 'PKR ', suffix: 'K+' },
              { label: 'Hours Event', value: 48, suffix: 'hrs' },
              { label: 'Mentors & Pros', value: 50, suffix: '+' },
              { label: 'Edition', value: 2, suffix: 'nd' },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group relative p-6 md:p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3 flex items-baseline justify-center whitespace-nowrap relative z-10 group-hover:scale-110 transition-transform duration-300">
                  <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider text-xs md:text-sm relative z-10">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Preview */}
      <section className="py-24 bg-white dark:bg-[#050505] transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white">A Taste of the <span className="text-blue-500">Action</span></h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">Just a sneak peek at what's going down. With <span className="font-bold text-blue-500">10+ modules</span> ranging from intense coding battles to creative design showdowns, pick your poison.</p>
            </div>
            <Link 
              to="/modules" 
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              See All Modules <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="flex gap-6 w-max animate-[slide_30s_linear_infinite]">
              {[
                { title: 'Speed Programming', icon: Zap, desc: 'Fingers on the keyboard! Write hyper-efficient algorithms against a ticking clock.', team: 'Individual', teamIcon: User, prize: 'PKR 50K' },
                { title: 'Capture The Flag', icon: Shield, desc: 'Calling all ethical hackers. Find vulnerabilities, exploit systems, and secure the flags.', team: 'Squad', teamIcon: UsersRound, prize: 'PKR 75K' },
                { title: 'Website Designing', icon: Code, desc: 'Got an eye for aesthetics? Build stunning, responsive, and buttery-smooth web interfaces.', team: 'Duo', teamIcon: Users, prize: 'PKR 60K' },
                { title: 'Esports Tournament', icon: Trophy, desc: 'Show off your gaming skills in FIFA, PUBG, Valorant, and Tekken.', team: 'Squad', teamIcon: UsersRound, prize: 'PKR 65K' },
                // Duplicate for seamless loop
                { title: 'Speed Programming', icon: Zap, desc: 'Fingers on the keyboard! Write hyper-efficient algorithms against a ticking clock.', team: 'Individual', teamIcon: User, prize: 'PKR 50K' },
                { title: 'Capture The Flag', icon: Shield, desc: 'Calling all ethical hackers. Find vulnerabilities, exploit systems, and secure the flags.', team: 'Squad', teamIcon: UsersRound, prize: 'PKR 75K' },
                { title: 'Website Designing', icon: Code, desc: 'Got an eye for aesthetics? Build stunning, responsive, and buttery-smooth web interfaces.', team: 'Duo', teamIcon: Users, prize: 'PKR 60K' },
                { title: 'Esports Tournament', icon: Trophy, desc: 'Show off your gaming skills in FIFA, PUBG, Valorant, and Tekken.', team: 'Squad', teamIcon: UsersRound, prize: 'PKR 65K' },
              ].map((mod, i) => {
                const Icon = mod.icon;
                const TeamIcon = mod.teamIcon;
                return (
                  <div key={i} className="w-[350px] shrink-0 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 p-8 rounded-2xl hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-white/10">
                          <TeamIcon className="w-3 h-3" />
                          {mod.team}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-500/20">
                          <Trophy className="w-3 h-3" />
                          {mod.prize}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{mod.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{mod.desc}</p>
                    <Link to="/modules" className="text-sm font-medium text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
                      Check it out <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section id="highlights" className="py-24 bg-white dark:bg-black border-t border-gray-200 dark:border-white/5 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white">Vibes from <span className="text-blue-500">Last Year</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Technova'25 was an absolute blast. We had over 1,000 participants from 50+ universities, 48 hours of non-stop coding, and some of the most innovative projects we've ever seen. From AI-driven healthcare solutions to next-gen blockchain apps, the energy was unmatched. Take a look at the moments that made it unforgettable.
            </p>
          </div>
          
          <div className="relative w-full overflow-hidden rounded-3xl">
            <div className="flex w-[200%] animate-[slide_40s_linear_infinite]">
              {[
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1561489413-985b06da5bee?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
                // Duplicate for seamless loop
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1561489413-985b06da5bee?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
              ].map((src, i) => (
                <div key={i} className="w-1/5 shrink-0 px-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group">
                    <img 
                      src={src} 
                      alt={`Highlight ${i + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/5 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-2">THE MINDS BEHIND TECHNOVA</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">Meet the Team</h2>
          </div>

          <div className="relative w-full overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
            <div className="flex gap-6 w-max px-4">
              {[
                { name: 'Muhammad Anas', role: 'Lead Developer', dept: 'AI Automation Engineer', img: anasProfileBase64 },
                { name: 'Muhammad Abrar', role: 'UI/UX Designer', dept: 'VISUAL STRATEGY & INTERACTION', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop' },
                { name: 'Muheb Khawer', role: 'Backend Engineer', dept: 'BACKEND & LOGIC', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
                { name: 'Alex Rivera', role: 'Event Director', dept: 'OPERATIONS', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
                { name: 'Sarah Chen', role: 'Technical Lead', dept: 'ENGINEERING', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop' },
                { name: 'Marcus Johnson', role: 'Design Head', dept: 'CREATIVE', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop' },
                { name: 'Priya Patel', role: 'Marketing Lead', dept: 'GROWTH', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop' },
                { name: 'David Kim', role: 'Operations Head', dept: 'LOGISTICS', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop' },
              ].map((member, i) => (
                <div key={i} className="relative group rounded-3xl overflow-hidden w-[300px] md:w-[350px] aspect-[3/4] bg-gray-900 shadow-xl shrink-0 snap-center">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110" referrerPolicy="no-referrer" />
                  
                  {/* Always visible gradient and name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-14">
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">{member.role}</p>
                      <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">{member.dept}</p>
                    </div>
                    
                    {/* Social links that fade in on hover */}
                    <div className="absolute bottom-8 left-8 flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
                        <Github className="w-5 h-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
                        <Globe className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="py-24 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/5 transition-colors duration-300 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-16">
            <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-2">BACKED BY THE BEST</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">Shoutout to our <span className="text-blue-500">Partners</span></h2>
          </div>
          
          <div className="space-y-12 mb-20">
            {/* Row 1: Left to Right */}
            <div className="relative flex overflow-hidden">
              <div className="flex gap-6 animate-[slide_40s_linear_infinite]">
                {[
                  { name: 'TECHCORP', icon: '🚀' },
                  { name: 'INNOVATE.IO', icon: '💡' },
                  { name: 'GLOBAL SYS', icon: '🌐' },
                  { name: 'NEXUS', icon: '⚡' },
                  { name: 'CYBERDYNE', icon: '🤖' },
                  { name: 'TECHCORP', icon: '🚀' },
                  { name: 'INNOVATE.IO', icon: '💡' },
                  { name: 'GLOBAL SYS', icon: '🌐' },
                  { name: 'NEXUS', icon: '⚡' },
                  { name: 'CYBERDYNE', icon: '🤖' },
                ].map((sponsor, idx) => (
                  <div 
                    key={idx} 
                    className="group flex flex-col items-center justify-center p-8 w-64 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{sponsor.icon}</span>
                    <div className="text-lg md:text-xl font-display font-bold text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">{sponsor.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Right to Left */}
            <div className="relative flex overflow-hidden">
              <div className="flex gap-6 animate-[slide_40s_linear_reverse_infinite]">
                {[
                  { name: 'NEXUS', icon: '⚡' },
                  { name: 'CYBERDYNE', icon: '🤖' },
                  { name: 'TECHCORP', icon: '🚀' },
                  { name: 'INNOVATE.IO', icon: '💡' },
                  { name: 'GLOBAL SYS', icon: '🌐' },
                  { name: 'NEXUS', icon: '⚡' },
                  { name: 'CYBERDYNE', icon: '🤖' },
                  { name: 'TECHCORP', icon: '🚀' },
                  { name: 'INNOVATE.IO', icon: '💡' },
                  { name: 'GLOBAL SYS', icon: '🌐' },
                ].map((sponsor, idx) => (
                  <div 
                    key={idx} 
                    className="group flex flex-col items-center justify-center p-8 w-64 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-500/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{sponsor.icon}</span>
                    <div className="text-lg md:text-xl font-display font-bold text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">{sponsor.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-left relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Want to sponsor Technova'26?</h3>
              <p className="text-gray-400 text-lg max-w-xl">Join us in shaping the future of technology and get your brand in front of thousands of top-tier innovators.</p>
            </div>
            <Link 
              to="/sponsors" 
              className="relative z-10 shrink-0 px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] hover:-translate-y-1 flex items-center gap-2"
            >
              Become a Sponsor <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-2">WHERE THE MAGIC HAPPENS</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">Our <span className="text-blue-500">Location</span></h2>
          </div>
          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 relative group bg-gray-100 dark:bg-gray-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.508843481424!2d67.11390858834291!3d24.812266470481095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33b7680aed395%3A0x21d3c8026afe14ce!2sInstitute%20of%20Business%20Management!5e0!3m2!1sen!2s!4v1773778633926!5m2!1sen!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full grayscale-[0.8] contrast-125 opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 z-10"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white dark:bg-[#050505] transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white">Got Questions? <span className="text-blue-500">We Got Answers.</span></h2>
            <p className="text-gray-600 dark:text-gray-400">Everything you need to know before you jump in.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "Who can actually participate?", a: "If you're currently enrolled in a university, you're in! Some modules even let high schoolers join the fun. Check the specific module rules for details." },
              { q: "Do I have to pay to get in?", a: "There's a tiny registration fee per module just to keep things serious. But hey, grab those early bird discounts while you can!" },
              { q: "Can I do more than one thing?", a: "Absolutely! As long as you haven't cloned yourself, just make sure the timings don't clash on the schedule." },
              { q: "Do I need to bring a whole squad?", a: "Depends on your vibe! Some modules are solo missions, while others need a dynamic duo or a full 4-person squad." },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 p-6 rounded-xl hover:border-blue-500/30 transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section id="register" className="py-24 relative overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">Ready to blow some minds?</h2>
              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
                Join thousands of students in the ultimate test of skill, creativity, and innovation. Don't sleep on this - spots are filling up fast!
              </p>
              <Link 
                to="/modules"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-gray-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1"
              >
                Lock In Your Spot Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
