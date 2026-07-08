import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import useTilt from '../hooks/useTilt';

const DEFAULT_TOPPERS = [
  {
    name: "Gitanjali Vishwakarma",
    exam: "SSC 10th Board",
    score: "91.20%",
    year: "2025",
    image: "/sample-profile.png"
  },
  {
    name: "Lekhraj Maurya",
    exam: "SSC 10th Board",
    score: "87.60%",
    year: "2025",
    image: "/lekhraj-maurya.jpeg"
  },
  {
    name: "Aman Vishwakarma",
    exam: "SSC 10th Board",
    score: "86.80%",
    year: "2025",
    image: "/aman-vishwakarma.jpg"
  },
  {
    name: "Aman Pal",
    exam: "SSC 10th Board",
    score: "85.20%",
    year: "2025",
    image: "/sample-profile.png"
  }
];

const TopperCard = ({ topper }) => {
  const { style, onMouseMove, onMouseLeave } = useTilt();

  return (
    <div 
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass-card edu-card tilt-card p-6 md:p-8 rounded-[30px] md:rounded-[40px] group"
    >
      <div className="relative mb-6 md:mb-8 aspect-square rounded-[25px] md:rounded-[35px] overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
        <img src={topper.image} alt={topper.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

        <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md border border-primary/30 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg font-mono-label">
          {topper.score}
        </div>
      </div>

      <div className="text-center">
        <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] font-mono-label">{topper.exam}</span>
        <h3 className="text-xl md:text-2xl font-extrabold text-white mt-2 mb-1 group-hover:text-primary transition-colors">{topper.name}</h3>
        <p className="text-white/30 text-xs md:text-sm font-medium">{topper.year} Batch</p>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm">🏆</div>
        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest font-mono-label">Merit Rank Holder</span>
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
    <section id="toppers" className="py-16 md:py-32 px-4 md:px-12 relative overflow-hidden bg-mesh">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block font-mono-label">Hall of Fame</span>
          <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-4 md:mb-6">Our Top <span className="text-primary">Achievers</span></h2>
          <p className="text-white/40 max-w-lg mx-auto text-base md:text-lg leading-relaxed font-medium">Celebrating the remarkable success of our students in JEE and Boards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {toppersList.map((topper, idx) => (
            <TopperCard key={topper.id || idx} topper={topper} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Toppers;
