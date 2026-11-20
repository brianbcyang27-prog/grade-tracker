import { expect, test } from 'vitest';
import { localDateString } from './date';

test('uses the local calendar day, not the UTC day', () => {
  // 00:16 local time on Nov 20 — still Nov 19 in UTC for any zone ahead of UTC.
  expect(localDateString(new Date(2026, 10, 20, 0, 16))).toBe('2026-11-20');
});

test('zero-pads month and day', () => {
  expect(localDateString(new Date(2026, 0, 5, 12, 0))).toBe('2026-01-05');
});
