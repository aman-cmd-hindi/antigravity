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
    image: "/images/physics.jpg"
  }
];

const Faculty = () => {
  return (
    <section id="faculty" className="py-16 md:py-32 px-4 md:px-12 bg-mesh relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block">Expert Mentors</span>
          <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-4 md:mb-6">The Pillars of <span className="text-primary">Excellence</span></h2>
          <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
            Specialized faculty for JEE, NEET, and Boards with years of proven success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {facultyMembers.map((member, idx) => (
            <div key={idx} className="glass-card edu-card p-6 md:p-8 rounded-[30px] md:rounded-[40px] group transition-all duration-500 hover:bg-white/[0.02]">
              <div className="relative mb-6 md:mb-8 aspect-square rounded-[25px] md:rounded-[35px] overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute bottom-6 left-6 flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-xs">★</span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{member.subject}</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-white mt-2 mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-white/30 text-xs md:text-sm font-medium">{member.specialization}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border border-slate-950 bg-slate-800 flex items-center justify-center text-[8px] text-white/50">👤</div>
                   ))}
                </div>
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">500+ Students Mentored</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faculty;
