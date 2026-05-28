import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Zap, Handshake, Code, Shield, Globe, Clock, Trophy, Award, Sparkles } from 'lucide-react';

interface TimelineEvent {
  time: string;
  title: string;
  desc: string;
  icon: any;
}

export default function Timeline() {
  const [activeDay, setActiveDay] = useState(0);

  const daysInfo = [
    { day: "Day 1", date: "Nov 14, 2026", theme: "Inception & Onboarding" },
    { day: "Day 2", date: "Nov 15, 2026", theme: "The Grind & Mentorship" },
    { day: "Day 3", date: "Nov 16, 2026", theme: "The Climax & Awards" }
  ];

  const timelineData: TimelineEvent[][] = [
    // Day 1
    [
      { time: "09:00 AM - 10:30 AM", title: "Registrations & Checking In", desc: "Teams report to the central lobby to receive status badges, dynamic kits, and desk configurations.", icon: Users },
      { time: "11:00 AM - 12:30 PM", title: "Grand Opening Ceremony", desc: "Keynote speeches from institutional leads, module regulations breakdown, and official arena kickoff.", icon: Zap },
      { time: "01:00 PM - 02:00 PM", title: "Networking Lunch Session", desc: "Interact with sponsors, sync with mentors, and enjoy a curated high-energy feast.", icon: Handshake },
      { time: "02:30 PM", title: "Hacking Portal Commences", desc: "The countdown clocks launch! Teams officially initiate speed trials, custom programming, or gaming matches.", icon: Code }
    ],
    // Day 2
    [
      { time: "10:00 AM - 12:00 PM", title: "Mentorship & Guidance Sprint", desc: "Expert leaders visit workspaces, evaluating logic flows and giving critical performance feedback.", icon: Shield },
      { time: "01:30 PM - 02:30 PM", title: "Mid-day Tech Talks", desc: "Lightning tutorials focusing on seamless client workflows and server microservices.", icon: Globe },
      { time: "05:00 PM", title: "Milestone Code Submission", desc: "Checkpoint validation portal opens. Submitting intermediate builds to secure current ranking.", icon: Calendar },
      { time: "08:00 PM", title: "Recharge & Networking", desc: "Unplug with quick gaming cycles, fresh beverages, and relaxing music loops.", icon: Zap }
    ],
    // Day 3
    [
      { time: "11:00 AM", title: "Submissions Frozen", desc: "Code, websites, and custom graphic creations must be committed. Systems frozen for assessment.", icon: Clock },
      { time: "12:00 PM - 03:00 PM", title: "Main Arena Pitch Demos", desc: "Teams execute crisp, working presentations of their entries to a panel of expert judges.", icon: Trophy },
      { time: "04:30 PM - 06:00 PM", title: "Award Ceremony & Closing Speech", desc: "Crowning the victors, distributing tech prize pools, and final speech by IEEE leadership.", icon: Award }
    ]
  ];

  return (
    <div className="pt-32 sm:pt-40 pb-24 relative overflow-hidden bg-[#fafafa] dark:bg-[#050505] transition-colors duration-300">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_80%,transparent_100%)]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-500/[0.03] dark:bg-blue-500/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Arena Schedule
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-display font-black tracking-tight text-gray-900 dark:text-white"
          >
            Event <span className="text-blue-500">Timeline</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base font-medium"
          >
            Sync with the hackathon flow, project reviews, and elite panel feedback across three days of intense creation.
          </motion.p>
        </div>

        {/* Dynamic switcher tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1.5 rounded-3xl bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/10">
            {daysInfo.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`flex flex-col items-center px-6 py-3.5 sm:px-10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeDay === idx
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span>{day.day}</span>
                <span className={`text-[9px] font-mono mt-0.5 opacity-80 ${activeDay === idx ? "text-blue-100" : "text-gray-400"}`}>
                  {day.date}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content list block */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#080808] rounded-3xl p-6 sm:p-12 border border-gray-200/50 dark:border-white/5 shadow-xl">
          <div className="text-center mb-12 pb-6 border-b border-gray-100 dark:border-white/5">
            <span className="text-xs font-black text-blue-500 tracking-[0.25em] uppercase block mb-2">
              {daysInfo[activeDay].date}
            </span>
            <h2 className="text-2xl font-display font-medium text-gray-900 dark:text-white">
              {daysInfo[activeDay].theme}
            </h2>
          </div>

          <div className="relative border-l-2 border-gray-200 dark:border-white/10 pl-6 sm:pl-10 ml-2 sm:ml-6 space-y-12">
            <AnimatePresence mode="wait">
              {timelineData[activeDay].map((event, eventIdx) => {
                const Icon = event.icon;
                return (
                  <motion.div
                    key={`${activeDay}-${eventIdx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: eventIdx * 0.08, duration: 0.3 }}
                    className="relative"
                  >
                    {/* Floating circular icon marker */}
                    <div className="absolute -left-[39px] sm:-left-[55px] top-1.5 w-8 h-8 rounded-full bg-white dark:bg-black border-2 border-blue-500 flex items-center justify-center text-blue-500 shadow-md z-10 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="bg-gray-50/50 dark:bg-white/[0.01] hover:bg-gray-50 dark:hover:bg-white/[0.02] p-6 rounded-2xl border border-gray-250/30 dark:border-white/5 transition-all duration-300 shadow-sm hover:shadow-md">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-2">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                        {event.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                        {event.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
