package com.talkingcat.companion

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.talkingcat.companion.audio.AudioCaptureEngine
import com.talkingcat.companion.audio.EngineState
import com.talkingcat.companion.audio.PitchPlaybackEngine
import com.talkingcat.companion.data.AVATAR_LIST
import com.talkingcat.companion.data.AvatarModel
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

    private val _isLocked = MutableStateFlow(false)
    val isLocked: StateFlow<Boolean> = _isLocked.asStateFlow()

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
            // Automatically return to listening
            captureEngine.startListening(viewModelScope)
        }
    )

    init {
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
                val delayTime = Random.nextLong(2600, 5200)
                delay(delayTime)
                _isBlinking.value = true
                delay(150)
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
        val avatar = _activeAvatar.value
        playbackEngine.play(
            pcmSamples = pcmData,
            sampleRate = sampleRate,
            pitch = avatar.naturalPitch,
            speed = avatar.naturalSpeed,
            scope = viewModelScope
        )
    }

    fun selectAvatar(avatar: AvatarModel) {
        _activeAvatar.value = avatar
    }

    fun setLocked(locked: Boolean) {
        _isLocked.value = locked
    }

    override fun onCleared() {
        super.onCleared()
        stopListening()
        blinkJob?.cancel()
    }
}
