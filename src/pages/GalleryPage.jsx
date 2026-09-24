import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Image as ImageIcon, Search, X, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

const CATEGORIES = ['All', 'Classroom', 'Events', 'Toppers', 'Activities', 'Other'];

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState(null);

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

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter(img => img.category?.toLowerCase() === activeCategory.toLowerCase());

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
      <main className="min-h-screen bg-[#09090b] pt-24 pb-16 px-4 md:px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
              <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>ARCHIVE // GALLERY</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100 mb-2">
              Visual Documentation Roster
            </h1>
            <p className="text-xs font-mono text-zinc-400 max-w-xl">
              Photographic records of classroom sessions, seminar events, academic celebrations, and merit awards.
            </p>
          </div>

          {/* Category Tabs (Dense Linear style) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-8 pb-3 border-b border-zinc-800/80">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setSelectedIdx(null);
                }}
                className={`px-3 py-1 rounded-sm text-xs font-mono transition-colors ${
                  activeCategory === category
                    ? 'bg-zinc-100 text-zinc-950 font-medium'
                    : 'bg-[#0d0e12] border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#0d0e12] border border-zinc-800 h-56 rounded-md animate-pulse p-3 space-y-3">
                  <div className="w-full h-36 bg-zinc-900 rounded-sm" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                  <div className="h-2 bg-zinc-800/60 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            /* Empty State */
            <div className="bg-[#0d0e12] border border-zinc-800 max-w-md mx-auto p-8 text-center rounded-md">
              <ImageIcon className="w-8 h-8 text-zinc-600 mx-auto mb-3" strokeWidth={1.5} />
              <h3 className="text-sm font-mono font-semibold text-zinc-200 mb-1">NO ARCHIVE RECORDS FOUND</h3>
              <p className="text-xs text-zinc-500 mb-4 font-mono">
                No image records exist for category "{activeCategory}".
              </p>
              <button
                onClick={() => setActiveCategory('All')}
                className="btn-secondary px-3 py-1.5 text-xs font-mono rounded-sm"
              >
                RESET FILTER
              </button>
            </div>
          ) : (
            /* Image Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredImages.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedIdx(idx)}
                  className="group relative cursor-pointer bg-[#0d0e12] border border-zinc-800 hover:border-zinc-600 rounded-md overflow-hidden transition-colors"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900 relative">
                    <img
                      src={img.url}
                      alt={img.title}
                      loading="lazy"
                      className="w-full h-full object-cover filter grayscale contrast-110 group-hover:filter-none transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-transparent opacity-60" />
                  </div>

                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded-xs border border-zinc-800">
                        {img.category}
                      </span>
                      {img.createdAt && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {img.createdAt.toDate 
                            ? img.createdAt.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
                            : new Date(img.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
                          }
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white" title={img.title}>
                      {img.title}
                    </h3>
                  </div>

                  <div className="absolute top-2 right-2 w-6 h-6 rounded-xs bg-[#09090b]/80 border border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Search className="w-3 h-3 text-zinc-300" strokeWidth={1.5} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox / Fullscreen Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b]/95 backdrop-blur-md p-4">
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-4 right-4 w-8 h-8 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-sm flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Close lightbox"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-sm flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <div className="relative max-w-4xl max-h-[75vh] w-full flex items-center justify-center">
            <img
              src={filteredImages[selectedIdx].url}
              alt={filteredImages[selectedIdx].title}
              className="max-w-full max-h-[75vh] object-contain rounded-sm border border-zinc-800 shadow-2xl"
            />
          </div>

          <div className="text-center mt-4 px-4 max-w-lg font-mono">
            <div className="inline-block px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] uppercase tracking-wider mb-1 rounded-xs">
              {filteredImages[selectedIdx].category}
            </div>
            <h2 className="text-zinc-100 text-sm font-semibold tracking-tight">
              {filteredImages[selectedIdx].title}
            </h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">
              IMAGE {selectedIdx + 1} OF {filteredImages.length}
            </p>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-sm flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      )}
      <Footer />
    </>
  );
};

export default GalleryPage;
