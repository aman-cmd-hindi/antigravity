import React from 'react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-mesh pt-32 pb-12 px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-extrabold tracking-tighter text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-base shadow-xl shadow-amber-500/20">T</div>
              TIWARI <span className="text-amber-500">TUTORIALS</span>
            </div>
            <p className="text-white/30 max-w-sm leading-relaxed mb-10 text-lg">
              Pioneering elite education for the next generation of engineers, doctors, and scientists. Your success is our mission.
            </p>
            <div className="flex gap-6">
              {['FB', 'IG', 'TW', 'LI'].map((social) => (
                <a key={social} href="#" className="w-12 h-12 rounded-2xl glass edu-card flex items-center justify-center text-xs font-bold text-white/40 hover:text-amber-500 hover:border-amber-500/50 transition-all active:scale-95">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-10">Navigation</h4>
            <ul className="space-y-5">
              {['Home', 'Courses', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-white/40 hover:text-white transition-colors text-sm font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <div>
               <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Reach Us</h4>
               <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="w-6 h-6 text-amber-500 flex-shrink-0">📍</div>
                    <div className="text-white/40 text-sm leading-relaxed">
                      <p className="mb-3">Pujari Ka Tabela, Tunga Village,<br />Powai, Mumbai 400072</p>
                      <div className="rounded-2xl overflow-hidden border border-white/5 glass h-24 w-full relative group">
                        <iframe 
                          title="Location Map"
                          src="https://maps.google.com/maps?q=19.119900,72.891421&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
                          allowFullScreen="" 
                          loading="lazy"
                        ></iframe>
                        <div className="absolute inset-0 bg-amber-600/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-6 h-6 text-amber-500 flex-shrink-0">📞</div>
                    <div className="text-white/40 text-sm font-bold space-y-1">
                      <p className="hover:text-amber-400 transition-colors cursor-pointer">+91 877 956 0903</p>
                      <p className="hover:text-amber-400 transition-colors cursor-pointer">+91 98331 87969</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-6 h-6 text-amber-500 flex-shrink-0">✉️</div>
                    <p className="text-white/40 text-sm font-bold hover:text-amber-400 cursor-pointer">info@tiwaritutorials.com</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-8">
          <p className="text-white/20 text-xs font-medium">
            © 2026 Tiwari Tutorials. Built for Excellence.
          </p>
          <div className="flex gap-10 text-white/20 text-xs font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <button 
            onClick={scrollToTop}
            className="w-12 h-12 btn-secondary rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
