import { useState, useCallback } from 'react';
import { useGradeStore } from '../../store/gradeStore';

interface Step {
  title: string;
  description: string;
  icon: string;
}

const STEPS: Step[] = [
  {
    title: 'Welcome to MYP Grade Tracker',
    description:
      'Track your IB MYP criteria-based grades across all subjects and semesters. This quick tour will show you the main features in under a minute.',
    icon: '🎓',
  },
  {
    title: 'Dashboard — Overview at a Glance',
    description:
      'Your dashboard shows summary cards (subjects, average score, GPA, total entries), subject cards with criterion score bars and trends, AI suggestions, and a feedback button. No raw assignment data here — just summaries.',
    icon: '📊',
  },
  {
    title: 'Adding Grades',
    description:
      'Use the Mini Input Panel on the right sidebar to quickly add assignments. Select subject, criterion (A/B/C/D), enter a title, score (0–8), and date. You can also add custom subjects using the "+ New" button.',
    icon: '✏️',
  },
  {
    title: 'Subject Detail & Assessment Table',
    description:
      'Click any subject card to view all assessments in a strict table with columns: Criterion, Title, Date, Score, Max Score, Status. Click any score to edit inline. Use the pill buttons to filter by criterion. The "Add" button inserts new rows.',
    icon: '📋',
  },
  {
    title: 'Timeline View',
    description:
      'The Timeline page shows all assignments in chronological order. Filter by subject or criterion. Each entry shows the date, subject badge, criterion, score, and overdue indicators for past-due assignments.',
    icon: '📅',
  },
  {
    title: 'Settings & Customization',
    description:
      'In Settings you can switch between 6 color themes, toggle dark mode, manage custom subjects, load sample data to demo the app, export grades as CSV, or delete all data.',
    icon: '⚙️',
  },
];

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('grade-tracker-tour-dismissed') === 'true';
  });
  const userId = useGradeStore((s) => s.userId);

  const dismiss = useCallback(() => {
    localStorage.setItem('grade-tracker-tour-dismissed', 'true');
    setDismissed(true);
  }, []);

  if (dismissed || !userId) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
    >
      <div
        className="mx-4 w-full max-w-md rounded-2xl p-8 animate-slideUp shadow-2xl"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Icon */}
        <div className="text-5xl mb-5 text-center">{current.icon}</div>

        {/* Title */}
        <h2
          className="text-xl font-bold text-center mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          {current.title}
        </h2>

        {/* Description */}
        <p
          className="text-sm leading-relaxed text-center mb-7"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {current.description}
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className="rounded-full transition-all cursor-pointer"
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                backgroundColor:
                  i === step ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={dismiss}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Skip
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                style={{
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-bg)',
                }}
              >
                Back
              </button>
            )}

            <button
              onClick={() => (isLast ? dismiss() : setStep((s) => s + 1))}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer hover:scale-105"
              style={{ color: '#fff', backgroundColor: 'var(--color-primary)' }}
            >
              {isLast ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
