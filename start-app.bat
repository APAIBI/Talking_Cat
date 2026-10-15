@echo off
title Talking Buddies Companion Launcher
echo ====================================================
echo        Starting Talking Buddies Companion...
echo ====================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found in PATH or standard location.
    echo Please install Node.js from https://nodejs.org or via:
    echo winget install OpenJS.NodeJS.LTS
    pause
    exit /b 1
)

if not exist node_modules (
    echo [INFO] Installing required dependencies...
    call npm install
)

echo [INFO] Launching Desktop Window Application...
call npm start
pause
