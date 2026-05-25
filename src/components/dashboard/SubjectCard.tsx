import { useNavigate } from 'react-router-dom';
import type { SubjectData } from '../../types';
import { CRITERIA } from '../../types';
import { getGradeColor, getTrendIndicator } from '../../utils/grading';
import Badge from '../common/Badge';
import ScoreBar from '../common/ScoreBar';

interface SubjectCardProps {
  data: SubjectData;
  allSubjects: SubjectData[];
}

export default function SubjectCard({ data, allSubjects }: SubjectCardProps) {
  const navigate = useNavigate();
  const trend = getTrendIndicator(allSubjects, data);
  const totalAssignments = Object.values(data.criteria).reduce((sum, arr) => sum + arr.length, 0);

  const criterionAverages = CRITERIA.map((c) => {
    const scores = data.criteria[c].map((a) => a.score);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  });

  return (
    <div
      onClick={() => navigate(`/subject/${encodeURIComponent(data.subject)}/${data.semester}`)}
      className="p-5 rounded-xl transition-all duration-200 cursor-pointer"
      style={{
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--color-card-shadow)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--color-card-shadow-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--color-card-shadow)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>
            {data.subject}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {data.semester} · {totalAssignments} {totalAssignments === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {trend && (
            <span
              className={`text-sm ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
          <Badge letter={data.grade.letter} score={data.totalScore} />
        </div>
      </div>

      <div className="space-y-2">
        {CRITERIA.map((c, i) => (
          <ScoreBar
            key={c}
            label={`Criterion ${c}`}
            score={roundTo(criterionAverages[i])}
            color={getGradeColor(data.grade.letter)}
            showScore={criterionAverages[i] > 0}
          />
        ))}
      </div>
    </div>
  );
}

function roundTo(num: number, decimals: number = 1): number {
  return Math.round(num * 10 ** decimals) / 10 ** decimals;
}
