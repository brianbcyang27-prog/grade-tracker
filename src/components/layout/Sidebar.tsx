import { NavLink } from 'react-router-dom';
import { SEMESTERS } from '../../types';
import { useGradeStore } from '../../store/gradeStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/timeline', label: 'Timeline', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

export default function Sidebar() {
  const { selectedSemester, setSelectedSemester, inputPanelOpen, setInputPanelOpen } = useGradeStore();

  return (
    <aside
      className="w-64 h-full flex flex-col border-r shrink-0"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={({ isActive }: { isActive: boolean }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
            })}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}

        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
            Semester
          </p>
        </div>

        <button
          onClick={() => setSelectedSemester('ALL')}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          style={{
            color: selectedSemester === 'ALL' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            backgroundColor: selectedSemester === 'ALL' ? 'var(--color-primary-light)' : 'transparent',
          }}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          All Semesters
        </button>

        {SEMESTERS.map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            style={{
              color: selectedSemester === sem ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              backgroundColor: selectedSemester === sem ? 'var(--color-primary-light)' : 'transparent',
            }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 5-7-5M5 15l7 5 7-5" />
            </svg>
            {sem}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setInputPanelOpen(!inputPanelOpen)}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
          style={{
            color: '#fff',
            backgroundColor: inputPanelOpen ? 'var(--color-danger)' : 'var(--color-primary)',
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {inputPanelOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            )}
          </svg>
          {inputPanelOpen ? 'Close Input Panel' : 'Add Grade'}
        </button>
      </div>
    </aside>
  );
}
