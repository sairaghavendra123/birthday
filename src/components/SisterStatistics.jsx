import React, { useState } from 'react';
import { BarChart3, Star, Flame, AlertOctagon } from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';

export default function SisterStatistics({ onOpenRoastMode }) {
  const [easterEggText, setEasterEggText] = useState(null);
  const { statistics, rating } = birthdayConfig;

  const handleBarClick = (label) => {
    soundFx.playClick();
    if (label.toLowerCase().includes("patience")) {
      setEasterEggText("⚠️ ERROR: Measurement device crashed. Insufficient buffer detected.");
    } else if (label.toLowerCase().includes("admitting")) {
      setEasterEggText("🔍 Probability verified: 3% is likely an overestimate.");
    } else {
      setEasterEggText(`Telemetry confirmed: ${label} is 100% scientifically accurate.`);
    }

    setTimeout(() => {
      setEasterEggText(null);
    }, 4000);
  };

  return (
    <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto relative z-10">
      
      {/* BIG Left Side GIF: Pouting Milk & Mocha */}
      <div className="hidden xl:flex flex-col items-center absolute -left-28 2xl:-left-44 top-32 z-20 animate-soft-float pointer-events-auto">
        <div className="relative group cursor-pointer" onClick={() => soundFx.playBuzzer()}>
          <img 
            src="/gifs/milkangry-milk-and-mocha.gif" 
            alt="Pouting Milk & Mocha" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C4738B]/40 shadow-xl text-xs font-mono text-[#C4738B] font-bold tracking-wide">
            "DISPUTING 3% PATIENCE! ☕"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            "I am extremely patient! 😾"
          </span>
        </div>
      </div>

      {/* BIG Right Side GIF: Teasing Cartoon */}
      <div className="hidden xl:flex flex-col items-center absolute -right-28 2xl:-right-44 top-44 z-20 animate-soft-float pointer-events-auto" style={{ animationDelay: '-2.5s' }}>
        <div className="relative group cursor-pointer" onClick={() => soundFx.playClick()}>
          <img 
            src="/gifs/cute-cha-pri.gif" 
            alt="Teasing Verdict" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-xl text-xs font-mono text-[#1E1B18] font-bold tracking-wide">
            "AUDIT RESULT: 100% ACCURATE 📊"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Scientific Telemetry
          </span>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-12 border border-[#C5A059]/30 shadow-2xl shadow-[#C5A059]/10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-xs font-mono tracking-widest uppercase">
            <BarChart3 size={14} />
            Confidential Evaluation
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#1E1B18]">
            Annual Performance Review
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-[#726860]">
            Empirical data collected across 365 days of relentless dynamics.
          </p>
        </div>

        {/* Easter Egg Notice */}
        {easterEggText && (
          <div className="mb-6 p-3 rounded-xl bg-[#FAF6F0] border border-[#C5A059]/40 text-center font-mono text-xs text-[#C4738B] animate-fade-in">
            {easterEggText}
          </div>
        )}

        {/* Metrics List */}
        <div className="space-y-6">
          {statistics.map((stat, idx) => (
            <div 
              key={idx} 
              className="space-y-2 cursor-pointer group"
              onClick={() => handleBarClick(stat.label)}
            >
              <div className="flex justify-between items-center text-xs sm:text-sm font-sans font-medium text-[#1E1B18]">
                <span className="group-hover:text-[#C5A059] transition-colors flex items-center gap-1.5">
                  {stat.label}
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 text-[#726860] font-mono transition-opacity">
                    (inspect)
                  </span>
                </span>
                <span className="font-mono text-xs font-semibold text-[#726860]">
                  {stat.value}%
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-3 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#1E1B18]/5 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${stat.color}`}
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating Box */}
        <div className="mt-12 pt-8 border-t border-[#1E1B18]/10 text-center space-y-3 relative">
          <div className="flex justify-center mb-1">
            <img 
              src="/gifs/cute-cat-cute-kittens.gif" 
              alt="Cute Kitten" 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl drop-shadow-md hover:scale-105 transition-transform"
            />
          </div>

          <p className="text-xs uppercase font-mono tracking-widest text-[#726860]">
            Overall Rating
          </p>
          <div className="flex items-center justify-center gap-1 text-[#C5A059]">
            {[...Array(rating.score)].map((_, i) => (
              <Star key={i} size={22} fill="#C5A059" className="animate-pulse" />
            ))}
          </div>
          <p className="text-xl sm:text-2xl font-display font-medium text-[#1E1B18]">
            "{rating.verdict}"
          </p>
          <p className="text-xs font-mono text-[#726860] italic">
            "{rating.subtext}"
          </p>
        </div>

        {/* Roast Mode Trigger Button */}
        <div className="mt-10 pt-6 border-t border-dashed border-[#C5A059]/20 text-center">
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenRoastMode();
            }}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1E1B18] text-[#FAF6F0] text-xs sm:text-sm font-mono uppercase tracking-wider hover:bg-[#C4738B] transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-black/10 cursor-pointer"
          >
            <Flame size={16} className="text-[#E08D79] group-hover:animate-bounce" />
            Activate Roast Mode
            <span className="text-[10px] text-[#FAF6F0]/60 font-sans tracking-normal ml-1">
              (Proceed at your own risk)
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}
