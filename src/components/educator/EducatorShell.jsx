import { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Users, 
  CheckSquare, 
  Calendar, 
  Archive, 
  Settings, 
  Search, 
  Plus, 
  Download, 
  Share2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Menu, 
  X,
  Compass,
  GraduationCap,
  BookmarkCheck,
  Printer
} from 'lucide-react';

const NAVIGATION_SECTIONS = [
  {
    group: 'Curriculum & Instruction',
    items: [
      { id: 'lesson-plans', label: 'Lesson Architecture', icon: BookOpen, count: '14 Active' },
      { id: 'syllabi', label: 'Course Syllabi', icon: FileText, count: '6 Tracks' },
      { id: 'competencies', label: 'Core Competencies', icon: BookmarkCheck, count: '94%' },
    ]
  },
  {
    group: 'Cohort & Assessment',
    items: [
      { id: 'gradebook', label: 'Gradebook & Rubrics', icon: CheckSquare, count: 'Term 1' },
      { id: 'roster', label: 'Student Directory', icon: Users, count: '124 Enrolled' },
      { id: 'schedule', label: 'Lecture Timetable', icon: Calendar, count: 'Today: 4' },
    ]
  },
  {
    group: 'Department Records',
    items: [
      { id: 'item-bank', label: 'Examination Item Bank', icon: Compass, count: '1,420 Qs' },
      { id: 'archives', label: 'Faculty Repository', icon: Archive, count: 'Archived' },
      { id: 'settings', label: 'Platform Standards', icon: Settings },
    ]
  }
];

