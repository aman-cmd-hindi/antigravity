import React from 'react';

const faculty = [
  {
    name: "Anjali Mam",
    subject: "Biology",
    specialization: "NEET Expert",
    icon: "🧬",
    color: "from-pink-500 to-rose-600"
  },
  {
    name: "Shiva Sir",
    subject: "Chemistry",
    specialization: "JEE & NEET",
    icon: "🧪",
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "Santosh Sir",
    subject: "Chemistry",
    specialization: "Organic & Inorganic",
    icon: "⚗️",
    color: "from-indigo-500 to-blue-600"
  },
  {
    name: "Manoj Sir",
    subject: "Mathematics",
    specialization: "JEE Specialist",
    icon: "📐",
    color: "from-orange-500 to-amber-600"
  },
  {
    name: "Sandeep Sir",
    subject: "Mathematics",
    specialization: "Advanced Calculus",
    icon: "📊",
    color: "from-yellow-500 to-orange-600"
  },
  {
    name: "Expert Faculty",
    subject: "Physics",
    specialization: "Conceptual Mastery",
    icon: "⚛️",
    color: "from-purple-500 to-indigo-600"
  }
];

const Faculty = () => {
  return (
    <section id="faculty" className="py-32 px-6 md:px-12 bg-[#020610] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">The Pillars of Excellence</span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Our Expert <span className="text-blue-500">Faculty</span></h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">
            Mentorship from the best in the industry. Specialized faculty for JEE, NEET, and Boards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((member, idx) => (
            <div key={idx} className="glass-card p-10 rounded-[40px] border border-white/5 group hover:scale-[1.02] transition-all duration-500 hover:border-blue-500/30">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-4xl mb-8 shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                {member.icon}
              </div>
              
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">{member.subject}</span>
                <h3 className="text-2xl font-extrabold text-white mt-2 mb-1 group-hover:text-blue-400 transition-colors">{member.name}</h3>
                <p className="text-white/30 text-sm font-medium">{member.specialization}</p>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xs">★</span>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Expert Faculty</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faculty;
