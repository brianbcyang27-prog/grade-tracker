import type { Assignment, Criterion, GradeBand, SubjectData, Semester } from '../types';
import { CRITERIA } from '../types';

// ──────────────────────────────────────────────
// 1. System Detection
// ──────────────────────────────────────────────

export type GradingSystem = 'myp-year4' | 'myp-year5' | 'ib-dp' | 'percentage';

export function detectSystem(semester: Semester): GradingSystem {
  if (semester.startsWith('9')) return 'myp-year4';
  if (semester.startsWith('10')) return 'myp-year5';
  return 'myp-year4';
}

// ──────────────────────────────────────────────
// 2. Per-System Grade Band Tables
// ──────────────────────────────────────────────

export const GRADE_9_BANDS: GradeBand[] = [
  { minScore: 1, maxScore: 3, letter: 'F', label: 'Failing' },
  { minScore: 4, maxScore: 5, letter: 'D-', label: 'Very Limited' },
  { minScore: 6, maxScore: 7, letter: 'D', label: 'Limited' },
  { minScore: 8, maxScore: 9, letter: 'D+', label: 'Below Average' },
  { minScore: 10, maxScore: 11, letter: 'C-', label: 'Below Satisfactory' },
  { minScore: 12, maxScore: 13, letter: 'C', label: 'Satisfactory' },
  { minScore: 14, maxScore: 15, letter: 'C+', label: 'Adequate' },
  { minScore: 16, maxScore: 17, letter: 'B-', label: 'Good' },
  { minScore: 18, maxScore: 19, letter: 'B', label: 'Very Good' },
  { minScore: 20, maxScore: 21, letter: 'B+', label: 'Excellent' },
  { minScore: 22, maxScore: 23, letter: 'A-', label: 'Near Outstanding' },
  { minScore: 24, maxScore: 26, letter: 'A', label: 'Outstanding' },
  { minScore: 27, maxScore: 32, letter: 'A+', label: 'Exceptional' },
];

export const GRADE_10_BANDS: GradeBand[] = [
  { minScore: 1, maxScore: 5, letter: 'F', label: 'Failing' },
  { minScore: 6, maxScore: 7, letter: 'D-', label: 'Very Limited' },
  { minScore: 8, maxScore: 9, letter: 'D', label: 'Limited' },
  { minScore: 10, maxScore: 11, letter: 'D+', label: 'Below Average' },
  { minScore: 12, maxScore: 13, letter: 'C-', label: 'Below Satisfactory' },
  { minScore: 14, maxScore: 15, letter: 'C', label: 'Satisfactory' },
  { minScore: 16, maxScore: 17, letter: 'C+', label: 'Adequate' },
  { minScore: 18, maxScore: 19, letter: 'B-', label: 'Good' },
  { minScore: 20, maxScore: 21, letter: 'B', label: 'Very Good' },
  { minScore: 22, maxScore: 23, letter: 'B+', label: 'Excellent' },
  { minScore: 24, maxScore: 25, letter: 'A-', label: 'Near Outstanding' },
  { minScore: 26, maxScore: 28, letter: 'A', label: 'Outstanding' },
  { minScore: 29, maxScore: 32, letter: 'A+', label: 'Exceptional' },
];

const IB_SCALE: GradeBand[] = [
  { minScore: 1, maxScore: 5, letter: '1', label: 'Very Poor' },
  { minScore: 6, maxScore: 9, letter: '2', label: 'Poor' },
  { minScore: 10, maxScore: 14, letter: '3', label: 'Mediocre' },
  { minScore: 15, maxScore: 18, letter: '4', label: 'Satisfactory' },
  { minScore: 19, maxScore: 23, letter: '5', label: 'Good' },
  { minScore: 24, maxScore: 27, letter: '6', label: 'Very Good' },
  { minScore: 28, maxScore: 32, letter: '7', label: 'Excellent' },
];

