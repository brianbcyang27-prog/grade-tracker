import { create } from 'zustand';
import type { Assignment, Semester, SubjectName, Criterion } from '../types';
import { addGrade, updateGrade, deleteGrade } from '../services/gradeService';

interface GradeStore {
  assignments: Assignment[];
  darkMode: boolean;
  selectedSemester: Semester | 'ALL';
  inputPanelOpen: boolean;
  userId: string | null;
  loading: boolean;
  error: string | null;

  setUserId: (uid: string | null) => void;
  setAssignments: (list: Assignment[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;

  addAssignment: (
    userId: string,
    semester: Semester,
    subject: SubjectName,
    criterion: Criterion,
    title: string,
    score: number,
    date?: string,
    notes?: string,
  ) => Promise<void>;

  removeAssignment: (userId: string, id: string) => Promise<void>;

  updateAssignment: (
    userId: string,
    id: string,
    updates: Partial<Assignment>,
  ) => Promise<void>;

  setSelectedSemester: (semester: Semester | 'ALL') => void;
  toggleDarkMode: () => void;
  setInputPanelOpen: (open: boolean) => void;
  clearAllData: () => void;
}

export const useGradeStore = create<GradeStore>()((set, get) => ({
  assignments: [],
  darkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
  selectedSemester: 'ALL' as Semester | 'ALL',
  inputPanelOpen: true,
  userId: null,
  loading: true,
  error: null,

  setUserId: (uid) => set({ userId: uid }),
  setAssignments: (list) => set({ assignments: list, loading: false }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),

  addAssignment: async (userId, semester, subject, criterion, title, score, date, notes) => {
    try {
      await addGrade(userId, {
        semester,
        subject,
        criterion,
        title,
        score,
        date: date ?? new Date().toISOString().split('T')[0],
        notes,
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  removeAssignment: async (userId, id) => {
    try {
      await deleteGrade(userId, id);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateAssignment: async (userId, id, updates) => {
    try {
      await updateGrade(userId, id, updates);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  setSelectedSemester: (semester) => set({ selectedSemester: semester }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  setInputPanelOpen: (open) => set({ inputPanelOpen: open }),
  clearAllData: () => set({ assignments: [] }),
}));
