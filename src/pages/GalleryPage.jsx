import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CATEGORIES = ['All', 'Classroom', 'Events', 'Toppers', 'Activities', 'Other'];

const CATEGORY_COLORS = {
  Classroom: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  Events: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  Toppers: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  Activities: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  Other: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
};

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState(null);

  // Fetch images from Firestore
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const imgData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setImages(imgData);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Filtered images
  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter(img => img.category?.toLowerCase() === activeCategory.toLowerCase());

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, filteredImages]);

  const handleNext = () => {
    setSelectedIdx(prev => (prev === null || prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setSelectedIdx(prev => (prev === null || prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-mesh pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Our <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-white/40 max-w-xl mx-auto text-sm md:text-base font-medium">
              Take a visual journey through our academic environment, student activities, celebratory events, and shining toppers.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedIdx(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#f59e0b] text-slate-950 shadow-lg shadow-[#f59e0b]/20 scale-105 font-extrabold'
                    : 'glass border border-white/10 text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-card h-72 rounded-3xl border border-white/5 animate-pulse overflow-hidden">
                  <div className="w-full h-4/5 bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            /* Empty State */
            <div className="glass-card max-w-md mx-auto p-12 text-center rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="text-6xl mb-6 opacity-30">🖼️</div>
              <h3 className="text-xl font-bold text-white mb-2">No Images Found</h3>
              <p className="text-white/40 text-sm mb-6">
                We couldn't find any images in the "{activeCategory}" category.
              </p>
              <button
                onClick={() => setActiveCategory('All')}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Show All Images
              </button>
            </div>
          ) : (
            /* Image Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-700">
              {filteredImages.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedIdx(idx)}
                  className="group relative cursor-pointer glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1"
                >
                  {/* Image wrapper with fixed height & zoom */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                    <img
                      src={img.url}
                      alt={img.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Shadow / Tint Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>

                  {/* Image details */}
                  <div className="p-5 relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-wider ${CATEGORY_COLORS[img.category] || CATEGORY_COLORS.Other}`}>
                        {img.category}
                      </span>
                      {img.createdAt && (
                        <span className="text-[10px] text-white/30 font-semibold font-mono">
                          {img.createdAt.toDate 
                            ? img.createdAt.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
                            : new Date(img.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
                          }
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold truncate group-hover:text-amber-400 transition-colors text-sm md:text-base" title={img.title}>
                      {img.title}
                    </h3>
                  </div>

                  {/* Corner indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs">🔍</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox / Fullscreen Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
          {/* Close button top right */}
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-full flex items-center justify-center text-xl transition-all cursor-pointer z-50 active:scale-95"
            aria-label="Close lightbox"
          >
            ✕
          </button>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center text-xl transition-all cursor-pointer z-50 active:scale-95 hover:scale-105"
            aria-label="Previous image"
          >
            ‹
          </button>

          {/* Image Container */}
          <div className="relative max-w-5xl max-h-[75vh] w-full px-6 flex items-center justify-center animate-in zoom-in-95 duration-300">
            <img
              src={filteredImages[selectedIdx].url}
              alt={filteredImages[selectedIdx].title}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10 select-none"
            />
          </div>

          {/* Image metadata overlay bottom */}
          <div className="text-center mt-6 px-6 max-w-xl">
            <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
              {filteredImages[selectedIdx].category}
            </div>
            <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">
              {filteredImages[selectedIdx].title}
            </h2>
            {filteredImages[selectedIdx].createdAt && (
              <p className="text-white/40 text-xs mt-1 font-semibold font-mono">
                Uploaded: {filteredImages[selectedIdx].createdAt.toDate
                  ? filteredImages[selectedIdx].createdAt.toDate().toLocaleDateString('en-IN', { dateStyle: 'medium' })
                  : new Date(filteredImages[selectedIdx].createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                }
              </p>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center text-xl transition-all cursor-pointer z-50 active:scale-95 hover:scale-105"
            aria-label="Next image"
          >
            ›
          </button>

          {/* Page Indicator */}
          <div className="absolute bottom-6 text-white/30 text-xs font-mono font-bold">
            {selectedIdx + 1} / {filteredImages.length}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default GalleryPage;
