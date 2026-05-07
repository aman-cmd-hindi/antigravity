import React from 'react';
import heroBg from '../assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden py-32 md:py-24 bg-golden-animate">
      {/* Animated Particles */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="particle animate-particle" 
          style={{ 
            width: `${Math.random() * 10 + 5}px`, 
            height: `${Math.random() * 10 + 5}px`, 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
          }}
        ></div>
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <div className="inline-block px-4 py-1 rounded-full glass text-amber-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-float">
          Welcome to the Future of Education
        </div>
        <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Master Your Future with <br /><span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent">Tiwari Tutorials</span>
        </h1>
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
          <p className="text-amber-400 font-bold uppercase tracking-[0.3em] text-[10px] whitespace-nowrap">
            Directed by Manoj Sir & Sandeep Sir
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>
        <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Unleash your potential in Science, JEE, and NEET with personalized mentorship that transcends traditional boundaries.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="#courses" className="px-10 py-4 btn-primary shimmer-effect font-bold rounded-2xl">
            Explore Courses
          </a>
          <a href="#about" className="px-10 py-4 btn-secondary text-white font-bold rounded-2xl">
            Learn More
          </a>
        </div>
      </div>

      {/* Hero Badges */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-wrap gap-4 md:gap-6 w-full justify-center px-6 max-w-4xl">
        {['NEET', 'JEE', '11th Science', '12th Science'].map((badge) => (
          <a 
            key={badge} 
            href="#courses" 
            className="px-6 py-2 glass rounded-full text-white/60 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer border border-white/5 shadow-xl active:scale-95"
          >
            {badge}
          </a>
        ))}
      </div>
    </section>
  );
};

export default Hero;
