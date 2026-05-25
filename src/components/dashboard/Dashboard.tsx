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
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="skeleton h-7 w-48" />
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
        <div className="skeleton h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold animate-fadeIn" style={{ color: 'var(--color-text)' }}>
            {selectedSemester === 'ALL' ? 'Overall Dashboard' : `${selectedSemester} Dashboard`}
          </h2>
          <p className="text-sm mt-1 animate-fadeIn" style={{ color: 'var(--color-text-secondary)' }}>
            {selectedSemester === 'ALL'
              ? 'Summary across all semesters'
              : `Grade summary for ${selectedSemester}`}
          </p>
        </div>
        <DataTools />
      </div>

      <div className="animate-slideUp">
        <Suggestions />
      </div>
      <div className="animate-slideUp" style={{ animationDelay: '0.08s' }}>
        <OverallSummary />
      </div>

      {subjects.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center animate-scaleIn"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div className="mb-4 animate-fadeIn">
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
          <h3 className="text-lg font-semibold mb-2 animate-fadeIn" style={{ color: 'var(--color-text)' }}>
            No grades yet
          </h3>
          <p className="text-sm mb-4 animate-fadeIn" style={{ color: 'var(--color-text-secondary)' }}>
            Start by adding assignments using the Mini Input Panel on the right.
          </p>
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 animate-fadeIn"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {subjects.map((s, i) => (
            <div
              key={`${s.subject}-${s.semester}`}
              className="animate-slideUp card-hover"
              style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
            >
              <SubjectCard data={s} allSubjects={subjects} />
            </div>
          ))}
        </div>
      )}

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeWhKSqD6waLp0Gtq2ObH6ckTe3E4LC6hwB59yykIW3-4FE7A/viewform?usp=publish-editor"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold shadow-lg transition-all hover:scale-110 hover:shadow-xl z-50 animate-slideUp"
        style={{
          color: '#fff',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        Feedback
      </a>
    </div>
  );
}
