package com.talkingcat.companion.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkingcat.companion.audio.EngineState

@Composable
fun StatusBadge(
    state: EngineState,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val scaleAnim by infiniteTransition.animateFloat(
        initialValue = 0.98f,
        targetValue = 1.03f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    AnimatedContent(
        targetState = state,
        label = "statusBadgeAnim",
        modifier = modifier
    ) { targetState ->
        val (bgColor, text, dotColor) = when (targetState) {
            EngineState.RECORDING -> Triple(
                Color(0xFFF43F5E),
                "🎙️ I hear you! Keep talking...",
                Color.White
            )
            EngineState.PROCESSING -> Triple(
                Color(0xFFF59E0B),
                "✨ Getting funny voice ready...",
                Color.White
            )
            EngineState.SPEAKING -> Triple(
                Color(0xFF9333EA),
                "📢 Listen! I am repeating you!",
                Color(0xFFFDE047)
            )
            EngineState.LISTENING, EngineState.IDLE -> Triple(
                Color(0xFF10B981),
                "👂 I'm listening! Say anything!",
                Color.White
            )
        }

        Box(
            modifier = Modifier
                .scale(if (targetState == EngineState.RECORDING || targetState == EngineState.SPEAKING) scaleAnim else 1f)
                .background(bgColor, RoundedCornerShape(50))
                .border(2.dp, Color.White, RoundedCornerShape(50))
                .padding(horizontal = 20.dp, vertical = 10.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .background(dotColor, CircleShape)
                )
                Text(
                    text = text,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
            }
        }
    }
}
