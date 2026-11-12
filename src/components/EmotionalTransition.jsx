import React, { useState, useEffect } from 'react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';

export default function EmotionalTransition() {
  const [revealedCount, setRevealedCount] = useState(1);
  const { unspokenTruths } = birthdayConfig;

  useEffect(() => {
    if (revealedCount < unspokenTruths.length) {
      const currentItem = unspokenTruths[revealedCount];
      const timer = setTimeout(() => {
        setRevealedCount(prev => prev + 1);
      }, currentItem.pause);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, unspokenTruths]);

  return (
    <section className="min-h-[85vh] flex items-center justify-center py-28 px-6 relative z-10">
      
      {/* BIG Left Side GIF: Sibling Warmth */}
      <div className="hidden xl:flex flex-col items-center absolute left-12 2xl:left-32 top-1/2 -translate-y-1/2 z-20 animate-soft-float pointer-events-auto">
        <div className="relative group cursor-pointer" onClick={() => soundFx.playHarmonicChime()}>
          <img 
            src="/gifs/peach-goma-peach-and-goma.gif" 
            alt="Peach and Goma Warmth" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-xl text-xs font-mono text-[#C5A059] font-bold tracking-wide">
            "WARMEST MEMORIES 🌸"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Rare heartfelt truths
          </span>
        </div>
      </div>

      {/* BIG Right Side GIF: Goma Peach Hug */}
      <div className="hidden xl:flex flex-col items-center absolute right-12 2xl:right-32 top-1/2 -translate-y-1/2 z-20 animate-soft-float pointer-events-auto" style={{ animationDelay: '-3s' }}>
        <div className="relative group cursor-pointer" onClick={() => soundFx.playHarmonicChime()}>
          <img 
            src="/gifs/goma-peach.gif" 
            alt="Goma and Peach Hug" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C4738B]/40 shadow-xl text-xs font-mono text-[#C4738B] font-bold tracking-wide">
            "ALWAYS HERE FOR YOU 🤍"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Always in your corner
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto text-center space-y-10">
        
        {/* Title */}
        <div className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#C5A059]">
            Honest Truths
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-[#726860] italic">
            Things I'll probably never say normally.
          </h2>
        </div>

        {/* Sentences revealed one by one */}
        <div className="space-y-4 min-h-[320px] flex flex-col items-center justify-center">
          {unspokenTruths.map((item, idx) => {
            if (idx >= revealedCount) return null;
            if (item.text === "...") {
              return <div key={idx} className="w-12 h-0.5 bg-[#C5A059]/30 my-4" />;
            }

            const isHeartfelt = idx >= 5; // The transition to genuine friendship & gratitude

            return (
              <p
                key={idx}
                className={`transition-all duration-1000 ${
                  isHeartfelt
                    ? idx === unspokenTruths.length - 1
                      ? 'text-xl sm:text-2xl font-serif text-[#1E1B18] font-medium pt-2'
                      : 'text-lg sm:text-xl font-serif text-[#1E1B18]/90 italic'
                    : 'text-base sm:text-lg font-sans text-[#726860]/80'
                }`}
              >
                {item.text}
              </p>
            );
          })}

          {/* Sweet Peach & Goma friendship poke sticker */}
          {revealedCount >= unspokenTruths.length && (
            <div className="pt-6 animate-fade-in flex flex-col items-center gap-2">
              <img 
                src="/gifs/peach-goma-peach-and-goma.gif" 
                alt="Peach and Goma Tease" 
                className="w-16 h-16 object-contain rounded-xl drop-shadow-sm hover:scale-110 transition-transform" 
              />
              <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest">
                Scroll down for the letter
              </span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
