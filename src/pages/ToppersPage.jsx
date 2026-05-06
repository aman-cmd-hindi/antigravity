import React from 'react';
import { Link } from 'react-router-dom';

const toppers = [
  { name: "Gitanjali Vishwakarma", exam: "SSC 10th Board", percentage: "91.20%", year: "2025", photo: "👨‍🎓" },
  { name: "Lekhraj Maurya", exam: "SSC 10th", percentage: "87.60%", year: "2025", photo: "👩‍🎓" },
  { name: "Aman Vishwakarma", exam: "SSC Board", percentage: "86.80%", year: "2025", photo: "👨‍🎓" },
  { name: "Aman Pal", exam: "SSC Board", percentage: "85.20%", year: "2025", photo: "👩‍🎓" }
];

const ToppersPage = () => {
  return (
    <div className="min-h-screen bg-[#050b18] bg-mesh py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-500 font-bold uppercase tracking-[0.2em] text-xs mb-8 hover:opacity-80 transition-all">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">Hall of <span className="text-yellow-500">Fame</span></h1>
          <p className="text-white/40 mt-4 text-lg max-w-xl">Celebrating the stellar achievements of our students.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {toppers.map((topper, idx) => (
            <div key={idx} className="glass-card p-8 rounded-[30px] border border-white/5 text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                {topper.photo}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{topper.name}</h3>
              <p className="text-white/40 text-sm mb-4">{topper.exam} ({topper.year})</p>
              <div className="inline-block px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <span className="text-yellow-400 font-extrabold text-lg">{topper.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToppersPage;
