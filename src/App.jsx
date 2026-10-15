import React, { useState, useRef } from 'react';
import { AVATARS } from './constants/avatars';
import { useAudioTalkback } from './hooks/useAudioTalkback';
import { TitleBar } from './components/TitleBar';
import { StatusIndicator } from './components/StatusIndicator';
import { AvatarDisplay } from './components/AvatarDisplay';
import { AudioVisualizer } from './components/AudioVisualizer';
import { AvatarSelector } from './components/AvatarSelector';
import { VoiceModulator } from './components/VoiceModulator';
import { playBubblePop } from './audio/soundEffects';

export default function App() {
  // Current active character (Male Cat default)
  const [activeAvatar, setActiveAvatar] = useState(AVATARS[0]);

  // Active voice modulation settings
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: AVATARS[0].defaultPitch,
    speed: AVATARS[0].defaultSpeed,
    robot: AVATARS[0].defaultRobot,
    echo: AVATARS[0].defaultEcho,
    presetId: AVATARS[0].defaultVoicePreset,
    formantBoostHz: 2800,
    resonance: 3.0,
  });

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

  // Autonomous No-Tap Continuous Talkback Engine
  const {
    appState,
    audioLevel,
    errorMessage,
    startListening,
  } = useAudioTalkback({
    avatarConfig: activeAvatar,
    customVoiceSettings: voiceSettings,
    autoListen: true,
  });

  // Handle switching avatar
  const handleSelectAvatar = (avatar) => {
    setActiveAvatar(avatar);
    setVoiceSettings({
      pitch: avatar.defaultPitch,
      speed: avatar.defaultSpeed,
      robot: avatar.defaultRobot,
      echo: avatar.defaultEcho,
      presetId: avatar.defaultVoicePreset,
      formantBoostHz: avatar.id === 'dog' ? 650 : avatar.id === 'female-cat' ? 3400 : 2800,
      resonance: avatar.id === 'female-cat' ? 4.0 : 3.0,
    });
  };

  // Reset current voice settings to avatar defaults
  const handleResetToAvatar = () => {
    setVoiceSettings({
      pitch: activeAvatar.defaultPitch,
      speed: activeAvatar.defaultSpeed,
      robot: activeAvatar.defaultRobot,
      echo: activeAvatar.defaultEcho,
      presetId: activeAvatar.defaultVoicePreset,
      formantBoostHz: activeAvatar.id === 'dog' ? 650 : activeAvatar.id === 'female-cat' ? 3400 : 2800,
      resonance: activeAvatar.id === 'female-cat' ? 4.0 : 3.0,
    });
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col bg-gradient-to-br ${activeAvatar.colorTheme.bgGradient} transition-colors duration-700 ease-in-out`}
    >
      {/* Frameless Titlebar */}
      <TitleBar />

      {/* Main App Container */}
      <main className="flex-1 flex flex-col items-center justify-between p-3 sm:p-5 max-w-5xl mx-auto w-full gap-3">
        {/* Top: Status Badge */}
        <header className="flex flex-col items-center gap-1.5 z-20">
          <StatusIndicator
            appState={appState}
            onRequestMic={startListening}
          />
          {errorMessage && (
            <p className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
              {errorMessage}
            </p>
          )}
        </header>

        {/* Center: Animated Interactive Avatar & Audio Visualizer */}
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

        {/* Bottom Control Deck: Character Selector + Voice Modulation */}
        <footer className="w-full flex flex-col items-center gap-3 z-20">
          {/* Avatar Switcher Bar */}
          <AvatarSelector
            activeAvatar={activeAvatar}
            onSelectAvatar={handleSelectAvatar}
            onPlayPop={handlePlayPop}
          />

          {/* Voice Modulation Deck */}
          <VoiceModulator
            activeSettings={voiceSettings}
            onChangeSettings={setVoiceSettings}
            onResetToAvatar={handleResetToAvatar}
            avatar={activeAvatar}
            onPlayPop={handlePlayPop}
          />
        </footer>
      </main>
    </div>
  );
}
