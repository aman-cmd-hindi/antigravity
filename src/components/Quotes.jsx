import { Quote } from 'lucide-react';

const quotesList = [
  {
    text: "Education is not merely covering the syllabus; it is about building conceptual depth, analytical instinct, and unshakeable problem-solving confidence.",
    author: "Manoj Sir & Sandeep Sir",
    role: "Founders & Academic Directors"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    role: "Philosophical Principle"
  },
  {
    text: "The roots of education are bitter, but the fruit is sweet.",
    author: "Aristotle",
    role: "Classical Axiom"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    role: "Economic Axiom"
  },
  {
    text: "Education is not the learning of facts, but the training of the mind to think.",
    author: "Albert Einstein",
    role: "Scientific Axiom"
  }
];

const QuoteCard = ({ quote, index }) => {
  return (
    <div className="bg-[#0d0e12] border border-zinc-800 hover:border-zinc-700 p-5 rounded-md flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between text-zinc-500 mb-3 pb-2 border-b border-zinc-800/60">
          <Quote className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
          <span className="text-[9px] font-mono text-zinc-600">AXIOM_0{index + 1}</span>
        </div>

        <p className="text-xs md:text-sm text-zinc-300 font-normal leading-relaxed mb-6 italic">
          "{quote.text}"
        </p>
      </div>

      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono font-medium text-zinc-200">
            {quote.author}
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            {quote.role}
          </div>
        </div>
      </div>
    </div>
  );
};

const Quotes = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 border-b border-zinc-800/80 bg-[#09090b]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
            <span>FOUNDATIONS // 07</span>
            <span>•</span>
            <span className="text-zinc-400">PEDAGOGICAL AXIOMS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
            Guiding First Principles
          </h2>
        </div>

        {/* Dense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {quotesList.map((quote, idx) => (
            <QuoteCard key={idx} quote={quote} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Quotes;
