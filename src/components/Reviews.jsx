import { Link } from 'react-router-dom';
import { Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';

const reviewData = [
  {
    name: "Santosh",
    standard: "12th Science",
    text: "Tiwari Tutorials transformed my approach to physics and chemistry. The conceptual derivations made solving complex board equations systematic.",
    rating: 5,
    tag: "PHYSICS & CHEMISTRY"
  },
  {
    name: "Gitanjali Vishwakarma",
    standard: "10th Std (91.20%)",
    text: "The personalized attention and weekly test series boosted my confidence immensely. I scored 91.20% in my SSC boards thanks to the dedicated faculty.",
    rating: 5,
    tag: "SSC 10TH BOARD"
  },
  {
    name: "Aman Pal",
    standard: "NEET Aspirant",
    text: "Shiva Sir's biology lectures are top-notch. The study material is exhaustive, covering NCERT nuances line-by-line. Highly recommended!",
    rating: 5,
    tag: "NEET MEDICAL"
  },
  {
    name: "Amit Singh",
    standard: "Commerce 12th",
    text: "Sandeep Sir's Accountancy and Economics lectures are clear and practical. The model answer sessions helped me secure full marks in practical papers.",
    rating: 5,
    tag: "COMMERCE SECTION"
  }
];

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-[#0d0e12] border border-zinc-800 hover:border-zinc-700 p-5 rounded-md flex flex-col justify-between transition-colors">
      <div>
        {/* Rating & Tag */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-zinc-800/60">
          <div className="flex items-center gap-1">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-zinc-200 fill-zinc-200" strokeWidth={1} />
            ))}
          </div>
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
            {review.tag}
          </span>
        </div>

        {/* Text */}
        <p className="text-xs md:text-sm text-zinc-300 font-normal leading-relaxed mb-6">
          "{review.text}"
        </p>
      </div>

      {/* Reviewer Details */}
      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xs bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-zinc-300">
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">
              {review.name}
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              {review.standard}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
          <CheckCircle2 className="w-3 h-3 text-emerald-500/80" strokeWidth={1.5} />
          <span>VERIFIED</span>
        </div>
      </div>
    </div>
  );
};

const Reviews = () => {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 border-b border-zinc-800/80 bg-[#09090b]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
              <span>TESTIMONIALS // 06</span>
              <span>•</span>
              <span className="text-zinc-400">STUDENT FEEDBACK LOGS</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Verified Candidate Testimonials
            </h2>
          </div>

          <Link 
            to="/review" 
            className="btn-secondary px-3.5 py-2 text-xs font-mono rounded-sm self-start md:self-auto flex items-center gap-2"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
            <span>Submit Feedback</span>
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {reviewData.map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
