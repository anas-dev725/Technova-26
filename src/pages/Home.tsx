// Technova'26 - Connect, Create, & Conquer
import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { anasProfileBase64 } from '../assets/anasProfileBase64';
import { talhaAhmedBase64 } from '../assets/talhaAhmedBase64';
import { technova3Base64 } from '../assets/technova3Base64';
import { technova6Base64 } from '../assets/technova6Base64';
import { technova2Base64 } from '../assets/technova2Base64';
import { technova7Base64 } from '../assets/technova7Base64';
import { technova8Base64 } from '../assets/technova8Base64';
import { technova9Base64 } from '../assets/technova9Base64';
import { technova10Base64 } from '../assets/technova10Base64';
import { iobmLogoBase64 as iobmLogo } from '../assets/iobmLogoBase64';
import HeroV1 from '../components/HeroV1';
import HeroV2 from '../components/HeroV2';
import hamnaPfp from '../assets/hamna pfp.jpeg';
import moizPfp from '../assets/moiz pfp.jpeg';
import ashirPfp from '../assets/ashir pfp.jpeg';
import { ccsisLogoBase64 as ccsisLogo } from '../assets/ccsisLogoBase64';
import { ieeeLogoBase64 as ieeeLogo } from '../assets/ieeeLogoBase64';
import { bBraunLogo, telecLogo, expressNewsLogo, texitechLogo } from '../assets/sponsor-logos';
import { modules } from '../data/modules';
import { ChevronRight, Calendar, MapPin, Users, Trophy, Code, Shield, Zap, ArrowRight, CheckCircle2, User, UsersRound, Github, Linkedin, Globe, Handshake, Mail, Award, Clock } from 'lucide-react';

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

