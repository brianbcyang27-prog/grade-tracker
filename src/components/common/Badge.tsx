import { getGradeColor } from '../../utils/grading';

interface BadgeProps {
  letter: string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({ letter, score, size = 'md' }: BadgeProps) {
  const color = getGradeColor(letter);
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-lg px-4 py-1.5',
  };

  return (
    <span
      className={`font-bold rounded-lg inline-flex items-center gap-1.5 ${sizeClasses[size]}`}
      style={{
        color: '#fff',
        backgroundColor: color,
      }}
    >
      {letter}
      {score !== undefined && (
        <span className="opacity-80 font-normal text-xs">/32</span>
      )}
    </span>
  );
}
