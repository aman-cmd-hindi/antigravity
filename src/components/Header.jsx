import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Only track scroll targets on home page path
    if (window.location.pathname !== '/') return;

    const sections = ['hero', 'courses', 'about', 'faculty', 'toppers', 'contact'];
    
    const handleScrollSection = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header height

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSection);
    handleScrollSection(); // Initial invocation
    return () => window.removeEventListener('scroll', handleScrollSection);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#hero', id: 'hero' },
    { name: 'Courses', href: '/#courses', id: 'courses' },
    { name: 'About', href: '/#about', id: 'about' },
    { name: 'Faculty', href: '/#faculty', id: 'faculty' },
    { name: 'Toppers', href: '/#toppers', id: 'toppers' },
    { name: 'Contact', href: '/#contact', id: 'contact' },
    { name: 'Gallery', href: '/gallery', isRoute: true },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${(isScrolled || mobileMenuOpen) ? 'bg-slate-950/80 backdrop-blur-xl py-3 shadow-2xl' : 'py-4 md:py-6'} px-6 md:px-12 flex justify-between items-center`}>
      <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-950 text-sm font-black shadow-lg shadow-primary/20">T</div>
        TIWARI <span className="text-primary font-mono-label">TUTORIALS</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 font-mono-label">
        {navLinks.map((link) => {
          const isActive = !link.isRoute && activeSection === link.id;
          const linkClass = `relative py-1 hover:text-white transition-colors duration-300 ${isActive ? 'text-primary' : 'text-white/50'}`;
          
          return link.isRoute ? (
            <Link key={link.name} to={link.href} className={linkClass}>
              {link.name}
            </Link>
          ) : (
            <a key={link.name} href={link.href} className={linkClass}>
              {link.name}
              {isActive && (
                <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#f59e0b] animate-pulse" />
              )}
            </a>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative group hidden md:block">
          <button className="btn-primary shimmer-effect circuit-btn ripple-btn text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2">
            Chat Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-[#0a1329] p-2 rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-xl">
            <a href="https://wa.me/918779560903" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              Chat: Manoj Sir
            </a>
            <a href="https://wa.me/919833187969" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              Chat: Sandeep Sir
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-2xl p-8 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl h-[calc(100vh-70px)] overflow-y-auto">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link 
                key={link.name} 
                to={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold text-white/70 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold text-white/70 hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">WhatsApp Numbers</span>
            <a href="https://wa.me/918779560903" className="bg-primary hover:bg-primary-dark text-slate-950 p-4 rounded-xl text-center font-bold transition-colors">
              Chat: Manoj Sir
            </a>
            <a href="https://wa.me/919833187969" className="bg-primary hover:bg-primary-dark text-slate-950 p-4 rounded-xl text-center font-bold transition-colors">
              Chat: Sandeep Sir
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
