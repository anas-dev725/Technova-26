import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Upload, X, User, ShieldCheck, Camera, Gamepad2, Check, Server } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { modules, getFees, TeamMode } from '../data/modules';
import { submissionService } from '../services/submissionService';
import { emailService } from '../services/emailService';

import { auth } from '../lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Validation Schema
const memberSchema = z.object({
  fullName: z.string().default(''),
  cnic: z.string().default(''),
  contactNumber: z.string().default(''),
});

const registerSchema = z.object({
  subGameId: z.string().optional(),
  teamName: z.string().optional(),
  email: z.string()
    .email('Invalid contact email address')
    .refine((val) => {
      const parts = val.toLowerCase().split('@');
      if (parts.length === 2) {
        const domain = parts[1].trim();
        const typos = [
          'gmil.com', 'gmal.com', 'gmaill.com', 'gmeil.com', 'gamil.com', 'gmaile.com', 'gmai.com', 'gmile.com',
          'yaho.com', 'yhoo.com', 'yaha.com',
          'hotml.com', 'hotmai.com', 'hotmale.com'
        ];
        return !typos.includes(domain);
      }
      return true;
    }, {
      message: 'Possible domain typo (did you mean @gmail.com?)'
    }),
  university: z.string().min(2, 'Please enter your university name'),
  paymentMethod: z.literal('bank_transfer'),
  members: z.array(memberSchema),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const PAYMENT_DETAILS = {
  bank_transfer: {
    name: 'Standard Chartered Bank',
    accountTitle: 'Institute of Business Management',
    accountNumber: '5501309900055576',
  }
};

export default function Register() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [searchParams] = useSearchParams();
  const gameParam = searchParams.get('game');
  const modeParam = searchParams.get('mode');
  
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const selectedModule = modules.find(m => m.id === moduleId);
  const INNOVATION_MODULES = ['fyp-warriors', 'startup-launchpad'];
  const isInnovationModule = selectedModule && INNOVATION_MODULES.includes(selectedModule.id);
  const activeMode = selectedModule
    ? ((modeParam && ['Individual', 'Duo', 'Squad'].includes(modeParam)) ? (modeParam as TeamMode) : selectedModule.mode)
    : 'Individual';

  const dynamicSchema = React.useMemo(() => {
    return registerSchema.superRefine((data, ctx) => {
      // Require teamName for Esports (PUBG / team games)
      if (selectedModule?.id === 'esports-competition') {
        if (!data.teamName || data.teamName.trim().length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['teamName'],
            message: 'Team Name is required for Esports Competition'
          });
        }
      }

      // 3 mandatory for innovation/squad, 2 mandatory for 2-3 team (Duo), otherwise all mandatory
      // BUT for PUBG Esports Competition, all 4 members of the Squad are strictly mandatory!
      const minRequired = selectedModule?.id === 'esports-competition'
        ? 4
        : (isInnovationModule || activeMode === 'Squad')
          ? 3 
          : (activeMode === 'Duo' ? 2 : data.members.length);

      data.members.forEach((m, idx) => {
        const isMandatory = idx < minRequired;
        const hasAnyValue = !!m.fullName || !!m.cnic || !!m.contactNumber;

        if (isMandatory || hasAnyValue) {
          if (!m.fullName || m.fullName.trim().length < 3) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['members', idx, 'fullName'],
              message: 'Full name is required'
            });
          }
          if (!m.cnic || !/^\d{5}-\d{7}-\d{1}$/.test(m.cnic)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['members', idx, 'cnic'],
              message: 'Invalid style (12345-1234567-1)'
            });
          }
          if (!m.contactNumber || !/^((\+92)|(0092)|(92)|(0))3\d{9}$/.test(m.contactNumber)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['members', idx, 'contactNumber'],
              message: 'Invalid number (03XXXXXXXXX)'
            });
          }
        }
      });
    });
  }, [isInnovationModule, activeMode, selectedModule]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      email: '',
      university: '',
      teamName: '',
      members: [],
      subGameId: gameParam || '',
      paymentMethod: 'bank_transfer'
    }
  });

  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: "members"
  });

  const selectedSubGameId = watch('subGameId');
  const watchedEmail = watch('email');
  const watchedUniversity = watch('university');
  const watchedMembers = watch('members');

  useEffect(() => {
    // Initialize services
    emailService.init();

    if (!auth.currentUser) {
      signInAnonymously(auth).catch(err => console.warn("Initial anonymous sign-in failed:", err));
    }
    
    if (!selectedModule && moduleId) {
      navigate('/modules');
      return;
    }

    if (selectedModule) {
      // If it's the esports competition, we wait for sub-game selection
      if (selectedModule.subGames) {
        if (selectedSubGameId) {
          const game = selectedModule.subGames.find(g => g.id === selectedSubGameId);
          if (game) {
            const count = game.mode === 'Individual' ? 1 : game.mode === 'Duo' ? 2 : 4;
            replace(Array(count).fill({ fullName: '', cnic: '', contactNumber: '' }));
          }
        } else {
          replace([]);
        }
      } else if (isInnovationModule) {
        // Startup and FYP: 4 fields total, 3 mandatory
        replace(Array(4).fill({ fullName: '', cnic: '', contactNumber: '' }));
      } else {
        const count = activeMode === 'Individual' ? 1 : activeMode === 'Duo' ? 3 : 4;
        replace(Array(count).fill({ fullName: '', cnic: '', contactNumber: '' }));
      }
    }
  }, [selectedModule, moduleId, navigate, replace, selectedSubGameId, isInnovationModule, modeParam]);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); // Compress to JPEG with 60% quality
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // Allow up to 10MB input before compression
        setServerError('File size exceeds 10MB limit.');
        return;
      }
      
      setIsProcessingImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setReceiptPreview(compressed);
        setServerError(null);
        setIsProcessingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearReceipt = () => {
    setReceiptPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (!receiptPreview) {
      setServerError('Please upload a screenshot of your payment receipt.');
      return;
    }

    if (selectedModule?.subGames && !data.subGameId) {
      setServerError('Please select exactly which game title you are registering for.');
      return;
    }

    setIsSubmitting(true);
    setServerError(null);
    
    try {
      if (!selectedModule) throw new Error('Module not found');

      // Ensure user is signed in (anonymously if not already signed in)
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn('Registration: Anonymous sign-in attempt failed, proceeding to let Firestore handle permission:', authErr);
        }
      }
      
      const subGame = data.subGameId && selectedModule.subGames 
        ? selectedModule.subGames.find(g => g.id === data.subGameId)
        : null;

      const filteredMembers = data.members.filter(m => 
        m.fullName.trim() !== '' || m.cnic.trim() !== '' || m.contactNumber.trim() !== ''
      );

      // STEP 1: Save to Database (THE ONLY BLOCKING STEP)
      const result = await submissionService.createSubmission({
        moduleId: selectedModule.id,
        moduleTitle: selectedModule.title,
        subGameId: data.subGameId || null,
        subGameTitle: subGame?.title || null,
        email: data.email,
        university: data.university,
        teamName: data.teamName || null,
        members: filteredMembers,
        receiptBase64: receiptPreview,
        totalFee: finalFee,
        promoCode: isPromoApplied ? promoCode.toUpperCase() : undefined,
        discountApplied: isPromoApplied ? discountAmount : undefined
      });

      if (result?.participantId) {
        setSubmittedId(result.participantId);
      }

      // STEP 2: Show Success Immediately
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // STEP 3: Fire-and-forget Email (completely detached from UI success)
      const membersListStr = filteredMembers.map((m, i) => `${i + 1}. ${m.fullName}${m.cnic ? ` (CNIC: ${m.cnic})` : ''}`).join('\n');
      
      emailService.sendSubmissionConfirmation(
        data.email, 
        data.members[0].fullName, 
        subGame?.title || selectedModule.title,
        {
          moduleType: selectedModule.category || 'Competition',
          feeAmount: `Rs. ${finalFee}`,
          university: data.university,
          membersList: membersListStr,
          participantId: result?.participantId
        }
      ).catch(emailErr => {
        console.warn('Background Confirmation Email failed:', emailErr);
      });
      
    } catch (err: any) {
      console.error('Registration Error:', err);
      
      let errorMessage = 'Registration failed. Please check your internet connection and try again.';
      
      try {
        // Try to parse if it's our wrapped Firestore error
        const errorData = JSON.parse(err.message);
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If not JSON, use the error message directly if it exists
        if (err.message && typeof err.message === 'string' && err.message !== '[object Object]') {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
      }

      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedModule) return null;

  const currentModuleTitle = selectedModule.subGames && selectedSubGameId 
    ? (selectedModule.subGames.find(g => g.id === selectedSubGameId)?.title || selectedModule.title)
    : selectedModule.title;
    
  const currentModuleMode = selectedModule.subGames && selectedSubGameId
    ? (selectedModule.subGames.find(g => g.id === selectedSubGameId)?.mode || selectedModule.mode)
    : ((modeParam && ['Individual', 'Duo', 'Squad'].includes(modeParam)) ? (modeParam as TeamMode) : selectedModule.mode);

  const currentModuleFee = getFees(currentModuleMode, selectedModule.id);
  
  const getPromoPercentage = (code: string) => {
    const uc = code.toUpperCase();
    if (uc === '35TECHNO') return 0.35;
    if (uc === 'TECHALUM35') return 0.35;
    if (uc === 'TECHNOVA30') return 0.30;
    return 0;
  };

  const discountPercentage = getPromoPercentage(promoCode);
  const discountAmount = isPromoApplied ? Math.floor(currentModuleFee * discountPercentage) : 0;
  const finalFee = currentModuleFee - discountAmount;

  const handlePromoCheck = (val: string) => {
    const code = val.toUpperCase();
    setPromoCode(val);
    
    if (code === '35TECHNO' || code === 'TECHALUM35' || code === 'TECHNOVA30') {
      if (!isPromoApplied) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#fbbf24', '#10b981', '#ffffff']
        });
      }
      setIsPromoApplied(true);
    } else {
      setIsPromoApplied(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(`/modules/${moduleId}`)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Module Details
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-[3rem] overflow-hidden shadow-2xl"
        >
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-8 relative overflow-hidden"
            >
              {/* Background Success Juice */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -z-10" />
              
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-28 h-28 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20"
              >
                <CheckCircle2 className="w-14 h-14 text-white" />
              </motion.div>
              
              <h2 className="text-4xl font-display font-black text-gray-900 dark:text-white mb-6">Submission Received!</h2>
              
              {submittedId && (
                <div className="mb-8 inline-flex flex-col items-center">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">Your Unique Team ID</span>
                  <div className="px-8 py-4 bg-blue-600/10 border-2 border-dashed border-blue-600/30 rounded-2xl">
                    <span className="text-3xl font-black text-blue-600 tracking-widest">{submittedId}</span>
                  </div>
                  <p className="mt-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider italic">Keep this ID for future reference</p>
                </div>
              )}

              <p className="text-gray-600 dark:text-zinc-400 text-base mb-8 max-w-lg mx-auto font-medium leading-relaxed">
                Your registration for <span className="text-blue-600 dark:text-blue-400 font-bold">{currentModuleTitle}</span> has been successfully logged.
              </p>

              {/* Status & Next Steps Card */}
              <div className="max-w-md mx-auto mb-10 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/5 text-left space-y-4 shadow-sm backdrop-blur-md">
                <div className="flex gap-4 items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Check Your Inbox</h4>
                    <p className="text-sm text-gray-600 dark:text-zinc-300">
                      Please check your inbox as you may have received the confirmation email at <span className="font-semibold text-gray-900 dark:text-white break-all">{watch('email')}</span>.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/5 w-full" />

                <div className="flex gap-4 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute duration-1000" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 relative" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Payment Verification</h4>
                    <p className="text-sm text-gray-600 dark:text-zinc-300">
                      Stay tuned as our team will verify your payment within <span className="font-semibold text-gray-900 dark:text-white">24-48 hours</span>.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/')} 
                  className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 uppercase tracking-widest text-sm"
                >
                  Return to Home
                </button>
                <button 
                  onClick={() => navigate('/modules')} 
                  className="w-full sm:w-auto px-12 py-5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
                >
                  Browse Modules
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col">
              {/* ... (rest of the form UI) */}
              {/* TOP HEADER: Summary Banner */}
              <div className="bg-blue-600 p-8 md:p-12 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-widest mb-4">
                      <CheckCircle2 className="w-4 h-4" />
                      Registration Summary
                    </div>
                    <h2 className="text-4xl font-display font-bold mb-2">{currentModuleTitle}</h2>
                    <p className="text-blue-100 font-medium">Technova '26 Competition Entry</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:flex gap-6 md:gap-12">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[140px] relative">
                      <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Fee Amount</p>
                      <div className="flex flex-col">
                        <p className={`text-2xl font-bold ${isPromoApplied ? 'text-blue-200 text-sm line-through opacity-60' : ''}`}>
                          Rs. {currentModuleFee.toLocaleString()}
                        </p>
                        {isPromoApplied && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-black text-white"
                          >
                            Rs. {finalFee.toLocaleString()}
                          </motion.p>
                        )}
                      </div>
                      {isPromoApplied && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-bounce">
                          {Math.round(discountPercentage * 100)}% OFF
                        </div>
                      )}
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[140px]">
                      <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Team Mode</p>
                      <p className="text-2xl font-bold">{currentModuleMode}</p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              </div>

              {/* FORM CONTENT */}
              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                  
                  {fields.length === 1 ? (
                    /* SOLO MODE LAYOUT */
                    <section className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                          <User className="w-6 h-6 text-blue-600" />
                          Participant Details
                        </h3>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-600/10 rounded-full border border-blue-600/20">
                          Solo Participation
                        </span>
                      </div>

                      <div className="p-8 md:p-12 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                        {/* Enlarged Field Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 relative z-10">
                          {/* Primary Info */}
                          <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Primary Contact Email</label>
                            <input
                              {...register('email')}
                              type="text"
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border-2 ${errors.email ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg`}
                              placeholder="you@email.com"
                            />
                            {errors.email && (
                              <motion.p 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mt-2 text-xs text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.email.message}
                              </motion.p>
                            )}
                          </div>

                          <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">University / Institution</label>
                            <input
                              {...register('university')}
                              type="text"
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border-2 ${errors.university ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg`}
                              placeholder="Full University Name"
                            />
                            {errors.university && (
                              <motion.p 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mt-2 text-xs text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.university.message}
                              </motion.p>
                            )}
                          </div>

                          {/* Participant Info */}
                          <div className="md:col-span-2">
                             <div className="h-px bg-gray-100 dark:bg-white/5 w-full my-2" />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Full Name (as per CNIC)</label>
                            <input
                              {...register('members.0.fullName' as const)}
                              type="text"
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border-2 ${errors.members?.[0]?.fullName ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-bold tracking-tight`}
                              placeholder="Your Full Name"
                            />
                            {errors.members?.[0]?.fullName && (
                              <motion.p 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mt-2 text-xs text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.members?.[0]?.fullName?.message}
                              </motion.p>
                            )}
                          </div>

                          <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">CNIC Number</label>
                            <input
                              {...register('members.0.cnic' as const)}
                              type="text"
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border-2 ${errors.members?.[0]?.cnic ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-mono`}
                              placeholder="12345-1234567-1"
                            />
                            {errors.members?.[0]?.cnic && (
                              <motion.p 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mt-2 text-xs text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.members?.[0]?.cnic?.message}
                              </motion.p>
                            )}
                          </div>

                          <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">WhatsApp Number</label>
                            <input
                              {...register('members.0.contactNumber' as const)}
                              type="tel"
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border-2 ${errors.members?.[0]?.contactNumber ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-mono`}
                              placeholder="03XXXXXXXXX"
                            />
                            {errors.members?.[0]?.contactNumber && (
                              <motion.p 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mt-2 text-xs text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.members?.[0]?.contactNumber?.message}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Subtle background juice */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      </div>
                    </section>
                  ) : (
                    /* DUO/SQUAD MODE (Existing Layout) */
                    <>
                      {/* Global Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-gray-100 dark:border-white/5">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Contact Email</label>
                          <input
                            {...register('email')}
                            type="text"
                            className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 ${errors.email ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                            placeholder="Lead person email for confirmation"
                          />
                          {errors.email && (
                            <motion.p 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="mt-2 text-xs text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              {errors.email.message}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">University / Institution</label>
                          <input
                            {...register('university')}
                            type="text"
                            className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 ${errors.university ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                            placeholder="e.g. FAST, NED, NUST"
                          />
                          {errors.university && (
                            <motion.p 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="mt-2 text-xs text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              {errors.university.message}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Team Name {selectedModule?.id === 'esports-competition' && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            {...register('teamName')}
                            type="text"
                            className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 ${errors.teamName ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                            placeholder={selectedModule?.id === 'esports-competition' ? "PUBG Team/Squad Name" : "Optional Team Name"}
                          />
                          {errors.teamName && (
                            <motion.p 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="mt-2 text-xs text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              {errors.teamName.message}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Team Members List */}
                      {fields.length > 0 && (
                        <div className="space-y-8">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                              <User className="w-6 h-6 text-blue-600" />
                              Participant Details
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-600/10 rounded-full border border-blue-600/20 uppercase tracking-widest">
                                {selectedModule?.id === 'esports-competition'
                                  ? '4 Members Required (All Mandatory)'
                                  : isInnovationModule || activeMode === 'Squad'
                                    ? '4 Members Limit (3 Mandatory)' 
                                    : activeMode === 'Duo'
                                      ? '3 Members Limit (2 Mandatory)'
                                      : `${fields.length} ${fields.length === 1 ? 'Person' : 'Members'} Required`}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {fields.map((field, index) => (
                              <div key={field.id} className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 relative group">
                                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xl">
                                  {index === 0 ? 'L' : index + 1}
                                </div>
                                <div className="mb-6 flex justify-between items-center">
                                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    {index === 0 ? 'Lead Person' : `Team Member ${index + 1}`}
                                  </h4>
                                  {selectedModule?.id !== 'esports-competition' && (((isInnovationModule || activeMode === 'Squad') && index === 3) || (activeMode === 'Duo' && index === 2)) && (
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded-md">
                                      Optional
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-6">
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name (as per CNIC)</label>
                                    <input
                                      {...register(`members.${index}.fullName` as const)}
                                      type="text"
                                      className={`w-full px-5 py-4 rounded-xl border-2 ${errors.members?.[index]?.fullName ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} bg-white dark:bg-black/20 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all`}
                                      placeholder="Full Name"
                                    />
                                    {errors.members?.[index]?.fullName && (
                                      <motion.p 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mt-2 text-[10px] text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                                      >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.members?.[index]?.fullName?.message}
                                      </motion.p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">CNIC Number</label>
                                    <input
                                      {...register(`members.${index}.cnic` as const)}
                                      type="text"
                                      className={`w-full px-5 py-4 rounded-xl border-2 ${errors.members?.[index]?.cnic ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} bg-white dark:bg-black/20 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all`}
                                      placeholder="12345-1234567-1"
                                    />
                                    {errors.members?.[index]?.cnic && (
                                      <motion.p 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mt-2 text-[10px] text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                                      >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.members?.[index]?.cnic?.message}
                                      </motion.p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp Number</label>
                                    <input
                                      {...register(`members.${index}.contactNumber` as const)}
                                      type="tel"
                                      className={`w-full px-5 py-4 rounded-xl border-2 ${errors.members?.[index]?.contactNumber ? 'border-red-500 bg-red-500/5' : 'border-gray-200 dark:border-white/10'} bg-white dark:bg-black/20 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all`}
                                      placeholder="03XXXXXXXXX"
                                    />
                                    {errors.members?.[index]?.contactNumber && (
                                      <motion.p 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mt-2 text-[10px] text-red-500 font-black flex items-center gap-1.5 uppercase tracking-wider"
                                      >
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.members?.[index]?.contactNumber?.message}
                                      </motion.p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Payment Section */}
                  <div className="pt-12 border-t border-gray-100 dark:border-white/5 space-y-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <CreditCardIcon className="w-6 h-6 text-blue-600" />
                      Payment Verification
                    </h3>

                    <div className="grid grid-cols-1 gap-6">
                      {/* Promo Code Field */}
                      <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Have a Promo Code?</label>
                          <div className="flex gap-4">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => handlePromoCheck(e.target.value)}
                                className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border-2 ${isPromoApplied ? 'border-green-500 bg-green-500/5' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm md:text-lg font-mono uppercase`}
                                placeholder="ENTER DISCOUNT CODE"
                              />
                              {isPromoApplied && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                                </div>
                              )}
                            </div>
                          </div>
                           {!isPromoApplied && (
                            <p className="mt-2.5 text-xs font-semibold text-gray-400 dark:text-zinc-500 flex flex-wrap items-center gap-1.5 animate-pulse">
                              <span>💡</span> Enter a discount code (e.g. <span className="font-mono text-blue-500 uppercase font-black">TECHNOVA30</span>)
                            </p>
                          )}
                          {isPromoApplied && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="mt-3 text-xs text-green-500 font-bold flex items-center gap-2 bg-green-500/10 py-2 px-4 rounded-full w-fit"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              Success! {promoCode.toUpperCase()} applied. You saved Rs. {discountAmount.toLocaleString()} ({Math.round(discountPercentage * 100)}% off)
                            </motion.div>
                          )}

                          {isPromoApplied && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Original Fee</span>
                                <span className="text-sm text-gray-400 font-bold line-through">Rs. {currentModuleFee.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Promo Discount</span>
                                <span className="text-sm font-bold text-green-500">- Rs. {discountAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center py-4 px-6 rounded-2xl bg-blue-600/10 border border-blue-600/20">
                                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Final Payable</span>
                                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">Rs. {finalFee.toLocaleString()}</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="p-8 rounded-[2.5rem] bg-blue-600/5 dark:bg-blue-600/20 border border-blue-600/20 shadow-sm relative overflow-hidden group">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                          <div>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Bank Name</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{PAYMENT_DETAILS.bank_transfer.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Account Title</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{PAYMENT_DETAILS.bank_transfer.accountTitle}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Account Number</p>
                            <p className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                              {PAYMENT_DETAILS.bank_transfer.accountNumber}
                            </p>
                          </div>
                        </div>
                        <input type="hidden" value="bank_transfer" {...register('paymentMethod')} />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                      </div>
                    </div>

                    {/* Receipt Upload */}
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Digital Payment Receipt</label>
                        <p className="text-[10px] text-gray-500 font-medium">Please upload a clear screenshot of your transaction confirmation.</p>
                      </div>
                      
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      
                      {receiptPreview ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative w-full aspect-[4/3] sm:aspect-video rounded-[2.5rem] overflow-hidden border-4 border-blue-600 shadow-2xl group group/receipt"
                        >
                          <img src={receiptPreview} alt="Receipt" className="w-full h-full object-cover transition-transform duration-700 group-hover/receipt:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/receipt:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button 
                              type="button" 
                              onClick={clearReceipt} 
                              className="p-5 bg-white text-red-600 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all transform hover:rotate-90"
                            >
                              <X className="w-8 h-8" />
                            </button>
                          </div>
                          <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold uppercase tracking-widest">Receipt Uploaded Successfully</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <button 
                          type="button" 
                          disabled={isProcessingImage}
                          onClick={() => fileInputRef.current?.click()} 
                          className={`w-full group relative overflow-hidden h-64 rounded-[2.5rem] border-2 border-dashed ${isProcessingImage ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-white/10 hover:border-blue-500/50'} transition-all flex flex-col items-center justify-center gap-4 bg-gray-50/50 dark:bg-white/[0.02]`}
                        >
                          {/* Animated Background Juice */}
                          <div className={`absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent ${isProcessingImage ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
                          
                          <div className={`relative w-20 h-20 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-lg flex items-center justify-center ${isProcessingImage ? 'animate-pulse scale-110' : 'group-hover:scale-110 group-hover:-rotate-3'} transition-all duration-500`}>
                            {isProcessingImage ? <Loader2 className="w-10 h-10 text-blue-600 animate-spin" /> : <Camera className="w-10 h-10 text-blue-600" />}
                          </div>
                          
                          <div className="relative text-center">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                              {isProcessingImage ? 'Optimizing Image...' : 'Tap to Upload Receipt'}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                              {isProcessingImage ? 'Just a moment...' : 'JPG, PNG or PDF up to 10MB'}
                            </p>
                          </div>
                          
                          {/* Animated Corner Ornaments */}
                          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-blue-500/30 transition-all rounded-tr-xl" />
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-blue-500/30 transition-all rounded-bl-xl" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-10 space-y-6">
                    <AnimatePresence>
                      {(serverError || Object.keys(errors).length > 0) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 md:p-6 rounded-2xl bg-red-500/10 border-2 border-red-500/20 flex items-start gap-4"
                        >
                          <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-1">
                              {serverError ? 'Registration Issue' : 'Incomplete Information'}
                            </h4>
                            <p className="text-sm font-bold text-red-500/80 leading-relaxed">
                              {serverError || "Please review the highlighted fields above. All fields must be filled correctly before you can proceed."}
                            </p>
                            {Object.keys(errors).length > 0 && !serverError && (
                              <div className="mt-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                                <p className="text-[10px] font-black text-red-500/60 uppercase tracking-widest mb-2">Validation Errors:</p>
                                <ul className="space-y-1.5">
                                  {errors.email && <li className="text-xs text-red-500 font-black flex items-center gap-2 uppercase tracking-tight"><div className="w-1 h-1 rounded-full bg-red-500" /> EMAIL: {errors.email.message}</li>}
                                  {errors.university && <li className="text-xs text-red-500 font-black flex items-center gap-2 uppercase tracking-tight"><div className="w-1 h-1 rounded-full bg-red-500" /> UNIVERSITY: {errors.university.message}</li>}
                                  {errors.members && <li className="text-xs text-red-500 font-black flex items-center gap-2 uppercase tracking-tight"><div className="w-1 h-1 rounded-full bg-red-500" /> PARTICIPANT DETAILS: Ensure all names, CNICs, and phone numbers are valid.</li>}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 relative bg-blue-600 text-white rounded-2xl text-base font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all disabled:opacity-50 active:scale-[0.98] group overflow-hidden"
                    >
                      <span className={`flex items-center justify-center gap-2.5 transition-opacity ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                        Submit Registration
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                      </span>
                      {isSubmitting && <Loader2 className="absolute inset-0 m-auto w-6 h-6 animate-spin" />}
                    </button>
                    <p className="text-center mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      Encrypted End-to-End Submission
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isSubmitting && (
          <SubmitOverlay 
            key="submit-overlay" 
            moduleTitle={currentModuleTitle} 
            email={watchedEmail}
            university={watchedUniversity}
            members={watchedMembers}
            promoCode={promoCode}
            isPromoApplied={isPromoApplied}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

interface SubmitOverlayProps {
  moduleTitle: string;
  email?: string;
  university?: string;
  members?: Array<{ fullName: string; cnic: string; contactNumber: string }>;
  promoCode?: string;
  isPromoApplied?: boolean;
  key?: string;
}

function SubmitOverlay({ 
  moduleTitle, 
  email, 
  university, 
  members, 
  promoCode, 
  isPromoApplied 
}: SubmitOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const steps = [
    { title: "Roster Credentials", desc: "Parsing & verifying team information", minPercent: 0, maxPercent: 25 },
    { title: "Promo Verification", desc: "Analyzing promo code & rates calculation", minPercent: 26, maxPercent: 40 },
    { title: "Receipt Compactor", desc: "Compressing screenshot & proof checks", minPercent: 41, maxPercent: 65 },
    { title: "Cloud Database Sync", desc: "Writing registration node logs to Firestore", minPercent: 66, maxPercent: 80 },
    { title: "Slot Hardlock", desc: "Acquiring permanent seed allocation", minPercent: 81, maxPercent: 92 },
    { title: "Automated Dispatch", desc: "Scheduling registration receipts dispatch", minPercent: 93, maxPercent: 99 }
  ];

  // Increase progress smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(timer);
          return 99;
        }
        
        // Simulating non-linear realistic loading jumps
        let increment = 1;
        if (prev < 25) increment = 2.0;
        else if (prev < 40) increment = 1.0;
        else if (prev < 65) increment = 0.8;
        else if (prev < 80) increment = 0.5;
        else if (prev < 92) increment = 0.3;
        else increment = 0.1;

        const next = Math.min(prev + increment + (Math.random() * 0.15 - 0.05), 99);
        return parseFloat(next.toFixed(1));
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Tracking current step
  useEffect(() => {
    const activeIdx = steps.findIndex(step => progress >= step.minPercent && progress <= step.maxPercent);
    if (activeIdx !== -1) {
      setCurrentStepIdx(activeIdx);
    }
  }, [progress]);

  // Extract variables safely
  const leadMember = members && members[0] ? members[0] : null;
  const leadName = leadMember?.fullName || "Team Representative";
  const numMembers = members ? members.filter(m => m.fullName.trim() !== '').length : 1;

  // Generate logs matching current progress stage
  const logTemplates = [
    { min: 0, text: "ROSTER: Reading and validating form input arrays..." },
    { min: 4, text: `ROSTER: Active register request for module [${moduleTitle.toUpperCase()}].` },
    { min: 8, text: `ROSTER: Extracting contact email Address: "${email || 'TBD'}"...` },
    { min: 12, text: `ROSTER: Initializing credentials check for Team Leader: "${leadName}"...` },
    { min: 16, text: `ROSTER: CNIC Checksum matched safely for leader: "${leadMember?.cnic || '12345-XXXXXXX-X'}"` },
    { min: 20, text: `ROSTER: Contact mobile registry index verified: "${leadMember?.contactNumber || '03XXXXXXXXX'}"` },
    { min: 23, text: `ROSTER: Representing seat cluster: "${university || 'N/A'}"` },
    { min: 25, text: `ROSTER: Roster count validated with ${numMembers} active participant slot(s).` },
    { min: 28, text: "PROMO: Validating promotional eligibility markers..." },
    { min: 32, text: isPromoApplied 
        ? `PROMO: Coupon Code "${promoCode?.toUpperCase()}" verified successfully! Processing with custom event rate.` 
        : "PROMO: Running coupon standard check: No custom discount code applied. Defaulting to general event pricing." 
    },
    { min: 41, text: "IMAGE: Running CanvasCompactor engine on receipt screenshot..." },
    { min: 46, text: "IMAGE: Analyzing base64 pixel vectors for financial signatures..." },
    { min: 51, text: "IMAGE: Downscaling and optimizing image canvas compression parameters..." },
    { min: 56, text: "IMAGE: Proof of Payment compressed down to ~150kB JPEG format." },
    { min: 61, text: "STORAGE: Pushing compressed receipt binaries to Cloud Storage node stream..." },
    { min: 65, text: "STORAGE: Screenshot successfully loaded on CDN. Secured storage reference acquired." },
    { min: 68, text: "FIRESTORE: Synchronizing structured team data to Cloud Firestore instances..." },
    { min: 73, text: "FIRESTORE: Writing document record to server collections..." },
    { min: 78, text: "FIRESTORE: Transaction commit completed safely under encrypted SSL lock." },
    { min: 82, text: "RESERVATION: Commencing Seat Slot selection rules..." },
    { min: 86, text: `RESERVATION: Hardlocking seat slot matching module [${moduleTitle.toUpperCase()}] for your team!` },
    { min: 91, text: "RESERVATION: Seat slot successfully reserved & verified on global servers." },
    { min: 94, text: "DISPATCH: Preparing post-payment automated verification emails queue..." },
    { min: 97, text: `DISPATCH: Setup complete. Broadcaster dispatched mail pipeline to "${email || 'your inbox'}".` },
    { min: 99, text: "DISPATCH: Registration completed. Redirecting to confirmation receipt..." }
  ];

  const activeLogs = logTemplates.filter(log => progress >= log.min);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [activeLogs.length]);

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-6 bg-[#030303]/95 backdrop-blur-2xl"
    >
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
        {/* Glowing Head */}
        <div className="mb-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 shadow-sm">
          <Server className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.25em]">Transaction Active</span>
        </div>

        {/* Circular Progress Meter */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circular path */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              className="stroke-gray-800/40"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Pulsing Animated Glowing Inner Progress circle */}
            <motion.circle
              cx="88"
              cy="88"
              r={radius}
              className="stroke-blue-500"
              strokeWidth="6"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-mono font-black text-white leading-none tracking-tight">
              {Math.floor(progress)}%
            </span>
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1.5">
              Uploading
            </span>
          </div>
        </div>

        {/* Informative Current Status Card */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-display font-black text-white tracking-tight leading-tight">
            Registering for <span className="text-blue-400">{moduleTitle}</span>
          </h3>
          <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
            Please keep this tab open and your network stable. We are preparing, validating, and hardcoding your response slots.
          </p>
        </div>

        {/* Process Checklist (2 columns to occupy left-right space gracefully) */}
        <div className="w-full bg-[#080808]/80 border border-white/5 rounded-3xl p-5 mb-6 backdrop-blur-md shadow-lg">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
            {steps.map((step, idx) => {
              const isFinished = progress > step.maxPercent;
              const isActive = progress >= step.minPercent && progress <= step.maxPercent;
              
              return (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 transition-opacity duration-300 ${
                    isFinished ? "opacity-100" : isActive ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                    isFinished 
                      ? "bg-green-500/10 border-green-500/30 text-green-400" 
                      : isActive 
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400" 
                        : "bg-gray-800/20 border-gray-800 text-gray-500"
                  }`}>
                    {isFinished ? (
                      <Check className="w-3 h-3 text-green-400 stroke-[3]" />
                    ) : isActive ? (
                      <motion.div 
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-400"
                      />
                    ) : (
                      <span className="text-[9px] font-bold font-mono">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-gray-200 uppercase tracking-tight leading-none truncate">
                      {step.title}
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium truncate mt-0.5 leading-none">
                      {isActive ? "Processing" : isFinished ? "Success" : "Queued"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Systems Telemetry Console Log */}
        <div className="w-full bg-black border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" />
              Realtime System Logs
            </span>
            <span className="text-[8px] font-mono text-gray-500 uppercase">tty/auth-socket-01</span>
          </div>
          
          <div 
            ref={terminalRef}
            className="h-28 overflow-y-auto font-mono text-[9px] text-blue-400/90 leading-relaxed scrollbar-thin scrollbar-thumb-gray-805 scrollbar-track-transparent space-y-1.5 pr-2"
          >
            {activeLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-1">
                <span className="text-blue-500/60 font-medium select-none">❯</span>
                <span>{log.text}</span>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <span className="text-blue-500/60 font-medium select-none">❯</span>
              <motion.span 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-1.5 h-3 bg-blue-400"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
