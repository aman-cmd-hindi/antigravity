import React from 'react';

const Hero = () => {
  const particles = React.useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      width: `${Math.random() * 8 + 2}px`,
      height: `${Math.random() * 8 + 2}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 10 + 10}s`,
    }));
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-32 bg-main-animate">
      {/* Animated Particles */}
      {particles.map((style, i) => (
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
        <div className="inline-block px-4 py-1.5 rounded-full glass text-primary text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8 animate-float">
          The Future of Education
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
          Master Your Future with <br /><span className="bg-gradient-to-r from-teal-300 to-cyan-500 bg-clip-text text-transparent">Tiwari Tutorials</span>
        </h1>
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-10">
          <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-primary"></div>
          <p className="text-primary/80 font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] whitespace-nowrap">
            Directed by Manoj Sir & Sandeep Sir
          </p>
          <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-primary"></div>
        </div>
        <p className="text-base md:text-lg text-white/50 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed font-medium">
          Expert mentorship for Science, JEE, and NEET. Building strong foundations for a brighter tomorrow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
          <a href="#courses" className="w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 btn-primary shimmer-effect font-bold rounded-xl md:rounded-2xl text-sm md:text-base">
            Explore Courses
          </a>
          <a href="#about" className="w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 btn-secondary text-white font-bold rounded-xl md:rounded-2xl text-sm md:text-base">
            Learn More
          </a>
        </div>
      </div>

      {/* Hero Badges */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 md:gap-4 w-full justify-center px-6 max-w-4xl">
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
    </section>
  );
};

export default Hero;
