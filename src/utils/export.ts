import { localDateString } from './date';
import type { Assignment } from '../types';

export function exportToCSV(assignments: Assignment[]): void {
  const headers = ['Semester', 'Subject', 'Criterion', 'Title', 'Score', 'Max Score', 'Date', 'Status', 'Notes'];
  const rows = assignments.map((a) => [
    a.semester,
    a.subject,
    a.criterion,
    `"${a.title.replace(/"/g, '""')}"`,
    a.score.toString(),
    (a.maxScore ?? 8).toString(),
    a.date,
    a.status ?? 'data in',
    a.notes ? `"${a.notes.replace(/"/g, '""')}"` : '',
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `myp-grades-${localDateString()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseCSVImport(text: string): Partial<Assignment>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const semesterIdx = headers.indexOf('semester');
  const subjectIdx = headers.indexOf('subject');
  const criterionIdx = headers.indexOf('criterion');
  const titleIdx = headers.indexOf('title');
  const scoreIdx = headers.indexOf('score');
  const dateIdx = headers.indexOf('date');
  const statusIdx = headers.indexOf('status');
  const notesIdx = headers.indexOf('notes');
  const maxScoreIdx = headers.indexOf('max score');

  if (semesterIdx === -1 || subjectIdx === -1 || criterionIdx === -1 || titleIdx === -1 || scoreIdx === -1) {
    return [];
  }

  const results: Partial<Assignment>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const score = parseFloat(cols[scoreIdx]?.trim() ?? '');
    if (isNaN(score)) continue;

    results.push({
      semester: cols[semesterIdx]?.trim() as any,
      subject: cols[subjectIdx]?.trim() as any,
      criterion: cols[criterionIdx]?.trim() as any,
      title: cols[titleIdx]?.trim() ?? '',
      score,
      maxScore: maxScoreIdx !== -1 ? parseFloat(cols[maxScoreIdx]?.trim() ?? '8') : 8,
      date: dateIdx !== -1 ? cols[dateIdx]?.trim() : undefined,
      status: statusIdx !== -1 ? (cols[statusIdx]?.trim() as any) : 'data in',
      notes: notesIdx !== -1 ? cols[notesIdx]?.trim() : undefined,
    });
  }

  return results;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
