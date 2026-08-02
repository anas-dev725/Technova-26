import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  onSnapshot,
  Timestamp,
  runTransaction,
  getDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface TeamMember {
  fullName: string;
  cnic: string;
  contactNumber: string;
}

export interface Submission {
  id?: string;
  participantId?: string; // e.g., PE-001
  moduleId: string;
  moduleTitle: string;
  subGameId?: string;
  subGameTitle?: string;
  email: string;
  university: string;
  teamName?: string;
  members: TeamMember[];
  receiptBase64: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: any;
  totalFee: number;
  promoCode?: string;
  discountApplied?: number;
  exempted?: boolean;
  checkedIn?: boolean;
  checkedInAt?: any;
}

export const MODULE_PREFIXES: Record<string, string> = {
  'fyp-warriors': 'FW',
  'startup-launchpad': 'SL',
  'capture-the-flag': 'CTF',
  'agentic-ai-arena': 'AA',
  'datathon': 'DT',
  'prompt-engineering': 'PE',
  'esports-competition': 'ESP',
  'maths-mania': 'MMA',
  'maths-mania-advanced': 'MMJ'
};

function getParticipantPrefix(moduleId: string): string {
  return MODULE_PREFIXES[moduleId] || 'TX';
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
  }
}

function handleFirestoreError(error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null): never {
  const user = auth.currentUser;
  
  let errorMessage = error.message || 'Unknown Firestore error';
  
  // Specific handling for common errors
  if (errorMessage.includes('too large') || errorMessage.includes('1,048,576 bytes')) {
    errorMessage = 'The payment receipt image is too large. Please try a smaller or lower resolution image.';
  } else if (errorMessage.includes('permission-denied') || errorMessage.includes('insufficient permissions')) {
    errorMessage = 'Permission denied. Please ensure you are logged in and following all registration rules.';
  }

  const errorInfo: FirestoreErrorInfo = {
    error: errorMessage,
    operationType,
    path,
    authInfo: {
      userId: user?.uid || 'anonymous',
      email: user?.email || 'none',
      emailVerified: user?.emailVerified || false,
      isAnonymous: user?.isAnonymous || true,
    }
  };
  throw new Error(JSON.stringify(errorInfo));
}

export function isUniversityStudent(institutionName: string): boolean {
  if (!institutionName) return true;
  const clean = institutionName.toLowerCase().trim();

  // Specific check for Pace / Pace College
  if (clean.includes('pace')) {
    return false;
  }

  // Known school/college indicators that are NOT universities
  const schoolCollegeKeywords = [
    'pace', 'pace college', 'college', 'school', 'lyceum', 'grammar', 'high school', 
    'intermediate', 'inter', 'matric', 'o level', 'a level', 'o/a level', 'o-level', 
    'a-level', 'cadet', 'secondary', 'beaconhouse', 'city school', 'army public', 
    'aps', 'whales', 'cordoba', 'cedar', 'alpha', 'adamjee', 'commecs', 'dj science', 
    'st. patrick', 'st. joseph', 'st. paul', 'habib public', 'bamm', 'degree college',
    'khalid', 'forman christian college school', 'academy'
  ];

  // University indicators
  const uniKeywords = [
    'university', 'uni', 'iobm', 'cbm', 'ccsis', 'fast', 'nuces', 'ned', 'ssuet', 
    'szabist', 'iba', 'nust', 'lums', 'comsats', 'nhu', 'uit', 'dsu', 'bahria', 
    'karachi university', 'ku', 'ubit', 'duet', 'dawood', 'indus', 'hamdard', 
    'greenwich', 'iqra', 'kiet', 'paf-kiet', 'ziauddin', 'aku', 'pnec', 'giki', 
    'cust', 'pieas', 'umt', 'uol', 'ucl', 'ucp', 'bnu', 'fccu', 'institute'
  ];

  const hasUniKeyword = uniKeywords.some(k => {
    if (k.length <= 4) {
      const regex = new RegExp(`\\b${k}\\b`, 'i');
      return regex.test(clean);
    }
    return clean.includes(k);
  });

  const hasSchoolKeyword = schoolCollegeKeywords.some(k => {
    if (k.length <= 4) {
      const regex = new RegExp(`\\b${k}\\b`, 'i');
      return regex.test(clean);
    }
    return clean.includes(k);
  });

  if (hasSchoolKeyword && !clean.includes('university') && !clean.includes('iobm')) {
    return false;
  }

  if (hasUniKeyword) return true;
  if (hasSchoolKeyword) return false;

  return true;
}

