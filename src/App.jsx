import React, { useState, useRef } from 'react';
import { AVATARS } from './constants/avatars';
import { useAudioTalkback } from './hooks/useAudioTalkback';
import { TitleBar } from './components/TitleBar';
import { StatusIndicator } from './components/StatusIndicator';
import { AvatarDisplay } from './components/AvatarDisplay';
import { AudioVisualizer } from './components/AudioVisualizer';
import { AvatarSelector } from './components/AvatarSelector';
import { ToddlerLockOverlay } from './components/ToddlerLockOverlay';
import { playBubblePop } from './audio/soundEffects';

export default function App() {
  // Current active character (Rocky the Husky default)
  const [activeAvatar, setActiveAvatar] = useState(AVATARS[0]);
  const [isLocked, setIsLocked] = useState(false);

  // Sound pop effect audio context cache
  const popAudioCtxRef = useRef(null);
  const handlePlayPop = () => {
    try {
      if (!popAudioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        popAudioCtxRef.current = new AudioContextClass();
      }
      playBubblePop(popAudioCtxRef.current);
    } catch (_) {}
  };

  // Autonomous No-Tap Continuous Talkback Engine with Enhanced Noise Rejection
  const {
    appState,
    audioLevel,
    errorMessage,
    startListening,
  } = useAudioTalkback({
    avatarConfig: activeAvatar,
    autoListen: true,
  });

  const handleSelectAvatar = (avatar) => {
    setActiveAvatar(avatar);
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col bg-gradient-to-br ${activeAvatar.colorTheme.bgGradient} transition-colors duration-700 ease-in-out overflow-hidden`}
    >
      {/* Toddler Lock Screen Overlay (Active when locked, speech still functions 100%) */}
      <ToddlerLockOverlay
        isLocked={isLocked}
        onUnlock={() => {
          handlePlayPop();
          setIsLocked(false);
        }}
      />

      {/* Frameless Titlebar */}
      <TitleBar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-between p-3 sm:p-5 max-w-5xl mx-auto w-full gap-2">
        {/* Top Header: Status Badge + Toddler Lock Button */}
        <header className="w-full flex items-center justify-between z-20 px-2 sm:px-4">
          <div className="flex-1 flex justify-center">
            <StatusIndicator
              appState={appState}
              onRequestMic={startListening}
            />
          </div>

          {/* Toddler Lock Activation Button */}
          <button
            onClick={() => {
              handlePlayPop();
              setIsLocked(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-2xl shadow-md border-2 border-white transition-all transform active:scale-95 text-xs sm:text-sm"
            title="Lock screen for toddler"
          >
            <span>🔒</span>
            <span className="hidden sm:inline">Toddler Lock</span>
          </button>
        </header>

        {errorMessage && (
          <p className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
            {errorMessage}
          </p>
        )}

        {/* Center: Full-Body Realistic Character Stage */}
        <section className="flex-1 flex flex-col items-center justify-center w-full relative">
          <AvatarDisplay
            avatar={activeAvatar}
            appState={appState}
            audioLevel={audioLevel}
          />

          <div className="w-full mt-2">
            <AudioVisualizer
              audioLevel={audioLevel}
              appState={appState}
              avatar={activeAvatar}
            />
          </div>
        </section>

        {/* Bottom Control Deck: Character Switcher (Pitch controls cleanly removed) */}
        <footer className="w-full flex flex-col items-center gap-2 z-20">
          <AvatarSelector
            activeAvatar={activeAvatar}
            onSelectAvatar={handleSelectAvatar}
            onPlayPop={handlePlayPop}
          />
        </footer>
      </main>
    </div>
  );
}
