import React, { useState, useEffect, useRef } from 'react';

/**
 * Toddler Lock Screen:
 * - Simple, effective, phone-style lock screen.
 * - Blocks all accidental taps/swipes so toddlers cannot change settings or exit.
 * - All interactive audio features (listening, mouth animation, talkback mimicry)
 *   continue working completely unimpeded!
 * - Child-proof "Slide to Unlock" mechanism.
 */
export function ToddlerLockOverlay({ isLocked, onUnlock }) {
  const [sliderPosition, setSliderPosition] = useState(0); // 0 to 100%
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const isDraggingRef = useRef(false);
  const trackRef = useRef(null);

  // Update clock display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isLocked) return null;

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    e.stopPropagation();
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const offset = clientX - rect.left - 24; // 24 = half handle
    const maxOffset = rect.width - 56;
    const percentage = Math.max(0, Math.min(100, (offset / maxOffset) * 100));
    setSliderPosition(percentage);

    if (percentage > 85) {
      // Unlocked!
      isDraggingRef.current = false;
      setSliderPosition(0);
      onUnlock();
    }
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setSliderPosition(0); // Snap back if not reached end
    }
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className="absolute inset-0 z-50 flex flex-col justify-between items-center p-6 bg-slate-950/35 backdrop-blur-[2px] select-none touch-none"
    >
      {/* Top: Default Phone Lock Screen Clock & Date */}
      <div className="flex flex-col items-center mt-6 text-white drop-shadow-md animate-fade-in pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full mb-3 text-xs font-bold border border-white/20">
          <span>🔒</span>
          <span>Toddler Safe Lock Active</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight">{currentTime}</h1>
        <p className="text-sm sm:text-base font-medium opacity-90 mt-1">{currentDate}</p>
        <p className="text-xs text-amber-200 mt-2 font-semibold bg-black/30 px-3 py-0.5 rounded-full">
          ✨ Still listening! Talk freely to your companion
        </p>
      </div>

      {/* Center is left transparent so the toddler sees the full character listening and talking back! */}
      <div className="flex-1 pointer-events-none" />

      {/* Bottom: Classic "Slide to Unlock" Slider Track */}
      <div className="w-full max-w-xs mb-4">
        <div
          ref={trackRef}
          className="relative h-14 bg-black/50 border-2 border-white/30 rounded-full flex items-center px-2 overflow-hidden backdrop-blur-md shadow-2xl"
        >
          {/* Shimmering Text Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm font-bold text-white/70 tracking-widest uppercase animate-pulse">
              Slide to Unlock ➔
            </span>
          </div>

          {/* Draggable Unlock Handle */}
          <div
            onPointerDown={handlePointerDown}
            onTouchStart={handlePointerDown}
            style={{
              transform: `translateX(${sliderPosition * 2.2}px)`,
              transition: isDraggingRef.current ? 'none' : 'transform 0.25s ease-out',
            }}
            className="w-11 h-11 bg-white text-slate-800 rounded-full flex items-center justify-center font-bold shadow-lg cursor-grab active:cursor-grabbing border-2 border-amber-300 z-10"
          >
            🔓
          </div>
        </div>
      </div>
    </div>
  );
}
