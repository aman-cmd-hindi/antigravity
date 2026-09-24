import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUp, ArrowUpRight, Terminal } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#09090b] border-t border-zinc-800/90 pt-12 pb-8 px-4 md:px-8 text-zinc-400">
      <div className="max-w-6xl mx-auto">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand & Overview */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 bg-zinc-900 border border-zinc-700 rounded-sm flex items-center justify-center text-zinc-200 text-xs font-mono font-bold">
                  T
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono tracking-tight text-zinc-100">
                  <span className="font-semibold">TIWARI</span>
                  <span className="text-zinc-500 font-normal">TUTORIALS</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mb-4">
                Premier academic coaching institute providing rigorous foundational training for JEE Main & Advanced, NEET-UG, School Boards, and Commerce.
              </p>

              {/* Operational Status Badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#0d0e12] border border-zinc-800 rounded-sm text-[10px] font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ALL ACADEMIC SERVICES OPERATIONAL</span>
              </div>
            </div>

            {/* Social channels (monospaced buttons) */}
            <div className="flex items-center gap-1.5 mt-6">
              {['FB', 'IG', 'TW', 'LI'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  aria-label={`Visit our ${social} channel`}
                  className="px-2 py-1 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Curricula Links */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3">
              Curricular Modules
            </h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li>
                <a href="#courses" className="hover:text-zinc-200 transition-colors flex items-center justify-between">
                  <span>NEET-UG Medical</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-zinc-200 transition-colors flex items-center justify-between">
                  <span>IIT JEE (Main & Adv)</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-zinc-200 transition-colors flex items-center justify-between">
                  <span>HSC & CBSE Boards (10–12)</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-zinc-200 transition-colors flex items-center justify-between">
                  <span>Pre-Foundation (Class 1–9)</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-zinc-200 transition-colors flex items-center justify-between">
                  <span>Commerce Section</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600" strokeWidth={1.5} />
                </a>
              </li>
              <li>
                <Link to="/cbt" className="text-zinc-300 hover:text-white transition-colors flex items-center justify-between">
                  <span>Mock CBT Test Portal</span>
                  <Terminal className="w-3 h-3 text-zinc-500" strokeWidth={1.5} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Campus Info */}
          <div className="md:col-span-5">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3">
              Campus Location & Dispatch
            </h4>
            
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div className="text-zinc-400">
                  Pujari Ka Tabela, Tunga Village, Powai, Mumbai 400072
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" strokeWidth={1.5} />
                <div className="flex items-center gap-3 text-zinc-300">
                  <a href="tel:+918779560903" className="hover:text-white transition-colors">+91 8779560903</a>
                  <span className="text-zinc-700">|</span>
                  <a href="tel:+919833187969" className="hover:text-white transition-colors">+91 9833187969</a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" strokeWidth={1.5} />
                <a href="mailto:info@tiwaritutorials.com" className="text-zinc-300 hover:text-white transition-colors">
                  info@tiwaritutorials.com
                </a>
              </div>

              {/* Minimal Dark Map Frame */}
              <div className="rounded-sm overflow-hidden border border-zinc-800 bg-[#0d0e12] h-24 w-full relative mt-2">
                <iframe 
                  title="Location Map"
                  src="https://maps.google.com/maps?q=19.119900,72.891421&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(90%)' }} 
                  allowFullScreen="" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <div>
            © 2026 TIWARI TUTORIALS. ALL RIGHTS RESERVED
            <Link to="/portal-vault-88" className="text-zinc-700 hover:text-zinc-500 ml-1" aria-label="Portal">.</Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-600">SYS_BUILD: 2.6.4</span>
            <button 
              onClick={scrollToTop}
              className="w-7 h-7 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-sm flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
