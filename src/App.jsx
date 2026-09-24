import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EnrollmentPage from './pages/EnrollmentPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import DashboardPage from './pages/DashboardPage';
import CbtPage from './pages/CbtPage';

import GalleryPage from './pages/GalleryPage';
import AnimatedBackground from './components/AnimatedBackground';
import BookLoader from './components/BookLoader';

import EducatorShell from './components/educator/EducatorShell';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
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
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

