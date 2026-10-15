package com.talkingcat.companion.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.media.PlaybackParams
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.math.min
import kotlin.math.sqrt

/**
 * Pure Kotlin AudioTrack playback engine with hardware-accelerated
 * pitch-shifting and speed modulation via Android PlaybackParams.
 */
class PitchPlaybackEngine(
    private val onPlaybackStarted: () -> Unit,
    private val onPlaybackFinished: () -> Unit
) {
    private var audioTrack: AudioTrack? = null
    private var playbackJob: Job? = null

    private val _playbackLevelFlow = MutableStateFlow(0f)
    val playbackLevelFlow: StateFlow<Float> = _playbackLevelFlow.asStateFlow()

    fun play(
        pcmSamples: ShortArray,
        sampleRate: Int,
        pitch: Float,
        speed: Float,
        scope: CoroutineScope
    ) {
        stop()

        val channelConfig = AudioFormat.CHANNEL_OUT_MONO
        val audioFormat = AudioFormat.ENCODING_PCM_16BIT
        val minBufferSize = AudioTrack.getMinBufferSize(sampleRate, channelConfig, audioFormat)
        val bufferSize = minBufferSize * 2

        try {
            audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(audioFormat)
                        .setSampleRate(sampleRate)
                        .setChannelMask(channelConfig)
                        .build()
                )
                .setBufferSizeInBytes(bufferSize)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()

            // Apply Pitch and Speed Modulation
            val params = PlaybackParams()
            params.pitch = pitch.coerceIn(0.5f, 2.5f)
            params.speed = speed.coerceIn(0.5f, 2.5f)
            audioTrack?.playbackParams = params

            audioTrack?.play()
            onPlaybackStarted()

            playbackJob = scope.launch(Dispatchers.IO) {
                val chunkSize = 1024
                var offset = 0
                val total = pcmSamples.size

                while (isActive && offset < total) {
                    val remaining = total - offset
                    val toWrite = min(chunkSize, remaining)

                    // Calculate RMS of chunk to drive mouth animation
                    var sumSquares = 0.0
                    for (i in 0 until toWrite) {
                        val sample = pcmSamples[offset + i].toDouble()
                        sumSquares += sample * sample
                    }
                    val rms = sqrt(sumSquares / toWrite).toFloat()
                    val normalizedLevel = min(1.0f, (rms / 2500f) * 1.5f)
                    _playbackLevelFlow.value = normalizedLevel

                    audioTrack?.write(pcmSamples, offset, toWrite)
                    offset += toWrite
                }

                // Short delay to allow remaining track buffer to drain
                delay(150)
                _playbackLevelFlow.value = 0f

                withContext(Dispatchers.Main) {
                    stop()
                    onPlaybackFinished()
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            stop()
            onPlaybackFinished()
        }
    }

    fun stop() {
        playbackJob?.cancel()
        playbackJob = null

        try {
            audioTrack?.pause()
            audioTrack?.flush()
            audioTrack?.stop()
            audioTrack?.release()
        } catch (_: Exception) {}
        audioTrack = null

        _playbackLevelFlow.value = 0f
    }
}
