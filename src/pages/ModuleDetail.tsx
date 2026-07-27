import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Users, User, UsersRound, Trophy, 
  CreditCard, Clock, MapPin, CheckCircle2, 
  ShieldCheck, AlertCircle, Sparkles, Gamepad2,
  ArrowRight, ChevronDown, Fingerprint, Terminal, Award, Linkedin, Ticket, Calendar,
  FileText, Download, ExternalLink, GraduationCap
} from 'lucide-react';
import { modules, getFees, isDiscountEligible, TeamMode } from '../data/modules';

const formatTextWithBold = (text: string) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-extrabold text-blue-600 dark:text-blue-400">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const getRulebookFilename = (id: string): string => {
  switch (id) {
    case 'fyp-warriors':
      return 'FYP_Warriors_Rule_Book.pdf';
    case 'startup-launchpad':
      return 'Startup_Launchpad_Rule_Book.pdf';
    case 'capture-the-flag':
      return 'Capture_The_Flag_Rule_Book.pdf';
    case 'agentic-ai-arena':
      return 'Agentic_AI_Rule_Book.pdf';
    case 'prompt-engineering':
      return 'Prompt_Engineering_Rule_Book.pdf';
    case 'datathon':
      return 'Datathon_Rule_Book.pdf';
    case 'maths-mania':
      return 'Maths_Mania_Rule_Book.pdf';
    case 'maths-mania-advanced':
      return 'Maths_Mania_Advanced_Rule_Book.pdf';
    default:
      return `${id}_Rule_Book.pdf`;
  }
};

const moduleSchedules: Record<string, { day: string; time: string; venue: string }> = {
  'fyp-warriors': {
    day: 'Saturday, 1st August, 2026',
    time: '10:00 AM - 03:00 PM',
    venue: 'Main Seminar Hall & Presentation Cubicles'
  },
  'startup-launchpad': {
    day: 'Saturday, 1st August, 2026',
    time: '10:00 AM - 02:00 PM',
    venue: 'Venture Incubation Arena'
  },
  'capture-the-flag': {
    day: 'Saturday, 1st August, 2026',
    time: '10:00 AM - 12:30 PM',
    venue: 'Cyber Security Lab (Block A)'
  },
  'agentic-ai-arena': {
    day: 'Saturday, 1st August, 2026',
    time: '10:00 AM - 12:30 PM',
    venue: 'AI Research Wing'
  },
  'datathon': {
    day: 'Saturday, 1st August, 2026',
    time: '10:00 AM - 02:00 PM',
    venue: 'Data Analytics Center'
  },
  'prompt-engineering': {
    day: 'Saturday, 1st August, 2026',
    time: '02:00 PM - 05:05 PM',
    venue: 'Computing Lab 3'
  },
  'maths-mania': {
    day: 'Saturday, 1st August, 2026',
    time: '10:00 AM - 02:00 PM',
    venue: 'Mathematics Examination Hall'
  },
  'maths-mania-advanced': {
    day: 'Saturday, 1st August, 2026',
    time: '02:00 PM - 05:00 PM',
    venue: 'Mathematics Examination Hall'
  }
};

