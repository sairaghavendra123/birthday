import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Hand, X, ZoomIn, Sparkles } from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';

export default function FilmStrip() {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);
  const { filmStrip } = birthdayConfig;

  // Keyboard navigation for full 4K lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIdx === null) return;
      if (e.key === 'Escape') setActivePhotoIdx(null);
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx]);

  const handleNextPhoto = (e) => {
    if (e) e.stopPropagation();
    soundFx.playClick();
    setActivePhotoIdx((prev) => (prev + 1) % filmStrip.length);
  };

  const handlePrevPhoto = (e) => {
    if (e) e.stopPropagation();
    soundFx.playClick();
    setActivePhotoIdx((prev) => (prev - 1 + filmStrip.length) % filmStrip.length);
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed factor
    if (Math.abs(walk) > 6) {
      setHasDragged(true);
    }
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCardClick = (idx) => {
    if (hasDragged) return;
    soundFx.playClick();
    setActivePhotoIdx(idx);
  };

  const scroll = (direction) => {
    soundFx.playClick();
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 overflow-hidden relative z-10">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#C5A059] block mb-1">
            Physical Memory Strip
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#1E1B18]">
            The Living Film Reel
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#726860] mt-1">
            Drag, swipe, or hover over prints to straighten and read the secret notes. Click any print to expand in full 4K quality.
          </p>
        </div>

        {/* Scroll Nav Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white border border-[#C5A059]/30 text-[#1E1B18] shadow-sm hover:shadow-md transition-all active:scale-90 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white border border-[#C5A059]/30 text-[#1E1B18] shadow-sm hover:shadow-md transition-all active:scale-90 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Draggable Film Strip Reel */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex items-center gap-8 px-8 sm:px-16 py-8 overflow-x-auto scrollbar-none cursor-grab ${
          isDragging ? 'cursor-grabbing select-none' : ''
        }`}
        style={{ scrollSnapType: isDragging ? 'none' : 'x mandatory' }}
      >
        {filmStrip.map((item, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(idx)}
            className="shrink-0 w-72 sm:w-80 group transition-transform duration-500 hover:rotate-0 hover:scale-105 hover:z-20 relative select-none cursor-pointer"
            style={{ 
              transform: `rotate(${item.rotation})`,
              scrollSnapAlign: 'center'
            }}
          >
            {/* Washi Tape at top */}
            <div className="washi-tape" />

            {/* Polaroid Container */}
            <div className="bg-white p-3.5 pb-6 rounded-lg shadow-xl shadow-[#1E1B18]/10 border border-[#E8D5C4]/50 flex flex-col gap-3 transition-all duration-300 group-hover:shadow-2xl group-hover:border-[#C5A059]/40">
              
              {/* Photo */}
              <div className="aspect-4/5 w-full rounded overflow-hidden bg-[#FAF6F0] relative">
                <img
                  src={item.photo}
                  alt={item.note}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  style={{ objectPosition: item.objectPosition || 'center top' }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <ZoomIn size={10} className="text-[#C5A059]" /> 4K View
                </div>
              </div>

              {/* Handwritten note caption */}
              <div className="text-center pt-2">
                <p className="font-handwriting text-xl sm:text-2xl text-[#1E1B18] leading-tight group-hover:text-[#C4738B] transition-colors">
                  "{item.note}"
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <span className="text-[11px] font-mono text-[#726860]/70 uppercase tracking-widest inline-flex items-center gap-1.5">
          <Hand size={12} /> Drag or swipe horizontally to explore • Tap print to open 4K view
        </span>
      </div>

      {/* 4K Fullscreen Lightbox Modal */}
      {activePhotoIdx !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setActivePhotoIdx(null)}
        >
          <div 
            className="relative max-w-4xl w-full flex flex-col items-center bg-[#1E1B18]/95 border border-[#C5A059]/40 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActivePhotoIdx(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
              aria-label="Close full view"
            >
              <X size={20} />
            </button>

            {/* Nav Arrows */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-[#C5A059] text-white transition-all shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-[#C5A059] text-white transition-all shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight size={22} />
            </button>

            {/* 4K Ultra-HD Badge */}
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-[11px] font-mono tracking-widest uppercase border border-[#C5A059]/30">
                <Sparkles size={12} />
                4K Ultra-HD Master Print • {activePhotoIdx + 1} of {filmStrip.length}
              </span>
            </div>

            {/* Main High-Res Image Display */}
            <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/60 border border-white/10 p-1">
              <img
                src={filmStrip[activePhotoIdx].photo}
                alt={filmStrip[activePhotoIdx].note}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-2xl animate-fade-in"
              />
            </div>

            {/* Caption */}
            <div className="mt-4 text-center max-w-lg">
              <p className="font-handwriting text-2xl sm:text-3xl text-white leading-relaxed">
                "{filmStrip[activePhotoIdx].note}"
              </p>
              <span className="text-[10px] font-mono text-[#A89F91] block mt-1">
                G. Sivadhathri • Living Film Reel Archive
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
