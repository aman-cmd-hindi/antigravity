import React from 'react';
import { Link } from 'react-router-dom';

const reviewData = [
  {
    name: "Santosh",
    standard: "12th Science",
    text: "Tiwari Tutorials transformed my approach to physics and chemistry.",
    rating: 4.8
  },
  {
    name: "Gitanjali vishwakarma",
    standard: "10th Std",
    text: "The personal attention and weekly test series boosted my confidence immensely. I scored 91.20% in my boards thanks to the dedicated faculty.",
    rating: 4.9
  },
  {
    name: "Aman pal",
    standard: "NEET Aspirant",
    text: "Shiva Sir's biology lectures are top-notch. The study material is exhaustive and covers all NCERT nuances perfectly. Highly recommended!",
    rating: 4.8
  },
  {
    name: "Amit singh",
    standard: "Commerce 12th",
    text: "Sandeep Sir's Account and economics lectures are top-notch. The study material is exhaustive and covers all perfectly. Highly recommended!",
    rating: 4.5
  }
];

const Reviews = () => {
  return (
    <section className="py-16 md:py-32 px-4 md:px-12 bg-mesh relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6 text-center md:text-left">
          <div>
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] mb-3 block">Student Success</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">What Our <span className="text-primary">Achievers</span> Say</h2>
          </div>
          <Link to="/review" className="w-full md:w-auto px-8 py-3.5 btn-secondary text-primary font-bold rounded-xl transition-all text-xs uppercase tracking-widest whitespace-nowrap border border-primary/20">
            Write a Review
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviewData.map((review, idx) => (
            <div key={idx} className="glass-card edu-card p-8 md:p-10 rounded-[30px] md:rounded-[40px] group flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(Math.floor(review.rating))].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/60 italic leading-relaxed text-base md:text-lg mb-8 group-hover:text-white/80 transition-colors">
                  "{review.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm md:text-base">{review.name}</h4>
                  <p className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest">{review.standard}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews; export const quotes = [
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

