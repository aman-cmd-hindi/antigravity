import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Star, UserCheck, BookOpen, ShieldCheck } from 'lucide-react';

const DEFAULT_FACULTY = [
  {
    name: "Anjali Mam",
    subject: "Biology",
    code: "BIO_01",
    specialization: "Botany & Zoology Expert",
    image: "/sample-profile.png"
  },
  {
    name: "Shiva Sir",
    subject: "Biology",
    code: "BIO_02",
    specialization: "NEET Medical Specialist",
    image: "/sample-profile.png"
  },
  {
    name: "Santosh Sir",
    subject: "Chemistry",
    code: "CHEM_01",
    specialization: "Organic & Physical Chemistry",
    image: "/sample-profile.png"
  },
  {
    name: "Manoj Sir",
    subject: "Mathematics",
    code: "MATH_DIR",
    specialization: "Calculus & Engineering Analytics",
    image: "/sample-profile.png"
  },
  {
    name: "Sandeep Sir",
    subject: "Mathematics",
    code: "MATH_DIR2",
    specialization: "Advanced Algebra & Commerce Math",
    image: "/sample-profile.png"
  },
  {
    name: "Expert Faculty",
    subject: "Physics",
    code: "PHYS_01",
    specialization: "Mechanics & Electrodynamics",
    image: "/sample-profile.png"
  }
];

const FacultyCard = ({ member }) => {
  return (
    <div className="bg-[#0d0e12] border border-zinc-800 hover:border-zinc-700 p-4 rounded-md transition-colors flex flex-col justify-between group">
      <div>
        {/* Profile Image & Status Bar */}
        <div className="relative mb-3.5 aspect-[4/3] rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900">
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover filter grayscale contrast-115 group-hover:filter-none transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#09090b]/90 border border-zinc-700 text-[10px] font-mono text-zinc-300 rounded-xs">
            {member.code || "FAC_01"}
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#09090b]/80 px-1.5 py-0.5 rounded-xs border border-zinc-800">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 text-zinc-300 fill-zinc-300" strokeWidth={1} />
            ))}
          </div>
        </div>

        {/* Member Info */}
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
          {member.subject}
        </div>
        <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
          {member.name}
        </h3>
        <p className="text-xs text-zinc-400 font-mono mt-0.5">
          {member.specialization}
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <UserCheck className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
          <span>500+ MENTORED</span>
        </div>
        <span className="text-zinc-600">SENIOR FACULTY</span>
      </div>
    </div>
  );
};

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const q = query(collection(db, 'faculty'), orderBy('name', 'asc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setFacultyList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } else {
          setFacultyList(DEFAULT_FACULTY);
        }
      } catch (err) {
        console.error("Error fetching faculty:", err);
        setFacultyList(DEFAULT_FACULTY);
      }
    };
    fetchFaculty();
  }, []);

  return (
    <section id="faculty" className="py-12 md:py-16 px-4 md:px-8 border-b border-zinc-800/80 bg-[#09090b]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
              <span>FACULTY // 04</span>
              <span>•</span>
              <span className="text-zinc-400">PEDAGOGICAL DIRECTORY</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Senior Academic Mentors
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-400 max-w-md">
            Dedicated discipline leads with decades of cumulative classroom experience training candidates for board merit and competitive entrance cutoffs.
          </p>
        </div>

        {/* Dense Roster Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {facultyList.map((member, idx) => (
            <FacultyCard key={member.id || idx} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faculty;
