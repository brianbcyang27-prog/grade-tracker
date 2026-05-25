import type { Assignment, SubjectName, Semester, Criterion } from '../types';
import { CRITERIA } from '../types';
import { computeSubjectData, GRADE_BANDS, getGradeBand } from './grading';

export interface Suggestion {
  type: 'warning' | 'insight' | 'tip' | 'achievement';
  message: string;
  icon: string;
}

export function generateSuggestions(assignments: Assignment[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (assignments.length === 0) {
    suggestions.push({
      type: 'tip',
      message: 'Start by adding your first assignment using the Mini Input Panel on the right.',
      icon: '💡',
    });
    return suggestions;
  }

  const subjectSemesters = new Set<string>();
  assignments.forEach((a) => subjectSemesters.add(`${a.subject}::${a.semester}`));

  const allSubjects = Array.from(subjectSemesters).map((key) => {
    const [subject, semester] = key.split('::') as [SubjectName, Semester];
    return computeSubjectData(assignments, subject, semester);
  });

  for (const subject of allSubjects) {
    const weakest = findWeakestCriterion(subject.criteria);
    if (weakest) {
      const avg = weakest.scores.length > 0
        ? weakest.scores.reduce((a, b) => a + b, 0) / weakest.scores.length
        : 0;
      if (avg < 4 && weakest.scores.length > 0) {
        suggestions.push({
          type: 'warning',
          message: `Your weakest criterion is ${weakest.criterion} in ${subject.subject} (avg: ${avg.toFixed(1)}/8). Consider focusing more effort here.`,
          icon: '⚠️',
        });
      }
    }

    const nextBand = findNextGradeBand(subject.totalScore);
    if (nextBand) {
      const pointsNeeded = nextBand.minScore - subject.totalScore;
      if (pointsNeeded > 0 && pointsNeeded <= 4) {
        suggestions.push({
          type: 'insight',
          message: `You are ${pointsNeeded.toFixed(1)} point${pointsNeeded > 1 ? 's' : ''} away from ${nextBand.letter} in ${subject.subject}.`,
          icon: '🎯',
        });
      }
    }

    if (subject.totalScore >= 28) {
      suggestions.push({
        type: 'achievement',
        message: `Outstanding performance in ${subject.subject}! You achieved an A (${subject.totalScore}/32).`,
        icon: '🏆',
      });
    }
  }

  const totalEntries = assignments.length;
  if (totalEntries > 20) {
    suggestions.push({
      type: 'achievement',
      message: `You've logged ${totalEntries} assignments — great tracking habit!`,
      icon: '📊',
    });
  }

  suggestions.push({
    type: 'tip',
    message: 'Tip: Use the What-If Calculator on any subject page to see how changing a score affects your final grade.',
    icon: '💡',
  });

  return suggestions;
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

function findNextGradeBand(currentScore: number): { minScore: number; letter: string } | null {
  const currentBand = getGradeBand(currentScore);
  const currentIdx = GRADE_BANDS.findIndex(
    (g) => g.letter === currentBand.letter,
  );

  if (currentIdx < GRADE_BANDS.length - 1) {
    return {
      minScore: GRADE_BANDS[currentIdx + 1].minScore,
      letter: GRADE_BANDS[currentIdx + 1].letter,
    };
  }

  return null;
}
