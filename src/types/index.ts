export type Semester = '9G1S' | '9G2S' | '10G1S' | '10G2S';

export type Criterion = 'A' | 'B' | 'C' | 'D';

export type SubjectName =
  | 'Biology'
  | 'Math'
  | 'English'
  | 'Computer Science'
  | 'PE'
  | 'History'
  | 'Design'
  | 'Physics'
  | 'Chemistry'
  | 'Spanish'
  | 'French'
  | 'Geography'
  | 'Art'
  | 'Music'
  | 'Drama';

export interface Assignment {
  id: string;
  subject: string;
  semester: Semester;
  criterion: Criterion;
  title: string;
  score: number; // 0-8
  maxScore: number; // default 8
  date: string; // ISO date string
  status: 'data in' | 'no data';
  notes?: string;
  createdAt?: string;
}

export interface CriterionData {
  criterion: Criterion;
  assignments: Assignment[];
  average: number;
}

export interface SubjectData {
  subject: string;
  semester: Semester;
  criteria: Record<Criterion, Assignment[]>;
  totalScore: number;
  grade: GradeBand;
  gradeLabel: string;
}

export interface GradeBand {
  minScore: number;
  maxScore: number;
  letter: string;
  label: string;
}

export interface AppState {
  assignments: Assignment[];
  darkMode: boolean;
  selectedSemester: Semester | 'ALL';
  inputPanelOpen: boolean;
}

export const SEMESTERS: Semester[] = ['9G1S', '9G2S', '10G1S', '10G2S'];

export const SUBJECTS: SubjectName[] = [
  'Biology',
  'Math',
  'English',
  'Computer Science',
  'PE',
  'History',
  'Design',
  'Physics',
  'Chemistry',
  'Spanish',
  'French',
  'Geography',
  'Art',
  'Music',
  'Drama',
];

export const CRITERIA: Criterion[] = ['A', 'B', 'C', 'D'];
