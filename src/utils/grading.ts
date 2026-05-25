import type { Assignment, Criterion, GradeBand, SubjectData, SubjectName, Semester } from '../types';
import { CRITERIA } from '../types';

export const GRADE_BANDS: GradeBand[] = [
  { minScore: 1, maxScore: 5, letter: 'F', label: 'Failing' },
  { minScore: 6, maxScore: 9, letter: 'D-', label: 'Very Limited' },
  { minScore: 10, maxScore: 11, letter: 'D', label: 'Limited' },
  { minScore: 12, maxScore: 15, letter: 'C', label: 'Satisfactory' },
  { minScore: 16, maxScore: 19, letter: 'C+', label: 'Adequate' },
  { minScore: 20, maxScore: 23, letter: 'B', label: 'Good' },
  { minScore: 24, maxScore: 27, letter: 'A-', label: 'Excellent' },
  { minScore: 28, maxScore: 32, letter: 'A', label: 'Outstanding' },
];

export function getGradeBand(totalScore: number): GradeBand {
  if (totalScore <= 0) return { minScore: 0, maxScore: 0, letter: 'N/A', label: 'No Grade' };
  const clamped = Math.max(1, Math.min(32, Math.round(totalScore)));
  const band = GRADE_BANDS.find((g) => clamped >= g.minScore && clamped <= g.maxScore);
  return band ?? GRADE_BANDS[0];
}

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
  subject: SubjectName,
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
  const grade = getGradeBand(totalScore);

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
    const [subject, sem] = key.split('::') as [SubjectName, Semester];
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
  const grade = getGradeBand(averageScore);
  if (grade.letter === 'N/A') return '—';
  const gpaMap: Record<string, string> = {
    'A': '4.0',
    'A-': '3.7',
    'B': '3.3',
    'C+': '2.7',
    'C': '2.3',
    'D-': '1.7',
    'D': '1.3',
    'F': '0.0',
  };
  return gpaMap[grade.letter] ?? '—';
}

export function getGradeColor(letter: string): string {
  const colors: Record<string, string> = {
    'A': '#10b981',
    'A-': '#34d399',
    'B': '#3b82f6',
    'C+': '#f59e0b',
    'C': '#f97316',
    'D-': '#ef4444',
    'D': '#dc2626',
    'F': '#991b1b',
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
