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
    { name: 'Home', href: '#hero' },
    { name: 'Courses', href: '#courses' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-3' : 'py-6'} px-6 md:px-12 flex justify-between items-center border-b border-white/5`}>
      <Link to="/" className="text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">T</div>
        TIWARI <span className="text-blue-500 underline decoration-2 underline-offset-4">TUTORIALS</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
        {navLinks.map((link) => (
          <a key={link.name} href={link.href} className="hover:text-blue-400 transition-colors">
            {link.name}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <a 
          href="https://wa.me/918779560903" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          Chat Now
        </a>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-white mb-1.5 transition-all"></div>
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full glass p-8 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white/70 hover:text-white"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="https://wa.me/918779560903" 
            className="bg-blue-600 text-white p-4 rounded-xl text-center font-bold"
          >
            Chat Now
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
