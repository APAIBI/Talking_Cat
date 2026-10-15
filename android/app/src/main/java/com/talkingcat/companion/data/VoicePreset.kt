package com.talkingcat.companion.data

data class VoicePreset(
    val id: String,
    val name: String,
    val icon: String,
    val pitch: Float,
    val speed: Float,
    val description: String
)

val DEFAULT_VOICE_PRESETS = listOf(
    VoicePreset(
        id = "chipmunk",
        name = "Chipmunk",
        icon = "🐿️",
        pitch = 1.62f,
        speed = 1.15f,
        description = "Classic funny talking cat pitch"
    ),
    VoicePreset(
        id = "squeaky",
        name = "Baby Kitty",
        icon = "🎀",
        pitch = 1.85f,
        speed = 1.25f,
        description = "Ultra squeaky cute high pitch"
    ),
    VoicePreset(
        id = "friendly",
        name = "Happy Kid",
        icon = "✨",
        pitch = 1.30f,
        speed = 1.05f,
        description = "Warm energetic cartoon voice"
    ),
    VoicePreset(
        id = "deep",
        name = "Big Doggy",
        icon = "🐕",
        pitch = 0.82f,
        speed = 0.95f,
        description = "Deep warm woof rumble"
    )
)
