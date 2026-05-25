import { useGradeStore, type ThemeName } from '../store/gradeStore';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../utils/export';
import { getAllSubjects } from '../utils/subjects';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const THEMES: { name: ThemeName; label: string; colors: string[] }[] = [
  { name: 'indigo', label: 'Indigo', colors: ['#6366f1', '#8b5cf6', '#eef2ff'] },
  { name: 'emerald', label: 'Emerald', colors: ['#059669', '#10b981', '#ecfdf5'] },
  { name: 'rose', label: 'Rose', colors: ['#e11d48', '#f43f5e', '#fff1f2'] },
  { name: 'amber', label: 'Amber', colors: ['#d97706', '#f59e0b', '#fffbeb'] },
  { name: 'ocean', label: 'Ocean', colors: ['#0284c7', '#06b6d4', '#f0f9ff'] },
  { name: 'midnight', label: 'Midnight', colors: ['#6366f1', '#1a1a35', '#0a0a1a'] },
];

export default function SettingsPage() {
  const { darkMode, toggleDarkMode, theme, setTheme, assignments, clearAllData, customSubjects, addCustomSubject, removeCustomSubject } = useGradeStore();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [newSubject, setNewSubject] = useState('');
  const allSubjects = getAllSubjects(customSubjects);

  const handleExport = () => {
    exportToCSV(assignments);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete ALL your grade data? This cannot be undone.')) {
      clearAllData();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
          Settings
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Account */}
      <div
        className="rounded-xl p-6 mb-4"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          Account
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Email</span>
            <span style={{ color: 'var(--color-text)' }}>{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>User ID</span>
            <span className="text-xs font-mono" style={{ color: 'var(--color-text)' }}>{user?.uid}</span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Auth Method</span>
            <span style={{ color: 'var(--color-text)' }}>
              {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
            </span>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full mt-2 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ color: '#fff', backgroundColor: 'var(--color-danger)' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div
        className="rounded-xl p-6 mb-4"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Preferences
        </h3>
        <div className="space-y-4">
          {/* Dark mode toggle */}
          <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div>
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>Dark Mode</span>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Toggle dark/light mode</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="relative w-11 h-6 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: darkMode ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                style={{ transform: darkMode ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {/* Theme selector */}
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>Color Theme</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setTheme(t.name)}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl cursor-pointer transition-all"
                  style={{
                    backgroundColor: theme === t.name ? 'var(--color-primary-light)' : 'var(--color-bg)',
                    outline: theme === t.name ? `2px solid var(--color-primary)` : 'none',
                  }}
                >
                  <div className="flex gap-0.5 rounded-lg overflow-hidden w-full h-8">
                    {t.colors.map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: theme === t.name ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data */}
      <div
        className="rounded-xl p-6 mb-4"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
          Data
        </h3>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm cursor-pointer transition-colors"
            style={{
              color: 'var(--color-text)',
              backgroundColor: 'var(--color-bg)',
            }}
          >
            <span>Export All Data as CSV</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm cursor-pointer transition-colors"
            style={{
              color: 'var(--color-danger)',
              backgroundColor: 'var(--color-bg)',
            }}
          >
            <span>Clear All Grade Data</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subjects */}
      <div
        className="rounded-xl p-6 mb-4"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
          </svg>
          Subjects
        </h3>

        {/* Add custom subject */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="New subject name"
            className="flex-1 px-3 py-2 rounded-lg text-sm border"
            style={{
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
            }}
          />
          <button
            onClick={() => {
              if (newSubject.trim()) {
                addCustomSubject(newSubject.trim());
                setNewSubject('');
              }
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ color: '#fff', backgroundColor: 'var(--color-primary)' }}
          >
            Add
          </button>
        </div>

        {/* Subject list */}
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {allSubjects.map((s) => {
            const isCustom = customSubjects.includes(s);
            return (
              <div
                key={s}
                className="flex items-center justify-between py-2 px-3 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--color-bg)' }}
              >
                <span style={{ color: 'var(--color-text)' }}>{s}</span>
                {isCustom ? (
                  <button
                    onClick={() => removeCustomSubject(s)}
                    className="px-2 py-0.5 rounded text-xs font-medium cursor-pointer"
                    style={{ color: 'var(--color-danger)', backgroundColor: '#fef2f2' }}
                  >
                    Remove
                  </button>
                ) : (
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Default</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
