import { useState } from 'react';
import { useGradeStore } from '../../store/gradeStore';
import { SEMESTERS, CRITERIA } from '../../types';
import type { Semester, Criterion } from '../../types';
import { getAllSubjects } from '../../utils/subjects';

export default function MiniInputPanel() {
  const addAssignment = useGradeStore((s) => s.addAssignment);
  const userId = useGradeStore((s) => s.userId);
  const storeError = useGradeStore((s) => s.error);
  const setError = useGradeStore((s) => s.setError);
  const customSubjects = useGradeStore((s) => s.customSubjects);
  const addCustomSubject = useGradeStore((s) => s.addCustomSubject);
  const allSubjects = getAllSubjects(customSubjects);
  const [semester, setSemester] = useState<Semester>(SEMESTERS[0]);
  const [subject, setSubject] = useState<string>(allSubjects[0]);
  const [criterion, setCriterion] = useState<Criterion>('A');
  const [title, setTitle] = useState('');
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [includeDate, setIncludeDate] = useState(true);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    console.log('[InputPanel] Submit clicked. userId:', userId);
    console.log('[InputPanel] Form values:', { semester, subject, criterion, title, score, date });

    if (!userId) {
      console.error('[InputPanel] No userId - user might not be logged in');
      setLocalError('Not logged in. Please sign in first.');
      return;
    }

    const scoreNum = parseFloat(score);
    if (!title.trim() || isNaN(scoreNum) || scoreNum < 0 || scoreNum > 8) {
      setLocalError('Invalid input. Score must be 0-8 and title is required.');
      return;
    }

    console.log('[InputPanel] Calling addAssignment...');
    try {
      await addAssignment(userId, semester, subject, criterion, title.trim(), scoreNum, includeDate ? date : undefined, notes || undefined);
      console.log('[InputPanel] addAssignment completed');

      setTitle('');
      setScore('');
      setNotes('');
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      console.error('[InputPanel] Submit failed:', err);
      setLocalError(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Quick Add Grade
        </h2>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-primary-light)',
          }}
        >
          Mini Input
        </span>
      </div>

      {(localError || storeError) && (
        <div
          className="p-3 rounded-lg text-xs mb-3"
          style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}
        >
          {localError || storeError}
          <button
            onClick={() => { setLocalError(''); setError(null); }}
            className="ml-2 font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Semester
          </label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value as Semester)}
            className="w-full px-3 py-2 rounded-lg text-sm border transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Subject
          </label>
          {showNewSubject ? (
            <div className="flex gap-1">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="New subject name"
                className="flex-1 px-3 py-2 rounded-lg text-sm border transition-colors"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  const name = newSubjectName.trim();
                  if (name) {
                    addCustomSubject(name);
                    setSubject(name);
                    setNewSubjectName('');
                    setShowNewSubject(false);
                  }
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium cursor-pointer"
                style={{ color: '#fff', backgroundColor: 'var(--color-success)' }}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setShowNewSubject(false); setNewSubjectName(''); }}
                className="px-3 py-2 rounded-lg text-sm cursor-pointer"
                style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface)' }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex gap-1">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg text-sm border transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {allSubjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewSubject(true)}
                className="px-2.5 py-2 rounded-lg text-sm font-medium cursor-pointer whitespace-nowrap"
                style={{
                  color: 'var(--color-primary)',
                  backgroundColor: 'var(--color-primary-light)',
                }}
                title="Add new subject"
              >
                + New
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Criterion
            </label>
            <select
              value={criterion}
              onChange={(e) => setCriterion(e.target.value as Criterion)}
              className="w-full px-3 py-2 rounded-lg text-sm border transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            >
              {CRITERIA.map((c) => (
                <option key={c} value={c}>Criterion {c}</option>
              ))}
            </select>
          </div>
          <div className="w-20">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
              Score (0-8)
            </label>
            <input
              type="number"
              min={0}
              max={8}
              step={1}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border transition-colors"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Assignment Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Unit 1 Test"
            className="w-full px-3 py-2 rounded-lg text-sm border transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
            required
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <label className="block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Date
            </label>
            <button
              type="button"
              onClick={() => setIncludeDate(!includeDate)}
              className="relative inline-flex h-3.5 w-6 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
              style={{
                backgroundColor: includeDate ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            >
              <span
                className="pointer-events-none inline-block h-2.5 w-2.5 rounded-full bg-white shadow ring-0 transition-transform"
                style={{ transform: includeDate ? 'translateX(11px)' : 'translateX(0)' }}
              />
            </button>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={!includeDate}
            className="w-full px-3 py-2 rounded-lg text-sm border transition-all"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
              opacity: includeDate ? 1 : 0.35,
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Notes (optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes..."
            className="w-full px-3 py-2 rounded-lg text-sm border transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
          style={{
            color: '#fff',
            backgroundColor: success ? 'var(--color-success)' : 'var(--color-primary)',
          }}
        >
          {success ? '✓ Added!' : 'Add Assignment'}
        </button>
      </form>

      <div
        className="mt-4 p-3 rounded-lg text-xs"
        style={{
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <strong style={{ color: 'var(--color-primary)' }}>Tip:</strong> Scores are 0-8 per criterion.
        Average of all assignments in each criterion is used for the final grade calculation.
      </div>
    </div>
  );
}
