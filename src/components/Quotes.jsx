import React from 'react';
import { quotes } from './Reviews';

const Quotes = () => {
  return (
    <section className="py-20 px-6 md:px-12 bg-mesh relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto text-center">
        <span className="text-amber-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Words of Wisdom</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-16">Inspiring <span className="text-amber-500">Minds</span></h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quotes.map((quote, idx) => (
            <div key={idx} className="glass-card edu-card p-8 rounded-3xl border border-white/5 relative group transition-transform duration-300">
              <div className="text-4xl text-amber-500/20 absolute top-4 left-4 font-serif">"</div>
              <p className="text-white/70 italic mb-6 relative z-10 text-lg leading-relaxed pt-4">
                {quote.text}
              </p>
              <div className="flex items-center gap-4 justify-end">
                <div className="h-[1px] w-8 bg-amber-500/50"></div>
                <p className="text-white font-bold text-sm tracking-wide">{quote.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Quotes;
