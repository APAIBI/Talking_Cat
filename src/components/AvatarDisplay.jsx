import React from 'react';
import { useMouthAnimator } from '../hooks/useMouthAnimator';
import { APP_STATE } from '../hooks/useAudioTalkback';

/**
 * Realistic Full-Body Animated Character Display:
 * - Uncropped, head-to-toe / head-to-paw full body standing character.
 * - Dynamic audio-reactive mouth sync opening and closing during speech playback.
 * - Procedural eye-blinking overlays.
 * - Subtle lifelike breathing motion and illuminated studio floor shadow.
 */
export function AvatarDisplay({ avatar, appState, audioLevel }) {
  const { mouthOpen, isBlinking } = useMouthAnimator(appState, audioLevel);

  const isSpeaking = appState === APP_STATE.SPEAKING;
  const isRecording = appState === APP_STATE.RECORDING;
  const isListening = appState === APP_STATE.LISTENING;

  const { faceCoords } = avatar;

  // Dynamic mouth dimensions based on real-time audio volume
  const dynamicMouthHeight = Math.max(3, mouthOpen * 32);
  const isMouthActive = mouthOpen > 0.12 && isSpeaking;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[440px] sm:h-[480px] max-h-[52vh] select-none">
      {/* Background Soft Studio Aura */}
      <div
        className={`absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl transition-all duration-700 pointer-events-none opacity-40 ${
          isSpeaking
            ? 'bg-rose-400 scale-110'
            : isRecording
            ? 'bg-emerald-400 scale-105'
            : isListening
            ? 'bg-amber-300 scale-100'
            : 'bg-indigo-200 scale-95'
        }`}
      />

      {/* Main Full-Body Character Rig */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center h-full max-h-full transition-transform duration-300 ease-out ${
          isSpeaking
            ? 'scale-[1.03] animate-bounce-gentle'
            : isRecording
            ? 'scale-[1.02]'
            : 'animate-float'
        }`}
      >
        {/* Full Body Character Stage Container */}
        <div className="relative h-full max-h-[420px] sm:max-h-[450px] aspect-[3/4] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-white/20 backdrop-blur-sm">
          {/* High-Resolution Realistic Full-Body Base Image */}
          <img
            src={avatar.imageSrc}
            alt={avatar.name}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
          />

          {/* Dynamic Audio-Reactive Lip-Sync Mouth Overlay */}
          {faceCoords && (
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
              style={{
                left: `${faceCoords.mouthX}%`,
                top: `${faceCoords.mouthY}%`,
                width: `${faceCoords.mouthWidth}%`,
              }}
            >
              {isMouthActive ? (
                <div
                  className="w-full rounded-full bg-stone-900 border border-stone-800 shadow-inner relative overflow-hidden transition-all duration-75 flex items-center justify-center"
                  style={{
                    height: `${dynamicMouthHeight}px`,
                  }}
                >
                  {/* Subtle Upper Teeth Line */}
                  <div className="absolute top-0 w-3/4 h-[25%] bg-amber-50 rounded-b-sm opacity-90" />
                  {/* Dynamic Pink Tongue */}
                  <div
                    className="absolute bottom-0 w-3/5 rounded-t-full bg-rose-500 opacity-95 transition-all"
                    style={{
                      height: `${Math.max(2, dynamicMouthHeight * 0.45)}px`,
                    }}
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* Dynamic Natural Eye Blink Overlay */}
          {faceCoords && isBlinking && (
            <>
              {/* Left Eye Eyelid */}
              <div
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-700/80 backdrop-blur-[1px] shadow-sm transition-all duration-75"
                style={{
                  left: `${faceCoords.leftEyeX}%`,
                  top: `${faceCoords.eyeY}%`,
                  width: `${faceCoords.eyeWidth}%`,
                  height: `${faceCoords.eyeHeight}%`,
                }}
              >
                <div className="w-full h-0.5 bg-stone-900 absolute top-1/2 -translate-y-1/2" />
              </div>

              {/* Right Eye Eyelid */}
              <div
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-700/80 backdrop-blur-[1px] shadow-sm transition-all duration-75"
                style={{
                  left: `${faceCoords.rightEyeX}%`,
                  top: `${faceCoords.eyeY}%`,
                  width: `${faceCoords.eyeWidth}%`,
                  height: `${faceCoords.eyeHeight}%`,
                }}
              >
                <div className="w-full h-0.5 bg-stone-900 absolute top-1/2 -translate-y-1/2" />
              </div>
            </>
          )}

          {/* Attentive Listening/Recording Halo Rim */}
          {isRecording && (
            <div className="absolute inset-0 rounded-3xl border-4 border-emerald-400/80 pointer-events-none animate-pulse" />
          )}

          {isSpeaking && (
            <div className="absolute inset-0 rounded-3xl border-4 border-rose-400/80 pointer-events-none animate-pulse" />
          )}
        </div>

        {/* 3D Realistic Contact Shadow Floor */}
        <div className="w-48 sm:w-60 h-4 bg-black/20 rounded-[100%] blur-md mt-1 transform scale-y-75 pointer-events-none" />
      </div>
    </div>
  );
}
