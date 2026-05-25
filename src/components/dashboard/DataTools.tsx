import { useRef, useState } from 'react';
import { useGradeStore } from '../../store/gradeStore';
import { exportToCSV, parseCSVImport } from '../../utils/export';

export default function DataTools() {
  const { assignments, userId, addAssignment } = useGradeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleExport = () => {
    exportToCSV(assignments);
    setStatusMessage('CSV exported!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    try {
      const text = await file.text();
      const parsed = parseCSVImport(text);

      if (parsed.length === 0) {
        setImportStatus('error');
        setStatusMessage('No valid entries found.');
        setTimeout(() => setImportStatus('idle'), 4000);
        return;
      }

      for (const entry of parsed) {
        await addAssignment(
          userId,
          entry.semester as any,
          entry.subject as any,
          entry.criterion as any,
          entry.title ?? '',
          entry.score ?? 0,
          entry.date,
          entry.notes,
        );
      }

      setImportStatus('success');
      setStatusMessage(`Imported ${parsed.length} entries!`);
      setTimeout(() => setImportStatus('idle'), 4000);
    } catch {
      setImportStatus('error');
      setStatusMessage('Failed to parse file.');
      setTimeout(() => setImportStatus('idle'), 4000);
    }

    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleImport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
        style={{
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-surface-hover)',
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Import CSV
      </button>

      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
        style={{
          color: 'var(--color-text-secondary)',
          backgroundColor: 'var(--color-surface-hover)',
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export CSV
      </button>

      {statusMessage && (
        <span
          className="text-xs font-medium"
          style={{
            color: importStatus === 'error' ? '#ef4444' : '#10b981',
          }}
        >
          {statusMessage}
        </span>
      )}
    </div>
  );
}
