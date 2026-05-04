import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage';
import EnrollmentPage from './pages/EnrollmentPage';

function App() {
  return (
    <Router>
      <div className="bg-[#050b18] min-h-screen text-white selection:bg-blue-500/30">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/enroll" element={<EnrollmentPage />} />
        </Routes>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;
