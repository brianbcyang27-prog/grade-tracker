import { useGradeStore } from '../../store/gradeStore';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { darkMode, toggleDarkMode } = useGradeStore();
  const { user, logout } = useAuth();

  return (
    <header
      className="h-16 px-6 flex items-center justify-between border-b shrink-0"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          M
        </div>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            MYP Grade Tracker
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            IB Assessment System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg transition-colors cursor-pointer"
          style={{
            color: 'var(--color-text-secondary)',
            backgroundColor: 'var(--color-surface-hover)',
          }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {user && (
          <div className="flex items-center gap-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {user.email?.[0].toUpperCase() ?? 'U'}
              </div>
            )}
            <button
              onClick={logout}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-surface-hover)',
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
