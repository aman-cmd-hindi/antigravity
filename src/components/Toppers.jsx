import React from 'react';

const toppers = [
  { name: "Aditya Verma", exam: "SSC 10th Board", percentage: "98.4%", year: "2023", photo: "👨‍🎓" },
  { name: "Priya Sharma", exam: "HSC 12th Science", percentage: "96.8%", year: "2023", photo: "👩‍🎓" },
  { name: "Rohan Gupta", exam: "JEE Advanced", percentage: "AIR 452", year: "2023", photo: "👨‍🎓" },
  { name: "Neha Singh", exam: "NEET UG", percentage: "685/720", year: "2023", photo: "👩‍🎓" },
  { name: "Kunal Patil", exam: "SSC 10th Board", percentage: "97.2%", year: "2023", photo: "👨‍🎓" },
  { name: "Riya Kapoor", exam: "HSC 12th Commerce", percentage: "95.5%", year: "2023", photo: "👩‍🎓" }
];

const Toppers = () => {
  return (
    <section id="toppers" className="py-24 px-6 md:px-12 relative overflow-hidden bg-mesh border-t border-white/5">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Wall of Excellence</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Our <span className="text-yellow-500">Hall of Fame</span></h2>
          <p className="text-white/40 mt-4 text-lg max-w-xl mx-auto">Celebrating the stellar achievements of our top performers.</p>
        </div>

        {/* CSS Scroll Snap Slider */}
        <div className="flex overflow-x-auto gap-8 pb-10 snap-x snap-mandatory no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
          {toppers.map((topper, idx) => (
            <div key={idx} className="snap-center shrink-0 w-72 glass-card p-8 rounded-[30px] border border-white/5 text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                {topper.photo}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{topper.name}</h3>
              <p className="text-white/40 text-sm mb-4">{topper.exam} ({topper.year})</p>
              <div className="inline-block px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <span className="text-yellow-400 font-extrabold text-lg">{topper.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Toppers;
