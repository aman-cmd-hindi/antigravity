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

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen text-white selection:bg-blue-500/30">
        {loading && <BookLoader />}
        <AnimatedBackground />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/enroll" element={<EnrollmentPage />} />
            <Route path="/review" element={<SubmitReviewPage />} />
            {/* Security through Obscurity: Obscured admin access route */}
            <Route path="/portal-vault-88" element={<DashboardPage />} />
            {/* Decoy redirects for standard admin paths */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/cbt" element={<CbtPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

