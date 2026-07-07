import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Users, Zap, Clock, Trophy, Award, Sparkles, Filter, Grid, List, Star, Info, 
  Search, HelpCircle, Gamepad2, BrainCircuit, Rocket, Layout, Shield, Code, Palette, MapPin
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  time: string;
  startHour: number; // e.g. 9.0 for 09:00 AM
  duration: number;  // duration in hours
  title: string;
  desc: string;
  track: 'General' | 'Tech' | 'Design' | 'AI' | 'Innovation' | 'Gaming';
  location: string;
  icon: any;
  capacity?: string;
  durationLabel?: string;
}

export default function Timeline() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid'); // grid = Gantt Timetable Plot, feed = Sequential List
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pinnedEvents, setPinnedEvents] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const daysInfo = {
    day1: { day: "Morning", date: "Saturday, 1st August, 2026", theme: "Morning Sessions" },
    day2: { day: "Afternoon", date: "Saturday, 1st August, 2026", theme: "Afternoon & Closing Ceremony" }
  };

  const tracks = ['All', 'General', 'Tech', 'Design', 'AI', 'Innovation', 'Gaming'];

  // All 16 precise real modules mapped beautifully with user-friendly descriptions and locations set to TBD
  const timelineData: Record<'day1' | 'day2', TimelineEvent[]> = {
    day1: [
      { 
        id: 'd1-reg', 
        time: "09:00 AM - 10:00 AM", 
        startHour: 9.0,
        duration: 1.0,
        title: "Registration & Badge Collection", 
        desc: "Arrive at the campus, confirm your registration details, and collect your official TechNova event badges and student guide kit.", 
        track: "General", 
        location: "TBD", 
        icon: Users,
        capacity: "All registered students",
        durationLabel: "1 Hour"
      },
      { 
        id: 'd1-agentic-ai', 
        time: "10:00 AM - 12:30 PM", 
        startHour: 10.0,
        duration: 2.5,
        title: "Agentic AI Arena", 
        desc: "Program self-governing multi-agent workflows to play custom games and complete data mapping objectives.", 
        track: "AI", 
        location: "TBD", 
        icon: BrainCircuit,
        capacity: "Teams (2 - 3 members)",
        durationLabel: "2.5 Hours"
      },
      { 
        id: 'd1-ctf', 
        time: "10:00 AM - 12:30 PM", 
        startHour: 10.0,
        duration: 2.5,
        title: "Capture The Flag (CTF)", 
        desc: "Join a fast cybersecurity sandbox. Decrypt keys, probe web sockets, and resolve server defense tasks with your team.", 
        track: "Tech", 
        location: "TBD", 
        icon: Shield,
        capacity: "Teams (2 - 3 members)",
        durationLabel: "2.5 Hours"
      },
      { 
        id: 'd1-fyp', 
        time: "10:00 AM - 03:00 PM", 
        startHour: 10.0,
        duration: 5.0,
        title: "FYP Warriors", 
        desc: "Pitch your design projects and software prototypes in front of top local engineering recruiters and incubators.", 
        track: "Innovation", 
        location: "TBD", 
        icon: Award,
        capacity: "Squad teams (3 - 4)",
        durationLabel: "5 Hours"
      },
      { 
        id: 'd1-lunch', 
        time: "12:30 PM - 02:00 PM", 
        startHour: 12.5,
        duration: 1.5,
        title: "Lunch & Social Hour", 
        desc: "Take a healthy break to enjoy hot meals, catch up with cohort peers, and share your module experiences.", 
        track: "General", 
        location: "TBD", 
        icon: CoffeeIcon,
        durationLabel: "1.5 Hours"
      },
      { 
        id: 'd1-prompt-eng', 
        time: "02:00 PM - 05:00 PM", 
        startHour: 14.0,
        duration: 3.0,
        title: "Prompt Engineering", 
        desc: "Coax generative models to build code, fix subtle bugs, and assemble creative layouts under complex constraint sheets.", 
        track: "AI", 
        location: "TBD", 
        icon: BrainCircuit,
        capacity: "Solo (1)",
        durationLabel: "3 Hours"
      },
      { 
        id: 'd1-maths-mania', 
        time: "02:00 PM - 05:00 PM", 
        startHour: 14.0,
        duration: 3.0,
        title: "Maths Mania (Junior)", 
        desc: "Put your logical reasoning to the test with fun brain teasers, analytical calculations, and quantitative questions.", 
        track: "Tech", 
        location: "TBD", 
        icon: BrainCircuit,
        capacity: "Teams (2 - 3 members)",
        durationLabel: "3 Hours"
      },
      { 
        id: 'd1-esports', 
        time: "02:00 PM - 05:00 PM", 
        startHour: 14.0,
        duration: 3.0,
        title: "Esports Arena (PUBG Mobile)", 
        desc: "Claim structural zone victories! Squad up for custom rooms, or watch real-time spectator screens with live casting.", 
        track: "Gaming", 
        location: "TBD", 
        icon: Gamepad2,
        capacity: "Squad members (3 - 4)",
        durationLabel: "3 Hours"
      }
    ],
    day2: [
      { 
        id: 'd2-welcome', 
        time: "09:00 AM - 10:00 AM", 
        startHour: 9.0,
        duration: 1.0,
        title: "Registration Check-In", 
        desc: "Sign in for the afternoon block, grab a hot beverage, configure your systems, and take your designated seats.", 
        track: "General", 
        location: "TBD", 
        icon: Clock,
        durationLabel: "1 Hour"
      },
      { 
        id: 'd2-agentic-ai', 
        time: "10:00 AM - 12:30 PM", 
        startHour: 10.0,
        duration: 2.5,
        title: "Agentic AI Arena", 
        desc: "Program self-governing multi-agent workflows to play custom games and complete data mapping objectives.", 
        track: "AI", 
        location: "TBD", 
        icon: BrainCircuit,
        capacity: "Teams (2 - 3 members)",
        durationLabel: "2.5 Hours"
      },
      { 
        id: 'd2-maths-mania', 
        time: "10:00 AM - 02:00 PM", 
        startHour: 10.0,
        duration: 4.0,
        title: "Maths Mania (Advanced)", 
        desc: "Put your logical reasoning to the test with fun brain teasers, analytical calculations, and quantitative questions.", 
        track: "Tech", 
        location: "TBD", 
        icon: BrainCircuit,
        capacity: "Teams (2 - 3 members)",
        durationLabel: "4 Hours"
      },
      { 
        id: 'd2-datathon', 
        time: "10:00 AM - 02:00 PM", 
        startHour: 10.0,
        duration: 4.0,
        title: "Datathon", 
        desc: "Analyze dataset streams to identify key features, draft clear insights, and visualize details on a stunning UI dashboard.", 
        track: "Tech", 
        location: "TBD", 
        icon: Code,
        capacity: "Teams (2 - 3 members)",
        durationLabel: "4 Hours"
      },
      { 
        id: 'd2-startup', 
        time: "10:00 AM - 02:00 PM", 
        startHour: 10.0,
        duration: 4.0,
        title: "Startup Launchpad", 
        desc: "Propose high-potential venture solutions and draft interactive prototypes for scalable local consumer needs.", 
        track: "Innovation", 
        location: "TBD", 
        icon: Rocket,
        capacity: "Squad teams (3 - 4)",
        durationLabel: "4 Hours"
      },
      { 
        id: 'd2-esports', 
        time: "10:00 AM - 02:00 PM", 
        startHour: 10.0,
        duration: 4.0,
        title: "Esports Arena (PUBG Mobile)", 
        desc: "Claim structural zone victories! Squad up for custom rooms, or watch real-time spectator screens with live casting.", 
        track: "Gaming", 
        location: "TBD", 
        icon: Gamepad2,
        capacity: "Squad members (3 - 4)",
        durationLabel: "4 Hours"
      },
      { 
        id: 'd2-lunch', 
        time: "02:00 PM - 03:00 PM", 
        startHour: 14.0,
        duration: 1.0,
        title: "Lunch & Prayer Interval", 
        desc: "Unwind, complete your daily coordinates, or interact with recruiters at corporate booths.", 
        track: "General", 
        location: "TBD", 
        icon: CoffeeIcon,
        durationLabel: "1 Hour"
      },
      { 
        id: 'd2-awards', 
        time: "03:00 PM - 04:30 PM", 
        startHour: 15.0,
        duration: 1.5,
        title: "Awards Ceremony & Closing", 
        desc: "Celebrate victorious achievements, distribute participation certificates, and record beautiful photography blocks.", 
        track: "General", 
        location: "TBD", 
        icon: Trophy,
        durationLabel: "1.5 Hours"
      }
    ]
  };

  const filteredEvents = useMemo(() => {
    return timelineData[activeDay].filter(event => {
      const matchTrack = selectedTrack === 'All' || event.track === selectedTrack;
      const matchQuery = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.desc.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTrack && matchQuery;
    });
  }, [activeDay, selectedTrack, searchQuery]);

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedEvents(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const hourHeaders = [
    { label: "09:00 AM", hour: 9.0 },
    { label: "10:00 AM", hour: 10.0 },
    { label: "11:00 AM", hour: 11.0 },
    { label: "12:00 PM", hour: 12.0 },
    { label: "01:00 PM", hour: 13.0 },
    { label: "02:00 PM", hour: 14.0 },
    { label: "03:00 PM", hour: 15.0 },
    { label: "04:00 PM", hour: 16.0 },
    { label: "05:00 PM", hour: 17.0 }
  ];

  const getTrackColor = (track: string) => {
    switch (track) {
      case 'General': return { 
        border: 'border-emerald-500/25 hover:border-emerald-500/55 dark:border-emerald-500/15 dark:hover:border-emerald-400/40',
        bg: 'bg-emerald-50/60 dark:bg-emerald-950/10 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/20',
        text: 'text-emerald-800 dark:text-emerald-400',
        pillBg: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
        accentLine: 'bg-emerald-500'
      };
      case 'Tech': return { 
        border: 'border-blue-500/25 hover:border-blue-500/55 dark:border-blue-500/15 dark:hover:border-blue-400/40',
        bg: 'bg-blue-50/60 dark:bg-blue-950/10 hover:bg-blue-100/70 dark:hover:bg-blue-950/20',
        text: 'text-blue-800 dark:text-blue-400',
        pillBg: 'bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300',
        accentLine: 'bg-blue-600'
      };
      case 'Design': return { 
        border: 'border-pink-500/25 hover:border-pink-500/55 dark:border-pink-500/15 dark:hover:border-pink-400/40',
        bg: 'bg-pink-50/60 dark:bg-pink-950/10 hover:bg-pink-100/70 dark:hover:bg-pink-950/20',
        text: 'text-pink-800 dark:text-pink-400',
        pillBg: 'bg-pink-100 dark:bg-pink-500/10 text-pink-800 dark:text-pink-300',
        accentLine: 'bg-pink-500'
      };
      case 'AI': return { 
        border: 'border-indigo-500/25 hover:border-indigo-500/55 dark:border-indigo-500/15 dark:hover:border-indigo-400/40',
        bg: 'bg-indigo-50/60 dark:bg-indigo-950/10 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/20',
        text: 'text-indigo-800 dark:text-indigo-400',
        pillBg: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300',
        accentLine: 'bg-indigo-500'
      };
      case 'Innovation': return { 
        border: 'border-amber-500/25 hover:border-amber-500/55 dark:border-amber-500/15 dark:hover:border-amber-400/40',
        bg: 'bg-amber-50/60 dark:bg-amber-950/10 hover:bg-amber-100/70 dark:hover:bg-amber-950/20',
        text: 'text-amber-800 dark:text-amber-400',
        pillBg: 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300',
        accentLine: 'bg-amber-500'
      };
      case 'Gaming': return { 
        border: 'border-purple-500/25 hover:border-purple-500/55 dark:border-purple-500/15 dark:hover:border-purple-400/40',
        bg: 'bg-purple-50/60 dark:bg-purple-950/10 hover:bg-purple-100/70 dark:hover:bg-purple-950/20',
        text: 'text-purple-800 dark:text-purple-400',
        pillBg: 'bg-purple-100 dark:bg-purple-500/10 text-purple-800 dark:text-purple-300',
        accentLine: 'bg-purple-500'
      };
      default: return { 
        border: 'border-gray-500/25 hover:border-gray-500/55 dark:border-gray-500/15 dark:hover:border-gray-400/40',
        bg: 'bg-gray-50/60 dark:bg-gray-950/10 hover:bg-gray-100/70 dark:hover:bg-gray-950/20',
        text: 'text-gray-850 dark:text-gray-400',
        pillBg: 'bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-300',
        accentLine: 'bg-gray-500'
      };
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 relative overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-300">
      
      {/* Background visual accents */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_80%,transparent_100%)]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[320px] bg-gradient-to-b from-blue-500/5 to-transparent blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simple Page Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            1st August, 2026
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-gray-900 dark:text-white uppercase"
          >
            EVENT <span className="text-blue-600 dark:text-blue-500">ITINERARY</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-gray-650 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base font-semibold"
          >
            Here's the full schedule of our event! Find your modules, check their locations, and give it your absolute best!
          </motion.p>
        </div>

        {/* Filters and Search toolbar */}
        <div className="flex flex-col gap-6 mb-8 bg-gray-50/50 dark:bg-white/[0.02] p-4 sm:p-6 rounded-3xl border border-gray-200/50 dark:border-white/5">
          
          {/* Day Selection Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 w-full">
            {/* Left column spacer */}
            <div className="hidden sm:block" />
            
            {/* Center column with active day buttons */}
            <div className="flex justify-center w-full">
              <div className="inline-flex p-1 rounded-2xl bg-white dark:bg-white/5 border border-gray-250/30 dark:border-white/10 shadow-sm w-full sm:w-auto">
                 <button
                  onClick={() => setActiveDay('day1')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    activeDay === 'day1'
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Morning Sessions
                </button>
                <button
                  onClick={() => setActiveDay('day2')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    activeDay === 'day2'
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Afternoon & Closing
                </button>
              </div>
            </div>

            {/* Right column with view switches */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              {pinnedEvents.length > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-650 dark:text-amber-400 text-xs font-bold uppercase">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {pinnedEvents.length} Saved
                </div>
              )}
              
              <div className="inline-flex p-1 rounded-2xl bg-white dark:bg-white/5 border border-gray-250/30 dark:border-white/10 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === 'grid'
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  }`}
                  title="Timetable Gantt Grid"
                  aria-label="Timetable Grid"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('feed')}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === 'feed'
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  }`}
                  title="List Feed"
                  aria-label="Sequential List"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters & search */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-gray-100 dark:border-white/5">
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules, locations, or descriptions..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-[#0a0b12] border border-gray-250/50 dark:border-white/10 text-gray-850 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-8 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {tracks.map(track => (
                <button
                  key={track}
                  onClick={() => setSelectedTrack(track)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    selectedTrack === track
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-white/[0.04] text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-white border border-gray-200/50 dark:border-white/5"
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current day selection title label */}
        <div className="mb-6 flex flex-col items-center justify-center text-center gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white tracking-tight">
              {daysInfo[activeDay].theme}
            </h2>
          </div>
          <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
            Showing {filteredEvents.length} of {timelineData[activeDay].length} modules listed
          </p>
        </div>

        {/* TIMELINE VIEW DISPATCHER */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            /* ================= VIEW 1: PREMIUM INTERACTIVE TIMETABLE GANTT PLOT ================= */
            <motion.div
              key="timeline-gantt-grid"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="bg-gray-50/50 dark:bg-[#07080e] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-xl"
            >
              {/* Scroll Help indicator */}
              <div className="p-3 bg-blue-500/10 border-b border-blue-500/10 text-center text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Swipe left/right or tap any block on mobile to inspect room assignments & requirements.</span>
              </div>

              {/* Horizontally scrollable sandbox */}
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/[0.2] relative">
                <div className="min-w-[1050px] p-6 lg:p-8 relative">
                  
                  {/* Absolute positioning container for background vertical dotted grid lines */}
                  <div className="absolute left-6 lg:left-8 right-6 lg:right-8 top-16 bottom-16 pointer-events-none z-0">
                    {hourHeaders.map((header, index) => {
                      const pct = (index / 8) * 100;
                      return (
                        <div 
                          key={index} 
                          style={{ left: `${pct}%` }} 
                          className="absolute top-0 bottom-0 w-0 border-l border-dashed border-gray-250 dark:border-white/5 -translate-x-1/2"
                        />
                      );
                    })}
                  </div>

                  {/* Absolute Time Grids Column markings */}
                  <div className="relative h-10 border-b border-gray-200 dark:border-white/5 mb-6 z-10">
                    {hourHeaders.map((header, index) => {
                      const pct = (index / 8) * 100;
                      return (
                        <div 
                          key={index} 
                          style={{ left: `${pct}%` }} 
                          className="absolute -translate-x-1/2 font-mono text-xs text-gray-400 dark:text-gray-400/80 font-black text-center"
                        >
                          {header.label}
                        </div>
                      );
                    })}
                  </div>

                  {/* Absolute positioning container for rows */}
                  <div className="space-y-4 pt-1 pb-4 relative z-20 min-h-[400px]">
                    {filteredEvents.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center text-center">
                        <HelpCircle className="w-12 h-12 text-gray-400 mb-3" />
                        <h4 className="text-base font-bold text-gray-800 dark:text-white">No schedules match those filters</h4>
                        <p className="text-xs text-gray-500 mt-1">Try selecting another Domain or changing your search terms.</p>
                      </div>
                    ) : (
                      filteredEvents.map((event, idx) => {
                        const style = getTrackColor(event.track);
                        const isPinned = pinnedEvents.includes(event.id);
                        const EventIcon = event.icon;

                        // Linear math conversion to percentage offsets spanning 8 hour duration (from 9:00 AM to 5:00 PM)
                        const startPct = ((event.startHour - 9.0) / 8.0) * 100;
                        const durationPct = (event.duration / 8.0) * 100;

                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-4% 0px" }}
                            transition={{ type: "spring", stiffness: 120, damping: 18, delay: idx * 0.02 }}
                            className="w-full relative py-1.5 min-h-[75px]"
                          >
                            
                            {/* Gantt block element placement with absolute offsets */}
                            <motion.div
                              whileHover={{ y: -2, scale: 1.01 }}
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              onClick={() => setSelectedEvent(event)}
                              style={{ 
                                marginLeft: `${Math.max(0, startPct)}%`,
                                width: `${Math.min(100 - startPct, durationPct)}%` 
                              }}
                              className={`p-3 sm:p-4 rounded-2xl border cursor-pointer relative transition-all shadow-sm ${style.bg} ${style.border} ${
                                isPinned ? 'ring-1 ring-amber-400/35 border-amber-400/50' : ''
                              }`}
                            >
                              
                              {/* Glowing accent border pin line */}
                              <div className={`absolute top-0 bottom-0 left-0 w-1 ${style.accentLine} rounded-l-2xl`} />

                              <div className="flex flex-col h-full justify-between gap-1.5 pl-1.5">
                                
                                {/* Timeline Metadata */}
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase ${style.text}`}>
                                    <Clock className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                                    {event.time.split(" - ")[0]}
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 border border-gray-250/30 dark:border-white/5">
                                      {event.track}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        togglePin(event.id, e);
                                      }}
                                      className="p-0.5 rounded-md text-gray-400 hover:text-amber-500 transition-colors"
                                      title="Pin slot"
                                    >
                                      <Star className={`w-3.5 h-3.5 ${isPinned ? "fill-amber-500 text-amber-500" : "text-gray-400"}`} />
                                    </button>
                                  </div>
                                </div>

                                {/* Title with simple clean typography */}
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <EventIcon className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {event.title}
                                  </h4>
                                </div>

                                {/* Simplified Friendly Room Locations */}
                                <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 dark:text-gray-450">
                                  <div className="flex items-center gap-1 truncate max-w-[75%]">
                                    <MapPin className="w-3 h-3 text-rose-500" />
                                    <span className="truncate">{event.location.split("(")[0].trim()}</span>
                                  </div>
                                  <span className="text-[9px] font-mono font-bold">
                                    {event.durationLabel}
                                  </span>
                                </div>

                              </div>

                            </motion.div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>

                  {/* Horizontal timetable footer markings */}
                  <div className="mt-6 border-t border-gray-200 dark:border-white/5 pt-4 flex items-center justify-between text-xs text-gray-450 dark:text-gray-400 font-bold">
                    <span>9:00 AM — 5:00 PM Schedule Horizon</span>
                    <span>All Core Campus Modules Plotted</span>
                  </div>

                </div>
              </div>
            </motion.div>
          ) : (
            /* ================= VIEW 2: CHRONOLOGICAL MULTI-DOMAIN FEED LIST ================= */
            <motion.div
              key="timeline-sequential-feed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="relative max-w-5xl mx-auto py-8"
            >
              {filteredEvents.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-white/[0.01] rounded-3xl border border-gray-200/50 dark:border-white/5">
                  <HelpCircle className="w-12 h-12 text-gray-400 mb-3" />
                  <h4 className="text-base font-bold text-gray-850 dark:text-white">No schedules match those filters</h4>
                  <p className="text-xs text-gray-500 mt-1">Try resetting the domain filters or typing another room name.</p>
                </div>
              ) : (
                <>
                  {/* Central Timeline Spine Line */}
                  <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[2px] bg-gray-200 dark:bg-white/10 -translate-x-1/2 pointer-events-none z-0" />

                  <div className="space-y-12 relative z-10">
                    {filteredEvents.map((event, idx) => {
                      const style = getTrackColor(event.track);
                      const isPinned = pinnedEvents.includes(event.id);
                      const EventIcon = event.icon;
                      const isLeft = idx % 2 === 0;

                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-12% 0px" }}
                          transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.05 }}
                          onClick={() => setSelectedEvent(event)}
                          className="relative group cursor-pointer"
                        >
                          {/* Timeline Node Ring in the Center with Pulses */}
                          <div className={`absolute left-6 md:left-1/2 top-8 md:top-1/2 w-4 h-4 rounded-full border-4 border-blue-600 bg-white dark:bg-[#07080e] -translate-x-1/2 -translate-y-1/2 z-20 group-hover:scale-125 transition-transform duration-300 shadow-md ${isPinned ? 'border-amber-400' : ''}`} />

                          {/* Alternating Grid System */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pl-12 md:pl-0">
                            
                            {/* Left Side Col (Even Index Card, Spacer for Odd) */}
                            <div className={`${isLeft ? 'block' : 'hidden md:block md:opacity-0 md:pointer-events-none'}`}>
                              {isLeft && (
                                <div className="space-y-3 md:text-right md:pr-4">
                                  {/* Timestamp info sitting elegantly above the card on left alignment */}
                                  <div className="flex items-center justify-start md:justify-end gap-2 font-mono text-[11px] font-black text-blue-600 dark:text-blue-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{event.time}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500">{event.durationLabel}</span>
                                  </div>

                                  {/* Beautifully simple list card */}
                                  <div className="bg-white dark:bg-[#07080e] border border-gray-200 dark:border-white/5 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden text-left md:hover:-translate-x-1">
                                    {/* Accent border string */}
                                    <div className={`absolute top-0 bottom-0 left-0 md:left-auto md:right-0 w-1 ${style.accentLine}`} />

                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${style.bg} border text-gray-800 dark:text-white`}>
                                          <EventIcon className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                            {event.title}
                                          </h3>
                                          <div className="flex flex-wrap gap-1.5 mt-1">
                                            <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                                              {event.track}
                                            </span>
                                            {event.capacity && (
                                              <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase bg-blue-50 dark:bg-blue-950/15 text-blue-600 dark:text-blue-300">
                                                {event.capacity.split(" ")[0]} Team
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            togglePin(event.id, e);
                                          }}
                                          className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-amber-500 transition-colors"
                                        >
                                          <Star className={`w-4 h-4 ${isPinned ? "fill-amber-500 text-amber-500" : "text-gray-400"}`} />
                                        </button>
                                      </div>
                                    </div>

                                    <p className="mt-4 text-sm text-gray-650 dark:text-gray-400 leading-relaxed font-semibold">
                                      {event.desc}
                                    </p>

                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                      <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                        <span className="text-gray-850 dark:text-gray-200">{event.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Side Col (Odd Index Card, Spacer for Even) */}
                            <div className={`${!isLeft ? 'block' : 'hidden md:block md:opacity-0 md:pointer-events-none'}`}>
                              {!isLeft && (
                                <div className="space-y-3 md:text-left md:pl-4">
                                  {/* Timestamp info sitting elegantly above the card on right alignment */}
                                  <div className="flex items-center justify-start gap-2 font-mono text-[11px] font-black text-blue-600 dark:text-blue-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{event.time}</span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500">{event.durationLabel}</span>
                                  </div>

                                  {/* Beautifully simple list card */}
                                  <div className="bg-white dark:bg-[#07080e] border border-gray-200 dark:border-white/5 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden text-left md:hover:translate-x-1">
                                    {/* Accent border string */}
                                    <div className={`absolute top-0 bottom-0 left-0 w-1 ${style.accentLine}`} />

                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${style.bg} border text-gray-800 dark:text-white`}>
                                          <EventIcon className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                            {event.title}
                                          </h3>
                                          <div className="flex flex-wrap gap-1.5 mt-1">
                                            <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                                              {event.track}
                                            </span>
                                            {event.capacity && (
                                              <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase bg-blue-50 dark:bg-blue-950/15 text-blue-600 dark:text-blue-300">
                                                {event.capacity.split(" ")[0]} Team
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            togglePin(event.id, e);
                                          }}
                                          className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-amber-500 transition-colors"
                                        >
                                          <Star className={`w-4 h-4 ${isPinned ? "fill-amber-500 text-amber-500" : "text-gray-400"}`} />
                                        </button>
                                      </div>
                                    </div>

                                    <p className="mt-4 text-sm text-gray-650 dark:text-gray-400 leading-relaxed font-semibold">
                                      {event.desc}
                                    </p>

                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                      <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                        <span className="text-gray-850 dark:text-gray-200">{event.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= USER-FRIENDLY POPUP SPEC-SHEET DETAILS INTERACTION ================= */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#07080f] border border-gray-200 dark:border-white/10 rounded-[2rem] max-w-md w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl scrollbar-none"
              >
                {/* Decorative overlay blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Subheader tracking */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border ${getTrackColor(selectedEvent.track).pillBg}`}>
                    {selectedEvent.track} Track
                  </span>
                  
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1 px-2.5 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold rounded-xl bg-gray-50 dark:bg-white/5 transition-colors border border-gray-200 dark:border-white/15"
                  >
                    Close
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                  {selectedEvent.title}
                </h3>

                {/* Time range */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/5 px-3.5 py-2 rounded-2xl mb-5 w-fit border border-blue-500/15">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{selectedEvent.time}</span>
                  {selectedEvent.durationLabel && (
                    <>
                      <span>•</span>
                      <span>{selectedEvent.durationLabel}</span>
                    </>
                  )}
                </div>

                {/* Friendly description */}
                <p className="text-gray-650 dark:text-gray-450 text-sm leading-relaxed font-semibold mb-6">
                  {selectedEvent.desc}
                </p>

                {/* Location panel with room details */}
                <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-150 dark:border-white/5 space-y-3">
                  <span className="text-[10px] font-bold text-gray-450 uppercase tracking-widest block">Where to attend:</span>
                  <div className="flex items-start gap-2.5 text-xs">
                    <MapPin className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">{selectedEvent.location.split("(")[0].trim()}</h5>
                      <span className="text-gray-550 block mt-0.5 font-semibold text-xs text-[#8a8ea8]">
                        {selectedEvent.location.includes("(") ? selectedEvent.location.substring(selectedEvent.location.indexOf("(") + 1, selectedEvent.location.length - 1) : "University Main Campus building"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Participation stats details */}
                <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-gray-150 dark:border-white/5">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Team Structure</span>
                    <span className="font-bold text-gray-750 dark:text-gray-200 mt-1 block">
                      {selectedEvent.capacity || "All squad/individual sizes"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Core Track Tag</span>
                    <span className="font-bold text-gray-750 dark:text-gray-200 mt-1 block">
                      {selectedEvent.track} Challenge Map
                    </span>
                  </div>
                </div>

                {/* Safe dismiss button */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full mt-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/10 transition-all active:scale-[0.99]"
                >
                  Clear & Return to Outline
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// Coffee icon static svg
function CoffeeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}
