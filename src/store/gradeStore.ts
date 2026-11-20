import { localDateString } from '../utils/date';
import { create } from 'zustand';
import type { Assignment, Semester, Criterion } from '../types';
import { addGrade, addTaskGrades, updateGrade, deleteGrade, deleteAllGrades, seedGrades } from '../services/gradeService';
import type { TaskGradeInput } from '../services/gradeService';

export type ThemeName = 'indigo' | 'emerald' | 'rose' | 'amber' | 'ocean' | 'midnight';

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`grade-tracker-${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key: string, value: any) {
  localStorage.setItem(`grade-tracker-${key}`, JSON.stringify(value));
}

interface GradeStore {
  assignments: Assignment[];
  darkMode: boolean;
  theme: ThemeName;
  selectedSemester: Semester | 'ALL';
  inputPanelOpen: boolean;
  userId: string | null;
  loading: boolean;
  error: string | null;
  customSubjects: string[];
  seeding: boolean;

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

  /** Saves every criterion of one task together. Throws on failure so the form can show it. */
  addTask: (userId: string, task: TaskGradeInput) => Promise<void>;

  removeAssignment: (userId: string, id: string) => Promise<void>;

  updateAssignment: (
    userId: string,
    id: string,
    updates: Partial<Assignment>,
  ) => Promise<void>;

  setSelectedSemester: (semester: Semester | 'ALL') => void;
  toggleDarkMode: () => void;
  setTheme: (theme: ThemeName) => void;
  setInputPanelOpen: (open: boolean) => void;
  clearAllData: () => void;
  addCustomSubject: (name: string) => void;
  removeCustomSubject: (name: string) => void;
  deleteAllFromFirestore: (userId: string) => Promise<void>;
  seedSampleData: (userId: string) => Promise<void>;
}

function createStore() {
  return create<GradeStore>()((set) => ({
    assignments: [],
    darkMode: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
    theme: loadLocal<ThemeName>('theme', 'indigo'),
    selectedSemester: 'ALL' as Semester | 'ALL',
    inputPanelOpen: true,
    userId: null,
    loading: true,
    error: null,
    customSubjects: loadLocal<string[]>('custom-subjects', []),
    seeding: false,

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
          date: date ?? localDateString(),
          notes,
        });
      } catch (err: any) {
        console.error('[Store] addAssignment failed:', err);
        set({ error: `Failed to add grade: ${err.message}` });
      }
    },

    addTask: async (userId, task) => {
      await addTaskGrades(userId, task);
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
    setTheme: (theme) => {
      saveLocal('theme', theme);
      set({ theme });
    },
    setInputPanelOpen: (open) => set({ inputPanelOpen: open }),
    clearAllData: () => set({ assignments: [] }),

    addCustomSubject: (name) =>
      set((s) => {
        const trimmed = name.trim();
        if (!trimmed || s.customSubjects.includes(trimmed)) return s;
        const updated = [...s.customSubjects, trimmed];
        saveLocal('custom-subjects', updated);
        return { customSubjects: updated };
      }),

    removeCustomSubject: (name) =>
      set((s) => {
        const updated = s.customSubjects.filter((c) => c !== name);
        saveLocal('custom-subjects', updated);
        return { customSubjects: updated };
      }),

    deleteAllFromFirestore: async (userId) => {
      try {
        set({ seeding: true });
        await deleteAllGrades(userId);
      } catch (err: any) {
        console.error('[Store] deleteAll failed:', err);
        set({ error: err.message });
      } finally {
        set({ seeding: false });
      }
    },

    seedSampleData: async (userId) => {
      try {
        set({ seeding: true });
        const { generateSampleData } = await import('../utils/sampleData');
        const data = generateSampleData();
        await deleteAllGrades(userId); // clear existing first
        await seedGrades(userId, data);
      } catch (err: any) {
        console.error('[Store] seedSampleData failed:', err);
        set({ error: err.message });
      } finally {
        set({ seeding: false });
      }
    },
  }));
}

export const useGradeStore = createStore();
