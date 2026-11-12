import React, { useState, useEffect } from 'react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';

const stepGifs = [
  { gif: "/gifs/hello-kitty.gif", label: "Hey you ✨" },
  { gif: "/gifs/cute-cha-pri.gif", label: "Yes, Dhathri, YOU 👀" },
  { gif: "/gifs/mochi-cat-angry-cat.gif", label: "Do NOT click skip! 😾" },
  { gif: "/gifs/peach-goma-peach-and-goma.gif", label: "Handcrafted with special care 🎁" },
  { gif: "/gifs/cute-cat-cute-kittens.gif", label: "Emotion sensors loading... 🥺" },
  { gif: "/gifs/milkangry-milk-and-mocha.gif", label: "Reality check: Still here 😈" },
  { gif: "/gifs/happy-friday-dance.gif", label: "Launch sequence ready! 🎉" }
];

export default function OpeningExperience({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [autoCountdown, setAutoCountdown] = useState(3);

  // Sequence progression
  useEffect(() => {
    if (currentStep < birthdayConfig.openingMessages.length) {
      soundFx.playClick();
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, birthdayConfig.openingMessages[currentStep].delay);
      return () => clearTimeout(timer);
    } else {
      const btnTimer = setTimeout(() => {
        soundFx.playDiagnosticBeep(true);
        setShowButton(true);
      }, 400);
      return () => clearTimeout(btnTimer);
    }
  }, [currentStep]);

  // Automatic progression countdown so user doesn't even have to tap to continue
  useEffect(() => {
    if (!showButton || isExiting) return;
    if (autoCountdown <= 0) {
      handleProceed();
      return;
    }
    const timer = setTimeout(() => {
      setAutoCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [showButton, autoCountdown, isExiting]);

  const handleProceed = () => {
    if (isExiting) return;
    soundFx.playClick();
    soundFx.playCelebration();
    setIsExiting(true);

    setTimeout(() => {
      onComplete();
    }, 900);
  };

  const activeGifInfo = stepGifs[Math.min(currentStep, stepGifs.length - 1)];

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#151311] text-[#FAF6F0] p-6 transition-all duration-1000 overflow-hidden ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background subtle noise and warm radial glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.3)_0%,transparent_70%)] pointer-events-none" />

      {/* ================= CORNER FUN STICKERS ================= */}
      {/* Top Left GIF */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none animate-soft-float">
        <div className="flex flex-col items-center">
          <img 
            src="/gifs/hello-kitty.gif" 
            alt="Cute Hello Kitty" 
            className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-2xl" 
          />
          <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-[#C5A059]/20 hidden sm:block">
            Party Mode 🎈
          </span>
        </div>
      </div>

      {/* Top Right GIF */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none animate-soft-float" style={{ animationDelay: '-1.5s' }}>
        <div className="flex flex-col items-center">
          <img 
            src="/gifs/happy-friday-dance.gif" 
            alt="Dancing Celebration" 
            className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-2xl" 
          />
          <span className="text-[10px] font-mono text-[#C4738B] uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-[#C4738B]/20 hidden sm:block">
            Vibe Check ✨
          </span>
        </div>
      </div>

      {/* Bottom Left GIF */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none animate-soft-float" style={{ animationDelay: '-3s' }}>
        <div className="flex flex-col items-center">
          <img 
            src="/gifs/mochi-cat-angry-cat.gif" 
            alt="Angry Cat" 
            className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-2xl" 
          />
          <span className="text-[10px] font-mono text-white/70 uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 hidden sm:block">
            Don't close! 😾
          </span>
        </div>
      </div>

      {/* Bottom Right GIF */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none animate-soft-float" style={{ animationDelay: '-2.5s' }}>
        <div className="flex flex-col items-center">
          <img 
            src="/gifs/frog-run.gif" 
            alt="Frog Sprint" 
            className="w-24 h-24 sm:w-36 sm:h-36 object-contain drop-shadow-2xl" 
          />
          <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full bg-white/5 border border-[#C5A059]/20 hidden sm:block">
            Patience Buffer: 18% 🏃
          </span>
        </div>
      </div>

      {/* ================= CENTER STAGE CONTENT ================= */}
      <div className="relative max-w-xl w-full text-center space-y-6 flex flex-col items-center justify-center min-h-[360px] z-30">
        
        {/* Dynamic Center Reaction GIF (Changes on every step!) */}
        <div className="relative mb-2 flex flex-col items-center animate-fade-in" key={currentStep}>
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white/10 border-2 border-[#C5A059]/40 flex items-center justify-center p-3 shadow-2xl backdrop-blur-md">
            <img 
              src={activeGifInfo.gif}
              alt={activeGifInfo.label}
              className="w-full h-full object-contain rounded-2xl drop-shadow-2xl"
            />
          </div>
          <div className="mt-3 text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A059] font-bold px-3 py-1 rounded-full bg-white/10 border border-[#C5A059]/30 shadow-md">
              {activeGifInfo.label}
            </span>
          </div>
        </div>

        {/* Story Text Messages */}
        <div className="space-y-3 min-h-[160px] flex flex-col items-center justify-center">
          {birthdayConfig.openingMessages.map((msg, index) => {
            if (index > currentStep) return null;
            const isLatest = index === currentStep;
            return (
              <p
                key={index}
                className={`font-serif tracking-wide transition-all duration-700 ${
                  index === birthdayConfig.openingMessages.length - 1
                    ? 'text-3xl sm:text-4xl text-[#C5A059] font-bold pt-2'
                    : isLatest
                    ? 'text-xl sm:text-2xl text-[#FAF6F0] opacity-100 scale-105 font-medium'
                    : 'text-base sm:text-lg text-[#726860] opacity-40'
                }`}
              >
                {msg.text}
              </p>
            );
          })}
        </div>

        {/* Action Button & Auto-Play Countdown Indicator */}
        {showButton && (
          <div className="pt-4 animate-fade-in transition-all duration-700 flex flex-col items-center gap-3">
            <button
              onClick={handleProceed}
              className="group relative px-8 py-3.5 rounded-full bg-[#FAF6F0] text-[#151311] font-sans font-bold text-sm sm:text-base tracking-wider hover:bg-[#C5A059] hover:text-[#151311] shadow-2xl hover:shadow-[#C5A059]/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                {birthdayConfig.openingButtonText}
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </span>
            </button>
            
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#C5A059]/30 text-[11px] font-mono text-[#C5A059]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Continuing in {autoCountdown}s...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Tag */}
      <div className="absolute bottom-6 text-center z-10">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#726860] uppercase">
          Confidential • Protocol v9.0 • Sai → Dhathri
        </span>
      </div>
    </div>
  );
}
