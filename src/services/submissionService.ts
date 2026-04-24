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
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown Firestore error',
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
  async createSubmission(submission: Omit<Submission, 'id' | 'status' | 'submittedAt'>) {
    try {
      // Filter out undefined values to satisfy Firestore
      const cleanData = Object.fromEntries(
        Object.entries(submission).filter(([_, v]) => v !== undefined)
      );

      const docRef = await addDoc(collection(db, 'submissions'), {
        ...cleanData,
        status: 'pending',
        submittedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', 'submissions');
    }
  },

  async getSubmissionsByStatus(status?: Submission['status']) {
    try {
      let q = collection(db, 'submissions');
      if (status) {
        q = query(q, where('status', '==', status)) as any;
      }
      const snapshot = await getDocs(query(q, orderBy('submittedAt', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Submission[];
    } catch (error) {
      handleFirestoreError(error, 'list', 'submissions');
    }
  },

  subscribeToSubmissions(callback: (submissions: Submission[]) => void) {
    const q = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Submission[];
      callback(submissions);
    }, (error) => {
      handleFirestoreError(error, 'list', 'submissions');
    });
  },

  async updateStatus(submissionId: string, status: Submission['status']) {
    try {
      const docRef = doc(db, 'submissions', submissionId);
      await updateDoc(docRef, { status });
    } catch (error) {
      handleFirestoreError(error, 'update', `submissions/${submissionId}`);
    }
  },

  async checkIsAdmin(email: string): Promise<boolean> {
    if (email === 'anasmobin0@gmail.com' || email === 'technova26@technova.com') return true;
    try {
      const q = query(collection(db, 'admins'), where('email', '==', email));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      return false;
    }
  }
};
