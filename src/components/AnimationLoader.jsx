import React, { useEffect, useRef, useState } from 'react';
import './animationLoader.css';

function createCubicBezier(x1, y1, x2, y2) {
  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let s = t;
    for (let i = 0; i < 8; i++) {
      const currentX = 3 * (1 - s) * (1 - s) * s * x1 + 3 * (1 - s) * s * s * x2 + s * s * s;
      const currentSlope =
        3 * (1 - s) * (1 - s) * x1 + 6 * (1 - s) * s * (x2 - x1) + 3 * s * s * (1 - x2);
      if (Math.abs(currentSlope) < 1e-5) break;
      s -= (currentX - t) / currentSlope;
      s = Math.max(0, Math.min(1, s));
    }
    return 3 * (1 - s) * (1 - s) * s * y1 + 3 * (1 - s) * s * s * y2 + s * s * s;
  };
}

const easeCurve = createCubicBezier(0.12, 0.23, 0.5, 1.0);

/**
 * Full-screen editorial loader curtain ("dhathri®", progress bar, 0–100% counter)
 * that slides upward with a curved reveal into the opening experience.
 */
export default function AnimationLoader({
  brand = 'dhathri',
  badge = '®',
  durationMs = 3000,
  onReveal,
  onComplete,
}) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    onRevealRef.current = onReveal;
    onCompleteRef.current = onComplete;
  }, [onReveal, onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    const countEl = countRef.current;
    if (!root || !bar || !countEl) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const duration = reduce ? 200 : durationMs;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    let rafId = 0;
    let fallbackTimer = 0;
    let exitStartTimer = 0;
    let exitDoneTimer = 0;
    let startTime = null;
    let isExited = false;

    const finishLoader = () => {
      if (isExited) return;
      isExited = true;
      cancelAnimationFrame(rafId);
      clearTimeout(fallbackTimer);

      countEl.textContent = '100';
      bar.style.width = '100%';
      root.setAttribute('aria-valuenow', '100');

      exitStartTimer = window.setTimeout(() => {
        onRevealRef.current?.();
        setIsExiting(true);
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;

        exitDoneTimer = window.setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
          onCompleteRef.current?.();
        }, reduce ? 250 : 650);
      }, reduce ? 20 : 100);
    };

    const tick = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeCurve(t);
      const currentCount = Math.min(100, Math.round(eased * 100));

      countEl.textContent = String(currentCount);
      bar.style.width = `${(eased * 100).toFixed(2)}%`;
      root.setAttribute('aria-valuenow', String(currentCount));

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        finishLoader();
      }
    };

    if (reduce) {
      finishLoader();
    } else {
      rafId = requestAnimationFrame(tick);
      fallbackTimer = window.setTimeout(finishLoader, duration + 1200);
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(fallbackTimer);
      clearTimeout(exitStartTimer);
      clearTimeout(exitDoneTimer);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [durationMs]);

  return (
    <div
      ref={rootRef}
      id="framerLoader"
      className={`framer-loader-root ${isExiting ? 'loader-exit' : ''}`}
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading site"
    >
      <div className="framer-loader-top">
        <div className="framer-loader-brand">
          {brand}
          {badge && <span className="framer-brand-reg">{badge}</span>}
        </div>
      </div>

      <div className="framer-loader-mid">
        <div className="framer-bar-mask">
          <div className="framer-bar-line" ref={barRef} id="framerBarLine" />
        </div>
      </div>

      <div className="framer-loader-bottom">
        <div className="framer-counter-wrap">
          <span className="framer-counter-num" ref={countRef} id="framerCountNum">
            0
          </span>
          <span className="framer-counter-pct">%</span>
        </div>
      </div>
    </div>
  );
}
