import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Assignment, Semester, Criterion } from '../types';

function gradesCollection(userId: string) {
  return collection(db, 'users', userId, 'grades');
}

export function listenToGrades(
  userId: string,
  onData: (assignments: Assignment[]) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  console.log('[Firestore] Starting listener for user:', userId);
  const q = query(gradesCollection(userId), orderBy('date', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      console.log('[Firestore] Received', snapshot.docs.length, 'documents');
      const list: Assignment[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          subject: data.subject as string,
          semester: data.semester as Semester,
          criterion: data.criterion as Criterion,
          title: data.title as string,
          score: data.score as number,
          maxScore: (data.maxScore as number) ?? 8,
          date: data.date as string,
          status: (data.status as Assignment['status']) ?? 'data in',
          notes: data.notes as string | undefined,
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
        };
      });
      onData(list);
    },
    (err) => {
      console.error('[Firestore] Listener error:', err);
      onError(err);
    },
  );
}

export async function addGrade(
  userId: string,
  grade: {
    semester: Semester;
    subject: string;
    criterion: Criterion;
    title: string;
    score: number;
    maxScore?: number;
    date: string;
    notes?: string;
    status?: string;
  },
): Promise<string> {
  console.log('[Firestore] Adding grade for user:', userId, grade);

  // Remove undefined fields — Firestore rejects undefined values
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(grade)) {
    if (val !== undefined) clean[key] = val;
  }
  clean.maxScore = grade.maxScore ?? 8;
  clean.status = grade.status ?? 'data in';
  clean.createdAt = Timestamp.now();
  clean.updatedAt = Timestamp.now();

  console.log('[Firestore] Writing data:', clean);
  const ref = gradesCollection(userId);
  console.log('[Firestore] Collection path: users', userId, 'grades');

  const docRef = await addDoc(ref, clean);
  console.log('[Firestore] Grade added with ID:', docRef.id);
  return docRef.id;
}

export async function updateGrade(
  userId: string,
  gradeId: string,
  updates: Partial<{
    title: string;
    score: number;
    maxScore: number;
    date: string;
    notes: string;
    status: string;
    criterion: Criterion;
  }>,
): Promise<void> {
  console.log('[Firestore] Updating grade:', gradeId, updates);
  const ref = doc(db, 'users', userId, 'grades', gradeId);
  await updateDoc(ref, { ...updates, updatedAt: Timestamp.now() });
}

export async function deleteGrade(userId: string, gradeId: string): Promise<void> {
  console.log('[Firestore] Deleting grade:', gradeId);
  const ref = doc(db, 'users', userId, 'grades', gradeId);
  await deleteDoc(ref);
}
