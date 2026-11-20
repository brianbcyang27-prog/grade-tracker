import { CRITERIA } from '../types';
import type { Criterion } from '../types';

export const MIN_SCORE = 0;
export const MAX_SCORE = 8;

/** Raw text from the four criterion score boxes. Blank means "not assessed". */
export type CriterionInputs = Readonly<Record<Criterion, string>>;

export interface CriterionScore {
  criterion: Criterion;
  score: number;
}

export type ParseResult =
  | { ok: true; scores: CriterionScore[] }
  | { ok: false; error: string };

export const EMPTY_CRITERION_INPUTS: CriterionInputs = { A: '', B: '', C: '', D: '' };

const WHOLE_NUMBER = /^\d+$/;

/**
 * Turns the A/B/C/D score boxes of one task into the criterion scores to save.
 * Blank boxes are skipped; at least one criterion must be filled in.
 */
export function parseCriterionScores(inputs: CriterionInputs): ParseResult {
  const scores: CriterionScore[] = [];

  for (const criterion of CRITERIA) {
    const raw = inputs[criterion].trim();
    if (raw === '') continue;

    const score = Number(raw);
    if (!WHOLE_NUMBER.test(raw) || score < MIN_SCORE || score > MAX_SCORE) {
      return { ok: false, error: `Criterion ${criterion} must be a whole number from ${MIN_SCORE} to ${MAX_SCORE}.` };
    }
    scores.push({ criterion, score });
  }

  if (scores.length === 0) {
    return { ok: false, error: 'Enter a score for at least one criterion.' };
  }
  return { ok: true, scores };
}
