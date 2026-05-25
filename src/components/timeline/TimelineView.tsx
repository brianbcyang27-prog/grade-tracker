import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGradeStore } from '../../store/gradeStore';
import { CRITERIA, type Criterion, type Assignment } from '../../types';
import { getAllSubjects } from '../../utils/subjects';
import { getGradeColor } from '../../utils/grading';

type FilterSubject = 'ALL' | Assignment['subject'];

export default function TimelineView() {
  const { assignments, customSubjects } = useGradeStore();
  const allSubjects = getAllSubjects(customSubjects);
  const navigate = useNavigate();
  const [filterSubject, setFilterSubject] = useState<FilterSubject>('ALL');
  const [filterCriterion, setFilterCriterion] = useState<Criterion | 'ALL'>('ALL');

  const filteredAssignments = assignments
    .filter((a) => filterSubject === 'ALL' || a.subject === filterSubject)
    .filter((a) => filterCriterion === 'ALL' || a.criterion === filterCriterion)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const today = new Date();
  const isPastDue = (date: string) => new Date(date) < today;

  return (
    <div className="page-enter">
      <div className="mb-6 animate-fadeIn">
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
          Assignment Timeline
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Chronological view of all assignments
        </p>
      </div>

      <div
        className="rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3 animate-slideUp"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Filters:</span>
        </div>

        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value as FilterSubject)}
          className="px-3 py-1.5 rounded-lg text-sm border cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
          }}
        >
          <option value="ALL">All Subjects</option>
          {allSubjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filterCriterion}
          onChange={(e) => setFilterCriterion(e.target.value as Criterion | 'ALL')}
          className="px-3 py-1.5 rounded-lg text-sm border cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
          }}
        >
          <option value="ALL">All Criteria</option>
          {CRITERIA.map((c) => (
            <option key={c} value={c}>Criterion {c}</option>
          ))}
        </select>

        <span className="text-xs ml-auto" style={{ color: 'var(--color-text-secondary)' }}>
          {filteredAssignments.length} {filteredAssignments.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Timeline */}
      {filteredAssignments.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center animate-scaleIn"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <svg
            className="w-16 h-16 mx-auto mb-4 animate-fadeIn"
            style={{ color: 'var(--color-text-secondary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            No assignments found
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Try adjusting your filters or add new grades.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map((a, i) => {
            const animDelay = `${Math.min(i * 0.03, 0.4)}s`;
            const pastDue = isPastDue(a.date);
            return (
              <div
                key={a.id}
                className="rounded-xl p-4 transition-all duration-200 flex items-start gap-4 cursor-pointer card-hover"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  boxShadow: 'var(--color-card-shadow)',
                  borderLeft: `4px solid ${getGradeColor(a.score >= 6 ? 'A' : a.score >= 4 ? 'C+' : 'D')}`,
                  animation: `slideUp 0.3s ease ${animDelay} both`,
                }}
                onClick={() =>
                  navigate(`/subject/${encodeURIComponent(a.subject)}/${a.semester}`)
                }
              >
                {/* Date Column */}
                <div className="text-center min-w-[48px]">
                  <div className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    {new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                    {new Date(a.date).getDate()}
                  </div>
                  {pastDue && (
                    <div className="text-[10px] font-medium mt-1 px-1.5 py-0.5 rounded" style={{
                      color: '#fff',
                      backgroundColor: 'var(--color-danger)',
                    }}>
                      Overdue
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                        {a.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            color: 'var(--color-primary)',
                            backgroundColor: 'var(--color-primary-light)',
                          }}
                        >
                          {a.subject}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          Criterion {a.criterion}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          {a.semester}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-lg font-bold"
                        style={{
                          color: getGradeColor(a.score >= 6 ? 'A' : a.score >= 4 ? 'C+' : 'D'),
                        }}
                      >
                        {a.score}
                        <span className="text-xs font-normal" style={{ color: 'var(--color-text-secondary)' }}>
                          /8
                        </span>
                      </div>
                    </div>
                  </div>

                  {a.notes && (
                    <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                      {a.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
