import { useState, useEffect, useRef, useCallback } from 'react';
import { createResampledBuffer, applyVocalFormantAndFX } from '../audio/pitchShifter';
import { playCaptureChime } from '../audio/soundEffects';

export const APP_STATE = {
  UNINITIALIZED: 'UNINITIALIZED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  LISTENING: 'LISTENING',
  RECORDING: 'RECORDING',
  PROCESSING: 'PROCESSING',
  SPEAKING: 'SPEAKING',
};

/**
 * Custom Hook: Continuous Autonomous Talkback Engine
 * Implements no-tap voice activity detection (VAD), silence detection,
 * pitch-shifted mimicry playback, and real-time audio metering.
 */
export function useAudioTalkback({
  avatarConfig,
  customVoiceSettings,
  autoListen = true,
}) {
  const [appState, setAppState] = useState(APP_STATE.UNINITIALIZED);
  const [audioLevel, setAudioLevel] = useState(0); // 0.0 to 1.0 for visualizer & mouth
  const [errorMessage, setErrorMessage] = useState(null);

  // References to preserve instances across renders
  const audioCtxRef = useRef(null);
  const micStreamRef = useRef(null);
  const micSourceRef = useRef(null);
  const micAnalyserRef = useRef(null);
  const playbackAnalyserRef = useRef(null);
  const scriptProcessorRef = useRef(null);

  // Buffering and VAD refs
  const recordedChunksRef = useRef([]);
  const isSpeakingRef = useRef(false);
  const speechStartTimeRef = useRef(0);
  const silenceStartTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const noiseFloorRef = useRef(0.015);
  const activePlaybackSourceRef = useRef(null);
  const activeFxCleanupRef = useRef(null);

  // Dynamic parameters from avatar and custom settings
  const pitchFactor = customVoiceSettings?.pitch ?? avatarConfig.defaultPitch ?? 1.6;
  const speedFactor = customVoiceSettings?.speed ?? avatarConfig.defaultSpeed ?? 1.15;
  const robotMode = customVoiceSettings?.robot ?? avatarConfig.defaultRobot ?? false;
  const echoMode = customVoiceSettings?.echo ?? avatarConfig.defaultEcho ?? false;
  const formantHz = customVoiceSettings?.formantBoostHz ?? 2600;
  const resonance = customVoiceSettings?.resonance ?? 3.0;

  /**
   * Initialize AudioContext and Microphone stream
   */
  const startListening = useCallback(async () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (!micStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });

        micStreamRef.current = stream;

        // Microphone input node & analyser
        const source = ctx.createMediaStreamSource(stream);
        micSourceRef.current = source;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.3;
        micAnalyserRef.current = analyser;

        source.connect(analyser);

        // Raw audio sample recorder via ScriptProcessor (4096 buffer size)
        // Works deterministically across all desktop Chromium / Electron versions
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (isSpeakingRef.current) {
            const inputData = e.inputBuffer.getChannelData(0);
            recordedChunksRef.current.push(new Float32Array(inputData));
          }
        };

        source.connect(processor);
        // Connect to a mute gain so processor continues firing without mic feedback
        const muteGain = ctx.createGain();
        muteGain.gain.setValueAtTime(0, ctx.currentTime);
        processor.connect(muteGain);
        muteGain.connect(ctx.destination);
      }

      setAppState(APP_STATE.LISTENING);
      setErrorMessage(null);
    } catch (err) {
      console.error('Microphone initialization failed:', err);
      setErrorMessage(err.message || 'Microphone access denied');
      setAppState(APP_STATE.PERMISSION_DENIED);
    }
  }, []);

  /**
   * Stop all audio streams and nodes
   */
  const stopAll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (activePlaybackSourceRef.current) {
      try {
        activePlaybackSourceRef.current.stop();
      } catch (_) {}
      activePlaybackSourceRef.current = null;
    }
    if (activeFxCleanupRef.current) {
      activeFxCleanupRef.current();
      activeFxCleanupRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setAppState(APP_STATE.UNINITIALIZED);
  }, []);

  /**
   * Playback recorded audio with pitch-shift and formant modulation
   */
  const playAlteredVoice = useCallback(async (audioBuffer) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    setAppState(APP_STATE.SPEAKING);

    try {
      // 1. Resample pitch and speed (produces signature chipmunk / cartoon pitch)
      const resampledBuffer = await createResampledBuffer(ctx, audioBuffer, pitchFactor, speedFactor);

      // 2. Create buffer source
      const bufferSource = ctx.createBufferSource();
      bufferSource.buffer = resampledBuffer;
      activePlaybackSourceRef.current = bufferSource;

      // 3. Playback analyser (for animating mouth in sync with character voice)
      const playAnalyser = ctx.createAnalyser();
      playAnalyser.fftSize = 256;
      playAnalyser.smoothingTimeConstant = 0.2;
      playbackAnalyserRef.current = playAnalyser;

      // 4. Formant filter chain + FX
      const { outputNode, cleanup } = applyVocalFormantAndFX(ctx, bufferSource, {
        formantHz,
        resonance,
        robot: robotMode,
        echo: echoMode,
      });
      activeFxCleanupRef.current = cleanup;

      // Connect to analyser and then speaker destination
      outputNode.connect(playAnalyser);
      playAnalyser.connect(ctx.destination);

      bufferSource.onended = () => {
        cleanup();
        activePlaybackSourceRef.current = null;
        activeFxCleanupRef.current = null;
        playbackAnalyserRef.current = null;

        // Reset buffer and return autonomously to LISTENING state
        recordedChunksRef.current = [];
        isSpeakingRef.current = false;
        silenceStartTimeRef.current = 0;
        speechStartTimeRef.current = 0;
        setAudioLevel(0);
        setAppState(APP_STATE.LISTENING);
      };

      bufferSource.start(0);
    } catch (err) {
      console.error('Voice playback error:', err);
      setAppState(APP_STATE.LISTENING);
    }
  }, [pitchFactor, speedFactor, formantHz, resonance, robotMode, echoMode]);

  /**
   * Assemble recorded raw Float32Array chunks into an AudioBuffer
   */
  const processRecordedAudio = useCallback(() => {
    const ctx = audioCtxRef.current;
    const chunks = recordedChunksRef.current;

    if (!ctx || chunks.length === 0) {
      setAppState(APP_STATE.LISTENING);
      return;
    }

    setAppState(APP_STATE.PROCESSING);
    playCaptureChime(ctx);

    // Calculate total sample count
    let totalLength = 0;
    for (let i = 0; i < chunks.length; i++) {
      totalLength += chunks[i].length;
    }

    // Safety: ignore recordings shorter than 0.3s (coughs/clicks)
    const minSamples = Math.floor(ctx.sampleRate * 0.3);
    if (totalLength < minSamples) {
      recordedChunksRef.current = [];
      setAppState(APP_STATE.LISTENING);
      return;
    }

    // Merge into single Float32Array
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (let i = 0; i < chunks.length; i++) {
      merged.set(chunks[i], offset);
      offset += chunks[i].length;
    }

    // Create AudioBuffer
    const audioBuffer = ctx.createBuffer(1, totalLength, ctx.sampleRate);
    audioBuffer.copyToChannel(merged, 0);

    // Reset chunks
    recordedChunksRef.current = [];

    // Trigger playback
    playAlteredVoice(audioBuffer);
  }, [playAlteredVoice]);

  /**
   * Main Real-Time VAD (Voice Activity Detection) & Visualizer Loop
   */
  useEffect(() => {
    const dataArray = new Uint8Array(256);

    const updateLoop = () => {
      const now = performance.now();

      // Case A: Playing back speech (drive mouth & visuals from playback analyser)
      if (appState === APP_STATE.SPEAKING && playbackAnalyserRef.current) {
        playbackAnalyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1.0, (avg / 128) * 1.5);
        setAudioLevel(normalized);
      }
      // Case B: Listening / Recording via microphone
      else if ((appState === APP_STATE.LISTENING || appState === APP_STATE.RECORDING) && micAnalyserRef.current) {
        micAnalyserRef.current.getByteTimeDomainData(dataArray);

        // Compute RMS energy
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128;
          sumSquares += val * val;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);

        // Slowly track ambient noise floor
        noiseFloorRef.current = noiseFloorRef.current * 0.98 + rms * 0.02;
        const speechThreshold = Math.max(0.025, noiseFloorRef.current * 2.5);

        // Visual level normalized for UI meter
        const visualLevel = Math.min(1.0, rms * 10);
        setAudioLevel(visualLevel);

        const isVoiceActive = rms > speechThreshold;

        if (isVoiceActive) {
          // Voice has started!
          if (!isSpeakingRef.current) {
            isSpeakingRef.current = true;
            speechStartTimeRef.current = now;
            recordedChunksRef.current = []; // Start fresh recording
            setAppState(APP_STATE.RECORDING);
          }
          silenceStartTimeRef.current = 0;

          // Maximum safety cap: 12 seconds per turn to prevent overflowing memory
          if (now - speechStartTimeRef.current > 12000) {
            isSpeakingRef.current = false;
            processRecordedAudio();
          }
        } else {
          // Silence detected
          if (isSpeakingRef.current) {
            if (silenceStartTimeRef.current === 0) {
              silenceStartTimeRef.current = now;
            } else if (now - silenceStartTimeRef.current > 850) {
              // 850ms of continuous silence after speech -> End of turn!
              isSpeakingRef.current = false;
              silenceStartTimeRef.current = 0;
              processRecordedAudio();
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [appState, processRecordedAudio]);

  // Handle auto-listen on mount
  useEffect(() => {
    if (autoListen) {
      startListening();
    }
    return () => {
      stopAll();
    };
  }, [autoListen, startListening, stopAll]);

  return {
    appState,
    audioLevel,
    errorMessage,
    startListening,
    stopAll,
  };
}
