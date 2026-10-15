package com.talkingcat.companion.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.talkingcat.companion.audio.EngineState
import com.talkingcat.companion.data.AvatarModel
import kotlin.math.max

@Composable
fun AvatarFullBodyView(
    avatar: AvatarModel,
    state: EngineState,
    audioLevel: Float,
    isBlinking: Boolean,
    modifier: Modifier = Modifier
) {
    val isSpeaking = state == EngineState.SPEAKING
    val isRecording = state == EngineState.RECORDING
    val hasEyeContact = isRecording || isSpeaking

    // Gentle organic breathing motion
    val infiniteTransition = rememberInfiniteTransition(label = "float")
    val floatOffset by infiniteTransition.animateFloat(
        initialValue = -3.5f,
        targetValue = 3.5f,
        animationSpec = infiniteRepeatable(
            animation = tween(2400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "offsetY"
    )

    // Direct eye contact scale & lean when child speaks
    val eyeContactScale by animateFloatAsState(
        targetValue = if (hasEyeContact) 1.025f else 1.0f,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "eyeContactScale"
    )

    // Dynamic realistic phoneme mouth opening
    val dynamicMouthHeightDp = max(2.5f, audioLevel * 25f)
    val isMouthOpen = isSpeaking && audioLevel > 0.06f
    val jawDropDp = if (isSpeaking) audioLevel * 2.8f else 0f

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Full Body Character Frame with Eye Contact Lean
        Box(
            modifier = Modifier
                .offset(y = floatOffset.dp)
                .scale(eyeContactScale)
                .fillMaxWidth(0.85f)
                .aspectRatio(3f / 4f)
                .shadow(18.dp, RoundedCornerShape(28.dp))
                .clip(RoundedCornerShape(28.dp))
                .background(Color.White.copy(alpha = 0.2f))
                .border(
                    width = 3.dp,
                    color = if (isSpeaking) Color(0xFFF43F5E) else if (isRecording) Color(0xFF10B981) else Color.White,
                    shape = RoundedCornerShape(28.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            BoxWithConstraints(modifier = Modifier.fillMaxSize()) {
                val boxWidth = maxWidth
                val boxHeight = maxHeight

                // High-resolution realistic character base image
                Image(
                    painter = painterResource(id = avatar.imageRes),
                    contentDescription = avatar.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                val coords = avatar.faceCoords
                val mouthXDp = boxWidth * (coords.mouthXPercent / 100f)
                val mouthYDp = boxHeight * (coords.mouthYPercent / 100f)
                val mouthWidthDp = boxWidth * (coords.mouthWidthPercent / 100f)

                // 1. Direct Eye Contact Gaze Ring when listening to user
                if (hasEyeContact) {
                    val leftEyeXDp = boxWidth * (coords.leftEyeXPercent / 100f)
                    val rightEyeXDp = boxWidth * (coords.rightEyeXPercent / 100f)
                    val eyeYDp = boxHeight * (coords.eyeYPercent / 100f)
                    val eyeSize = 14.dp

                    Box(
                        modifier = Modifier
                            .offset(x = leftEyeXDp - (eyeSize / 2), y = eyeYDp - (eyeSize / 2))
                            .size(eyeSize)
                            .border(1.dp, Color(0xFFFDE68A).copy(alpha = 0.5f), CircleShape)
                    )
                    Box(
                        modifier = Modifier
                            .offset(x = rightEyeXDp - (eyeSize / 2), y = eyeYDp - (eyeSize / 2))
                            .size(eyeSize)
                            .border(1.dp, Color(0xFFFDE68A).copy(alpha = 0.5f), CircleShape)
                    )
                }

                // 2. Realistic Eyelid Blinking with Color-Matched Eyelids
                if (isBlinking) {
                    val leftEyeXDp = boxWidth * (coords.leftEyeXPercent / 100f)
                    val rightEyeXDp = boxWidth * (coords.rightEyeXPercent / 100f)
                    val eyeYDp = boxHeight * (coords.eyeYPercent / 100f)
                    val eyeW = boxWidth * (coords.eyeWidthPercent / 100f)
                    val eyeH = boxHeight * (coords.eyeHeightPercent / 100f)

                    Box(
                        modifier = Modifier
                            .offset(x = leftEyeXDp - (eyeW / 2), y = eyeYDp - (eyeH / 2))
                            .size(eyeW, eyeH)
                            .clip(RoundedCornerShape(bottomStartPercent = 80, bottomEndPercent = 80))
                            .background(coords.eyelidColor)
                            .border(1.dp, Color.Black.copy(alpha = 0.6f), RoundedCornerShape(bottomStartPercent = 80, bottomEndPercent = 80))
                    )
                    Box(
                        modifier = Modifier
                            .offset(x = rightEyeXDp - (eyeW / 2), y = eyeYDp - (eyeH / 2))
                            .size(eyeW, eyeH)
                            .clip(RoundedCornerShape(bottomStartPercent = 80, bottomEndPercent = 80))
                            .background(coords.eyelidColor)
                            .border(1.dp, Color.Black.copy(alpha = 0.6f), RoundedCornerShape(bottomStartPercent = 80, bottomEndPercent = 80))
                    )
                }

                // 3. Realistic Anatomical Mouth & Jaw Movement
                if (isMouthOpen) {
                    Box(
                        modifier = Modifier
                            .offset(
                                x = mouthXDp - (mouthWidthDp / 2),
                                y = mouthYDp - (dynamicMouthHeightDp.dp / 2) + jawDropDp.dp
                            )
                            .width(mouthWidthDp)
                            .height(dynamicMouthHeightDp.dp)
                            .clip(RoundedCornerShape(percent = 40))
                            .background(
                                Brush.radialGradient(
                                    colors = listOf(coords.innerMouthColor, Color(0xFF0F0304))
                                )
                            )
                            .border(1.dp, coords.lipColor, RoundedCornerShape(percent = 40)),
                        contentAlignment = Alignment.Center
                    ) {
                        // Upper Teeth Arch with Shading
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopCenter)
                                .fillMaxWidth(0.76f)
                                .height(max(2f, dynamicMouthHeightDp * 0.28f).dp)
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(Color(0xFFFFFFF0), Color(0xFFF5F5DC))
                                    ),
                                    RoundedCornerShape(bottomStart = 3.dp, bottomEnd = 3.dp)
                                )
                        )
                        // Tongue with Dynamic Depth
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomCenter)
                                .fillMaxWidth(0.62f)
                                .height(max(2f, dynamicMouthHeightDp * 0.44f).dp)
                                .background(
                                    Brush.radialGradient(
                                        colors = listOf(Color(0xFFFB7185), Color(0xFFE11D48), Color(0xFF9F1239))
                                    ),
                                    RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp)
                                )
                        )
                    }
                }
            }
        }

        // Realistic Floor Contact Shadow
        Box(
            modifier = Modifier
                .padding(top = 4.dp)
                .width(180.dp)
                .height(10.dp)
                .scale(scaleX = 1f, scaleY = 0.5f)
                .background(
                    Brush.radialGradient(
                        colors = listOf(Color.Black.copy(alpha = 0.25f), Color.Transparent)
                    ),
                    CircleShape
                )
        )
    }
}
