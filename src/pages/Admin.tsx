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
  CreditCard,
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
// import { emailService } from '../services/emailService';

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
      const sub = submissions.find(s => s.id === id);
      await submissionService.updateStatus(id, status);
      
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status });
      }

      /*
      // Send email notification based on status
      if (sub && sub.email && sub.members?.[0]) {
        if (status === 'approved') {
          await emailService.sendApprovalNotification(sub.email, sub.members[0].fullName, sub.moduleTitle);
        } else if (status === 'rejected') {
          await emailService.sendRejectionNotification(sub.email, sub.members[0].fullName, sub.moduleTitle);
        }
      }
      */
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold tracking-widest text-[10px] uppercase mb-1">
              <span className="w-6 h-[1px] bg-blue-500"></span>
              Control Panel
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight">
              Submissions <span className="text-blue-500">Live</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-1.5 rounded-xl border border-gray-200 dark:border-white/10 backdrop-blur-md">
            <div className="px-3">
              <div className="text-[10px] text-gray-500 font-medium uppercase">Admin</div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{user.email}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'blue', icon: Users },
            { label: 'Pending', value: stats.pending, color: 'amber', icon: Clock },
            { label: 'Approved', value: stats.approved, color: 'emerald', icon: CheckCircle2 },
            { label: 'Rejected', value: stats.rejected, color: 'rose', icon: XCircle },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className={`p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden relative group`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-bl-full translate-x-12 -translate-y-12`}></div>
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-4 border border-${stat.color}-500/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
              </div>
              <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 dark:border-white/5 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="relative w-full lg:max-w-xs group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-black/20 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white font-medium"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-1 p-1 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'approved', label: 'Approved' },
                  { id: 'rejected', label: 'Rejected' },
                ].map(status => (
                  <button
                    key={status.id}
                    onClick={() => setFilterStatus(status.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === status.id 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
              <button 
                className="px-5 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                onClick={() => {
                  const maxMembers = Math.max(...filteredSubmissions.map(s => s.members.length), 5);
                  const headers = [
                    'Submission ID',
                    'Date',
                    'Lead Name',
                    'Lead Email',
                    'Module',
                    'Sub-Game',
                    'University',
                    'Total Fee (PKR)',
                    'Status'
                  ];

                  for (let i = 1; i <= maxMembers; i++) {
                    headers.push(`Member ${i} Name`, `Member ${i} CNIC`, `Member ${i} Contact`);
                  }

                  const escapeCSV = (val: any) => {
                    if (val === undefined || val === null) return '""';
                    const str = String(val).replace(/"/g, '""');
                    return `"${str}"`;
                  };

                  const csvRows = [headers.join(',')];

                  filteredSubmissions.forEach(s => {
                    const date = s.submittedAt?.toDate ? s.submittedAt.toDate().toLocaleString() : 'N/A';
                    const row = [
                      escapeCSV(s.id),
                      escapeCSV(date),
                      escapeCSV(s.members[0]?.fullName),
                      escapeCSV(s.email),
                      escapeCSV(s.moduleTitle),
                      escapeCSV(s.subGameTitle || 'N/A'),
                      escapeCSV(s.university),
                      escapeCSV(s.totalFee),
                      escapeCSV(s.status.toUpperCase())
                    ];

                    for (let i = 0; i < maxMembers; i++) {
                      const member = s.members[i];
                      if (member) {
                        row.push(escapeCSV(member.fullName), escapeCSV(member.cnic), escapeCSV(member.contactNumber));
                      } else {
                        row.push('""', '""', '""');
                      }
                    }

                    csvRows.push(row.join(','));
                  });

                  const csvContent = csvRows.join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `technova_submissions_${new Date().toISOString().slice(0,10)}.csv`;
                  a.click();
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Leader</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Module</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">University</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
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
                      onClick={() => setSelectedSubmission(sub)}
                      className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer active:scale-[0.998]"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-500 transition-colors uppercase tracking-tight">{sub.members[0].fullName}</div>
                        <div className="text-gray-500 text-[10px] font-medium">{sub.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-bold text-[10px] w-fit">
                            {sub.moduleTitle}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{sub.university}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-500 dark:text-gray-400 font-bold text-[10px]">
                          {sub.submittedAt?.toDate().toLocaleDateString('en-GB')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider
                          ${sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                            sub.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : 
                            'bg-amber-500/10 text-amber-500'}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full
                            ${sub.status === 'approved' ? 'bg-emerald-500' : 
                              sub.status === 'rejected' ? 'bg-rose-500' : 
                              'bg-amber-500 animate-pulse'}
                          `}></span>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(sub.id!, 'approved')}
                            disabled={sub.status === 'approved'}
                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(sub.id!, 'rejected')}
                            disabled={sub.status === 'rejected'}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic text-sm">
                      No matching records found.
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
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed left-4 right-4 top-4 bottom-4 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90%] md:max-w-4xl md:h-[85vh] bg-white dark:bg-[#0c0c0c] rounded-2xl md:rounded-[2rem] z-[70] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="shrink-0 p-5 md:p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight">Submission Detail</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest">Ref: {selectedSubmission.id?.slice(-8)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="p-2 md:p-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <XCircle className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Modal Content Scrollable */}
              <div className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="p-5 md:p-8 space-y-8 md:space-y-12">
                  
                  {/* Top Info Grid */}
                  <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
                    
                    {/* Primary Info */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <section>
                          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Lead</h3>
                          <div className="flex flex-col">
                            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-tight">{selectedSubmission.members[0].fullName}</span>
                            <span className="text-xs text-blue-500 font-bold mt-1 break-all">{selectedSubmission.email}</span>
                          </div>
                        </section>

                        <section>
                          <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Institution</h3>
                          <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                            {selectedSubmission.university}
                          </div>
                        </section>
                      </div>

                      <div className="p-5 rounded-2xl bg-blue-500/[0.03] border border-blue-500/10">
                        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Module Details</h3>
                        <div className="space-y-1">
                          <div className="text-xl font-black text-blue-500 uppercase tracking-tight">
                            {selectedSubmission.moduleTitle}
                          </div>
                          {selectedSubmission.subGameTitle && (
                            <div className="text-xs font-bold text-gray-900 dark:text-white/80 uppercase tracking-widest">
                              — {selectedSubmission.subGameTitle}
                            </div>
                          )}
                        </div>
                        <div className="mt-6 pt-4 border-t border-blue-500/10 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Fee</span>
                          <span className="text-xl font-black text-emerald-500 tracking-tight">PKR {selectedSubmission.totalFee}</span>
                        </div>
                      </div>
                    </div>

                    {/* Receipt Preview */}
                    <div>
                      <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                        <CreditCard className="w-3 h-3" />
                        Receipt
                      </h3>
                      <div className="relative group rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 aspect-video bg-gray-50 dark:bg-black/20">
                        <img 
                          src={selectedSubmission.receiptBase64} 
                          alt="Receipt" 
                          className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm px-4">
                          <button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = selectedSubmission.receiptBase64;
                              link.download = `receipt_${selectedSubmission.members[0].fullName.replace(/\s+/g, '_')}.png`;
                              link.click();
                            }}
                            className="p-3 rounded-lg bg-white text-black font-black hover:scale-110 active:scale-95 transition-all"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => window.open(selectedSubmission.receiptBase64)}
                            className="p-3 rounded-lg bg-blue-600 text-white font-black hover:scale-110 active:scale-95 transition-all"
                            title="Open in New Tab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members Section */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] shrink-0">Team Portfolio ({selectedSubmission.members.length})</h3>
                      <div className="h-px flex-1 bg-gray-100 dark:bg-white/5"></div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedSubmission.members.map((member, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex flex-col gap-4 relative group">
                          <div className="absolute top-4 right-4 text-3xl font-black text-gray-200/40 dark:text-white/[0.02] select-none italic">
                            #{i + 1}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                              <UserIcon className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="font-black text-gray-900 dark:text-white text-sm uppercase truncate pr-8">
                              {member.fullName}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex flex-col p-2 bg-white dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5">
                              <span className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">CNIC</span>
                              <span className="font-mono text-xs text-blue-500 font-bold">{member.cnic}</span>
                            </div>
                            <div className="flex flex-col p-2 bg-white dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5">
                              <span className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">PHONE</span>
                              <span className="font-mono text-xs text-emerald-500 font-bold">{member.contactNumber}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="shrink-0 p-5 md:p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row items-center gap-4">
                <div className="mr-auto">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Application Status</div>
                  <div className={`text-lg font-black uppercase tracking-tight ${
                    selectedSubmission.status === 'approved' ? 'text-emerald-500' : 
                    selectedSubmission.status === 'rejected' ? 'text-rose-500' : 
                    'text-amber-500'
                  }`}>
                    {selectedSubmission.status}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleStatusUpdate(selectedSubmission.id!, 'rejected')}
                    className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-black transition-all border-2 text-[10px] uppercase tracking-widest ${
                      selectedSubmission.status === 'rejected' 
                        ? 'bg-rose-500 text-white border-rose-500' 
                        : 'border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white'
                    }`}
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedSubmission.id!, 'approved')}
                    className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest ${
                      selectedSubmission.status === 'approved' 
                        ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-500/10' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
