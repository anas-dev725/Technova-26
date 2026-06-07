import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Globe, Sparkle, Sparkles, User, Award, Shield, Star, Crown, Cable, Users } from 'lucide-react';
import { anasProfileBase64 } from '../assets/anasProfileBase64';
import anasPfp from '../assets/Anas pfp 1.jpg';
import talhaPfp from '../assets/talha pfp.jpg';
import hamnaPfp from '../assets/hamna pfp.jpeg';
import moizPfp from '../assets/moiz pfp.jpeg';
import ashirPfp from '../assets/ashir pfp.jpeg';
import ramshaPfp from '../assets/ramsha pfp.jpeg';
import adeenPfp from '../assets/adeen pfp.jpeg';
import daneenPfp from '../assets/Daneen pfp.jpeg';
import mustafaPfp from '../assets/mustafa pfp.jpeg';
import shayanPfp from '../assets/shayan pfp.jpeg';
import abbassPfp from '../assets/abbass pfp.jpg';
import khalidPfp from '../assets/khalid pfp.jpeg';

interface TeamMember {
  name: string;
  role: string;
  dept: string;
  img?: string;
  initials?: string;
  gradient?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  mail?: string;
}

export default function Team() {
  // President & Vice President
  const chairperson: TeamMember = {
    name: 'Hamna Saleem',
    role: 'President',
    dept: 'Data Analyst & IEEE IoBM Lead',
    img: hamnaPfp,
    linkedin: 'https://www.linkedin.com/in/hamna-saleem-659a5b223/',
    mail: 'hamnasaleem23@gmail.com'
  };

  const viceChairperson: TeamMember = {
    name: 'Muhammad Anas',
    role: 'Vice President',
    dept: 'AI Automation & Systems Architect',
    img: anasPfp,
    github: 'https://github.com/anas-dev725',
    linkedin: 'https://www.linkedin.com/in/muhammad-anas804/',
    website: 'https://muhammad-anas-ai-engineer.vercel.app/'
  };

  // Left Wing Children (reporting to President)
  const leftWing: TeamMember[] = [
    {
      name: 'Moiz Ali Siddiqui',
      role: 'General Secretary',
      dept: 'Full Stack Integration & Strategy',
      img: moizPfp,
      linkedin: 'https://linkedin.com/in/moizalisiddiqui',
      mail: 'nar.sas789@gmail.com'
    },
    {
      name: 'Aashir Ali',
      role: 'Director Finance',
      dept: 'Budgeting & Asset Portfolio',
      img: ashirPfp,
      linkedin: 'https://www.linkedin.com/in/aashir-ali-6aa2b233a/',
      mail: 'abbasiaashirali110@gmail.com'
    },
    {
      name: 'Ramsha Khan',
      role: 'Volunteer Lead',
      dept: 'Data Analyst',
      img: ramshaPfp,
      linkedin: 'https://www.linkedin.com/in/ramshaimran1',
      mail: 'ramshaimran.work@gmail.com'
    },
    {
      name: 'Daneen Nathani',
      role: 'Volunteer Lead',
      dept: 'Junior Data Analyst',
      img: daneenPfp,
      linkedin: 'https://www.linkedin.com/in/daneennathani/',
      mail: 'daneennathani15@outlook.com'
    }
  ];

  // Right Wing Children (reporting to Vice President)
  const rightWing: TeamMember[] = [
    {
      name: 'Adeen Gul Shaikh',
      role: 'Event administrator',
      dept: 'AI Engineer',
      img: adeenPfp,
      linkedin: 'https://www.linkedin.com/in/adeen-shaikh-257153322/',
      mail: 'adeenmajeedshaikh@gmail.com'
    },
    {
      name: 'Talha Ahmed',
      role: 'Director of Module Operations',
      dept: 'AI Development & System Architect',
      img: talhaPfp,
      github: 'https://github.com/Talhaahmad9',
      linkedin: 'Https://linkedin.com/in/talha-ahmad9'
    },
    {
      name: 'Muhammad Abbas',
      role: 'Director Corporate Affairs',
      dept: 'AI Engineer',
      img: abbassPfp,
      linkedin: 'https://www.linkedin.com/in/syed-muhammad-abbas-hassan-zaidi-505a8b340/',
      mail: 'Std_34578@iobm.edu.pk'
    },
    {
      name: 'Eshal Noor',
      role: 'Director PR',
      dept: 'Outreach & Media Communication',
      initials: 'EN',
      gradient: 'from-indigo-500 to-cyan-600',
      linkedin: 'https://www.linkedin.com/'
    }
  ];

  // Additional Wing (Core Operations Support Directorate) (3 members)
  const additionalWing: TeamMember[] = [
    {
      name: 'Syeda Fatima',
      role: 'Director Registrations',
      dept: 'Attendee Database & Desk Core',
      initials: 'SF',
      gradient: 'from-amber-500 to-orange-600',
      linkedin: 'https://www.linkedin.com/'
    },
    {
      name: 'Rayyan Sheikh',
      role: 'Director Security',
      dept: 'Venue Access & Guard Protocol',
      initials: 'RS',
      gradient: 'from-emerald-500 to-teal-600',
      linkedin: 'https://www.linkedin.com/'
    },
    {
      name: 'Aliza Zaidi',
      role: 'Director Media',
      dept: 'Press Coverage & Scribing Core',
      initials: 'AZ',
      gradient: 'from-rose-500 to-pink-600',
      linkedin: 'https://www.linkedin.com/'
    }
  ];

  // Faculty Advisory Board Data
  const facultyHead: TeamMember = {
    name: 'Dr. Khalid Mahboob, (Ph.D.)',
    role: 'Director Technova',
    dept: 'Assistant Professor, CCSIS',
    img: khalidPfp,
    linkedin: 'https://www.linkedin.com/in/dr-khalid-mahboob-ph-d-bb833b1b/',
    mail: 'khalid.mahboob@iobm.edu.pk'
  };

  const facultyMembers: TeamMember[] = [
    {
      name: 'Syed Shabeeb Raza',
      role: 'Director Operations',
      dept: 'Junior Lecturer, CCSIS',
      initials: 'SR',
      gradient: 'from-violet-900/90 via-[#180410] to-[#0c0214]',
      linkedin: 'https://www.linkedin.com/in/the-shabeeb-raza/'
    },
    {
      name: 'Mustafa Ahmed Khan',
      role: 'Media & Marketing Director',
      dept: 'Junior Lecturer, CCSIS',
      img: mustafaPfp,
      linkedin: 'https://www.linkedin.com/in/mustafa-ahmed-khan-7b3a86267/',
      mail: 'mustafa.ahmed@iobm.edu.pk'
    },
    {
      name: 'Shayan Faiz',
      role: 'Director Events',
      dept: 'Junior Lecturer, CCSIS',
      img: shayanPfp,
      linkedin: 'https://www.linkedin.com/in/shayan-faiz-853819234/'
    }
  ];

  // Beautiful flowing line rendering helper
  const FlowPath = ({ 
    direction = 'vertical', 
    length = '100%', 
    color = 'cyan', // Always blue/cyan by default
    delay = 0
  }: { 
    direction?: 'vertical' | 'horizontal'; 
    length?: string; 
    color?: 'pink' | 'cyan'; 
    delay?: number;
  }) => {
    const gradientColorClass = 'from-cyan-400 via-blue-500 to-cyan-400';

    return (
      <div 
        className="absolute z-0 pointer-events-none" 
        style={{
          width: direction === 'horizontal' ? length : '2px',
          height: direction === 'vertical' ? length : '2px',
          background: 'rgba(34,211,238,0.15)'
        }}
      >
        <motion.div
          initial={direction === 'vertical' ? { scaleY: 0 } : { scaleX: 0 }}
          whileInView={{ scaleY: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: direction === 'vertical' ? 'top' : 'center' }}
          className={`w-full h-full bg-gradient-to-r ${gradientColorClass}`}
        />
      </div>
    );
  };

  const renderMemberCard = (member: TeamMember, type: 'pink' | 'cyan' = 'pink', size: 'large' | 'normal' = 'normal') => {
    const isPink = type === 'pink';
    const accentClass = isPink 
      ? 'border-pink-500/40 text-pink-100 bg-pink-900/85 backdrop-blur-lg shadow shadow-black/35' 
      : 'border-cyan-400/40 text-cyan-100 bg-cyan-950/85 backdrop-blur-lg shadow shadow-black/35';
    
    return (
      <motion.div
        key={member.name}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 90 }}
        className={`relative group rounded-[2rem] overflow-hidden bg-white dark:bg-[#06070e] border border-gray-200 dark:border-zinc-800/60 shadow-2xl transition-all duration-300 ${
          size === 'large' 
            ? 'w-full max-w-[300px] h-auto aspect-[4/5] md:w-[300px] md:h-[375px]' 
            : 'w-full max-w-[250px] h-auto aspect-[4/5] md:w-[250px] md:h-[312px]'
        } ${
          isPink ? 'hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]' : 'hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]'
        }`}
      >
        {/* Subtle grid backdrop & bright highlights inside the node */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:14px_14px] z-10 pointer-events-none" />
        <div className={`absolute -right-16 -top-16 w-36 h-36 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-25 z-10 ${
          isPink ? 'bg-pink-500' : 'bg-cyan-400'
        }`} />

        {member.img ? (
          <img 
            src={member.img} 
            alt={member.name} 
            className="w-full h-full object-cover filter brightness-[0.9] group-hover:brightness-[0.95] group-hover:scale-105 transition-all duration-700 ease-out" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${member.gradient || (isPink ? 'from-pink-900 via-[#180410] to-[#060004]' : 'from-cyan-950 via-[#02131e] to-[#000408]')} flex items-center justify-center relative overflow-hidden`}>
            {/* Geometric tech grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />
            <span className="text-8xl select-none font-display font-black text-white/5 tracking-tighter absolute">
              {member.initials}
            </span>
            <div className="z-10 bg-white/5 w-20 h-20 rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-lg backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
              <span className="text-3xl font-display font-black text-white tracking-widest uppercase">
                {member.initials}
              </span>
              <span className={`text-[8px] font-mono tracking-widest uppercase mt-1 ${isPink ? 'text-pink-400' : 'text-cyan-400'}`}>LEAD</span>
            </div>
          </div>
        )}

        {/* Indicator Node Dot in top corner */}
        <div className="absolute top-4 left-4 z-25 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 dark:bg-black/70 backdrop-blur-md border border-gray-200 dark:border-zinc-800/80">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          <span className="font-mono text-[8px] text-gray-500 dark:text-zinc-400 uppercase tracking-widest font-black">
            NODE_SYS
          </span>
        </div>

        {/* Leader Indicator Overlay badge */}
        {size === 'large' && (
          <div className="absolute top-4 right-4 pointer-events-none z-25">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/85 dark:bg-black/70 text-[8px] font-black uppercase tracking-widest backdrop-blur-md border border-gray-200 dark:border-zinc-800/80 ${
              isPink ? 'text-pink-500 dark:text-pink-400' : 'text-cyan-600 dark:text-cyan-400'
            }`}>
              <Crown className="w-2.5 h-2.5 text-yellow-400" />
              EXECUTIVE LEAD
            </span>
          </div>
        )}

        {/* Info Layout overlaid on backdrop but beautifully integrated */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 sm:p-6 flex flex-col justify-end text-left z-20">
          <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] sm:text-[9.5px] font-mono font-black uppercase tracking-widest border mb-1.5 ${accentClass}`}>
              {member.role === 'PR' ? 'Director of PR' : member.role}
            </span>
            <h3 className="font-display font-black text-white tracking-tight text-base sm:text-lg group-hover:text-white transition-colors duration-300 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.5)]">
              {member.name}
            </h3>
            <p className="text-[9.5px] sm:text-[10.5px] text-zinc-300 font-semibold font-mono leading-tight mt-0.5 sm:mt-1 tracking-tight drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.5)]">
              {member.dept}
            </p>
          </div>

          {/* Social connections beautiful animation overlay */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/30 mt-3 relative z-30">
            <div className="flex gap-2">
              {member.linkedin && (
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-7 h-7 rounded-lg bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#0077b5] border border-zinc-800/85 hover:scale-105 transition-all duration-200"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {member.github && (
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-7 h-7 rounded-lg bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800/85 hover:scale-105 transition-all duration-200"
                  aria-label={`${member.name} GitHub`}
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {member.website && (
                <a 
                  href={member.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-7 h-7 rounded-lg bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-850 border border-zinc-800/85 hover:scale-105 transition-all duration-200"
                  aria-label={`${member.name} Portfolio`}
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
              {member.mail && (
                <a 
                  href={`mailto:${member.mail}`} 
                  className="w-7 h-7 rounded-lg bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-rose-950 border border-zinc-800/85 hover:scale-105 transition-all duration-200"
                  aria-label={`Mail ${member.name}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <span className="font-mono text-[8px] text-zinc-650 font-bold select-none tracking-widest">
              TX_26
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="pt-32 sm:pt-40 pb-28 relative min-h-screen bg-slate-50 dark:bg-[#020205] scrollbar-none text-gray-950 dark:text-white transition-colors duration-300 overflow-x-hidden">
      
      {/* Immersive background high-tech wire grid and glow points */}
      <div className="absolute inset-0 z-0 pointer-events-none sticky-framer-overlay">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_15%,#eef2ff_0%,transparent_100%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_15%,#0b0d1e_0%,transparent_100%)] opacity-70" />
        
        {/* Soft background radial glows behind the hierarchical graph node paths */}
        <div className="absolute top-[250px] left-1/4 -translate-x-1/2 w-[350px] h-[350px] bg-pink-500/[0.03] rounded-full blur-[110px]" />
        <div className="absolute top-[250px] right-1/4 translate-x-1/2 w-[350px] h-[350px] bg-cyan-400/[0.03] rounded-full blur-[110px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Header metadata info strip */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100/50 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 font-display"
          >
            <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" />
            Executive Committee 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-sans font-bold tracking-tight text-gray-900 dark:text-white mb-6"
          >
            Meet Our <span className="text-blue-500 font-extrabold">ExCom Team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-gray-600 dark:text-zinc-400 max-w-3xl mx-auto text-sm sm:text-base md:text-lg font-sans tracking-wide leading-relaxed"
          >
            The dedicated minds, developers, and visionaries leading the charge to curate a premier national technical experience at TechNova '26.
          </motion.p>
        </div>

        {/* ======================================================== */}
        {/*                  DESKTOP TREE GRAPH LAYOUT               */}
        {/* ======================================================== */}
        <div className="hidden xl:block relative max-w-7xl mx-auto pb-16">
          <div className="flex flex-col items-center">
            
            {/* 1. MASTER ROOT HEADER BOX */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-20 bg-white dark:bg-gradient-to-b dark:from-[#031026]/90 dark:to-[#020308]/95 border-2 border-cyan-500 dark:border-cyan-400 rounded-xl px-12 py-5 shadow-lg dark:shadow-[0_0_20px_rgba(34,211,238,0.15)] text-center w-[360px]"
            >
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/25">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                <span className="text-[7px] text-cyan-600 dark:text-cyan-400 font-mono font-black tracking-widest leading-none">PRIMARY</span>
              </div>
              <h2 className="text-lg font-mono font-black text-gray-900 dark:text-white uppercase tracking-wider">
                EXECUTIVE COUNCIL
              </h2>
              <p className="text-[10px] font-mono text-gray-500 dark:text-zinc-400 uppercase tracking-widest mt-1">
                ENGINE_CORE_SYS_V26
              </p>
            </motion.div>

            {/* Master Trunk vertical pipeline dropping down to first branch split */}
            <div className="relative h-16 w-1">
              <FlowPath direction="vertical" length="64px" color="cyan" delay={0.2} />
            </div>

            {/* First T-Junction: Horizontal bar crossing over left-to-right to Hamna & Anas columns */}
            <div className="relative w-1/2 h-1 flex items-center justify-center">
              {/* Left Bar (Cyan) */}
              <div className="absolute right-1/2 w-1/2 h-full flex items-center justify-end">
                <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.5} />
              </div>
              {/* Right Bar (Cyan) */}
              <div className="absolute left-1/2 w-1/2 h-full flex items-center justify-start">
                <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.5} />
              </div>

              {/* T-Junction center node */}
              <div className="w-3 h-3 rounded-full bg-white dark:bg-zinc-950 border-[2.5px] border-cyan-400 shadow-[0_0_10px_#22d3ee] relative z-10" />

              {/* Left and Right Terminators (Vertical segments dropping directly down into Hamna & Muhammad Anas) */}
              <div className="absolute left-0 top-0 h-12 w-1">
                <FlowPath direction="vertical" length="48px" color="cyan" delay={0.6} />
              </div>
              <div className="absolute right-0 top-0 h-12 w-1">
                <FlowPath direction="vertical" length="48px" color="cyan" delay={0.6} />
              </div>
            </div>

            {/* Gap for vertical drops */}
            <div className="h-10" />

            {/* ======================================================== */}
            {/*         THE TWO PILLARS (PRESIDENT VS VICE PRESIDENT)    */}
            {/* ======================================================== */}
            <div className="grid grid-cols-2 gap-16 lg:gap-24 w-full relative z-10">
              
              {/* ================= LEFT PILLAR: HAMNA (PINK ACCENT CARD, CYAN LINE) ============= */}
              <div className="flex flex-col items-center">
                
                {/* President Node Card (Pink Accent) */}
                <div className="relative">
                  {renderMemberCard(chairperson, 'pink', 'large')}

                  {/* Single main vertical lineage path going downwards */}
                  <div className="absolute left-1/2 -bottom-16 w-1 h-16 flex justify-center">
                    <FlowPath direction="vertical" length="64px" color="cyan" delay={0.3} />
                  </div>
                </div>

                <div className="h-16" />

                {/* Sub-Branching Joint Line for her 2x2 grid */}
                <div className="relative w-full flex flex-col items-center">
                  
                  {/* Center vertical lineage going down to second row */}
                  <div className="absolute left-1/2 top-0 h-[816px] w-1 flex justify-center">
                    <FlowPath direction="vertical" length="100%" color="cyan" delay={0.6} />
                  </div>

                  <div className="h-8" />

                  {/* Row-by-row centered flex layouts for Hamna's reports to guarantee perfect centering */}
                  <div className="flex flex-col gap-y-16 mt-4 relative z-10 w-full items-center">
                    
                    {/* First Row (Moiz & Aashir) */}
                    <div className="flex gap-x-12 justify-center w-full">
                      
                      {/* General Secretary */}
                      <div className="relative">
                        {renderMemberCard(leftWing[0], 'pink', 'normal')}
                        {/* Horizontal connector connecting to the center vertical line */}
                        <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-[24px] h-1">
                          <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.8} />
                        </div>
                      </div>

                      {/* Director Finance */}
                      <div className="relative">
                        {renderMemberCard(leftWing[1], 'pink', 'normal')}
                        {/* Horizontal connector connecting to the center vertical line */}
                        <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-[24px] h-1">
                          <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.8} />
                        </div>
                      </div>

                    </div>

                    {/* Second Row (Volunteer Leads: Ramsha & Daneen) */}
                    <div className="flex gap-x-12 justify-center w-full">
                      
                      {/* Volunteer Lead (Ramsha) */}
                      <div className="relative">
                        {renderMemberCard(leftWing[2], 'pink', 'normal')}
                        {/* Horizontal connector connecting to the center vertical line */}
                        <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-[24px] h-1">
                          <FlowPath direction="horizontal" length="100%" color="cyan" delay={1.0} />
                        </div>
                      </div>

                      {/* Volunteer Lead (Daneen) */}
                      <div className="relative">
                        {renderMemberCard(leftWing[3], 'pink', 'normal')}
                        {/* Horizontal connector connecting to the center vertical line */}
                        <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-[24px] h-1">
                          <FlowPath direction="horizontal" length="100%" color="cyan" delay={1.0} />
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* ================= RIGHT PILLAR: ANAS (CYAN ACCENT CARD, CYAN LINE) ============= */}
              <div className="flex flex-col items-center">
                
                {/* Vice President Node Card (Cyan Accent) */}
                <div className="relative">
                  {renderMemberCard(viceChairperson, 'cyan', 'large')}

                  {/* Single main vertical lineage path going downwards */}
                  <div className="absolute left-1/2 -bottom-16 w-1 h-16 flex justify-center">
                    <FlowPath direction="vertical" length="64px" color="cyan" delay={0.3} />
                  </div>
                </div>

                <div className="h-16" />

                {/* Sub-Branching Joint Line for his 2x2 grid */}
                <div className="relative w-full flex flex-col items-center">
                  
                  {/* Center vertical lineage going down to second row */}
                  <div className="absolute left-1/2 top-0 h-[816px] w-1 flex justify-center">
                    <FlowPath direction="vertical" length="100%" color="cyan" delay={0.6} />
                  </div>

                  <div className="h-8" />

                  {/* Row-by-row centered flex layouts for Anas's reports to guarantee perfect centering */}
                  <div className="flex flex-col gap-y-16 mt-4 relative z-10 w-full items-center">
                    
                    {/* First Row (Adeen Gul Shaikh & Talha Ahmed) */}
                    <div className="flex gap-x-12 justify-center w-full">
                      
                      {/* Event administrator */}
                      <div className="relative">
                        {renderMemberCard(rightWing[0], 'cyan', 'normal')}
                        {/* Horizontal connector connecting to the center vertical line */}
                        <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-[24px] h-1">
                          <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.8} />
                        </div>
                      </div>

                      {/* Director of Module Operations */}
                      <div className="relative">
                        {renderMemberCard(rightWing[1], 'cyan', 'normal')}
                        {/* Horizontal connector connecting to the center vertical line */}
                        <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-[24px] h-1">
                          <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.8} />
                        </div>
                      </div>

                    </div>

                    {/* Second Row (Director Corporate Affairs & Director PR) */}
                    <div className="flex gap-x-12 justify-center w-full">
                      
                      {/* Director Corporate Affairs */}
                      <div className="relative">
                        {renderMemberCard(rightWing[2], 'cyan', 'normal')}
                        {/* Horizontal connector connecting to the center vertical line */}
                        <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-[24px] h-1">
                          <FlowPath direction="horizontal" length="100%" color="cyan" delay={1.0} />
                        </div>
                      </div>

                      {/* Director PR */}
                      <div className="relative">
                        {renderMemberCard(rightWing[3], 'cyan', 'normal')}
                        {/* Horizontal connector connecting to the center vertical line */}
                        <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-[24px] h-1">
                          <FlowPath direction="horizontal" length="100%" color="cyan" delay={1.0} />
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Connection from the two main wings converging at the bottom */}
            <div className="relative h-16 w-full mt-12 flex items-center justify-center">
              {/* Responsive grid to align perfectly with the two columns above */}
              <div className="absolute inset-0 grid grid-cols-2 gap-16 lg:gap-24 w-full">
                {/* Left column horizontal extension to the center */}
                <div className="relative h-full">
                  <div className="absolute left-1/2 right-[-32px] lg:right-[-48px] top-1/2 -translate-y-1/2 h-[2px]">
                    <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.2} />
                  </div>
                </div>
                {/* Right column horizontal extension to the center */}
                <div className="relative h-full">
                  <div className="absolute left-[-32px] lg:left-[-48px] right-1/2 top-1/2 -translate-y-1/2 h-[2px]">
                    <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.2} />
                  </div>
                </div>
              </div>

              {/* Central drop dot and vertical pipelines */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                {/* Central drop dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-zinc-950 border-2 border-cyan-400 shadow-[0_0_8px_#22d3ee] relative z-10" />
                
                {/* Center vertical down drop to the split of 3 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-8 w-1">
                  <FlowPath direction="vertical" length="32px" color="cyan" delay={0.4} />
                </div>
              </div>
            </div>

            {/* Horizontal split for the 3 bottom columns */}
            <div className="relative w-[50%] h-1 flex items-center justify-center">
              <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.6} />
              
              {/* Left drop line */}
              <div className="absolute left-0 top-0 h-12 w-1">
                <FlowPath direction="vertical" length="48px" color="cyan" delay={0.8} />
              </div>
              {/* Center drop line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 h-12 w-1">
                <FlowPath direction="vertical" length="48px" color="cyan" delay={0.8} />
              </div>
              {/* Right drop line */}
              <div className="absolute right-0 top-0 h-12 w-1">
                <FlowPath direction="vertical" length="48px" color="cyan" delay={0.8} />
              </div>
            </div>

            <div className="h-12" />

            {/* Bottom Row of 3 Members */}
            <div className="flex flex-wrap lg:flex-nowrap gap-12 justify-center w-full relative z-10 mt-4">
              {/* Member 1: Syeda Fatima */}
              <div className="relative">
                {renderMemberCard(additionalWing[0], 'pink', 'normal')}
              </div>
              
              {/* Member 2: Rayyan Sheikh */}
              <div className="relative">
                {renderMemberCard(additionalWing[1], 'cyan', 'normal')}
              </div>
              
              {/* Member 3: Aliza Zaidi */}
              <div className="relative">
                {renderMemberCard(additionalWing[2], 'pink', 'normal')}
              </div>
            </div>

            {/* Vertical connector down to Faculty Board Section */}
            <div className="relative h-16 w-full flex items-center justify-center">
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1">
                <FlowPath direction="vertical" length="64px" color="cyan" delay={0.2} />
              </div>
            </div>

            {/* Faculty Board Middle Card */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-mono font-black text-rose-500 dark:text-rose-400 uppercase tracking-[0.2em] mb-4 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                FACULTY ADVISORY BOARD
              </span>
              <div className="relative">
                {renderMemberCard(facultyHead, 'cyan', 'large')}
                
                {/* Center vertical lineage going down below the faculty head */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 w-1 h-16 flex justify-center pb-2">
                  <FlowPath direction="vertical" length="64px" color="cyan" delay={0.4} />
                </div>
              </div>
            </div>

            <div className="h-16" />

            {/* Horizontal split for the 3 faculty members */}
            <div className="relative w-[50%] h-1 flex items-center justify-center">
              <FlowPath direction="horizontal" length="100%" color="cyan" delay={0.6} />
              
              {/* Left drop line */}
              <div className="absolute left-0 top-0 h-12 w-1">
                <FlowPath direction="vertical" length="48px" color="cyan" delay={0.8} />
              </div>
              {/* Center drop line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 h-12 w-1">
                <FlowPath direction="vertical" length="48px" color="cyan" delay={0.8} />
              </div>
              {/* Right drop line */}
              <div className="absolute right-0 top-0 h-12 w-1">
                <FlowPath direction="vertical" length="48px" color="cyan" delay={0.8} />
              </div>
            </div>

            <div className="h-12" />

            {/* Row of 3 Faculty Members */}
            <div className="flex flex-wrap lg:flex-nowrap gap-12 justify-center w-full relative z-10 mt-4">
              <div className="relative">
                {renderMemberCard(facultyMembers[0], 'pink', 'normal')}
              </div>
              <div className="relative">
                {renderMemberCard(facultyMembers[1], 'cyan', 'normal')}
              </div>
              <div className="relative">
                {renderMemberCard(facultyMembers[2], 'pink', 'normal')}
              </div>
            </div>

          </div>
        </div>


        {/* ======================================================== */}
        {/*                  MOBILE/TABLET TREE FLOW                */}
        {/* ======================================================== */}
        <div className="xl:hidden relative flex flex-col items-stretch max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto px-2">
          
          {/* Central flowing backbone for mobile (Gradient flowing from blue to cyan) */}
          <div className="absolute left-6 min-[380px]:left-8 top-0 bottom-12 w-[2px] bg-gradient-to-b from-blue-500 to-cyan-400 z-0" />

          <div className="space-y-10 pl-12 pr-2 min-[380px]:pl-16 min-[380px]:pr-4 text-left">
            
            {/* Header placeholder on mobile */}
            <div className="relative border-l-2 border-cyan-400 pl-4 py-1 select-none">
              <span className="font-mono text-[9px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest block">EXCOM_STRUCTURE_ROOT</span>
              <h2 className="text-lg font-bold uppercase text-gray-900 dark:text-white tracking-tight">Presidency Core</h2>
            </div>

            {/* Mobile President Card */}
            <div className="relative">
              {/* Branch connecting back to vertebrae spine */}
              <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 w-[24px] min-[380px]:w-[32px] h-[2px] bg-cyan-400/50" />
              <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              {renderMemberCard(chairperson, 'pink', 'large')}
            </div>

            {/* Mobile Vice President Card */}
            <div className="relative">
              {/* Branch connecting back to vertebrae spine */}
              <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 w-[24px] min-[380px]:w-[32px] h-[2px] bg-cyan-400/50" />
              <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              {renderMemberCard(viceChairperson, 'cyan', 'large')}
            </div>

            {/* Left Wing children divider header */}
            <div className="relative border-l-2 border-cyan-400 pl-4 py-1 select-none pt-4">
              <span className="font-mono text-[9px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest block">L_WING // PRESIDENT_REPORTS</span>
              <h2 className="text-base font-bold uppercase text-gray-900 dark:text-white tracking-tight">Executive operations</h2>
            </div>

            {leftWing.map((member) => (
              <div className="relative" key={member.name}>
                {/* Connection line */}
                <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 w-[24px] min-[380px]:w-[32px] h-[2px] bg-cyan-400/30" />
                <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {renderMemberCard(member, 'pink', 'normal')}
              </div>
            ))}

            {/* Right Wing children divider header */}
            <div className="relative border-l-2 border-cyan-400 pl-4 py-1 select-none pt-4">
              <span className="font-mono text-[9px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest block">R_WING // TECH_CREATIVE_MEDIA</span>
              <h2 className="text-base font-bold uppercase text-gray-900 dark:text-white tracking-tight">Technical & Creative Portfolio</h2>
            </div>

            {rightWing.map((member) => (
              <div className="relative" key={member.name}>
                {/* Connection line */}
                <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 w-[24px] min-[380px]:w-[32px] h-[2px] bg-cyan-400/30" />
                <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {renderMemberCard(member, 'cyan', 'normal')}
              </div>
            ))}

            {/* Additional Wing children divider header */}
            <div className="relative border-l-2 border-cyan-400 pl-4 py-1 select-none pt-4">
              <span className="font-mono text-[9px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest block">A_WING // CORE_OPERATIONS_SUPPORT</span>
              <h2 className="text-base font-bold uppercase text-gray-900 dark:text-white tracking-tight">Core Operations & Volunteer Core</h2>
            </div>

            {additionalWing.map((member, index) => (
              <div className="relative" key={member.name}>
                {/* Connection line */}
                <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 w-[24px] min-[380px]:w-[32px] h-[2px] bg-cyan-400/30" />
                <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {renderMemberCard(member, index % 2 === 0 ? 'pink' : 'cyan', 'normal')}
              </div>
            ))}

            {/* Faculty Advisory Board divider header */}
            <div className="relative border-l-2 border-cyan-400 pl-4 py-1 select-none pt-4">
              <span className="font-mono text-[9px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest block">FACULTY_BOARD // MENTORS_&_ADVISORS</span>
              <h2 className="text-base font-bold uppercase text-gray-900 dark:text-white tracking-tight">Faculty Advisory Board</h2>
            </div>

            {/* Mobile Faculty Head */}
            <div className="relative">
              <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 w-[24px] min-[380px]:w-[32px] h-[2px] bg-cyan-400/50" />
              <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              {renderMemberCard(facultyHead, 'cyan', 'large')}
            </div>

            {/* Mobile Faculty Members row representation */}
            {facultyMembers.map((member, index) => (
              <div className="relative" key={member.name}>
                <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 w-[24px] min-[380px]:w-[32px] h-[2px] bg-cyan-400/30" />
                <div className="absolute left-[-24px] min-[380px]:left-[-32px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {renderMemberCard(member, index % 2 === 0 ? 'pink' : 'cyan', 'normal')}
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}
