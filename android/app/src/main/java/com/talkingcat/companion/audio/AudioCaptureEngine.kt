package com.talkingcat.companion.audio

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.io.ByteArrayOutputStream
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
 * Continuous autonomous AudioRecord engine in pure Kotlin.
 * Implements real-time Voice Activity Detection (VAD) and silence detection.
 */
class AudioCaptureEngine(
    private val sampleRate: Int = 44100,
    private val onStateChanged: (EngineState) -> Unit,
    private val onSpeechCompleted: (ShortArray, Int) -> Unit
) {
    private var audioRecord: AudioRecord? = null
    private var recordingJob: Job? = null
    private var isRunning = false

    private val _audioLevelFlow = MutableStateFlow(0f)
    val audioLevelFlow: StateFlow<Float> = _audioLevelFlow.asStateFlow()

    private var noiseFloor = 100f
    private var isVoiceActive = false
    private var speechStartTime = 0L
    private var silenceStartTime = 0L

    private val pcmBuffer = ArrayList<Short>()

    @SuppressLint("MissingPermission")
    fun startListening(scope: CoroutineScope) {
        if (isRunning) return

        val channelConfig = AudioFormat.CHANNEL_IN_MONO
        val audioFormat = AudioFormat.ENCODING_PCM_16BIT
        val minBufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)
        val bufferSize = max(minBufferSize, sampleRate / 10) // 100ms buffer

        try {
            audioRecord = AudioRecord(
                MediaRecorder.AudioSource.VOICE_RECOGNITION,
                sampleRate,
                channelConfig,
                audioFormat,
                bufferSize
            )

            if (audioRecord?.state != AudioRecord.STATE_INITIALIZED) {
                audioRecord?.release()
                audioRecord = null
                return
            }

            audioRecord?.startRecording()
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
        // Calculate RMS amplitude
        var sumSquares = 0.0
        for (i in 0 until count) {
            val sample = chunk[i].toDouble()
            sumSquares += sample * sample
        }
        val rms = sqrt(sumSquares / count).toFloat()

        // Slowly calibrate background noise floor
        noiseFloor = noiseFloor * 0.98f + rms * 0.02f
        val threshold = max(250f, noiseFloor * 2.2f)

        // Normalized 0.0f..1.0f audio level for UI & mouth sync
        val normalizedLevel = min(1.0f, rms / 3000f)
        _audioLevelFlow.value = normalizedLevel

        val now = System.currentTimeMillis()

        if (rms > threshold) {
            // Voice energy active!
            if (!isVoiceActive) {
                isVoiceActive = true
                speechStartTime = now
                pcmBuffer.clear()
                onStateChanged(EngineState.RECORDING)
            }
            silenceStartTime = 0L

            // Accumulate speech samples
            for (i in 0 until count) {
                pcmBuffer.add(chunk[i])
            }

            // Safety limit: max 12 seconds per turn
            if (now - speechStartTime > 12000L) {
                finishUtterance()
            }
        } else {
            // Silence detected
            if (isVoiceActive) {
                // Keep brief silence buffer for natural ending
                for (i in 0 until count) {
                    pcmBuffer.add(chunk[i])
                }

                if (silenceStartTime == 0L) {
                    silenceStartTime = now
                } else if (now - silenceStartTime > 850L) {
                    // 850ms silence threshold -> trigger talkback!
                    finishUtterance()
                }
            }
        }
    }

    private fun finishUtterance() {
        isVoiceActive = false
        silenceStartTime = 0L

        val capturedSamples = pcmBuffer.toShortArray()
        pcmBuffer.clear()

        // Ignore brief coughs or mic taps under 300ms
        val minSamples = (sampleRate * 0.3f).toInt()
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
            audioRecord?.stop()
            audioRecord?.release()
        } catch (_: Exception) {}
        audioRecord = null

        _audioLevelFlow.value = 0f
        onStateChanged(EngineState.IDLE)
    }
}
