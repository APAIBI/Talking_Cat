import React from 'react';

export function TitleBar() {
  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);

  const handleMinimize = () => {
    window.electronAPI?.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximize();
  };

  const handleClose = () => {
    window.electronAPI?.close();
  };

  return (
    <div className="h-10 w-full flex items-center justify-between px-3 select-none bg-slate-900/40 backdrop-blur-md border-b border-white/10 z-50 style-drag">
      {/* App Branding */}
      <div className="flex items-center gap-2 style-no-drag">
        <span className="text-xl">🐾</span>
        <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
          Talking Buddies Companion
        </span>
      </div>

      {/* Electron Window Controls */}
      {isElectron && (
        <div className="flex items-center gap-1.5 style-no-drag">
          <button
            onClick={handleMinimize}
            className="w-7 h-7 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 flex items-center justify-center font-bold text-xs transition-colors shadow-sm"
            title="Minimize"
          >
            ─
          </button>
          <button
            onClick={handleMaximize}
            className="w-7 h-7 rounded-full bg-emerald-400 hover:bg-emerald-500 text-emerald-950 flex items-center justify-center font-bold text-xs transition-colors shadow-sm"
            title="Maximize"
          >
            □
          </button>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-xs transition-colors shadow-sm"
            title="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
