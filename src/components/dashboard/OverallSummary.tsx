import { useGradeStore } from '../../store/gradeStore';
import { computeAllSubjects, computeOverallAverage, computeGPAEquivalent, getGradeBand } from '../../utils/grading';
import Badge from '../common/Badge';

export default function OverallSummary() {
  const { assignments, selectedSemester } = useGradeStore();
  const subjects = computeAllSubjects(assignments, selectedSemester);
  const avgScore = computeOverallAverage(subjects);
  const gpa = computeGPAEquivalent(avgScore);
  const avgGrade = getGradeBand(avgScore);
  const totalAssignments = subjects.reduce((sum, s) => {
    return sum + Object.values(s.criteria).reduce((a, b) => a + b.length, 0);
  }, 0);

  const cards = [
    {
      label: 'Subjects',
      value: subjects.length.toString(),
      sub: 'Active subjects',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    },
    {
      label: 'Average Score',
      value: avgScore > 0 ? `${avgScore}/32` : '—',
      sub: avgGrade.letter !== 'N/A' ? `${avgGrade.letter} — ${avgGrade.label}` : 'No data yet',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
      label: 'GPA Equivalent',
      value: gpa,
      sub: 'On 4.0 scale',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    },
    {
      label: 'Total Entries',
      value: totalAssignments.toString(),
      sub: 'Assignments logged',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="p-4 rounded-xl card-hover animate-slideUp"
          style={{
            backgroundColor: 'var(--color-surface)',
            boxShadow: 'var(--color-card-shadow)',
            animationDelay: `${i * 0.06}s`,
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
              {card.label}
            </p>
            <svg className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
            </svg>
          </div>
          <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--color-text)' }}>
            {card.label === 'Average Score' && avgScore > 0 ? (
              <span className="flex items-center gap-2">
                <Badge letter={avgGrade.letter} score={avgScore} size="sm" />
                <span>{avgScore}</span>
              </span>
            ) : (
              card.value
            )}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
