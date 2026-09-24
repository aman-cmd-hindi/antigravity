import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { sendConfirmationEmail, sendSMSNotification, getWhatsAppLink } from '../utils/notifications';
import { ArrowLeft, CheckCircle2, ShieldCheck, Lock, ChevronDown, MessageSquare, KeyRound, X } from 'lucide-react';

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
    
    setToastMessage({
      id: Date.now(),
      title: 'SECURITY PROTOCOL // OTP',
      message: `Your verification OTP is ${code}. Valid for 60 seconds.`
    });
  };

  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    if (!value && element.value !== '') return;

    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

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
      setOtpError('Please input all 6 digits of the authentication OTP.');
      return;
    }
    if (enteredOtp !== otpCode) {
      setOtpError('Authentication mismatch. Code does not match.');
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#09090b]">
        <div className="bg-[#0d0e12] border border-zinc-800 p-8 rounded-md text-center max-w-md w-full shadow-2xl">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-sm flex items-center justify-center mx-auto mb-5 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
            ENROLLMENT_DISPATCH_CONFIRMED
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Enrollment Request Prioritized</h2>
          <p className="text-zinc-400 mb-6 text-xs font-mono leading-relaxed">
            Welcome, <span className="text-zinc-200 font-semibold">{formData.name}</span>. Your application for <span className="text-zinc-300 font-medium">{courseDetails}</span> is confirmed. Direct mentor contact will follow within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center font-mono">
            <a
              href={getWhatsAppLink(formData.name, 'enrollment', courseDetails)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full sm:w-auto px-4 py-2 text-xs rounded-sm border border-zinc-800 text-zinc-200 flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
              <span>Confirm on WhatsApp</span>
            </a>
            <Link to="/" className="btn-primary w-full sm:w-auto px-4 py-2 text-xs rounded-sm">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] py-16 px-4 md:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Specification Column */}
        <div className="lg:w-5/12 space-y-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 font-mono text-xs mb-4 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>RETURN TO HOME</span>
            </Link>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
              PROVISIONING PROTOCOL // CANDIDATE REGISTRATION
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-100 leading-tight mb-3">
              Enroll for <br className="hidden sm:inline" />Academic Mentorship
            </h1>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Complete candidate profile to reserve batch capacity. All admissions are verified directly by Manoj Sir and Sandeep Sir.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {[
              { title: 'Personalized Diagnostic', desc: 'Direct syllabus evaluation and weak-area roadmap.' },
              { title: 'Small Batch Discipline', desc: 'Strict student-teacher ratio to maintain high focus.' },
              { title: 'Continuous Telemetry', desc: 'Weekly analytics reports delivered directly to parents.' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-[#0d0e12] border border-zinc-800 rounded-sm flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <div className="text-xs font-mono font-semibold text-zinc-200">{item.title}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-sm text-[11px] font-mono text-zinc-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" strokeWidth={1.5} />
            <span>ENCRYPTED SECURE VERIFICATION DISPATCH</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:w-7/12 w-full">
          <form onSubmit={handleSubmit} className="bg-[#0d0e12] border border-zinc-800 p-6 sm:p-8 rounded-md space-y-4 shadow-xl">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-800">
              CANDIDATE CREDENTIALS
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Student Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Contact Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Course / Category</label>
                <div className="relative">
                  <select
                    name="standard"
                    required
                    value={formData.standard}
                    onChange={handleChange}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#09090b]">Select Curricular Track</option>
                    <option value="School Boards (Class 10-12)" className="bg-[#09090b]">School Boards (Class 10–12)</option>
                    <option value="Pre Foundation (Class 1-9)" className="bg-[#09090b]">Pre Foundation (Class 1–9)</option>
                    <option value="NEET" className="bg-[#09090b]">NEET Medical Entrance</option>
                    <option value="IIT JEE" className="bg-[#09090b]">IIT JEE Engineering Entrance</option>
                    <option value="Commerce Section" className="bg-[#09090b]">Commerce Stream</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
                </div>
              </div>

              {(formData.standard === 'School Boards (Class 10-12)' || formData.standard === 'Pre Foundation (Class 1-9)') && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Standard / Grade</label>
                  <div className="relative">
                    <select
                      name="specificClass"
                      required
                      onChange={handleChange}
                      value={formData.specificClass}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#09090b]">Select Class</option>
                      {formData.standard === 'School Boards (Class 10-12)' ? (
                        <>
                          <option value="Class 10" className="bg-[#09090b]">Class 10</option>
                          <option value="Class 11" className="bg-[#09090b]">Class 11</option>
                          <option value="Class 12" className="bg-[#09090b]">Class 12</option>
                        </>
                      ) : (
                        [...Array(9)].map((_, i) => (
                          <option key={i + 1} value={i + 1} className="bg-[#09090b]">{i + 1} Standard</option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
                  </div>
                </div>
              )}

              {(formData.standard === 'NEET' || formData.standard === 'IIT JEE') && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Target Cohort</label>
                  <div className="relative">
                    <select
                      name="specificClass"
                      required
                      onChange={handleChange}
                      value={formData.specificClass}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#09090b]">Select Cohort</option>
                      <option value="Class 11" className="bg-[#09090b]">Class 11 (2-Year Integrated)</option>
                      <option value="Class 12" className="bg-[#09090b]">Class 12 (1-Year Focused)</option>
                      <option value="Dropper" className="bg-[#09090b]">Dropper / Repeater Batch</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
                  </div>
                </div>
              )}

              {formData.standard === 'Commerce Section' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Commerce Subject</label>
                  <div className="relative">
                    <select
                      name="commerceSubject"
                      required
                      onChange={handleChange}
                      value={formData.commerceSubject}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 focus:border-zinc-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#09090b]">Select Subject Focus</option>
                      <option value="Accountancy" className="bg-[#09090b]">Accountancy</option>
                      <option value="Business Studies" className="bg-[#09090b]">Business Studies</option>
                      <option value="Economics" className="bg-[#09090b]">Economics</option>
                      <option value="Mathematics (Commerce)" className="bg-[#09090b]">Mathematics (Commerce)</option>
                      <option value="English" className="bg-[#09090b]">English</option>
                      <option value="All Subjects" className="bg-[#09090b]">Comprehensive Package</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-xs font-mono rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{loading ? 'PROCESSING...' : 'AUTHENTICATE & DISPATCH ENROLLMENT'}</span>
            </button>
            <p className="text-center text-[10px] text-zinc-600 font-mono">Secure TLS Verified Dispatch // Powai Administrative Registry</p>
          </form>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-[#0d0e12] border border-zinc-700 p-3.5 rounded-sm shadow-2xl animate-slide-in font-mono">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-zinc-300 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{toastMessage.title}</p>
                <p className="text-xs text-zinc-200 mt-0.5">{toastMessage.message}</p>
              </div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-zinc-500 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal (Linear/Stripe style) */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090b]/85 backdrop-blur-sm">
          <div className="bg-[#0d0e12] border border-zinc-800 w-full max-w-sm p-6 rounded-md shadow-2xl text-center animate-fade-in font-mono">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 rounded-sm flex items-center justify-center mx-auto mb-4 text-zinc-200">
              <Lock className="w-4 h-4" strokeWidth={1.5} />
            </div>

            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">SECURITY GATEWAY</div>
            <h3 className="text-base font-semibold text-zinc-100 mb-1">Verify Contact Authenticity</h3>
            <p className="text-zinc-400 text-xs mb-4">
              Enter 6-digit verification code sent to <span className="text-zinc-200">{formData.phone}</span>
            </p>

            <div className="mb-5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-sm inline-flex items-center gap-2 text-xs">
              <span className="text-zinc-400">TEST CODE:</span>
              <span className="text-zinc-100 font-bold select-all tracking-wider">{otpCode}</span>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="flex justify-between gap-1.5 max-w-[260px] mx-auto">
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
                    className="w-9 h-11 bg-zinc-900 border border-zinc-800 rounded-sm text-center text-base text-zinc-100 font-bold focus:border-zinc-500 outline-none"
                  />
                ))}
              </div>

              {otpError && <p className="text-red-400 text-xs">{otpError}</p>}

              <div className="text-[11px] text-zinc-500">
                {otpTimer > 0 ? (
                  <span>Resend available in <span className="text-zinc-300 font-medium">{otpTimer}s</span></span>
                ) : (
                  <button
                    type="button"
                    onClick={generateOTP}
                    className="text-zinc-300 hover:text-white underline"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="btn-secondary flex-1 py-2 text-xs rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpVerifying || loading}
                  className="btn-primary flex-1 py-2 text-xs rounded-sm"
                >
                  {otpVerifying ? 'VERIFYING...' : 'CONFIRM'}
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
