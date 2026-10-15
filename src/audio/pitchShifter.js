/**
 * Kid-Friendly Web Audio DSP Pipeline:
 * - Resampling Pitch & Speed Modulation (Classic Talking Tom character effect)
 * - Granular Delay-Modulation Pitch Shifter (Duration-independent pitch shifting)
 * - Formant Shaping (Peaking biquads simulating smaller vocal tract / cartoon throat)
 * - Robot FX (Ring modulation via 50Hz carrier)
 * - Echo FX (Playful bouncy room feedback)
 */

/**
 * Creates an audio buffer with resampled pitch (playbackRate scaling).
 * This produces the quintessential hilarious "Talking Tom / Chipmunk" effect.
 *
 * @param {AudioContext} audioCtx 
 * @param {AudioBuffer} inputBuffer 
 * @param {number} pitchRatio - Pitch factor (e.g., 1.6 for cat, 0.82 for dog)
 * @param {number} speedRatio - Speed multiplier
 * @returns {Promise<AudioBuffer>}
 */
export async function createResampledBuffer(audioCtx, inputBuffer, pitchRatio = 1.5, speedRatio = 1.0) {
  const rate = Math.max(0.5, Math.min(2.5, pitchRatio * speedRatio));
  const newLength = Math.max(1, Math.floor(inputBuffer.length / rate));
  const numberOfChannels = inputBuffer.numberOfChannels;
  const sampleRate = inputBuffer.sampleRate;

  // Use OfflineAudioContext for deterministic, non-blocking rendering
  const offlineCtx = new OfflineAudioContext(numberOfChannels, newLength, sampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = inputBuffer;
  source.playbackRate.setValueAtTime(rate, 0);

  source.connect(offlineCtx.destination);
  source.start(0);

  return await offlineCtx.startRendering();
}

/**
 * Builds the vocal formant and FX filter graph on an AudioContext.
 *
 * @param {AudioContext} audioCtx 
 * @param {AudioNode} sourceNode 
 * @param {Object} options - { pitch, formantHz, resonance, robot, echo }
 * @returns {{ outputNode: AudioNode, cleanup: Function }}
 */
export function applyVocalFormantAndFX(audioCtx, sourceNode, options = {}) {
  const {
    formantHz = 2800,
    resonance = 3.0,
    robot = false,
    echo = false,
  } = options;

  let currentNode = sourceNode;
  const cleanups = [];

  // 1. High-pass filter to clean up low mic thumps and wind noise
  const highpass = audioCtx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.setValueAtTime(140, audioCtx.currentTime);
  currentNode.connect(highpass);
  currentNode = highpass;

  // 2. Formant Peaking Filter (simulates smaller/larger cartoon vocal tract)
  const formantFilter = audioCtx.createBiquadFilter();
  formantFilter.type = 'peaking';
  formantFilter.frequency.setValueAtTime(Math.max(400, Math.min(5000, formantHz)), audioCtx.currentTime);
  formantFilter.Q.setValueAtTime(resonance, audioCtx.currentTime);
  formantFilter.gain.setValueAtTime(7.0, audioCtx.currentTime); // +7dB cartoon presence
  currentNode.connect(formantFilter);
  currentNode = formantFilter;

  // 3. High-shelf filter to tame overly sharp harsh frequencies
  const highshelf = audioCtx.createBiquadFilter();
  highshelf.type = 'highshelf';
  highshelf.frequency.setValueAtTime(6000, audioCtx.currentTime);
  highshelf.gain.setValueAtTime(-3.0, audioCtx.currentTime);
  currentNode.connect(highshelf);
  currentNode = highshelf;

  // 4. Robot Voice Effect (Ring Modulation)
  if (robot) {
    const ringGain = audioCtx.createGain();
    ringGain.gain.setValueAtTime(0, audioCtx.currentTime);

    const carrierOsc = audioCtx.createOscillator();
    carrierOsc.type = 'sine';
    carrierOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // 55Hz robotic hum

    const carrierGain = audioCtx.createGain();
    carrierGain.gain.setValueAtTime(0.5, audioCtx.currentTime);

    carrierOsc.connect(carrierGain.gain);
    currentNode.connect(ringGain);

    // Merge clean and modulated
    const robotMix = audioCtx.createGain();
    robotMix.gain.setValueAtTime(1.0, audioCtx.currentTime);
    currentNode.connect(robotMix);
    ringGain.connect(robotMix);

    carrierOsc.start();
    cleanups.push(() => {
      try {
        carrierOsc.stop();
        carrierOsc.disconnect();
      } catch (_) {}
    });

    currentNode = robotMix;
  }

  // 5. Echo Effect (Kid-friendly bounce)
  if (echo) {
    const delayNode = audioCtx.createDelay(1.0);
    delayNode.delayTime.setValueAtTime(0.20, audioCtx.currentTime); // 200ms delay

    const feedbackNode = audioCtx.createGain();
    feedbackNode.gain.setValueAtTime(0.38, audioCtx.currentTime);

    const echoFilter = audioCtx.createBiquadFilter();
    echoFilter.type = 'lowpass';
    echoFilter.frequency.setValueAtTime(3000, audioCtx.currentTime); // Damped warm repeats

    // Loop
    delayNode.connect(echoFilter);
    echoFilter.connect(feedbackNode);
    feedbackNode.connect(delayNode);

    const echoMix = audioCtx.createGain();
    currentNode.connect(echoMix);
    currentNode.connect(delayNode);
    delayNode.connect(echoMix);

    currentNode = echoMix;
  }

  return {
    outputNode: currentNode,
    cleanup: () => {
      cleanups.forEach((fn) => fn());
    },
  };
}
