import { SUBJECTS } from '../types';

export function getAllSubjects(customSubjects: string[]): string[] {
  const defaults = new Set(SUBJECTS);
  const extras = customSubjects.filter((s) => !defaults.has(s as any));
  return [...SUBJECTS, ...extras];
}
