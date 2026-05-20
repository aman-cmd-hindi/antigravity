import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { sendConfirmationEmail, sendSMSNotification, getWhatsAppLink } from '../utils/notifications';

const EnrollmentPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    standard: '',
    course: '',
    specificClass: '',
    medium: '',
    competitiveExam: '',
    location: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === 'standard') {
      newFormData.specificClass = '';
      newFormData.medium = '';
      if (value === 'NEET' || value === 'IIT JEE') {
        newFormData.course = 'Science';
        newFormData.competitiveExam = value === 'IIT JEE' ? 'JEE' : 'NEET';
      } else {
        newFormData.course = value;
        newFormData.competitiveExam = '';
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'enrollments'), {
        ...formData,
        submittedAt: serverTimestamp()
      });

      // Trigger Notifications
      await sendConfirmationEmail(formData, 'enrollment');
      await sendSMSNotification(formData.phone, `Hello ${formData.name}, your enrollment at Tiwari Tutorials for ${formData.standard} has been received!`);

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050b18] flex items-center justify-center px-6 bg-mesh">
        <div className="glass-card p-16 rounded-[60px] text-center max-w-xl w-full animate-float shadow-[0_0_100px_rgba(59,130,246,0.1)]">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-[35%] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/20 rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6">Enrollment Successful!</h2>
          <p className="text-white/40 mb-12 text-lg leading-relaxed">
            Success, <span className="text-blue-400 font-bold">{formData.name}</span>! Your enrollment request has been prioritized. Manoj Sir or Sandeep Sir will reach out to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href={getWhatsAppLink(formData.name, 'enrollment', `${formData.standard}${formData.specificClass ? ` (${formData.specificClass}${['Class 11', 'Class 12', 'Dropper'].includes(formData.specificClass) ? '' : formData.specificClass === '1' ? 'st Std' : formData.specificClass === '2' ? 'nd Std' : formData.specificClass === '3' ? 'rd Std' : 'th Std'})` : ''}`)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 active:scale-95 w-full sm:w-auto"
            >
              <span>Confirm on WhatsApp</span>
              <span className="text-xl">💬</span>
            </a>
            <Link to="/" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 w-full sm:w-auto">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh py-24 px-6 md:px-12 flex items-center justify-center overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-0"></div>

      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-20 items-center relative z-10">
        {/* Info Column */}
        <div className="flex-1 space-y-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 text-blue-500 font-bold uppercase tracking-[0.2em] text-xs mb-10 group hover:opacity-80 transition-all">
              <span className="w-8 h-8 rounded-full glass flex items-center justify-center group-hover:-translate-x-1 transition-transform">←</span> 
              Back to Home
            </Link>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8">
              Unlock Your <br /><span className="text-gradient">Potential</span>
            </h1>
            <p className="text-white/40 text-xl leading-relaxed max-w-md">
              Secure your spot at Tiwari Tutorials. Expert mentorship for school, boards, and competitive excellence.
            </p>
          </div>

          <div className="space-y-6">
             {[
               { title: 'Personalized Attention', desc: 'Direct mentorship from founders.' },
               { title: 'Proven Results', desc: 'Consistent toppers in boards & JEE/NEET.' },
               { title: 'Modern Methodology', desc: 'Concept-first learning approach.' }
             ].map((item, idx) => (
               <div key={idx} className="flex gap-6 items-start group">
                  <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-lg">✓</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                    <p className="text-white/30 text-sm">{item.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Form Column */}
        <div className="flex-[1.3] w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="glass-card p-10 md:p-14 rounded-[60px] border border-white/5 space-y-8 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Student Name"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/10 font-medium"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Contact Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="+91"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/10 font-medium"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                required
                placeholder="email@example.com"
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/10 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Course / Category</label>
                <div className="relative">
                  <select 
                    name="standard"
                    required
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all appearance-none font-medium cursor-pointer"
                  >
                    <option value="" disabled selected className="bg-[#050b18]">Choose Course Category</option>
                    <option value="School Boards (Class 1-9)" className="bg-[#050b18]">School Boards (Class 1-9)</option>
                    <option value="Pre Foundation (Class 1-9)" className="bg-[#050b18]">Pre Foundation (Class 1-9)</option>
                    <option value="NEET" className="bg-[#050b18]">NEET</option>
                    <option value="IIT JEE" className="bg-[#050b18]">IIT JEE</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">↓</div>
                </div>
              </div>
              
              {(formData.standard === 'School Boards (Class 1-9)' || formData.standard === 'Pre Foundation (Class 1-9)') && (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Specific Class</label>
                    <div className="relative">
                      <select 
                        name="specificClass"
                        required
                        onChange={handleChange}
                        value={formData.specificClass}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all appearance-none font-medium cursor-pointer"
                      >
                        <option value="" disabled className="bg-[#050b18]">Select Class</option>
                        {[...Array(9)].map((_, i) => (
                          <option key={i+1} value={i+1} className="bg-[#050b18]">{i+1}{i+1 === 1 ? 'st' : i+1 === 2 ? 'nd' : i+1 === 3 ? 'rd' : 'th'} Standard</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">↓</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Medium of Language</label>
                    <div className="relative">
                      <select 
                        name="medium"
                        required
                        onChange={handleChange}
                        value={formData.medium}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all appearance-none font-medium cursor-pointer"
                      >
                        <option value="" disabled className="bg-[#050b18]">Select Medium</option>
                        <option value="English" className="bg-[#050b18]">English</option>
                        <option value="Hindi" className="bg-[#050b18]">Hindi</option>
                        <option value="Vernacular" className="bg-[#050b18]">Vernacular</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">↓</div>
                    </div>
                  </div>
                </>
              )}
              
              {(formData.standard === 'NEET' || formData.standard === 'IIT JEE') && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Select Class / Batch</label>
                  <div className="relative">
                    <select 
                      name="specificClass"
                      required
                      onChange={handleChange}
                      value={formData.specificClass}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all appearance-none font-medium cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#050b18]">Select Class/Batch</option>
                      <option value="Class 11" className="bg-[#050b18]">Class 11</option>
                      <option value="Class 12" className="bg-[#050b18]">Class 12</option>
                      <option value="Dropper" className="bg-[#050b18]">Dropper</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">↓</div>
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-600/30 active:scale-95 text-sm uppercase tracking-[0.2em] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? 'Submitting...' : 'Confirm Enrollment'}
            </button>
            <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest">By enrolling, you agree to our terms of excellence.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
