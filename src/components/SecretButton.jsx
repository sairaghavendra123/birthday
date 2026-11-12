import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { AlertCircle, Heart, X, Sparkles } from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';

export default function SecretButton() {
  const [clickCount, setClickCount] = useState(0);
  const [showFinaleModal, setShowFinaleModal] = useState(false);
  const { secretButton } = birthdayConfig;

  const handleClick = () => {
    soundFx.playClick();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount > secretButton.states.length) {
      // Trigger the secret finale!
      soundFx.playCelebration();
      confetti({
        particleCount: 250,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#C5A059', '#C4738B', '#E08D79', '#FAF6F0', '#FFD700']
      });
      setShowFinaleModal(true);
    }
  };

  const getButtonText = () => {
    if (clickCount === 0) return secretButton.initialText;
    const stateIdx = Math.min(clickCount - 1, secretButton.states.length - 1);
    return secretButton.states[stateIdx].text;
  };

  const getSubText = () => {
    if (clickCount === 0) return "Authorized personnel only";
    const stateIdx = Math.min(clickCount - 1, secretButton.states.length - 1);
    return secretButton.states[stateIdx].sub;
  };

  return (
    <section className="py-20 px-4 text-center relative z-10">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Irresistible Forbidden Button */}
        <div className="relative inline-block group">
          <button
            onClick={handleClick}
            className={`px-8 py-4 rounded-full font-mono font-bold tracking-widest text-xs sm:text-sm uppercase transition-all duration-300 shadow-2xl active:scale-95 cursor-pointer select-none ${
              clickCount === 0
                ? 'bg-[#1E1B18] text-[#E08D79] hover:bg-[#C4738B] hover:text-white border-2 border-[#C4738B]/50 hover:scale-105'
                : clickCount <= secretButton.states.length
                ? 'bg-[#C4738B] text-white hover:bg-[#b05e76] scale-102 border-2 border-white'
                : 'bg-[#8FA89B] text-white scale-105'
            }`}
            style={{ cursor: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><text y=\"20\" font-size=\"20\">👀</text></svg>'), pointer" }}
          >
            <span className="flex items-center gap-2">
              <AlertCircle size={16} />
              {getButtonText()}
            </span>
          </button>

          {/* Floating warning tooltip on hover */}
          <div className="text-[11px] font-mono text-[#726860] mt-2 transition-opacity">
            "{getSubText()}"
          </div>
        </div>

      </div>

      {/* Secret Finale Modal */}
      {showFinaleModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowFinaleModal(false)}
        >
          <div 
            className="relative bg-white rounded-3xl p-6 sm:p-10 max-w-lg w-full border-2 border-[#C5A059]/40 shadow-2xl space-y-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowFinaleModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FAF6F0] text-[#726860] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Hilarious reaction photo */}
            <div className="w-full max-h-[340px] rounded-2xl overflow-hidden border border-[#E8D5C4] shadow-inner bg-[#FAF6F0]">
              <img
                src={secretButton.finalePhoto}
                alt="Secret Moment"
                className="w-full h-full object-cover max-h-[340px]"
                style={{ objectPosition: secretButton.objectPosition || 'center 20%' }}
              />
            </div>

            {/* Secret Love Message */}
            <div className="space-y-2">
              <h3 className="text-3xl sm:text-5xl font-display font-bold text-[#C4738B] tracking-tight">
                {secretButton.finaleMessage}
              </h3>
              <p className="text-sm sm:text-base font-serif italic text-[#1E1B18]/80 leading-relaxed">
                "{secretButton.finaleSub}"
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  soundFx.playCelebration();
                  confetti({ particleCount: 150, spread: 90 });
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1E1B18] text-white text-xs font-sans hover:bg-[#C5A059] transition-colors"
              >
                <Sparkles size={14} /> One More Blast
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
