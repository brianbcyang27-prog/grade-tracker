import { useState } from 'react';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'grading', label: 'Grading System' },
];

export default function DocumentationTab() {
  const [activeSection, setActiveSection] = useState('about');

  return (
    <div className="max-w-3xl mx-auto">
      {/* Section nav */}
      <div className="flex gap-1 p-1 rounded-lg mb-6" style={{ backgroundColor: 'var(--color-bg)' }}>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer"
            style={{
              color: activeSection === s.id ? '#fff' : 'var(--color-text-secondary)',
              backgroundColor: activeSection === s.id ? 'var(--color-primary)' : 'transparent',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ─── ABOUT ─── */}
      {activeSection === 'about' && (
        <div className="space-y-5 animate-fadeIn">
          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <span className="text-2xl">🎓</span> What is MYP Grade Tracker?
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              MYP Grade Tracker is a full-stack web application built for IB MYP students to track,
              analyze, and visualize their criteria-based grades (A/B/C/D) across subjects and semesters.
              It provides real-time grade calculations, performance insights, and a clean, student-friendly interface.
            </p>
          </section>

          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <span className="text-2xl">👨‍💻</span> Why I Built This
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Built by <strong style={{ color: 'var(--color-primary)' }}>Brian Yang</strong> (楊博全),
              Class of 2029 at Kaohsiung American School. I wanted a simple, powerful way to track my
              MYP grades without confusing spreadsheets or complicated tools. This app is designed
              specifically for IB MYP students who need clear, immediate feedback on their academic performance.
            </p>
          </section>

          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <span className="text-2xl">⚙️</span> Tech Stack
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                ['React 19', 'UI framework'],
                ['TypeScript', 'Type safety'],
                ['Vite', 'Build tool'],
                ['Tailwind CSS 4', 'Styling'],
                ['Firebase Auth', 'Authentication'],
                ['Firestore', 'Database'],
                ['Zustand', 'State management'],
                ['React Router 7', 'Routing'],
              ].map(([tech, desc]) => (
                <div
                  key={tech}
                  className="p-3 rounded-lg text-sm"
                  style={{ backgroundColor: 'var(--color-bg)' }}
                >
                  <div className="font-semibold" style={{ color: 'var(--color-text)' }}>{tech}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              <span className="text-2xl">🔒</span> Privacy & Data
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Your data is private and user-isolated. Each user's grades are stored in a Firestore
              subcollection under their unique user ID. Firebase Authentication handles login,
              and security rules ensure you can only access your own data. No data is shared or visible to other users.
            </p>
          </section>
        </div>
      )}

      {/* ─── HOW TO USE ─── */}
      {activeSection === 'how-to-use' && (
        <div className="space-y-4 animate-fadeIn">
          {[
            {
              step: '1',
              title: 'Sign In',
              desc: 'Use Google or Email/Password to create an account. Your data is tied to your account and persists across devices.',
            },
            {
              step: '2',
              title: 'Add Grades',
              desc: 'Use the Mini Input Panel on the right sidebar to quickly add assignments. Select the subject, criterion (A/B/C/D), enter a title, score (0–8), and date. You can toggle the date off if you don\'t have one.',
            },
            {
              step: '3',
              title: 'Explore the Dashboard',
              desc: 'The Dashboard shows summary cards (subjects, average score, GPA equivalent, total entries), per-subject cards with criterion score bars, and AI-powered suggestions for improvement.',
            },
            {
              step: '4',
              title: 'View Subject Details',
              desc: 'Click any subject card to see the full assessment table with all criteria. Click scores to edit inline, use pill buttons to filter by criterion, and use the Add button to insert new rows.',
            },
            {
              step: '5',
              title: 'Use the Timeline',
              desc: 'The Timeline page shows all assignments chronologically. Filter by subject or criterion to focus on specific areas.',
            },
            {
              step: '6',
              title: 'Customize & Export',
              desc: 'In Settings, you can switch between 6 color themes, toggle dark mode, add custom subjects, load sample data to explore the app, or export your grades as a CSV file.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl p-5 flex gap-4 animate-slideUp"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ color: '#fff', backgroundColor: 'var(--color-primary)' }}
              >
                {item.step}
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── GRADING SYSTEM ─── */}
      {activeSection === 'grading' && (
        <div className="space-y-5 animate-fadeIn">
          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              How Grading Works
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Each subject has 4 criteria: <strong>A</strong>, <strong>B</strong>, <strong>C</strong>, and <strong>D</strong>.
              Every assignment is scored 0–8 per criterion. The system automatically detects whether you're in
              Grade 9 or Grade 10 based on the semester prefix (9G1S → Year 4, 10G1S → Year 5) and applies
              the correct grade boundaries.
            </p>
          </section>

          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Formula
            </h3>
            <div
              className="p-4 rounded-lg mb-4 font-mono text-sm"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            >
              <div className="mb-2">
                <span style={{ color: 'var(--color-primary)' }}>Criterion Average</span>
                <span style={{ color: 'var(--color-text-secondary)' }}> = </span>
                <span>Sum of scores in that criterion / Number of assignments</span>
              </div>
              <div className="mb-2">
                <span style={{ color: 'var(--color-primary)' }}>Total Score</span>
                <span style={{ color: 'var(--color-text-secondary)' }}> = </span>
                <span>Criterion A avg + Criterion B avg + Criterion C avg + Criterion D avg</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-primary)' }}>Grade Band</span>
                <span style={{ color: 'var(--color-text-secondary)' }}> = </span>
                <span>Lookup Total Score (0–32) in the appropriate grade table</span>
              </div>
            </div>
          </section>

          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              MYP Year 4 — Grade 9 Boundaries
            </h3>
            <div
              className="rounded-lg overflow-hidden text-sm"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <div className="grid grid-cols-3 gap-px">
                {[
                  ['Score Range', 'Grade', 'Label'],
                  ['1–3', 'F', 'Failing'],
                  ['4–5', 'D-', 'Very Limited'],
                  ['6–7', 'D', 'Limited'],
                  ['8–9', 'D+', 'Below Average'],
                  ['10–11', 'C-', 'Below Satisfactory'],
                  ['12–13', 'C', 'Satisfactory'],
                  ['14–15', 'C+', 'Adequate'],
                  ['16–17', 'B-', 'Good'],
                  ['18–19', 'B', 'Very Good'],
                  ['20–21', 'B+', 'Excellent'],
                  ['22–23', 'A-', 'Near Outstanding'],
                  ['24–26', 'A', 'Outstanding'],
                  ['27–32', 'A+', 'Exceptional'],
                ].map((row, i) => (
                  <>
                    {row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="px-3 py-1.5 text-xs"
                        style={{
                          backgroundColor: i === 0 ? 'var(--color-primary-light)' : i % 2 === 0 ? 'var(--color-bg)' : 'transparent',
                          color: i === 0 ? 'var(--color-primary)' : 'var(--color-text)',
                          fontWeight: i === 0 ? 600 : 400,
                        }}
                      >
                        {cell}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </section>

          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              MYP Year 5 — Grade 10 Boundaries
            </h3>
            <div
              className="rounded-lg overflow-hidden text-sm"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <div className="grid grid-cols-3 gap-px">
                {[
                  ['Score Range', 'Grade', 'Label'],
                  ['1–5', 'F', 'Failing'],
                  ['6–7', 'D-', 'Very Limited'],
                  ['8–9', 'D', 'Limited'],
                  ['10–11', 'D+', 'Below Average'],
                  ['12–13', 'C-', 'Below Satisfactory'],
                  ['14–15', 'C', 'Satisfactory'],
                  ['16–17', 'C+', 'Adequate'],
                  ['18–19', 'B-', 'Good'],
                  ['20–21', 'B', 'Very Good'],
                  ['22–23', 'B+', 'Excellent'],
                  ['24–25', 'A-', 'Near Outstanding'],
                  ['26–28', 'A', 'Outstanding'],
                  ['29–32', 'A+', 'Exceptional'],
                ].map((row, i) => (
                  <>
                    {row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="px-3 py-1.5 text-xs"
                        style={{
                          backgroundColor: i === 0 ? 'var(--color-primary-light)' : i % 2 === 0 ? 'var(--color-bg)' : 'transparent',
                          color: i === 0 ? 'var(--color-primary)' : 'var(--color-text)',
                          fontWeight: i === 0 ? 600 : 400,
                        }}
                      >
                        {cell}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </section>

          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              IB 1–7 Scale
            </h3>
            <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              The IB 1–7 scale maps MYP total scores to the official IB scale:
            </p>
            <div
              className="rounded-lg overflow-hidden text-sm max-w-xs"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <div className="grid grid-cols-2 gap-px">
                {[
                  ['Score Range', 'IB Grade'],
                  ['1–5', '1'],
                  ['6–9', '2'],
                  ['10–14', '3'],
                  ['15–18', '4'],
                  ['19–23', '5'],
                  ['24–27', '6'],
                  ['28–32', '7'],
                ].map((row, i) => (
                  <>
                    {row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="px-3 py-1.5 text-xs"
                        style={{
                          backgroundColor: i === 0 ? 'var(--color-primary-light)' : i % 2 === 0 ? 'var(--color-bg)' : 'transparent',
                          color: i === 0 ? 'var(--color-primary)' : 'var(--color-text)',
                          fontWeight: i === 0 ? 600 : 400,
                        }}
                      >
                        {cell}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </section>

          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              GPA Equivalent
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              The GPA Equivalent on the dashboard converts your MYP average score to a standard 4.0 GPA scale
              using the Non-IB Percentage system. Your total score (0–32) is converted to a percentage,
              then mapped to the corresponding GPA value.
            </p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1 text-xs">
              {[
                ['98–100%', 'A+', '4.33'],
                ['93–97%', 'A', '4.00'],
                ['90–92%', 'A-', '3.67'],
                ['87–89%', 'B+', '3.33'],
                ['83–86%', 'B', '3.00'],
                ['80–82%', 'B-', '2.67'],
                ['77–79%', 'C+', '2.33'],
                ['73–76%', 'C', '2.00'],
                ['70–72%', 'C-', '1.67'],
                ['67–69%', 'D+', '1.33'],
                ['63–66%', 'D', '1.00'],
                ['60–62%', 'D-', '0.67'],
                ['0–59%', 'F', '0.00'],
              ].map(([range, letter, gpa]) => (
                <div
                  key={range}
                  className="flex items-center gap-1.5 px-2 py-1 rounded"
                  style={{ backgroundColor: 'var(--color-bg)' }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>{range}</span>
                  <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{letter}</span>
                  <span style={{ color: 'var(--color-text)' }}>{gpa}</span>
                </div>
              ))}
            </div>
          </section>

          <section
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              DP GPA Conversion (IB Diploma)
            </h3>
            <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              For IB Diploma students, the app supports SL vs HL weighted GPA conversion:
            </p>
            <div
              className="rounded-lg overflow-hidden text-sm max-w-sm"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <div className="grid grid-cols-4 gap-px">
                {[
                  ['IB Grade', 'Letter', 'SL GPA', 'HL GPA'],
                  ['7', 'A+', '4.33', '5.33'],
                  ['6', 'A', '4.00', '5.00'],
                  ['5', 'A-', '3.67', '4.67'],
                  ['4', 'B+', '3.33', '4.33'],
                  ['3', 'C+', '2.33', '3.33'],
                  ['2', 'D', '1.00', '2.00'],
                  ['1', 'F', '0.00', '1.00'],
                ].map((row, i) => (
                  <>
                    {row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="px-2 py-1.5 text-xs text-center"
                        style={{
                          backgroundColor: i === 0 ? 'var(--color-primary-light)' : 'transparent',
                          color: i === 0 ? 'var(--color-primary)' : 'var(--color-text)',
                          fontWeight: i === 0 ? 600 : 400,
                        }}
                      >
                        {cell}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
