import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#hero' },
    { name: 'Courses', href: '/#courses' },
    { name: 'About', href: '/#about' },
    { name: 'Faculty', href: '/#faculty' },
    { name: 'Toppers', href: '/#toppers' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${(isScrolled || mobileMenuOpen) ? 'bg-[#050b18]/95 backdrop-blur-xl py-3 border-b border-white/10 shadow-2xl' : 'py-6 border-b border-transparent'} px-6 md:px-12 flex justify-between items-center`}>
      <Link to="/" className="text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">T</div>
        TIWARI <span className="text-blue-500 underline decoration-2 underline-offset-4">TUTORIALS</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
        {navLinks.map((link) => (
          link.isRoute ? (
            <Link key={link.name} to={link.href} className="hover:text-white transition-colors">
              {link.name}
            </Link>
          ) : (
            <a key={link.name} href={link.href} className="hover:text-white transition-colors">
              {link.name}
            </a>
          )
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <div className="relative group hidden md:block">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2">
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
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#050b18]/95 backdrop-blur-2xl border-b border-white/10 p-8 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl h-[calc(100vh-70px)] overflow-y-auto">
          {navLinks.map((link) => (
            link.isRoute ? (
              <Link 
                key={link.name} 
                to={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold text-white/70 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">WhatsApp Numbers</span>
            <a href="https://wa.me/918779560903" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl text-center font-bold transition-colors">
              Chat: Manoj Sir
            </a>
            <a href="https://wa.me/919833187969" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl text-center font-bold transition-colors">
              Chat: Sandeep Sir
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