// Local Cache Helpers for zero-latency, offline, and quota-resilient operation
const LOCAL_CACHE_KEY = 'technova_submissions_cache_v2';

function getLocalSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Remove any temporary seed entries to keep user's original data untainted
      return parsed.filter(item => item && !item.id?.startsWith('sub_seed_'));
    }
    return [];
  } catch (e) {
    console.error('Error reading local submissions cache:', e);
    return [];
  }
}

function saveLocalSubmissions(subs: Submission[]) {
  try {
    // Strip large base64 receipt images to prevent localStorage 5MB quota errors
    const sanitized = subs.map(s => {
      if (s.receiptBase64 && s.receiptBase64.length > 200) {
        const { receiptBase64, ...rest } = s;
        return rest as Submission;
      }
      return s;
    });
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.warn('LocalStorage save failed, attempting minimal cache prune:', e);
    try {
      // Emergency fallback: keep only essential fields for venue check-in
      const minimal = subs.map(s => ({
        id: s.id,
        participantId: s.participantId,
        teamName: s.teamName,
        email: s.email,
        university: s.university,
        moduleId: s.moduleId,
        moduleTitle: s.moduleTitle,
        status: s.status,
        checkedIn: s.checkedIn,
        checkedInAt: s.checkedInAt,
        exempted: s.exempted,
        totalFee: s.totalFee,
        submittedAt: s.submittedAt,
        members: (s.members || []).map(m => ({ fullName: m.fullName, cnic: m.cnic, contactNumber: m.contactNumber }))
      }));
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(minimal));
    } catch (quotaErr) {
      console.error('LocalStorage quota exceeded completely:', quotaErr);
    }
  }
}

function updateLocalSubmissionItem(id: string, updates: Partial<Submission>) {
  const list = getLocalSubmissions();
  const idx = list.findIndex(s => s.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    saveLocalSubmissions(list);
  }
}

function deleteLocalSubmissionItem(id: string) {
  const list = getLocalSubmissions();
  const filtered = list.filter(s => s.id !== id);
  saveLocalSubmissions(filtered);
}

function mergeSubmissions(remoteDocs: Submission[], localDocs: Submission[]): Submission[] {
  const map = new Map<string, Submission>();

  localDocs.forEach(item => {
    if (item.id) map.set(item.id, item);
  });

  remoteDocs.forEach(item => {
    if (item.id) {
      const existingLocal = map.get(item.id);
      if (existingLocal) {
        map.set(item.id, {
          ...item,
          checkedIn: item.checkedIn ?? existingLocal.checkedIn,
          checkedInAt: item.checkedInAt ?? existingLocal.checkedInAt,
          status: item.status || existingLocal.status,
          exempted: item.exempted ?? existingLocal.exempted,
        });
      } else {
        map.set(item.id, item);
      }
    }
  });

  const merged = Array.from(map.values());
  saveLocalSubmissions(merged);
  return merged;
}

