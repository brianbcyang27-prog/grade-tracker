import { useGradeStore } from '../../store/gradeStore';
import { generateSuggestions } from '../../utils/suggestions';
import { useState } from 'react';

export default function Suggestions() {
  const { assignments } = useGradeStore();
  const [collapsed, setCollapsed] = useState(false);
  const suggestions = generateSuggestions(assignments);

  if (suggestions.length === 0) return null;

  const typeStyles = {
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', iconBg: '#f59e0b' },
    insight: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', iconBg: '#3b82f6' },
    tip: { bg: '#e0e7ff', border: '#6366f1', text: '#3730a3', iconBg: '#6366f1' },
    achievement: { bg: '#d1fae5', border: '#10b981', text: '#065f46', iconBg: '#10b981' },
  };

  return (
    <div
      className="rounded-xl mb-6 overflow-hidden transition-all"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full px-5 py-3 flex items-center justify-between cursor-pointer"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            AI Suggestions & Insights
          </span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-light)',
            }}
          >
            {suggestions.length}
          </span>
        </div>
        <svg
          className="w-4 h-4 transition-transform"
          style={{
            color: 'var(--color-text-secondary)',
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!collapsed && (
        <div className="px-5 pb-4 space-y-2">
          {suggestions.map((s, i) => {
            const style = typeStyles[s.type];
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: style.bg,
                  borderLeft: `3px solid ${style.border}`,
                }}
              >
                <span className="text-base shrink-0">{s.icon}</span>
                <span style={{ color: style.text }}>{s.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
