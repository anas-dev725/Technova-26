import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  ExternalLink,
  Shield,
  LogOut,
  ArrowUpDown,
  AlertCircle,
  Eye,
  FileText,
  Lock,
  User as UserIcon,
  EyeOff
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword } from 'firebase/auth';
import { submissionService, Submission } from '../services/submissionService';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Submission; direction: 'asc' | 'desc' } | null>(null);

  // Login Form State
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user?.email) {
        const adminStatus = await submissionService.checkIsAdmin(user.email);
        setIsAdmin(adminStatus);
        if (adminStatus) {
          loadSubmissions();
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadSubmissions = () => {
    return submissionService.subscribeToSubmissions((data) => {
      setSubmissions(data);
    });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      // Map the simple ID to an internal email format
      const email = adminId.includes('@') ? adminId : `${adminId}@technova.com`;
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setAuthError('Invalid Admin ID or Password. Please ensure you have created this account in Firebase Console.');
      } else {
        setAuthError('An error occurred during authentication. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: Submission['status']) => {
    try {
      await submissionService.updateStatus(id, status);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status });
      }
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  const filteredSubmissions = submissions
    .filter(sub => {
      const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
      const matchesSearch = 
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.members.some(m => m.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      const valA = a[key];
      const valB = b[key];
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50 dark:bg-[#050505] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-gray-200 dark:border-white/10 shadow-2xl"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
              <Shield className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-3 tracking-tight">Admin Portal</h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {!user 
                ? 'Enter your credentials to access the submission dashboard.' 
                : 'Your current account is not authorized for admin access.'
              }
            </p>
          </div>

          {!user ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Admin ID</label>
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="e.g. technova26"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-black/20 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition-all dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-14 py-4 bg-gray-50 dark:bg-black/20 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition-all dark:text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {authError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-red-500 leading-snug">{authError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
              >
                {isLoggingIn ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : 'Authorize Access'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
                <p className="text-gray-900 dark:text-white font-bold mb-1">{user.email}</p>
                <p className="text-sm text-red-500 font-medium">No administrative privileges assigned.</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-5 rounded-2xl border-2 border-gray-100 dark:border-white/10 text-gray-900 dark:text-white font-black hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-lg flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                <LogOut className="w-5 h-5" />
                Disconnect
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50 dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-blue-500 font-bold tracking-widest text-sm uppercase mb-3">
              <span className="w-8 h-[2px] bg-blue-500"></span>
              Control Panel
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-gray-900 dark:text-white tracking-tight">
              Submissions <span className="text-blue-500">Live</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/10 backdrop-blur-md">
            <div className="px-4">
              <div className="text-xs text-gray-500 font-medium uppercase">Admin User</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{user.email}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Submissions', value: stats.total, color: 'blue', icon: Users },
            { label: 'Pending Review', value: stats.pending, color: 'amber', icon: Clock },
            { label: 'Approved Teams', value: stats.approved, color: 'emerald', icon: CheckCircle2 },
            { label: 'Rejected Entries', value: stats.rejected, color: 'rose', icon: XCircle },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className={`p-8 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden relative group`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-bl-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-110`}></div>
              <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center mb-6 border border-${stat.color}-500/20`}>
                <stat.icon className={`w-7 h-7 text-${stat.color}-500`} />
              </div>
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-4 border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-10 border-b border-gray-100 dark:border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="relative w-full lg:max-w-md group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search by team, uni or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-8 py-5 bg-gray-50 dark:bg-black/20 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'approved', label: 'Approved' },
                  { id: 'rejected', label: 'Rejected' },
                ].map(status => (
                  <button
                    key={status.id}
                    onClick={() => setFilterStatus(status.id)}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                      filterStatus === status.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
              <button 
                className="px-6 py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold flex items-center gap-3 hover:scale-105 transition-transform"
                onClick={() => {
                  const csvContent = filteredSubmissions.map(s => 
                    `${s.email},${s.moduleTitle},${s.university},${s.status}`
                  ).join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'submissions.csv';
                  a.click();
                }}
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="px-10 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">Team Leader / Email</th>
                  <th className="px-10 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">Module</th>
                  <th className="px-10 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">University</th>
                  <th className="px-10 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-10 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-sm font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredSubmissions.map((sub, idx) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={sub.id} 
                      className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-10 py-8">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">{sub.members[0].fullName}</div>
                        <div className="text-gray-500 text-sm">{sub.email}</div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 font-bold text-sm">
                          {sub.moduleTitle}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="font-medium text-gray-700 dark:text-gray-300">{sub.university}</div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                          {sub.submittedAt?.toDate().toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-tight
                          ${sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                            sub.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 
                            'bg-amber-500/10 text-amber-500'}
                        `}>
                          <span className={`w-2 h-2 rounded-full animate-pulse
                            ${sub.status === 'approved' ? 'bg-emerald-500' : 
                              sub.status === 'rejected' ? 'bg-rose-500' : 
                              'bg-amber-500'}
                          `}></span>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 space-x-3">
                        <button 
                          onClick={() => setSelectedSubmission(sub)}
                          className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(sub.id!, 'approved')}
                          disabled={sub.status === 'approved'}
                          className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white disabled:opacity-30 transition-all"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(sub.id!, 'rejected')}
                          disabled={sub.status === 'rejected'}
                          className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-30 transition-all"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-10 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-gray-500">
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                          <Search className="w-10 h-10" />
                        </div>
                        <p className="text-xl font-bold">No submissions match your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-x-auto md:inset-y-10 md:w-full md:max-w-4xl left-1/2 -translate-x-1/2 bg-white dark:bg-[#0f0f0f] rounded-[3rem] z-[70] overflow-hidden border border-gray-200 dark:border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-8 md:p-12 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Registration Detail</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Ref ID: {selectedSubmission.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="p-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-500"
                >
                  <XCircle className="w-8 h-8" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 md:p-12 space-y-12">
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Module Details</h3>
                      <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5">
                        <div className="text-2xl font-black text-blue-500 mb-1">{selectedSubmission.moduleTitle}</div>
                        {selectedSubmission.subGameTitle && (
                          <div className="text-gray-900 dark:text-white font-bold text-lg mb-2">Game: {selectedSubmission.subGameTitle}</div>
                        )}
                        <div className="text-gray-500">Registered on {selectedSubmission.submittedAt?.toDate().toLocaleString()}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Primary Contact</h3>
                      <div className="space-y-2">
                        <div className="text-sm font-bold text-gray-500">Email Address</div>
                        <div className="text-xl font-bold dark:text-white group flex items-center gap-2">
                          {selectedSubmission.email}
                          <a href={`mailto:${selectedSubmission.email}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">University</h3>
                      <div className="text-xl font-bold dark:text-white">{selectedSubmission.university}</div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Payment Receipt</h3>
                      <div className="relative group rounded-3xl overflow-hidden border-2 border-gray-200 dark:border-white/10 aspect-[4/3] bg-black">
                        <img 
                          src={selectedSubmission.receiptBase64} 
                          alt="Receipt" 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = selectedSubmission.receiptBase64;
                              link.download = `receipt_${selectedSubmission.id}.png`;
                              link.click();
                            }}
                            className="px-6 py-3 rounded-xl bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                          >
                            <Download className="w-5 h-5" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Team Members</h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {selectedSubmission.members.map((member, i) => (
                      <div key={i} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center font-bold text-blue-500">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-lg">{member.fullName}</div>
                          <div className="text-sm text-gray-500 space-y-1 mt-1">
                            <div>CNIC: {member.cnic}</div>
                            <div>Contact: {member.contactNumber}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="p-10 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex items-center justify-end gap-6">
                <div className="mr-auto">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Current Status</div>
                  <div className={`text-xl font-black uppercase ${selectedSubmission.status === 'approved' ? 'text-emerald-500' : selectedSubmission.status === 'rejected' ? 'text-rose-500' : 'text-amber-500'}`}>
                    {selectedSubmission.status}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleStatusUpdate(selectedSubmission.id!, 'rejected')}
                  className={`px-10 py-5 rounded-2xl font-bold transition-all border ${
                    selectedSubmission.status === 'rejected' 
                      ? 'bg-rose-500 text-white border-rose-600' 
                      : 'border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white'
                  }`}
                >
                  Reject Submission
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedSubmission.id!, 'approved')}
                  className={`px-10 py-5 rounded-2xl font-bold transition-all ${
                    selectedSubmission.status === 'approved' 
                      ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  Approve Entry
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
