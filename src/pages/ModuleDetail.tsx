import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Users, User, UsersRound, Trophy, 
  CreditCard, Clock, MapPin, CheckCircle2, 
  ShieldCheck, AlertCircle, Sparkles, Gamepad2,
  ArrowRight, ChevronDown
} from 'lucide-react';
import { modules, getFees, TeamMode } from '../data/modules';

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
  const Icon = module.icon;

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-white dark:bg-[#111] rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-8 md:p-12 shadow-2xl"
            >
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest">
                    {module.category}
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5" />
                    Winning Prize: {module.prize}
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center border border-blue-600/20">
                    <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                    {module.title}
                  </h1>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                  <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                    {module.longDescription}
                  </p>

                  {module.subGames && (
                    <div className="mt-16 space-y-10 not-prose">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-4xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Gamepad2 className="w-10 h-10 text-blue-600" />
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
                            className="p-8 rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 flex flex-col md:flex-row gap-8 items-start md:items-center shadow-sm hover:shadow-xl transition-all duration-500"
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
                  
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-blue-500" />
                      What to Expect
                    </h3>
                  <ul className="space-y-4 list-none p-0">
                    {[
                      'Innovative and collaborative environment',
                      'Networking with industry professionals',
                      'Official Technova\'26 Certificate of Participation',
                      'Exclusive event merchandise for top performers'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

                {/* Rules & Guidelines */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                    Module Guidelines
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Venue & Timing</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <MapPin className="w-5 h-5 text-blue-500" />
                          <span>TBD</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span>TBD</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Requirements</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                          <span>Valid University ID Card</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                          <span>Own laptop with required software</span>
                        </div>
                      </div>
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
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Registration Fee</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-bold text-gray-900 dark:text-white">Rs. {fees.toLocaleString()}</span>
                    <span className="text-gray-500">/ per {selectedMode === 'Individual' ? 'person' : 'team'}</span>
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
                        <p className="text-gray-900 dark:text-white font-bold">{selectedMode}</p>
                      </div>
                    </div>
                    {module.id === 'esports-competition' && (
                      <div className="relative">
                        <select
                          value={selectedMode}
                          onChange={(e) => setSelectedMode(e.target.value as TeamMode)}
                          className="appearance-none bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1 pr-8 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                        >
                          <option value="Individual">Solo</option>
                          <option value="Squad">Squad</option>
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                      </div>
                    )}
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

                {module.id !== 'esports-competition' && (
                  <Link
                    to={`/register/${module.id}`}
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

              {/* Payment Quick Info */}
              <div className="bg-blue-600/5 dark:bg-blue-600/10 rounded-3xl border border-blue-600/10 p-6 flex items-start gap-4">
                <CreditCard className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">Payment Method</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    We accept JazzCash, EasyPaisa, and Direct Bank Transfers. You will need to upload your payment receipt to complete registration.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
