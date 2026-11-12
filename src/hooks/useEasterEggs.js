import { useState, useEffect } from 'react';
import { soundFx } from './useSoundEffects';

export function useEasterEggs() {
  const [activeEgg, setActiveEgg] = useState(null);
  const [nameClicks, setNameClicks] = useState(0);

  // Keyboard sequence listener: B-F-F
  useEffect(() => {
    let buffer = [];
    const targetSequence = ['b', 'f', 'f'];

    const handleKeyDown = (e) => {
      // Ignore if inside an input or textarea
      if (['input', 'textarea'].includes(e.target.tagName.toLowerCase())) return;

      buffer.push(e.key.toLowerCase());
      if (buffer.length > targetSequence.length) {
        buffer.shift();
      }

      if (buffer.join('') === targetSequence.join('')) {
        soundFx.playCelebration();
        setActiveEgg({
          title: "SECRET EASTER EGG UNLOCKED 🔑",
          message: "Certified best friend.",
          subtext: "(The truest teammate and best friend in every adventure.)"
        });
        buffer = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 5 clicks on name
  const triggerNameClick = () => {
    const nextCount = nameClicks + 1;
    setNameClicks(nextCount);

    if (nextCount === 5) {
      soundFx.playDiagnosticBeep(false);
      setActiveEgg({
        title: "OBSERVATION DETECTED 👁️",
        message: "Why are you clicking your own name? 😭",
        subtext: "Are you expecting an achievement trophy or something?"
      });
      setNameClicks(0);
    }
  };

  const closeEgg = () => {
    soundFx.playClick();
    setActiveEgg(null);
  };

  return {
    activeEgg,
    triggerNameClick,
    triggerSisterNameClick: triggerNameClick,
    closeEgg
  };
}
