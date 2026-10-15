package com.talkingcat.companion.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkingcat.companion.data.DEFAULT_VOICE_PRESETS
import com.talkingcat.companion.data.VoicePreset
import java.util.Locale

@Composable
fun VoiceModulatorCard(
    currentPitch: Float,
    activePresetId: String,
    onPitchChanged: (Float) -> Unit,
    onPresetSelected: (VoicePreset) -> Unit,
    onReset: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(Color.White.copy(alpha = 0.90f))
            .border(2.dp, Color.White, RoundedCornerShape(24.dp))
            .padding(14.dp)
    ) {
        Column(
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "🎙️ Voice Magic",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = Color(0xFF1E293B)
                )

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(50))
                        .background(Color(0xFFF1F5F9))
                        .clickable { onReset() }
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "🔄 Reset",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF475569)
                    )
                }
            }

            // Quick Preset Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                DEFAULT_VOICE_PRESETS.forEach { preset ->
                    val isSelected = activePresetId == preset.id
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(14.dp))
                            .background(
                                if (isSelected) Color(0xFF9333EA) else Color(0xFFF8FAFC)
                            )
                            .border(
                                width = 1.dp,
                                color = if (isSelected) Color(0xFF9333EA) else Color(0xFFE2E8F0),
                                shape = RoundedCornerShape(14.dp)
                            )
                            .clickable { onPresetSelected(preset) }
                            .padding(vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(text = preset.icon, fontSize = 16.sp)
                            Text(
                                text = preset.name,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White else Color(0xFF334155),
                                maxLines = 1
                            )
                        }
                    }
                }
            }

            // Pitch Slider
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFF8FAFC), RoundedCornerShape(16.dp))
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "🐻 Deep", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B))
                    Text(
                        text = String.format(Locale.US, "Pitch: %.2fx", currentPitch),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFF9333EA)
                    )
                    Text(text = "🐭 High", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF64748B))
                }

                Slider(
                    value = currentPitch,
                    onValueChange = { onPitchChanged(it) },
                    valueRange = 0.6f..2.1f,
                    colors = SliderDefaults.colors(
                        thumbColor = Color(0xFF9333EA),
                        activeTrackColor = Color(0xFFC084FC),
                        inactiveTrackColor = Color(0xFFE2E8F0)
                    ),
                    modifier = Modifier.height(28.dp)
                )
            }
        }
    }
}