const PERCENTAGE_BANDS: { min: number; max: number; letter: string; gpa: number }[] = [
  { min: 98, max: 100, letter: 'A+', gpa: 4.33 },
  { min: 93, max: 97, letter: 'A', gpa: 4.00 },
  { min: 90, max: 92, letter: 'A-', gpa: 3.67 },
  { min: 87, max: 89, letter: 'B+', gpa: 3.33 },
  { min: 83, max: 86, letter: 'B', gpa: 3.00 },
  { min: 80, max: 82, letter: 'B-', gpa: 2.67 },
  { min: 77, max: 79, letter: 'C+', gpa: 2.33 },
  { min: 73, max: 76, letter: 'C', gpa: 2.00 },
  { min: 70, max: 72, letter: 'C-', gpa: 1.67 },
  { min: 67, max: 69, letter: 'D+', gpa: 1.33 },
  { min: 63, max: 66, letter: 'D', gpa: 1.00 },
  { min: 60, max: 62, letter: 'D-', gpa: 0.67 },
  { min: 0, max: 59, letter: 'F', gpa: 0.00 },
];

const DP_GPA_TABLE: { ibGrade: number; letter: string; gpaSL: number; gpaHL: number }[] = [
  { ibGrade: 7, letter: 'A+', gpaSL: 4.33, gpaHL: 5.33 },
  { ibGrade: 6, letter: 'A', gpaSL: 4.00, gpaHL: 5.00 },
  { ibGrade: 5, letter: 'A-', gpaSL: 3.67, gpaHL: 4.67 },
  { ibGrade: 4, letter: 'B+', gpaSL: 3.33, gpaHL: 4.33 },
  { ibGrade: 3, letter: 'C+', gpaSL: 2.33, gpaHL: 3.33 },
  { ibGrade: 2, letter: 'D', gpaSL: 1.00, gpaHL: 2.00 },
  { ibGrade: 1, letter: 'F', gpaSL: 0.00, gpaHL: 1.00 },
];

// ──────────────────────────────────────────────
// 3. Per-System Calculators
// ──────────────────────────────────────────────

function clampScore(totalScore: number): number {
  return Math.max(1, Math.min(32, Math.round(totalScore)));
}

export function calculateMYPGradeYear9(totalScore: number): GradeBand {
  if (totalScore <= 0) return { minScore: 0, maxScore: 0, letter: 'N/A', label: 'No Grade' };
  const clamped = clampScore(totalScore);
  const band = GRADE_9_BANDS.find((g) => clamped >= g.minScore && clamped <= g.maxScore);
  return band ?? GRADE_9_BANDS[0];
}

export function calculateMYPGradeYear10(totalScore: number): GradeBand {
  if (totalScore <= 0) return { minScore: 0, maxScore: 0, letter: 'N/A', label: 'No Grade' };
  const clamped = clampScore(totalScore);
  const band = GRADE_10_BANDS.find((g) => clamped >= g.minScore && clamped <= g.maxScore);
  return band ?? GRADE_10_BANDS[0];
}

export function calculateIBGrade(totalScore: number): GradeBand {
  if (totalScore <= 0) return { minScore: 0, maxScore: 0, letter: 'N/A', label: 'No Grade' };
  const clamped = clampScore(totalScore);
  const band = IB_SCALE.find((g) => clamped >= g.minScore && clamped <= g.maxScore);
  return band ?? IB_SCALE[0];
}

export function calculateDPGPA(
  ibGrade: number,
  level: 'SL' | 'HL',
): { letter: string; gpa: number } {
  const row = DP_GPA_TABLE.find((r) => r.ibGrade === ibGrade);
  if (!row) return { letter: 'N/A', gpa: 0 };
  return { letter: row.letter, gpa: level === 'SL' ? row.gpaSL : row.gpaHL };
}

export function calculatePercentageGrade(
  percent: number,
): { letter: string; gpa: number } {
  const clamped = Math.max(0, Math.min(100, percent));
  const band = PERCENTAGE_BANDS.find((b) => clamped >= b.min && clamped <= b.max);
  return band ?? PERCENTAGE_BANDS[PERCENTAGE_BANDS.length - 1];
}

// ──────────────────────────────────────────────
// 4. Auto-Dispatch: pick the right system from semester
// ──────────────────────────────────────────────

export function getGradeBand(totalScore: number, system?: GradingSystem): GradeBand {
  const sys = system ?? 'myp-year4';
  switch (sys) {
    case 'myp-year4':
      return calculateMYPGradeYear9(totalScore);
    case 'myp-year5':
      return calculateMYPGradeYear10(totalScore);
    case 'ib-dp':
      return calculateIBGrade(totalScore);
    case 'percentage':
      return calculateIBGrade(totalScore);
  }
}

