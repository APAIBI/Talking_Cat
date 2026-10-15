import React from 'react';
import { AVATARS } from '../constants/avatars';

export function AvatarSelector({ activeAvatar, onSelectAvatar, onPlayPop }) {
  return (
    <div className="w-full max-w-2xl px-2 py-1">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {AVATARS.map((avatar) => {
          const isSelected = activeAvatar.id === avatar.id;
          return (
            <button
              key={avatar.id}
              onClick={() => {
                if (!isSelected) {
                  onPlayPop?.();
                  onSelectAvatar(avatar);
                }
              }}
              className={`relative group flex items-center gap-2 p-2 rounded-2xl transition-all duration-300 transform active:scale-95 ${
                isSelected
                  ? `${avatar.colorTheme.cardBg} text-white shadow-lg ring-3 ring-white -translate-y-0.5 scale-102`
                  : 'bg-white/85 hover:bg-white text-slate-700 shadow-md hover:shadow-lg border-2 border-slate-100 hover:-translate-y-0.5'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <span className="absolute -top-2 -right-1 bg-yellow-400 text-yellow-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full shadow border border-white">
                  ★ Active
                </span>
              )}

              {/* Character Realistic Mini Thumbnail */}
              <div className="w-12 h-14 rounded-xl overflow-hidden shadow-inner border border-white/50 flex-shrink-0 bg-slate-100">
                <img
                  src={avatar.imageSrc}
                  alt={avatar.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Text Info */}
              <div className="flex flex-col text-left overflow-hidden">
                <span
                  className={`font-bold text-xs sm:text-sm truncate leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {avatar.name}
                </span>
                <span
                  className={`text-[10px] font-medium truncate ${
                    isSelected ? 'text-white/85' : 'text-slate-500'
                  }`}
                >
                  {avatar.species}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
