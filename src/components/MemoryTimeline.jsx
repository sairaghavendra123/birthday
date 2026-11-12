import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Maximize2, 
  X, 
  Heart, 
  MessageSquareQuote, 
  ChevronDown, 
  Clock, 
  Bookmark,
  Camera
} from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';

// Enriched memory milestones with retrospective notes
const enrichedMilestones = [
  {
    chapter: "01",
    year: "Day One",
    tag: "Quiet Beginnings",
    title: "Before all the chaos started",
    description: "Dressed in silk and flowers, smiling politely for the camera. Back before we became close friends, nobody could have predicted the non-stop laughter and memories we'd make together.",
    photo: "/photos/memories/timeline_childhood.jpg",
    objectPosition: "center 10%",
    secretNote: "Retrospective: Looking back at childhood photos, you had this quiet, polite smile that fooled everyone. Now you use that sweet face to snatch my French fries and pretend you didn't see anything.",
    sentiment: "Innocence: 100% • Silence: Extinct",
    badgeColor: "bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30"
  },
  {
    chapter: "02",
    year: "Best Friends",
    tag: "Unbreakable Bond",
    title: "Teammates against the world",
    description: "Through every school year, every exam panic, and every long day where we laughed through the chaos together.",
    photo: "/photos/memories/beach_duo.jpg",
    objectPosition: "center 15%",
    secretNote: "Retrospective: We developed an entire telepathic language of eyebrow twitches and glance-jokes so we wouldn't burst out laughing during boring lectures and serious moments.",
    sentiment: "Telepathic Connection: 100%",
    badgeColor: "bg-[#8FA89B]/20 text-[#2C4A3E] border-[#8FA89B]/40"
  },
  {
    chapter: "03",
    year: "True Loyalty",
    tag: "In Our Corner",
    title: "Always looking out for each other",
    description: "We argue over silly little things, but whenever life gets tough or either of us needs backup, we stand side by side without hesitation.",
    photo: "/photos/memories/sky_trio.jpg",
    objectPosition: "center 68%",
    secretNote: "Retrospective: You are allowed to roast and tease me 24/7. But the second anyone else in the world dares to trouble you, they have to deal with me first.",
    sentiment: "Defense Level: Defcon 1",
    badgeColor: "bg-[#C4738B]/15 text-[#C4738B] border-[#C4738B]/30"
  },
  {
    chapter: "04",
    year: "Today & Beyond",
    tag: "Lifelong Friends",
    title: "The wonderful person you are",
    description: "Smarter, stronger, more radiant every day — and still the one friend who knows how to roast me and inspire me at the exact same time.",
    photo: "/photos/memories/finger_heart.jpg",
    objectPosition: "center 22%",
    secretNote: "Retrospective: Watching you achieve your dreams and grow into who you are today is the best thing. No matter where our paths take us, I am always in your corner cheering you on. Happy Birthday, Dhathri.",
    sentiment: "Pride: 10,000%",
    badgeColor: "bg-[#E08D79]/20 text-[#B85338] border-[#E08D79]/40"
  }
];

