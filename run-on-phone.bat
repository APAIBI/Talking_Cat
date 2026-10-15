@echo off
title Talking Buddies - Run on Android Phone
echo ====================================================
echo    Talking Buddies - Mobile & Android Live Server
echo ====================================================
echo.
echo Make sure your Android phone is connected to the same Wi-Fi!
echo.
echo 1. Open Google Chrome on your Android phone.
echo 2. Go to: http://192.168.0.114:5173
echo 3. Allow Microphone when prompted.
echo 4. Tap the 3 dots in Chrome -> "Add to Home screen" or "Install app".
echo.
echo ====================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%
call npm run host
pause
