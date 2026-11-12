import React, { useState } from 'react';
import BackgroundEffects from './components/BackgroundEffects';
import YouTubeMusicPlayer from './components/YouTubeMusicPlayer';
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
  // Opening flow states: 'opening' -> 'diagnostic' -> 'main'
  const [phase, setPhase] = useState('opening');

  const { activeEgg, triggerSisterNameClick, closeEgg } = useEasterEggs();

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
            <div className="max-w-md mx-auto space-y-2 px-4">
              <p className="font-serif italic text-sm">
                Crafted with care, patience, and 365 days of memories.
              </p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#C5A059]">
                Sai → G. Sivadhathri • Birthday Edition
              </p>
            </div>
          </footer>

        </main>
      )}

    </div>
  );
}
