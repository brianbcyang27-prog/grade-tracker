import { useState } from 'react';
import { useGradeStore } from '../../store/gradeStore';
import { SEMESTERS, SUBJECTS, CRITERIA } from '../../types';
import type { Semester, SubjectName, Criterion } from '../../types';

export default function MiniInputPanel() {
  const addAssignment = useGradeStore((s) => s.addAssignment);
  const userId = useGradeStore((s) => s.userId);
  const [semester, setSemester] = useState<Semester>(SEMESTERS[0]);
  const [subject, setSubject] = useState<SubjectName>(SUBJECTS[0]);
  const [criterion, setCriterion] = useState<Criterion>('A');
  const [title, setTitle] = useState('');
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const scoreNum = parseFloat(score);
    if (!title.trim() || isNaN(scoreNum) || scoreNum < 0 || scoreNum > 8) return;

    await addAssignment(userId, semester, subject, criterion, title.trim(), scoreNum, date, notes || undefined);
    setTitle('');
    setScore('');
    setNotes('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
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
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as SubjectName)}
            className="w-full px-3 py-2 rounded-lg text-sm border transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
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
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm border transition-colors"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
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
