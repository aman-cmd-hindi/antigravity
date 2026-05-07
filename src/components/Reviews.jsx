import React from 'react';
import { Link } from 'react-router-dom';

const reviewData = [
  {
    name: "Santosh",
    standard: "12th Science",
    text: "Tiwari Tutorials transformed my approach to physics and chemistry. The conceptual clarity I gained here helped me crack JEE Mains with an excellent percentile.",
    rating: 5
  },
  {
    name: "Gitanjali vishwakarma",
    standard: "10th Std",
    text: "The personal attention and weekly test series boosted my confidence immensely. I scored 95% in my boards thanks to the dedicated faculty.",
    rating: 5
  },
  {
    name: "Amit singh",
    standard: "NEET Aspirant",
    text: "Sandeep Sir's biology lectures are top-notch. The study material is exhaustive and covers all NCERT nuances perfectly. Highly recommended!",
    rating: 5
  }
];

const Reviews = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-mesh relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Student Success</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">What Our <span className="text-blue-500">Achievers</span> Say</h2>
          </div>
          <Link to="/review" className="px-6 py-3 btn-secondary text-blue-400 font-bold rounded-xl transition-all text-sm uppercase tracking-widest whitespace-nowrap">
            Write a Review
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewData.map((review, idx) => (
            <div key={idx} className="glass-card edu-card p-8 rounded-3xl border border-white/5 relative">
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/70 mb-8 leading-relaxed text-sm">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{review.name}</h4>
                  <p className="text-blue-400 text-xs">{review.standard}</p>
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

