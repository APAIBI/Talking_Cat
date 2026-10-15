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

    // Gentle floating breathing rhythm
    val infiniteTransition = rememberInfiniteTransition(label = "float")
    val floatOffset by infiniteTransition.animateFloat(
        initialValue = -4f,
        targetValue = 4f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "offsetY"
    )

    // Dynamic realistic mouth opening
    val dynamicMouthHeightDp = max(3f, audioLevel * 24f)
    val isMouthOpen = isSpeaking && audioLevel > 0.08f
    val jawDropDp = if (isSpeaking) audioLevel * 2.2f else 0f

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Full Body Character Frame
        Box(
            modifier = Modifier
                .offset(y = floatOffset.dp)
                .fillMaxWidth(0.85f)
                .aspectRatio(3f / 4f)
                .shadow(16.dp, RoundedCornerShape(28.dp))
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

                // Realistic Organic Mouth & Jaw Articulation
                if (isMouthOpen) {
                    Box(
                        modifier = Modifier
                            .offset(
                                x = mouthXDp - (mouthWidthDp / 2),
                                y = mouthYDp - (dynamicMouthHeightDp.dp / 2) + jawDropDp.dp
                            )
                            .width(mouthWidthDp)
                            .height(dynamicMouthHeightDp.dp)
                            .clip(RoundedCornerShape(50))
                            .background(
                                Brush.radialGradient(
                                    colors = listOf(Color(0xFF380C0C), Color(0xFF170707))
                                )
                            )
                            .border(0.8.dp, Color(0xFF4A1515), RoundedCornerShape(50)),
                        contentAlignment = Alignment.Center
                    ) {
                        // Upper Teeth Arch
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopCenter)
                                .fillMaxWidth(0.75f)
                                .height(max(2f, dynamicMouthHeightDp * 0.26f).dp)
                                .background(Color(0xFFFFFBEB), RoundedCornerShape(bottomStart = 2.dp, bottomEnd = 2.dp))
                        )
                        // Tongue
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomCenter)
                                .fillMaxWidth(0.6f)
                                .height(max(2f, dynamicMouthHeightDp * 0.42f).dp)
                                .background(
                                    Brush.verticalGradient(
                                        colors = listOf(Color(0xFFFB7185), Color(0xFFE11D48))
                                    ),
                                    RoundedCornerShape(topStart = 6.dp, topEnd = 6.dp)
                                )
                        )
                    }
                }

                // Natural Eyelid Blink Overlay
                if (isBlinking) {
                    val leftEyeXDp = boxWidth * (coords.leftEyeXPercent / 100f)
                    val rightEyeXDp = boxWidth * (coords.rightEyeXPercent / 100f)
                    val eyeYDp = boxHeight * (coords.eyeYPercent / 100f)
                    val eyeSize = 13.dp

                    Box(
                        modifier = Modifier
                            .offset(x = leftEyeXDp - (eyeSize / 2), y = eyeYDp - 1.5.dp)
                            .size(eyeSize, 2.5.dp)
                            .background(Color(0xFF1C1917), RoundedCornerShape(50))
                    )
                    Box(
                        modifier = Modifier
                            .offset(x = rightEyeXDp - (eyeSize / 2), y = eyeYDp - 1.5.dp)
                            .size(eyeSize, 2.5.dp)
                            .background(Color(0xFF1C1917), RoundedCornerShape(50))
                    )
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
