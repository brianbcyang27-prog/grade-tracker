import { useGradeStore } from '../../store/gradeStore';
import { computeAllSubjects } from '../../utils/grading';
import OverallSummary from './OverallSummary';
import SubjectCard from './SubjectCard';
import Suggestions from './Suggestions';
import DataTools from './DataTools';

export default function Dashboard() {
  const { assignments, selectedSemester, loading } = useGradeStore();
  const subjects = computeAllSubjects(assignments, selectedSemester);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            {selectedSemester === 'ALL' ? 'Overall Dashboard' : `${selectedSemester} Dashboard`}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {selectedSemester === 'ALL'
              ? 'Summary across all semesters'
              : `Grade summary for ${selectedSemester}`}
          </p>
        </div>
        <DataTools />
      </div>

      <Suggestions />
      <OverallSummary />

      {subjects.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              style={{ color: 'var(--color-text-secondary)' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            No grades yet
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Start by adding assignments using the Mini Input Panel on the right.
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-light)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Use the sidebar form to add your first grade
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {subjects.map((s) => (
            <SubjectCard key={`${s.subject}-${s.semester}`} data={s} allSubjects={subjects} />
          ))}
        </div>
      )}
    </div>
  );
}
