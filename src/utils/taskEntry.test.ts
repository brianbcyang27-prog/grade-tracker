import { describe, expect, test } from 'vitest';
import { parseCriterionScores, EMPTY_CRITERION_INPUTS } from './taskEntry';

describe('parseCriterionScores', () => {
  test('returns one score per filled criterion and skips blanks', () => {
    const result = parseCriterionScores({ A: '', B: '6', C: ' 7 ', D: '' });
    expect(result).toEqual({ ok: true, scores: [{ criterion: 'B', score: 6 }, { criterion: 'C', score: 7 }] });
  });

  test('accepts all four criteria including 0 and 8', () => {
    const result = parseCriterionScores({ A: '0', B: '8', C: '4', D: '5' });
    expect(result.ok && result.scores.map((s) => s.score)).toEqual([0, 8, 4, 5]);
  });

  test('errors when every criterion is blank', () => {
    const result = parseCriterionScores(EMPTY_CRITERION_INPUTS);
    expect(result).toEqual({ ok: false, error: 'Enter a score for at least one criterion.' });
  });

  test('errors on out-of-range score and names the criterion', () => {
    expect(parseCriterionScores({ ...EMPTY_CRITERION_INPUTS, C: '9' })).toEqual({
      ok: false,
      error: 'Criterion C must be a whole number from 0 to 8.',
    });
  });

  test('errors on negative, decimal, or non-numeric scores', () => {
    for (const bad of ['-1', '6.5', 'abc', '6abc']) {
      expect(parseCriterionScores({ ...EMPTY_CRITERION_INPUTS, A: bad }).ok).toBe(false);
    }
  });
});
