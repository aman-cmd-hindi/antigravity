import { Users, Target, FileText, Award, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-12 md:py-16 px-4 md:px-8 border-b border-zinc-800/80 bg-[#09090b]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
            <span>ABOUT // 03</span>
            <span>•</span>
            <span className="text-zinc-400">INSTITUTE ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
            Concept-Driven Foundational Pedagogy
          </h2>
        </div>

        {/* Dense Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Image & Director Specification */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative border border-zinc-800 rounded-md overflow-hidden bg-[#0d0e12]">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" 
                alt="Students analyzing problems" 
                className="w-full h-56 sm:h-64 object-cover filter grayscale contrast-125 brightness-90 hover:filter-none transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#0d0e12]/90 backdrop-blur-sm border border-zinc-800 px-3 py-2 rounded-sm">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">OPERATIONAL SPAN</div>
                  <div className="text-xs font-mono font-semibold text-zinc-200">10+ YEARS OF BENCHMARK RESULTS</div>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 border border-zinc-700/60 bg-zinc-800/60 px-1.5 py-0.5 rounded-xs">
                  POWAI
                </span>
              </div>
            </div>

            {/* Directors Card */}
            <div className="p-4 bg-[#0d0e12] border border-zinc-800 rounded-md flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                <ShieldCheck className="w-5 h-5 text-zinc-300" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  FOUNDERS & PRINCIPAL MENTORS
                </div>
                <div className="text-sm font-semibold text-zinc-100">
                  Manoj Sir & Sandeep Sir
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  Directing Mathematics, Physics & Applied Analytics
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Institutional Principles & 4-Pillar Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="mb-6">
              <p className="text-sm md:text-base text-zinc-300 font-normal leading-relaxed mb-4">
                At Tiwari Tutorials, education is engineered as an empirical discipline. Rather than superficial memorization, we instill deep fundamental comprehension across physics derivations, biological taxonomies, chemical equations, and calculus proofs.
              </p>
              <p className="text-xs md:text-sm text-zinc-400 font-normal leading-relaxed">
                Our classrooms foster an environment of continuous analytical inquiry, where every student's misconception is systematically diagnosed, broken down, and re-anchored with verified problem-solving speed.
              </p>
            </div>

            {/* 4 Architectural Pillars Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: Users,
                  code: "PIL_01",
                  title: "Direct Senior Faculty Mentorship",
                  desc: "Every batch is led by veteran educators who break down complex exam syllabi into digestible theorems."
                },
                {
                  icon: Target,
                  code: "PIL_02",
                  title: "Granular Doubt Diagnosis",
                  desc: "Individual 1-on-1 problem-solving slots ensuring zero analytical bottlenecks remain unresolved."
                },
                {
                  icon: FileText,
                  code: "PIL_03",
                  title: "Proctored Examination Cadence",
                  desc: "Weekly chapter tests and full-syllabus mock CBTs mirroring real testing conditions."
                },
                {
                  icon: Award,
                  code: "PIL_04",
                  title: "Documented Board & Entrance Ranks",
                  desc: "Consistent 90%+ merit board scores and competitive percentiles year over year since 2016."
                }
              ].map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div 
                    key={idx}
                    className="p-3.5 bg-[#0d0e12] border border-zinc-800 rounded-md hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-4 h-4 text-zinc-300" strokeWidth={1.5} />
                      <span className="text-[9px] font-mono text-zinc-600">{pillar.code}</span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-200 mb-1">
                      {pillar.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-relaxed">
                      {pillar.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
