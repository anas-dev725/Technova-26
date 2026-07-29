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

  // Known school/college indicators that are NOT universities
  const schoolCollegeKeywords = [
    'school', 'lyceum', 'grammar', 'high school', 'intermediate', 'inter', 
    'matric', 'o level', 'a level', 'o/a level', 'o-level', 'a-level', 'cadet', 
    'secondary', 'beaconhouse', 'city school', 'army public', 'aps', 'whales', 
    'cordoba', 'cedar', 'alpha', 'adamjee', 'commecs', 'dj science', 
    'st. patrick', 'st. joseph', 'st. paul', 'habib public', 'bamm', 'degree college',
    'khalid', 'forman christian college school'
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

  if (hasUniKeyword) return true;

  const hasSchoolKeyword = schoolCollegeKeywords.some(k => clean.includes(k));
  if (hasSchoolKeyword) return false;

  return true;
}

export const submissionService = {
  async createSubmission(submission: Omit<Submission, 'id' | 'status' | 'submittedAt' | 'participantId'>) {
    try {
      const countersRef = doc(db, 'counters', submission.moduleId);
      const prefix = getParticipantPrefix(submission.moduleId);
      
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

      return result;
    } catch (error) {
      handleFirestoreError(error, 'create', 'submissions');
    }
  },

  async getSubmissionsByStatus(status?: Submission['status']) {
    try {
      let q = query(collection(db, 'submissions')) as any;
      if (status) {
        q = query(q, where('status', '==', status));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return { 
          id: doc.id, 
          ...data,
          submittedAt: data.submittedAt || data.createdAt 
        } as Submission;
      }).sort((a, b) => {
        const timeA = a.submittedAt?.toMillis?.() || 0;
        const timeB = b.submittedAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
    } catch (error) {
      handleFirestoreError(error, 'list', 'submissions');
    }
  },

  subscribeToSubmissions(callback: (submissions: Submission[]) => void) {
    const q = query(collection(db, 'submissions')); // Remove orderBy from query to avoid missing documents
    return onSnapshot(q, (snapshot) => {
      const submissions = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return { 
          id: doc.id, 
          ...data,
          // Robust compatibility mapping
          submittedAt: data.submittedAt || data.createdAt 
        } as Submission;
      })
      // Sort in memory to include all docs even if they lack one of the timestamp fields
      .sort((a, b) => {
        const timeA = a.submittedAt?.toMillis?.() || 0;
        const timeB = b.submittedAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
      callback(submissions);
    }, (error) => {
      handleFirestoreError(error, 'get', 'submissions');
    });
  },

  async updateStatus(submissionId: string, status: Submission['status']) {
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await updateDoc(docRef, { 
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, 'update', `submissions/${submissionId}`);
    }
  },

  async toggleExempted(submissionId: string, exempted: boolean) {
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await updateDoc(docRef, { 
        exempted,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, 'update', `submissions/${submissionId}`);
    }
  },

  async toggleCheckIn(submissionId: string, checkedIn: boolean) {
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await updateDoc(docRef, { 
        checkedIn,
        checkedInAt: checkedIn ? serverTimestamp() : null,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, 'update', `submissions/${submissionId}`);
    }
  },

  async deleteSubmission(submissionId: string) {
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, 'delete', `submissions/${submissionId}`);
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
          const docRef = doc(db, 'submissions', docSnap.id);
          await updateDoc(docRef, {
            moduleId: 'maths-mania',
            moduleTitle: 'Maths Mania (Advanced)',
            updatedAt: serverTimestamp()
          });
          count++;
        }
      }
      return count;
    } catch (error) {
      handleFirestoreError(error, 'write', 'shiftMathsMania');
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
            const docRef = doc(db, 'submissions', docSnap.id);
            await updateDoc(docRef, {
              participantId: updatedId,
              updatedAt: serverTimestamp()
            });
          }
        }
      }
    } catch (error) {
      console.error('Error migrating Maths Mania prefixes:', error);
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

        // Check if this submission belongs to Maths Mania Junior
        const isJuniorModule = 
          currentModuleId === 'maths-mania-advanced' || 
          currentTitle.toLowerCase().includes('junior') ||
          (data.participantId && data.participantId.startsWith('MMJ-'));

        if (isJuniorModule) {
          // Check if registered as a university student
          if (isUniversityStudent(uniName)) {
            const docRef = doc(db, 'submissions', docSnap.id);
            let updatedParticipantId = data.participantId;
            if (updatedParticipantId) {
              if (updatedParticipantId.startsWith('MMJ-')) {
                updatedParticipantId = updatedParticipantId.replace('MMJ-', 'MMA-');
              } else if (updatedParticipantId.startsWith('MM-')) {
                updatedParticipantId = updatedParticipantId.replace('MM-', 'MMA-');
              }
            }

            await updateDoc(docRef, {
              moduleId: 'maths-mania',
              moduleTitle: 'Maths Mania (Advanced)',
              ...(updatedParticipantId ? { participantId: updatedParticipantId } : {}),
              updatedAt: serverTimestamp()
            });
            count++;
          }
        }
      }
      return count;
    } catch (error) {
      console.error('Error shifting Maths Mania Junior university participants:', error);
      handleFirestoreError(error, 'write', 'shiftMathsManiaJuniorUniversity');
    }
  }
}
