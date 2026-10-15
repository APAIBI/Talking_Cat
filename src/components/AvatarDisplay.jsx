import React from 'react';
import { useMouthAnimator } from '../hooks/useMouthAnimator';
import { APP_STATE } from '../hooks/useAudioTalkback';

/**
 * Realistic Full-Body Animated Character Display:
 * - Full head-to-toe / head-to-paw uncropped standing character.
 * - Lifelike organic mouth & jaw articulation:
 *   - Depth cavity with realistic inner shadow.
 *   - Natural parted upper/lower lips with skin-tone blending.
 *   - Realistic upper teeth arch and curved soft tongue.
 *   - Subtle jaw-drop articulation responding in real-time to speech amplitude.
 * - Procedural eyelid blinking.
 * - Ambient ground shadows and subtle breathing rhythm.
 */
export function AvatarDisplay({ avatar, appState, audioLevel }) {
  const { mouthOpen, isBlinking } = useMouthAnimator(appState, audioLevel);

  const isSpeaking = appState === APP_STATE.SPEAKING;
  const isRecording = appState === APP_STATE.RECORDING;
  const isListening = appState === APP_STATE.LISTENING;

  const { faceCoords } = avatar;

  // Realistic dynamic mouth height (smooth scale based on audio speech level)
  const dynamicMouthHeight = Math.max(3, mouthOpen * 26);
  // Realistic horizontal narrowing during vertical mouth opening (natural facial physics)
  const mouthWidthScale = 1.0 - Math.min(0.12, mouthOpen * 0.12);
  const isMouthActive = mouthOpen > 0.08 && isSpeaking;

  // Subtle natural jaw drop (0 to 2.5px)
  const jawDropPx = isSpeaking ? mouthOpen * 2.2 : 0;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[450px] sm:h-[490px] max-h-[52vh] select-none">
      {/* Background Soft Ambient Studio Halo */}
      <div
        className={`absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl transition-all duration-700 pointer-events-none opacity-40 ${
          isSpeaking
            ? 'bg-rose-400 scale-110'
            : isRecording
            ? 'bg-emerald-400 scale-105'
            : isListening
            ? 'bg-sky-300 scale-100'
            : 'bg-indigo-200 scale-95'
        }`}
      />

      {/* Main Full-Body Character Container with Breathing Motion */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center h-full max-h-full transition-transform duration-300 ease-out ${
          isSpeaking
            ? 'scale-[1.02] animate-bounce-gentle'
            : isRecording
            ? 'scale-[1.015]'
            : 'animate-float'
        }`}
      >
        {/* Full-Body Character Stage */}
        <div className="relative h-full max-h-[430px] sm:max-h-[460px] aspect-[9/16] sm:aspect-[3/4] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-white/20 backdrop-blur-sm">
          {/* High-Resolution Realistic Full-Body Base Image */}
          <img
            src={avatar.imageSrc}
            alt={avatar.name}
            className="w-full h-full object-cover object-center pointer-events-none transition-all duration-500"
          />

          {/* Lifelike Real-Time Audio-Reactive Mouth Articulation */}
          {faceCoords && (
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
              style={{
                left: `${faceCoords.mouthX}%`,
                top: `${faceCoords.mouthY}%`,
                width: `${faceCoords.mouthWidth * mouthWidthScale}%`,
                transform: `translate(-50%, -50%) translateY(${jawDropPx}px)`,
              }}
            >
              {isMouthActive && (
                <div
                  className="w-full relative overflow-hidden transition-all duration-75 rounded-[50%/40%] shadow-md"
                  style={{
                    height: `${dynamicMouthHeight}px`,
                    background: 'radial-gradient(ellipse at 50% 30%, #1A0A0A 0%, #380C0C 50%, #170707 100%)',
                    borderTop: '1px solid rgba(255, 180, 180, 0.4)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {/* Realistic Upper Teeth Arch */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 bg-gradient-to-b from-amber-50 via-white to-amber-100/90 rounded-b-[4px] shadow-sm"
                    style={{
                      height: `${Math.max(2, dynamicMouthHeight * 0.28)}px`,
                    }}
                  />

                  {/* Realistic Soft Curved Tongue */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 bg-gradient-to-t from-rose-600 via-rose-500 to-rose-400 rounded-t-[100%] shadow-inner transition-all"
                    style={{
                      height: `${Math.max(2, dynamicMouthHeight * 0.42)}px`,
                    }}
                  />

                  {/* Corner Soft Shading for Natural Realism */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_4px_rgba(0,0,0,0.8)] rounded-full" />
                </div>
              )}
            </div>
          )}

          {/* Dynamic Natural Eye Blink Overlay */}
          {faceCoords && isBlinking && (
            <>
              {/* Left Eye Eyelid */}
              <div
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-800/85 backdrop-blur-[0.5px] shadow-sm transition-all duration-75"
                style={{
                  left: `${faceCoords.leftEyeX}%`,
                  top: `${faceCoords.eyeY}%`,
                  width: `${faceCoords.eyeWidth}%`,
                  height: `${faceCoords.eyeHeight}%`,
                }}
              >
                <div className="w-full h-[1.5px] bg-stone-950 absolute top-1/2 -translate-y-1/2" />
              </div>

              {/* Right Eye Eyelid */}
              <div
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-800/85 backdrop-blur-[0.5px] shadow-sm transition-all duration-75"
                style={{
                  left: `${faceCoords.rightEyeX}%`,
                  top: `${faceCoords.eyeY}%`,
                  width: `${faceCoords.eyeWidth}%`,
                  height: `${faceCoords.eyeHeight}%`,
                }}
              >
                <div className="w-full h-[1.5px] bg-stone-950 absolute top-1/2 -translate-y-1/2" />
              </div>
            </>
          )}

          {/* Attentive Rim Glows */}
          {isRecording && (
            <div className="absolute inset-0 rounded-3xl border-4 border-emerald-400/80 pointer-events-none animate-pulse" />
          )}

          {isSpeaking && (
            <div className="absolute inset-0 rounded-3xl border-4 border-rose-400/80 pointer-events-none animate-pulse" />
          )}
        </div>

        {/* 3D Realistic Contact Floor Shadow */}
        <div className="w-44 sm:w-56 h-3 bg-black/25 rounded-[100%] blur-md mt-1 transform scale-y-75 pointer-events-none" />
      </div>
    </div>
  );
}
