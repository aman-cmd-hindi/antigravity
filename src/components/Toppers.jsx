import React from 'react';

const toppers = [
  {
    name: "Gitanjali Vishwakarma",
    exam: "SSC 10th Board",
    score: "91.20%",
    year: "2025",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Lekhraj Maurya",
    exam: "SSC 10th Board",
    score: "87.60%",
    year: "2025",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Aman Vishwakarma",
    exam: "SSC 10th Board",
    score: "86.80%",
    year: "2025",
    image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Aman Pal",
    exam: "SSC 10th Board",
    score: "85.20%",
    year: "2025",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400"
  }
];

const Toppers = () => {
  return (
    <section id="toppers" className="py-16 md:py-32 px-4 md:px-12 relative overflow-hidden bg-mesh">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block">Hall of Fame</span>
          <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-4 md:mb-6">Our Top <span className="text-primary">Achievers</span></h2>
          <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg leading-relaxed">Celebrating the remarkable success of our students in JEE and Boards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {toppers.map((topper, idx) => (
            <div key={idx} className="glass-card edu-card p-6 md:p-8 rounded-[30px] md:rounded-[40px] group">
              <div className="relative mb-6 md:mb-8 aspect-square rounded-[25px] md:rounded-[35px] overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
                <img src={topper.image} alt={topper.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                <div className="absolute top-4 right-4 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  {topper.score}
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">{topper.exam}</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white mt-2 mb-1 group-hover:text-primary transition-colors">{topper.name}</h3>
                <p className="text-white/30 text-xs md:text-sm font-medium">{topper.year} Batch</p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-4">
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm">🏆</div>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Merit Rank Holder</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Toppers;
