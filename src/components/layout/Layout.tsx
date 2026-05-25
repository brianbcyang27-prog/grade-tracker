import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MiniInputPanel from '../input/MiniInputPanel';
import { useGradeStore } from '../../store/gradeStore';

export default function Layout() {
  const { inputPanelOpen } = useGradeStore();

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        {inputPanelOpen && (
          <div
            className="w-80 border-l overflow-y-auto shrink-0"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <MiniInputPanel />
          </div>
        )}
      </div>
    </div>
  );
}
