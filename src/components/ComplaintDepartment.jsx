import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';
import { RadialScrollGallery } from '@/components/ui/portfolio-and-image-gallery';

const unsplashFallbacks = [
  "https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
];

const wheelSideStickers = [
  {
    src: "/gifs/hello-kitty.gif",
    alt: "Sparkling Hello Kitty",
    label: '"PURE RADIANCE ✨"',
    posClass: "left-2 xl:left-4 2xl:-left-12 top-[24%]",
    pillClass: "border-[#C4738B]/40 text-[#C4738B]",
    delay: "0s",
    playSound: () => soundFx.playHarmonicChime()
  },
  {
    src: "/gifs/happy-friday-dance.gif",
    alt: "Happy Celebration Dance",
    label: '"GOOD VIBES ONLY 🎉"',
    posClass: "right-2 xl:right-4 2xl:-right-12 top-[26%]",
    pillClass: "border-[#C5A059]/40 text-[#1E1B18]",
    delay: "-2.5s",
    playSound: () => soundFx.playCelebration()
  },
  {
    src: "/gifs/milkangry-milk-and-mocha.gif",
    alt: "Milk and Mocha",
    label: '"ALWAYS SMILING 🥰"',
    posClass: "left-2 xl:left-4 2xl:-left-12 top-[51%]",
    pillClass: "border-[#E08D79]/40 text-[#C4738B]",
    delay: "-4.5s",
    playSound: () => soundFx.playClick()
  },
  {
    src: "/gifs/sanjay-chat-tamil-chat.gif",
    alt: "Cute Playful Sticker",
    label: '"CAUGHT IN 4K 📸"',
    posClass: "right-2 xl:right-4 2xl:-right-12 top-[53%]",
    pillClass: "border-[#C5A059]/40 text-[#726860]",
    delay: "-1.5s",
    playSound: () => soundFx.playClick()
  },
  {
    src: "/gifs/peach-goma-peach-and-goma.gif",
    alt: "Peach and Goma",
    label: '"BESTIE ENERGY 💖"',
    posClass: "left-2 xl:left-4 2xl:-left-12 top-[76%]",
    pillClass: "border-[#C4738B]/40 text-[#C4738B]",
    delay: "-3s",
    playSound: () => soundFx.playHarmonicChime()
  },
  {
    src: "/gifs/cute-cat-cute-kittens.gif",
    alt: "Cute Kittens",
    label: '"FAVORITE MOMENTS ✨"',
    posClass: "right-2 xl:right-4 2xl:-right-12 top-[78%]",
    pillClass: "border-[#C5A059]/40 text-[#C5A059]",
    delay: "-5.5s",
    playSound: () => soundFx.playCelebration()
  }
];

