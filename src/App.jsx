import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EnrollmentPage from './pages/EnrollmentPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import DashboardPage from './pages/DashboardPage';
import AboutDeveloper from './pages/AboutDeveloper';

function App() {
  return (
    <Router>
      <div className="bg-[#050b18] min-h-screen text-white selection:bg-blue-500/30">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/enroll" element={<EnrollmentPage />} />
          <Route path="/review" element={<SubmitReviewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about-developer" element={<AboutDeveloper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

