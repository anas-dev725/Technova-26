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
  Timestamp
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
  members: TeamMember[];
  receiptBase64: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: any;
  totalFee: number;
}

const MODULE_PREFIXES: Record<string, string> = {
  'fyp-warriors': 'FW',
  'startup-launchpad': 'SL',
  'capture-the-flag': 'CTF',
  'agentic-ai-arena': 'AA',
  'datathon': 'DT',
  'prompt-engineering': 'PE',
  'esports-competition': 'ESP',
  'webforces': 'WF',
  'digital-dash': 'DD',
  'maths-mania': 'MM'
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

export const submissionService = {
  async createSubmission(submission: Omit<Submission, 'id' | 'status' | 'submittedAt' | 'participantId'>) {
    try {
      // 1. Generate Participant ID (Sequential per module)
      const q = query(
        collection(db, 'submissions'), 
        where('moduleId', '==', submission.moduleId)
      );
      const snapshot = await getDocs(q);
      const count = snapshot.size;
      const prefix = getParticipantPrefix(submission.moduleId);
      const sequentialNumber = (count + 1).toString().padStart(3, '0');
      const participantId = `${prefix}-${sequentialNumber}`;

      console.log(`[SubmissionService] Generated Participant ID: ${participantId} for module: ${submission.moduleId}`);

      // 2. Filter out undefined values
      const cleanData = Object.fromEntries(
        Object.entries(submission).filter(([_, v]) => v !== undefined)
      );

      const docRef = await addDoc(collection(db, 'submissions'), {
        ...cleanData,
        participantId,
        status: 'pending',
        submittedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, participantId };
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
      console.error("Firestore Subscribe Error:", error);
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
  }
}
