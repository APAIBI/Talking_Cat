import React from 'react';
import { APP_STATE } from '../hooks/useAudioTalkback';

export function StatusIndicator({ appState, onRequestMic }) {
  switch (appState) {
    case APP_STATE.RECORDING:
      return (
        <div className="flex items-center gap-2.5 px-6 py-2.5 bg-rose-500 text-white font-bold rounded-full shadow-lg border-2 border-white animate-pulse">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-200"></span>
          </span>
          <span className="text-sm sm:text-base">🎙️ I hear you! Keep talking...</span>
        </div>
      );

    case APP_STATE.PROCESSING:
      return (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white font-bold rounded-full shadow-lg border-2 border-white">
          <span className="animate-spin text-lg">✨</span>
          <span className="text-sm sm:text-base">Hold on! Getting funny voice ready...</span>
        </div>
      );

    case APP_STATE.SPEAKING:
      return (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-bubble-purple text-white font-bold rounded-full shadow-lg border-2 border-white animate-bounce-gentle">
          <span className="text-lg">📢</span>
          <span className="text-sm sm:text-base">Listen! I am repeating you!</span>
        </div>
      );

    case APP_STATE.PERMISSION_DENIED:
      return (
        <button
          onClick={onRequestMic}
          className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full shadow-lg border-2 border-white transition-transform active:scale-95"
        >
          <span>🎤</span>
          <span className="text-sm sm:text-base">Click to Enable Microphone</span>
        </button>
      );

    case APP_STATE.LISTENING:
    default:
      return (
        <div className="flex items-center gap-2.5 px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-full shadow-lg border-2 border-white">
          <span className="inline-block w-3 h-3 bg-white rounded-full animate-ping"></span>
          <span className="text-sm sm:text-base">👂 I'm listening! Say anything!</span>
        </div>
      );
  }
}
