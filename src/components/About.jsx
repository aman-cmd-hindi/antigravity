import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
        <div className="flex-1 relative">
          <div className="glass-card p-2 rounded-[50px] relative z-10">
            <div className="aspect-square bg-mesh rounded-[45px] flex items-center justify-center p-12 overflow-hidden relative group">
              <div className="text-[120px] filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700">🏛️</div>
              {/* Floating Badges on Image Area */}
              <div className="absolute top-10 right-10 glass px-6 py-4 rounded-3xl animate-float shadow-2xl">
                <span className="text-3xl font-bold text-white block">20+</span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Years Legacy</span>
              </div>
              <div className="absolute bottom-10 left-10 glass px-6 py-4 rounded-3xl animate-float delay-700 shadow-2xl">
                <span className="text-3xl font-bold text-white block">10k+</span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Students Mentored</span>
              </div>
            </div>
          </div>
          {/* Decorative Ring */}
          <div className="absolute -inset-4 border border-blue-500/10 rounded-[60px] -z-0"></div>
        </div>

        <div className="flex-1">
          <span className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Our Legacy</span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">Empowering Students to <br /><span className="text-blue-500 italic">Reach for the Stars</span></h2>
          
          <div className="flex items-center gap-6 mb-12 p-6 glass rounded-3xl border border-blue-500/20">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">👨‍🏫</div>
            <div>
               <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Founders & Directors</p>
               <p className="text-white text-lg font-extrabold tracking-tight">Manoj Sir & Sandeep Sir</p>
            </div>
          </div>

          <div className="space-y-6 text-white/50 leading-relaxed text-lg font-medium">
            <p>
              Founded with a vision to redefine academic excellence, Tiwari Tutorials has been at the forefront of science education for over two decades. We believe that every student has a unique trajectory, and our goal is to provide the gravitational pull towards success.
            </p>
            <p>
              Our methodology combines traditional rigorous testing with modern interactive learning, ensuring students are not just exam-ready, but future-ready. From boards to competitive entrances like JEE and NEET, we are your trusted partners in excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <p className="text-2xl font-extrabold text-white mb-1">98%</p>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Success Rate</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white mb-1">50+</p>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Expert Faculty</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
