import { localDateString } from '../../utils/date';
import { useState } from 'react';
import { useGradeStore } from '../../store/gradeStore';
import { SEMESTERS, CRITERIA } from '../../types';
import type { Semester } from '../../types';
import { getAllSubjects } from '../../utils/subjects';
import { EMPTY_CRITERION_INPUTS, parseCriterionScores } from '../../utils/taskEntry';
import type { CriterionInputs } from '../../utils/taskEntry';

export default function MiniInputPanel() {
  const addTask = useGradeStore((s) => s.addTask);
  const userId = useGradeStore((s) => s.userId);
  const storeError = useGradeStore((s) => s.error);
  const setError = useGradeStore((s) => s.setError);
  const customSubjects = useGradeStore((s) => s.customSubjects);
  const addCustomSubject = useGradeStore((s) => s.addCustomSubject);
  const allSubjects = getAllSubjects(customSubjects);
  const [semester, setSemester] = useState<Semester>(SEMESTERS[0]);
  const [subject, setSubject] = useState<string>(allSubjects[0]);
  const [criterionInputs, setCriterionInputs] = useState<CriterionInputs>(EMPTY_CRITERION_INPUTS);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(localDateString());
  const [includeDate, setIncludeDate] = useState(true);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!userId) {
      setLocalError('Not logged in. Please sign in first.');
      return;
    }
    if (!title.trim()) {
      setLocalError('Task title is required.');
      return;
    }
    const parsed = parseCriterionScores(criterionInputs);
    if (!parsed.ok) {
      setLocalError(parsed.error);
      return;
    }

    setSaving(true);
    try {
      await addTask(userId, {
        semester,
        subject,
        title: title.trim(),
        date: includeDate ? date : localDateString(),
        notes: notes.trim() || undefined,
        scores: parsed.scores,
      });
      setTitle('');
      setCriterionInputs(EMPTY_CRITERION_INPUTS);
      setNotes('');
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('[InputPanel] Saving task failed:', err);
      setLocalError(`Couldn't save the task: ${err instanceof Error ? err.message : 'unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const filledCount = CRITERIA.filter((c) => criterionInputs[c].trim() !== '').length;

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

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Task Title
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

        <fieldset>
          <legend className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Criterion scores (0-8) <span className="font-normal opacity-75">· leave blank if not assessed</span>
          </legend>
          <div className="grid grid-cols-4 gap-1.5">
            {CRITERIA.map((c) => {
              const filled = criterionInputs[c].trim() !== '';
              return (
                <label key={c} className="flex flex-col items-center gap-1">
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: filled ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
                  >
                    {c}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={8}
                    step={1}
                    value={criterionInputs[c]}
                    onChange={(e) => setCriterionInputs((prev) => ({ ...prev, [c]: e.target.value }))}
                    placeholder="–"
                    aria-label={`Criterion ${c} score`}
                    className="w-full px-1 py-2 rounded-lg text-sm text-center border transition-colors"
                    style={{
                      backgroundColor: filled ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      color: 'var(--color-text)',
                      borderColor: filled ? 'var(--color-primary)' : 'var(--color-border)',
                    }}
                  />
                </label>
              );
            })}
          </div>
        </fieldset>

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
          disabled={saving}
          className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          style={{
            color: '#fff',
            backgroundColor: success ? 'var(--color-success)' : 'var(--color-primary)',
          }}
        >
          {success
            ? '✓ Added!'
            : saving
              ? 'Saving…'
              : filledCount > 1
                ? `Add Task (${filledCount} criteria)`
                : 'Add Task'}
        </button>
      </form>

      <div
        className="mt-4 p-3 rounded-lg text-xs"
        style={{
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <strong style={{ color: 'var(--color-primary)' }}>Tip:</strong> Enter the task once, just like on
        ManageBac, and fill in every criterion it was marked on. Each criterion's average is used for the final grade.
      </div>
    </div>
  );
}
