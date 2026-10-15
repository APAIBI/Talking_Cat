package com.talkingcat.companion

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.talkingcat.companion.audio.AudioCaptureEngine
import com.talkingcat.companion.audio.EngineState
import com.talkingcat.companion.audio.PitchPlaybackEngine
import com.talkingcat.companion.data.AVATAR_LIST
import com.talkingcat.companion.data.AvatarModel
import com.talkingcat.companion.data.VoicePreset
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlin.random.Random

class MainViewModel : ViewModel() {

    private val _activeAvatar = MutableStateFlow(AVATAR_LIST[0])
    val activeAvatar: StateFlow<AvatarModel> = _activeAvatar.asStateFlow()

    private val _engineState = MutableStateFlow(EngineState.IDLE)
    val engineState: StateFlow<EngineState> = _engineState.asStateFlow()

    private val _audioLevel = MutableStateFlow(0f)
    val audioLevel: StateFlow<Float> = _audioLevel.asStateFlow()

    private val _pitch = MutableStateFlow(AVATAR_LIST[0].defaultPitch)
    val pitch: StateFlow<Float> = _pitch.asStateFlow()

    private val _speed = MutableStateFlow(AVATAR_LIST[0].defaultSpeed)
    val speed: StateFlow<Float> = _speed.asStateFlow()

    private val _activePresetId = MutableStateFlow("chipmunk")
    val activePresetId: StateFlow<String> = _activePresetId.asStateFlow()

    private val _isBlinking = MutableStateFlow(false)
    val isBlinking: StateFlow<Boolean> = _isBlinking.asStateFlow()

    private var blinkJob: Job? = null

    // Audio Engines
    private val captureEngine = AudioCaptureEngine(
        onStateChanged = { newState ->
            _engineState.value = newState
        },
        onSpeechCompleted = { pcmData, sampleRate ->
            playTalkback(pcmData, sampleRate)
        }
    )

    private val playbackEngine = PitchPlaybackEngine(
        onPlaybackStarted = {
            _engineState.value = EngineState.SPEAKING
        },
        onPlaybackFinished = {
            // Return automatically to listening
            captureEngine.startListening(viewModelScope)
        }
    )

    init {
        // Collect real-time audio levels from both capture and playback engines
        viewModelScope.launch {
            captureEngine.audioLevelFlow.collect { level ->
                if (_engineState.value == EngineState.LISTENING || _engineState.value == EngineState.RECORDING) {
                    _audioLevel.value = level
                }
            }
        }

        viewModelScope.launch {
            playbackEngine.playbackLevelFlow.collect { level ->
                if (_engineState.value == EngineState.SPEAKING) {
                    _audioLevel.value = level
                }
            }
        }

        startBlinkTimer()
    }

    private fun startBlinkTimer() {
        blinkJob?.cancel()
        blinkJob = viewModelScope.launch {
            while (isActive) {
                val delayTime = Random.nextLong(2500, 5000)
                delay(delayTime)
                _isBlinking.value = true
                delay(160)
                _isBlinking.value = false
            }
        }
    }

    fun startListening() {
        captureEngine.startListening(viewModelScope)
    }

    fun stopListening() {
        captureEngine.stopListening()
        playbackEngine.stop()
        _audioLevel.value = 0f
    }

    private fun playTalkback(pcmData: ShortArray, sampleRate: Int) {
        playbackEngine.play(
            pcmSamples = pcmData,
            sampleRate = sampleRate,
            pitch = _pitch.value,
            speed = _speed.value,
            scope = viewModelScope
        )
    }

    fun selectAvatar(avatar: AvatarModel) {
        _activeAvatar.value = avatar
        _pitch.value = avatar.defaultPitch
        _speed.value = avatar.defaultSpeed
        _activePresetId.value = when (avatar.id) {
            "male_cat" -> "chipmunk"
            "female_cat" -> "squeaky"
            "female_human" -> "friendly"
            "dog" -> "deep"
            else -> "chipmunk"
        }
    }

    fun selectPreset(preset: VoicePreset) {
        _activePresetId.value = preset.id
        _pitch.value = preset.pitch
        _speed.value = preset.speed
    }

    fun setCustomPitch(newPitch: Float) {
        _pitch.value = newPitch
        _activePresetId.value = "custom"
    }

    fun resetToAvatarDefaults() {
        val current = _activeAvatar.value
        _pitch.value = current.defaultPitch
        _speed.value = current.defaultSpeed
        _activePresetId.value = "custom"
    }

    override fun onCleared() {
        super.onCleared()
        stopListening()
        blinkJob?.cancel()
    }
}
