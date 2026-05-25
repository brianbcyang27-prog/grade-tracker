import { create } from 'zustand';
import type { Assignment, Semester, Criterion } from '../types';
import { addGrade, updateGrade, deleteGrade } from '../services/gradeService';

function loadCustomSubjects(): string[] {
  try {
    const raw = localStorage.getItem('grade-tracker-custom-subjects');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomSubjects(subjects: string[]) {
  localStorage.setItem('grade-tracker-custom-subjects', JSON.stringify(subjects));
}

interface GradeStore {
  assignments: Assignment[];
  darkMode: boolean;
  selectedSemester: Semester | 'ALL';
  inputPanelOpen: boolean;
  userId: string | null;
  loading: boolean;
  error: string | null;
  customSubjects: string[];

  setUserId: (uid: string | null) => void;
  setAssignments: (list: Assignment[]) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;

  addAssignment: (
    userId: string,
    semester: Semester,
    subject: string,
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
  addCustomSubject: (name: string) => void;
  removeCustomSubject: (name: string) => void;
}

function createStore() {
  return create<GradeStore>()((set) => ({
    assignments: [],
    darkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
    selectedSemester: 'ALL' as Semester | 'ALL',
    inputPanelOpen: true,
    userId: null,
    loading: true,
    error: null,
    customSubjects: loadCustomSubjects(),

    setUserId: (uid) => {
      set({ userId: uid });
    },
    setAssignments: (list) => {
      set({ assignments: list, loading: false });
    },
    setLoading: (v) => set({ loading: v }),
    setError: (e) => {
      if (e) console.error('[Store] Error:', e);
      set({ error: e });
    },

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
        console.error('[Store] addAssignment failed:', err);
        set({ error: `Failed to add grade: ${err.message}` });
      }
    },

    removeAssignment: async (userId, id) => {
      try {
        await deleteGrade(userId, id);
      } catch (err: any) {
        console.error('[Store] removeAssignment failed:', err);
        set({ error: err.message });
      }
    },

    updateAssignment: async (userId, id, updates) => {
      try {
        await updateGrade(userId, id, updates);
      } catch (err: any) {
        console.error('[Store] updateAssignment failed:', err);
        set({ error: err.message });
      }
    },

    setSelectedSemester: (semester) => set({ selectedSemester: semester }),
    toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    setInputPanelOpen: (open) => set({ inputPanelOpen: open }),
    clearAllData: () => set({ assignments: [] }),

    addCustomSubject: (name) =>
      set((s) => {
        const trimmed = name.trim();
        if (!trimmed || s.customSubjects.includes(trimmed)) return s;
        const updated = [...s.customSubjects, trimmed];
        saveCustomSubjects(updated);
        return { customSubjects: updated };
      }),

    removeCustomSubject: (name) =>
      set((s) => {
        const updated = s.customSubjects.filter((c) => c !== name);
        saveCustomSubjects(updated);
        return { customSubjects: updated };
      }),
  }));
}

export const useGradeStore = createStore();