// ──────────────────────────────────────────────
// 5. Existing Utility Functions (preserved)
// ──────────────────────────────────────────────

export function average(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function roundTo(num: number, decimals: number = 1): number {
  return Math.round(num * 10 ** decimals) / 10 ** decimals;
}

export function getAssignmentsForCriterion(
  assignments: Assignment[],
  criterion: Criterion,
): Assignment[] {
  return assignments.filter((a) => a.criterion === criterion);
}

export function getAverageForCriterion(
  assignments: Assignment[],
  criterion: Criterion,
): number {
  const filtered = getAssignmentsForCriterion(assignments, criterion);
  return roundTo(average(filtered.map((a) => a.score)));
}

export function computeSubjectData(
  assignments: Assignment[],
  subject: string,
  semester: Semester,
): SubjectData {
  const subjectAssignments = assignments.filter(
    (a) => a.subject === subject && a.semester === semester,
  );

  const criteria: Record<Criterion, Assignment[]> = {} as Record<Criterion, Assignment[]>;
  for (const c of CRITERIA) {
    criteria[c] = subjectAssignments.filter((a) => a.criterion === c);
  }

  const criteriaAverages = CRITERIA.map((c) => {
    const scores = criteria[c].map((a) => a.score);
    return scores.length > 0 ? average(scores) : 0;
  });

  const totalScore = roundTo(criteriaAverages.reduce((sum, avg) => sum + avg, 0));
  const system = detectSystem(semester);
  const grade = getGradeBand(totalScore, system);

  return {
    subject,
    semester,
    criteria,
    totalScore,
    grade,
    gradeLabel: `${grade.letter} — ${grade.label}`,
  };
}

export function computeAllSubjects(
  assignments: Assignment[],
  semester: Semester | 'ALL',
): SubjectData[] {
  const filtered =
    semester === 'ALL'
      ? assignments
      : assignments.filter((a) => a.semester === semester);

  const subjectSemesters = new Set<string>();
  filtered.forEach((a) => subjectSemesters.add(`${a.subject}::${a.semester}`));

  return Array.from(subjectSemesters).map((key) => {
    const [subject, sem] = key.split('::') as [string, Semester];
    return computeSubjectData(assignments, subject, sem);
  });
}

export function computeOverallAverage(subjects: SubjectData[]): number {
  if (subjects.length === 0) return 0;
  const valid = subjects.filter((s) => s.totalScore > 0);
  if (valid.length === 0) return 0;
  return roundTo(valid.reduce((sum, s) => sum + s.totalScore, 0) / valid.length);
}

export function computeGPAEquivalent(averageScore: number): string {
  if (averageScore <= 0) return '—';
  const pct = (averageScore / 32) * 100;
  const result = calculatePercentageGrade(pct);
  return result.gpa.toFixed(2);
}

export function getGradeColor(letter: string): string {
  const colors: Record<string, string> = {
    'A+': '#059669',
    'A': '#10b981',
    'A-': '#34d399',
    'B+': '#60a5fa',
    'B': '#3b82f6',
    'B-': '#818cf8',
    'C+': '#fbbf24',
    'C': '#f59e0b',
    'C-': '#fb923c',
    'D+': '#f87171',
    'D': '#ef4444',
    'D-': '#dc2626',
    'F': '#991b1b',
    '7': '#059669',
    '6': '#10b981',
    '5': '#3b82f6',
    '4': '#f59e0b',
    '3': '#f97316',
    '2': '#ef4444',
    '1': '#991b1b',
  };
  return colors[letter] ?? '#6b7280';
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getTrendIndicator(
  subjects: SubjectData[],
  current: SubjectData,
): 'up' | 'down' | 'stable' | null {
  const sameSubject = subjects
    .filter((s) => s.subject === current.subject && s.semester !== current.semester)
    .sort((a, b) => b.semester.localeCompare(a.semester));

  if (sameSubject.length === 0) return null;
  const prev = sameSubject[0];
  const diff = current.totalScore - prev.totalScore;
  if (diff > 1.5) return 'up';
  if (diff < -1.5) return 'down';
  return 'stable';
}
