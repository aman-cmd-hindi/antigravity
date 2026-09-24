import { useState, useEffect } from 'react';
import { ArrowRight, Terminal, ChevronRight } from 'lucide-react';

const programs = ['NEET-UG', 'IIT-JEE', 'HSC / CBSE BOARDS', 'COMMERCE'];

const Hero = () => {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const currentText = programs[currentWordIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIdx((prev) => (prev + 1) % programs.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);


  return (
    <section id="hero" className="relative pt-24 pb-12 md:pt-28 md:pb-16 px-4 md:px-8 border-b border-zinc-800/80 bg-[#09090b]">
      <div className="max-w-6xl mx-auto">
        {/* Top Telemetry Status Pill */}
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#0d0e12] border border-zinc-800 text-zinc-300 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-500">ACADEMIC_ENGINE:</span>
            <span className="text-zinc-200 font-medium">ADMISSIONS OPEN 2026–27</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 hidden sm:inline">POWAI, MUMBAI</span>
          </div>

          <div className="hidden lg:inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-900/60 border border-zinc-800/80 text-[11px] font-mono text-zinc-400">
            <span>TARGET:</span>
            <span className="text-zinc-100 font-semibold">{currentText}</span>
          </div>
        </div>

        {/* Primary Heading (High-contrast, crisp typography) */}
        <div className="max-w-4xl mb-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-100 leading-[1.08] mb-4">
            Rigorous Mentorship for <br className="hidden sm:inline" />
            <span className="text-zinc-400">Engineering, Medicine & Science.</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-normal leading-relaxed max-w-2xl">
            A high-discipline academic coaching ecosystem directing students towards rank mastery in JEE Main/Advanced, NEET-UG, School Boards, and Commerce. Directed by Manoj Sir & Sandeep Sir.
          </p>
        </div>

        {/* Dense Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          <a 
            href="#courses" 
            className="btn-primary px-4 py-2 text-xs font-mono flex items-center gap-2 rounded-sm"
          >
            <span>Explore Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </a>
          <a 
            href="/cbt" 
            className="btn-secondary px-4 py-2 text-xs font-mono flex items-center gap-2 rounded-sm"
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
            <span>Launch Mock CBT</span>
          </a>
          <a 
            href="#about" 
            className="px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1"
          >
            <span>Institute Architecture</span>
            <ChevronRight className="w-3 h-3 text-zinc-500" strokeWidth={1.5} />
          </a>
        </div>

        {/* Telemetry Matrix (4 Columns with 1px razor dividers) */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-zinc-800 bg-[#0d0e12] rounded-md divide-y md:divide-y-0 md:divide-x divide-zinc-800 mb-8">
          {[
            { metric: '10+', label: 'YEARS IN SERVICE', sub: 'ESTABLISHED 2016' },
            { metric: '1,000+', label: 'STUDENTS MENTORED', sub: 'SCIENCE & COMMERCE' },
            { metric: '97.0%', label: 'TOP BOARD PERCENTILE', sub: 'CLASS 10 & 12 RECORD' },
            { metric: '100%', label: 'CONCEPT ORIENTATION', sub: 'ZERO ROTE-LEARNING' }
          ].map((stat, idx) => (
            <div key={idx} className="p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-[10px] font-mono tracking-wider">{stat.label}</span>
                <span className="text-[9px] font-mono text-zinc-600">0{idx + 1}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-semibold text-zinc-100 tracking-tight">
                {stat.metric}
              </div>
              <div className="text-[11px] font-mono text-zinc-500 mt-1">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Target Tracks Fast-Switch Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono text-zinc-500">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 shrink-0 font-mono">Curricula:</span>
          {['NEET-UG', 'IIT-JEE', '12th SCIENCE', '11th SCIENCE', 'COMMERCE', 'CLASS 10 BOARDS', 'PRE-FOUNDATION'].map((track) => (
            <a 
              key={track} 
              href="#courses"
              className="px-2.5 py-1 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-sm shrink-0 transition-colors"
            >
              {track}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
