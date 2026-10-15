package com.talkingcat.companion.audio

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.media.audiofx.AcousticEchoCanceler
import android.media.audiofx.AutomaticGainControl
import android.media.audiofx.NoiseSuppressor
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sqrt

enum class EngineState {
    IDLE,
    LISTENING,
    RECORDING,
    PROCESSING,
    SPEAKING
}

/**
 * Enhanced Continuous AudioRecord engine in pure Kotlin with hardware NoiseSuppressor,
 * AcousticEchoCanceler, and intelligent sustained-voice activity detection (VAD).
 */
class AudioCaptureEngine(
    private val sampleRate: Int = 44100,
    private val onStateChanged: (EngineState) -> Unit,
    private val onSpeechCompleted: (ShortArray, Int) -> Unit
) {
    private var audioRecord: AudioRecord? = null
    private var noiseSuppressor: NoiseSuppressor? = null
    private var echoCanceler: AcousticEchoCanceler? = null
    private var autoGainControl: AutomaticGainControl? = null

    private var recordingJob: Job? = null
    private var isRunning = false

    private val _audioLevelFlow = MutableStateFlow(0f)
    val audioLevelFlow: StateFlow<Float> = _audioLevelFlow.asStateFlow()

    private var noiseFloor = 180f
    private var isVoiceActive = false
    private var candidateSpeechStart = 0L
    private var speechStartTime = 0L
    private var silenceStartTime = 0L

    private val pcmBuffer = ArrayList<Short>()

    @SuppressLint("MissingPermission")
    fun startListening(scope: CoroutineScope) {
        if (isRunning) return

        val channelConfig = AudioFormat.CHANNEL_IN_MONO
        val audioFormat = AudioFormat.ENCODING_PCM_16BIT
        val minBufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)
        val bufferSize = max(minBufferSize, sampleRate / 10)

        try {
            val record = AudioRecord(
                MediaRecorder.AudioSource.VOICE_RECOGNITION,
                sampleRate,
                channelConfig,
                audioFormat,
                bufferSize
            )

            if (record.state != AudioRecord.STATE_INITIALIZED) {
                record.release()
                return
            }

            // Enable Hardware Noise Suppressor if supported by device
            val sessionId = record.audioSessionId
            if (NoiseSuppressor.isAvailable()) {
                noiseSuppressor = NoiseSuppressor.create(sessionId)?.apply { enabled = true }
            }
            if (AcousticEchoCanceler.isAvailable()) {
                echoCanceler = AcousticEchoCanceler.create(sessionId)?.apply { enabled = true }
            }
            if (AutomaticGainControl.isAvailable()) {
                autoGainControl = AutomaticGainControl.create(sessionId)?.apply { enabled = true }
            }

            record.startRecording()
            audioRecord = record
            isRunning = true
            onStateChanged(EngineState.LISTENING)

            recordingJob = scope.launch(Dispatchers.IO) {
                val readBuffer = ShortArray(bufferSize / 2)

                while (isActive && isRunning) {
                    val readCount = audioRecord?.read(readBuffer, 0, readBuffer.size) ?: 0
                    if (readCount > 0) {
                        processAudioChunk(readBuffer, readCount)
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            stopListening()
        }
    }

    private fun processAudioChunk(chunk: ShortArray, count: Int) {
        // Compute RMS energy
        var sumSquares = 0.0
        for (i in 0 until count) {
            val sample = chunk[i].toDouble()
            sumSquares += sample * sample
        }
        val rms = sqrt(sumSquares / count).toFloat()

        // Stable background noise calibration
        if (!isVoiceActive) {
            noiseFloor = noiseFloor * 0.99f + rms * 0.01f
        }

        // Hysteresis thresholds for strict noise rejection
        val onsetThreshold = max(450f, noiseFloor * 3.2f)
        val continuationThreshold = max(280f, noiseFloor * 2.0f)

        val normalizedLevel = min(1.0f, max(0f, (rms - noiseFloor) / 2500f))
        _audioLevelFlow.value = normalizedLevel

        val now = System.currentTimeMillis()

        if (!isVoiceActive) {
            // Require sustained speech for >= 200ms before triggering recording
            if (rms > onsetThreshold) {
                if (candidateSpeechStart == 0L) {
                    candidateSpeechStart = now
                } else if (now - candidateSpeechStart > 200L) {
                    isVoiceActive = true
                    speechStartTime = now
                    candidateSpeechStart = 0L
                    pcmBuffer.clear()
                    onStateChanged(EngineState.RECORDING)
                }
            } else {
                candidateSpeechStart = 0L
            }
        } else {
            // Already recording
            val isStillSpeaking = rms > continuationThreshold

            if (isStillSpeaking) {
                silenceStartTime = 0L
                for (i in 0 until count) {
                    pcmBuffer.add(chunk[i])
                }
                if (now - speechStartTime > 12000L) {
                    finishUtterance()
                }
            } else {
                // Keep short buffer during natural speech pauses
                for (i in 0 until count) {
                    pcmBuffer.add(chunk[i])
                }

                if (silenceStartTime == 0L) {
                    silenceStartTime = now
                } else if (now - silenceStartTime > 900L) {
                    finishUtterance()
                }
            }
        }
    }

    private fun finishUtterance() {
        isVoiceActive = false
        candidateSpeechStart = 0L
        silenceStartTime = 0L

        val capturedSamples = pcmBuffer.toShortArray()
        pcmBuffer.clear()

        val minSamples = (sampleRate * 0.35f).toInt()
        if (capturedSamples.size >= minSamples) {
            onStateChanged(EngineState.PROCESSING)
            onSpeechCompleted(capturedSamples, sampleRate)
        } else {
            onStateChanged(EngineState.LISTENING)
        }
    }

    fun stopListening() {
        isRunning = false
        recordingJob?.cancel()
        recordingJob = null

        try {
            noiseSuppressor?.release()
            echoCanceler?.release()
            autoGainControl?.release()
            audioRecord?.stop()
            audioRecord?.release()
        } catch (_: Exception) {}

        audioRecord = null
        noiseSuppressor = null
        echoCanceler = null
        autoGainControl = null

        _audioLevelFlow.value = 0f
        onStateChanged(EngineState.IDLE)
    }
}