export const EducatorShell = () => {
  const [activeItem, setActiveItem] = useState('lesson-plans');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] flex font-sans-ui antialiased">
      {/* ─────────────────────────────────────────────────────────────
          1. GROUNDED SCHOLASTIC SIDEBAR
          ───────────────────────────────────────────────────────────── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#ffffff] border-r border-[#e7e5e4] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Institutional Masthead */}
        <div>
          <div className="p-6 border-b border-[#e7e5e4]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-sm bg-[#0f172a] text-[#fafaf9] flex items-center justify-center font-serif-heading font-bold text-base shadow-xs">
                T
              </div>
              <div>
                <h1 className="font-serif-heading font-bold text-sm tracking-tight text-[#0f172a] leading-none">
                  Tiwari Academic Guild
                </h1>
                <p className="font-mono-scholastic text-[10px] text-[#78716c] uppercase tracking-wider mt-1">
                  Faculty Portal // Est. 2016
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#f5f5f4] flex items-center justify-between font-mono-scholastic text-[11px] text-[#78716c]">
              <span>TERM: FALL 2026</span>
              <span className="inline-flex items-center gap-1.5 text-[#0f172a] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f172a]" />
                ACTIVE
              </span>
            </div>
          </div>

          {/* Academic Navigation Groupings */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)]">
            {NAVIGATION_SECTIONS.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <h2 className="px-3 text-[10px] font-mono-scholastic font-semibold uppercase tracking-widest text-[#a8a29e] mb-2">
                  {section.group}
                </h2>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveItem(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-colors text-left ${
                        isActive
                          ? 'bg-[#0f172a] text-[#fafaf9]'
                          : 'text-[#44403c] hover:bg-[#f5f5f4] hover:text-[#1c1917]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#fafaf9]' : 'text-[#78716c]'}`} strokeWidth={1.5} />
                        <span>{item.label}</span>
                      </div>
                      {item.count && (
                        <span className={`font-mono-scholastic text-[10px] ${isActive ? 'text-[#e2e8f0]' : 'text-[#a8a29e]'}`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Faculty Lead Footer Badge */}
        <div className="p-4 border-t border-[#e7e5e4] bg-[#fafaf9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#e7e5e4] border border-[#d6d3d1] flex items-center justify-center font-mono-scholastic text-xs font-semibold text-[#1c1917]">
                MT
              </div>
              <div>
                <p className="text-xs font-medium text-[#1c1917] leading-tight">Prof. Manoj Tiwari</p>
                <p className="font-mono-scholastic text-[10px] text-[#78716c]">Dept. of Mathematics</p>
              </div>
            </div>
            <span className="font-mono-scholastic text-[9px] px-1.5 py-0.5 rounded-xs bg-[#f5f5f4] border border-[#e7e5e4] text-[#78716c]">
              DIR
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-[#0f172a]/20 backdrop-blur-xs md:hidden"
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. CORE WORKSPACE & CONTENT AREA
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Scholastic Masthead / Top Navigation */}
        <header className="sticky top-0 z-20 bg-[#ffffff]/95 backdrop-blur-sm border-b border-[#e7e5e4] px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1.5 rounded-sm border border-[#e7e5e4] text-[#44403c] hover:bg-[#f5f5f4]"
              aria-label="Toggle Navigation"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Editorial Breadcrumbs */}
            <div className="flex items-center gap-2 font-mono-scholastic text-xs text-[#78716c]">
              <span className="hover:text-[#1c1917] cursor-pointer">Curriculum</span>
              <span>/</span>
              <span className="hover:text-[#1c1917] cursor-pointer">Higher Secondary Mathematics</span>
              <span>/</span>
              <span className="text-[#0f172a] font-medium">Unit IV: Differential Calculus</span>
            </div>
          </div>

          {/* Quick-Jump Index and Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#f5f5f4] border border-[#e7e5e4] rounded-sm text-xs font-mono-scholastic text-[#78716c] w-64">
              <Search className="w-3.5 h-3.5 text-[#a8a29e]" strokeWidth={1.5} />
              <span>Search syllabi, theorems...</span>
              <kbd className="ml-auto text-[10px] bg-[#ffffff] border border-[#e7e5e4] px-1 rounded-xs">⌘K</kbd>
            </div>

            <button className="btn-scholastic-outline text-xs">
              <Printer className="w-3.5 h-3.5 text-[#78716c]" strokeWidth={1.5} />
              <span className="hidden sm:inline">Print Handout</span>
            </button>

            <button className="btn-scholastic text-xs">
              <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>New Lesson Plan</span>
            </button>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────────
            3. THE LESSON PLAN GRID (Editorial Column Architecture)
            ───────────────────────────────────────────────────────────── */}
        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">
          {/* Document Masthead / Lesson Title */}
          <div className="border-b border-[#e7e5e4] pb-6 mb-8">
            <div className="flex flex-wrap items-center gap-3 font-mono-scholastic text-xs text-[#78716c] mb-3">
              <span className="px-2 py-0.5 bg-[#f5f5f4] border border-[#e7e5e4] rounded-xs font-medium text-[#0f172a]">
                COURSE CODE: MATH-HSC-401
              </span>
              <span>WEEK 08</span>
              <span>•</span>
              <span>LECTURE 24 OF 48</span>
              <span>•</span>
              <span className="text-[#047857] font-medium">STATUS: VERIFIED BY DEPT</span>
            </div>

            <h1 className="font-serif-heading font-bold text-3xl sm:text-4xl text-[#0f172a] tracking-tight leading-tight">
              Optimization, Tangent Planes & Critical Point Analysis
            </h1>
            <p className="mt-3 text-sm md:text-base text-[#44403c] leading-relaxed max-w-3xl">
              A structured analytical lesson module guiding Class 12 candidates through Fermat’s interior extremum theorem, second-derivative convexity tests, and engineering rate-of-change applications for JEE & Board excellence.
            </p>
          </div>

          {/* Two-Column Textbook / Lesson Plan Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Primary Teaching Architecture (8 Columns) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Section 1: Pedagogical Prerequisite & Abstract */}
              <section className="editorial-sheet p-6">
                <div className="flex items-center justify-between border-b border-[#e7e5e4] pb-3 mb-4">
                  <h2 className="font-serif-heading font-bold text-lg text-[#0f172a]">
                    1.0 Foundational Objectives & Bloom’s Taxonomy
                  </h2>
                  <span className="font-mono-scholastic text-[11px] text-[#78716c]">
                    ALLOCATED TIME: 15 MIN
                  </span>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-[#44403c] leading-relaxed">
                  <p>
                    Prior to this session, candidates must demonstrate fluent recall of standard differential derivatives (polynomial, trigonometric, logarithmic) and the chain rule formulation. The goal of this lecture is the transition from purely mechanical differentiation to geometric optimization analysis.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-[#fafaf9] border border-[#e7e5e4] rounded-sm">
                      <span className="font-mono-scholastic text-[10px] text-[#78716c] uppercase block mb-1">Level 1: Recall</span>
                      <p className="font-medium text-[#1c1917] text-xs">First-order necessary condition (f'(x) = 0)</p>
                    </div>
                    <div className="p-3 bg-[#fafaf9] border border-[#e7e5e4] rounded-sm">
                      <span className="font-mono-scholastic text-[10px] text-[#78716c] uppercase block mb-1">Level 2: Analysis</span>
                      <p className="font-medium text-[#1c1917] text-xs">Concavity determination via f''(x) sign test</p>
                    </div>
                    <div className="p-3 bg-[#fafaf9] border border-[#e7e5e4] rounded-sm">
                      <span className="font-mono-scholastic text-[10px] text-[#78716c] uppercase block mb-1">Level 3: Application</span>
                      <p className="font-medium text-[#1c1917] text-xs">Constrained volume & cost minimization models</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Lesson Phases & Direct Instruction Plan */}
              <section className="editorial-sheet p-6">
                <div className="flex items-center justify-between border-b border-[#e7e5e4] pb-3 mb-6">
                  <h2 className="font-serif-heading font-bold text-lg text-[#0f172a]">
                    2.0 Chronological Lecture Flow
                  </h2>
                  <span className="font-mono-scholastic text-[11px] text-[#78716c]">
                    TOTAL DURATION: 90 MIN
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Phase 1 */}
                  <div className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-sm bg-[#0f172a] text-[#ffffff] font-mono-scholastic text-xs font-semibold flex items-center justify-center shrink-0">
                      01
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-serif-heading font-bold text-sm text-[#0f172a]">
                          Concept Formulation: Geometry of Extrema
                        </h3>
                        <span className="font-mono-scholastic text-[11px] text-[#78716c]">00–25 MIN</span>
                      </div>
                      <p className="text-xs text-[#44403c] leading-relaxed mb-3">
                        Illustrate on the chalkboard the geometric distinction between stationary points (slope zero) and non-differentiable extrema (cusps and corners). Formally derive Rolle’s theorem and Lagrange’s Mean Value Theorem (LMVT).
                      </p>
                      <div className="p-3 bg-[#f5f5f4] border-l-2 border-[#0f172a] text-xs font-mono-scholastic text-[#1c1917]">
                        Key Theorem: If f has a local extremum at c, and f'(c) exists, then f'(c) = 0.
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#e7e5e4]" />

                  {/* Phase 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-sm bg-[#e7e5e4] text-[#1c1917] font-mono-scholastic text-xs font-semibold flex items-center justify-center shrink-0">
                      02
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-serif-heading font-bold text-sm text-[#0f172a]">
                          Guided Problem Derivation: The Open-Top Cylinder
                        </h3>
                        <span className="font-mono-scholastic text-[11px] text-[#78716c]">25–55 MIN</span>
                      </div>
                      <p className="text-xs text-[#44403c] leading-relaxed mb-2">
                        Work through the classic Maharashtra Board 4-mark optimization problem: Minimizing surface area for an open cylindrical tank of fixed volume V = 1000 cm³.
                      </p>
                      <ul className="list-disc list-inside text-xs text-[#57534e] space-y-1 font-mono-scholastic">
                        <li>Formulate single-variable objective function: S(r) = πr² + (2V / r)</li>
                        <li>Equate derivative S'(r) = 2πr - (2V / r²) = 0 to establish r = h</li>
                        <li>Verify minimum via second derivative S''(r) = 2π + (4V / r³) &gt; 0</li>
                      </ul>
                    </div>
                  </div>

                  <hr className="border-[#e7e5e4]" />

                  {/* Phase 3 */}
                  <div className="flex gap-4 items-start">
                    <div className="w-7 h-7 rounded-sm bg-[#e7e5e4] text-[#1c1917] font-mono-scholastic text-xs font-semibold flex items-center justify-center shrink-0">
                      03
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-serif-heading font-bold text-sm text-[#0f172a]">
                          Independent Diagnostic Drills & Board Pitfall Review
                        </h3>
                        <span className="font-mono-scholastic text-[11px] text-[#78716c]">55–90 MIN</span>
                      </div>
                      <p className="text-xs text-[#44403c] leading-relaxed">
                        Students solve 3 timed questions from the 2024–25 State Board bank. Walk the room to identify step-writing errors and enforce presentation rigor.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Assessment Alignment Table */}
              <section className="editorial-sheet p-6">
                <div className="flex items-center justify-between border-b border-[#e7e5e4] pb-3 mb-4">
                  <h2 className="font-serif-heading font-bold text-lg text-[#0f172a]">
                    3.0 Examination Alignment & Mark Weightage
                  </h2>
                  <span className="font-mono-scholastic text-[11px] text-[#78716c]">
                    HSC BOARD WEIGHTAGE: 9 MARKS
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono-scholastic border-collapse">
                    <thead>
                      <tr className="border-b border-[#e7e5e4] text-[#78716c]">
                        <th className="py-2 pr-4 font-semibold uppercase">Question Type</th>
                        <th className="py-2 px-4 font-semibold uppercase">Sub-Topic</th>
                        <th className="py-2 px-4 font-semibold uppercase">Marks</th>
                        <th className="py-2 pl-4 font-semibold uppercase">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f5f5f4] text-[#1c1917]">
                      <tr>
                        <td className="py-2.5 pr-4 font-medium">Section A (MCQ)</td>
                        <td className="py-2.5 px-4 text-[#44403c]">Slope of normal at given parametric coordinate</td>
                        <td className="py-2.5 px-4">2 Marks</td>
                        <td className="py-2.5 pl-4 text-[#047857]">Verified DPP #14</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 font-medium">Section B (Short)</td>
                        <td className="py-2.5 px-4 text-[#44403c]">Approximations using differential increments</td>
                        <td className="py-2.5 px-4">2 Marks</td>
                        <td className="py-2.5 pl-4 text-[#047857]">Verified DPP #15</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 font-medium">Section D (Long)</td>
                        <td className="py-2.5 px-4 text-[#44403c]">Wire-cutting maximization (rectangle vs circle)</td>
                        <td className="py-2.5 px-4">4 Marks</td>
                        <td className="py-2.5 pl-4 text-[#047857]">Mandatory HW</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Marginalia & Educator Notes (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pedagogical Commentary Block */}
              <div className="p-5 bg-[#ffffff] border border-[#e7e5e4] rounded-sm">
                <div className="flex items-center gap-2 text-[#0f172a] mb-2 font-mono-scholastic text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-[#b45309]" strokeWidth={1.5} />
                  <span>CRITICAL COMMON MISCONCEPTIONS</span>
                </div>
                <div className="space-y-3 text-xs text-[#57534e] leading-relaxed">
                  <p>
                    <strong className="text-[#1c1917] font-semibold">1. Confusing Stationary with Extrema:</strong> Students frequently conclude that f'(c) = 0 implies a max or min, overlooking inflection saddle points such as f(x) = x³ at x = 0.
                  </p>
                  <p>
                    <strong className="text-[#1c1917] font-semibold">2. Neglecting Boundary Points:</strong> Remind candidates that on a closed interval [a, b], global absolute extrema can occur at endpoints without f'(x) being zero.
                  </p>
                </div>
              </div>

              {/* Lesson Metadata Notebook Card */}
              <div className="p-5 bg-[#fafaf9] border border-[#e7e5e4] rounded-sm font-mono-scholastic text-xs space-y-3">
                <div className="text-[10px] uppercase tracking-wider text-[#a8a29e] pb-1 border-b border-[#e7e5e4]">
                  CURRICULUM SPECIFICATIONS
                </div>
                <div className="flex justify-between text-[#44403c]">
                  <span>TARGET BATCH:</span>
                  <span className="font-semibold text-[#1c1917]">Class 12 Sci (A & B)</span>
                </div>
                <div className="flex justify-between text-[#44403c]">
                  <span>TEXTBOOK REF:</span>
                  <span className="font-semibold text-[#1c1917]">NCERT Ch. 6 / State Ch. 2</span>
                </div>
                <div className="flex justify-between text-[#44403c]">
                  <span>PRACTICE SHEET:</span>
                  <span className="font-semibold text-[#1c1917]">DPP-CALC-08 (18 Qs)</span>
                </div>
                <div className="flex justify-between text-[#44403c]">
                  <span>LAST REVISED:</span>
                  <span className="font-semibold text-[#1c1917]">22 Sept 2026</span>
                </div>
              </div>

              {/* Action Toolkit */}
              <div className="p-5 bg-[#ffffff] border border-[#e7e5e4] rounded-sm space-y-2.5">
                <div className="text-[10px] font-mono-scholastic uppercase tracking-wider text-[#a8a29e] mb-1">
                  FACULTY UTILITIES
                </div>
                <button className="btn-scholastic-outline w-full text-xs justify-between">
                  <span>Export Printable PDF Handout</span>
                  <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                <button className="btn-scholastic-outline w-full text-xs justify-between">
                  <span>Push DPP to Student Portal</span>
                  <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                <button className="btn-scholastic w-full text-xs justify-between">
                  <span>Record Attendance & Notes</span>
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EducatorShell;
