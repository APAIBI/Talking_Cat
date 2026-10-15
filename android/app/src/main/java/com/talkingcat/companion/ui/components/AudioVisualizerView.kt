package com.talkingcat.companion.ui.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.talkingcat.companion.audio.EngineState

@Composable
fun AudioVisualizerView(
    audioLevel: Float,
    state: EngineState,
    modifier: Modifier = Modifier
) {
    val barMultipliers = listOf(0.4f, 0.75f, 1.2f, 1.6f, 1.2f, 0.75f, 0.4f)
    val colors = listOf(
        Color(0xFFFB7185), // Rose
        Color(0xFFFBBF24), // Amber
        Color(0xFF34D399), // Emerald
        Color(0xFF22D3EE), // Cyan
        Color(0xFF60A5FA), // Blue
        Color(0xFFA78BFA), // Violet
        Color(0xFFF472B6)  // Pink
    )

    val isActive = state == EngineState.RECORDING || state == EngineState.SPEAKING

    Box(
        modifier = modifier
            .background(Color.White.copy(alpha = 0.85f), RoundedCornerShape(20.dp))
            .border(1.5.dp, Color.White, RoundedCornerShape(20.dp))
            .padding(horizontal = 16.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.height(36.dp)
        ) {
            barMultipliers.forEachIndexed { index, mult ->
                val targetHeight = if (isActive) {
                    (6f + audioLevel * 30f * mult).coerceIn(6f, 36f)
                } else {
                    6f
                }

                val animatedHeight by animateDpAsState(
                    targetValue = targetHeight.dp,
                    animationSpec = tween(durationMillis = 60),
                    label = "barHeight$index"
                )

                Box(
                    modifier = Modifier
                        .width(7.dp)
                        .height(animatedHeight)
                        .background(colors[index % colors.size], RoundedCornerShape(50))
                )
            }
        }
    }
}
