import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Box, 
  Grid3X3, 
  Sparkles, 
  Heart, 
  Shuffle, 
  Tag, 
  Camera, 
  Layers
} from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';
import InfiniteGallery from '@/components/ui/3d-gallery-photography';

export default function PhotoWall() {
  const { gallery } = birthdayConfig;
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'grid'
  const [selectedTag, setSelectedTag] = useState('All');
  const [displayGallery, setDisplayGallery] = useState(gallery);
  const [likes, setLikes] = useState({
    'gal-1': 48,
    'gal-2': 56,
    'gal-3': 39,
    'gal-4': 62,
    'gal-5': 77,
    'gal-6': 53,
    'gal-7': 44,
    'gal-8': 69,
    'gal-9': 41,
    'gal-10': 58,
    'gal-11': 64,
    'gal-12': 71,
    'gal-13': 83,
    'gal-14': 59,
    'gal-15': 66,
    'gal-16': 74,
    'gal-17': 68,
    'gal-18': 92
  });

  // Sync displayGallery when gallery updates
  useEffect(() => {
    setDisplayGallery(gallery);
  }, [gallery]);

  // Extract unique categories
  const categories = useMemo(() => {
    const tags = new Set(gallery.map(item => item.tag));
    return ['All', ...Array.from(tags)];
  }, [gallery]);

  // Filter gallery items
  const filteredGallery = useMemo(() => {
    if (selectedTag === 'All') return displayGallery;
    return displayGallery.filter(item => item.tag === selectedTag);
  }, [displayGallery, selectedTag]);

  // Format images for InfiniteGallery
  const threeDImages = useMemo(() => {
    return gallery.map(item => ({
      src: item.src,
      alt: item.caption
    }));
  }, [gallery]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIdx === null) return;
      if (e.key === 'Escape') setActivePhotoIdx(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx]);

  const handleOpenPhoto = (idx) => {
    soundFx.playClick();
    setActivePhotoIdx(idx);
  };

  const handleNext = () => {
    soundFx.playClick();
    setActivePhotoIdx((prev) => (prev + 1) % gallery.length);
  };

  const handlePrev = () => {
    soundFx.playClick();
    setActivePhotoIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleShuffle = () => {
    soundFx.playHarmonicChime();
    const shuffled = [...displayGallery].sort(() => Math.random() - 0.5);
    setDisplayGallery(shuffled);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C5A059', '#C4738B', '#FCECEF']
    });
  };

  const handleLike = (id, e) => {
    e.stopPropagation();
    soundFx.playHarmonicChime();
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 20,
      spread: 45,
      origin: { x, y },
      colors: ['#C4738B', '#FFD700', '#FCECEF']
    });
  };

  // Card mouse movement 3D tilt effect
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
      
      {/* BIG Left Side GIF: Gallery Curator */}
      <div className="hidden xl:flex flex-col items-center absolute -left-28 2xl:-left-44 top-36 z-20 animate-soft-float pointer-events-auto">
        <div className="relative group cursor-pointer" onClick={() => soundFx.playClick()}>
          <img 
            src="/gifs/sanjay-chat-tamil-chat.gif" 
            alt="Gallery Curator Reaction" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-xl text-xs font-mono text-[#1E1B18] font-bold tracking-wide">
            "GALLERY CURATOR 📸"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Certified 4K Candids
          </span>
        </div>
      </div>

      {/* BIG Right Side GIF: Running Frog */}
      <div className="hidden xl:flex flex-col items-center absolute -right-28 2xl:-right-44 top-48 z-20 animate-soft-float pointer-events-auto" style={{ animationDelay: '-3.5s' }}>
        <div className="relative group cursor-pointer" onClick={() => soundFx.playClick()}>
          <img 
            src="/gifs/frog-run.gif" 
            alt="Running from the Camera" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C4738B]/40 shadow-xl text-xs font-mono text-[#C4738B] font-bold tracking-wide">
            "RUNNING FROM PHOTOS 🏃"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Can't escape the memory reel
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-xs font-mono tracking-widest uppercase">
          <ImageIcon size={14} />
          Living Archive
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-medium text-[#1E1B18]">
          The Living Memory Dimension
        </h2>
        <p className="text-sm sm:text-base font-serif italic text-[#726860]">
          Portraits, shared laughter, beach trips, and pure unscripted friendship.
        </p>

        {/* View Mode Toggle Controls */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setViewMode('3d');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
              viewMode === '3d'
                ? 'bg-[#1E1B18] text-white shadow-lg scale-105 border border-[#C5A059]/50'
                : 'bg-white/80 text-[#726860] hover:bg-[#FAF6F0] border border-[#C5A059]/20'
            }`}
          >
            <Box size={14} className={viewMode === '3d' ? 'text-[#C5A059]' : ''} />
            3D Flythrough Tunnel
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setViewMode('grid');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#1E1B18] text-white shadow-lg scale-105 border border-[#C5A059]/50'
                : 'bg-white/80 text-[#726860] hover:bg-[#FAF6F0] border border-[#C5A059]/20'
            }`}
          >
            <Grid3X3 size={14} className={viewMode === 'grid' ? 'text-[#C5A059]' : ''} />
            Dynamic Scrapbook Grid
          </button>
        </div>
      </div>

      {/* 3D Infinite Flythrough Tunnel View */}
      {viewMode === '3d' && (
        <div className="mb-16 animate-fade-in relative rounded-3xl overflow-hidden bg-[#1E1B18] border border-[#C5A059]/30 shadow-2xl shadow-black/30">
          <InfiniteGallery
            images={threeDImages}
            speed={1.2}
            zSpacing={3}
            visibleCount={14}
            falloff={{ near: 0.8, far: 14 }}
            className="h-[520px] sm:h-[620px] w-full"
          />

          {/* Overlay Title */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#C5A059] text-[11px] font-mono tracking-widest uppercase self-center border border-[#C5A059]/30">
              <Sparkles size={12} />
              Interactive 3D WebGL Flythrough
            </div>

            <div className="text-white space-y-1">
              <h3 className="font-serif italic text-3xl sm:text-5xl tracking-tight text-white/95 drop-shadow-md">
                Dhathri's Memory Tunnel
              </h3>
              <p className="text-[11px] sm:text-xs font-mono text-[#F4E8D5]/80 uppercase tracking-widest">
                Use scroll wheel, arrow keys, or touch to glide through memories
              </p>
              <p className="text-[10px] font-mono text-white/40 tracking-wider">
                (Auto-gliding resumes after 3 seconds of inactivity)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= DYNAMIC BENTO SCRAPBOOK GRID VIEW ================= */}
      {(viewMode === 'grid' || viewMode === '3d') && (
        <div className="mt-8 animate-fade-in">
          
          {/* Controls Bar: Category Filters & Shuffle Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#C5A059]/20">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedTag(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedTag === cat
                      ? 'bg-gradient-to-r from-[#C5A059] to-[#C4738B] text-white shadow-md scale-105 font-bold'
                      : 'bg-white/85 text-[#726860] hover:bg-[#FAF6F0] border border-[#C5A059]/20 hover:border-[#C5A059]/40'
                  }`}
                >
                  {cat === 'All' ? '✦ All Memories' : cat}
                </button>
              ))}
            </div>

            {/* Interactive Shuffle Deck Button */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#726860] hidden sm:inline">
                {filteredGallery.length} Moments
              </span>
              <button
                onClick={handleShuffle}
                className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-[#FAF6F0] border border-[#C5A059]/30 text-xs font-mono text-[#1E1B18] shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
                title="Shuffle photo order"
              >
                <Shuffle size={13} className="text-[#C5A059]" />
                <span>Shuffle Deck</span>
              </button>
            </div>

          </div>

          {/* Dynamic Bento Grid Layout with 3D Tilt Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredGallery.map((item, idx) => {
              const originalIdx = gallery.findIndex(g => g.src === item.src);
              const isWide = item.featured && selectedTag === 'All';
              const cardId = item.id || `gal-${originalIdx}`;
              const cardLikes = likes[cardId] || 35;

              return (
                <div
                  key={cardId}
                  onClick={() => handleOpenPhoto(originalIdx >= 0 ? originalIdx : idx)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ transition: 'transform 0.15s ease-out, box-shadow 0.3s ease-out' }}
                  className={`group relative rounded-3xl bg-white p-4 border border-[#C5A059]/25 hover:border-[#C4738B]/50 shadow-md hover:shadow-2xl cursor-pointer flex flex-col justify-between overflow-hidden ${
                    isWide ? 'sm:col-span-2 sm:flex-row gap-6' : ''
                  }`}
                >
                  {/* Scrapbook washi tape top center */}
                  <div className="washi-tape opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Photo Container with Proper ObjectPosition */}
                  <div className={`relative rounded-2xl overflow-hidden bg-[#FAF6F0] shadow-inner ${
                    isWide ? 'sm:w-3/5 aspect-16/10' : 'aspect-4/5'
                  }`}>
                    <img
                      src={item.src}
                      alt={item.caption}
                      style={{ objectPosition: item.objectPosition || 'center 25%' }}
                      className="w-full h-full object-cover filter brightness-[0.98] group-hover:scale-105 group-hover:brightness-100 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient Vignette on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Top Left Tag Pill */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#F4E8D5] uppercase tracking-wider flex items-center gap-1 border border-white/20">
                      <Tag size={10} className="text-[#C5A059]" />
                      <span>{item.tag}</span>
                    </div>

                    {/* Top Right Enlarge Button */}
                    <div className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-[#1E1B18] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:scale-110">
                      <Maximize2 size={14} />
                    </div>

                    {/* Physical Scrapbook Sticker Badge */}
                    {item.sticker && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#FAF6F0] text-[#1E1B18] text-[10px] font-mono font-bold tracking-wide shadow-lg border border-[#C5A059]/40 rotate-[-2deg] group-hover:rotate-0 transition-transform">
                        {item.sticker}
                      </div>
                    )}
                  </div>

                  {/* Card Description & Micro-Interactions */}
                  <div className={`flex flex-col justify-between pt-3.5 ${
                    isWide ? 'sm:w-2/5 sm:pt-0 sm:py-2' : ''
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#726860]">
                        <span>Exhibit #{originalIdx + 1}</span>
                        <span className="text-[#C5A059] font-semibold">4K Archive</span>
                      </div>
                      
                      <p className="font-serif italic text-base sm:text-lg text-[#1E1B18] leading-snug group-hover:text-[#C4738B] transition-colors">
                        "{item.caption}"
                      </p>
                    </div>

                    {/* Bottom Action Footer: Heart Reaction Button */}
                    <div className="pt-4 mt-2 border-t border-[#C5A059]/15 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#726860]">
                        Tap to enlarge
                      </span>

                      <button
                        onClick={(e) => handleLike(cardId, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-[#FCECEF] text-xs font-mono text-[#C4738B] transition-all hover:scale-105 border border-[#C4738B]/20 shadow-2xs"
                        title="Send heart to this photo"
                      >
                        <Heart size={13} className="fill-[#C4738B]" />
                        <span className="font-bold">{cardLikes}</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================= FULLSCREEN LIGHTBOX MODAL ================= */}
      {activePhotoIdx !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActivePhotoIdx(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setActivePhotoIdx(null)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer z-20"
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer z-20"
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer z-20"
            aria-label="Next photo"
          >
            <ChevronRight size={28} />
          </button>

          {/* Lightbox Content */}
          <div 
            className="max-w-4xl max-h-[88vh] flex flex-col items-center gap-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 bg-black/40 shadow-2xl">
              <img
                src={gallery[activePhotoIdx].src}
                alt={gallery[activePhotoIdx].caption}
                className="max-h-[72vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            {/* Caption in lightbox */}
            <div className="text-center text-white space-y-1.5 px-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C5A059] inline-flex items-center gap-1.5 bg-[#C5A059]/15 px-3 py-1 rounded-full border border-[#C5A059]/30">
                <Sparkles size={12} />
                4K Master Print • {gallery[activePhotoIdx].tag} • {activePhotoIdx + 1} of {gallery.length}
              </span>
              <p className="font-serif italic text-lg sm:text-2xl drop-shadow-md">
                "{gallery[activePhotoIdx].caption}"
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