export default function MemoryTimeline() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState({ 0: true }); // first one open by default
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const cardRefs = useRef([]);

  // IntersectionObserver to dynamically highlight the active sticky card
  useEffect(() => {
    const observers = [];
    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveChapter(index);
          }
        },
        { threshold: 0.45, rootMargin: "-10% 0px -40% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, []);

  const scrollToChapter = (index) => {
    soundFx.playClick();
    setActiveChapter(index);
    const target = cardRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleSecretNote = (index) => {
    soundFx.playHarmonicChime();
    setExpandedNotes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleOpenLightbox = (milestone) => {
    soundFx.playClick();
    setLightboxPhoto(milestone);
  };

  const handleCloseLightbox = () => {
    soundFx.playClick();
    setLightboxPhoto(null);
  };

  return (
    <section id="timeline-section" className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
      
      {/* BIG Left Side GIF: Peach & Goma Childhood */}
      <div className="hidden xl:flex flex-col items-center absolute -left-28 2xl:-left-44 top-64 z-20 animate-soft-float pointer-events-auto">
        <div className="relative group cursor-pointer" onClick={() => soundFx.playClick()}>
          <img 
            src="/gifs/peach-goma-peach-and-goma.gif" 
            alt="Childhood Peach & Goma" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-xl text-xs font-mono text-[#C5A059] font-bold tracking-wide">
            "CHILDHOOD ERA 🍭"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Simpler, smaller days
          </span>
        </div>
      </div>

      {/* BIG Right Side GIF: Goma & Peach Friendship Hug */}
      <div className="hidden xl:flex flex-col items-center absolute -right-28 2xl:-right-44 top-[55%] z-20 animate-soft-float pointer-events-auto" style={{ animationDelay: '-3.5s' }}>
        <div className="relative group cursor-pointer" onClick={() => soundFx.playHarmonicChime()}>
          <img 
            src="/gifs/goma-peach.gif" 
            alt="Bond Goma & Peach" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C4738B]/40 shadow-xl text-xs font-mono text-[#C4738B] font-bold tracking-wide">
            "PARTNERS IN CRIME 🤍"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Unbreakable team
          </span>
        </div>
      </div>

      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="flex items-center justify-center gap-3">
          <img 
            src="/gifs/cute-cha-pri.gif" 
            alt="Childhood Nostalgia" 
            className="w-10 h-10 object-contain drop-shadow" 
          />
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-xs font-mono tracking-widest uppercase">
            <Sparkles size={14} />
            Chronological Archival Story
          </div>
          <img 
            src="/gifs/cute-cha-pri.gif" 
            alt="Childhood Nostalgia" 
            className="w-10 h-10 object-contain drop-shadow -scale-x-100" 
          />
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-display font-medium text-[#1E1B18] tracking-tight">
          Somehow, We Grew Up.
        </h2>
        
        <p className="text-sm sm:text-base font-serif italic text-[#726860] leading-relaxed max-w-xl mx-auto">
          We were smaller. We fought over smaller things. Life was simpler. And somehow, every year went faster than the last.
        </p>
      </div>

      {/* ================= STICKY HUD / CHAPTER NAVIGATOR ================= */}
      <div className="sticky top-4 sm:top-6 z-40 mb-12 flex justify-center px-2">
        <div className="bg-white/90 backdrop-blur-xl border border-[#C5A059]/30 rounded-full px-3 py-1.5 sm:px-5 sm:py-2.5 shadow-2xl shadow-[#1E1B18]/10 flex items-center gap-1.5 sm:gap-3 transition-all duration-300 max-w-2xl w-full justify-between">
          
          {/* Chapter Status Counter */}
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider font-bold text-[#1E1B18] whitespace-nowrap">
              <span className="text-[#C5A059]">0{activeChapter + 1}</span> / 04
            </span>
          </div>

          {/* Chapter Pill Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {enrichedMilestones.map((item, idx) => {
              const isActive = activeChapter === idx;
              return (
                <button
                  key={idx}
                  onClick={() => scrollToChapter(idx)}
                  className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#1E1B18] text-[#FAF6F0] shadow-md scale-105 font-bold'
                      : 'text-[#726860] hover:text-[#1E1B18] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#C5A059]' : 'bg-[#726860]/40'}`} />
                  <span className="hidden md:inline">{item.year}</span>
                  <span className="md:hidden">Ch.{idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Friendship Badge */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-serif italic text-[#726860] pr-2">
            <Clock size={12} className="text-[#C5A059]" />
            <span>2008 – Forever</span>
          </div>

        </div>
      </div>

      {/* ================= CASCADING STICKY STACKING CARDS ================= */}
      <div className="relative pb-24 space-y-12 sm:space-y-20">
        {enrichedMilestones.map((item, idx) => {
          const isNoteOpen = expandedNotes[idx];
          
          return (
            <div
              key={idx}
              ref={el => cardRefs.current[idx] = el}
              id={`timeline-card-${idx}`}
              className="sticky transition-all duration-700 rounded-3xl"
              style={{ 
                // Cascading stack: each card rests slightly lower than the previous one
                top: `calc(5.25rem + ${idx * 1.5}rem)`,
                zIndex: idx + 10
              }}
            >
              {/* Card Shell with Apple-grade frosted glass, drop shadows, and gold trim */}
              <div className="bg-[#FFFDF9]/95 backdrop-blur-2xl rounded-3xl border border-[#C5A059]/35 shadow-2xl shadow-[#1E1B18]/15 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:border-[#C5A059]/60">
                
                {/* Top Binder Header Tab (Always visible when stacked!) */}
                <div className="px-6 py-2.5 sm:px-8 sm:py-3 bg-[#FAF6F0] border-b border-[#C5A059]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
                    <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#1E1B18]">
                      ARCHIVE #{item.chapter} • {item.year.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-mono text-[#726860] hidden sm:inline">
                      {item.sentiment}
                    </span>
                  </div>
                </div>

                {/* Main Card Content: Split Layout */}
                <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Photo Column (5 cols on lg) */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative group max-w-sm w-full">
                      
                      {/* Washi tape styling on top */}
                      <div className="washi-tape -top-3 left-1/2 -translate-x-1/2" />

                      {/* Polaroid Frame */}
                      <div className="bg-white p-3.5 sm:p-4 pb-6 sm:pb-8 rounded-2xl shadow-xl shadow-[#1E1B18]/10 border border-[#C5A059]/20 transition-all duration-500 group-hover:scale-102 group-hover:shadow-2xl">
                        
                        {/* Image Container with zoom trigger */}
                        <div 
                          className="relative aspect-[3/4] sm:aspect-4/5 rounded-xl overflow-hidden bg-[#FAF6F0] cursor-pointer"
                          onClick={() => handleOpenLightbox(item)}
                        >
                          <img
                            src={item.photo}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                            style={{ objectPosition: item.objectPosition }}
                            loading="lazy"
                          />
                          
                          {/* Ambient gradient vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5 text-white">
                            <span className="text-[11px] font-mono tracking-wider">Tap to enlarge</span>
                            <Maximize2 size={16} className="text-[#FAF6F0]" />
                          </div>
                        </div>

                        {/* Handwritten Polaroid Caption */}
                        <div className="pt-3 text-center flex items-center justify-between px-1">
                          <span className="font-handwriting text-xl sm:text-2xl text-[#1E1B18] group-hover:text-[#C4738B] transition-colors">
                            "{item.title}"
                          </span>
                          <button
                            onClick={() => handleOpenLightbox(item)}
                            className="p-1 rounded-full hover:bg-[#FAF6F0] text-[#726860] hover:text-[#1E1B18] transition-colors"
                            title="Inspect Photo"
                          >
                            <Camera size={15} />
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* Story Column (7 cols on lg) */}
                  <div className="lg:col-span-7 space-y-5 text-left">
                    
                    {/* Chapter Metadata */}
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-xs font-mono tracking-widest uppercase">
                        <Calendar size={13} />
                        Milestone {item.chapter} of 04
                      </div>

                      <h3 className="text-2xl sm:text-4xl font-display font-medium text-[#1E1B18] leading-tight">
                        {item.title}
                      </h3>
                    </div>

                    {/* Editorial Description */}
                    <p className="text-base sm:text-lg font-serif text-[#1E1B18]/80 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Interactive Sibling Retrospective Note Accordion */}
                    <div className="pt-2">
                      <div className="bg-[#FAF6F0] rounded-2xl border border-[#C5A059]/30 overflow-hidden shadow-sm transition-all duration-300">
                        
                        <button
                          onClick={() => toggleSecretNote(idx)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#F4E8D5]/40 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <MessageSquareQuote size={16} className="text-[#C5A059] group-hover:scale-110 transition-transform" />
                            <span className="font-mono text-xs uppercase tracking-wider text-[#1E1B18] font-bold">
                              Secret Retrospective
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[#C5A059] font-mono text-xs">
                            <span>{isNoteOpen ? "Collapse" : "Read Note"}</span>
                            <ChevronDown 
                              size={14} 
                              className={`transition-transform duration-300 ${isNoteOpen ? 'rotate-180' : 'rotate-0'}`} 
                            />
                          </div>
                        </button>

                        {isNoteOpen && (
                          <div className="px-5 pb-4 pt-1 text-sm font-serif italic text-[#726860] border-t border-[#C5A059]/20 animate-fade-in leading-relaxed">
                            <p className="text-[#C4738B] font-medium">
                              "{item.secretNote}"
                            </p>
                            <span className="text-[10px] font-mono text-[#C5A059] block mt-2 uppercase tracking-widest">
                              — Verified Memory Log
                            </span>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Quick navigation to next milestone */}
                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#726860]">
                      <span className="italic font-serif">
                        Scroll down to layer next chapter ↓
                      </span>
                      {idx < enrichedMilestones.length - 1 && (
                        <button
                          onClick={() => scrollToChapter(idx + 1)}
                          className="hover:text-[#1E1B18] hover:underline cursor-pointer flex items-center gap-1 text-[#C5A059] font-bold"
                        >
                          Next: {enrichedMilestones[idx + 1].year} →
                        </button>
                      )}
                    </div>

                  </div>

                </div>

                {/* Subtle corner gold brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#C5A059]/30 rounded-tl pointer-events-none" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#C5A059]/30 rounded-tr pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#C5A059]/30 rounded-bl pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#C5A059]/30 rounded-br pointer-events-none" />

              </div>
            </div>
          );
        })}
      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={handleCloseLightbox}
        >
          <div 
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#C5A059]/40 shadow-2xl space-y-4 animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between border-b border-[#1E1B18]/10 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark size={16} className="text-[#C5A059]" />
                <span className="font-mono text-xs font-bold text-[#1E1B18] tracking-widest uppercase">
                  ARCHIVAL FOCUS • {lightboxPhoto.year}
                </span>
              </div>
              <button 
                onClick={handleCloseLightbox}
                className="p-1.5 rounded-full hover:bg-[#FAF6F0] text-[#726860] hover:text-[#1E1B18] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Photo */}
            <div className="w-full max-h-[480px] rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#1E1B18]/10 flex items-center justify-center">
              <img
                src={lightboxPhoto.photo}
                alt={lightboxPhoto.title}
                className="w-full h-full object-cover max-h-[480px]"
                style={{ objectPosition: lightboxPhoto.objectPosition }}
              />
            </div>

            {/* Captions */}
            <div className="space-y-1.5 text-center">
              <h4 className="font-display font-semibold text-2xl text-[#1E1B18]">
                "{lightboxPhoto.title}"
              </h4>
              <p className="font-serif italic text-sm sm:text-base text-[#726860] max-w-lg mx-auto">
                {lightboxPhoto.description}
              </p>
              <p className="font-serif italic text-xs sm:text-sm text-[#C4738B] pt-1">
                "{lightboxPhoto.secretNote}"
              </p>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={handleCloseLightbox}
                className="px-6 py-2 rounded-full bg-[#1E1B18] text-white text-xs font-sans tracking-wide hover:bg-[#C5A059] transition-colors cursor-pointer"
              >
                Return to Timeline
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
