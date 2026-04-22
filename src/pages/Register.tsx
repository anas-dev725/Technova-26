import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Upload, X, User, ShieldCheck, Camera, Gamepad2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { modules, getFees } from '../data/modules';

// Validation Schema
const memberSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d{1}$/, 'CNIC must be 12345-1234567-1'),
  contactNumber: z.string().regex(/^((\+92)|(0092)|(0))3\d{9}$/, 'Enter valid mobile number (03XXXXXXXXX)'),
});

const registerSchema = z.object({
  subGameId: z.string().optional(),
  email: z.string().email('Invalid contact email address'),
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
  
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const selectedModule = modules.find(m => m.id === moduleId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      university: '',
      members: [],
      subGameId: gameParam || '',
      paymentMethod: 'bank_transfer'
    }
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "members"
  });

  const selectedSubGameId = watch('subGameId');

  useEffect(() => {
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
      } else {
        const count = selectedModule.mode === 'Individual' ? 1 : selectedModule.mode === 'Duo' ? 2 : 4;
        replace(Array(count).fill({ fullName: '', cnic: '', contactNumber: '' }));
      }
    }
  }, [selectedModule, moduleId, navigate, replace, selectedSubGameId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Final Registration Data:', { ...data, module: selectedModule?.title });
      setIsSubmitted(true);
    } catch (err) {
      setServerError('Registration failed. Server is currently under high load.');
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
    : selectedModule.mode;

  const currentModuleFee = getFees(currentModuleMode, selectedModule.id);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
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
            <div className="text-center py-20 px-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, type: "spring" }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </motion.div>
              <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">Application Under Review</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-lg mx-auto">
                We've received your registration for <strong>{currentModuleTitle}</strong>. Our team will verify the <strong>Payment Receipt</strong> and email you at <span className="text-blue-600 font-bold">{watch('email')}</span> shortly.
              </p>
              <button onClick={() => navigate('/')} className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
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
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[140px]">
                      <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Fee Amount</p>
                      <p className="text-2xl font-bold">Rs. {currentModuleFee.toLocaleString()}</p>
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
                              type="email"
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg`}
                              placeholder="you@email.com"
                            />
                            {errors.email && <p className="mt-2 text-xs text-red-500 font-medium">{errors.email.message}</p>}
                          </div>

                          <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">University / Institution</label>
                            <input
                              {...register('university')}
                              type="text"
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border ${errors.university ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg`}
                              placeholder="Full University Name"
                            />
                            {errors.university && <p className="mt-2 text-xs text-red-500 font-medium">{errors.university.message}</p>}
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
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border ${errors.members?.[0]?.fullName ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-bold tracking-tight`}
                              placeholder="Your Full Name"
                            />
                            {errors.members?.[0]?.fullName && <p className="mt-2 text-xs text-red-500 font-medium">{errors.members?.[0]?.fullName?.message}</p>}
                          </div>

                          <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">CNIC Number</label>
                            <input
                              {...register('members.0.cnic' as const)}
                              type="text"
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border ${errors.members?.[0]?.cnic ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-mono`}
                              placeholder="12345-1234567-1"
                            />
                            {errors.members?.[0]?.cnic && <p className="mt-2 text-xs text-red-500 font-medium">{errors.members?.[0]?.cnic?.message}</p>}
                          </div>

                          <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">WhatsApp Number</label>
                            <input
                              {...register('members.0.contactNumber' as const)}
                              type="tel"
                              className={`w-full px-6 py-5 rounded-2xl bg-white dark:bg-black/20 border ${errors.members?.[0]?.contactNumber ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-mono`}
                              placeholder="03XXXXXXXXX"
                            />
                            {errors.members?.[0]?.contactNumber && <p className="mt-2 text-xs text-red-500 font-medium">{errors.members?.[0]?.contactNumber?.message}</p>}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 border-b border-gray-100 dark:border-white/5">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Contact Email</label>
                          <input
                            {...register('email')}
                            type="email"
                            className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                            placeholder="Lead person email for confirmation"
                          />
                          {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">University / Institution</label>
                          <input
                            {...register('university')}
                            type="text"
                            className={`w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border ${errors.university ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                            placeholder="e.g. FAST, NED, NUST"
                          />
                          {errors.university && <p className="mt-1 text-xs text-red-500 font-medium">{errors.university.message}</p>}
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
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-600/10 rounded-full border border-blue-600/20">
                              {fields.length} {fields.length === 1 ? 'Person' : 'Members'} Required
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {fields.map((field, index) => (
                              <div key={field.id} className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 relative group">
                                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xl">
                                  {index === 0 ? 'L' : index + 1}
                                </div>
                                <div className="mb-6">
                                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                    {index === 0 ? 'Lead Person' : `Team Member ${index + 1}`}
                                  </h4>
                                </div>
                                <div className="space-y-6">
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name (as per CNIC)</label>
                                    <input
                                      {...register(`members.${index}.fullName` as const)}
                                      type="text"
                                      className={`w-full px-5 py-4 rounded-xl border ${errors.members?.[index]?.fullName ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} bg-white dark:bg-black/20 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all`}
                                      placeholder="Full Name"
                                    />
                                    {errors.members?.[index]?.fullName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.members?.[index]?.fullName?.message}</p>}
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">CNIC Number</label>
                                    <input
                                      {...register(`members.${index}.cnic` as const)}
                                      type="text"
                                      className={`w-full px-5 py-4 rounded-xl border ${errors.members?.[index]?.cnic ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} bg-white dark:bg-black/20 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all`}
                                      placeholder="12345-1234567-1"
                                    />
                                    {errors.members?.[index]?.cnic && <p className="mt-1 text-xs text-red-500 font-medium">{errors.members?.[index]?.cnic?.message}</p>}
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp Number</label>
                                    <input
                                      {...register(`members.${index}.contactNumber` as const)}
                                      type="tel"
                                      className={`w-full px-5 py-4 rounded-xl border ${errors.members?.[index]?.contactNumber ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} bg-white dark:bg-black/20 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all`}
                                      placeholder="03XXXXXXXXX"
                                    />
                                    {errors.members?.[index]?.contactNumber && <p className="mt-1 text-xs text-red-500 font-medium">{errors.members?.[index]?.contactNumber?.message}</p>}
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
                              onClick={() => setReceiptPreview(null)} 
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
                          onClick={() => fileInputRef.current?.click()} 
                          className="w-full group relative overflow-hidden h-64 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-4 bg-gray-50/50 dark:bg-white/[0.02]"
                        >
                          {/* Animated Background Juice */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="relative w-20 h-20 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                            <Camera className="w-10 h-10 text-blue-600" />
                          </div>
                          
                          <div className="relative text-center">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Tap to Upload Receipt</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">JPG, PNG or PDF up to 5MB</p>
                          </div>
                          
                          {/* Animated Corner Ornaments */}
                          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-blue-500/30 transition-all rounded-tr-xl" />
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-transparent group-hover:border-blue-500/30 transition-all rounded-bl-xl" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-10">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-20 relative bg-blue-600 text-white rounded-[2rem] text-xl font-bold shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all disabled:opacity-50 active:scale-[0.98] group overflow-hidden"
                    >
                      <span className={`flex items-center justify-center gap-3 transition-opacity ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                        Submit Registration
                        <ArrowLeft className="w-6 h-6 rotate-180" />
                      </span>
                      {isSubmitting && <Loader2 className="absolute inset-0 m-auto w-10 h-10 animate-spin" />}
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
