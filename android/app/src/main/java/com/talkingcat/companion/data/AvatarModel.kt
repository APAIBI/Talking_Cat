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
    val eyeYPercent: Float
)

data class AvatarModel(
    val id: String,
    val name: String,
    val species: String,
    val icon: String,
    @DrawableRes val imageRes: Int,
    val defaultPitch: Float,
    val defaultSpeed: Float,
    val faceCoords: AvatarFaceCoords,
    val gradientColors: List<Color>,
    val primaryColor: Color
)

val AVATAR_LIST = listOf(
    AvatarModel(
        id = "male_cat",
        name = "Leo the Cat",
        species = "Male Ginger Cat",
        icon = "🐱",
        imageRes = R.drawable.male_cat,
        defaultPitch = 1.62f,
        defaultSpeed = 1.15f,
        faceCoords = AvatarFaceCoords(
            mouthXPercent = 50.5f,
            mouthYPercent = 26.2f,
            mouthWidthPercent = 9.0f,
            leftEyeXPercent = 46.0f,
            rightEyeXPercent = 55.0f,
            eyeYPercent = 21.0f
        ),
        gradientColors = listOf(Color(0xFFFEF3C7), Color(0xFFFFEDD5), Color(0xFFFEE2E2)),
        primaryColor = Color(0xFFEA580C)
    ),
    AvatarModel(
        id = "female_cat",
        name = "Luna Kitty",
        species = "Fluffy Calico Kitten",
        icon = "🎀",
        imageRes = R.drawable.female_cat,
        defaultPitch = 1.85f,
        defaultSpeed = 1.22f,
        faceCoords = AvatarFaceCoords(
            mouthXPercent = 66.0f,
            mouthYPercent = 44.8f,
            mouthWidthPercent = 9.5f,
            leftEyeXPercent = 58.0f,
            rightEyeXPercent = 73.0f,
            eyeYPercent = 37.5f
        ),
        gradientColors = listOf(Color(0xFFFCE7F3), Color(0xFFF3E8FF), Color(0xFFE0E7FF)),
        primaryColor = Color(0xFFDB2777)
    ),
    AvatarModel(
        id = "female_human",
        name = "Maya",
        species = "Human Companion",
        icon = "👧",
        imageRes = R.drawable.female_human,
        defaultPitch = 1.32f,
        defaultSpeed = 1.05f,
        faceCoords = AvatarFaceCoords(
            mouthXPercent = 50.0f,
            mouthYPercent = 22.8f,
            mouthWidthPercent = 7.5f,
            leftEyeXPercent = 46.2f,
            rightEyeXPercent = 53.8f,
            eyeYPercent = 18.5f
        ),
        gradientColors = listOf(Color(0xFFE0F2FE), Color(0xFFCCFBF1), Color(0xFFEDE9FE)),
        primaryColor = Color(0xFF0891B2)
    ),
    AvatarModel(
        id = "dog",
        name = "Barnaby Pup",
        species = "Golden Retriever Pup",
        icon = "🐶",
        imageRes = R.drawable.dog,
        defaultPitch = 0.82f,
        defaultSpeed = 0.95f,
        faceCoords = AvatarFaceCoords(
            mouthXPercent = 63.5f,
            mouthYPercent = 37.8f,
            mouthWidthPercent = 9.0f,
            leftEyeXPercent = 58.0f,
            rightEyeXPercent = 68.2f,
            eyeYPercent = 25.0f
        ),
        gradientColors = listOf(Color(0xFFFEF3C7), Color(0xFFFFEDD5), Color(0xFFFFFBEB)),
        primaryColor = Color(0xFFD97706)
    )
)
