# 🐾 Talking Buddies Companion

A complete, production-ready desktop window companion application built with **Electron**, **React**, **Tailwind CSS**, and the **Web Audio API**. Inspired by classic talking animal companions (like *Talking Tom*), re-imagined with a kid-friendly, no-tap, autonomous listening and talkback model.

---

## 🌟 Why Electron + Web Audio API? (Cleanest Modern Approach)

When selecting the desktop speech processing stack, **Electron + React + Web Audio API** was chosen over Python (PyQt6 / CustomTkinter) for several critical reasons:

| Requirement | Electron + React + Web Audio API (Chosen) | Python + PyQt6 / CustomTkinter |
| :--- | :--- | :--- |
| **Microphone & VAD Reliability** | Native browser engine with automatic OS gain control, acoustic echo cancellation, and noise suppression (`getUserMedia`). Zero native driver mismatches. | Requires PortAudio C-libraries (`pyaudio`/`sounddevice`), prone to host API crashes (WASAPI vs MME) on Windows. |
| **Pitch & Formant DSP** | Real-time `OfflineAudioContext` resampling + dual-biquad vocal formant filters + ring modulators built right in. Zero external C-bindings. | Requires compiling or bundling `librubberband`, `ffmpeg`, or `libsndfile` DLLs on Windows. |
| **Kid-Friendly Animated UI** | Smooth 60fps hardware-accelerated SVG facial morphing (mouth synced to audio RMS, random eye blinking, ear wiggles). | Clunky frame rendering in Tkinter/PyQt with UI freeze risks during audio thread locking. |
| **Packaging & Distribution** | 1-step build with `electron-builder` producing an installer `.exe`. | Tricky PyInstaller bundling with hidden DLL dependencies. |

---

## ✨ Core Features

1. **No-Tap Interaction Model:**
   - No buttons to start/stop recording. The character is purely a living, listening, and speaking companion.
   - Built-in dynamic Voice Activity Detection (VAD) monitors ambient room sound.
   - When the child speaks, it transitions automatically:
     $$\text{LISTENING} \longrightarrow \text{RECORDING} \longrightarrow \text{THINKING} \longrightarrow \text{SPEAKING} \longrightarrow \text{LISTENING}$$
   - When the child pauses for ~850ms, the recording stops automatically and is immediately repeated back.

2. **Talkback (Voice Mimicry & Pitch Modification):**
   - High-quality Web Audio pipeline shifts pitch and preserves animated speech cadence.
   - Resampling + Vocal Formant Peaking Filter (+7dB boost around 2.4kHz–3.4kHz) recreates the signature cartoon throat resonance.
   - Mouth opening height dynamically syncs with playback volume in real-time.

3. **Multiple Full-Body Realistic Avatars:**
   - **No face-only, no half-body.** Every avatar is a realistic, head-to-toe / head-to-paw standing 3D character with ground shadows and lifelike posture:
     - 🐱 **Leo the Cat:** Realistic ginger tabby standing upright on paws with curled tail, soft fur, and green-gold eyes ($1.62\times$ chipmunk pitch).
     - 🎀 **Luna Kitty:** Realistic fluffy calico kitten standing on all four paws with bell collar ($1.85\times$ squeaky kitten pitch).
     - 👧 **Maya:** Realistic 3D companion standing head-to-toe in denim overalls, yellow top, and sneakers ($1.32\times$ friendly pitch).
     - 🐶 **Barnaby:** Realistic golden retriever puppy with floppy ears and tail ($0.82\times$ warm puppy rumble).
   - **Dynamic Audio-Reactive Lip Sync:** Real-time mouth and jaw overlay opens and closes proportionally to the playback speech volume.
   - **Procedural Blinking:** Characters blink naturally at pseudo-random intervals.

4. **Voice Modulation Customizer:**
   - 6 Quick Presets: *Chipmunk Tom, Baby Kitten, Happy Kid, Big Doggy, Robo Buddy, Echo Cave*.
   - Chunky pitch slider with intuitive visual icons (🐻 Deep Bear to 🐭 Squeaky Mouse).
   - Instant Robot Mode (ring-modulated 55Hz carrier) and Echo Cave effect toggles.

