import React from 'react';
import { APP_STATE } from '../hooks/useAudioTalkback';

export function AudioVisualizer({ audioLevel, appState, avatar }) {
  const isSpeaking = appState === APP_STATE.SPEAKING;
  const isRecording = appState === APP_STATE.RECORDING;

  // 7 kid-friendly jelly bounce bars
  const barMultipliers = [0.4, 0.75, 1.2, 1.6, 1.2, 0.75, 0.4];

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 h-14 px-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-inner border border-white/80 max-w-xs mx-auto">
      {barMultipliers.map((mult, idx) => {
        // Base minimum height so it always looks friendly and alive
        const baseHeight = 8;
        const dynamicBoost = (isRecording || isSpeaking) ? audioLevel * 38 * mult : 4;
        const heightPx = Math.min(48, Math.max(6, baseHeight + dynamicBoost));

        // Cheerful rainbow / candy bar colors
        const colors = [
          'bg-rose-400',
          'bg-amber-400',
          'bg-emerald-400',
          'bg-cyan-400',
          'bg-blue-400',
          'bg-violet-400',
          'bg-pink-400',
        ];

        return (
          <div
            key={idx}
            className={`w-2.5 sm:w-3 rounded-full transition-all duration-75 ${colors[idx % colors.length]} ${
              isRecording ? 'opacity-100 shadow-sm' : isSpeaking ? 'opacity-100 scale-105' : 'opacity-60'
            }`}
            style={{
              height: `${heightPx}px`,
            }}
          />
        );
      })}
    </div>
  );
}
