import React, { useState, useRef } from 'react';
import BackgroundEffects from './components/BackgroundEffects';
import YouTubeMusicPlayer, { startYouTubeMusic } from './components/YouTubeMusicPlayer';
import ButterflyEffectIntro from './components/ButterflyEffectIntro';
import OpeningExperience from './components/OpeningExperience';
import SystemDiagnostic from './components/SystemDiagnostic';
import CinematicIntro from './components/CinematicIntro';
import ComplaintDepartment from './components/ComplaintDepartment';
import FilmStrip from './components/FilmStrip';
import EmotionalTransition from './components/EmotionalTransition';
import EnvelopeLetter from './components/EnvelopeLetter';
import PhotoMontage from './components/PhotoMontage';
import BirthdayFinale from './components/BirthdayFinale';
import SecretButton from './components/SecretButton';
import PhotoWall from './components/PhotoWall';
import GorgeousTribute from './components/GorgeousTribute';
import EasterEggs from './components/EasterEggs';
import { useEasterEggs } from './hooks/useEasterEggs';

export default function App() {
  // Opening flow states: 'butterfly' -> 'opening' -> 'diagnostic' -> 'main'
  const [phase, setPhase] = useState('butterfly');
  const [butterflyReturnPhase, setButterflyReturnPhase] = useState(null);
  const savedScrollRef = useRef(0);

  const { activeEgg, triggerSisterNameClick, closeEgg } = useEasterEggs();

  const handleButterflyFinished = () => {
    if (butterflyReturnPhase) {
      const targetPhase = butterflyReturnPhase;
      setButterflyReturnPhase(null);
      setPhase(targetPhase);
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollRef.current, behavior: 'auto' });
      });
    } else {
      setPhase('opening');
    }
  };

  const handleReplayButterfly = () => {
    savedScrollRef.current = window.scrollY || 0;
    setButterflyReturnPhase(phase);
    setPhase('butterfly');
  };

  const handleOpeningFinished = () => {
    setPhase('diagnostic');
  };

  const handleDiagnosticFinished = () => {
    setPhase('main');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FFFDF9] text-[#1E1B18] overflow-x-hidden selection:bg-[#E8D5C4] selection:text-[#1E1B18]">
      
      {/* Background ambient lighting and film grain */}
      <BackgroundEffects />

      {/* YouTube Background Music Player (Audio only, starts on continue) */}
      <YouTubeMusicPlayer />

      {/* Easter Egg Modal */}
      <EasterEggs activeEgg={activeEgg} onClose={closeEgg} />

      {/* PHASE 0: Cinematic 3D Butterfly Effect Universe */}
      {phase === 'butterfly' && (
        <ButterflyEffectIntro
          onComplete={handleButterflyFinished}
          onStartMusic={startYouTubeMusic}
        />
      )}

      {/* PHASE 1: Minimal Anticipation Opening */}
      {phase === 'opening' && (
        <OpeningExperience onComplete={handleOpeningFinished} />
      )}

      {/* PHASE 2: Apple-Grade Diagnostic Scanner */}
      {phase === 'diagnostic' && (
        <SystemDiagnostic onComplete={handleDiagnosticFinished} />
      )}

      {/* PHASE 3: The Complete Story Experience */}
      {phase === 'main' && (
        <main className="relative z-10 animate-fade-in">
          
          {/* Section 7: Cinematic Introduction */}
          <CinematicIntro onNext={() => scrollToSection('complaints-section')} />

          {/* Section 8: The Official Best-Friend Complaint Department */}
          <ComplaintDepartment />

          {/* Section 12: Draggable Film Strip */}
          <FilmStrip />

          {/* Section 13: Things I Will Never Say Out Loud (Emotional Transition) */}
          <EmotionalTransition />

          {/* Section 14: The Unfolding Letter */}
          <EnvelopeLetter />

          {/* Section 15: Emotional Photo Montage */}
          <PhotoMontage />

          {/* Section 16: Final Birthday Celebration */}
          <BirthdayFinale onSisterNameClick={triggerSisterNameClick} />

          {/* Section 17: Secret "DO NOT CLICK" Button */}
          <SecretButton />

          {/* Section 18: Living Memory Wall Gallery with Lightbox */}
          <PhotoWall />

          {/* Section 19: The Beautiful & Gorgeous Chapter */}
          <GorgeousTribute />

          {/* Footer */}
          <footer className="py-16 text-center text-[#726860] border-t border-[#C5A059]/20 relative z-10">
            <div className="max-w-md mx-auto space-y-3 px-4">
              <p className="font-serif italic text-sm">
                Crafted with care, patience, and 365 days of memories.
              </p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#C5A059]">
                Sai → G. Sivadhathri • Birthday Edition
              </p>
              <button
                type="button"
                onClick={handleReplayButterfly}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 hover:bg-[#FAF6F0] border border-[#C5A059]/30 text-[11px] font-mono uppercase tracking-wider text-[#C5A059] shadow-sm hover:scale-105 transition-all cursor-pointer"
              >
                ✦ Replay Butterfly Effect
              </button>
            </div>
          </footer>

          {/* Subtle Floating Replay Butterfly Intro Pill */}
          <button
            type="button"
            onClick={handleReplayButterfly}
            aria-label="Replay Butterfly Intro"
            title="Replay Butterfly Effect Intro"
            className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 px-3.5 py-2.5 rounded-full bg-[#150826]/90 hover:bg-[#240D42] text-[#F4E8D5] backdrop-blur-md border border-[#C5A059]/40 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider cursor-pointer"
          >
            <span className="text-[#F5C451]" aria-hidden="true">🦋</span>
            <span className="hidden sm:inline">Butterfly Intro</span>
            <span className="sm:hidden">Intro</span>
          </button>

        </main>
      )}

    </div>
  );
}
