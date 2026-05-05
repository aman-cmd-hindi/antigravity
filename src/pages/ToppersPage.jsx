import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialToppers = [
  { name: "Aditya Verma", exam: "SSC 10th Board", percentage: "98.4%", year: "2023", photo: "👨‍🎓" },
  { name: "Priya Sharma", exam: "HSC 12th Science", percentage: "96.8%", year: "2023", photo: "👩‍🎓" },
  { name: "Rohan Gupta", exam: "JEE Advanced", percentage: "AIR 452", year: "2023", photo: "👨‍🎓" },
  { name: "Neha Singh", exam: "NEET UG", percentage: "685/720", year: "2023", photo: "👩‍🎓" }
];

const ToppersPage = () => {
  const [toppers, setToppers] = useState(initialToppers);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    exam: '',
    percentage: '',
    year: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTopper = {
      ...formData,
      photo: "🏅" // Placeholder icon for new entry
    };
    setToppers([newTopper, ...toppers]);
    setFormData({ name: '', exam: '', percentage: '', year: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#050b18] bg-mesh py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-blue-500 font-bold uppercase tracking-[0.2em] text-xs mb-8 hover:opacity-80 transition-all">
              ← Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white">Hall of <span className="text-yellow-500">Fame</span></h1>
            <p className="text-white/40 mt-4 text-lg max-w-xl">Celebrating the stellar achievements of our students. Their hard work combined with our guidance creates history.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-bold rounded-xl hover:bg-yellow-500 hover:text-[#050b18] transition-all text-sm uppercase tracking-widest whitespace-nowrap"
          >
            {showForm ? 'Cancel Entry' : '+ Add Topper'}
          </button>
        </div>

        {showForm && (
          <div className="mb-16 glass-card p-10 rounded-[40px] border border-yellow-500/20 max-w-3xl animate-in slide-in-from-top-8 fade-in duration-500">
            <h3 className="text-2xl font-bold text-white mb-6">Enter Student Achievement</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-1">Student Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-500 outline-none" placeholder="e.g. Rahul Kumar" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-1">Exam / Standard</label>
                  <input type="text" name="exam" required value={formData.exam} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-500 outline-none" placeholder="e.g. SSC 10th Board" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-1">Marks / Percentage / Rank</label>
                  <input type="text" name="percentage" required value={formData.percentage} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-500 outline-none" placeholder="e.g. 95% or AIR 120" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-1">Passing Year</label>
                  <input type="text" name="year" required value={formData.year} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-500 outline-none" placeholder="e.g. 2024" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-yellow-500 text-[#050b18] font-bold rounded-xl hover:bg-yellow-400 transition-all text-sm uppercase tracking-[0.2em] mt-4">
                Add to Hall of Fame
              </button>
            </form>
          </div>
        )}

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
