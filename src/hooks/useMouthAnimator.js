import { useState, useEffect, useRef } from 'react';
import { APP_STATE } from './useAudioTalkback';

/**
 * Hook to coordinate character facial animation:
 * - Natural eye blinking intervals
 * - Mouth height interpolation driven by audio speech levels
 * - Head tilt / breathing bounce
 */
export function useMouthAnimator(appState, audioLevel) {
  const [mouthOpen, setMouthOpen] = useState(0.05); // 0.0 (closed) to 1.0 (wide open)
  const [isBlinking, setIsBlinking] = useState(false);
  const targetMouthRef = useRef(0.05);
  const currentMouthRef = useRef(0.05);

  // Random natural eye blink timer
  useEffect(() => {
    let blinkTimeout;

    const scheduleNextBlink = () => {
      // Blink every 2.5 to 5.5 seconds
      const nextDelay = 2500 + Math.random() * 3000;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 160); // 160ms blink duration
      }, nextDelay);
    };

    scheduleNextBlink();

    return () => {
      if (blinkTimeout) clearTimeout(blinkTimeout);
    };
  }, []);

  // Update target mouth openness based on state & audio level
  useEffect(() => {
    if (appState === APP_STATE.SPEAKING) {
      // Map audio level (0.0 to 1.0) to mouth opening (0.1 to 1.0)
      const mapped = Math.min(1.0, Math.max(0.12, audioLevel * 1.6));
      targetMouthRef.current = mapped;
    } else if (appState === APP_STATE.RECORDING) {
      // Slight attentive open mouth when listening actively
      targetMouthRef.current = 0.15;
    } else {
      // Idle closed / friendly gentle curve
      targetMouthRef.current = 0.05;
    }
  }, [appState, audioLevel]);

  // Smooth frame interpolation (Lerp)
  useEffect(() => {
    let animId;

    const lerpMouth = () => {
      const smoothing = 0.35;
      currentMouthRef.current =
        currentMouthRef.current + (targetMouthRef.current - currentMouthRef.current) * smoothing;
      setMouthOpen(currentMouthRef.current);
      animId = requestAnimationFrame(lerpMouth);
    };

    animId = requestAnimationFrame(lerpMouth);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return {
    mouthOpen,
    isBlinking,
  };
}
