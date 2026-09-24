import { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { sendConfirmationEmail, sendSMSNotification, getWhatsAppLink } from '../utils/notifications';
import { ArrowLeft, Star, CheckCircle2, MessageSquare, Send } from 'lucide-react';

const SubmitReviewPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    standard: '',
    review: '',
    rating: 5
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'reviews'), {
        ...formData,
        submittedAt: serverTimestamp()
      });

      await sendConfirmationEmail(formData, 'review');
      if (formData.phone) {
        await sendSMSNotification(formData.phone, `Hi ${formData.name}, thank you for your review on Tiwari Tutorials!`);
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('System transmission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#09090b]">
        <div className="bg-[#0d0e12] border border-zinc-800 p-8 rounded-md text-center max-w-md w-full">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-sm flex items-center justify-center mx-auto mb-5 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
            RECORD_TRANSMITTED
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Feedback Logged Successfully</h2>
          <p className="text-zinc-400 mb-6 text-xs font-mono leading-relaxed">
            Thank you, <span className="text-zinc-200 font-semibold">{formData.name}</span>. Your assessment has been stored in the candidate review registry.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center font-mono">
            <a 
              href={getWhatsAppLink(formData.name, 'review')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary w-full sm:w-auto px-4 py-2 text-xs rounded-sm border border-zinc-800 text-zinc-200 flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />
              <span>Direct WhatsApp</span>
            </a>
            <Link to="/" className="btn-primary w-full sm:w-auto px-4 py-2 text-xs rounded-sm">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] py-16 px-4 md:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 font-mono text-xs mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>RETURN TO REPOSITORY</span>
          </Link>
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
            SUBMISSION PROTOCOL // REVIEWS
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100 mb-2">
            Submit Candidate Experience Log
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Share documented impressions on faculty instruction, study material, and test series accuracy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0d0e12] border border-zinc-800 p-6 rounded-md space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Candidate Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Standard / Track</label>
              <input
                type="text"
                name="standard"
                required
                placeholder="e.g. 12th Science / NEET"
                value={formData.standard}
                onChange={handleChange}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Phone (Optional)</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Rating Metric</label>
            <div className="flex gap-1.5 bg-zinc-900/60 p-2 rounded-sm border border-zinc-800 w-fit">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-4 h-4 ${star <= formData.rating ? 'text-zinc-200 fill-zinc-200' : 'text-zinc-600'}`} 
                    strokeWidth={1.25} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Evaluation Notes</label>
            <textarea
              name="review"
              required
              placeholder="Detail your learning outcome, conceptual clarity gained, and test performance..."
              rows="4"
              value={formData.review}
              onChange={handleChange}
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-sm px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 outline-none transition-colors resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-xs font-mono rounded-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{loading ? 'TRANSMITTING...' : 'DISPATCH REVIEW'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReviewPage;
