import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#020617] pointer-events-none">
      {/* Golden Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-amber-500/15 to-yellow-600/0 blur-[80px] md:blur-[120px] animate-blob1"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-yellow-500/10 to-amber-600/0 blur-[80px] md:blur-[120px] animate-blob2"></div>

      {/* Blue Blobs */}
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-600/15 to-cyan-600/0 blur-[80px] md:blur-[120px] animate-blob3"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-indigo-600/15 to-blue-500/0 blur-[80px] md:blur-[120px] animate-blob4"></div>

      {/* Floating Outline SVGs - Physics (Orbits & Gravitational mechanism) */}
      <svg className="absolute top-[15%] right-[12%] w-20 h-20 md:w-28 md:h-28 text-amber-500 animate-physics" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="50" cy="50" r="10" />
        <ellipse cx="50" cy="50" rx="35" ry="14" transform="rotate(30 50 50)" />
        <ellipse cx="50" cy="50" rx="35" ry="14" transform="rotate(-30 50 50)" />
        <ellipse cx="50" cy="50" rx="35" ry="14" transform="rotate(90 50 50)" />
        <circle cx="20" cy="33" r="3" fill="currentColor" />
        <circle cx="80" cy="67" r="3" fill="currentColor" />
        <circle cx="50" cy="15" r="3" fill="currentColor" />
      </svg>

      {/* Floating Outline SVGs - Chemistry (Atom / Bohr Model) */}
      <svg className="absolute bottom-[20%] left-[8%] w-24 h-24 md:w-32 md:h-32 text-blue-500 animate-chemistry" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="50" cy="50" r="8" fill="currentColor" />
        <circle cx="50" cy="50" r="22" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="38" />
        <circle cx="50" cy="28" r="3.5" fill="currentColor" />
        <circle cx="12" cy="50" r="3.5" fill="currentColor" />
        <circle cx="77" cy="77" r="3.5" fill="currentColor" />
      </svg>

      {/* Floating Outline SVGs - Biology (DNA Double Helix) */}
      <svg className="absolute bottom-[28%] right-[18%] w-16 h-24 md:w-20 md:h-28 text-emerald-500 animate-biology" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M35,10 C50,10 50,90 65,90" />
        <path d="M65,10 C50,10 50,90 35,90" />
        <line x1="41" y1="25" x2="59" y2="25" />
        <line x1="47" y1="40" x2="53" y2="40" />
        <line x1="50" y1="50" x2="50" y2="50" />
        <line x1="47" y1="60" x2="53" y2="60" />
        <line x1="41" y1="75" x2="59" y2="75" />
        <circle cx="35" cy="10" r="2.5" fill="currentColor" />
        <circle cx="65" cy="10" r="2.5" fill="currentColor" />
        <circle cx="65" cy="90" r="2.5" fill="currentColor" />
        <circle cx="35" cy="90" r="2.5" fill="currentColor" />
      </svg>

      {/* Floating Outline SVGs - Mathematics (Integral & Calculus) */}
      <svg className="absolute top-[28%] left-[15%] w-20 h-20 md:w-24 md:h-24 text-amber-500 animate-math" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M40,25 C45,20 48,20 46,35 L40,65 C38,80 41,80 46,75" strokeWidth="2.2" />
        <text x="50" y="45" fontFamily="serif" fontSize="22" fill="currentColor" stroke="none" fontWeight="bold">f(x)</text>
        <text x="50" y="65" fontFamily="serif" fontSize="18" fill="currentColor" stroke="none" fontWeight="bold">dx</text>
        <circle cx="48" cy="22" r="2" fill="currentColor" />
        <circle cx="38" cy="78" r="2" fill="currentColor" />
      </svg>

      {/* Subtle tech grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
    </div>
  );
};

export default AnimatedBackground;
