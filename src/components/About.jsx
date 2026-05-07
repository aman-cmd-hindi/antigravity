import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-16 md:py-32 px-4 md:px-12 bg-mesh relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/2 left-0 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
        <div className="flex-1 relative order-2 lg:order-1">
          <div className="relative z-10 rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" alt="Students learning" className="w-full h-[300px] md:h-auto object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
          </div>
          <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-32 h-32 md:w-48 md:h-48 glass rounded-[30px] md:rounded-[40px] flex flex-col items-center justify-center border border-white/10 shadow-2xl animate-float">
            <span className="text-3xl md:text-5xl font-black text-primary">10+</span>
            <span className="text-[9px] md:text-[10px] text-white/60 font-bold uppercase tracking-widest text-center px-4">Years of Success</span>
          </div>
        </div>

        <div className="flex-1 order-1 lg:order-2">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-4 md:mb-6 block text-center lg:text-left">Our Legacy</span>
          <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-6 leading-tight text-center lg:text-left">Empowering Students to <br /><span className="text-primary italic">Reach for the Stars</span></h2>

          <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12 p-4 md:p-6 glass rounded-2xl md:rounded-3xl border border-white/5">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 text-primary rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-lg shadow-primary/10">👨‍🏫</div>
            <div>
              <p className="text-primary font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] mb-0.5 md:mb-1">Founders & Directors</p>
              <p className="text-white text-base md:text-lg font-extrabold tracking-tight">Manoj Sir & Sandeep Sir</p>
            </div>
          </div>

          <p className="text-white/40 text-sm md:text-base leading-relaxed mb-8 md:mb-10 text-center lg:text-left">
            At Tiwari Tutorials, we believe in more than just passing exams. We build strong foundations through concept-driven learning and personalized mentorship.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12">
            {[
              { icon: "🎯", title: "Personalized Focus", desc: "Individual attention to every student." },
              { icon: "📖", title: "Modern Curriculum", desc: "Updated for the latest JEE/NEET patterns." },
              { icon: "🏆", title: "Proven Results", desc: "Top board and competitive ranks." },
              { icon: "🔬", title: "Concept Mastery", desc: "Deep understanding over rote learning." }
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="text-xl md:text-2xl">{feature.icon}</div>
                <div>
                  <h4 className="text-white font-bold text-xs md:text-sm mb-1">{feature.title}</h4>
                  <p className="text-white/40 text-[9px] md:text-[10px] leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
