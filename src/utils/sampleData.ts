import type { Semester, Criterion } from '../types';

interface SampleEntry {
  semester: Semester;
  subject: string;
  criterion: Criterion;
  title: string;
  score: number;
  date: string;
  notes?: string;
}

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function generateSampleData(): SampleEntry[] {
  return [
    // ── Math (9G1S) — strong student, A grade ──
    { semester: '9G1S', subject: 'Math', criterion: 'A', title: 'Algebra Diagnostic Test', score: 7, date: dateStr(120) },
    { semester: '9G1S', subject: 'Math', criterion: 'A', title: 'Linear Equations Quiz', score: 8, date: dateStr(95) },
    { semester: '9G1S', subject: 'Math', criterion: 'B', title: 'Graphing Project', score: 7, date: dateStr(100) },
    { semester: '9G1S', subject: 'Math', criterion: 'B', title: 'Data Analysis Task', score: 6, date: dateStr(70) },
    { semester: '9G1S', subject: 'Math', criterion: 'C', title: 'Problem Solving Set 1', score: 8, date: dateStr(85) },
    { semester: '9G1S', subject: 'Math', criterion: 'C', title: 'Problem Solving Set 2', score: 7, date: dateStr(50) },
    { semester: '9G1S', subject: 'Math', criterion: 'D', title: 'Real-World Application', score: 6, date: dateStr(60) },
    { semester: '9G1S', subject: 'Math', criterion: 'D', title: 'Math Investigation', score: 7, date: dateStr(30) },

    // ── Math (9G2S) — improving ──
    { semester: '9G2S', subject: 'Math', criterion: 'A', title: 'Quadratic Functions Test', score: 8, date: dateStr(65) },
    { semester: '9G2S', subject: 'Math', criterion: 'A', title: 'Trigonometry Quiz', score: 7, date: dateStr(40) },
    { semester: '9G2S', subject: 'Math', criterion: 'B', title: 'Statistics Project', score: 8, date: dateStr(55) },
    { semester: '9G2S', subject: 'Math', criterion: 'C', title: 'Proofs Assignment', score: 7, date: dateStr(45) },
    { semester: '9G2S', subject: 'Math', criterion: 'D', title: 'Math in Finance Essay', score: 8, date: dateStr(20) },

    // ── English (9G1S) — average, C+ range ──
    { semester: '9G1S', subject: 'English', criterion: 'A', title: 'Poetry Analysis Essay', score: 5, date: dateStr(110) },
    { semester: '9G1S', subject: 'English', criterion: 'A', title: 'Short Story Response', score: 6, date: dateStr(80) },
    { semester: '9G1S', subject: 'English', criterion: 'B', title: 'Creative Writing: Narrative', score: 6, date: dateStr(90) },
    { semester: '9G1S', subject: 'English', criterion: 'B', title: 'Persuasive Speech', score: 5, date: dateStr(55) },
    { semester: '9G1S', subject: 'English', criterion: 'C', title: 'Reading Comprehension Test', score: 4, date: dateStr(75) },
    { semester: '9G1S', subject: 'English', criterion: 'D', title: 'Book Review', score: 6, date: dateStr(35) },

    // ── Biology (9G1S) — struggling, D+ range ──
    { semester: '9G1S', subject: 'Biology', criterion: 'A', title: 'Cell Structure Quiz', score: 4, date: dateStr(115) },
    { semester: '9G1S', subject: 'Biology', criterion: 'A', title: 'DNA Replication Test', score: 3, date: dateStr(85) },
    { semester: '9G1S', subject: 'Biology', criterion: 'B', title: 'Lab Report: Osmosis', score: 5, date: dateStr(100) },
    { semester: '9G1S', subject: 'Biology', criterion: 'B', title: 'Lab Report: Photosynthesis', score: 4, date: dateStr(60) },
    { semester: '9G1S', subject: 'Biology', criterion: 'C', title: 'Research Poster', score: 5, date: dateStr(70) },
    { semester: '9G1S', subject: 'Biology', criterion: 'D', title: 'Field Observation Notes', score: 6, date: dateStr(40) },

    // ── History (9G1S) — good, B range ──
    { semester: '9G1S', subject: 'History', criterion: 'A', title: 'Ancient Civilizations Test', score: 6, date: dateStr(105) },
    { semester: '9G1S', subject: 'History', criterion: 'A', title: 'Medieval Europe Quiz', score: 7, date: dateStr(75) },
    { semester: '9G1S', subject: 'History', criterion: 'B', title: 'Source Analysis Worksheet', score: 6, date: dateStr(95) },
    { semester: '9G1S', subject: 'History', criterion: 'B', title: 'Historical Investigation', score: 7, date: dateStr(50) },
    { semester: '9G1S', subject: 'History', criterion: 'C', title: 'Essay: Causes of WWI', score: 6, date: dateStr(65) },
    { semester: '9G1S', subject: 'History', criterion: 'D', title: 'Debate Preparation', score: 7, date: dateStr(25) },

    // ── Physics (9G2S) — excellent, A range ──
    { semester: '9G2S', subject: 'Physics', criterion: 'A', title: 'Motion Quiz', score: 8, date: dateStr(60) },
    { semester: '9G2S', subject: 'Physics', criterion: 'A', title: 'Forces Test', score: 7, date: dateStr(35) },
    { semester: '9G2S', subject: 'Physics', criterion: 'B', title: 'Lab: Pendulum Experiment', score: 8, date: dateStr(50) },
    { semester: '9G2S', subject: 'Physics', criterion: 'B', title: 'Lab: Friction Investigation', score: 7, date: dateStr(20) },
    { semester: '9G2S', subject: 'Physics', criterion: 'C', title: 'Problem Set: Energy', score: 8, date: dateStr(40) },
    { semester: '9G2S', subject: 'Physics', criterion: 'D', title: 'Rube Goldberg Project', score: 7, date: dateStr(10) },

    // ── Art (9G1S) — mixed, C range ──
    { semester: '9G1S', subject: 'Art', criterion: 'A', title: 'Sketchbook: Line & Tone', score: 6, date: dateStr(100) },
    { semester: '9G1S', subject: 'Art', criterion: 'A', title: 'Color Theory Quiz', score: 5, date: dateStr(70) },
    { semester: '9G1S', subject: 'Art', criterion: 'B', title: 'Still Life Painting', score: 6, date: dateStr(80) },
    { semester: '9G1S', subject: 'Art', criterion: 'C', title: 'Artist Research', score: 4, date: dateStr(55) },
    { semester: '9G1S', subject: 'Art', criterion: 'D', title: 'Portfolio Reflection', score: 5, date: dateStr(30) },

    // ── Computer Science (9G2S) — A grade ──
    { semester: '9G2S', subject: 'Computer Science', criterion: 'A', title: 'HTML/CSS Quiz', score: 7, date: dateStr(55) },
    { semester: '9G2S', subject: 'Computer Science', criterion: 'A', title: 'JavaScript Basics Test', score: 8, date: dateStr(30) },
    { semester: '9G2S', subject: 'Computer Science', criterion: 'B', title: 'Web Page Project', score: 7, date: dateStr(45) },
    { semester: '9G2S', subject: 'Computer Science', criterion: 'C', title: 'Algorithm Challenge', score: 8, date: dateStr(35) },
    { semester: '9G2S', subject: 'Computer Science', criterion: 'D', title: 'App Prototype', score: 7, date: dateStr(15) },
    { semester: '9G2S', subject: 'Computer Science', criterion: 'D', title: 'Code Review Assignment', score: 8, date: dateStr(5) },
  ];
}