function MemberCard({ member }: { member: any, key?: string | number }) {
  const cardRef = useRef(null);
  // Use a restrictive margin to only trigger when the card is largely in the center of the viewport
  const isInView = useInView(cardRef, { 
    amount: 0.8,
    once: false 
  });

  return (
    <div 
      ref={cardRef}
      className="relative group rounded-2xl overflow-hidden w-[260px] md:w-[300px] aspect-[4/5] bg-gray-900 shadow-xl shrink-0 snap-center"
    >
      <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110" />
      
      {/* Always visible gradient and name */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
        <div className={`transform transition-transform duration-500 ease-out ${isInView ? '-translate-y-12 md:translate-y-0 md:group-hover:-translate-y-12' : 'group-hover:-translate-y-12'}`}>
          <h3 className="text-xl font-bold text-white mb-0.5">{member.name}</h3>
          <p className="text-gray-300 text-xs mb-1.5">{member.role}</p>
          <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">{member.dept}</p>
        </div>
        
        {/* Social links that fade in on hover (desktop) or in-view (mobile) */}
        <div className={`absolute bottom-8 left-8 flex items-center gap-2 transition-all duration-500 ease-out ${isInView ? 'opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}`}>
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
              <Github className="w-4 h-4" />
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.mail && (
            <a href={`mailto:${member.mail}`} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
              <Mail className="w-4 h-4" />
            </a>
          )}
          <a href={member.website || "https://technova.iobm.edu.pk"} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
            <Globe className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeDay, setActiveDay] = useState(0);
  const HERO_VERSION: 'v1' | 'v2' = 'v1'; // Switch this to 'v2' to see the new version
  const location = useLocation();

  // Smooth scroll for anchor links
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

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
      {/* Hero Section Selector */}
      {HERO_VERSION === 'v1' ? (
        <HeroV1 timeLeft={timeLeft} />
      ) : (
        <HeroV2 timeLeft={timeLeft} />
      )}

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-[#0a0a0a] relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-gray-900 dark:text-white leading-tight tracking-tight">
                What's the hype about <br />
                <span className="text-blue-500">Technova'26?</span>
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                <p>
                  Technova'26 isn't just another tech event - it's a massive, 2-day festival celebrating code, creativity, and pure innovation. It's where the brightest minds on campus come to break things and build them better.
                </p>
                <p>
                  Whether you're a hardcore programmer, a pixel-perfect designer, a strategic gamer, or a visionary entrepreneur, we've got a playground set up just for you. Come test your limits, learn some crazy new skills, and vibe with industry pros.
                </p>
                <div className="space-y-4 pt-4">
                  {[
                    '10+ mind-bending competition modules',
                    'Industry experts ready to judge (and mentor!)',
                    'Epic networking with top-tier tech companies',
                    'A massive prize pool and swag you\'ll actually wear'
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="relative order-1 lg:order-2"
            >
              <div className="aspect-video lg:aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white dark:border-white/5 shadow-2xl transition-transform duration-700">
                <img 
                  src={technova3Base64} 
                  alt="Technova Hype" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Stat Blob */}
              <div className="absolute -bottom-6 -left-6 md:-left-10 w-56 h-28 bg-[#111] border border-gray-800 rounded-3xl flex items-center gap-4 p-6 shadow-2xl z-20">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">PKR 500K+</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">In Prizes & Swag</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black transition-colors duration-300 relative overflow-hidden">

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
                className={`group relative p-6 md:p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}
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
                  <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white tracking-tight">Explore the <span className="text-blue-500">Modules</span></h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">Get a glimpse of the exciting challenges waiting for you. With <span className="font-bold text-blue-500">10+ modules</span> ranging from innovative coding sprints to creative design showcases, there's a perfect path for everyone. What will you build?</p>
            </div>
            <Link 
              to="/modules" 
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              See All Modules <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative w-full overflow-hidden group/slider">
            <div className="flex gap-6 w-max animate-[slide_30s_linear_infinite] hover:[animation-play-state:paused]">
              {[...modules, ...modules].map((mod, i) => {
                const Icon = mod.icon;
                const TeamIcon = mod.mode === 'Individual' ? User : mod.mode === 'Duo' ? Users : UsersRound;
                return (
                  <div key={`${mod.id}-${i}`} className="w-[350px] shrink-0 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 p-8 rounded-2xl hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-white/10">
                          <TeamIcon className="w-3 h-3" />
                          {mod.mode}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-500/20">
                          <Trophy className="w-3 h-3" />
                          {mod.prize === 'TBD' ? 'Prize: TBD' : mod.prize}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{mod.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">{mod.description}</p>
                    <Link to={`/modules/${mod.id}`} className="text-sm font-medium text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
                      Check it out <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="py-24 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/5 transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-3">Backed by the Best</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">Our Strategic <span className="text-blue-500">Partners</span></h2>
          </div>
          
          <div className="relative group">
            {/* Faded edges to indicate carousel continuity */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 dark:from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 dark:from-black to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden py-10">
              <div className="flex gap-12 w-max animate-[slide_20s_linear_infinite] hover:[animation-play-state:paused]">
                {[
                  { name: 'B Braun', logo: bBraunLogo },
                  { name: 'Telec', logo: telecLogo },
                  { name: 'Express News', logo: expressNewsLogo },
                  { name: 'Texitech', logo: texitechLogo },
                  // Repeat multiple times for perfect infinite loop logic (must be even sets for -50% translation)
                  { name: 'B Braun', logo: bBraunLogo },
                  { name: 'Telec', logo: telecLogo },
                  { name: 'Express News', logo: expressNewsLogo },
                  { name: 'Texitech', logo: texitechLogo },
                  { name: 'B Braun', logo: bBraunLogo },
                  { name: 'Telec', logo: telecLogo },
                  { name: 'Express News', logo: expressNewsLogo },
                  { name: 'Texitech', logo: texitechLogo },
                  { name: 'B Braun', logo: bBraunLogo },
                  { name: 'Telec', logo: telecLogo },
                  { name: 'Express News', logo: expressNewsLogo },
                  { name: 'Texitech', logo: texitechLogo },
                ].map((sponsor: any, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col items-center justify-center px-8 py-6 min-w-[200px] h-32 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm hover:shadow-xl hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 group/item"
                  >
                    {sponsor.logo ? (
                      <div className="w-full h-20 flex items-center justify-center p-3 bg-white rounded-2xl shadow-inner mb-4">
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name} 
                          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover/item:scale-110" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    ) : (
                      <span className="text-4xl mb-4 grayscale group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-500">{sponsor.icon}</span>
                    )}
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] transition-colors group-hover/item:text-blue-500">
                      {sponsor.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 bg-[#0a0a0a] border border-gray-800 rounded-[3rem] p-8 md:p-14 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-left relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex-1">
              <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">Want to sponsor Technova'26?</h3>
              <p className="text-gray-400 text-lg max-w-xl leading-relaxed">Join us in shaping the future of technology and get your brand in front of thousands of top-tier innovators.</p>
            </div>
            <Link 
              to="/sponsors"
              className="relative z-10 shrink-0 px-6 py-3 sm:px-10 sm:py-5 rounded-[2rem] bg-blue-600 text-white font-bold text-base sm:text-xl hover:bg-blue-500 transition-all hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center gap-3 group"
            >
              Become a Sponsor <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Legacy Highlights Section */}
      <section id="highlights" className="py-24 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/5 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-2">LAST YEAR'S ECHOES</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">Legacy of <span className="text-blue-500">Technova'25</span></h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 leading-relaxed font-medium">
              We brought together 1,200+ participants from over 30 universities to compete in 12+ competition modules. Relive the moments that made Technova'25 legendary.
            </p>
            <Link 
              to="/legacy"
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-black text-sm uppercase tracking-widest group"
            >
              Explore Full Legacy Highlights <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[400px] md:h-[600px]">
            <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-3xl">
              <img 
                src={technova6Base64} 
                alt="Highlight 1" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white font-bold">The Innovation Arena</span>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-3xl">
              <img 
                src={technova2Base64} 
                alt="Highlight 2" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative group overflow-hidden rounded-3xl">
              <img 
                src={technova7Base64} 
                alt="Highlight 3" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="col-span-1 relative group overflow-hidden rounded-3xl">
              <img 
                src={technova8Base64} 
                alt="Highlight 4" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="col-span-1 relative group overflow-hidden rounded-3xl">
              <img 
                src={technova9Base64} 
                alt="Highlight 5" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-[#050505] transition-colors duration-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">REAL STORIES</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white">Voices of the <span className="text-blue-500">Arena</span></h2>
            </div>
          </div>

          <div className="relative group">
            <div className="flex gap-8 animate-[slide_20s_linear_infinite] hover:[animation-play-state:paused] w-max">
              {[
                { 
                  name: "Dr Khalid Mehboob", 
                  role: "Director - Technova'25", 
                  text: "Leading Technova '25 was unforgettable. With 7 dynamic modules and talent packed from 25+ universities, the energy, innovation, and execution were truly next level." 
                },
                { name: "Ahmed Raza", role: "Discoverer & Past Participant", text: "Technova'25 was an incredible journey of discovery. I met so many amazing people and explored ideas I never thought possible!" },
                { name: "Dr. Maria Khan", role: "Industry Mentor & Judge", text: "It was inspiring to see so much curiosity and innovative thinking in one place. These students are truly building the future!" },
                { name: "Zainab Ali", role: "Creative Strategist & Evaluator", text: "The creative energy was infectious! I loved seeing how participants combined their unique perspectives with technical skill." },
                { name: "Hamza Sheik", role: "Visionary & Project Lead", text: "More than just a competition, it was a community. I loved the supportive vibe and the chance to learn alongside everyone." },
                // Duplicate for loop
                { 
                  name: "Dr Khalid Mehboob", 
                  role: "Director - Technova'25", 
                  text: "Leading Technova '25 was unforgettable. With 7 dynamic modules and talent packed from 25+ universities, the energy, innovation, and execution were truly next level." 
                },
                { name: "Ahmed Raza", role: "Discoverer & Past Participant", text: "Technova'25 was an incredible journey of discovery. I met so many amazing people and explored ideas I never thought possible!" },
                { name: "Dr. Maria Khan", role: "Industry Mentor & Judge", text: "It was inspiring to see so much curiosity and innovative thinking in one place. These students are truly building the future!" }
              ].map((t, idx) => (
                <div key={idx} className="w-[400px] bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 p-10 rounded-[2.5rem] relative group shadow-sm hover:shadow-2xl transition-all hover:border-blue-500/30">
                  <div className="flex items-center gap-4 mb-8">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white tracking-tight">{t.name}</h4>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                    "{t.text}"
                  </p>
                  <div className="absolute top-10 right-10 text-6xl font-serif text-blue-500/10 select-none">"</div>
                </div>
              ))}
            </div>
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-black transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Got Questions? <span className="text-blue-500">We Got Answers.</span>
            </h2>
            <p className="text-gray-400 text-lg">Everything you need to know before you jump in.</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Who can actually participate?",
                a: "If you're currently enrolled in a university, you're in! Some modules even let high schoolers join the fun. Check the specific module rules for details."
              },
              {
                q: "Do I have to pay to get in?",
                a: "There's a tiny registration fee per module just to keep things serious. But hey, grab those early bird discounts while you can!"
              },
              {
                q: "Can I do more than one thing?",
                a: "Absolutely! As long as you haven't cloned yourself, just make sure the timings don't clash on the schedule."
              },
              {
                q: "Do I need to bring a whole squad?",
                a: "Depends on your vibe! Some modules are solo missions, while others need a dynamic duo or a full squad. Check your module's requirements."
              }
            ].map((item, i) => (
              <div key={i} className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-[#111] border border-gray-800 hover:border-gray-700 transition-colors">
                <h3 className="text-xl font-bold text-white mb-4">{item.q}</h3>
                <p className="text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register CTA Section */}
      <section id="register" className="py-16 md:py-24 relative overflow-hidden bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-gradient-to-br from-[#1366ff] via-[#1052ff] to-[#013ddc] rounded-[3rem] p-8 sm:p-16 lg:p-20 text-center overflow-hidden shadow-2xl"
          >
            {/* Soft Ambient White/Blue Radial Glows for added luxury depth */}
            <div className="absolute -top-12 -left-12 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              {/* Ready to blow some minds? Title */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-black text-white mb-6 tracking-tight leading-tight select-none">
                Ready to blow some minds?
              </h2>

              {/* Description Paragraph */}
              <p className="text-blue-50/90 text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-medium select-none">
                Join thousands of students in the ultimate test of skill, creativity, and innovation. Don't sleep on this - spots are filling up fast!
              </p>

              {/* Lock In Your Spot Now Button */}
              <div className="w-full flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 sm:px-10 rounded-full bg-white text-[#1052ff] font-extrabold text-sm sm:text-base hover:bg-white/95 transition-all shadow-lg font-sans"
                  >
                    Lock In Your Spot Now
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
