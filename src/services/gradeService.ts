import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Assignment, Semester, SubjectName, Criterion } from '../types';

function gradesCollection(userId: string) {
  return collection(db, 'users', userId, 'grades');
}

export function listenToGrades(
  userId: string,
  onData: (assignments: Assignment[]) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  const q = query(gradesCollection(userId), orderBy('date', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Assignment[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          subject: data.subject as SubjectName,
          semester: data.semester as Semester,
          criterion: data.criterion as Criterion,
          title: data.title as string,
          score: data.score as number,
          maxScore: (data.maxScore as number) ?? 8,
          date: data.date as string,
          status: (data.status as string) ?? 'data in',
          notes: data.notes as string | undefined,
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
        };
      });
      onData(list);
    },
    (err) => onError(err),
  );
}

export async function addGrade(
  userId: string,
  grade: {
    semester: Semester;
    subject: SubjectName;
    criterion: Criterion;
    title: string;
    score: number;
    maxScore?: number;
    date: string;
    notes?: string;
    status?: string;
  },
): Promise<string> {
  const docRef = await addDoc(gradesCollection(userId), {
    ...grade,
    maxScore: grade.maxScore ?? 8,
    status: grade.status ?? 'data in',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
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
  const ref = doc(db, 'users', userId, 'grades', gradeId);
  await updateDoc(ref, { ...updates, updatedAt: Timestamp.now() });
}

export async function deleteGrade(userId: string, gradeId: string): Promise<void> {
  const ref = doc(db, 'users', userId, 'grades', gradeId);
  await deleteDoc(ref);
}
