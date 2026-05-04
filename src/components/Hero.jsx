import React from 'react';
import heroBg from '../assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* Floating Elements (Background) */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <div className="inline-block px-4 py-1 rounded-full glass text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-float">
          Welcome to the Future of Education
        </div>
        <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Master Your Future with <br /><span className="text-gradient">Tiwari Tutorials</span>
        </h1>
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-blue-500"></div>
          <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px] whitespace-nowrap">
            Directed by Manoj Sir & Sandeep Sir
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-blue-500"></div>
        </div>
        <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Unleash your potential in Science, JEE, and NEET with personalized mentorship that transcends traditional boundaries.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a href="#courses" className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all transform hover:-translate-y-1 shadow-2xl hover:shadow-white/10">
            Explore Courses
          </a>
          <a href="#about" className="px-10 py-4 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/10">
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
            className="px-6 py-2 glass rounded-full text-white/60 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer border border-white/5 shadow-xl active:scale-95"
          >
            {badge}
          </a>
        ))}
      </div>
    </section>
  );
};

export default Hero;
