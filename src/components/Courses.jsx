import React from 'react';
import { Link } from 'react-router-dom';

const courses = [
  {
    title: "School Section (1-10)",
    desc: "Building strong foundations with expert guidance for all school subjects.",
    tag: "Primary",
    color: "from-green-500 to-emerald-500",
    icon: "🎓"
  },
  {
    title: "College Section (11 & 12)",
    desc: "Specialized coaching for Science and Commerce streams to excel in boards.",
    tag: "Higher Sec",
    color: "from-blue-500 to-indigo-500",
    icon: "🧪"
  },
  {
    title: "Commerce Math",
    desc: "Mastering advanced mathematics tailored for commerce and professional tracks.",
    tag: "Specialized",
    color: "from-yellow-500 to-orange-500",
    icon: "📈"
  },
  {
    title: "JEE & NEET",
    desc: "Elite entrance prep for India's toughest engineering and medical exams.",
    tag: "Competitive",
    color: "from-purple-500 to-pink-500",
    icon: "🚀",
    popular: true
  },
  {
    title: "Other Subjects",
    desc: "Comprehensive support for a wide range of academic and skill-based subjects.",
    tag: "General",
    color: "from-gray-400 to-slate-500",
    icon: "📚"
  }
];

const Courses = () => {
  return (
    <section id="courses" className="py-32 px-6 md:px-12 bg-mesh relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-amber-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Excellence Guaranteed</span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Master Your <span className="text-amber-500">Future</span></h2>
          <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">Elite coaching for school, college, and competitive excellence. Your path to success starts here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <div key={idx} className="glass-card edu-card p-10 rounded-[40px] group relative overflow-hidden">
              {course.popular && (
                <div className="absolute top-6 right-6 bg-amber-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-lg shadow-amber-500/40">
                  Most Popular
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/20`}>
                {course.icon}
              </div>
              
              <span className="text-[10px] font-bold text-amber-400/60 uppercase tracking-[0.2em]">{course.tag}</span>
              <h3 className="text-2xl font-extrabold text-white mt-3 mb-4 group-hover:text-amber-400 transition-colors duration-300">{course.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-10 group-hover:text-white/60 transition-colors">{course.desc}</p>
              
              <Link to="/enroll" className="inline-flex items-center gap-3 btn-secondary px-6 py-3 rounded-xl text-white font-bold text-sm group/btn">
                <span className="group-hover/btn:mr-1 transition-all">Enroll Now</span>
                <div className="w-6 h-6 rounded-full glass flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all">
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
