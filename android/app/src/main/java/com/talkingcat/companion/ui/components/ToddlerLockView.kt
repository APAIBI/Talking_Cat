package com.talkingcat.companion.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.util.*
import kotlin.math.roundToInt

@Composable
fun ToddlerLockView(
    isLocked: Boolean,
    onUnlock: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (!isLocked) return

    var currentTime by remember { mutableStateOf("") }
    var currentDate by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        val timeFormat = SimpleDateFormat("h:mm a", Locale.getDefault())
        val dateFormat = SimpleDateFormat("EEEE, MMMM d", Locale.getDefault())
        while (true) {
            val now = Date()
            currentTime = timeFormat.format(now)
            currentDate = dateFormat.format(now)
            delay(1000)
        }
    }

    var dragOffset by remember { mutableFloatStateOf(0f) }
    val maxDragPx = 500f

    AnimatedVisibility(
        visible = isLocked,
        enter = fadeIn(),
        exit = fadeOut(),
        modifier = modifier.fillMaxSize()
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.35f))
                .padding(24.dp)
        ) {
            // Top: Phone Lock Screen Time & Date
            Column(
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 28.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(50))
                        .background(Color.Black.copy(alpha = 0.5f))
                        .border(1.dp, Color.White.copy(alpha = 0.25f), RoundedCornerShape(50))
                        .padding(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = "🔒 Toddler Safe Mode Active",
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = currentTime,
                    fontSize = 54.sp,
                    fontWeight = FontWeight.Light,
                    color = Color.White
                )

                Text(
                    text = currentDate,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color.White.copy(alpha = 0.9f)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "✨ Still listening! Talk to your buddy freely",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFFFDE68A)
                )
            }

            // Bottom: Slide to Unlock Track
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 20.dp)
                    .fillMaxWidth(0.85f)
                    .height(60.dp)
                    .clip(RoundedCornerShape(50))
                    .background(Color.Black.copy(alpha = 0.6f))
                    .border(2.dp, Color.White.copy(alpha = 0.35f), RoundedCornerShape(50))
                    .padding(4.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                // Background Track Prompt Text
                Text(
                    text = "SLIDE TO UNLOCK ➔",
                    color = Color.White.copy(alpha = 0.65f),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    modifier = Modifier.align(Alignment.Center)
                )

                // Draggable Unlock Handle
                Box(
                    modifier = Modifier
                        .offset { IntOffset(dragOffset.roundToInt(), 0) }
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                        .border(2.dp, Color(0xFFFBBF24), CircleShape)
                        .draggable(
                            orientation = Orientation.Horizontal,
                            state = rememberDraggableState { delta ->
                                val newOffset = (dragOffset + delta).coerceIn(0f, maxDragPx)
                                dragOffset = newOffset
                                if (newOffset >= maxDragPx * 0.82f) {
                                    dragOffset = 0f
                                    onUnlock()
                                }
                            },
                            onDragStopped = {
                                if (dragOffset < maxDragPx * 0.82f) {
                                    dragOffset = 0f
                                }
                            }
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "🔓", fontSize = 20.sp)
                }
            }
        }
    }
}
