import React from 'react';
import { VOICE_PRESETS } from '../constants/voicePresets';

export function VoiceModulator({
  activeSettings,
  onChangeSettings,
  onResetToAvatar,
  avatar,
  onPlayPop,
}) {
  const handlePresetClick = (preset) => {
    onPlayPop?.();
    onChangeSettings({
      pitch: preset.pitch,
      speed: preset.speed,
      robot: preset.robot,
      echo: preset.echo,
      formantBoostHz: preset.formantBoostHz,
      resonance: preset.resonance,
      presetId: preset.id,
    });
  };

  const handlePitchChange = (e) => {
    const val = parseFloat(e.target.value);
    onChangeSettings({
      ...activeSettings,
      pitch: val,
      presetId: 'custom',
    });
  };

  const toggleRobot = () => {
    onPlayPop?.();
    onChangeSettings({
      ...activeSettings,
      robot: !activeSettings.robot,
      presetId: 'custom',
    });
  };

  const toggleEcho = () => {
    onPlayPop?.();
    onChangeSettings({
      ...activeSettings,
      echo: !activeSettings.echo,
      presetId: 'custom',
    });
  };

  return (
    <div className="w-full max-w-2xl bg-white/85 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-xl border-2 border-white/90">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🎙️</span>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            Voice Magic Controls
          </h3>
        </div>
        <button
          onClick={() => {
            onPlayPop?.();
            onResetToAvatar();
          }}
          className="text-xs sm:text-sm font-bold px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors active:scale-95"
        >
          🔄 Reset Voice
        </button>
      </div>

      {/* Chunky Preset Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {VOICE_PRESETS.map((preset) => {
          const isSelected = activeSettings.presetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all transform active:scale-95 ${
                isSelected
                  ? 'bg-bubble-purple text-white shadow-md scale-105 ring-2 ring-bubble-purple/50'
                  : 'bg-white hover:bg-purple-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          );
        })}
      </div>

      {/* Voice Tuning Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
        {/* Pitch Slider */}
        <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80">
          <div className="flex justify-between items-center mb-1.5 text-xs font-bold text-slate-600">
            <span>🐻 Deep Pitched</span>
            <span className="text-bubble-purple font-extrabold text-sm">
              {activeSettings.pitch.toFixed(2)}x
            </span>
            <span>🐭 Squeaky High</span>
          </div>
          <input
            type="range"
            min="0.6"
            max="2.1"
            step="0.05"
            value={activeSettings.pitch}
            onChange={handlePitchChange}
            className="w-full h-3 bg-gradient-to-r from-indigo-300 via-amber-300 to-rose-400 rounded-lg appearance-none cursor-pointer accent-bubble-purple"
          />
        </div>

        {/* Fun FX Toggles: Robot & Echo */}
        <div className="flex gap-2.5">
          {/* Robot Mode Button */}
          <button
            onClick={toggleRobot}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all transform active:scale-95 border-2 ${
              activeSettings.robot
                ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-lg">🤖</span>
            <span>{activeSettings.robot ? 'Robot: ON' : 'Robot: OFF'}</span>
          </button>

          {/* Echo Mode Button */}
          <button
            onClick={toggleEcho}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all transform active:scale-95 border-2 ${
              activeSettings.echo
                ? 'bg-bubble-blue border-blue-600 text-white shadow-md'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <span className="text-lg">🏰</span>
            <span>{activeSettings.echo ? 'Echo: ON' : 'Echo: OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
