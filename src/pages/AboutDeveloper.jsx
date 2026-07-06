import { Link } from 'react-router-dom';

const AboutDeveloper = () => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      
      <div className="max-w-4xl w-full z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-12 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
        </Link>

        <div className="glass p-8 md:p-16 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative group">
              <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-1">
                <div className="w-full h-full rounded-[1.4rem] bg-[#0a1224] flex items-center justify-center overflow-hidden">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-blue-400">AV</span>
                </div>
              </div>
              <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
                Aman <span className="text-primary">Vishwakarma</span>
              </h1>
              <p className="text-xl text-white/60 mb-8 font-medium">Full Stack Developer & UI/UX Enthusiast</p>
              
              <div className="space-y-6">
                <p className="text-lg text-white/40 leading-relaxed">
                  Passionate about building high-performance web applications with stunning user interfaces. Specializing in modern React ecosystems, Tailwind CSS, and scalable backend solutions.
                </p>
                
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <p className="text-primary font-bold text-lg mb-2">Developer Contact</p>
                  <p className="text-white/80 text-xl font-mono">this page is developed by websitebyaman@gmail.com</p>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-4">
                <a href="mailto:websitebyaman@gmail.com" className="px-8 py-4 bg-primary text-slate-950 font-bold rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-primary/20">
                  Hire Me
                </a>
                <a href="tel:8928875553" className="px-8 py-4 glass border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-colors">
                  Contact Now
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Experience', val: '3+ Years' },
            { label: 'Projects', val: '50+' },
            { label: 'Clients', val: '20+' },
            { label: 'Rating', val: '4.9/5' }
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-white/5 text-center hover:border-primary/30 transition-colors">
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-white text-xl font-black">{stat.val}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-20 text-white/20 text-sm font-medium">
        © 2026 Developed with ❤️ by Aman Vishwakarma
      </footer>
    </div>
  );
};

export default AboutDeveloper;
