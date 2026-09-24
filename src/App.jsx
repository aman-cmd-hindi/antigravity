import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnimatedBackground from './components/AnimatedBackground';
import BookLoader from './components/BookLoader';
import { ThemeProvider } from './context/ThemeContext';

// Dynamic Code Splitting (React.lazy) for async chunking
const EducatorShell = lazy(() => import('./components/educator/EducatorShell'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const EnrollmentPage = lazy(() => import('./pages/EnrollmentPage'));
const SubmitReviewPage = lazy(() => import('./pages/SubmitReviewPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CbtPage = lazy(() => import('./pages/CbtPage'));

const RouteFallback = () => (
  <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 rounded-full border border-zinc-700 border-t-zinc-200 animate-spin" />
      <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Loading View...</span>
    </div>
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Grounded Scholastic Educator Workspace Shell */}
            <Route path="/educator" element={<EducatorShell />} />
            <Route path="/faculty" element={<EducatorShell />} />


          {/* Existing Routes */}
          <Route path="/*" element={
            <div className="relative min-h-screen selection:bg-stone-200">
              {loading && <BookLoader />}
              <AnimatedBackground />
              <div className="relative z-10">
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/enroll" element={<EnrollmentPage />} />
                    <Route path="/review" element={<SubmitReviewPage />} />
                    <Route path="/portal-vault-88" element={<DashboardPage />} />
                    <Route path="/dashboard" element={<Navigate to="/educator" replace />} />
                    <Route path="/admin" element={<Navigate to="/educator" replace />} />
                    <Route path="/cbt" element={<CbtPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  </ThemeProvider>
  );
}

export default App;



