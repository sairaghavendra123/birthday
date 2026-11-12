import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Crown, 
  Heart, 
  Star, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Award, 
  Smile, 
  Gem,
  Camera,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';

export default function GorgeousTribute() {
  const { gorgeousTribute, friendName, sisterName } = birthdayConfig;
  const { cards, compliments, radarScore, badge, title, subtitle, friendNote, brotherNote } = gorgeousTribute;

  const [activePhotoIdx, setActivePhotoIdx] = useState(null);
  const [complimentIdx, setComplimentIdx] = useState(0);
  const [isGlowMode, setIsGlowMode] = useState(false);
  const [isCrownedModalOpen, setIsCrownedModalOpen] = useState(false);
  const [sparkleLikes, setSparkleLikes] = useState({});

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
    setActivePhotoIdx((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    soundFx.playClick();
    setActivePhotoIdx((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleNextCompliment = () => {
    soundFx.playHarmonicChime();
    setComplimentIdx((prev) => (prev + 1) % compliments.length);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#C5A059', '#C4738B', '#FCECEF', '#FAF6F0']
    });
  };

  const handleCardSparkle = (id, e) => {
    e.stopPropagation();
    soundFx.playHarmonicChime();
    setSparkleLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));

    // Micro sparkle burst at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { x, y },
      colors: ['#C5A059', '#C4738B', '#FCECEF']
    });
  };

  const toggleGlowMode = () => {
    soundFx.playClick();
    soundFx.playHarmonicChime();
    setIsGlowMode(!isGlowMode);
    if (!isGlowMode) {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#C5A059', '#C4738B', '#FFFDF9']
      });
    }
  };

  const handleCrownQueen = () => {
    soundFx.playCelebration();
    setIsCrownedModalOpen(true);

    // Multi-stage golden star and rose petal celebration
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.2, y: Math.random() - 0.2 },
        colors: ['#C5A059', '#F4E8D5', '#C4738B', '#FFD700']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.8, y: Math.random() - 0.2 },
        colors: ['#C5A059', '#F4E8D5', '#C4738B', '#FFD700']
      });
    }, 250);
  };

  return (
    <section 
      id="gorgeous-section" 
      className={`py-28 px-4 sm:px-8 max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${
        isGlowMode ? 'bg-radial from-[#FCECEF]/40 via-transparent to-transparent' : ''
      }`}
    >
      {/* Dynamic ambient gold/rose glow */}
      {isGlowMode && (
        <div className="absolute inset-0 -z-10 pointer-events-none animate-pulse">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-[#C5A059]/15 via-[#C4738B]/20 to-[#C5A059]/15 rounded-full filter blur-3xl opacity-70" />
        </div>
      )}

      {/* ================= BIG LEFT SIDE GIF: QUEEN OF HEARTS ================= */}
      <div className="hidden xl:flex flex-col items-center absolute -left-28 2xl:-left-44 top-32 z-20 animate-soft-float pointer-events-auto">
        <div 
          className="relative group cursor-pointer" 
          onClick={() => {
            soundFx.playHarmonicChime();
            confetti({ particleCount: 30, spread: 60, origin: { x: 0.1, y: 0.4 } });
          }}
        >
          <img 
            src="/gifs/peach-goma-peach-and-goma.gif" 
            alt="Queen of Hearts" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 shadow-xl text-xs font-mono text-[#1E1B18] font-bold tracking-wide">
            "QUEEN OF HEARTS 👑"
          </div>
          <span className="text-[10px] font-mono text-[#C4738B] block text-center mt-1 font-semibold">
            Effortlessly Gorgeous ✨
          </span>
        </div>
      </div>

      {/* ================= BIG RIGHT SIDE GIF: 100/10 BEAUTY ================= */}
      <div 
        className="hidden xl:flex flex-col items-center absolute -right-28 2xl:-right-44 top-44 z-20 animate-soft-float pointer-events-auto"
        style={{ animationDelay: '-3s' }}
      >
        <div 
          className="relative group cursor-pointer" 
          onClick={() => {
            soundFx.playCelebration();
            confetti({ particleCount: 35, spread: 70, origin: { x: 0.9, y: 0.5 } });
          }}
        >
          <img 
            src="/gifs/cute-cat-cute-kittens.gif" 
            alt="100/10 Beauty" 
            className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 object-contain rounded-3xl drop-shadow-2xl hover:scale-110 transition-transform" 
          />
          <div className="mt-3 text-center bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C4738B]/40 shadow-xl text-xs font-mono text-[#C4738B] font-bold tracking-wide">
            "100/10 BEAUTY ✨"
          </div>
          <span className="text-[10px] font-mono text-[#726860] block text-center mt-1">
            Official Verdict
          </span>
        </div>
      </div>

      {/* ================= SECTION HEADER ================= */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C5A059]/20 via-[#C4738B]/20 to-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono tracking-widest uppercase shadow-sm">
          <Sparkles size={14} className="text-[#C4738B] animate-spin" style={{ animationDuration: '8s' }} />
          {badge}
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-medium text-[#1E1B18] tracking-tight">
          Simply Beautiful • <span className="italic text-[#C4738B]">Forever Gorgeous</span>
        </h2>

        <p className="text-base sm:text-lg font-serif italic text-[#726860] max-w-2xl mx-auto leading-relaxed">
          "{friendNote || brotherNote}"
        </p>

        {/* Glow Mode Toggle Button */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={toggleGlowMode}
            className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 flex items-center gap-2 shadow-sm ${
              isGlowMode 
                ? 'bg-gradient-to-r from-[#C5A059] to-[#C4738B] text-white shadow-lg scale-105' 
                : 'bg-white/80 hover:bg-[#FAF6F0] text-[#726860] border border-[#C5A059]/30'
            }`}
          >
            <Crown size={14} className={isGlowMode ? 'text-white' : 'text-[#C5A059]'} />
            {isGlowMode ? '✨ Queen Glow Aura: ACTIVE' : '✨ Turn On Queen Glow Aura'}
          </button>
        </div>
      </div>

      {/* ================= EDITORIAL PORTRAIT CARDS (CURATED LOOKS) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 mb-20">
        {cards.map((card, idx) => {
          const likes = sparkleLikes[card.id] || 0;
          const colSpanClass = cards.length === 5 
            ? idx < 3 
              ? 'lg:col-span-2' 
              : idx === 3 
                ? 'lg:col-span-2 lg:col-start-2 md:col-span-1' 
                : 'lg:col-span-2 md:col-span-2 md:max-w-md md:mx-auto w-full lg:max-w-none'
            : 'lg:col-span-2';

          return (
            <div
              key={card.id}
              onClick={() => handleOpenPhoto(idx)}
              className={`group relative bg-white/85 backdrop-blur-md rounded-3xl p-5 border border-[#C5A059]/25 hover:border-[#C4738B]/50 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 ${colSpanClass}`}
            >
              {/* Card Header Tag */}
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#C5A059] bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#C5A059]/20">
                  {card.tag}
                </span>
                <span className="text-xs font-serif italic text-[#726860]">
                  Look #{idx + 1}
                </span>
              </div>

              {/* Photo Frame */}
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden mb-4 bg-[#FAF6F0] shadow-inner group-hover:shadow-md transition-shadow">
                <img
                  src={card.photo}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter group-hover:contrast-105"
                  style={{ objectPosition: card.objectPosition }}
                  loading="lazy"
                />
                
                {/* Soft gradient bottom scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Inspect Button in Top Right */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-md text-[#1E1B18] p-2 rounded-full shadow-lg hover:bg-white">
                  <Maximize2 size={16} />
                </div>

                {/* Subtitle badge overlay on hover */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-serif italic drop-shadow-md">
                  "{card.subtitle}"
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-display font-semibold text-[#1E1B18] group-hover:text-[#C4738B] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-[#726860] leading-relaxed mt-1">
                    {card.caption}
                  </p>
                </div>

                {/* Stat Badges */}
                <div className="pt-3 border-t border-[#C5A059]/15 flex flex-wrap items-center gap-2">
                  {Object.entries(card.stats).map(([k, val]) => (
                    <span 
                      key={k} 
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FCECEF]/60 text-[#C4738B] font-medium border border-[#C4738B]/15"
                    >
                      {val}
                    </span>
                  ))}
                </div>

                {/* Micro-sparkle reaction button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#726860]">
                    Tap photo to view 4K
                  </span>
                  <button
                    onClick={(e) => handleCardSparkle(card.id, e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF6F0] hover:bg-[#FCECEF] text-xs font-mono text-[#C4738B] transition-all hover:scale-105 border border-[#C4738B]/25"
                    title="Send sparkles to this look"
                  >
                    <Sparkles size={12} className={likes > 0 ? "fill-[#C4738B]" : ""} />
                    <span>{likes > 0 ? `${likes} ✨` : "Admire ✨"}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ================= INTERACTIVE GLOW SCORECARD & COMPLIMENT MACHINE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
        
        {/* Left: Compliment Dispenser (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-white/90 via-[#FAF6F0]/80 to-[#FCECEF]/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-xl flex flex-col justify-between relative overflow-hidden">
          
          {/* Decorative Background Quote Icon */}
          <Quote 
            size={120} 
            className="absolute -right-8 -bottom-8 text-[#C5A059]/10 pointer-events-none" 
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C4738B]/15 text-[#C4738B] text-xs font-mono font-medium">
                <Heart size={13} className="fill-[#C4738B]" />
                The Honest Truth
              </div>
              <span className="text-xs font-mono text-[#726860]">
                Reason {complimentIdx + 1} of {compliments.length}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#1E1B18]">
              Why Dhathri Is Truly Gorgeous
            </h3>

            {/* Compliment Display Box with cute badge */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/80 border border-[#C5A059]/20 shadow-sm relative min-h-[110px] flex items-center">
              <p className="text-base sm:text-lg font-serif italic text-[#1E1B18] leading-relaxed">
                "{compliments[complimentIdx]}"
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/gifs/goma-peach.gif" 
                alt="Cute reaction" 
                className="w-12 h-12 object-contain rounded-full border border-[#C5A059]/30 shadow-sm"
              />
              <span className="text-xs font-mono text-[#726860]">
                Curated by Sai
              </span>
            </div>

            <button
              onClick={handleNextCompliment}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#C4738B] hover:from-[#B08C45] hover:to-[#AF5F77] text-white text-xs font-mono font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <RefreshCw size={14} className="animate-spin-once" />
              Next Gorgeous Truth ✨
            </button>
          </div>

        </div>

        {/* Right: The Glow Radar / Scorecard (5 cols) */}
        <div className="lg:col-span-5 bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#C5A059]/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-xs font-mono font-medium mb-4">
              <Award size={13} />
              The Official Scorecard
            </div>
            
            <h3 className="text-2xl font-display font-medium text-[#1E1B18] mb-1">
              Glow Matrix
            </h3>
            <p className="text-xs font-serif italic text-[#726860] mb-6">
              Empirical laboratory results calculated across 20+ years of shared life.
            </p>

            <div className="space-y-4">
              {radarScore.map((item, i) => (
                <div 
                  key={i} 
                  className="p-3.5 rounded-2xl bg-[#FAF6F0]/80 border border-[#C5A059]/15 flex items-center justify-between hover:bg-[#FCECEF]/40 transition-colors"
                >
                  <div>
                    <div className="text-xs font-mono font-semibold text-[#1E1B18] flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-[#C4738B]" />
                      {item.label}
                    </div>
                    <span className="text-[11px] font-serif italic text-[#726860]">
                      {item.desc}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#C5A059] bg-white px-2.5 py-1 rounded-full border border-[#C5A059]/30 shadow-xs">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#C5A059]/20 text-center">
            <span className="text-[11px] font-mono text-[#726860] tracking-wider uppercase">
              Final Verdict: S-Tier Royalty • 10/10
            </span>
          </div>
        </div>

      </div>

      {/* ================= GRAND CLIMAX: CROWN HER QUEEN BUTTON ================= */}
      <div className="text-center max-w-xl mx-auto pt-6 pb-4">
        <div className="relative inline-block group">
          
          {/* Shimmering button aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A059] via-[#C4738B] to-[#FFD700] rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
          
          <button
            onClick={handleCrownQueen}
            className="relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#1E1B18] to-[#3A332C] hover:from-[#2B2520] hover:to-[#4A4239] text-white rounded-full font-serif text-base sm:text-xl tracking-wide shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 border border-[#C5A059]/50"
          >
            <Crown size={24} className="text-[#FFD700] animate-bounce" />
            <span>Crown Dhathri Queen of the Universe 👑</span>
            <Sparkles size={20} className="text-[#C4738B]" />
          </button>
        </div>

        <p className="mt-3 text-xs font-mono text-[#726860]">
          *Warning: Clicking this grants unlimited boasting privileges for the next 365 days.
        </p>
      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      {activePhotoIdx !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setActivePhotoIdx(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#1E1B18] rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoIdx(null)}
              className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black text-white p-2.5 rounded-full backdrop-blur-sm transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left/Prev Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white p-2.5 rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right/Next Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black text-white p-2.5 rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Photo Container */}
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center p-2">
              <img
                src={cards[activePhotoIdx].photo}
                alt={cards[activePhotoIdx].title}
                className="max-h-[50vh] md:max-h-[80vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Information Sidebar */}
            <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-[#24201C] text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#C5A059] bg-[#C5A059]/15 px-3 py-1 rounded-full border border-[#C5A059]/30">
                    {cards[activePhotoIdx].tag}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-[#C4738B] bg-[#C4738B]/15 px-2.5 py-0.5 rounded-full border border-[#C4738B]/30">
                    ✦ 4K ULTRA-HD
                  </span>
                  <span className="text-xs font-mono text-[#A89F91]">
                    {activePhotoIdx + 1} / {cards.length}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#FFFDF9]">
                  {cards[activePhotoIdx].title}
                </h3>

                <p className="text-sm font-serif italic text-[#C5A059]">
                  "{cards[activePhotoIdx].subtitle}"
                </p>

                <p className="text-xs sm:text-sm text-[#D1C7BD] leading-relaxed font-sans">
                  {cards[activePhotoIdx].caption}
                </p>

                {/* Stat pills in modal */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {Object.entries(cards[activePhotoIdx].stats).map(([k, v]) => (
                    <span 
                      key={k}
                      className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-md text-[#FCECEF] border border-white/10"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#A89F91]">
                  G. Sivadhathri • Birthday Edition
                </span>
                <button
                  onClick={(e) => handleCardSparkle(cards[activePhotoIdx].id, e)}
                  className="px-3.5 py-1.5 rounded-full bg-[#C4738B] hover:bg-[#AF5F77] text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all"
                >
                  <Sparkles size={13} />
                  Sparkle ✨
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= CROWNED CEREMONY MODAL ================= */}
      {isCrownedModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsCrownedModalOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#FCECEF] rounded-3xl p-8 border-2 border-[#C5A059] shadow-2xl text-center space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsCrownedModalOpen(false)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#1E1B18] p-2 rounded-full shadow-md transition-colors"
            >
              <X size={18} />
            </button>

            {/* Royal Crown Graphic */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#C5A059] to-[#FFD700] flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
              <Crown size={38} className="text-white drop-shadow-md" />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-3.5 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-mono font-bold tracking-widest uppercase">
                ROYAL BIRTHDAY DECREE
              </div>
              <h3 className="text-3xl font-display font-bold text-[#1E1B18]">
                Officially Crowned Queen 👑
              </h3>
              <p className="text-sm font-serif italic text-[#C4738B]">
                G. Sivadhathri — Simply Gorgeous
              </p>
            </div>

            {/* Cute GIF */}
            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-md">
              <img 
                src="/gifs/happy-friday-dance.gif" 
                alt="Celebration Dance" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-[#C5A059]/20 text-xs sm:text-sm font-sans text-[#726860] leading-relaxed">
              "By official proclamation, Sai acknowledges that despite all complaints, stolen fries, and playful banter, you remain undeniably radiant, an incredible best friend, and appreciated beyond measure. Happy Birthday, Dhathri! ✨"
            </div>

            <button
              onClick={() => {
                soundFx.playCelebration();
                confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
                setIsCrownedModalOpen(false);
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#C4738B] to-[#C5A059] text-white font-serif text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-102"
            >
              Long Live the Queen! ✨🎉
            </button>

          </div>
        </div>
      )}

    </section>
  );
}
