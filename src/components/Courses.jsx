import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Stethoscope, 
  Compass, 
  Dna, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';

const courses = [
  {
    id: "COURSE_01",
    title: "School Boards (Class 10–12)",
    desc: "Rigorous syllabus alignment for Class 10, 11 & 12 — covering Maharashtra State Board, CBSE, and ICSE with weekly evaluation tests.",
    tag: "SECONDARY & HIGHER SEC",
    icon: GraduationCap,
    specs: ["Maths / Science / English", "Weekly Board Test Papers", "NCERT & State Texts"]
  },
  {
    id: "COURSE_02",
    title: "NEET-UG Medical Entrance",
    desc: "Targeted competitive training covering Biology, Physics, and Chemistry with rigorous NCERT line-by-line concept breakdown.",
    tag: "MEDICAL ENTRANCE",
    icon: Stethoscope,
    popular: true,
    specs: ["Biology Specialization", "Daily Practice Problems (DPP)", "Full-Length Mock CBTs"]
  },
  {
    id: "COURSE_03",
    title: "IIT JEE Main & Advanced",
    desc: "Elite problem-solving curriculum focused on calculus, mechanics, physical & organic chemistry with deep conceptual derivations.",
    tag: "ENGINEERING ENTRANCE",
    icon: Compass,
    specs: ["Advanced Problem Analysis", "Speed & Accuracy Drills", "Time-Engineered CBT"]
  },
  {
    id: "COURSE_04",
    title: "Pre-Foundation (Class 1–9)",
    desc: "Nurturing early analytical logic, mental aptitude, and fundamental science principles to build a rock-solid base before high school.",
    tag: "FOUNDATION ENGINE",
    icon: Dna,
    specs: ["Logic & Mental Ability", "Core Math Fundamentals", "Hands-on Science Labs"]
  },
  {
    id: "COURSE_05",
    title: "Commerce Stream",
    desc: "High-accuracy coaching in Bookkeeping & Accountancy, Economics, Organisation of Commerce (OCM), and Secretarial Practice (SP).",
    tag: "COMMERCE STREAM",
    icon: BarChart3,
    specs: ["Financial Accounting", "Macro & Micro Economics", "Board Model Answers"]
  }
];

const Courses = () => {
  return (
    <section id="courses" className="py-12 md:py-16 px-4 md:px-8 border-b border-zinc-800/80 bg-[#09090b]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
              <span>CATALOG // 02</span>
              <span>•</span>
              <span className="text-zinc-400">CURRICULAR MODULES</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Structured Academic Tracks
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-400 max-w-md">
            Engineered syllabi combining conceptual clarity, regular proctored assessments, and small-batch mentor guidance.
          </p>
        </div>

        {/* Dense Grid of Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <div 
                key={course.id}
                className="bg-[#0d0e12] border border-zinc-800 hover:border-zinc-700 p-5 rounded-md flex flex-col justify-between transition-colors group"
              >
                <div>
                  {/* Top Bar with Icon & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800/70">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:border-zinc-700 transition-colors">
                        <Icon className="w-4 h-4 text-zinc-300" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
                        {course.id}
                      </span>
                    </div>

                    {course.popular ? (
                      <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-[10px] font-mono font-medium text-zinc-200 rounded-sm">
                        MOST POPULAR
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-600 uppercase">
                        ENROLLING
                      </span>
                    )}
                  </div>

                  {/* Title & Tag */}
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                    {course.tag}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {course.desc}
                  </p>

                  {/* Curricular Specs */}
                  <div className="space-y-1.5 pt-3 border-t border-zinc-800/50 mb-5">
                    {course.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                        <CheckCircle2 className="w-3 h-3 text-zinc-500 shrink-0" strokeWidth={1.5} />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500">FORMAT: HYBRID + CBT</span>
                  <Link 
                    to="/enroll"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white group/btn"
                  >
                    <span>Enroll Track</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Quick-Enroll Consultation Tile */}
          <div className="bg-zinc-900/40 border border-dashed border-zinc-800 hover:border-zinc-700 p-5 rounded-md flex flex-col justify-between text-zinc-400">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                CUSTOM EVALUATION
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">
                Need Guidance on Track Selection?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Consult directly with our directors to chart an individualized roadmap based on past board scores and target rank timelines.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/60">
              <a 
                href="https://wa.me/918779560903" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary w-full py-2 text-xs font-mono rounded-sm"
              >
                Schedule Diagnostic Session
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
