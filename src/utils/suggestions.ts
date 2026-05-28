import type { Assignment, Semester, Criterion, SubjectData } from '../types';
import { CRITERIA } from '../types';
import { computeSubjectData, detectSystem } from './grading';
import { GRADE_9_BANDS, GRADE_10_BANDS } from './grading';

export interface Suggestion {
  type: 'warning' | 'insight' | 'tip' | 'achievement';
  message: string;
  icon: string;
}

const MAX_SUGGESTIONS = 4;

export function generateSuggestions(assignments: Assignment[]): Suggestion[] {
  if (assignments.length === 0) {
    return [{
      type: 'tip',
      message: 'Start by adding your first assignment using the Mini Input Panel on the right.',
      icon: '💡',
    }];
  }

  const subjectSemesters = new Set<string>();
  assignments.forEach((a) => subjectSemesters.add(`${a.subject}::${a.semester}`));

  const allSubjects = Array.from(subjectSemesters).map((key) => {
    const [subject, semester] = key.split('::') as [string, Semester];
    return computeSubjectData(assignments, subject, semester);
  });

  const result: Suggestion[] = [];

  // 1. Warnings — weakest criterion below 4, sorted by severity
  const warnings: Suggestion[] = [];
  for (const subject of allSubjects) {
    const weakest = findWeakestCriterion(subject.criteria);
    if (weakest) {
      const scores = weakest.scores;
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg < 4 && scores.length > 0) {
        warnings.push({
          type: 'warning',
          message: `Weakest: Criterion ${weakest.criterion} in ${subject.subject} (avg ${avg.toFixed(1)}/8). Focus here.`,
          icon: '⚠️',
        });
      }
    }
  }
  warnings.sort((a, b) => {
    const aAvg = parseFloat(a.message.match(/\(avg ([\d.]+)\/8\)/)?.[1] ?? '8');
    const bAvg = parseFloat(b.message.match(/\(avg ([\d.]+)\/8\)/)?.[1] ?? '8');
    return aAvg - bAvg;
  });
  result.push(...warnings.slice(0, 2));

  // 2. Achievements — only show the best one
  const achievements: Suggestion[] = [];
  for (const subject of allSubjects) {
    if (subject.totalScore >= 28) {
      achievements.push({
        type: 'achievement',
        message: `Outstanding: ${subject.subject} with ${subject.totalScore.toFixed(1)}/32 (${subject.grade.letter}).`,
        icon: '🏆',
      });
    }
  }
  const totalEntries = assignments.length;
  if (totalEntries > 30) {
    achievements.push({
      type: 'achievement',
      message: `You've logged ${totalEntries} assignments — solid tracking habit!`,
      icon: '📊',
    });
  }
  if (achievements.length > 0) {
    result.push(achievements[0]);
  }

  // 3. Grade gap insights — closest to next band, max 1
  const gaps: { points: number; message: string }[] = [];
  for (const subject of allSubjects) {
    const nextBand = findNextGradeBand(subject);
    if (nextBand) {
      const pointsNeeded = nextBand.minScore - subject.totalScore;
      if (pointsNeeded > 0 && pointsNeeded <= 4) {
        gaps.push({
          points: pointsNeeded,
          message: `${pointsNeeded.toFixed(1)} pt${pointsNeeded > 1 ? 's' : ''} to ${nextBand.letter} in ${subject.subject}.`,
        });
      }
    }
  }
  gaps.sort((a, b) => a.points - b.points);
  if (gaps.length > 0) {
    result.push({
      type: 'insight',
      message: `Close to the next grade: ${gaps[0].message}`,
      icon: '🎯',
    });
  }

  return result.slice(0, MAX_SUGGESTIONS);
}

function findWeakestCriterion(
  criteria: Record<Criterion, Assignment[]>,
): { criterion: Criterion; scores: number[] } | null {
  let weakest: { criterion: Criterion; scores: number[] } | null = null;
  let lowestAvg = Infinity;

  for (const c of CRITERIA) {
    const scores = criteria[c].map((a) => a.score);
    if (scores.length === 0) continue;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg < lowestAvg) {
      lowestAvg = avg;
      weakest = { criterion: c, scores };
    }
  }

  return weakest;
}

function findNextGradeBand(subject: SubjectData): { minScore: number; letter: string } | null {
  const system = detectSystem(subject.semester);
  const bands = system === 'myp-year4' ? GRADE_9_BANDS : GRADE_10_BANDS;
  const currentIdx = bands.findIndex((g) => g.letter === subject.grade.letter);

  if (currentIdx >= 0 && currentIdx < bands.length - 1) {
    return {
      minScore: bands[currentIdx + 1].minScore,
      letter: bands[currentIdx + 1].letter,
    };
  }

  return null;
}
