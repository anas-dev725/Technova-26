import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Globe, Sparkles, User, Award, Shield, Star, Crown } from 'lucide-react';
import { anasProfileBase64 } from '../assets/anasProfileBase64';
import { talhaAhmedBase64 } from '../assets/talhaAhmedBase64';
import hamnaPfp from '../assets/hamna pfp.jpeg';
import moizPfp from '../assets/moiz pfp.jpeg';
import ashirPfp from '../assets/ashir pfp.jpeg';

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
  // Row 1: Chairperson & Vice Chairperson
  const row1: TeamMember[] = [
    {
      name: 'Hamna Saleem',
      role: 'Chairperson',
      dept: 'Data Analyst & IEEE IoBM Lead',
      img: hamnaPfp,
      linkedin: 'https://www.linkedin.com/in/hamna-saleem-659a5b223/',
      mail: 'hamnasaleem23@gmail.com'
    },
    {
      name: 'Muhammad Anas',
      role: 'Vice Chairperson',
      dept: 'AI Automation & Systems Architect',
      img: anasProfileBase64,
      github: 'https://github.com/anas-dev725',
      linkedin: 'https://www.linkedin.com/in/muhammad-anas804/',
      website: 'https://muhammad-anas-ai-engineer.vercel.app/'
    }
  ];

  // Row 2: General Secretary, Director Finance & Director Technology
  const row2: TeamMember[] = [
    {
      name: 'Moiz Ali Siddiqui',
      role: 'General Secretary',
      dept: 'Full Stack Integration & Strategy',
      img: moizPfp,
      linkedin: 'https://linkedin.com/in/moizalisiddiqui'
    },
    {
      name: 'Aashir Ali',
      role: 'Director Finance',
      dept: 'Budgeting & Asset Portfolio',
      img: ashirPfp,
      linkedin: 'https://www.linkedin.com/in/aashir-ali-6aa2b233a/'
    },
    {
      name: 'Talha Ahmed',
      role: 'Director Technology',
      dept: 'AI Development & System Architect',
      img: talhaAhmedBase64,
      github: 'https://github.com/Talhaahmad9',
      linkedin: 'Https://linkedin.com/in/talha-ahmad9'
    }
  ];

  // Row 3: Same pattern of 3 leads (Director Logistics, Director Marketing, Director Operations)
  const row3: TeamMember[] = [
    {
      name: 'Syed Bilal',
      role: 'Director Logistics',
      dept: 'Inventory & Resource Optimization',
      initials: 'SB',
      gradient: 'from-amber-500 to-orange-600',
      linkedin: 'https://www.linkedin.com/'
    },
    {
      name: 'Aisha Khan',
      role: 'Director Marketing',
      dept: 'Public Campaigning & Relations',
      initials: 'AK',
      gradient: 'from-pink-500 to-rose-600',
      linkedin: 'https://www.linkedin.com/'
    },
    {
      name: 'Zainab Fatima',
      role: 'Director Operations',
      dept: 'Crowd Coordination & Ground Flow',
      initials: 'ZF',
      gradient: 'from-emerald-500 to-teal-600',
      linkedin: 'https://www.linkedin.com/'
    }
  ];

  // Row 4: Same pattern of 2 leads (Director Creative, Director Public Relations)
  const row4: TeamMember[] = [
    {
      name: 'Mustafa Kamal',
      role: 'Director Creative',
      dept: 'Motion Art & Brand Production',
      initials: 'MK',
      gradient: 'from-purple-500 to-indigo-600',
      linkedin: 'https://www.linkedin.com/'
    },
    {
      name: 'Eshal Noor',
      role: 'Director Public Relations',
      dept: 'Outreach & Media Communication',
      initials: 'EN',
      gradient: 'from-cyan-500 to-blue-600',
      linkedin: 'https://www.linkedin.com/'
    }
  ];

  const renderMemberCard = (member: TeamMember, size: 'large' | 'normal' = 'normal') => {
    return (
      <motion.div
        key={member.name}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="relative group rounded-[2rem] overflow-hidden bg-gray-950 shadow-2xl shrink-0 aspect-[4/5] border border-white/5 hover:border-blue-500/30 transition-all duration-300"
        style={{ width: size === 'large' ? '300px' : '270px' }}
      >
        {member.img ? (
          <img 
            src={member.img} 
            alt={member.name} 
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${member.gradient || 'from-blue-600 to-indigo-600'} flex items-center justify-center relative overflow-hidden`}>
            {/* Geometric tech grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:16px_16px]" />
            <span className="text-7xl font-display font-black text-white/10 tracking-tighter select-none">
              {member.initials}
            </span>
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
            <div className="z-10 bg-white/10 dark:bg-black/25 w-24 h-24 rounded-2xl flex flex-col items-center justify-center border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
              <span className="text-3xl font-display font-black text-white tracking-widest uppercase">
                {member.initials}
              </span>
              <span className="text-[8px] font-mono text-white/60 tracking-widest uppercase mt-1">LEAD</span>
            </div>
          </div>
        )}

        {/* Leader Indicator Overlay badge */}
        {size === 'large' && (
          <div className="absolute top-4 right-4 pointer-events-none z-25">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 text-white text-[8px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
              <Crown className="w-2.5 h-2.5 text-yellow-400" />
              EXECUTIVE LEAD
            </span>
          </div>
        )}

        {/* Info Layout overlaid on backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 flex flex-col justify-end text-left z-20">
          <div className="transform transition-transform duration-500 ease-out -translate-y-8 group-hover:-translate-y-12">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-2">
              {member.role}
            </span>
            <h3 className="font-display font-black text-white tracking-tight text-lg sm:text-xl group-hover:text-blue-400 transition-colors duration-300">
              {member.name}
            </h3>
            <p className="text-[11px] text-gray-300 font-medium mt-0.5 leading-tight">
              {member.dept}
            </p>
          </div>

          {/* Social connections beautiful animation overlay */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 transition-all duration-500 ease-out opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
            {member.linkedin && (
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#0077b5] border border-white/10 hover:scale-110 transition-all duration-250 backdrop-blur-sm"
                aria-label={`${member.name} LinkedIn Profile`}
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {member.github && (
              <a 
                href={member.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#24292e] border border-white/10 hover:scale-110 transition-all duration-250 backdrop-blur-sm"
                aria-label={`${member.name} GitHub Repository`}
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {member.website && (
              <a 
                href={member.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 border border-white/10 hover:scale-110 transition-all duration-250 backdrop-blur-sm"
                aria-label={`${member.name} Personal Page`}
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
            {member.mail && (
              <a 
                href={`mailto:${member.mail}`} 
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-rose-500 border border-white/10 hover:scale-110 transition-all duration-250 backdrop-blur-sm"
                aria-label={`Mail ${member.name}`}
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            )}
            <span className="ml-2 text-[8px] font-mono text-gray-500 select-none">
              TN // '26
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="pt-32 sm:pt-40 pb-24 relative overflow-hidden bg-[#fafafa] dark:bg-[#050505] transition-colors duration-300 text-center">
      {/* Decorative Grid and Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_80%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/[0.03] dark:bg-blue-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Page Title Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            Executive Committee 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-black tracking-tight text-gray-900 dark:text-white"
          >
            Meet Our <span className="text-blue-500">ExCom Team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base font-medium"
          >
            The dedicated minds, developers, and visionaries leading the charge to curate a premier national technical experience at TechNova '26.
          </motion.p>
        </div>

        {/* Structured Rows Layout as requested by user */}
        <div className="space-y-24">
          
          {/* Row 1: 2 leads (Chairperson & Vice Chairperson) */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-black uppercase text-blue-500 tracking-[0.25em]">
              <Crown className="w-3.5 h-3.5 text-blue-500" />
              Presidency Leads
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {row1.map((member) => renderMemberCard(member, 'large'))}
            </div>
          </div>

          {/* Row 2: 3 leads (General Secretary, Director Finance & Director Technology) */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-black uppercase text-blue-500 tracking-[0.25em]">
              <Award className="w-3.5 h-3.5 text-blue-500" />
              Executive Secretariat
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-10">
              {row2.map((member) => renderMemberCard(member, 'normal'))}
            </div>
          </div>

          {/* Row 3: same pattern of 3 leads (Director Logistics, Director Marketing, Director Operations) */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-black uppercase text-blue-500 tracking-[0.25em]">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              Operations Board Leads
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-10">
              {row3.map((member) => renderMemberCard(member, 'normal'))}
            </div>
          </div>

          {/* Row 4: same pattern of 2 leads (Director Creative, Director Public Relations) */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-black uppercase text-blue-500 tracking-[0.25em]">
              <Star className="w-3.5 h-3.5 text-blue-500" />
              Outreach & Media Leads
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {row4.map((member) => renderMemberCard(member, 'large'))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
