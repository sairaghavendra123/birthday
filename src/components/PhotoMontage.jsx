import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Sparkles } from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';

export default function PhotoMontage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isJokeVisible, setIsJokeVisible] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { montage, montageCloser, montageJoke } = birthdayConfig;

  useEffect(() => {
    if (isLightboxOpen) return; // Pause auto-advance when user is viewing in 4K lightbox
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % montage.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [montage.length, isLightboxOpen]);

  useEffect(() => {
    const jokeTimer = setTimeout(() => {
      setIsJokeVisible(true);
    }, 2500);
    return () => clearTimeout(jokeTimer);
  }, []);

  // Keyboard navigation when 4K lightbox is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    soundFx.playClick();
    setCurrentIndex((prev) => (prev - 1 + montage.length) % montage.length);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    soundFx.playClick();
    setCurrentIndex((prev) => (prev + 1) % montage.length);
  };

  const currentItem = montage[currentIndex];

  return (
    <section className="py-28 px-4 sm:px-6 max-w-4xl mx-auto relative z-10">
      
      {/* BIG Left Side GIF: Hello Kitty Glamour */}
      <div className="hidden xl:flex flex-col items-center absolute -left-28 2xl:-left-44 top-1/3 z-20 animate-soft-float pointer-events-auto">
        <div className="relative group cursor-pointer" onClick={() => soundFx.playCelebration()}>
          <img 
            src="/gifs/hello-kitty.gif" 
            alt="Hello Kitty Sparkles" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-xl text-xs font-mono text-[#C5A059] font-bold tracking-wide">
            "G. SIVADHATHRI ✨"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Birthday Queen Energy
          </span>
        </div>
      </div>

      {/* BIG Right Side GIF: Happy Dance Party */}
      <div className="hidden xl:flex flex-col items-center absolute -right-28 2xl:-right-44 top-1/3 z-20 animate-soft-float pointer-events-auto" style={{ animationDelay: '-2.5s' }}>
        <div className="relative group cursor-pointer" onClick={() => soundFx.playHarmonicChime()}>
          <img 
            src="/gifs/happy-friday-dance.gif" 
            alt="Celebration Dance" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E08D79]/40 shadow-xl text-xs font-mono text-[#E08D79] font-bold tracking-wide">
            "PARTY PROTOCOL 🕺"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Surviving each other in style
          </span>
        </div>
      </div>

      {/* Container */}
      <div className="flex flex-col items-center text-center space-y-10">
        
        {/* Editorial Subtitle */}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#C5A059]">
          Cinematic Memory Journey
        </span>

        {/* Cinematic Single-Photo Frame */}
        <div 
          onClick={() => {
            soundFx.playClick();
            setIsLightboxOpen(true);
          }}
          className="relative max-w-lg w-full aspect-4/5 rounded-3xl overflow-hidden shadow-2xl shadow-[#1E1B18]/15 border-4 border-white bg-white cursor-pointer group"
        >
          <img
            key={currentIndex}
            src={currentItem.photo}
            alt={currentItem.caption || `G. Sivadhathri memory ${currentIndex + 1}`}
            className="w-full h-full object-cover animate-fade-in transition-all duration-1000 group-hover:scale-105"
            style={{ objectPosition: currentItem.objectPosition || 'center top' }}
            decoding="async"
          />

          {/* 4K Zoom hint on hover */}
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
            <ZoomIn size={12} className="text-[#C5A059]" /> 4K Ultra-HD
          </div>

          {/* Minimal cinematic compliment caption overlay */}
          <div className="absolute inset-x-0 bottom-0 pt-20 pb-6 px-6 sm:px-8 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex flex-col justify-end text-white pointer-events-none">
            {currentItem.caption && (
              <p className="font-serif italic text-lg sm:text-2xl leading-snug tracking-wide drop-shadow-md">
                “{currentItem.caption}”
              </p>
            )}
            <span className="font-mono text-[11px] text-white/75 uppercase tracking-widest mt-1.5">
              Chapter {currentIndex + 1} of {montage.length} • Tap for 4K
            </span>
          </div>

          {/* Nav Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white hover:bg-[#C5A059] backdrop-blur-sm transition-all hover:scale-110 active:scale-95 z-20 shadow-lg"
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white hover:bg-[#C5A059] backdrop-blur-sm transition-all hover:scale-110 active:scale-95 z-20 shadow-lg"
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center gap-2">
          {montage.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                soundFx.playClick();
                setCurrentIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-[#C5A059]' : 'w-2 bg-[#E8D5C4]'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Emotional punchline with comedic tension-breaker */}
        <div className="space-y-2 pt-6">
          <h3 className="text-2xl sm:text-4xl font-display font-medium text-[#1E1B18]">
            "{montageCloser}"
          </h3>
          {isJokeVisible && (
            <p className="font-mono text-sm sm:text-base text-[#C4738B] font-semibold animate-fade-in tracking-wider">
              {montageJoke}
            </p>
          )}
        </div>

      </div>

      {/* 4K Fullscreen Cinematic Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full flex flex-col items-center bg-[#1E1B18]/95 border border-[#C5A059]/40 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
              aria-label="Close full view"
            >
              <X size={20} />
            </button>

            {/* Nav Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-[#C5A059] text-white transition-all shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-[#C5A059] text-white transition-all shadow-lg cursor-pointer hover:scale-110 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight size={22} />
            </button>

            {/* 4K Ultra-HD Badge */}
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-[11px] font-mono tracking-widest uppercase border border-[#C5A059]/30">
                <Sparkles size={12} />
                4K Cinematic Master • Chapter {currentIndex + 1} of {montage.length}
              </span>
            </div>

            {/* Main High-Res Image Display */}
            <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/60 border border-white/10 p-1">
              <img
                src={currentItem.photo}
                alt={currentItem.caption || `G. Sivadhathri memory ${currentIndex + 1}`}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-2xl animate-fade-in"
              />
            </div>

            {/* Compliment Caption */}
            <div className="mt-4 text-center max-w-lg">
              {currentItem.caption && (
                <p className="font-serif italic text-xl sm:text-2xl text-white drop-shadow-md">
                  “{currentItem.caption}”
                </p>
              )}
              <span className="text-[10px] font-mono text-[#A89F91] block mt-1.5">
                G. Sivadhathri • Cinematic Memory Journey
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
