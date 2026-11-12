import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight, X, CheckCheck } from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';

export default function RoastMode({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [closeRefusalText, setCloseRefusalText] = useState(null);

  const { roasts } = birthdayConfig;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsCompleted(false);
      setCloseRefusalText(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRoast = roasts[currentIndex];

  const handleNext = () => {
    soundFx.playClick();
    if (currentIndex < roasts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      soundFx.playDiagnosticBeep(true);
      setIsCompleted(true);
    }
  };

  const handleAttemptClose = () => {
    soundFx.playClick();
    if (!isCompleted) {
      setCloseRefusalText("⚠️ Access Denied: Truth cannot be closed until fully absorbed.");
      setTimeout(() => setCloseRefusalText(null), 3000);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      
      {/* Container */}
      <div className="relative max-w-xl w-full bg-[#1E1B18] text-[#FAF6F0] rounded-3xl p-6 sm:p-10 border border-[#C4738B]/40 shadow-2xl overflow-hidden">
        
        {/* Subtle fiery glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4738B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E08D79]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 relative z-10">
          <div className="flex items-center gap-2.5 text-[#E08D79]">
            <img 
              src="/gifs/milkangry-milk-and-mocha.gif" 
              alt="Angry Reaction" 
              className="w-10 h-10 object-contain rounded-lg drop-shadow" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <Flame size={14} className="animate-bounce" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">
                  Roast Mode Active
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/50 block">
                Live Attitude: 100% Salt
              </span>
            </div>
          </div>

          <button
            onClick={handleAttemptClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Easter Egg Close Refusal */}
        {closeRefusalText && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#C4738B]/20 border border-[#C4738B]/50 text-center font-mono text-xs text-[#FAF6F0] animate-shake">
            {closeRefusalText}
          </div>
        )}

        {!isCompleted ? (
          <div className="space-y-6 relative z-10 animate-fade-in key={currentIndex}">
            
            {/* Progress indicator */}
            <div className="flex justify-between items-center text-xs font-mono text-white/50">
              <span>{currentRoast.badge}</span>
              <span>{currentIndex + 1} of {roasts.length}</span>
            </div>

            {/* Funny photo display */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/15 bg-black/40 flex items-center justify-center group">
              <img
                src={currentRoast.photo}
                alt={currentRoast.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 font-mono text-[11px] text-[#FAF6F0]/80 tracking-wider">
                Exposed in 4K
              </span>
            </div>

            {/* Roast content */}
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#FAF6F0]">
                "{currentRoast.title}"
              </h3>
              <p className="text-sm sm:text-base font-serif italic text-[#C5A059] leading-relaxed">
                {currentRoast.punchline}
              </p>
            </div>

            {/* Next Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF6F0] text-[#1E1B18] font-sans font-medium text-xs sm:text-sm hover:bg-[#C4738B] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              >
                {currentIndex === roasts.length - 1 ? "Finish Roast" : "Next Truth"}
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        ) : (
          /* Completion State */
          <div className="text-center py-8 space-y-5 relative z-10 animate-fade-in">
            <div className="flex justify-center">
              <img 
                src="/gifs/mikonay.gif" 
                alt="Roast Survival" 
                className="w-20 h-20 object-contain rounded-xl drop-shadow-md animate-bounce" 
              />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C5A059]">
                System Log
              </span>
              <h3 className="text-3xl sm:text-4xl font-display font-medium text-[#FAF6F0]">
                ROAST COMPLETE
              </h3>
              <p className="font-mono text-sm text-[#C4738B]">
                "Survival status: somehow alive."
              </p>
            </div>

            <p className="text-xs sm:text-sm text-white/70 font-serif italic max-w-sm mx-auto">
              You have survived the roast protocol. Proceeding to nostalgic timeline...
            </p>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-[#FAF6F0] text-[#1E1B18] font-sans font-medium text-xs sm:text-sm hover:bg-[#C5A059] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Return to Experience →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
