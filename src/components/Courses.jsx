import React from 'react';
import { Link } from 'react-router-dom';

const courses = [
  {
    title: "School Boards (Class 10-12)",
    desc: "Building solid foundations for State Boards with clear conceptual understanding.",
    tag: "School Education",
    color: "from-green-500 to-emerald-500",
    icon: "🏫"
  },
  {
    title: "NEET",
    desc: "Rigorous and targeted preparation for medical entrance exams with comprehensive support.",
    tag: "Medical Entrance",
    color: "from-purple-500 to-pink-500",
    icon: "🩺",
    popular: true
  },
  {
    title: "IIT JEE",
    desc: "Elite training program designed to help engineering aspirants crack JEE Main & Advanced.",
    tag: "Engineering Entrance",
    color: "from-blue-500 to-indigo-500",
    icon: "🚀"
  },
  {
    title: "Pre Foundation (Class 1-9)",
    desc: "Nurturing early analytical thinking, logic, and competitive readiness from standards 1 to 9.",
    tag: "Competitive Prep",
    color: "from-yellow-500 to-orange-500",
    icon: "🧬"
  }
];

const Courses = () => {
  return (
    <section id="courses" className="py-16 md:py-32 px-4 md:px-12 bg-mesh relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block">Excellence Guaranteed</span>
          <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-4 md:mb-6">Master Your <span className="text-primary">Future</span></h2>
          <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg leading-relaxed">Elite coaching for school boards, pre foundation, and competitive entrance exams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {courses.map((course, idx) => (
            <div key={idx} className="glass-card edu-card p-8 md:p-10 rounded-[30px] md:rounded-[40px] group relative overflow-hidden">
              {course.popular && (
                <div className="absolute top-6 right-6 bg-primary text-slate-950 text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-primary/20">
                  Most Popular
                </div>
              )}

              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl md:text-3xl mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/20`}>
                {course.icon}
              </div>

              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">{course.tag}</span>
              <h3 className="text-xl md:text-2xl font-extrabold text-white mt-2 md:mt-3 mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">{course.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 md:mb-10 group-hover:text-white/60 transition-colors">{course.desc}</p>

              <Link to="/enroll" className="inline-flex items-center gap-3 btn-secondary px-5 py-2.5 md:px-6 md:py-3 rounded-xl text-white font-bold text-sm group/btn">
                <span className="group-hover/btn:mr-1 transition-all">Enroll Now</span>
                <div className="w-6 h-6 rounded-full glass flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-slate-950 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
