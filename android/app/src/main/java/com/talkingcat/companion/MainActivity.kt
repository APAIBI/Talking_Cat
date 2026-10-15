package com.talkingcat.companion

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import com.talkingcat.companion.ui.components.*
import com.talkingcat.companion.ui.theme.TalkingCompanionTheme

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            TalkingCompanionTheme {
                TalkingAppScreen(viewModel = viewModel)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            viewModel.startListening()
        }
    }

    override fun onPause() {
        super.onPause()
        viewModel.stopListening()
    }
}

@Composable
fun TalkingAppScreen(
    viewModel: MainViewModel
) {
    val context = LocalContext.current
    var hasPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        hasPermission = isGranted
        if (isGranted) {
            viewModel.startListening()
        }
    }

    LaunchedEffect(Unit) {
        if (!hasPermission) {
            permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        } else {
            viewModel.startListening()
        }
    }

    val activeAvatar by viewModel.activeAvatar.collectAsState()
    val engineState by viewModel.engineState.collectAsState()
    val audioLevel by viewModel.audioLevel.collectAsState()
    val pitch by viewModel.pitch.collectAsState()
    val activePresetId by viewModel.activePresetId.collectAsState()
    val isBlinking by viewModel.isBlinking.collectAsState()

    Scaffold { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = activeAvatar.gradientColors
                    )
                )
                .padding(paddingValues)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(vertical = 12.dp, horizontal = 12.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // Top: Status Pill
                StatusBadge(
                    state = engineState,
                    modifier = Modifier.padding(top = 8.dp)
                )

                // Center: Realistic Full-Body Avatar & Audio Visualizer
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    AvatarFullBodyView(
                        avatar = activeAvatar,
                        state = engineState,
                        audioLevel = audioLevel,
                        isBlinking = isBlinking,
                        modifier = Modifier.weight(1f, fill = false)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    AudioVisualizerView(
                        audioLevel = audioLevel,
                        state = engineState
                    )
                }

                // Bottom Control Deck: Character Switcher & Voice Magic Modulator
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    AvatarSelectorRow(
                        activeAvatar = activeAvatar,
                        onAvatarSelected = { viewModel.selectAvatar(it) }
                    )

                    VoiceModulatorCard(
                        currentPitch = pitch,
                        activePresetId = activePresetId,
                        onPitchChanged = { viewModel.setCustomPitch(it) },
                        onPresetSelected = { viewModel.selectPreset(it) },
                        onReset = { viewModel.resetToAvatarDefaults() }
                    )
                }
            }
        }
    }
}
