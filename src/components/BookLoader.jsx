
const BookLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center text-white">
      <div className="text-center space-y-10 flex flex-col items-center">
        {/* Flipping 3D Book Animation */}
        <div className="book-wrapper scale-90 md:scale-110">
          <div className="book-cover-left"></div>
          <div className="book-cover-right"></div>
          <div className="book-pages-container">
            <div className="book-page-flip"></div>
            <div className="book-page-flip"></div>
            <div className="book-page-flip"></div>
            <div className="book-page-flip"></div>
            <div className="book-page-flip"></div>
          </div>
        </div>

        {/* Loading Text & Branding */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-wider bg-gradient-to-r from-amber-400 to-blue-500 bg-clip-text text-transparent uppercase font-serif">
            Tiwari Tutorials
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-blue-300 uppercase">
              Nurturing Excellence Since 2016
            </p>
          </div>
        </div>

        {/* Subtle loading line progress indicator */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-amber-500 to-blue-500 rounded-full animate-loaderLine"></div>
        </div>
      </div>
    </div>
  );
};

export default BookLoader;