5. **Kid-Friendly UI/UX:**
   - Extra-large tactile buttons with gentle click sounds.
   - Bouncing rainbow jelly sound waves for visual audio feedback.
   - Big, friendly status badges: *"I'm listening!"*, *"I hear you!"*, *"Listen! I am repeating you!"*.

---

## 📁 Source Code Architecture

```
talkingcat/
├── package.json               # Dependencies, scripts, and Electron configuration
├── vite.config.js             # Vite configuration with relative base path for Electron
├── tailwind.config.js         # Custom kid-friendly color palette and animations
├── postcss.config.js          # PostCSS Tailwind plugins
├── index.html                 # HTML entry point with Fredoka typography
├── electron/
│   ├── main.js                # Electron main process (frameless window, audio permissions)
│   └── preload.js             # Secure contextBridge IPC bridge
├── src/
│   ├── main.jsx               # React DOM root entry
│   ├── App.jsx                # Main orchestrator (state, layout, theme background)
│   ├── index.css              # Custom range styling & window drag boundaries
│   ├── constants/
│   │   ├── avatars.js         # Character definitions, color palettes, default profiles
│   │   └── voicePresets.js    # Presets with pitch factors and formant boost Hz
│   ├── audio/
│   │   ├── pitchShifter.js    # Web Audio DSP (resampling, biquad formant filters, robot & echo FX)
│   │   └── soundEffects.js    # Procedural oscillator chimes and pop sound effects
│   ├── hooks/
│   │   ├── useAudioTalkback.js # Autonomous continuous VAD, silence detector & playback hook
│   │   └── useMouthAnimator.js # Smooth mouth height interpolation & eye blink timers
│   └── components/
│       ├── TitleBar.jsx        # Playful frameless window title bar with minimize/close
│       ├── StatusIndicator.jsx # Clear visual state pill (Listening / Recording / Speaking)
│       ├── AvatarDisplay.jsx   # 2D animated vector characters with morphing mouths and eyes
│       ├── AvatarSelector.jsx  # Chunky character switcher cards with pop sounds
│       ├── AudioVisualizer.jsx # Bouncing jelly equalizer waves
│       └── VoiceModulator.jsx  # Pitch slider, robot toggle, echo toggle, preset badges
└── README.md
```

---

## 🚀 Step-by-Step Setup & Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or later (Node v24 LTS recommended)
- **A working microphone** connected to your PC

### 1. Installation
In PowerShell or terminal from the project folder:
```powershell
npm install
```

### 2. Run as a Desktop Window Application (Electron)
Launch the application in desktop window mode with live reloading:
```powershell
npm start
```
*(This starts the Vite local server and opens the native frameless Electron desktop window automatically).*

### 3. Run in Web Browser (Optional Quick Preview)
If you prefer testing inside Google Chrome or Microsoft Edge:
```powershell
npm run dev
```
Open `http://localhost:5173` in your browser and allow microphone access when prompted.

### 4. Build a Standalone Executable (.exe for Windows)
```powershell
npm run build
npm run dist
```
The installer and unpacked binary will be generated inside the `dist/` directory.

---

## 🔧 Audio DSP Technical Details

1. **Voice Activity Detection (VAD):**
   - The microphone stream is passed to a 512-point `AnalyserNode`.
   - The Root Mean Square (RMS) energy is sampled at 60fps.
   - An adaptive noise floor tracker calibrates dynamically to room acoustics ($E_{\text{floor}} \leftarrow 0.98 \cdot E_{\text{floor}} + 0.02 \cdot \text{RMS}$).
   - Voice trigger: $\text{RMS} > \max(0.025, 2.5 \cdot E_{\text{floor}})$.
   - Silence detector: triggers playback after 850ms of quiet following active speech.

2. **Resampling & Pitch Shifting:**
   - Raw Float32Array PCM chunks are merged and rendered through an `OfflineAudioContext` with `playbackRate` scaled to the target pitch factor ($0.6\times$ to $2.1\times$).
   - Formant shaping is achieved with a peaking biquad filter ($Q \approx 3.0$) tuned to the vocal tract profile of each animal or human character.
