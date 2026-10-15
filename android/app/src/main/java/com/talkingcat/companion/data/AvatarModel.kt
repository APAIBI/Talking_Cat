package com.talkingcat.companion.data

import androidx.annotation.DrawableRes
import androidx.compose.ui.graphics.Color
import com.talkingcat.companion.R

data class AvatarFaceCoords(
    val mouthXPercent: Float,
    val mouthYPercent: Float,
    val mouthWidthPercent: Float,
    val leftEyeXPercent: Float,
    val rightEyeXPercent: Float,
    val eyeYPercent: Float,
    val eyeWidthPercent: Float,
    val eyeHeightPercent: Float,
    val eyelidColor: Color,
    val lipColor: Color,
    val innerMouthColor: Color
)

data class AvatarModel(
    val id: String,
    val name: String,
    val species: String,
    val icon: String,
    @DrawableRes val imageRes: Int,
    val naturalPitch: Float,
    val naturalSpeed: Float,
    val faceCoords: AvatarFaceCoords,
    val gradientColors: List<Color>,
    val primaryColor: Color
)

val AVATAR_LIST = listOf(
    AvatarModel(
        id = "rocky",
        name = "Rocky",
        species = "Siberian Husky",
        icon = "🐺",
        imageRes = R.drawable.rocky,
        naturalPitch = 0.82f,
        naturalSpeed = 0.98f,
        faceCoords = AvatarFaceCoords(
            mouthXPercent = 48.5f,
            mouthYPercent = 24.5f,
            mouthWidthPercent = 8.0f,
            leftEyeXPercent = 44.5f,
            rightEyeXPercent = 53.0f,
            eyeYPercent = 17.5f,
            eyeWidthPercent = 4.2f,
            eyeHeightPercent = 3.8f,
            eyelidColor = Color(0xFF374151),
            lipColor = Color(0xFF1F2937),
            innerMouthColor = Color(0xFF260D0D)
        ),
        gradientColors = listOf(Color(0xFFE2E8F0), Color(0xFFBAE6FD), Color(0xFFE0E7FF)),
        primaryColor = Color(0xFF0284C7)
    ),
    AvatarModel(
        id = "kelvin",
        name = "Kelvin",
        species = "Silver Male Cat",
        icon = "🐱",
        imageRes = R.drawable.kelvin,
        naturalPitch = 1.08f,
        naturalSpeed = 1.02f,
        faceCoords = AvatarFaceCoords(
            mouthXPercent = 48.2f,
            mouthYPercent = 21.6f,
            mouthWidthPercent = 7.8f,
            leftEyeXPercent = 43.2f,
            rightEyeXPercent = 52.5f,
            eyeYPercent = 16.8f,
            eyeWidthPercent = 4.4f,
            eyeHeightPercent = 4.0f,
            eyelidColor = Color(0xFF64748B),
            lipColor = Color(0xFF334155),
            innerMouthColor = Color(0xFF260B0B)
        ),
        gradientColors = listOf(Color(0xFFF1F5F9), Color(0xFFE2E8F0), Color(0xFFFEF3C7)),
        primaryColor = Color(0xFF475569)
    ),
    AvatarModel(
        id = "sakura",
        name = "Sakura",
        species = "Cyan Kimono Teen",
        icon = "🌸",
        imageRes = R.drawable.sakura,
        naturalPitch = 1.28f,
        naturalSpeed = 1.02f,
        faceCoords = AvatarFaceCoords(
            mouthXPercent = 50.2f,
            mouthYPercent = 21.8f,
            mouthWidthPercent = 6.8f,
            leftEyeXPercent = 46.5f,
            rightEyeXPercent = 53.8f,
            eyeYPercent = 18.0f,
            eyeWidthPercent = 3.6f,
            eyeHeightPercent = 3.2f,
            eyelidColor = Color(0xFFD97706),
            lipColor = Color(0xFFE11D48),
            innerMouthColor = Color(0xFF4C0519)
        ),
        gradientColors = listOf(Color(0xFFCCFBF1), Color(0xFFE0F2FE), Color(0xFFEDE9FE)),
        primaryColor = Color(0xFF0891B2)
    ),
    AvatarModel(
        id = "elena",
        name = "Elena",
        species = "Ana de Armas Style",
        icon = "✨",
        imageRes = R.drawable.elena,
        naturalPitch = 1.15f,
        naturalSpeed = 1.00f,
        faceCoords = AvatarFaceCoords(
            mouthXPercent = 50.8f,
            mouthYPercent = 19.8f,
            mouthWidthPercent = 7.2f,
            leftEyeXPercent = 47.5f,
            rightEyeXPercent = 54.2f,
            eyeYPercent = 16.6f,
            eyeWidthPercent = 3.6f,
            eyeHeightPercent = 3.2f,
            eyelidColor = Color(0xFFC2410C),
            lipColor = Color(0xFFBE123C),
            innerMouthColor = Color(0xFF4C0519)
        ),
        gradientColors = listOf(Color(0xFFD1FAE5), Color(0xFFCCFBF1), Color(0xFFF5F5F4)),
        primaryColor = Color(0xFF059669)
    )
)
