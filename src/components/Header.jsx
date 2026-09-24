import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '../context/ThemeContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.location.pathname !== '/') return;

    const sections = ['hero', 'courses', 'about', 'faculty', 'toppers', 'contact'];
    
    const handleScrollSection = () => {
      const scrollPosition = window.scrollY + 100;

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
    handleScrollSection();
    return () => window.removeEventListener('scroll', handleScrollSection);
  }, []);

  const navLinks = [
    { name: 'Courses', href: '/#courses', id: 'courses' },
    { name: 'Faculty Portal', href: '/educator', isRoute: true, badge: 'ACADEMIC' },
    { name: 'Toppers', href: '/#toppers', id: 'toppers' },
    { name: 'About', href: '/#about', id: 'about' },
    { name: 'Gallery', href: '/gallery', isRoute: true },
    { name: 'Mock Test', href: '/cbt', isRoute: true, badge: 'CBT' },
    { name: 'Contact', href: '/#contact', id: 'contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 border-b ${
        isScrolled || mobileMenuOpen 
          ? 'bg-[#09090b]/95 backdrop-blur-md border-zinc-800/90 py-2.5 shadow-sm' 
          : 'bg-[#09090b]/80 backdrop-blur-sm border-zinc-800/50 py-3'
      } px-4 md:px-8 flex justify-between items-center`}
    >
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center gap-2.5 text-zinc-100 hover:text-white transition-colors group">
        <div className="w-6 h-6 bg-zinc-900 border border-zinc-700/80 rounded-sm flex items-center justify-center text-zinc-200 text-xs font-mono font-bold group-hover:border-zinc-500 transition-colors">
          T
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono tracking-tight">
          <span className="font-semibold text-zinc-100">TIWARI</span>
          <span className="text-zinc-500 font-normal">TUTORIALS</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 rounded-sm ml-1 font-mono">
            ENGINE
          </span>
        </div>
      </Link>

      {/* Desktop Horizontal Navigation (Dense & Linear-style) */}
      <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
        {navLinks.map((link) => {
          const isActive = !link.isRoute && activeSection === link.id;
          const linkClass = `relative px-2.5 py-1 rounded-sm transition-colors duration-150 flex items-center gap-1.5 ${
            isActive 
              ? 'text-zinc-100 bg-zinc-800/80 font-medium' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`;
          
          return link.isRoute ? (
            <Link key={link.name} to={link.href} className={linkClass}>
              {link.name}
              {link.badge && (
                <span className="text-[9px] px-1 py-0.2 bg-zinc-800 text-zinc-300 border border-zinc-700/60 rounded-xs">
                  {link.badge}
                </span>
              )}
            </Link>
          ) : (
            <a key={link.name} href={link.href} className={linkClass}>
              {link.name}
            </a>
          );
        })}
      </nav>

      {/* Right Action Tools */}
      <div className="flex items-center gap-2.5">
        <ThemeToggle />
        <div className="relative group hidden md:block">
          <button className="btn-secondary px-3 py-1.5 rounded-sm text-xs font-mono flex items-center gap-1.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 text-zinc-200">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
            <span>Consult Mentors</span>
            <ChevronDown className="w-3 h-3 text-zinc-500 transition-transform group-hover:rotate-180" strokeWidth={1.5} />
          </button>
          
          <div className="absolute right-0 mt-1.5 w-52 bg-[#0d0e12] p-1 rounded-md border border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 shadow-2xl">
            <div className="px-2 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-800/60 mb-1">
              Direct Communication
            </div>
            <a 
              href="https://wa.me/918779560903" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-sm font-mono transition-colors"
            >
              <span>Manoj Sir (Director)</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" strokeWidth={1.5} />
            </a>
            <a 
              href="https://wa.me/919833187969" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-sm font-mono transition-colors"
            >
              <span>Sandeep Sir (Director)</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <Link 
          to="/enroll" 
          className="btn-primary px-3 py-1.5 rounded-sm text-xs font-mono font-medium"
        >
          Enroll Now
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-zinc-400 hover:text-zinc-100 p-1.5 rounded-sm border border-zinc-800 bg-zinc-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="w-4 h-4 text-zinc-300" strokeWidth={1.5} />
          ) : (
            <Menu className="w-4 h-4 text-zinc-300" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#09090b] border-b border-zinc-800 p-5 flex flex-col gap-3 md:hidden shadow-2xl animate-fade-in font-mono text-xs">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Navigation</div>
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link 
                key={link.name} 
                to={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-zinc-300 hover:text-zinc-100 flex items-center justify-between border-b border-zinc-800/40"
              >
                <span>{link.name}</span>
                {link.badge && <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded-xs text-zinc-400">{link.badge}</span>}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-zinc-300 hover:text-zinc-100 border-b border-zinc-800/40"
              >
                {link.name}
              </a>
            )
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800/40">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Theme Mode</span>
              <ThemeToggle />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Direct Communication</span>
            <div className="grid grid-cols-2 gap-2">
              <a 
                href="https://wa.me/918779560903" 
                className="btn-secondary py-2 text-center text-xs rounded-sm border border-zinc-800 text-zinc-200"
              >
                Manoj Sir
              </a>
              <a 
                href="https://wa.me/919833187969" 
                className="btn-secondary py-2 text-center text-xs rounded-sm border border-zinc-800 text-zinc-200"
              >
                Sandeep Sir
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
