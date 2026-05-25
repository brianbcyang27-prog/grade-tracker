import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGradeStore } from '../../store/gradeStore';
import { CRITERIA, SEMESTERS, SUBJECTS, type Criterion } from '../../types';
import { computeSubjectData, getGradeBand, roundTo, getGradeColor } from '../../utils/grading';
import Badge from '../common/Badge';
import ScoreBar from '../common/ScoreBar';

export default function SubjectDetail() {
  const { subject: encodedSubject, semester } = useParams();
  const navigate = useNavigate();
  const subject = decodeURIComponent(encodedSubject ?? '');
  const { assignments, userId, removeAssignment, updateAssignment, addAssignment } = useGradeStore();

  const data = computeSubjectData(assignments, subject as any, semester as any);

  const [whatIfScores, setWhatIfScores] = useState<Record<string, number>>({});
  const [whatIfCriterion, setWhatIfCriterion] = useState<Criterion>('A');
  const [tableFilter, setTableFilter] = useState<Criterion | 'ALL'>('ALL');

  // Inline add row state
  const [newTitle, setNewTitle] = useState('');
  const [newScore, setNewScore] = useState('');
  const [newCriterion, setNewCriterion] = useState<Criterion>('A');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const handleWhatIfChange = (assignmentId: string, score: number) => {
    setWhatIfScores((prev) => ({ ...prev, [assignmentId]: score }));
  };

  const computeWhatIf = () => {
    const modifiedAssignments = assignments.map((a) => {
      if (a.id in whatIfScores) {
        return { ...a, score: whatIfScores[a.id] };
      }
      return a;
    });

    const modifiedSubject = modifiedAssignments.filter(
      (a) => a.subject === subject && a.semester === semester,
    );

    const criterionScores = CRITERIA.map((c) => {
      const scores = modifiedSubject
        .filter((a) => a.criterion === c)
        .map((a) => a.score);
      return scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    });

    return {
      total: roundTo(criterionScores.reduce((s, v) => s + v, 0)),
      grade: getGradeBand(criterionScores.reduce((s, v) => s + v, 0)),
    };
  };

  const whatIfResult = computeWhatIf();
  const hasChanges = Object.keys(whatIfScores).length > 0;

  const clearWhatIf = () => setWhatIfScores({});
  const isWhatIfModified = (a: any) => a.id in whatIfScores;

  // Build assessment table with placeholder rows for missing criteria
  const tableRows = CRITERIA.flatMap((c) => {
    const rows = data.criteria[c].map((a) => ({ ...a, criterion: c }));
    // If criterion has no assignments, add a placeholder row
    if (rows.length === 0) {
      return [{ id: `placeholder-${c}`, criterion: c, title: '—', score: 0, maxScore: 8, date: '—', status: 'no data' as const, subject: subject as any, semester: semester as any }];
    }
    return rows;
  }).filter((r) => tableFilter === 'ALL' || r.criterion === tableFilter)
    .sort((a, b) => {
      const order = CRITERIA.indexOf(a.criterion) - CRITERIA.indexOf(b.criterion);
      if (order !== 0) return order;
      return b.date.localeCompare(a.date);
    });

  const handleAddRow = async () => {
    if (!userId || !newTitle.trim() || !newScore) return;
    const scoreNum = parseFloat(newScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 8) return;
    await addAssignment(userId, subject as any, semester as any, newCriterion, newTitle.trim(), scoreNum, newDate);
    setNewTitle('');
    setNewScore('');
  };

  const handleDelete = (id: string) => {
    if (!userId || id.startsWith('placeholder-')) return;
    removeAssignment(userId, id);
  };

  const handleScoreEdit = (id: string, value: string) => {
    if (!userId || id.startsWith('placeholder-')) return;
    const scoreNum = parseFloat(value);
    if (!isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 8) {
      updateAssignment(userId, id, { score: scoreNum });
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm mb-4 transition-colors cursor-pointer"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      {/* LOGIC LAYER - Computed Summary */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {data.subject}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {data.semester} — Computed Summary
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3">
              <Badge letter={data.grade.letter} score={data.totalScore} size="lg" />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {data.gradeLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {CRITERIA.map((c) => {
            const scores = data.criteria[c].map((a) => a.score);
            const avg = scores.length > 0 ? roundTo(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
            return (
              <div key={c} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                    Criterion {c}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                    color: '#fff',
                    backgroundColor: getGradeColor(avg >= 6 ? 'A' : avg >= 4 ? 'C+' : 'D'),
                  }}>
                    {avg.toFixed(1)}
                  </span>
                </div>
                <ScoreBar label="" score={avg} showScore={false} />
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {scores.length} {scores.length === 1 ? 'assignment' : 'assignments'}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="p-4 rounded-lg text-center text-sm"
          style={{
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
          }}
        >
          <strong>Total Score: {data.totalScore.toFixed(1)} / 32</strong>
          {' · '}
          Grade: <strong>{data.grade.letter}</strong> — {data.grade.label}
        </div>
      </div>

      {/* RAW DATA LAYER - Assessment Table */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            Assessment Table
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Filter:
            </span>
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value as Criterion | 'ALL')}
              className="px-2 py-1 rounded text-xs border cursor-pointer"
              style={{
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            >
              <option value="ALL">All</option>
              {CRITERIA.map((c) => (
                <option key={c} value={c}>Criterion {c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Header - strict columns */}
        <div
          className="grid grid-cols-[60px_1fr_100px_100px_80px_40px] gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg mb-1"
          style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)' }}
        >
          <span>Criterion</span>
          <span>Title</span>
          <span>Date</span>
          <span>Score</span>
          <span>Max</span>
          <span></span>
        </div>

        {/* Table Rows */}
        <div className="space-y-0.5 mb-4">
          {tableRows.map((row) => {
            const isPlaceholder = row.id.startsWith('placeholder-');
            const statusColor = isPlaceholder ? 'var(--color-warning)' : 'var(--color-success)';
            const statusText = isPlaceholder ? 'no data' : 'data in';

            return (
              <div
                key={row.id}
                className="grid grid-cols-[60px_1fr_100px_100px_80px_40px] gap-2 px-3 py-2 rounded-lg text-sm items-center transition-colors"
                style={{
                  color: 'var(--color-text)',
                  opacity: isPlaceholder ? 0.5 : 1,
                  backgroundColor: isPlaceholder ? 'transparent' : 'transparent',
                }}
              >
                <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit"
                  style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)' }}>
                  {row.criterion}
                </span>
                <span className="truncate">{row.title}</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{row.date}</span>
                {isPlaceholder ? (
                  <span style={{ color: 'var(--color-text-secondary)' }}>—</span>
                ) : (
                  <input
                    type="number"
                    min={0}
                    max={8}
                    value={(row as any).score}
                    onChange={(e) => handleScoreEdit(row.id, e.target.value)}
                    className="w-16 px-2 py-0.5 rounded text-sm border"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      color: getGradeColor((row as any).score >= 6 ? 'A' : (row as any).score >= 4 ? 'C+' : 'D'),
                      borderColor: 'var(--color-border)',
                      fontWeight: 600,
                    }}
                  />
                )}
                <span style={{ color: 'var(--color-text-secondary)' }}>{(row as any).maxScore ?? 8}</span>
                <div className="flex items-center gap-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${isPlaceholder ? '' : ''}`}
                    style={{ backgroundColor: statusColor }} />
                  {!isPlaceholder && (
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="p-0.5 rounded transition-colors cursor-pointer"
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

        {/* Add Row Form */}
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: 'var(--color-bg)' }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value as Criterion)}
              className="px-2 py-1.5 rounded text-xs border cursor-pointer"
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
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Assignment title"
              className="flex-1 min-w-[120px] px-2 py-1.5 rounded text-sm border"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-2 py-1.5 rounded text-sm border"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            />
            <input
              type="number"
              min={0}
              max={8}
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              placeholder="Score"
              className="w-16 px-2 py-1.5 rounded text-sm border"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-border)',
              }}
            />
            <button
              onClick={handleAddRow}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
              style={{ color: '#fff', backgroundColor: 'var(--color-primary)' }}
            >
              + Add Row
            </button>
          </div>
        </div>
      </div>

      {/* What-If Calculator - stays as-is */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            What-If Simulator
          </h3>
          <div className="flex items-center gap-2 text-sm">
            {hasChanges && (
              <>
                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {whatIfResult.total.toFixed(1)}/32 → {whatIfResult.grade.letter}
                </span>
                <button
                  onClick={clearWhatIf}
                  className="text-xs px-2 py-1 rounded cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg)' }}
                >
                  Reset
                </button>
              </>
            )}
            {!hasChanges && (
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Adjust scores below to see grade impact
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Filter:
          </span>
          {CRITERIA.map((c) => (
            <button
              key={c}
              onClick={() => setWhatIfCriterion(c)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              style={{
                color: whatIfCriterion === c ? '#fff' : 'var(--color-text-secondary)',
                backgroundColor: whatIfCriterion === c ? 'var(--color-primary)' : 'var(--color-bg)',
              }}
            >
              Criterion {c}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {data.criteria[whatIfCriterion].length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--color-text-secondary)' }}>
              No assignments for Criterion {whatIfCriterion}
            </p>
          ) : (
            data.criteria[whatIfCriterion].map((a) => {
              const modifiedScore = a.id in whatIfScores ? whatIfScores[a.id] : a.score;
              const modified = a.id in whatIfScores;
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ backgroundColor: modified ? 'var(--color-primary-light)' : 'transparent' }}
                >
                  <span className="text-sm flex-1" style={{ color: 'var(--color-text)' }}>
                    {a.title}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={8}
                    step={1}
                    value={modifiedScore}
                    onChange={(e) => handleWhatIfChange(a.id, parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span
                    className="text-sm font-bold w-6 text-right"
                    style={{ color: modified ? 'var(--color-primary)' : 'var(--color-text)' }}
                  >
                    {modifiedScore}
                  </span>
                  {modified && (
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      (was {a.score})
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
