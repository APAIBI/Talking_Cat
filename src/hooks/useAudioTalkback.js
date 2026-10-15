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
 * Enhanced Continuous Autonomous Talkback Engine with Robust Background Noise Cancellation:
 * - High-pass pre-filtering (160 Hz) to eliminate HVAC hum, table bumps, and room rumble.
 * - Dynamic Noise Floor tracking with Hysteresis.
 * - Sustained Speech Onset Validator (requires 220ms of sustained voice energy to eliminate transient noise/clicks).
 * - High Speech-to-Noise Ratio (SNR) thresholding.
 */
export function useAudioTalkback({
  avatarConfig,
  autoListen = true,
}) {
  const [appState, setAppState] = useState(APP_STATE.UNINITIALIZED);
  const [audioLevel, setAudioLevel] = useState(0); // 0.0 to 1.0 for mouth & visualizer
  const [errorMessage, setErrorMessage] = useState(null);

  // Audio Context & Nodes
  const audioCtxRef = useRef(null);
  const micStreamRef = useRef(null);
  const micSourceRef = useRef(null);
  const micFilterRef = useRef(null);
  const micAnalyserRef = useRef(null);
  const playbackAnalyserRef = useRef(null);
  const scriptProcessorRef = useRef(null);

  // VAD & Buffering refs
  const recordedChunksRef = useRef([]);
  const isSpeakingRef = useRef(false);
  const candidateSpeechStartRef = useRef(0);
  const speechStartTimeRef = useRef(0);
  const silenceStartTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const noiseFloorRef = useRef(0.02);
  const activePlaybackSourceRef = useRef(null);
  const activeFxCleanupRef = useRef(null);

  // Voice parameters tailored strictly to avatar profile
  const pitchFactor = avatarConfig.voiceProfile?.pitch ?? 1.0;
  const speedFactor = avatarConfig.voiceProfile?.speed ?? 1.0;
  const formantHz = avatarConfig.voiceProfile?.formantHz ?? 2400;
  const resonance = avatarConfig.voiceProfile?.resonance ?? 2.0;

  /**
   * Start listening with hardware echo cancellation, noise suppression & auto gain
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
            channelCount: 1,
            sampleRate: 44100,
          },
          video: false,
        });

        micStreamRef.current = stream;

        // Source node from mic stream
        const source = ctx.createMediaStreamSource(stream);
        micSourceRef.current = source;

        // High-pass filter to discard low rumbles, wind, and ambient floor hum
        const hpFilter = ctx.createBiquadFilter();
        hpFilter.type = 'highpass';
        hpFilter.frequency.setValueAtTime(160, ctx.currentTime);
        micFilterRef.current = hpFilter;

        source.connect(hpFilter);

        // Analyser node for VAD
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.35;
        micAnalyserRef.current = analyser;

        hpFilter.connect(analyser);

        // ScriptProcessor recorder (4096 buffer size)
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (isSpeakingRef.current) {
            const inputData = e.inputBuffer.getChannelData(0);
            recordedChunksRef.current.push(new Float32Array(inputData));
          }
        };

        source.connect(processor);

        // Silent sink to keep processor pumping without loopback feedback
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
   * Stop all active nodes
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
    if (micFilterRef.current) {
      micFilterRef.current.disconnect();
      micFilterRef.current = null;
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
   * Play altered talkback voice
   */
  const playAlteredVoice = useCallback(async (audioBuffer) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    setAppState(APP_STATE.SPEAKING);

    try {
      const resampledBuffer = await createResampledBuffer(ctx, audioBuffer, pitchFactor, speedFactor);

      const bufferSource = ctx.createBufferSource();
      bufferSource.buffer = resampledBuffer;
      activePlaybackSourceRef.current = bufferSource;

      // Playback analyser to drive mouth animation
      const playAnalyser = ctx.createAnalyser();
      playAnalyser.fftSize = 256;
      playAnalyser.smoothingTimeConstant = 0.2;
      playbackAnalyserRef.current = playAnalyser;

      const { outputNode, cleanup } = applyVocalFormantAndFX(ctx, bufferSource, {
        formantHz,
        resonance,
        robot: false,
        echo: false,
      });
      activeFxCleanupRef.current = cleanup;

      outputNode.connect(playAnalyser);
      playAnalyser.connect(ctx.destination);

      bufferSource.onended = () => {
        cleanup();
        activePlaybackSourceRef.current = null;
        activeFxCleanupRef.current = null;
        playbackAnalyserRef.current = null;

        // Reset buffers and resume listening autonomously
        recordedChunksRef.current = [];
        isSpeakingRef.current = false;
        candidateSpeechStartRef.current = 0;
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
  }, [pitchFactor, speedFactor, formantHz, resonance]);

  /**
   * Process recorded chunks
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

    let totalLength = 0;
    for (let i = 0; i < chunks.length; i++) {
      totalLength += chunks[i].length;
    }

    // Discard any sound shorter than 0.35s (transients / chair creaks / coughs)
    const minSamples = Math.floor(ctx.sampleRate * 0.35);
    if (totalLength < minSamples) {
      recordedChunksRef.current = [];
      setAppState(APP_STATE.LISTENING);
      return;
    }

    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (let i = 0; i < chunks.length; i++) {
      merged.set(chunks[i], offset);
      offset += chunks[i].length;
    }

    const audioBuffer = ctx.createBuffer(1, totalLength, ctx.sampleRate);
    audioBuffer.copyToChannel(merged, 0);

    recordedChunksRef.current = [];
    playAlteredVoice(audioBuffer);
  }, [playAlteredVoice]);

  /**
   * Main Real-Time VAD Loop with Noise Rejection & Sustained Speech Verification
   */
  useEffect(() => {
    const dataArray = new Uint8Array(256);

    const updateLoop = () => {
      const now = performance.now();

      // Case A: Talkback Playback
      if (appState === APP_STATE.SPEAKING && playbackAnalyserRef.current) {
        playbackAnalyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1.0, (avg / 120) * 1.5);
        setAudioLevel(normalized);
      }
      // Case B: Listening / Recording via mic with Strict Noise Rejection
      else if ((appState === APP_STATE.LISTENING || appState === APP_STATE.RECORDING) && micAnalyserRef.current) {
        micAnalyserRef.current.getByteTimeDomainData(dataArray);

        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128;
          sumSquares += val * val;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);

        // Stable ambient noise floor tracker (slow adapt, ignores speech spikes)
        if (!isSpeakingRef.current) {
          noiseFloorRef.current = noiseFloorRef.current * 0.99 + rms * 0.01;
        }

        // Hysteresis threshold: Onset is strict, continuation is forgiving
        const speechOnsetThreshold = Math.max(0.045, noiseFloorRef.current * 3.4);
        const speechContinuationThreshold = Math.max(0.025, noiseFloorRef.current * 2.0);

        // Visualizer level
        const visualLevel = Math.min(1.0, Math.max(0, (rms - noiseFloorRef.current) * 12));
        setAudioLevel(visualLevel);

        if (!isSpeakingRef.current) {
          // Check for sustained voice onset (must exceed threshold for >= 200ms)
          if (rms > speechOnsetThreshold) {
            if (candidateSpeechStartRef.current === 0) {
              candidateSpeechStartRef.current = now;
            } else if (now - candidateSpeechStartRef.current > 200) {
              // Sustained child speech confirmed! Start recording
              isSpeakingRef.current = true;
              speechStartTimeRef.current = now;
              candidateSpeechStartRef.current = 0;
              recordedChunksRef.current = [];
              setAppState(APP_STATE.RECORDING);
            }
          } else {
            candidateSpeechStartRef.current = 0;
          }
        } else {
          // Already recording: monitor for silence or speech continuation
          const isStillSpeaking = rms > speechContinuationThreshold;

          if (isStillSpeaking) {
            silenceStartTimeRef.current = 0;

            // Maximum safe utterance cap (12s)
            if (now - speechStartTimeRef.current > 12000) {
              isSpeakingRef.current = false;
              processRecordedAudio();
            }
          } else {
            // Below continuation threshold -> count silence
            if (silenceStartTimeRef.current === 0) {
              silenceStartTimeRef.current = now;
            } else if (now - silenceStartTimeRef.current > 900) {
              // 900ms of true silence -> Speech turn completed!
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
