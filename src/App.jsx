import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EnrollmentPage from './pages/EnrollmentPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import DashboardPage from './pages/DashboardPage';
import AboutDeveloper from './pages/AboutDeveloper';
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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about-developer" element={<AboutDeveloper />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

