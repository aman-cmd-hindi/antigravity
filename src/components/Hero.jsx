import { useState, useEffect } from 'react';

const PARTICLES_DATA = [
  { width: '4px', height: '4px', left: '12%', top: '25%', animationDelay: '0.2s', animationDuration: '12s' },
  { width: '6px', height: '6px', left: '34%', top: '76%', animationDelay: '1.5s', animationDuration: '18s' },
  { width: '3px', height: '3px', left: '55%', top: '45%', animationDelay: '3.0s', animationDuration: '14s' },
  { width: '8px', height: '8px', left: '78%', top: '15%', animationDelay: '0.8s', animationDuration: '22s' },
  { width: '5px', height: '5px', left: '90%', top: '60%', animationDelay: '2.1s', animationDuration: '16s' },
  { width: '7px', height: '7px', left: '22%', top: '88%', animationDelay: '4.2s', animationDuration: '20s' },
  { width: '4px', height: '4px', left: '67%', top: '33%', animationDelay: '1.1s', animationDuration: '15s' },
  { width: '5px', height: '5px', left: '81%', top: '72%', animationDelay: '2.5s', animationDuration: '13s' },
  { width: '3px', height: '3px', left: '15%', top: '50%', animationDelay: '0.5s', animationDuration: '17s' },
  { width: '6px', height: '6px', left: '42%', top: '18%', animationDelay: '3.6s', animationDuration: '19s' },
  { width: '4px', height: '4px', left: '59%', top: '80%', animationDelay: '1.9s', animationDuration: '21s' },
  { width: '7px', height: '7px', left: '88%', top: '40%', animationDelay: '0.1s', animationDuration: '11s' },
  { width: '5px', height: '5px', left: '28%', top: '63%', animationDelay: '2.9s', animationDuration: '23s' },
  { width: '8px', height: '8px', left: '47%', top: '92%', animationDelay: '4.8s', animationDuration: '25s' },
  { width: '3px', height: '3px', left: '71%', top: '10%', animationDelay: '1.3s', animationDuration: '10s' }
];

const programs = ['NEET', 'JEE', 'Boards', 'Commerce'];

const Hero = () => {
  // Typing animation configuration
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return `Preparing for ${programs.join(' / ')}`;
    }
    return '';
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const fullWord = `Preparing for ${programs[currentWordIdx]}`;
    
    const handleType = () => {
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullWord) {
          setTypingSpeed(1800);
          setIsDeleting(true);
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % programs.length);
          setTypingSpeed(300);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, typingSpeed]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-32 bg-main-animate">
      {/* Animated Particles */}
      {PARTICLES_DATA.map((style, i) => (
        <div 
          key={i} 
          className="particle animate-particle" 
          style={{ 
            ...style,
            background: 'var(--primary)',
            opacity: 0.2
          }}
        ></div>
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full glass text-primary text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8 font-mono-label">
          <span>{currentText}</span>
          <span className="w-1.5 h-3 bg-primary ml-1.5 animate-pulse inline-block" />
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
          Master Your Future with <br /><span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-blue-400 bg-clip-text text-transparent">Tiwari Tutorials</span>
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-10">
          <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-primary"></div>
          <p className="text-primary/80 font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] whitespace-nowrap font-mono-label">
            Directed by Manoj Sir & Sandeep Sir
          </p>
          <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-primary"></div>
        </div>
        
        <p className="text-base md:text-lg text-white/50 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed font-medium">
          Expert mentorship for Science, JEE, and NEET. Building strong foundations for a brighter tomorrow.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-16">
          <a href="#courses" className="w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 btn-primary shimmer-effect circuit-btn ripple-btn font-bold rounded-xl md:rounded-2xl text-sm md:text-base">
            Explore Courses
          </a>
          <a href="#about" className="w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 btn-secondary circuit-btn ripple-btn text-white font-bold rounded-xl md:rounded-2xl text-sm md:text-base">
            Learn More
          </a>
        </div>

        {/* Academic Stats Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/5">
          {[
            { value: '10+', label: 'Years of Excellence', color: 'text-amber-500' },
            { value: '1000+', label: 'Students Mentored', color: 'text-blue-400' },
            { value: '97%', label: 'Top Board Score', color: 'text-amber-500' },
            { value: '100%', label: 'Concept Oriented', color: 'text-blue-400' }
          ].map((stat, idx) => (
            <div key={idx} className="glass p-5 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-500">
              <div className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[9px] md:text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1.5 font-mono-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Badges */}
      <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 md:gap-4 w-full justify-center px-6 max-w-4xl">
        {['NEET', 'JEE', '11th Sci', '12th Sci'].map((badge) => (
          <a 
            key={badge} 
            href="#courses" 
            className="px-4 py-1.5 md:px-6 md:py-2 glass rounded-full text-white/40 hover:text-primary hover:border-primary/50 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer border border-white/5 shadow-lg active:scale-95"
          >
            {badge}
          </a>
        ))}
      </div>

      {/* Scroll Cue for Desktop */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 opacity-40 hover:opacity-85 transition-opacity">
        <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/50 font-mono-label">Scroll Down</span>
        <div className="w-5 h-7 border border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-1.5 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