export const submissionService = {
  async createSubmission(submission: Omit<Submission, 'id' | 'status' | 'submittedAt' | 'participantId'>) {
    const prefix = getParticipantPrefix(submission.moduleId);
    
    // Save to local cache first for resilience
    const tempId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();
    
    const localSubmission: Submission = {
      ...submission,
      id: tempId,
      participantId: `${prefix}-${Math.floor(Math.random() * 900 + 100)}`,
      status: 'pending',
      submittedAt: nowIso,
      checkedIn: false
    };

    const currentLocal = getLocalSubmissions();
    saveLocalSubmissions([localSubmission, ...currentLocal]);

    try {
      const countersRef = doc(db, 'counters', submission.moduleId);
      
      const result = await runTransaction(db, async (transaction) => {
        // 1. Get or initialize counter
        const counterDoc = await transaction.get(countersRef);
        let newCount = 1;
        
        if (counterDoc.exists()) {
          newCount = counterDoc.data().count + 1;
          transaction.update(countersRef, { count: newCount });
        } else {
          transaction.set(countersRef, { count: 1 });
        }

        // 2. Generate Participant ID
        const sequentialNumber = newCount.toString().padStart(3, '0');
        const participantId = `${prefix}-${sequentialNumber}`;

        // 3. Prepare Submission Data
        const cleanData = Object.fromEntries(
          Object.entries(submission).filter(([_, v]) => v !== undefined)
        );

        const newSubmissionRef = doc(collection(db, 'submissions'));
        
        transaction.set(newSubmissionRef, {
          ...cleanData,
          participantId,
          status: 'pending',
          submittedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        return { id: newSubmissionRef.id, participantId };
      });

      // Replace local temp submission with canonical remote submission
      const updatedList = getLocalSubmissions().map(s => {
        if (s.id === tempId) {
          return {
            ...localSubmission,
            id: result.id,
            participantId: result.participantId
          };
        }
        return s;
      });
      saveLocalSubmissions(updatedList);

      return result;
    } catch (error) {
      console.warn('Firestore createSubmission failed/quota reached, using local entry:', error);
      return { id: tempId, participantId: localSubmission.participantId };
    }
  },

  async getSubmissionsByStatus(status?: Submission['status']) {
    try {
      let q = query(collection(db, 'submissions')) as any;
      if (status) {
        q = query(q, where('status', '==', status));
      }
      const snapshot = await getDocs(q);
      const remoteData = snapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        return { 
          id: docSnap.id, 
          ...data,
          submittedAt: data.submittedAt || data.createdAt 
        } as Submission;
      });

      const merged = mergeSubmissions(remoteData, getLocalSubmissions());
      return merged.filter(s => !status || s.status === status);
    } catch (error) {
      console.warn('getSubmissionsByStatus error/quota reached, serving local cache:', error);
      const localData = getLocalSubmissions();
      return localData.filter(s => !status || s.status === status);
    }
  },

  subscribeToSubmissions(callback: (submissions: Submission[]) => void) {
    // 1. Instantly return cached submissions for zero latency UI rendering
    const cached = getLocalSubmissions();
    if (cached.length > 0) {
      callback(cached);
    }

    const q = query(collection(db, 'submissions'));
    let isCancelled = false;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isCancelled) return;
      
      const remoteSubmissions = snapshot.docs.map(docSnap => {
        const data = docSnap.data() as any;
        return { 
          id: docSnap.id, 
          ...data,
          submittedAt: data.submittedAt || data.createdAt 
        } as Submission;
      });

      const merged = mergeSubmissions(remoteSubmissions, getLocalSubmissions());

      merged.sort((a, b) => {
        const timeA = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : (typeof a.submittedAt === 'number' ? a.submittedAt : (new Date(a.submittedAt || 0).getTime() || 0));
        const timeB = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : (typeof b.submittedAt === 'number' ? b.submittedAt : (new Date(b.submittedAt || 0).getTime() || 0));
        return timeB - timeA;
      });

      callback(merged);
    }, (error) => {
      console.warn('Firestore onSnapshot subscription warning (Quota / Network), maintaining cached dataset:', error);
      const localData = getLocalSubmissions();
      callback(localData);
    });

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  },

  async updateStatus(submissionId: string, status: Submission['status']) {
    updateLocalSubmissionItem(submissionId, { status });
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await updateDoc(docRef, { 
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.warn('Firestore updateStatus background write error:', error);
    }
  },

  async toggleExempted(submissionId: string, exempted: boolean) {
    updateLocalSubmissionItem(submissionId, { exempted });
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await updateDoc(docRef, { 
        exempted,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.warn('Firestore toggleExempted background write error:', error);
    }
  },

  async toggleCheckIn(submissionId: string, checkedIn: boolean) {
    const checkedInAt = checkedIn ? new Date().toISOString() : null;
    updateLocalSubmissionItem(submissionId, { checkedIn, checkedInAt });
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await updateDoc(docRef, { 
        checkedIn,
        checkedInAt: checkedIn ? serverTimestamp() : null,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.warn('Firestore toggleCheckIn background write error:', error);
    }
  },

  async deleteSubmission(submissionId: string) {
    deleteLocalSubmissionItem(submissionId);
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn('Firestore deleteSubmission background write error:', error);
    }
  },

  async migrateMissingIds() {
    try {
      // Fetch all submissions sorted by original submission time
      const q = query(collection(db, 'submissions'), orderBy('submittedAt', 'asc'));
      const snapshot = await getDocs(q);
      
      const moduleCounters: Record<string, number> = {};
      const batch: { id: string, participantId: string }[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Submission;
        const moduleId = data.moduleId;
        
        // Track valid module submissions
        moduleCounters[moduleId] = (moduleCounters[moduleId] || 0) + 1;

        if (!data.participantId) {
          const prefix = getParticipantPrefix(moduleId);
          const sequentialNumber = moduleCounters[moduleId].toString().padStart(3, '0');
          const participantId = `${prefix}-${sequentialNumber}`;
          
          batch.push({ id: docSnap.id, participantId });
        }
      }

      // Execute updates individually (small counts expected)
      for (const item of batch) {
        const docRef = doc(db, 'submissions', item.id);
        await updateDoc(docRef, { 
          participantId: item.participantId,
          updatedAt: serverTimestamp()
        });
      }

      return batch.length;
    } catch (error) {
      handleFirestoreError(error, 'write', 'migration');
    }
  },

  async checkIsAdmin(email: string): Promise<boolean> {
    const adminEmails = ['anasmobin0@gmail.com', 'technova26@technova.com'];
    if (adminEmails.includes(email.toLowerCase())) return true;
    
    try {
      const q = query(collection(db, 'admins'), where('email', '==', email.toLowerCase()));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error("Admin check failed:", error);
      return false;
    }
  },

  async syncCounters(submissions: Submission[]) {
    const modulesSubmissions: Record<string, number> = {};
    
    // Group by moduleId
    submissions.forEach(s => {
      modulesSubmissions[s.moduleId] = (modulesSubmissions[s.moduleId] || 0) + 1;
    });

    for (const moduleId of Object.keys(modulesSubmissions)) {
      const count = modulesSubmissions[moduleId];
      const counterRef = doc(db, 'counters', moduleId);
      await setDoc(counterRef, { count });
    }
    
    return Object.keys(modulesSubmissions).length;
  },

  async resetCounter(moduleId: string, value: number = 0) {
    try {
      const counterRef = doc(db, 'counters', moduleId);
      await setDoc(counterRef, { count: value });
    } catch (error) {
      handleFirestoreError(error, 'write', `counters/${moduleId}`);
    }
  },

  async shiftMathsManiaParticipants() {
    try {
      const q = query(collection(db, 'submissions'));
      const snapshot = await getDocs(q);
      let count = 0;
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Submission;
        const currentTitle = data.moduleTitle ? data.moduleTitle.trim() : '';
        const currentModuleId = data.moduleId;
        
        // Match "Maths Mania" exactly or case-insensitive, but NOT "Maths Mania (Advanced)" and NOT "Maths Mania (Junior)"
        const isOldMathsMania = 
          (currentTitle.toLowerCase() === 'maths mania') || 
          (currentModuleId === 'maths-mania' && currentTitle !== 'Maths Mania (Advanced)');
          
        if (isOldMathsMania) {
          try {
            const docRef = doc(db, 'submissions', docSnap.id);
            await updateDoc(docRef, {
              moduleId: 'maths-mania',
              moduleTitle: 'Maths Mania (Advanced)',
              updatedAt: serverTimestamp()
            });
          } catch (e) {
            console.warn('Skipping remote update during shiftMathsMania due to network/quota:', e);
          }
          updateLocalSubmissionItem(docSnap.id, {
            moduleId: 'maths-mania',
            moduleTitle: 'Maths Mania (Advanced)'
          });
          count++;
        }
      }
      return count;
    } catch (error) {
      console.warn('shiftMathsMania ignored error/quota limit:', error);
      return 0;
    }
  },

  async migrateMathsManiaPrefixes() {
    try {
      const q = query(collection(db, 'submissions'));
      const snapshot = await getDocs(q);
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Submission;
        const moduleId = data.moduleId;
        const participantId = data.participantId;
        
        if (participantId) {
          let updatedId = participantId;
          if (moduleId === 'maths-mania' && participantId.startsWith('MM-')) {
            updatedId = participantId.replace('MM-', 'MMA-');
          } else if (moduleId === 'maths-mania-advanced' && participantId.startsWith('MMA-')) {
            updatedId = participantId.replace('MMA-', 'MMJ-');
          }
          
          if (updatedId !== participantId) {
            try {
              const docRef = doc(db, 'submissions', docSnap.id);
              await updateDoc(docRef, {
                participantId: updatedId,
                updatedAt: serverTimestamp()
              });
            } catch (e) {
              console.warn('Skipping remote update during migrateMathsManiaPrefixes due to network/quota:', e);
            }
            updateLocalSubmissionItem(docSnap.id, { participantId: updatedId });
          }
        }
      }
    } catch (error) {
      console.warn('Error migrating Maths Mania prefixes ignored:', error);
    }
  },

  async shiftMathsManiaJuniorUniversityParticipants() {
    try {
      const q = query(collection(db, 'submissions'));
      const snapshot = await getDocs(q);
      let count = 0;
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Submission;
        const currentTitle = data.moduleTitle ? data.moduleTitle.trim() : '';
        const currentModuleId = data.moduleId;
        const uniName = data.university || '';
        const isUni = isUniversityStudent(uniName);

        // Case 1: Registered in Junior, but is actually a University student -> Shift to Advanced
        const isJuniorModule = 
          currentModuleId === 'maths-mania-advanced' || 
          currentTitle.toLowerCase().includes('junior') ||
          (data.participantId && data.participantId.startsWith('MMJ-'));

        if (isJuniorModule && isUni) {
          let updatedParticipantId = data.participantId;
          if (updatedParticipantId) {
            if (updatedParticipantId.startsWith('MMJ-')) {
              updatedParticipantId = updatedParticipantId.replace('MMJ-', 'MMA-');
            } else if (updatedParticipantId.startsWith('MM-')) {
              updatedParticipantId = updatedParticipantId.replace('MM-', 'MMA-');
            }
          }

          try {
            const docRef = doc(db, 'submissions', docSnap.id);
            await updateDoc(docRef, {
              moduleId: 'maths-mania',
              moduleTitle: 'Maths Mania (Advanced)',
              ...(updatedParticipantId ? { participantId: updatedParticipantId } : {}),
              updatedAt: serverTimestamp()
            });
          } catch (e) {
            console.warn('Skipping remote update during shiftMathsManiaJuniorUniversity due to network/quota:', e);
          }

          updateLocalSubmissionItem(docSnap.id, {
            moduleId: 'maths-mania',
            moduleTitle: 'Maths Mania (Advanced)',
            ...(updatedParticipantId ? { participantId: updatedParticipantId } : {})
          });
          count++;
        }

        // Case 2: Registered or shifted to Advanced, but is actually a School/College/Pace College student -> Shift back to Junior
        const isAdvancedModule = 
          currentModuleId === 'maths-mania' || 
          currentTitle.toLowerCase().includes('advanced');

        if (isAdvancedModule && !isUni) {
          let updatedParticipantId = data.participantId;
          if (updatedParticipantId) {
            if (updatedParticipantId.startsWith('MMA-')) {
              updatedParticipantId = updatedParticipantId.replace('MMA-', 'MMJ-');
            } else if (updatedParticipantId.startsWith('MM-')) {
              updatedParticipantId = updatedParticipantId.replace('MM-', 'MMJ-');
            }
          }

          try {
            const docRef = doc(db, 'submissions', docSnap.id);
            await updateDoc(docRef, {
              moduleId: 'maths-mania-advanced',
              moduleTitle: 'Maths Mania (Junior)',
              ...(updatedParticipantId ? { participantId: updatedParticipantId } : {}),
              updatedAt: serverTimestamp()
            });
          } catch (e) {
            console.warn('Skipping remote update during shiftMathsManiaJuniorUniversity due to network/quota:', e);
          }

          updateLocalSubmissionItem(docSnap.id, {
            moduleId: 'maths-mania-advanced',
            moduleTitle: 'Maths Mania (Junior)',
            ...(updatedParticipantId ? { participantId: updatedParticipantId } : {})
          });
          count++;
        }
      }
      return count;
    } catch (error) {
      console.warn('Error shifting Maths Mania Junior university participants ignored:', error);
      return 0;
    }
  }
}
