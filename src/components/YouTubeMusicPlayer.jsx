import React, { useState, useEffect, useRef } from 'react';

let globalPlayer = null;
let pendingPlay = false;
let listeners = new Set();

export const startYouTubeMusic = () => {
  pendingPlay = true;
  listeners.forEach(fn => fn(true));
  if (globalPlayer && typeof globalPlayer.playVideo === 'function') {
    try {
      globalPlayer.playVideo();
    } catch (e) {
      console.warn('Error starting YouTube music:', e);
    }
  }
};

export default function YouTubeMusicPlayer({ shouldPlay }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const handleMusicStart = () => {
      setHasStarted(true);
      setIsPlaying(true);
    };

    listeners.add(handleMusicStart);
    return () => {
      listeners.delete(handleMusicStart);
    };
  }, []);

  // If shouldPlay prop is triggered
  useEffect(() => {
    if (shouldPlay) {
      startYouTubeMusic();
    }
  }, [shouldPlay]);

  useEffect(() => {
    // Append player container imperatively so YouTube iframe doesn't clash with React VDOM
    if (containerRef.current && !containerRef.current.hasChildNodes()) {
      const playerDiv = document.createElement('div');
      playerDiv.id = 'yt-audio-player-node';
      containerRef.current.appendChild(playerDiv);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        try {
          playerRef.current = new window.YT.Player('yt-audio-player-node', {
            videoId: 'dOKQeqGNJwY',
            width: '220',
            height: '220',
            playerVars: {
              loop: 1,
              playlist: 'dOKQeqGNJwY',
              playsinline: 1,
              origin: window.location.origin
            },
            events: {
              onReady: (event) => {
                globalPlayer = event.target;
                if (pendingPlay) {
                  try {
                    event.target.playVideo();
                    setHasStarted(true);
                    setIsPlaying(true);
                  } catch (e) {}
                }
              },
              onStateChange: (event) => {
                // YT.PlayerState.PLAYING is 1, PAUSED is 2, ENDED is 0
                if (event.data === 1) {
                  setHasStarted(true);
                  setIsPlaying(true);
                } else if (event.data === 2) {
                  setIsPlaying(false);
                }
              }
            }
          });
          globalPlayer = playerRef.current;
        } catch (e) {
          console.warn('Error initializing YT Player:', e);
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };

      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
    }
  }, []);

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    const p = playerRef.current || globalPlayer;
    if (!p) return;

    try {
      if (isPlaying) {
        if (typeof p.pauseVideo === 'function') {
          p.pauseVideo();
          setIsPlaying(false);
        }
      } else {
        if (typeof p.playVideo === 'function') {
          p.playVideo();
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.warn('Toggle play error:', err);
    }
  };

  return (
    <>
      {/* Off-screen YouTube Player container (Audio only: 100% invisible, no video box on screen) */}
      <div 
        ref={containerRef}
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '220px',
          height: '220px',
          opacity: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Floating 48px round Audio Control button in bottom-right corner once music starts */}
      {hasStarted && (
        <button
          id="music-toggle-btn"
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title={isPlaying ? 'Pause music' : 'Play music'}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-12 h-12 rounded-full bg-white/95 backdrop-blur-md border border-[#C5A059]/30 shadow-lg shadow-[#C4738B]/10 hover:shadow-xl hover:shadow-[#C4738B]/20 hover:border-[#C4738B]/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
        >
          <span className="text-xl select-none transition-transform duration-300 group-hover:scale-110">
            {isPlaying ? '🔊' : '🔇'}
          </span>
        </button>
      )}
    </>
  );
}
