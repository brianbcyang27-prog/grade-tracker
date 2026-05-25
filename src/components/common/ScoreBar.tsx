import { getGradeColor } from '../../utils/grading';

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
  color?: string;
  showScore?: boolean;
}

export default function ScoreBar({ label, score, maxScore = 8, color, showScore = true }: ScoreBarProps) {
  const barColor = color ?? getGradeColor(score >= 6 ? 'A' : score >= 4 ? 'C+' : 'D');
  const pct = Math.min(100, (score / maxScore) * 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{label}</span>
        {showScore && (
          <span style={{ color: 'var(--color-text)' }}>
            <strong>{score}</strong>
            <span style={{ color: 'var(--color-text-secondary)' }}>/{maxScore}</span>
          </span>
        )}
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
}
