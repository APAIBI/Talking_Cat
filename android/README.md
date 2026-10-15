# 📱 Talking Buddies Companion - Pure Kotlin Android App

A complete, production-ready, pure **Kotlin** native Android application built with **Jetpack Compose**, **Material 3**, **AudioRecord**, and **AudioTrack** with hardware-accelerated pitch modulation.

---

## 🌟 Core Architecture & Native Technologies

1. **Pure Kotlin & Jetpack Compose:**
   - 100% Kotlin codebase using modern declarative UI with Material 3.
   - Declarative state management via `StateFlow` and Android Architecture `ViewModel`.
   - Real-time procedural animations: mouth height sync, eyelid blinking, and bouncing jelly equalizer bars.

2. **No-Tap Interaction Model (`AudioCaptureEngine.kt`):**
   - Continuously listens via `AudioRecord` (16-bit PCM at 44.1 kHz).
   - Real-time Voice Activity Detection (VAD) monitors ambient noise floor dynamically.
   - Transitions automatically:
     $$\text{LISTENING} \longrightarrow \text{RECORDING} \longrightarrow \text{PROCESSING} \longrightarrow \text{SPEAKING} \longrightarrow \text{LISTENING}$$
   - When the child speaks, it records; when the child pauses for ~850ms, it stops and immediately plays back the pitch-shifted mimicry.

3. **Pitch Shifting & Talkback (`PitchPlaybackEngine.kt`):**
   - Uses native Android `AudioTrack` with `PlaybackParams.setPitch(pitchFactor)` and `setSpeed(speedFactor)` (API 23+).
   - Provides artifact-free, zero-latency pitch shifting ($0.6\times$ to $2.1\times$) with zero external C/C++ or third-party binary dependencies.
   - Computes real-time RMS of audio output to drive character mouth movement during speech playback.

4. **Realistic Full-Body Avatars:**
   - **No face-only, no half-body.** Full-body uncropped head-to-toe / head-to-paw standing characters:
     - 🐱 **Leo the Cat:** Male ginger tabby upright on paws with curled tail ($1.62\times$ chipmunk pitch).
     - 🎀 **Luna Kitty:** Fluffy calico kitten with bell collar ($1.85\times$ squeaky kitten pitch).
     - 👧 **Maya:** 3D companion character in overalls and sneakers ($1.32\times$ friendly pitch).
     - 🐶 **Barnaby:** Golden retriever puppy with floppy ears and tail ($0.82\times$ warm puppy rumble).
   - Stored in `res/drawable/` (`male_cat.jpg`, `female_cat.jpg`, `female_human.jpg`, `dog.jpg`).

5. **Kid-Friendly UI/UX:**
   - Large tactile cards and buttons.
   - Bouncing candy equalizer bars.
   - Big colorful status badges (*"Listening"*, *"Recording"*, *"Repeating"*).
   - Voice customizer with presets and pitch slider.

---

## 📁 Android Project Structure

```
android/
├── build.gradle.kts                   # Root Gradle build script
├── settings.gradle.kts                # Project & repository settings
├── gradle.properties                  # JVM args and AndroidX flags
├── gradle/wrapper/
│   └── gradle-wrapper.properties      # Gradle 8.7 wrapper definition
├── app/
│   ├── build.gradle.kts               # Dependencies (Compose BOM, Material 3, Coroutines)
│   ├── proguard-rules.pro             # Proguard configuration
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml    # RECORD_AUDIO permissions
│           ├── res/
│           │   ├── drawable/          # Realistic full-body character images
│           │   │   ├── male_cat.jpg
│           │   │   ├── female_cat.jpg
│           │   │   ├── female_human.jpg
│           │   │   └── dog.jpg
│           │   └── values/
│           │       ├── strings.xml
│           │       ├── colors.xml
│           │       └── themes.xml
│           └── java/com/talkingcat/companion/
│               ├── MainActivity.kt               # Main entry, permission launcher & scaffold
│               ├── MainViewModel.kt              # State orchestration, blinking timer & audio loop
│               ├── audio/
│               │   ├── AudioCaptureEngine.kt     # Continuous AudioRecord + RMS + VAD
│               │   └── PitchPlaybackEngine.kt   # AudioTrack with PlaybackParams
│               ├── data/
│               │   ├── AvatarModel.kt           # 4 avatars, face coordinates & color palettes
│               │   └── VoicePreset.kt           # Voice presets (Chipmunk, Squeaky, etc.)
│               └── ui/
│                   ├── theme/                   # Material 3 colors, typography & theme
│                   └── components/
│                       ├── StatusBadge.kt        # Animated visual state badge
│                       ├── AudioVisualizerView.kt# Bouncing equalizer jelly bars
│                       ├── AvatarFullBodyView.kt # Full-body avatar with mouth lip-sync overlay
│                       ├── AvatarSelectorRow.kt  # Chunky horizontal character picker
│                       └── VoiceModulatorCard.kt # Pitch slider & preset buttons
└── README.md
```

---

## 🚀 How to Open and Run in Android Studio

1. Open **Android Studio** (Hedgehog, Iguana, Koala, or later recommended).
2. Click **Open** and select the [`android/`](file:///c:/Users/APAIBI/Documents/talkingcat/android) folder located in `c:\Users\APAIBI\Documents\talkingcat\android`.
3. Allow Gradle to sync dependencies automatically.
4. Connect an Android phone (with USB debugging enabled) or start an Android Emulator.
5. Click **Run ▶ (Shift + F10)**.
6. When prompted on the device, grant **Microphone Permission**.
7. Start talking to your companion!
