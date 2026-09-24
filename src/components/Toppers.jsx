import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Award, Trophy } from 'lucide-react';

const DEFAULT_TOPPERS = [
  {
    name: "Gitanjali Vishwakarma",
    exam: "SSC 10th Board",
    score: "91.20%",
    year: "2025",
    rank: "01",
    image: "/sample-profile.png"
  },
  {
    name: "Lekhraj Maurya",
    exam: "SSC 10th Board",
    score: "87.60%",
    year: "2025",
    rank: "02",
    image: "/lekhraj-maurya.jpeg"
  },
  {
    name: "Aman Vishwakarma",
    exam: "SSC 10th Board",
    score: "86.80%",
    year: "2025",
    rank: "03",
    image: "/sample-profile.png"
  },
  {
    name: "Aman Pal",
    exam: "SSC 10th Board",
    score: "85.20%",
    year: "2025",
    rank: "04",
    image: "/sample-profile.png"
  }
];

const TopperCard = ({ topper, index }) => {
  return (
    <div className="bg-[#0d0e12] border border-zinc-800 hover:border-zinc-700 p-4 rounded-md transition-colors flex flex-col justify-between group">
      <div>
        {/* Profile Image & Score Badge */}
        <div className="relative mb-3.5 aspect-[4/3] rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900">
          <img 
            src={topper.image} 
            alt={topper.name} 
            className="w-full h-full object-cover filter grayscale contrast-115 group-hover:filter-none transition-all duration-300" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-transparent opacity-60" />

          {/* Precision Score Badge */}
          <div className="absolute top-2 right-2 bg-[#09090b]/95 border border-zinc-700 text-zinc-100 text-xs font-mono font-semibold px-2 py-0.5 rounded-sm">
            {topper.score}
          </div>

          {/* Rank Indicator */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-[#09090b]/90 border border-zinc-800 px-2 py-0.5 rounded-xs text-[10px] font-mono text-zinc-300">
            <Trophy className="w-3 h-3 text-zinc-400" strokeWidth={1.5} />
            <span>RANK #{topper.rank || `0${index + 1}`}</span>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-0.5">
          {topper.exam} · BATCH {topper.year}
        </div>
        <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
          {topper.name}
        </h3>
      </div>

      {/* Footer Tag */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Award className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
          <span>MERIT CITATION</span>
        </div>
        <span className="text-zinc-500 font-semibold">{topper.score}</span>
      </div>
    </div>
  );
};

const Toppers = () => {
  const [toppersList, setToppersList] = useState([]);

  useEffect(() => {
    const fetchToppers = async () => {
      try {
        const q = query(collection(db, 'toppers'), orderBy('year', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setToppersList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setToppersList(DEFAULT_TOPPERS);
        }
      } catch (err) {
        console.error("Error fetching toppers:", err);
        setToppersList(DEFAULT_TOPPERS);
      }
    };
    fetchToppers();
  }, []);

  return (
    <section id="toppers" className="py-12 md:py-16 px-4 md:px-8 border-b border-zinc-800/80 bg-[#09090b]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
              <span>HALL_OF_FAME // 05</span>
              <span>•</span>
              <span className="text-zinc-400">EXAM SCOREBOARD</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Benchmark Board & Entrance Achievers
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-400 max-w-md">
            Verified candidate scores reflecting rigorous concept preparation and exam simulation drills.
          </p>
        </div>

        {/* Achiever Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {toppersList.map((topper, idx) => (
            <TopperCard key={topper.id || idx} topper={topper} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Toppers;
