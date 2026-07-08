import { useState, useEffect, useRef } from 'react';
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
    commerceSubject: '',
    stream: '',
    scienceGroup: '',
    languages: [],
    optionalSubject: '',
    location: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (showOtpModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

  // Toast Message auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const generateOTP = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(code);
    setOtpInput(['', '', '', '', '', '']);
    setOtpTimer(60);
    setOtpError('');
    
    // Trigger floating notification toast
    setToastMessage({
      id: Date.now(),
      title: '💬 Message from Tiwari Tutorials',
      message: `Your verification OTP code is ${code}. It is valid for 60 seconds.`
    });
  };

  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value && element.value !== '') return;

    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otpInput[index] && index > 0) {
        inputRefs.current[index - 1].focus();
        const newOtp = [...otpInput];
        newOtp[index - 1] = '';
        setOtpInput(newOtp);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'languages') {
      let updatedLanguages = [...formData.languages];
      if (checked) {
        if (updatedLanguages.length < 2) {
          updatedLanguages.push(value);
        } else {
          // If trying to check a 3rd option, ignore
          return;
        }
      } else {
        updatedLanguages = updatedLanguages.filter(lang => lang !== value);
      }
      setFormData({ ...formData, languages: updatedLanguages });
      return;
    }

    let newFormData = { ...formData, [name]: value };

    if (name === 'standard') {
      newFormData.specificClass = '';
      newFormData.medium = '';
      newFormData.commerceSubject = '';
      newFormData.stream = '';
      newFormData.scienceGroup = '';
      newFormData.languages = [];
      newFormData.optionalSubject = '';
      if (value === 'NEET' || value === 'IIT JEE') {
        newFormData.course = 'Science';
        newFormData.competitiveExam = value === 'IIT JEE' ? 'JEE' : 'NEET';
      } else if (value === 'Commerce Section') {
        newFormData.course = 'Commerce';
        newFormData.competitiveExam = '';
      } else {
        newFormData.course = value;
        newFormData.competitiveExam = '';
      }
    }

    if (name === 'specificClass' && formData.standard === 'School Boards (Class 10-12)') {
      if (value !== 'Class 11' && value !== 'Class 12') {
        newFormData.stream = '';
        newFormData.scienceGroup = '';
        newFormData.languages = [];
        newFormData.optionalSubject = '';
      }
    }

    if (name === 'stream') {
      newFormData.scienceGroup = '';
      newFormData.languages = [];
      newFormData.optionalSubject = '';
    }
    
    if (name === 'scienceGroup' && value === 'PCM Computer Science') {
      newFormData.languages = [];
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    generateOTP();
    setShowOtpModal(true);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const enteredOtp = otpInput.join('');
    if (enteredOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }
    if (enteredOtp !== otpCode) {
      setOtpError('Invalid verification code. Please check and try again.');
      return;
    }

    setOtpVerifying(true);
    setOtpError('');
    setLoading(true);

    try {
      await addDoc(collection(db, 'enrollments'), {
        ...formData,
        submittedAt: serverTimestamp()
      });

      // Trigger Notifications
      await sendConfirmationEmail(formData, 'enrollment');
      await sendSMSNotification(formData.phone, `Hello ${formData.name}, your enrollment at Tiwari Tutorials for ${formData.standard} has been received!`);

      setSubmitted(true);
      setShowOtpModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setOtpError('Database Error: Permission denied. Please configure Firestore rules.');
    } finally {
      setLoading(false);
      setOtpVerifying(false);
    }
  };


  let courseDetails = formData.standard;
  if (formData.specificClass) {
    let suffix = '';
    if (!['Class 11', 'Class 12', 'Dropper'].includes(formData.specificClass)) {
      if (formData.specificClass === '1') suffix = 'st Std';
      else if (formData.specificClass === '2') suffix = 'nd Std';
      else if (formData.specificClass === '3') suffix = 'rd Std';
      else suffix = 'th Std';
    }
    courseDetails += ` (${formData.specificClass}${suffix})`;
  }
  
  if (formData.stream === 'Science') {
    courseDetails += ` - Science (${formData.scienceGroup})`;
    if (formData.languages.length > 0) {
      courseDetails += ` [Languages: ${formData.languages.join(', ')}]`;
    }
  } else if (formData.stream === 'Commerce') {
    courseDetails += ` - Commerce [Optional: ${formData.optionalSubject}]`;
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-mesh">
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
              href={getWhatsAppLink(formData.name, 'enrollment', courseDetails)}
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
                    <option value="School Boards (Class 10-12)" className="bg-[#050b18]">School Boards (Class 10-12)</option>
                    <option value="Pre Foundation (Class 1-9)" className="bg-[#050b18]">Pre Foundation (Class 1-9)</option>
                    <option value="NEET" className="bg-[#050b18]">NEET</option>
                    <option value="IIT JEE" className="bg-[#050b18]">IIT JEE</option>
                    <option value="Commerce Section" className="bg-[#050b18]">Commerce Section</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">↓</div>
                </div>
              </div>

              {(formData.standard === 'School Boards (Class 10-12)' || formData.standard === 'Pre Foundation (Class 1-9)') && (
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
                        {formData.standard === 'School Boards (Class 10-12)' ? (
                          <>
                            <option value="Class 10" className="bg-[#050b18]">Class 10</option>
                            <option value="Class 11" className="bg-[#050b18]">Class 11</option>
                            <option value="Class 12" className="bg-[#050b18]">Class 12</option>
                          </>
                        ) : (
                          [...Array(9)].map((_, i) => (
                            <option key={i + 1} value={i + 1} className="bg-[#050b18]">{i + 1}{i + 1 === 1 ? 'st' : i + 1 === 2 ? 'nd' : i + 1 === 3 ? 'rd' : 'th'} Standard</option>
                          ))
                        )}
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

                  {(formData.standard === 'School Boards (Class 10-12)' && (formData.specificClass === 'Class 11' || formData.specificClass === 'Class 12')) && (
                    <>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Stream</label>
                        <div className="relative">
                          <select
                            name="stream"
                            required
                            onChange={handleChange}
                            value={formData.stream}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all appearance-none font-medium cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#050b18]">Select Stream</option>
                            <option value="Science" className="bg-[#050b18]">Science</option>
                            <option value="Commerce" className="bg-[#050b18]">Commerce</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">↓</div>
                        </div>
                      </div>

                      {formData.stream === 'Science' && (
                        <>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Science Group</label>
                            <div className="relative">
                              <select
                                name="scienceGroup"
                                required
                                onChange={handleChange}
                                value={formData.scienceGroup}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all appearance-none font-medium cursor-pointer"
                              >
                                <option value="" disabled className="bg-[#050b18]">Select Group</option>
                                <option value="PCMB" className="bg-[#050b18]">PCMB</option>
                                <option value="PCB" className="bg-[#050b18]">PCB</option>
                                <option value="PCM" className="bg-[#050b18]">PCM</option>
                                <option value="PCM Computer Science" className="bg-[#050b18]">PCM Computer Science</option>
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">↓</div>
                            </div>
                          </div>

                          {formData.scienceGroup && formData.scienceGroup !== 'PCM Computer Science' && (
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Language Selection (Max 2)</label>
                              <div className="flex flex-wrap gap-4">
                                {['English', 'Hindi', 'Marathi', 'Information Technology'].map(lang => (
                                  <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      name="languages" 
                                      value={lang}
                                      onChange={handleChange}
                                      checked={formData.languages.includes(lang)}
                                      disabled={!formData.languages.includes(lang) && formData.languages.length >= 2}
                                      className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-white/80 text-sm">{lang}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {formData.stream === 'Commerce' && (
                        <>
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-2">
                            <p className="text-[11px] font-bold text-white/60 mb-1 uppercase tracking-wider text-green-400">Compulsory Subjects:</p>
                            <p className="text-sm text-white/80 font-medium">Accountancy, Business Studies, Economics, English</p>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Optional Subject</label>
                            <div className="relative">
                              <select
                                name="optionalSubject"
                                required
                                onChange={handleChange}
                                value={formData.optionalSubject}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all appearance-none font-medium cursor-pointer"
                              >
                                <option value="" disabled className="bg-[#050b18]">Select Optional Subject</option>
                                <option value="Mathematics" className="bg-[#050b18]">Mathematics</option>
                                <option value="Information Technology" className="bg-[#050b18]">Information Technology</option>
                                <option value="Hindi" className="bg-[#050b18]">Hindi</option>
                                <option value="Marathi" className="bg-[#050b18]">Marathi</option>
                              </select>
                              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">↓</div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
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

              {formData.standard === 'Commerce Section' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">Commerce Subject</label>
                  <div className="relative">
                    <select
                      name="commerceSubject"
                      required
                      onChange={handleChange}
                      value={formData.commerceSubject}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all appearance-none font-medium cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#050b18]">Select Subject</option>
                      <option value="Accountancy" className="bg-[#050b18]">Accountancy</option>
                      <option value="Business Studies" className="bg-[#050b18]">Business Studies</option>
                      <option value="Economics" className="bg-[#050b18]">Economics</option>
                      <option value="Mathematics (Commerce)" className="bg-[#050b18]">Mathematics (Commerce)</option>
                      <option value="English" className="bg-[#050b18]">English</option>
                      <option value="All Subjects" className="bg-[#050b18]">All Subjects</option>
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

      {/* Premium Notification Toast (Simulating SMS) */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 border border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-[0_10px_50px_rgba(0,0,0,0.5)] animate-slide-in pointer-events-auto">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-lg">
              💬
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider">{toastMessage.title}</p>
              <p className="text-sm font-semibold text-white mt-1 leading-relaxed">{toastMessage.message}</p>
              <div className="mt-2 text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                Now arriving via SMS
              </div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/25 hover:text-white/60 transition-colors font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Glassmorphism OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="glass-card w-full max-w-md p-10 rounded-[40px] border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.15)] text-center animate-fade-in relative overflow-hidden">
            {/* Glow effect inside modal */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl -z-10"></div>
            
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-2">Phone Verification</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              We've sent a 6-digit verification code to <span className="text-blue-400 font-bold">{formData.phone || 'your number'}</span>
            </p>

            {/* Demo/Testing Helper Badge */}
            <div className="mb-8 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl inline-flex items-center gap-3">
              <span className="text-blue-400 text-sm font-bold">🔑 Demo OTP Code:</span>
              <span className="bg-blue-600 text-white font-extrabold px-3 py-1 rounded-lg text-sm tracking-wider select-all">{otpCode}</span>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex justify-between gap-2 max-w-[300px] mx-auto">
                {otpInput.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl text-white font-bold focus:border-blue-500 focus:bg-white/10 outline-none transition-all"
                  />
                ))}
              </div>

              {otpError && <p className="text-red-400 text-xs font-bold">{otpError}</p>}

              <div className="text-xs font-semibold">
                {otpTimer > 0 ? (
                  <span className="text-white/40">Resend code in <span className="text-blue-400">{otpTimer}s</span></span>
                ) : (
                  <button
                    type="button"
                    onClick={generateOTP}
                    className="text-blue-400 hover:text-blue-300 font-bold transition-all cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpVerifying || loading}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl active:scale-95 shadow-lg shadow-blue-600/30 transition-all text-sm uppercase tracking-wider disabled:opacity-50"
                >
                  {otpVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentPage;
