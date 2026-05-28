import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useGradeStore } from './store/gradeStore';
import { listenToGrades } from './services/gradeService';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import SubjectDetail from './components/subject/SubjectDetail';
import TimelineView from './components/timeline/TimelineView';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OnboardingTour from './components/onboarding/OnboardingTour';

function AppContent() {
  const { darkMode, theme, setAssignments, setUserId, setError } = useGradeStore();
  const { user } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    root.setAttribute('data-theme', theme);
  }, [darkMode, theme]);

  useEffect(() => {
    const uid = user?.uid ?? null;
    setUserId(uid);

    if (!uid) {
      setAssignments([]);
      return;
    }

    const unsub = listenToGrades(
      uid,
      (list) => {
        setAssignments(list);
      },
      (err) => {
        setError(err.message);
      },
    );

    return () => unsub();
  }, [user]);

  return (
    <>
      <OnboardingTour />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/subject/:subject/:semester" element={<SubjectDetail />} />
          <Route path="/timeline" element={<TimelineView />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