export default function ComplaintDepartment() {
  const [activePhoto, setActivePhoto] = useState(null);
  const { complaints } = birthdayConfig;

  const handleOpenPhoto = (item, index) => {
    soundFx.playClick();
    setActivePhoto({ ...item, index });
  };

  const handleClosePhoto = () => {
    soundFx.playClick();
    setActivePhoto(null);
  };

  return (
    <section id="complaints-section" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">

      {/* Cute Floating Side GIFs alongside the 360° Photo Wheel */}
      {wheelSideStickers.map((sticker, idx) => (
        <div
          key={idx}
          className={`hidden xl:flex flex-col items-center absolute ${sticker.posClass} z-20 animate-soft-float pointer-events-auto`}
          style={{ animationDelay: sticker.delay }}
        >
          <div className="relative group cursor-pointer" onClick={sticker.playSound}>
            <img
              src={sticker.src}
              alt={sticker.alt}
              className="w-32 h-32 xl:w-40 xl:h-40 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform"
            />
            <div className={`mt-2 text-center bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border shadow-xl text-[11px] font-mono font-bold tracking-wide ${sticker.pillClass}`}>
              {sticker.label}
            </div>
          </div>
        </div>
      ))}

      {/* 360° Photo Wheel (RadialScrollGallery) */}
      <div id="evidence-vault" className="relative">
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#1E1B18] text-xs font-mono tracking-widest uppercase">
            <Sparkles size={14} className="text-[#C5A059]" />
            Curated Snapshots • 360° Showcase
          </div>
          <h3 className="text-2xl sm:text-4xl font-display font-medium text-[#1E1B18]">
            The 360° Photo Wheel
          </h3>
          <p className="text-xs sm:text-base font-serif italic text-[#726860]">
            Scroll to rotate through favorite moments captured in motion.
          </p>
          <div className="animate-bounce text-[#C5A059] text-xs font-mono pt-2">
            ↓ Scroll through the wheel
          </div>
        </div>

        <RadialScrollGallery
          className="!min-h-[620px]"
          baseRadius={420}
          mobileRadius={240}
          visiblePercentage={48}
          scrollDuration={2200}
          onItemSelect={(index) => handleOpenPhoto(complaints[index], index)}
        >
          {(hoveredIndex) =>
            complaints.map((item, index) => {
              const isActive = hoveredIndex === index;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenPhoto(item, index)}
                  className={`group relative w-[210px] h-[290px] sm:w-[250px] sm:h-[330px] overflow-hidden rounded-2xl bg-white border-2 shadow-xl shadow-[#1E1B18]/10 cursor-pointer transition-all duration-300 ${
                    isActive ? 'border-[#C5A059] shadow-2xl shadow-[#C5A059]/20' : 'border-[#C5A059]/30'
                  }`}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={item.wheelImage || item.evidenceImage}
                      alt={item.wheelCaption || `Snapshot ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = unsplashFallbacks[index % unsplashFallbacks.length];
                      }}
                      style={{ objectPosition: item.wheelObjectPosition || item.objectPosition || 'center center' }}
                      className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                        isActive ? 'scale-105' : 'scale-100'
                      }`}
                    />
                  </div>

                  {/* Top Minimal Curator Index */}
                  <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[9px] font-mono text-[#FAF6F0] tracking-wider">
                    0{index + 1} / 0{complaints.length}
                  </div>

                  {/* Elegant Frosted Placard with Heartfelt Caption */}
                  <div className="absolute bottom-3 inset-x-3 z-10 bg-white/92 backdrop-blur-md border border-[#C5A059]/40 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-lg shadow-black/10 text-center transition-all duration-300 group-hover:bg-white/98 group-hover:border-[#C5A059] group-hover:shadow-xl">
                    <p className="font-serif italic text-xs sm:text-[13px] text-[#1E1B18] font-medium leading-snug">
                      “{item.wheelCaption || item.evidenceCaption}”
                    </p>
                    <div className="w-5 h-0.5 bg-[#C5A059]/60 rounded-full mx-auto mt-1" />
                  </div>
                </div>
              );
            })
          }
        </RadialScrollGallery>
      </div>

      {/* Photo Preview Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={handleClosePhoto}
        >
          <div
            className="relative bg-[#FFFDF9] rounded-3xl p-5 sm:p-7 max-w-lg w-full border-2 border-[#C5A059] shadow-2xl space-y-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E1B18]/10 pb-3">
              <span className="font-mono text-xs font-bold text-[#C5A059] tracking-widest uppercase">
                Snapshot 0{activePhoto.index + 1} / 0{complaints.length}
              </span>
              <button
                onClick={handleClosePhoto}
                className="p-1.5 rounded-full hover:bg-[#FAF6F0] text-[#726860] hover:text-[#1E1B18] transition-colors cursor-pointer"
                aria-label="Close photo"
              >
                <X size={18} />
              </button>
            </div>

            {/* Image */}
            <div className="w-full max-h-[65vh] rounded-2xl overflow-hidden bg-black border border-[#1E1B18]/10 flex items-center justify-center">
              <img
                src={activePhoto.wheelImage || activePhoto.evidenceImage}
                alt={activePhoto.wheelCaption || 'Snapshot'}
                style={{ objectPosition: activePhoto.wheelObjectPosition || activePhoto.objectPosition || 'center center' }}
                onError={(e) => {
                  e.currentTarget.src = unsplashFallbacks[0];
                }}
                className="w-full h-full object-contain max-h-[65vh]"
              />
            </div>

            {/* Caption */}
            {(activePhoto.wheelCaption || activePhoto.evidenceCaption) && (
              <p className="font-serif italic text-lg sm:text-xl text-center text-[#1E1B18] pt-1">
                “{activePhoto.wheelCaption || activePhoto.evidenceCaption}”
              </p>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
