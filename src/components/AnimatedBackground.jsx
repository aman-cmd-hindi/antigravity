import { useEffect, useRef, useState } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showSpotlight, setShowSpotlight] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let nodes = [];
    const maxDistance = 120;
    
    // Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
      initNodes();
    };
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    const initNodes = () => {
      const isMobile = window.innerWidth < 768;
      const count = prefersReducedMotion ? 0 : (isMobile ? 25 : 75);
      
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 1
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const animate = () => {
      if (prefersReducedMotion) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections first
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12;
            // Draw circuit-like connecting lines (constellations)
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`; // Amber bond
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Draw node
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)'; // Subtle blue node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Optional tiny glowing center for node
        ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Mouse reactive pull
        if (mouseRef.current.x !== null) {
          const mdx = mouseRef.current.x - node.x;
          const mdy = mouseRef.current.y - node.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < 150) {
            const force = (150 - mdist) / 150;
            node.vx += (mdx / mdist) * force * 0.02;
            node.vy += (mdy / mdist) * force * 0.02;
          }
        }

        // Move node
        node.x += node.vx;
        node.y += node.vy;

        // Friction/damping to prevent nodes from going too fast
        node.vx *= 0.98;
        node.vy *= 0.98;

        // Bounce/Wrap borders
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setMousePos({ x: e.clientX, y: e.clientY });
      setShowSpotlight(true);
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
      setShowSpotlight(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#020617] pointer-events-none">
      {/* Dynamic Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 block w-full h-full opacity-60" />

      {/* Mouse Spotlight Glow */}
      {showSpotlight && (
        <div 
          className="hidden md:block absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `radial-gradient(400px at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.04), rgba(245, 158, 11, 0.02), transparent 80%)`
          }}
        />
      )}

      {/* Golden Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-amber-500/15 to-yellow-600/0 blur-[80px] md:blur-[120px] animate-blob1 z-1" />
      <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-yellow-500/10 to-amber-600/0 blur-[80px] md:blur-[120px] animate-blob2 z-1" />

      {/* Blue Blobs */}
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-600/15 to-cyan-600/0 blur-[80px] md:blur-[120px] animate-blob3 z-1" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-indigo-600/15 to-blue-500/0 blur-[80px] md:blur-[120px] animate-blob4 z-1" />

      {/* Floating Outline SVGs - Layered on top of blobs & canvas */}
      <div className="absolute inset-0 z-2 pointer-events-none">
        {/* Physics (Orbits & Gravitational mechanism) */}
        <svg className="absolute top-[15%] right-[12%] w-20 h-20 md:w-28 md:h-28 text-amber-500 animate-physics" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="50" cy="50" r="10" />
          <ellipse cx="50" cy="50" rx="35" ry="14" transform="rotate(30 50 50)" />
          <ellipse cx="50" cy="50" rx="35" ry="14" transform="rotate(-30 50 50)" />
          <ellipse cx="50" cy="50" rx="35" ry="14" transform="rotate(90 50 50)" />
          <circle cx="20" cy="33" r="3" fill="currentColor" />
          <circle cx="80" cy="67" r="3" fill="currentColor" />
          <circle cx="50" cy="15" r="3" fill="currentColor" />
        </svg>

        {/* Chemistry (Atom / Bohr Model) */}
        <svg className="absolute bottom-[20%] left-[8%] w-24 h-24 md:w-32 md:h-32 text-blue-500 animate-chemistry" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="50" cy="50" r="8" fill="currentColor" />
          <circle cx="50" cy="50" r="22" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="28" r="3.5" fill="currentColor" />
          <circle cx="12" cy="50" r="3.5" fill="currentColor" />
          <circle cx="77" cy="77" r="3.5" fill="currentColor" />
        </svg>

        {/* Biology (DNA Double Helix) */}
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

        {/* Mathematics (Integral & Calculus) */}
        <svg className="absolute top-[28%] left-[15%] w-20 h-20 md:w-24 md:h-24 text-amber-500 animate-math" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M40,25 C45,20 48,20 46,35 L40,65 C38,80 41,80 46,75" strokeWidth="2.2" />
          <text x="50" y="45" fontFamily="serif" fontSize="22" fill="currentColor" stroke="none" fontWeight="bold">f(x)</text>
          <text x="50" y="65" fontFamily="serif" fontSize="18" fill="currentColor" stroke="none" fontWeight="bold">dx</text>
          <circle cx="48" cy="22" r="2" fill="currentColor" />
          <circle cx="38" cy="78" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay z-3" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    </div>
  );
};

export default AnimatedBackground;
