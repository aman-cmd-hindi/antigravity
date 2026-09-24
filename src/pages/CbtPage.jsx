import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Timer, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Bookmark, 
  BookOpen, 
  Award, 
  Compass, 
  Clock, 
  BarChart2, 
  X, 
  AlertTriangle,
  Lightbulb,
  Search,
  BookMarked,
  Layers,
  Flag
} from 'lucide-react';

import { useCbtTimer, formatTime } from '../hooks/useCbtTimer';
import { prepareNewQuestions } from '../data/cbtQuestions';
import CbtResultsCard from '../components/cbt/CbtResultsCard';

const CbtPage = () => {
  // --- State Configuration ---
  const [view, setView] = useState('home');
  const [questionCount, setQuestionCount] = useState(30);
  const [sessionQuestions, setSessionQuestions] = useState(() => prepareNewQuestions(30));
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const {
    timeLeft,
    pauseTimer,
    resetTimer
  } = useCbtTimer(questionCount * 72, view === 'test', () => {
    setView('results');
  });
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');
  const [showHint, setShowHint] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Filtered Questions based on UI Selection ---
  const filteredQuestions = useMemo(() => {
    return sessionQuestions.filter(q => {
      const matchSubject = selectedSubjectFilter === 'All' || q.subject === selectedSubjectFilter;
      const matchSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.topic.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [selectedSubjectFilter, searchTerm, sessionQuestions]);


  // Timer is managed reactively via useCbtTimer hook

  // Security through Obscurity: Anti-tampering & inspect protection during active exam
  useEffect(() => {
    if (view !== 'test') return;
    const blockInspect = (e) => {
      // Prevent F12 DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U (view source)
      if ((e.ctrlKey || e.metaKey) && (
        (e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        e.key.toUpperCase() === 'U'
      )) {
        e.preventDefault();
        return false;
      }
    };
    window.addEventListener('keydown', blockInspect);
    return () => window.removeEventListener('keydown', blockInspect);
  }, [view]);

  // formatTime is imported from useCbtTimer

  const currentQ = filteredQuestions[currentIdx] || sessionQuestions[0];

  // --- Interactive Handlers ---
  const handleSelectOption = (qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    setVisitedQuestions(prev => ({ ...prev, [qId]: true }));
  };

  const handleNext = () => {
    if (currentIdx < filteredQuestions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      const nextQId = filteredQuestions[nextIdx].id;
      setVisitedQuestions(prev => ({ ...prev, [nextQId]: true }));
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      const prevQId = filteredQuestions[prevIdx].id;
      setVisitedQuestions(prev => ({ ...prev, [prevQId]: true }));
    }
  };

  const toggleMarkForReview = (qId) => {
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleBookmark = (qId) => {
    setBookmarked(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const clearResponse = (qId) => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleFinalSubmit = () => {
    pauseTimer();
    setView('results');
  };

  const startTest = () => {
    const freshQs = prepareNewQuestions(questionCount);
    setSessionQuestions(freshQs);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({ [freshQs[0].id]: true });
    setCurrentIdx(0);
    resetTimer(questionCount * 72);
    setView('test');
  };

  const restartTest = () => {
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({});
    setCurrentIdx(0);
    resetTimer(questionCount * 72);
    setSessionQuestions(prepareNewQuestions(questionCount));
    setView('home');
  };

  // --- Score Calculator and Diagnostics ---
  const resultsSummary = useMemo(() => {
    let mathScore = 0;
    let physicsScore = 0;
    let chemistryScore = 0;
    let mathAttempted = 0;
    let physicsAttempted = 0;
    let chemistryAttempted = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    sessionQuestions.forEach(q => {
      const isAttempted = answers[q.id] !== undefined;
      const isCorrect = answers[q.id] === q.correct;

      if (q.subject === 'Mathematics') {
        if (isAttempted) mathAttempted++;
        if (isCorrect) {
          mathScore += 2;
          correctCount++;
        } else if (isAttempted) {
          incorrectCount++;
        }
      } else if (q.subject === 'Physics') {
        if (isAttempted) physicsAttempted++;
        if (isCorrect) {
          physicsScore += 1;
          correctCount++;
        } else if (isAttempted) {
          incorrectCount++;
        }
      } else if (q.subject === 'Chemistry') {
        if (isAttempted) chemistryAttempted++;
        if (isCorrect) {
          chemistryScore += 1;
          correctCount++;
        } else if (isAttempted) {
          incorrectCount++;
        }
      }
    });

    const mathCount = sessionQuestions.filter(q => q.subject === 'Mathematics').length;
    const physicsCount = sessionQuestions.filter(q => q.subject === 'Physics').length;
    const chemistryCount = sessionQuestions.filter(q => q.subject === 'Chemistry').length;

    const totalScore = mathScore + physicsScore + chemistryScore;
    const maxScore = mathCount * 2 + physicsCount * 1 + chemistryCount * 1;
    const percentileVal = Math.min(99.9, Math.max(45, (totalScore / maxScore) * 100 + 4.5));

    return {
      totalScore,
      maxScore,
      mathScore,
      physicsScore,
      chemistryScore,
      mathAttempted,
      physicsAttempted,
      chemistryAttempted,
      correctCount,
      incorrectCount,
      percentile: parseFloat(percentileVal.toFixed(2))
    };
  }, [answers, sessionQuestions]);

  const mathCount = useMemo(() => sessionQuestions.filter(q => q.subject === 'Mathematics').length, [sessionQuestions]);
  const physicsCount = useMemo(() => sessionQuestions.filter(q => q.subject === 'Physics').length, [sessionQuestions]);
  const chemistryCount = useMemo(() => sessionQuestions.filter(q => q.subject === 'Chemistry').length, [sessionQuestions]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* --- Main Navigation Header --- */}
      <header className="bg-[#09090b] text-white border-b border-zinc-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/" className="bg-zinc-900 border border-zinc-700 p-2 rounded-sm flex items-center justify-center">
            <Compass className="w-4 h-4 text-zinc-200" strokeWidth={1.5} />
          </Link>
          <div>
            <h1 className="text-base font-bold font-mono tracking-tight flex items-center gap-2">
              MHT-CET <span className="bg-zinc-800 text-[10px] uppercase py-0.5 px-1.5 rounded-xs font-mono border border-zinc-700 text-zinc-300">CBT Platform</span>
            </h1>
            <p className="text-[11px] font-mono text-zinc-500">Maharashtra State Entrance Test Mock Portal</p>
          </div>
        </div>

        {/* Navigation States */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button 
            onClick={() => setView('cheat-sheet')}
            className={`px-3 py-1.5 rounded-sm text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer border ${
              view === 'cheat-sheet' ? 'bg-zinc-800 text-zinc-100 border-zinc-600' : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} /> Syllabus & Formulae
          </button>
          
          {view === 'test' && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-zinc-500 text-xs font-mono">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} /> Elapsed: {formatTime(questionCount * 72 - timeLeft)}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border ${
                timeLeft < 300 ? 'bg-red-950/40 text-red-300 border-red-800' : 'bg-zinc-900 text-zinc-200 border-zinc-800'
              } transition-colors`}>
                <Timer className="w-3.5 h-3.5 text-zinc-400 animate-pulse" strokeWidth={1.5} />
                <span className="font-mono font-medium tracking-wider">{formatTime(timeLeft)}</span>
              </div>
              <button 
                onClick={handleFinalSubmit}
                className="btn-primary px-4 py-1.5 rounded-sm font-mono text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Submit Paper</span>
                <Send className="w-3 h-3" strokeWidth={1.5} />
              </button>
            </div>
          )}

          {view !== 'test' && (
            <button 
              onClick={startTest}
              className="btn-primary px-4 py-1.5 rounded-sm text-xs font-mono cursor-pointer"
            >
              Start Practice Session
            </button>
          )}
        </div>
      </header>

      {/* --- View Rendering Router --- */}
      <div className="flex-1 flex flex-col">
        
        {/* VIEW 1: HOME/INSTRUCTIONS SCREEN */}
        {view === 'home' && (
          <div className="flex-1 max-w-6xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Intro & Rules Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-7 h-7 text-amber-500" /> CET Exam Guidelines (PCM Group)
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Welcome to the ultimate preparation environment for MHT-CET. This simulator draws 100% authentic MHT-CET CELL Previous Year Questions (PYQs) from 2018-2025, balanced with state-board weightage: 
                  <span className="font-semibold text-slate-900"> 80% from standard XII and 20% from standard XI core topics.</span>
                </p>

                {/* Configure test size options */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 mb-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-500" />
                    <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">Configure Practice Session Size:</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[30, 60, 90, 120, 150].map((num) => (
                      <button
                        key={num}
                        onClick={() => setQuestionCount(num)}
                        className={`py-3 rounded-2xl text-xs font-black transition-all cursor-pointer border-none shadow-sm ${
                          questionCount === num 
                            ? 'bg-slate-900 text-white font-extrabold scale-105 shadow-md animate-pulse' 
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {num} Qs
                        <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">{Math.round(num * 1.2)} Mins</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-500 uppercase font-black">Total Marks</span>
                    <p className="text-2xl font-black text-slate-800">{Math.round(questionCount * 1.33)} Marks</p>
                    <span className="text-xs text-slate-400">Math (+2) & Physics/Chemistry (+1)</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-500 uppercase font-black">Time Allotted</span>
                    <p className="text-2xl font-black text-slate-800">{Math.round(questionCount * 1.2)} Mins</p>
                    <span className="text-xs text-slate-400">72 Seconds per question</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-500 uppercase font-black">Question Bank Size</span>
                    <p className="text-2xl font-black text-slate-800">20,000+</p>
                    <span className="text-xs text-emerald-600 font-semibold font-mono">Infinite dynamic variations</span>
                  </div>
                </div>

                <button 
                  onClick={startTest}
                  className="w-full btn-primary py-3 rounded-sm font-mono text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enter Exam Arena Now</span>
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Syllabus Overview / Syllabus Cards */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
                <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-500" /> Active Session Details
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-blue-900 text-sm">Mathematics</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{Math.floor(questionCount / 3)} Qs ({Math.floor(questionCount / 3) * 2} Marks)</span>
                    </div>
                    <p className="text-xs text-slate-600">Calculus, Trigonometry, Vectors, Linear Programming, and Matrices.</p>
                  </div>

                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-rose-900 text-sm">Physics</span>
                      <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">{Math.floor(questionCount / 3)} Qs ({Math.floor(questionCount / 3)} Marks)</span>
                    </div>
                    <p className="text-xs text-slate-600">Fluid Mechanics, AC Circuits, Semiconductors, Electrostatics, Waves.</p>
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-emerald-900 text-sm">Chemistry</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">{Math.floor(questionCount / 3)} Qs ({Math.floor(questionCount / 3)} Marks)</span>
                    </div>
                    <p className="text-xs text-slate-600">Chemical Kinetics, Coordination Compounds, Solutions, Thermodynamics, Organics.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-rose-500/20 rounded-tl-full pointer-events-none" />
                <h3 className="font-black text-amber-400 text-lg mb-2">Practice Mode</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every attempt draws a fresh, randomly selected and shuffled set of authentic MHT-CET CELL PYQs. With randomized values and dynamically shuffled option orders, your practice is always unique and different!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SYLLABUS & CHEAT SHEET */}
        {view === 'cheat-sheet' && (
          <div className="flex-1 max-w-5xl mx-auto p-6 md:p-12 space-y-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                  <BookMarked className="w-8 h-8 text-amber-500" /> Syllabus Formula Cheat-Sheet
                </h2>
                <p className="text-slate-500">Quick-lookup of standard MHT-CET state-board formulas & high-yield topics.</p>
              </div>
              <button 
                onClick={() => setView('home')}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-all cursor-pointer border-none"
              >
                Back to Home
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mathematics Section */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
                <div className="border-b pb-3 flex items-center justify-between">
                  <h3 className="font-black text-blue-600 text-lg">Mathematics Formulae</h3>
                  <span className="bg-blue-50 text-blue-600 font-extrabold text-xs px-2 py-1 rounded">High Weight</span>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-800">Matrices property:</p>
                    <code className="block bg-slate-900 text-slate-200 text-xs p-2 rounded mt-1 font-mono">
                      A · adj(A) = |A| · I <br />
                      A⁻¹ = adj(A) / |A|
                    </code>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-800">Pair of straight lines acute angle:</p>
                    <code className="block bg-slate-900 text-slate-200 text-xs p-2 rounded mt-1 font-mono font-serif italic">
                      tan θ = | 2√(h² - ab) / (a + b) |
                    </code>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-800">Definite Integral property:</p>
                    <code className="block bg-slate-900 text-slate-200 text-xs p-2 rounded mt-1 font-mono">
                      ∫ [a to b] f(x) dx = ∫ [a to b] f(a+b-x) dx
                    </code>
                  </div>
                </div>
              </div>

              {/* Physics Section */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
                <div className="border-b pb-3 flex items-center justify-between">
                  <h3 className="font-black text-rose-600 text-lg">Physics Formulae</h3>
                  <span className="bg-rose-50 text-rose-600 font-extrabold text-xs px-2 py-1 rounded">Class XII Core</span>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-800">Rotational Dynamics M.I.:</p>
                    <code className="block bg-slate-900 text-slate-200 text-xs p-2 rounded mt-1 font-mono">
                      Disc diameter: (1/4) M R²<br />
                      Parallel axis: I = I_cm + M d²
                    </code>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-800">Fringe Width (YDS Experiment):</p>
                    <code className="block bg-slate-900 text-slate-200 text-xs p-2 rounded mt-1 font-mono">
                      β = λ * D / d
                    </code>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-800">Linear SHM Displacement:</p>
                    <code className="block bg-slate-900 text-slate-200 text-xs p-2 rounded mt-1 font-mono">
                      At mean: PE = 0, KE = max<br />
                      At x = A / √2: KE = PE
                    </code>
                  </div>
                </div>
              </div>

              {/* Chemistry Section */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
                <div className="border-b pb-3 flex items-center justify-between">
                  <h3 className="font-black text-emerald-600 text-lg">Chemistry Key Concepts</h3>
                  <span className="bg-emerald-50 text-emerald-600 font-extrabold text-xs px-2 py-1 rounded">Quick Scoring</span>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-800">Solid State Packing efficiency:</p>
                    <code className="block bg-slate-900 text-slate-200 text-xs p-2 rounded mt-1 font-mono">
                      FCC / CCP: 74% (void = 26%)<br />
                      BCC: 68% (void = 32%)<br />
                      Simple Cubic: 52.4% (void = 47.6%)
                    </code>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-800">First-Order kinetics equation:</p>
                    <code className="block bg-slate-900 text-slate-200 text-xs p-2 rounded mt-1 font-mono">
                      t_1/2 = 0.693 / k<br />
                      k = (2.303 / t) * log(a / (a-x))
                    </code>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold text-slate-800">Solubility Product (AB₂ salt):</p>
                    <code className="block bg-slate-900 text-slate-200 text-xs p-2 rounded mt-1 font-mono">
                      Ksp = s * (2s)² = 4s³
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: FULL DYNAMIC CBT INTERFACE PANEL */}
        {view === 'test' && (
          <div 
            className="flex-1 flex overflow-hidden select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            
            {/* Main Question & Option Body */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col justify-between bg-slate-50">
              
              <div className="max-w-4xl mx-auto w-full space-y-6">
                
                {/* Subject Selector Bar */}
                <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex gap-1.5 overflow-x-auto">
                    {['All', 'Mathematics', 'Physics', 'Chemistry'].map(sub => (
                      <button
                        key={sub}
                        onClick={() => { setSelectedSubjectFilter(sub); setCurrentIdx(0); }}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-none ${
                          selectedSubjectFilter === sub 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>

                  {/* Active Question Subject Label */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black tracking-wider text-slate-400 uppercase">Active Question:</span>
                    <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">
                      Q{currentIdx + 1} of {filteredQuestions.length}
                    </span>
                  </div>
                </div>

                {/* Main Interactive Question Card */}
                {filteredQuestions.length > 0 ? (
                  <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                    
                    {/* Header Strip */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex justify-between items-center text-white">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${
                          currentQ.subject === 'Mathematics' ? 'bg-blue-50/20 text-blue-300 border border-blue-500/30' :
                          currentQ.subject === 'Physics' ? 'bg-rose-50/20 text-rose-300 border border-rose-500/30' :
                          'bg-emerald-50/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {currentQ.subject}
                        </span>
                        <span className="text-slate-400 text-xs font-medium">| {currentQ.topic} ({currentQ.level})</span>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider animate-pulse">
                          {currentQ.year || 'MHT CET PYQ'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Bookmark Button */}
                        <button 
                          onClick={() => toggleBookmark(currentQ.id)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer border-none ${
                            bookmarked[currentQ.id] ? 'bg-amber-500 text-slate-950' : 'hover:bg-slate-700 text-slate-300'
                          }`}
                          title="Bookmark for review"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                        
                        {/* Mark for review and next */}
                        <button 
                          onClick={() => toggleMarkForReview(currentQ.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-none ${
                            markedForReview[currentQ.id] 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                          }`}
                        >
                          <Flag className="w-3 h-3" /> {markedForReview[currentQ.id] ? 'Marked' : 'Mark for Review'}
                        </button>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="p-6 md:p-8 space-y-6">
                      <div className="flex items-start gap-4">
                        <span className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0">
                          {currentIdx + 1}
                        </span>
                        <div className="space-y-6 flex-1">
                          <h3 className="text-lg md:text-xl font-bold leading-relaxed text-slate-900">
                            {currentQ.question}
                          </h3>

                          {/* Options list */}
                          <div className="grid grid-cols-1 gap-3.5">
                            {currentQ.options.map((option, idx) => {
                              const isSelected = answers[currentQ.id] === idx;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleSelectOption(currentQ.id, idx)}
                                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 group relative cursor-pointer ${
                                    isSelected 
                                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center border transition-all text-xs ${
                                    isSelected 
                                      ? 'bg-white text-slate-950 border-white' 
                                      : 'bg-white text-slate-500 border-slate-200 group-hover:border-slate-300'
                                  }`}>
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span className="font-semibold text-sm leading-normal flex-1">{option}</span>
                                  {isSelected && (
                                    <CheckCircle className="w-5 h-5 text-emerald-400 absolute right-4 animate-in zoom-in-75 duration-200" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Hint section */}
                          {showHint[currentQ.id] && (
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm animate-in fade-in slide-in-from-top-2 duration-350 flex gap-3">
                              <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block mb-0.5">Hint / Approach:</span>
                                {currentQ.hint}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Controls / Action Bar */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center gap-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => clearResponse(currentQ.id)}
                          disabled={answers[currentQ.id] === undefined}
                          className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer bg-white"
                        >
                          Clear Response
                        </button>
                        <button
                          onClick={() => setShowHint(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                            showHint[currentQ.id] 
                              ? 'bg-amber-100 border-amber-300 text-amber-800' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          {showHint[currentQ.id] ? 'Hide Hint' : 'View Hint'}
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevious}
                          disabled={currentIdx === 0}
                          className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer bg-white"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={currentIdx === filteredQuestions.length - 1}
                          className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer bg-white"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xl space-y-4">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                    <h3 className="text-xl font-bold text-slate-900">No Questions Match Filter</h3>
                    <p className="text-slate-500 max-w-md mx-auto text-sm">We couldn't find any questions matching "{searchTerm}" in the {selectedSubjectFilter} category.</p>
                    <button
                      onClick={() => { setSearchTerm(''); setSelectedSubjectFilter('All'); }}
                      className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-slate-800 transition-all cursor-pointer border-none"
                    >
                      Clear Search & Filter
                    </button>
                  </div>
                )}
                
              </div>
            </main>

            {/* Sidebar Palette panel */}
            {sidebarOpen ? (
              <aside className="w-80 bg-white border-l border-slate-200 flex flex-col justify-between overflow-hidden shadow-2xl relative animate-in slide-in-from-right duration-300">
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Search and Sidebar Header */}
                  <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4 text-rose-500" /> Question Palette
                      </h4>
                      <button 
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Search questions or topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400 text-slate-800"
                      />
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Subject Summary Counts */}
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 grid grid-cols-3 gap-2 text-[10px] text-center font-bold">
                    <div className="p-1.5 bg-white border rounded-lg text-blue-600">
                      <span>Math</span>
                      <p className="text-xs font-black">{Object.keys(answers).filter(k => sessionQuestions.find(q => q.id === Number(k))?.subject === 'Mathematics').length}/{mathCount}</p>
                    </div>
                    <div className="p-1.5 bg-white border rounded-lg text-rose-600">
                      <span>Physics</span>
                      <p className="text-xs font-black">{Object.keys(answers).filter(k => sessionQuestions.find(q => q.id === Number(k))?.subject === 'Physics').length}/{physicsCount}</p>
                    </div>
                    <div className="p-1.5 bg-white border rounded-lg text-emerald-600">
                      <span>Chem</span>
                      <p className="text-xs font-black">{Object.keys(answers).filter(k => sessionQuestions.find(q => q.id === Number(k))?.subject === 'Chemistry').length}/{chemistryCount}</p>
                    </div>
                  </div>

                  {/* Question Grid */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-5 gap-2.5">
                      {filteredQuestions.map((q, idx) => {
                        const isCurrent = currentIdx === idx;
                        const isAnswered = answers[q.id] !== undefined;
                        const isMarked = markedForReview[q.id];
                        const isVisited = visitedQuestions[q.id];

                        let btnClass = "bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200";
                        
                        if (isAnswered) {
                          btnClass = "bg-emerald-500 text-white hover:bg-emerald-600 border-transparent";
                        } else if (isMarked) {
                          btnClass = "bg-purple-600 text-white hover:bg-purple-700 border-transparent";
                        } else if (isVisited) {
                          btnClass = "bg-rose-500 text-white hover:bg-rose-600 border-transparent";
                        }

                        return (
                          <button
                            key={q.id}
                            onClick={() => {
                              setCurrentIdx(idx);
                              setVisitedQuestions(prev => ({ ...prev, [q.id]: true }));
                            }}
                            className={`h-10 w-full rounded-xl text-xs font-extrabold flex items-center justify-center border-2 transition-all active:scale-90 cursor-pointer ${btnClass} ${
                              isCurrent ? 'ring-2 ring-slate-900 border-white' : ''
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Sidebar Legend Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-500 block" /> Answered
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-rose-500 block" /> Unanswered
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-purple-600 block" /> For Review
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-slate-100 border block" /> Not Visited
                    </div>
                  </div>
                </div>

              </aside>
            ) : (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-2 rounded-l-xl border-l border-t border-b border-slate-800 shadow-2xl z-30 transition-transform active:scale-95 flex flex-col items-center gap-1 hover:bg-slate-800 py-4 cursor-pointer border-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-[9px] [writing-mode:vertical-lr] font-extrabold uppercase tracking-widest mt-1">Palette</span>
              </button>
            )}

          </div>
        )}

        {/* VIEW 4: RESULTS DASHBOARD VIEW */}
        {view === 'results' && (
          <CbtResultsCard
            resultsSummary={resultsSummary}
            sessionQuestions={sessionQuestions}
            answers={answers}
            restartTest={restartTest}
          />
        )}

      </div>

    </div>
  );
};

export default CbtPage;
