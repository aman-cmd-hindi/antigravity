import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SubmitReviewPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    standard: '',
    review: '',
    rating: 5
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050b18] flex items-center justify-center px-6 bg-mesh">
        <div className="glass-card p-16 rounded-[60px] text-center max-w-xl w-full animate-float">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6">Review Submitted!</h2>
          <p className="text-white/40 mb-12 text-lg leading-relaxed">
            Thank you, <span className="text-blue-400 font-bold">{formData.name}</span>. Your feedback helps us improve and inspires other students.
          </p>
          <Link to="/" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh py-32 px-6 md:px-12 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-3 text-blue-500 font-bold uppercase tracking-[0.2em] text-xs mb-8 hover:opacity-80 transition-all">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Share Your <span className="text-blue-500">Experience</span></h1>
          <p className="text-white/40 text-lg">Your review means a lot to us and helps future students make the right choice.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-10 rounded-[40px] space-y-6 shadow-2xl">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              placeholder="Your Name"
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Standard / Course</label>
            <input 
              type="text" 
              name="standard"
              required
              placeholder="e.g. 12th Science, NEET Batch"
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Rating</label>
            <div className="flex gap-2 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className={`text-2xl transition-all ${star <= formData.rating ? 'text-yellow-500 hover:scale-110' : 'text-white/20 hover:text-white/40'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Your Review</label>
            <textarea 
              name="review"
              required
              placeholder="Tell us about your experience..."
              rows="4"
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <button type="submit" className="w-full py-5 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 text-sm uppercase tracking-[0.2em] mt-4">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReviewPage;
