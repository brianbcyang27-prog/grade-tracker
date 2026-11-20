import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
  writeBatch,
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

export interface TaskGradeInput {
  semester: Semester;
  subject: string;
  title: string;
  date: string;
  notes?: string;
  scores: { criterion: Criterion; score: number }[];
}

/**
 * Saves one task assessed on several criteria. Each criterion is stored as its own
 * grade (so grading, the table and CSV export work unchanged), written in a single
 * batch so a task is never half-saved.
 */
export async function addTaskGrades(userId: string, task: TaskGradeInput): Promise<void> {
  const batch = writeBatch(db);
  const now = Timestamp.now();

  for (const { criterion, score } of task.scores) {
    batch.set(doc(gradesCollection(userId)), {
      semester: task.semester,
      subject: task.subject,
      criterion,
      title: task.title,
      score,
      maxScore: 8,
      date: task.date,
      status: 'data in',
      ...(task.notes ? { notes: task.notes } : {}),
      createdAt: now,
      updatedAt: now,
    });
  }

  await batch.commit();
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

export async function deleteAllGrades(userId: string): Promise<void> {
  const ref = gradesCollection(userId);
  const snapshot = await getDocs(ref);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log('[Firestore] Deleted all grades for user:', userId);
}

export async function seedGrades(
  userId: string,
  entries: Array<{
    semester: Semester;
    subject: string;
    criterion: Criterion;
    title: string;
    score: number;
    date: string;
    notes?: string;
  }>,
): Promise<void> {
  const ref = gradesCollection(userId);
  const batch = writeBatch(db);
  const now = Timestamp.now();
  for (const entry of entries) {
    const docRef = doc(ref);
    batch.set(docRef, {
      semester: entry.semester,
      subject: entry.subject,
      criterion: entry.criterion,
      title: entry.title,
      score: entry.score,
      maxScore: 8,
      date: entry.date,
      status: 'data in',
      notes: entry.notes ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }
  await batch.commit();
  console.log('[Firestore] Seeded', entries.length, 'grades for user:', userId);
}
