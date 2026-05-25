import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGradeStore } from '../../store/gradeStore';
import { CRITERIA, SEMESTERS, type Criterion, type Semester } from '../../types';
import { computeSubjectData, roundTo, getGradeColor } from '../../utils/grading';
import Badge from '../common/Badge';

export default function SubjectDetail() {
  const { subject: encodedSubject, semester } = useParams();
  const subject = decodeURIComponent(encodedSubject ?? '');
  const semesterParam = (semester ?? SEMESTERS[0]) as Semester;
  const { assignments, userId, removeAssignment, updateAssignment, addAssignment } = useGradeStore();

  const data = computeSubjectData(assignments, subject, semesterParam);

  const [tableFilter, setTableFilter] = useState<Criterion | 'ALL'>('ALL');
  // Quick-add form state
  const [showAdd, setShowAdd] = useState(false);
  const [addCriterion, setAddCriterion] = useState<Criterion>('A');
  const [addTitle, setAddTitle] = useState('');
  const [addScore, setAddScore] = useState('');
  const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0]);
  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Build table rows
  const tableRows = CRITERIA.flatMap((c) => {
    const rows = data.criteria[c].map((a) => ({ ...a, criterion: c }));
    if (rows.length === 0) {
      return [{ id: `placeholder-${c}`, criterion: c, title: '—', score: 0, maxScore: 8, date: '—', status: 'no data' as const, subject, semester: semesterParam }];
    }
    return rows;
  }).filter((r) => tableFilter === 'ALL' || r.criterion === tableFilter)
    .sort((a, b) => {
      const order = CRITERIA.indexOf(a.criterion) - CRITERIA.indexOf(b.criterion);
      if (order !== 0) return order;
      return b.date.localeCompare(a.date);
    });

  const handleDelete = (id: string) => {
    if (!userId || id.startsWith('placeholder-')) return;
    removeAssignment(userId, id);
  };

  const startEditing = (id: string, currentScore: number) => {
    setEditingId(id);
    setEditValue(String(currentScore));
  };

  const commitEdit = (id: string) => {
    if (!userId || id.startsWith('placeholder-')) return;
    const num = parseFloat(editValue);
    if (!isNaN(num) && num >= 0 && num <= 8) {
      updateAssignment(userId, id, { score: num });
    }
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!userId) return;
    const num = parseFloat(addScore);
    if (!addTitle.trim() || isNaN(num) || num < 0 || num > 8) return;
    addAssignment(userId, semesterParam, subject, addCriterion, addTitle.trim(), num, addDate || undefined);
    setAddTitle('');
    setAddScore('');
    setShowAdd(false);
  };

  const allCount = CRITERIA.reduce((sum, c) => sum + data.criteria[c].length, 0);

  return (
    <div className="page-enter">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm mb-5 transition-all hover:gap-2"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* ── Summary Card ── */}
      <div
        className="rounded-xl p-6 mb-6 card-hover animate-slideUp"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {data.subject}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              {data.semester} · {allCount} {allCount === 1 ? 'entry' : 'entries'}
            </p>
          </div>
          <Badge letter={data.grade.letter} score={data.totalScore} size="lg" />
        </div>

        {/* Criterion averages row */}
        <div className="flex flex-wrap gap-3 mb-4">
          {CRITERIA.map((c) => {
            const scores = data.criteria[c].map((a) => a.score);
            const avg = scores.length > 0 ? roundTo(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
            const color = getGradeColor(avg >= 6 ? 'A' : avg >= 4 ? 'C+' : 'D');
            return (
              <div
                key={c}
                className="flex-1 min-w-[80px] p-3 rounded-lg text-center animate-fadeIn"
                style={{ backgroundColor: 'var(--color-bg)' }}
              >
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Criterion {c}
                </div>
                <div className="text-lg font-bold" style={{ color }}>
                  {avg.toFixed(1)}
                </div>
                <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(avg / 8) * 100}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Total score banner */}
        <div
          className="p-3 rounded-lg text-center text-sm font-medium animate-fadeIn"
          style={{
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
          }}
        >
          Total Score: <strong>{data.totalScore.toFixed(1)} / 32</strong>
          {' · '}
          Grade: <strong>{data.grade.letter}</strong> — {data.grade.label}
        </div>
      </div>

      {/* ── Assessment Table ── */}
      <div
        className="rounded-xl p-6 animate-slideUp"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Assessments
          </h3>
          <div className="flex items-center gap-2">
            {/* Pill filter */}
            <div className="flex gap-1 bg-[var(--color-bg)] p-1 rounded-lg">
              {(['ALL', ...CRITERIA] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTableFilter(f)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer"
                  style={{
                    color: tableFilter === f ? '#fff' : 'var(--color-text-secondary)',
                    backgroundColor: tableFilter === f ? 'var(--color-primary)' : 'transparent',
                  }}
                >
                  {f === 'ALL' ? 'All' : `C${f}`}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setShowAdd(!showAdd); setAddCriterion(tableFilter === 'ALL' ? 'A' : tableFilter); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer hover:scale-105"
              style={{ color: '#fff', backgroundColor: 'var(--color-primary)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
        </div>

        {/* Inline add form */}
        {showAdd && (
          <div
            className="flex flex-wrap items-end gap-2 p-3 mb-3 rounded-lg animate-slideUp"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <div>
              <label className="block text-[10px] font-medium mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Criterion</label>
              <select
                value={addCriterion}
                onChange={(e) => setAddCriterion(e.target.value as Criterion)}
                className="px-2 py-1.5 rounded text-xs border cursor-pointer"
                style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
              >
                {CRITERIA.map((c) => <option key={c} value={c}>Criterion {c}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-[10px] font-medium mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Title</label>
              <input
                type="text"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                placeholder="e.g. Unit Test"
                className="w-full px-2 py-1.5 rounded text-xs border"
                style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Score</label>
              <input
                type="number"
                min={0}
                max={8}
                value={addScore}
                onChange={(e) => setAddScore(e.target.value)}
                placeholder="0-8"
                className="w-16 px-2 py-1.5 rounded text-xs border"
                style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Date</label>
              <input
                type="date"
                value={addDate}
                onChange={(e) => setAddDate(e.target.value)}
                className="w-28 px-2 py-1.5 rounded text-xs border"
                style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
              />
            </div>
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
              style={{ color: '#fff', backgroundColor: 'var(--color-success)' }}
            >
              Save
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-3 py-1.5 rounded text-xs cursor-pointer"
              style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-surface)' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Table header */}
        <div
          className="grid grid-cols-[56px_1fr_100px_80px_56px_36px] gap-2 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg mb-1"
          style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)' }}
        >
          <span>Crit.</span>
          <span>Title</span>
          <span>Date</span>
          <span className="text-center">Score</span>
          <span className="text-center">Max</span>
          <span></span>
        </div>

        {/* Table rows */}
        <div className="space-y-0.5">
          {tableRows.map((row, i) => {
            const isPlaceholder = row.id.startsWith('placeholder-');
            const hasData = !isPlaceholder;
            return (
              <div
                key={row.id}
                className={`grid grid-cols-[56px_1fr_100px_80px_56px_36px] gap-2 px-3 py-2 rounded-lg text-sm items-center ${hasData ? 'table-row-hover' : ''}`}
                style={{
                  color: 'var(--color-text)',
                  opacity: isPlaceholder ? 0.45 : 1,
                  backgroundColor: isPlaceholder ? 'transparent' : 'transparent',
                  animation: `slideUp 0.3s ease ${i * 0.03}s both`,
                }}
              >
                {/* Criterion badge */}
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded w-fit"
                  style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)' }}
                >
                  {row.criterion}
                </span>

                {/* Title */}
                {isPlaceholder ? (
                  <span style={{ color: 'var(--color-text-secondary)' }}>No data yet</span>
                ) : (
                  <span className="truncate font-medium">{row.title}</span>
                )}

                {/* Date */}
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {isPlaceholder ? '—' : row.date}
                </span>

                {/* Score - click to edit */}
                {isPlaceholder ? (
                  <span className="text-center text-xs" style={{ color: 'var(--color-text-secondary)' }}>—</span>
                ) : editingId === row.id ? (
                  <input
                    type="number"
                    min={0}
                    max={8}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(row.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(row.id); if (e.key === 'Escape') setEditingId(null); }}
                    className="w-full px-1.5 py-0.5 rounded text-sm text-center border-2 font-bold"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      color: getGradeColor((row as any).score >= 6 ? 'A' : (row as any).score >= 4 ? 'C+' : 'D'),
                      borderColor: 'var(--color-primary)',
                      outline: 'none',
                    }}
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => startEditing(row.id, (row as any).score)}
                    className="w-full px-1.5 py-0.5 rounded text-sm text-center font-bold transition-all cursor-pointer group"
                    style={{
                      color: getGradeColor((row as any).score >= 6 ? 'A' : (row as any).score >= 4 ? 'C+' : 'D'),
                    }}
                  >
                    <span className="group-hover:hidden">{row.score}</span>
                    <span className="hidden group-hover:inline text-xs" style={{ color: 'var(--color-primary)' }}>
                      Click to edit
                    </span>
                  </button>
                )}

                {/* Max score */}
                <span className="text-center text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {(row as any).maxScore ?? 8}
                </span>

                {/* Status + delete */}
                <div className="flex items-center justify-end gap-1">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: hasData ? 'var(--color-success)' : 'var(--color-warning)' }}
                  />
                  {hasData && (
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="p-0.5 rounded transition-all cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110"
                      style={{ color: 'var(--color-danger)' }}
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {tableRows.length === 0 && (
          <div className="py-12 text-center animate-fadeIn">
            <svg className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              No assessments found for this filter
            </p>
            <button
              onClick={() => setTableFilter('ALL')}
              className="mt-2 text-xs font-medium transition-colors cursor-pointer"
              style={{ color: 'var(--color-primary)' }}
            >
              Show all criteria
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