export default function ModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const module = modules.find(m => m.id === moduleId);
  const [selectedMode, setSelectedMode] = useState<TeamMode>(module?.mode || 'Individual');

  useEffect(() => {
    if (module) {
      setSelectedMode(module.mode);
    }
  }, [module]);

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold dark:text-white">Module Not Found</h1>
          <Link to="/modules" className="text-blue-500 hover:underline mt-4 block">Back to Modules</Link>
        </div>
      </div>
    );
  }

  const fees = getFees(selectedMode, module.id);
  const isEligibleForDiscount = isDiscountEligible(module.id, module.title);
  const discountedFees = isEligibleForDiscount ? Math.floor(fees * 0.7) : fees;
  const Icon = module.icon;
  const schedule = moduleSchedules[module.id] || {
    day: 'Day 1 & Day 2',
    time: 'TBD (Will be Updated)',
    venue: 'TBD (Will be Shared Soon)'
  };
  const isExcludedModule = ['capture-the-flag', 'startup-launchpad', 'fyp-warriors'].includes(module.id);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate('/modules')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Modules
        </button>

        {module.isFilled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="text-lg font-black text-red-600 dark:text-red-400 uppercase tracking-wide">Registrations Closed</h4>
                <p className="text-sm font-semibold text-gray-650 dark:text-gray-300">
                  All available team slots for <strong className="font-bold">{module.title}</strong> have been completely filled up.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-white dark:bg-[#111] rounded-[2rem] sm:rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-5 sm:p-8 md:p-12 shadow-2xl"
            >
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest">
                    {module.category}
                  </div>
                  {module.targetAudience && (
                    <div className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md shadow-indigo-600/20">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {module.targetAudience}
                    </div>
                  )}
                  <div className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5" />
                    Winning Prize: {module.prize}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center border border-blue-600/20 shrink-0">
                    <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-gray-900 dark:text-white leading-tight">
                      {module.title}
                    </h1>
                    {module.challengeName && (
                      <p className="text-lg sm:text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                        Challenge: <span className="font-sans font-black italic">&ldquo;{module.challengeName}&rdquo;</span>
                      </p>
                    )}
                  </div>
                </div>

                {module.skills && (
                  <div className="flex flex-wrap items-center gap-2 mb-8 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2 flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-blue-500" /> Skills in Play:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {module.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-500/10 hover:bg-blue-600 hover:text-white transition-all cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl -m-4 blur-xl opacity-50 dark:opacity-100 pointer-events-none" />
                  
                  {/* Styled Description Container */}
                  <div className="relative bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200/60 dark:border-white/5 rounded-[2rem] p-6 sm:p-10 backdrop-blur-sm shadow-inner mt-4">
                    {/* Corner decorative borders for high-end aesthetic */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/40 dark:border-blue-500/30 rounded-tl-2xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/40 dark:border-blue-500/30 rounded-br-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-6">
                      {module.challengeName ? (
                        <Fingerprint className="w-5 h-5 text-blue-500 animate-pulse" />
                      ) : (
                        <Terminal className="w-5 h-5 text-blue-500" />
                      )}
                      <span className="text-[10px] font-mono font-black tracking-widest text-blue-500 dark:text-blue-400 uppercase">
                        {module.challengeName ? 'MISSION INTEL briefing' : 'MODULE DETAILED INTELLIGENCE'}
                      </span>
                    </div>

                    <div className="space-y-6">
                      {module.longDescription.split('\n').filter(p => p.trim() !== '').map((para, pIdx) => {
                        if (pIdx === 0) {
                          return (
                            <p key={pIdx} className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed font-sans border-l-4 border-blue-500 pl-4 py-1">
                              {formatTextWithBold(para)}
                            </p>
                          );
                        }
                        return (
                          <p key={pIdx} className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans font-medium">
                            {formatTextWithBold(para)}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {module.subGames && (
                  <div className="mt-16 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <Gamepad2 className="w-9 h-9 text-blue-600" />
                          Explore the Games
                        </h3>
                        <p className="text-gray-500 font-medium">Choose a title to showcase your skills and have some fun!</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {module.subGames.map((game) => (
                        <motion.div 
                          key={game.id} 
                          whileHover={{ y: -5 }}
                          className="p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                          <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-600/20">
                            <Gamepad2 className="w-10 h-10 text-blue-600" />
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <h4 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight uppercase">{game.title}</h4>
                              <div className="h-px flex-1 bg-gray-100 dark:bg-white/5 hidden sm:block" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">{game.description}</p>
                            
                            <div className="flex flex-wrap gap-4 pt-2">
                              <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/5 dark:bg-blue-600/10 rounded-xl border border-blue-600/10">
                                {game.mode === 'Individual' ? <User className="w-4 h-4 text-blue-600" /> : <UsersRound className="w-4 h-4 text-blue-600" />}
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{game.mode}</span>
                              </div>
                              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/10">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{game.prize} Prize Pool</span>
                              </div>
                              <Link 
                                to={`/register/${module.id}?game=${game.id}`}
                                className="ml-auto text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 group/link"
                              >
                                Register now
                                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-12 mb-12">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-950 dark:text-white">
                    <Sparkles className="w-6 h-6 text-blue-500" />
                    What to Expect
                  </h3>
                  <ul className="space-y-4 list-none p-0">
                    {[
                      'Official Technova\'26 Certificate of Participation to boost your professional portfolio',
                      'Hands-on exposure to current industry trends and emerging technology frameworks',
                      'Exceptional networking opportunities with tech leaders, developers, and researchers',
                      'Premium customized event merchandise and exclusive participant swag kits'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-650 dark:text-gray-400">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="font-semibold text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rules & Guidelines */}
                <div className="space-y-12">
                  {module.rulesList && (
                    <div className="bg-gray-50 dark:bg-[#0c0c0c] rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-gray-200/80 dark:border-white/5 space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 dark:border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-8 h-8 text-blue-500" />
                          <div>
                            <h3 className="text-2xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight">
                              Rule Book & Regulations
                            </h3>
                            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Protocol Code: TX-26 / {module.title.slice(0, 3).toUpperCase()}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-mono font-bold tracking-widest rounded-lg flex items-center gap-1.5 uppercase">
                          <AlertCircle className="w-3.5 h-3.5" /> Strictly Enforced
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {module.rulesList.map((rule, rIdx) => {
                          const isNegative = rule.toLowerCase().includes('no ') || 
                                             rule.toLowerCase().includes(' prohibited') || 
                                             rule.toLowerCase().includes('disqualification') || 
                                             rule.toLowerCase().includes('sabotage') || 
                                             rule.toLowerCase().includes('misconduct') ||
                                             rule.toLowerCase().includes('isolation');
                          return (
                            <motion.div 
                              key={rIdx} 
                              whileHover={{ x: 4 }}
                              className={`group relative flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 bg-white dark:bg-[#111] shadow-sm ${
                                isNegative 
                                  ? 'border-red-500/20 dark:border-red-500/10 hover:border-red-500/40 dark:hover:border-red-500/30' 
                                  : 'border-blue-500/20 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-blue-500/30'
                              }`}
                            >
                              <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${isNegative ? 'bg-red-500' : 'bg-blue-500'}`} />
                              
                              <div className="flex-shrink-0 mt-0.5">
                                <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded ${
                                  isNegative 
                                    ? 'bg-red-500/10 text-red-500' 
                                    : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                  REG-{(rIdx + 1).toString().padStart(2, '0')}
                                </span>
                              </div>

                              <div className="space-y-1 pr-2">
                                <p className="text-gray-800 dark:text-gray-200 font-bold text-sm leading-relaxed">
                                  {formatTextWithBold(rule)}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Rulebook Download/View Section */}
                  {module.id !== 'maths-mania-advanced' && (
                    <div className="bg-gray-50 dark:bg-[#0c0c0c] rounded-[2rem] border border-gray-200 dark:border-white/5 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
                              {module.id === 'maths-mania' ? 'Official Sample Paper' : 'Official Rulebook'}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                              {module.id === 'maths-mania' ? 'Sample Paper PDF' : 'Rules & Guidelines PDF'}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                          {module.id === 'maths-mania' 
                            ? 'Please download and practice the sample paper to understand the advanced difficulty and structure of the competition.'
                            : 'Please review the complete module instructions, code of conduct, and submission specifications before registering.'}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                        <a
                          href={`/rulebooks/${module.id === 'maths-mania' ? 'Mathsmania_Advance_Sample_Paper.pdf' : getRulebookFilename(module.id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-12 px-6 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-gray-200 dark:border-white/5 transition-all active:scale-[0.98] w-full sm:w-auto"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-500" />
                          View PDF
                        </a>
                        <a
                          href={`/rulebooks/${module.id === 'maths-mania' ? 'Mathsmania_Advance_Sample_Paper.pdf' : getRulebookFilename(module.id)}`}
                          download={module.id === 'maths-mania' ? 'Mathsmania_Advance_Sample_Paper.pdf' : getRulebookFilename(module.id)}
                          className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm shadow-blue-600/10 w-full sm:w-auto"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  )}

                  {module.heads && (
                    <div className="pt-4">
                      <div className="flex items-center gap-3 mb-6">
                        <Users className="w-8 h-8 text-blue-500" />
                        <div>
                          <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                            Module Organizing Team
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">Connect with the minds directing this module</p>
                        </div>
                      </div>

                      <div className={
                        module.id === 'fyp-warriors'
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      }>
                        {module.heads.map((head, index) => {
                          const isFyp = module.id === 'fyp-warriors';
                          return (
                            <motion.div 
                              key={index} 
                              whileHover={{ y: -4 }}
                              className={`${
                                isFyp ? 'p-5 rounded-2xl' : 'p-6 rounded-3xl'
                              } bg-gray-50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/5 flex flex-col justify-between hover:border-blue-500/30 transition-all cursor-default shadow-sm relative overflow-hidden`}
                            >
                              <div className={`absolute top-0 right-0 ${isFyp ? 'w-16 h-16' : 'w-24 h-24'} bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none`} />
                              
                              <div className="relative z-10 space-y-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-mono font-black uppercase tracking-[0.2em] rounded-lg">
                                  <Award className="w-3 h-3" /> Module Lead
                                </span>
                                <div>
                                  <h4 className={`${isFyp ? 'text-lg' : 'text-xl'} font-black text-gray-900 dark:text-white tracking-tight`}>{head.name}</h4>
                                  {head.designation && (
                                    <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 mt-1">{head.designation}</p>
                                  )}
                                </div>
                              </div>

                              <div className={`${isFyp ? 'mt-4 pt-3' : 'mt-6 pt-4'} border-t border-gray-200/50 dark:border-white/5 flex items-center justify-end relative z-10`}>
                                <a 
                                  href={head.linkedin || "https://linkedin.com"} 
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group/ln flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 hover:bg-blue-600 text-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110 shrink-0"
                                  title={`Connect with ${head.name}`}
                                >
                                  <Linkedin className="w-4 h-4" />
                                </a>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-white dark:bg-[#111] rounded-[2rem] border border-gray-200 dark:border-white/5 p-6 sm:p-8 space-y-6 shadow-xl">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-gray-200 dark:border-white/5">
                      <ShieldCheck className="w-6 h-6 text-blue-500 shrink-0" />
                      <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">Module Guidelines</h3>
                    </div>

                    <div className={`grid grid-cols-1 ${isExcludedModule ? 'md:grid-cols-2' : ''} gap-8 pt-2`}>
                      {/* Venue & Timing Column */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Venue & Timing</h4>
                        <div className={!isExcludedModule ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="font-semibold text-sm text-gray-750 dark:text-gray-300">{schedule.venue}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="font-semibold text-sm text-gray-750 dark:text-gray-300">{schedule.day}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center shrink-0">
                              <Clock className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="font-semibold text-sm text-gray-750 dark:text-gray-300">{schedule.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Requirements Column */}
                      {isExcludedModule && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Requirements</h4>
                          <div className="space-y-4">
                            {(module.id === 'startup-launchpad' || module.id === 'fyp-warriors' ? [
                              'Valid University ID Card',
                              'Own devices, standees, and socket extensions'
                            ] : module.id === 'esports-competition' ? [
                              'Valid University ID Card',
                              'Own mobile device with PUBG Mobile'
                            ] : [
                              'Valid University ID Card',
                              'Own laptop with required software'
                            ]).map((req, rIdx) => (
                              <div key={rIdx} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center shrink-0">
                                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                </div>
                                <span className="font-semibold text-sm text-gray-750 dark:text-gray-300">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
            </motion.div>
          </div>

          {/* Sidebar / Registration Action */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-28 space-y-6"
            >
              {/* Pricing Card */}
              <div className="bg-white dark:bg-[#111] rounded-[2rem] border border-gray-200 dark:border-white/5 p-8 shadow-xl">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Registration Fee</p>
                    {isEligibleForDiscount && (
                      <span className="px-2 py-0.5 text-[9px] font-black text-green-500 bg-green-500/10 border border-green-500/20 rounded-full uppercase tracking-wider">30% OFF</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-display font-bold text-blue-600 dark:text-blue-400">Rs. {(isEligibleForDiscount ? discountedFees : fees).toLocaleString()}</span>
                      {isEligibleForDiscount && (
                        <span className="text-sm font-semibold text-gray-400 line-through">Rs. {fees.toLocaleString()}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">/ per {selectedMode === 'Individual' ? 'person' : 'team'}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                        {selectedMode === 'Individual' ? <User className="w-5 h-5 text-blue-600" /> : selectedMode === 'Duo' ? <Users className="w-5 h-5 text-blue-600" /> : <UsersRound className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">Team Mode</p>
                        <p className="text-gray-900 dark:text-white font-bold">{selectedMode === 'Duo' ? '2-3 Team' : selectedMode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-600/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">Prize Pool</p>
                      <p className="text-gray-900 dark:text-white font-bold">{module.prize}</p>
                    </div>
                  </div>
                </div>

                {module.isFilled ? (
                  <button
                    disabled
                    className="w-full h-16 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-2xl font-bold flex flex-col items-center justify-center cursor-not-allowed opacity-80"
                  >
                    <span className="text-sm uppercase tracking-wider font-black">Slots Filled</span>
                    <span className="text-[10px] font-bold tracking-tight uppercase opacity-70">Registrations Closed</span>
                  </button>
                ) : (
                  <Link
                    to={`/register/${module.id}?mode=${selectedMode}`}
                    className="w-full h-16 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20"
                  >
                    Register Now
                  </Link>
                )}
                
                <p className="text-center mt-4 text-xs text-gray-500 font-medium flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure Registration Process
                </p>
              </div>

              {/* Early Bird Promo Info */}
              {isEligibleForDiscount && (
                <div className="bg-amber-500/10 dark:bg-amber-500/5 rounded-3xl border border-amber-500/20 p-6">
                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">Join Us Early!</h4>
                      <p className="text-xs text-amber-700 dark:text-gray-300 leading-relaxed font-semibold">
                        We are excited to welcome your team to Technova&apos;26. To help your squad get started, a <span className="font-bold text-amber-600 dark:text-amber-400">30% Early Bird Discount</span> is applied automatically during registration for a friendlier entry rate. This discount ends on <span className="underline font-black text-amber-600 dark:text-amber-400">26th July</span>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
