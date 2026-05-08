import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-mesh pt-16 md:pt-32 pb-12 px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-24">
          <div className="col-span-1 md:col-span-2 text-center md:text-left">
            <div className="text-2xl md:text-3xl font-extrabold tracking-tighter text-white mb-6 md:mb-8 flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-slate-950 text-base font-black shadow-xl shadow-primary/20">T</div>
              TIWARI <span className="text-primary">TUTORIALS</span>
            </div>
            <p className="text-white/30 max-w-sm mx-auto md:mx-0 leading-relaxed mb-8 md:mb-10 text-base md:text-lg">
               Building strong foundations for future engineers, doctors, and scientists. Your journey to excellence starts here.
            </p>
            <div className="flex justify-center md:justify-start gap-4 md:gap-6">
              {['FB', 'IG', 'TW', 'LI'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl glass edu-card flex items-center justify-center text-[10px] font-bold text-white/40 hover:text-primary hover:border-primary/50 transition-all active:scale-95">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-8 md:mb-10">Navigation</h4>
            <ul className="space-y-4 md:space-y-5">
              {['Home', 'Courses', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-white/40 hover:text-primary transition-colors text-sm font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10 text-center md:text-left">
            <div>
               <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-6 md:mb-8">Reach Us</h4>
               <div className="space-y-6 md:space-y-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5">
                    <div className="w-6 h-6 text-primary flex-shrink-0">📍</div>
                    <div className="text-white/40 text-sm leading-relaxed">
                      <p className="mb-4">Pujari Ka Tabela, Tunga Village,<br />Powai, Mumbai 400072</p>
                      <div className="rounded-2xl overflow-hidden border border-white/5 glass h-32 md:h-24 w-full relative group">
                        <iframe 
                          title="Location Map"
                          src="https://maps.google.com/maps?q=19.119900,72.891421&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                          allowFullScreen="" 
                          loading="lazy"
                        ></iframe>
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5">
                    <div className="w-6 h-6 text-primary flex-shrink-0">📞</div>
                    <div className="text-white/40 text-sm font-bold space-y-1">
                      <p className="hover:text-primary transition-colors cursor-pointer">+91 877 956 0903</p>
                      <p className="hover:text-primary transition-colors cursor-pointer">+91 98331 87969</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5">
                    <div className="w-6 h-6 text-primary flex-shrink-0">✉️</div>
                    <p className="text-white/40 text-sm font-bold hover:text-primary cursor-pointer">info@tiwaritutorials.com</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-white/20 text-[10px] md:text-xs font-medium tracking-wider text-center md:text-left">
              © 2026 TIWARI TUTORIALS. CRAFTED BY PROFESSIONAL MENTORS.
            </p>
            <p className="text-white/10 text-[9px] md:text-[10px] font-medium tracking-[0.1em] text-center md:text-left">
              This website is created by <Link to="/about-developer" className="text-primary/40 hover:text-primary font-bold uppercase transition-colors">Aman Vishwakarma</Link>. For queries: <a href="tel:8928875553" className="hover:text-primary/60 transition-colors">8928875553</a> | <a href="mailto:websitebyaman@gmail.com" className="hover:text-primary/60 transition-colors">websitebyaman@gmail.com</a>
            </p>
          </div>
          <div className="flex gap-8">
             <a href="#" className="text-white/20 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Privacy</a>
             <a href="#" className="text-white/20 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Terms</a>
          </div>
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 md:w-12 md:h-12 btn-secondary rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-primary hover:text-slate-950 transition-all shadow-xl active:scale-95"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
