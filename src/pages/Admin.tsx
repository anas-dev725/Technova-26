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
  EyeOff,
  ChevronDown,
  RefreshCw,
  Settings,
  Trash2,
  Minus
} from 'lucide-react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword } from 'firebase/auth';
import { submissionService, Submission, MODULE_PREFIXES } from '../services/submissionService';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { emailService } from '../services/emailService';

function normalizeUniversityName(name: string): string {
  const clean = (name || '').trim().toLowerCase();
  if (!clean) return 'Independent / Other';
  
  if (clean.includes('iobm') || clean.includes('business management') || clean.includes('ibm')) {
    return 'IoBM';
  }
  if (clean.includes('sukkur iba') || clean.includes('iba sukkur')) {
    return 'IBA Sukkur';
  }
  if (clean.includes('iba') || clean.includes('institute of business administration')) {
    return 'IBA';
  }
  if (clean.includes('iqra')) {
    return 'Iqra University';
  }
  if (clean.includes('fast') || clean.includes('nuces')) {
    return 'FAST-NUCES';
  }
  if (clean.includes('ssuet') || clean.includes('sir syed') || clean.includes('sirsyed')) {
    return 'SSUET';
  }
  if (clean.includes('nhu') || clean.includes('nazeer hussain')) {
    return 'NHU';
  }
  if (clean.includes('ned')) {
    return 'NED University';
  }
  if (clean.includes('ku') || clean.includes('karachi university') || clean.includes('university of karachi')) {
    return 'Karachi University';
  }
  if (clean.includes('szabist')) {
    return 'SZABIST';
  }
  if (clean.includes('habib') || clean.includes('salim habib') || clean.includes('shu')) {
    return 'SHU';
  }
  if (clean.includes('bahria')) {
    return 'Bahria University';
  }
  if (clean.includes('dawood') || clean.includes('duet')) {
    return 'Dawood University (DUET)';
  }
  if (clean.includes('uit')) {
    return 'UIT University';
  }
  if (clean.includes('dsu') || clean.includes('dha suffa')) {
    return 'DHA Suffa University';
  }
  
  // Title case/Acronym capitalization
  if (clean.length <= 5) {
    return clean.toUpperCase();
  }
  return clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterUniversity, setFilterUniversity] = useState<string>('all');
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resetModuleId, setResetModuleId] = useState('maths-mania');
  const [resetCounterValue, setResetCounterValue] = useState(0);
  const [isResettingCounter, setIsResettingCounter] = useState(false);
  const [showCounterOverride, setShowCounterOverride] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Submission; direction: 'asc' | 'desc' } | null>(null);

  // Custom confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    variant?: 'danger' | 'info' | 'warning';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Continue',
    variant: 'info'
  });

  // Login Form State
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingInWithGoogle, setIsLoggingInWithGoogle] = useState(false);

  useEffect(() => {
    let unsubscribeSubmissions: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user?.email) {
        const adminStatus = await submissionService.checkIsAdmin(user.email);
        setIsAdmin(adminStatus);
        if (adminStatus) {
          // Unsubscribe from any existing first
          if (unsubscribeSubmissions) {
            unsubscribeSubmissions();
            unsubscribeSubmissions = null;
          }
          unsubscribeSubmissions = loadSubmissions();
        } else {
          if (unsubscribeSubmissions) {
            unsubscribeSubmissions();
            unsubscribeSubmissions = null;
          }
        }
      } else {
        setIsAdmin(false);
        if (unsubscribeSubmissions) {
          unsubscribeSubmissions();
          unsubscribeSubmissions = null;
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSubmissions) {
        unsubscribeSubmissions();
      }
    };
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
        setAuthError('Invalid Novamin ID or Password. If you are experiencing credential issues, please use the safer and easier "Sign in with Google" option below using an authorized email such as anasmobin0@gmail.com.');
      } else {
        setAuthError('An error occurred during authentication. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsLoggingInWithGoogle(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      setAuthError(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoggingInWithGoogle(false);
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

      // Send email notification based on status (NON-BLOCKING)
      if (sub && sub.email && sub.members?.[0]) {
        try {
          const participantId = sub.participantId || 'N/A';
          if (status === 'approved') {
            const membersList = sub.members.map((m, i) => `${i + 1}. ${m.fullName} (${m.cnic})`).join('\n');
            await emailService.sendApprovalNotification(
              sub.email, 
              sub.members[0].fullName, 
              sub.moduleTitle, 
              participantId,
              {
                moduleType: sub.subGameTitle || 'Competition',
                feeAmount: `PKR ${sub.totalFee?.toLocaleString() || '0'}`,
                membersList: membersList
              }
            );
          } else if (status === 'rejected') {
            await emailService.sendRejectionNotification(sub.email, sub.members[0].fullName, sub.moduleTitle, participantId);
          }
        } catch (emailErr) {
          console.warn('Status update notification email failed to send:', emailErr);
        }
      }
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  const handleToggleExempted = async (id: string, currentExempted: boolean) => {
    try {
      await submissionService.toggleExempted(id, !currentExempted);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission({ ...selectedSubmission, exempted: !currentExempted });
      }
    } catch (error) {
      console.error('Exemption toggle error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Registration Entry',
      message: 'Are you absolutely sure you want to permanently delete this registration entry? This action is irreversible.',
      confirmText: 'Delete Entry',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await submissionService.deleteSubmission(id);
          
          // Update local state immediately to remove the row and sync stats/totals
          setSubmissions(prev => prev.filter(sub => sub.id !== id));
          
          // If the currently viewed submission is the deleted one, close the modal
          if (selectedSubmission?.id === id) {
            setSelectedSubmission(null);
          }
        } catch (error: any) {
          console.error('Error deleting submission:', error);
          const detail = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
          alert('Failed to delete registration: ' + detail);
        }
      }
    });
  };

  const handleMigrateIds = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Generate Missing IDs',
      message: "This will generate unique IDs for all existing entries that don't have one based on their submission time. Continue?",
      confirmText: 'Generate IDs',
      variant: 'warning',
      onConfirm: async () => {
        setIsMigrating(true);
        try {
          const count = await submissionService.migrateMissingIds();
          alert(`Success! Generated IDs for ${count || 0} entries.`);
        } catch (error) {
          alert('Migration failed. Check console for error.');
          console.error(error);
        } finally {
          setIsMigrating(false);
        }
      }
    });
  };

  const handleSyncCounters = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Synchronize Counters',
      message: 'This will synchronize the sequential counters with the current number of submissions for each module. Use this if IDs are starting from #001 again incorrectly. Continue?',
      confirmText: 'Synchronize',
      variant: 'warning',
      onConfirm: async () => {
        setIsSyncing(true);
        try {
          const count = await submissionService.syncCounters(submissions);
          alert(`Success! Synchronized counters for ${count || 0} modules.`);
        } catch (error) {
          alert('Sync failed. Check console for error.');
          console.error(error);
        } finally {
          setIsSyncing(false);
        }
      }
    });
  };

  const handleResetCounter = async () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset/Update Counter',
      message: `Are you sure you want to set the counter for "${resetModuleId}" to ${resetCounterValue}? Future registrations for this module will start from #${(resetCounterValue + 1).toString().padStart(3, '0')}.`,
      confirmText: 'Reset Counter',
      variant: 'warning',
      onConfirm: async () => {
        setIsResettingCounter(true);
        try {
          await submissionService.resetCounter(resetModuleId, resetCounterValue);
          alert(`Success! Set ID counter for "${resetModuleId}" to ${resetCounterValue}.`);
        } catch (error) {
          alert('Failed to reset counter. Check console for error.');
          console.error(error);
        } finally {
          setIsResettingCounter(false);
        }
      }
    });
  };

  const filteredSubmissions = submissions
    .filter(sub => {
      const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
      const matchesModule = filterModule === 'all' || sub.moduleTitle === filterModule;
      const normalizedSubUni = normalizeUniversityName(sub.university);
      const matchesUniversity = filterUniversity === 'all' || normalizedSubUni === filterUniversity;
      const matchesSearch = 
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
        normalizedSubUni.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.teamName && sub.teamName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        sub.members.some(m => m.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesModule && matchesUniversity && matchesSearch;
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

  const uniqueModules = Array.from(new Set(submissions.map(s => s.moduleTitle))).sort();

  const moduleStats = uniqueModules.map(m => ({
    name: m,
    count: submissions.filter(s => s.moduleTitle === m).length
  }));

  // Get unique normalized universities and their participant & team stats
  const universityStats = Array.from(
    new Set(submissions.map(s => normalizeUniversityName(s.university)))
  ).map(uniName => {
    const uniSubmissions = submissions.filter(s => normalizeUniversityName(s.university) === uniName);
    const teamCount = uniSubmissions.length;
    const participantCount = uniSubmissions.reduce((sum, s) => sum + (s.members?.length || 0), 0);
    return {
      name: uniName,
      teams: teamCount,
      participants: participantCount
    };
  }).sort((a, b) => b.participants - a.participants);

  // Dynamic calculations based on selected filters (module and/or university)
  const targetSubmissions = submissions
    .filter(s => filterModule === 'all' || s.moduleTitle === filterModule)
    .filter(s => filterUniversity === 'all' || normalizeUniversityName(s.university) === filterUniversity);

  const stats = {
    // Basic review queue stats
    total: targetSubmissions.length,
    pending: targetSubmissions.filter(s => s.status === 'pending').length,
    approved: targetSubmissions.filter(s => s.status === 'approved').length,
    rejected: targetSubmissions.filter(s => s.status === 'rejected').length,

    // High precision event/financial statistics for the active view
    teams: targetSubmissions.length,
    participants: targetSubmissions.reduce((sum, s) => sum + (s.members?.length || 0), 0),
    amountApproved: targetSubmissions.filter(s => s.status === 'approved' && !s.exempted).reduce((sum, s) => sum + Number(s.totalFee || 0), 0),
    amountPending: targetSubmissions.filter(s => s.status === 'pending' && !s.exempted).reduce((sum, s) => sum + Number(s.totalFee || 0), 0),
    amountTotal: targetSubmissions.filter(s => !s.exempted).reduce((sum, s) => sum + Number(s.totalFee || 0), 0),
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
            <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-3 tracking-tight">Novamin Portal</h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {!user 
                ? 'Enter your credentials to access the submission dashboard.' 
                : 'Your current account is not authorized for Novamin access.'
              }
            </p>
          </div>

          {!user ? (
            <>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Novamin ID</label>
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
                  disabled={isLoggingIn || isLoggingInWithGoogle}
                  className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
                >
                  {isLoggingIn ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : 'Authorize Access'}
                </button>
              </form>

              <div className="relative my-8 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                </div>
                <span className="relative px-4 bg-white dark:bg-[#0c0c0e] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">Or Continue With</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn || isLoggingInWithGoogle}
                className="w-full py-5 rounded-2xl border-2 border-gray-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-500 text-gray-950 dark:text-white font-black hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-3 uppercase tracking-wider shadow-sm"
              >
                {isLoggingInWithGoogle ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
                <p className="text-gray-900 dark:text-white font-bold mb-1">{user.email}</p>
                <p className="text-sm text-red-500 font-medium">No Novamin privileges assigned.</p>
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-blue-500 font-bold tracking-[0.2em] text-[9px] uppercase mb-2">
              <span className="w-4 h-[1px] bg-blue-500"></span>
              Novamin Dashboard
              <span className="w-4 h-[1px] bg-blue-500"></span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 dark:text-white tracking-tighter uppercase">
              Submissions <span className="text-blue-500">Live</span>
            </h1>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 bg-white dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-xl">
            <div className="px-3 border-r border-gray-100 dark:border-white/5">
              <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Authorized As</div>
              <div className="text-xs font-black text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-none">{user.email?.split('@')[0]}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Active View Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Active View: <span className="text-blue-500 font-extrabold">{filterModule === 'all' ? 'ALL MODULES' : filterModule.toUpperCase()}</span>
                {filterUniversity !== 'all' && (
                  <>
                    <span className="mx-2 text-gray-300 dark:text-gray-700">|</span>
                    <span className="text-purple-500 font-extrabold">{filterUniversity.toUpperCase()}</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {filterModule !== 'all' && (
                <button 
                  onClick={() => setFilterModule('all')}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 hover:underline transition-colors cursor-pointer bg-blue-500/10 px-2.5 py-1 rounded"
                >
                  Reset Module
                </button>
              )}
              {filterUniversity !== 'all' && (
                <button 
                  onClick={() => setFilterUniversity('all')}
                  className="text-[10px] font-black uppercase tracking-widest text-purple-500 hover:text-purple-400 hover:underline transition-colors cursor-pointer bg-purple-500/10 px-2.5 py-1 rounded"
                >
                  Reset University
                </button>
              )}
            </div>
          </div>

          {/* Core Event Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Teams Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full translate-x-4 -translate-y-4"></div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-1.5 tracking-tight font-display">
                {stats.teams}
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Teams Registered</div>
              <div className="text-[10px] text-gray-500 font-bold">Total group submissions under active filter</div>
            </motion.div>

            {/* Participants Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full translate-x-4 -translate-y-4"></div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                <UserIcon className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-1.5 tracking-tight font-display">
                {stats.participants}
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Participants Registered</div>
              <div className="text-[10px] text-gray-500 font-bold">Sum of individual members across teams</div>
            </motion.div>

            {/* Amount Collected Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full translate-x-4 -translate-y-4"></div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                <CreditCard className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-1.5 tracking-tight font-display">
                PKR {stats.amountApproved.toLocaleString()}
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Collected</div>
              <div className="text-[10px] text-gray-500 font-bold truncate">
                Approved: PKR {stats.amountApproved.toLocaleString()} • Pending: PKR {stats.amountPending.toLocaleString()}
              </div>
            </motion.div>
          </div>

          {/* Review Status Split */}
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: 'Total', value: stats.total, color: 'blue', icon: Users },
                { label: 'Pending', value: stats.pending, color: 'amber', icon: Clock },
                { label: 'Approved', value: stats.approved, color: 'emerald', icon: CheckCircle2 },
                { label: 'Rejected', value: stats.rejected, color: 'rose', icon: XCircle },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="p-4 md:p-6 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg relative group"
                >
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-4 border border-${stat.color}-500/20`}>
                    <stat.icon className={`w-4 h-4 md:w-6 md:h-6 text-${stat.color}-500`} />
                  </div>
                  <div className="text-xl md:text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">{stat.value}</div>
                  <div className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full translate-x-12 -translate-y-12"></div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <div className="w-6 h-[1px] bg-blue-500"></div>
              Module Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {moduleStats.map((m, i) => (
                <div key={m.name} 
                  onClick={() => setFilterModule(m.name)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[80px] ${
                    filterModule === m.name 
                      ? 'bg-gray-900 border-gray-900 shadow-xl scale-[1.02]' 
                      : 'bg-gray-50 dark:bg-black/20 border-gray-100 dark:border-white/5 hover:border-blue-500/30'
                  }`}
                >
                  <div className={`text-[10px] font-black truncate leading-tight transition-colors pr-4 ${
                    filterModule === m.name ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`} title={m.name}>{m.name}</div>
                  <div className="flex items-end justify-between mt-2">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      filterModule === m.name ? 'text-blue-400' : 'text-gray-400'
                    }`}>Entries</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${
                      filterModule === m.name ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500'
                    }`}>{m.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* University Distribution & Filtering */}
          <div className="p-6 md:p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full translate-x-12 -translate-y-12"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-6 h-[1px] bg-purple-500"></div>
                University Distribution ({universityStats.length})
              </h3>
              {filterUniversity !== 'all' && (
                <button 
                  onClick={() => setFilterUniversity('all')}
                  className="text-[10px] font-black uppercase tracking-widest text-purple-500 hover:text-purple-400 hover:underline transition-colors cursor-pointer bg-purple-500/10 px-2.5 py-1 rounded w-fit"
                >
                  Clear Filter
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {universityStats.map((uni) => (
                <div key={uni.name} 
                  onClick={() => setFilterUniversity(filterUniversity === uni.name ? 'all' : uni.name)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[90px] ${
                    filterUniversity === uni.name 
                      ? 'bg-purple-900 border-purple-900 shadow-xl scale-[1.02] text-white' 
                      : 'bg-gray-50 dark:bg-black/20 border-gray-100 dark:border-white/5 hover:border-purple-500/30'
                  }`}
                >
                  <div className={`text-[11px] font-black truncate leading-tight pr-4 ${
                    filterUniversity === uni.name ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`} title={uni.name}>
                    {uni.name}
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className={filterUniversity === uni.name ? 'text-purple-200' : 'text-gray-400'}>Teams:</span>
                      <span className="font-bold">{uni.teams}</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] border-t border-gray-200/20 dark:border-white/5 pt-1">
                      <span className={filterUniversity === uni.name ? 'text-purple-200' : 'text-gray-400'}>Participants:</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                        filterUniversity === uni.name ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-purple-500'
                      }`}>{uni.participants}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl p-2 border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 md:p-8 space-y-6">
            {/* Row 1: Search & Filter Controls */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
              {/* Search input */}
              <div className="relative w-full lg:max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  placeholder="Search participants, modules, or universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-black/40 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-white font-bold"
                />
              </div>
              
              {/* Dropdown + Tab filter group */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Custom Module Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
                    className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 px-5 py-3.5 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl border-2 border-transparent hover:border-white/20 text-xs font-black uppercase tracking-widest outline-none transition-all cursor-pointer shadow-xl relative min-w-[200px]"
                  >
                    <div className="flex items-center gap-3">
                      <Filter className="w-3.5 h-3.5 text-blue-100" />
                      <span>{filterModule === 'all' ? 'MODULE: ALL' : filterModule.toUpperCase()}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isModuleDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isModuleDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsModuleDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => {
                                setFilterModule('all');
                                setIsModuleDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filterModule === 'all' 
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                              }`}
                            >
                              All Modules
                            </button>
                            <div className="h-[1px] bg-gray-100 dark:bg-white/5 my-1" />
                            {uniqueModules.map((m: any) => (
                              <button
                                key={m}
                                onClick={() => {
                                  setFilterModule(m as string);
                                  setIsModuleDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                  filterModule === m 
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                              >
                                {m as string}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Custom University Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => setIsUniversityDropdownOpen(!isUniversityDropdownOpen)}
                    className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 px-5 py-3.5 bg-gray-900 dark:bg-purple-600 text-white rounded-2xl border-2 border-transparent hover:border-white/20 text-xs font-black uppercase tracking-widest outline-none transition-all cursor-pointer shadow-xl relative min-w-[200px]"
                  >
                    <div className="flex items-center gap-3">
                      <Filter className="w-3.5 h-3.5 text-purple-100" />
                      <span>{filterUniversity === 'all' ? 'UNIVERSITY: ALL' : filterUniversity.toUpperCase()}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUniversityDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUniversityDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsUniversityDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 z-50 max-h-80 overflow-y-auto"
                        >
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => {
                                setFilterUniversity('all');
                                setIsUniversityDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filterUniversity === 'all' 
                                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                              }`}
                            >
                              All Universities
                            </button>
                            <div className="h-[1px] bg-gray-100 dark:bg-white/5 my-1" />
                            {universityStats.map((u) => (
                              <button
                                key={u.name}
                                onClick={() => {
                                  setFilterUniversity(u.name);
                                  setIsUniversityDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                  filterUniversity === u.name 
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                              >
                                {u.name} ({u.participants} pax)
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-black/40 rounded-2xl border border-gray-200 dark:border-white/5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'approved', label: 'Approved' },
                    { id: 'rejected', label: 'Rejected' },
                  ].map(status => (
                    <button
                      key={status.id}
                      onClick={() => setFilterStatus(status.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        filterStatus === status.id 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Separator line */}
            <div className="h-[1px] bg-gray-100 dark:bg-white/5" />

            {/* Row 2: Management/Diagnostic Controls & Bulk Exports */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
              {/* Management Tools (Sync / Diagnostics) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button 
                  onClick={handleMigrateIds}
                  disabled={isMigrating}
                  className="px-5 py-3.5 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isMigrating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    <>
                      <Settings className="w-3.5 h-3.5 text-orange-500" />
                      Fix IDs
                    </>
                  )}
                </button>

                <button 
                  onClick={handleSyncCounters}
                  disabled={isSyncing}
                  className="px-5 py-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <ArrowUpDown className="w-3.5 h-3.5 text-emerald-500" />
                      Sync Counters
                    </>
                  )}
                </button>

                <button 
                  onClick={() => setShowCounterOverride(prev => !prev)}
                  className={`px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${
                    showCounterOverride 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 hover:bg-blue-700' 
                      : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  Reset Counter
                </button>
              </div>

              {/* Data Export Options */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button 
                  className="px-6 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  onClick={() => {
                  const maxMembers = Math.max(1, ...filteredSubmissions.map(s => s.members?.length || 0));
                  const headers = [
                    'Participant ID',
                    'Submission ID',
                    'Date',
                    'Lead Name',
                    'Lead Email',
                    'Module',
                    'Sub-Game',
                    'University',
                    'Total Fee (PKR)',
                    'Promo Code',
                    'Discount (PKR)',
                    'Status',
                    'Exempted'
                  ];

                  for (let i = 1; i <= maxMembers; i++) {
                    headers.push(`Name (M${i})`, `CNIC (M${i})`, `Contact (M${i})`);
                  }

                  const aoaData = [headers];

                  filteredSubmissions.forEach(s => {
                    const date = s.submittedAt?.toDate ? s.submittedAt.toDate().toLocaleString() : 'N/A';
                    const row: any[] = [
                      s.participantId || 'N/A',
                      s.id,
                      date,
                      s.members[0]?.fullName || '',
                      s.email || '',
                      s.moduleTitle || '',
                      s.subGameTitle || 'N/A',
                      s.university || '',
                      s.exempted ? 0 : (s.totalFee || 0),
                      s.promoCode || 'NONE',
                      s.discountApplied || 0,
                      s.status.toUpperCase(),
                      s.exempted ? 'YES' : 'NO'
                    ];

                    for (let i = 0; i < maxMembers; i++) {
                      const member = s.members[i];
                      if (member) {
                        row.push(
                          member.fullName || '', 
                          member.cnic || '', 
                          member.contactNumber || ''
                        );
                      } else {
                        row.push('', '', '');
                      }
                    }

                    aoaData.push(row);
                  });

                  // Add Finance Summary Section
                  const totalSum = filteredSubmissions.filter(s => !s.exempted).reduce((acc, curr) => acc + Number(curr.totalFee || 0), 0);
                  const approvedSum = submissions.filter(s => s.status === 'approved' && !s.exempted).reduce((acc, curr) => acc + Number(curr.totalFee || 0), 0);
                  const pendingSum = submissions.filter(s => s.status === 'pending' && !s.exempted).reduce((acc, curr) => acc + Number(curr.totalFee || 0), 0);

                  aoaData.push([]); // Spacer
                  aoaData.push(['--- FINANCE REPORT SUMMARY ---']);
                  aoaData.push(['Current View Total (Filtered)', `PKR ${totalSum.toLocaleString()}`]);
                  aoaData.push(['Approved Submissions Total', `PKR ${approvedSum.toLocaleString()}`]);
                  aoaData.push(['Pending Submissions Total', `PKR ${pendingSum.toLocaleString()}`]);
                  aoaData.push(['Total Entries Count', submissions.length.toString()]);
                  aoaData.push(['Filtered Entries Count', filteredSubmissions.length.toString()]);
                  aoaData.push(['Generated At', new Date().toLocaleString()]);
                  
                  const worksheet = XLSX.utils.aoa_to_sheet(aoaData);
                  
                  // Configure column widths
                  const wscols = [
                    {wch: 25}, // Submission ID
                    {wch: 20}, // Date
                    {wch: 25}, // Lead Name
                    {wch: 30}, // Lead Email
                    {wch: 25}, // Module
                    {wch: 20}, // Sub-Game
                    {wch: 30}, // University
                    {wch: 15}, // Total Fee
                    {wch: 15}, // Status
                  ];
                  for (let i = 0; i < maxMembers; i++) {
                    wscols.push({wch: 25}, {wch: 20}, {wch: 15});
                  }
                  worksheet['!cols'] = wscols;

                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
                  XLSX.writeFile(workbook, `technova_submissions_${new Date().toISOString().slice(0,10)}.xlsx`);
                }}
              >
                <FileText className="w-4 h-4" />
                Export Excel
              </button>
              <button 
                onClick={async () => {
                  try {
                    const zip = new JSZip();
                    const folder = zip.folder("receipts");
                    if (!folder) return;
                    
                    for (const s of filteredSubmissions) {
                      if (s.receiptBase64) {
                        // Extract base64 payload
                        const parts = s.receiptBase64.split(',');
                        if (parts.length === 2) {
                          const base64Data = parts[1];
                          // Guess extension from mime type
                          const mimeMatch = parts[0].match(/:(.*?);/);
                          let ext = 'png';
                          if (mimeMatch && mimeMatch[1]) {
                            const mime = mimeMatch[1];
                            if (mime === 'image/jpeg') ext = 'jpg';
                            else if (mime === 'application/pdf') ext = 'pdf';
                          }
                          const safeName = s.members[0]?.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                          const filename = `${safeName}_${s.id.slice(0, 6)}.${ext}`;
                          folder.file(filename, base64Data, { base64: true });
                        }
                      }
                    }
                    
                    const content = await zip.generateAsync({ type: 'blob' });
                    saveAs(content, `technova_receipts_${new Date().toISOString().slice(0, 10)}.zip`);
                  } catch (e) {
                    console.error('Failed to export receipts:', e);
                    alert("Failed to export receipts.");
                  }
                }}
                className="px-6 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
              >
                <Download className="w-4 h-4" />
                Export Receipts
              </button>
            </div>

            {/* Manual Counter Override Panel */}
            <AnimatePresence>
              {showCounterOverride && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <div className="p-6 mt-4 rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Manual Counter Override</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Directly set the registration count (e.g. Maths Mania start point).</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Module</label>
                        <select
                          value={resetModuleId}
                          onChange={(e) => setResetModuleId(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-blue-500 transition-colors"
                        >
                          {Object.keys(MODULE_PREFIXES).map((id) => (
                            <option key={id} value={id}>
                              {id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ({MODULE_PREFIXES[id]})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">New Counter Value</label>
                        <input
                          type="number"
                          min="0"
                          value={resetCounterValue}
                          onChange={(e) => setResetCounterValue(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <button
                          onClick={handleResetCounter}
                          disabled={isResettingCounter}
                          className="w-full px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/15"
                        >
                          {isResettingCounter ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Resetting...
                            </>
                          ) : (
                            'Set Counter Value'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Card View (Visible on small screens) */}
          <div className="md:hidden space-y-4 p-4">
            <AnimatePresence mode="popLayout">
              {filteredSubmissions.map((sub, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className="p-5 rounded-[2rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 active:scale-[0.98] transition-all shadow-sm flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono font-black text-gray-400">#{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                      <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight break-all leading-tight">
                        {sub.members[0].fullName}
                      </div>
                      <span className="text-[10px] font-black text-blue-500 font-mono tracking-widest">{sub.participantId || 'N/A'}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm
                      ${sub.status === 'approved' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                        sub.status === 'rejected' ? 'bg-rose-500 text-white shadow-rose-500/20' : 
                        'bg-amber-500 text-white shadow-amber-500/20'}
                    `}>
                      {sub.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-100 dark:border-white/5">
                    <div>
                      <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Module</div>
                      <div className="text-[10px] font-bold text-gray-700 dark:text-blue-100 uppercase truncate">{sub.moduleTitle}</div>
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</div>
                      <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300">{sub.submittedAt?.toDate().toLocaleDateString('en-GB')}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Institution</div>
                      <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate">{sub.university}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleExempted(sub.id!, !!sub.exempted); }}
                      className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all ${
                        sub.exempted 
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' 
                          : 'bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-300 dark:hover:bg-white/15'
                      }`}
                      title={sub.exempted ? "Fee Compensated (Click to Include)" : "Exclude Fee (Compensate)"}
                    >
                      <Minus className="w-3.5 h-3.5" />
                      {sub.exempted ? "Exempted" : "Exempt Fee"}
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(sub.id!, 'approved'); }}
                        disabled={sub.status === 'approved'}
                        className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-20 shadow-sm border border-emerald-500/20"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(sub.id!, 'rejected'); }}
                        disabled={sub.status === 'rejected'}
                        className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-20 shadow-sm border border-rose-500/20"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(sub.id!); }}
                        className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 transition-all shadow-sm border border-rose-500/20"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Sr#</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
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
                        <div className="text-[10px] font-mono font-black text-gray-400 group-hover:text-blue-500/50 transition-colors">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-black text-blue-500 font-mono tracking-tighter">
                          {sub.participantId || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                          {sub.members[0].fullName}
                          {sub.teamName && (
                            <span className="ml-2 inline-flex items-center text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest leading-none">
                              {sub.teamName}
                            </span>
                          )}
                        </div>
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
                        <div className="text-gray-500 dark:text-gray-400 font-bold text-[10px] flex flex-col">
                          <span>{sub.submittedAt?.toDate().toLocaleDateString('en-GB')}</span>
                          <span className="text-[9px] opacity-60 mt-0.5">{sub.submittedAt?.toDate().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
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
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleExempted(sub.id!, !!sub.exempted); }}
                            className={`p-2 rounded-lg transition-all shadow-sm ${
                              sub.exempted 
                                ? 'bg-amber-500 text-white hover:bg-amber-600' 
                                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white hover:bg-amber-500 hover:text-white'
                            }`}
                            title={sub.exempted ? "Fee Compensated (Click to Include)" : "Exclude Fee (Compensate)"}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(sub.id!, 'approved'); }}
                            disabled={sub.status === 'approved'}
                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(sub.id!, 'rejected'); }}
                            disabled={sub.status === 'rejected'}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                            title="Reject"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(sub.id!); }}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 transition-all shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredSubmissions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 italic text-sm">
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
                      <span className="text-xs font-black text-blue-500 uppercase tracking-widest pr-2 border-r border-gray-200 dark:border-white/10">{selectedSubmission.participantId || 'N/A'}</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ref: {selectedSubmission.id?.slice(-8)}</span>
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
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <section>
                          <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2 leading-none">TEAM LEAD</h3>
                          <div className="flex flex-col">
                            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">{selectedSubmission.members[0].fullName}</span>
                            <span className="text-[10px] text-blue-500 font-black mt-2 break-all uppercase tracking-wider">{selectedSubmission.email}</span>
                          </div>
                        </section>

                        <section>
                          <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2 leading-none">INSTITUTION</h3>
                          <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                            {selectedSubmission.university}
                          </div>
                        </section>

                        {selectedSubmission.teamName && (
                          <section className="sm:col-span-2">
                            <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2 leading-none">TEAM NAME</h3>
                            <div className="inline-flex px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-black uppercase tracking-widest border border-blue-500/20">
                              {selectedSubmission.teamName}
                            </div>
                          </section>
                        )}
                      </div>

                      <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full translate-x-12 -translate-y-12"></div>
                        <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 leading-none">REGISTRATION DETAIL</h3>
                        <div className="space-y-2">
                          <div className="text-2xl font-black text-blue-500 uppercase tracking-tighter leading-none italic">
                            {selectedSubmission.moduleTitle}
                          </div>
                          {selectedSubmission.subGameTitle && (
                            <div className="text-[10px] font-black text-gray-900 dark:text-gray-400 uppercase tracking-[0.2em]">
                              — {selectedSubmission.subGameTitle}
                            </div>
                          )}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                              {selectedSubmission.promoCode ? `Fee (Promo: ${selectedSubmission.promoCode})` : 'Fee Verification'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-black text-emerald-500 tracking-tighter italic uppercase">
                                PKR {selectedSubmission.totalFee}
                              </span>
                              {selectedSubmission.discountApplied && (
                                <span className="text-[10px] font-black text-gray-400 line-through">
                                  PKR {selectedSubmission.totalFee + selectedSubmission.discountApplied}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          </div>
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
                            onClick={() => {
                              try {
                                if (selectedSubmission.receiptBase64.startsWith('data:')) {
                                  const newTab = window.open();
                                  if (newTab) {
                                    newTab.document.write(`
                                      <!DOCTYPE html>
                                      <html>
                                        <head>
                                          <title>Receipt</title>
                                          <style>
                                            body { margin: 0; background: #0e0e0e; display: flex; justify-content: center; align-items: center; height: 100vh; }
                                            img { max-width: 100%; max-height: 100%; object-fit: contain; }
                                          </style>
                                        </head>
                                        <body>
                                          <img src="${selectedSubmission.receiptBase64}" />
                                        </body>
                                      </html>
                                    `);
                                    newTab.document.close();
                                  }
                                } else {
                                  window.open(selectedSubmission.receiptBase64, '_blank');
                                }
                              } catch (e) {
                                console.error('Failed to open receipt:', e);
                                window.open(selectedSubmission.receiptBase64, '_blank');
                              }
                            }}
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
                
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleDelete(selectedSubmission.id!)}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-black transition-all border-2 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
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

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              key="confirm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(p => ({ ...p, isOpen: false }))}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            />
            
            {/* Modal Box */}
            <motion.div 
              key="confirm-modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl z-[101] overflow-hidden p-6 text-left"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${
                  confirmDialog.variant === 'danger' ? 'bg-rose-500/15 text-rose-500' :
                  confirmDialog.variant === 'warning' ? 'bg-amber-500/15 text-amber-500' :
                  'bg-blue-500/15 text-blue-500'
                }`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    {confirmDialog.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                    {confirmDialog.message}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(p => ({ ...p, isOpen: false }))}
                  className="px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDialog(p => ({ ...p, isOpen: false }));
                    confirmDialog.onConfirm();
                  }}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg ${
                    confirmDialog.variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/15' :
                    confirmDialog.variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/15' :
                    'bg-blue-600 hover:bg-blue-700 shadow-blue-600/15'
                  }`}
                >
                  {confirmDialog.confirmText}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
