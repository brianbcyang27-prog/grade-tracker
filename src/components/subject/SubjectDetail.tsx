import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGradeStore } from '../../store/gradeStore';
import { CRITERIA, type Criterion } from '../../types';
import { computeSubjectData, roundTo, getGradeColor } from '../../utils/grading';
import Badge from '../common/Badge';
import ScoreBar from '../common/ScoreBar';

export default function SubjectDetail() {
  const { subject: encodedSubject, semester } = useParams();
  const navigate = useNavigate();
  const subject = decodeURIComponent(encodedSubject ?? '');
  const { assignments, userId, removeAssignment, updateAssignment } = useGradeStore();

  const data = computeSubjectData(assignments, subject as any, semester as any);

  const [tableFilter, setTableFilter] = useState<Criterion | 'ALL'>('ALL');

  const tableRows = CRITERIA.flatMap((c) => {
    const rows = data.criteria[c].map((a) => ({ ...a, criterion: c }));
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

      </div>
    </div>
  );
}
