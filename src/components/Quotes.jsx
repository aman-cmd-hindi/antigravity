import useTilt from '../hooks/useTilt';

const quotesList = [
  {
    text: "Education is not just about learning syllabus, it's about building conceptual depth and confidence.",
    author: "Manoj Sir & Sandeep Sir (Directors)"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "The roots of education are bitter, but the fruit is sweet.",
    author: "Aristotle"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    text: "education is not the learning of facts, but the training of the mind to think",
    author: "Albert Einstein"
  }
];

const QuoteCard = ({ quote }) => {
  const { style, onMouseMove, onMouseLeave } = useTilt();

  return (
    <div 
      style={style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass-card edu-card tilt-card p-8 md:p-10 rounded-[30px] md:rounded-[40px] relative group transition-all duration-300"
    >
      <div className="text-4xl md:text-5xl text-primary/20 absolute top-4 left-6 font-serif">"</div>
      <p className="text-white/60 italic mb-8 relative z-10 text-base md:text-xl leading-relaxed pt-6">
        {quote.text}
      </p>
      <div className="flex items-center gap-4 justify-end">
        <div className="h-[1px] w-6 md:w-8 bg-primary/40"></div>
        <p className="text-white font-bold text-xs md:text-sm tracking-wide font-mono-label">{quote.author}</p>
      </div>
    </div>
  );
};

const Quotes = () => {
  return (
    <section className="py-16 md:py-32 px-4 md:px-12 bg-mesh relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto text-center">
        <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block font-mono-label">Words of Wisdom</span>
        <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-12 md:mb-20">Inspiring <span className="text-primary">Minds</span></h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {quotesList.map((quote, idx) => (
            <QuoteCard key={idx} quote={quote} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Quotes;
