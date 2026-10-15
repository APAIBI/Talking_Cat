@echo off
title Push to GitHub for Cloud APK Build
echo ====================================================
echo        Push to GitHub - Cloud APK Builder
echo ====================================================
echo.
echo Step 1: Go to https://github.com/new and create a new repository
echo         (e.g., named "talkingcat"). Leave it completely empty.
echo.
set /p REPO_URL="Step 2: Paste your GitHub repository URL here (e.g. https://github.com/username/talkingcat.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Aborting.
    pause
    exit /b 1
)

set PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%

echo.
echo [INFO] Setting remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo [INFO] Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================
    echo [SUCCESS] Code pushed to GitHub!
    echo.
    echo GitHub Actions has started building your APK automatically!
    echo 1. Open your repository in your browser: %REPO_URL%
    echo 2. Click the "Actions" tab at the top.
    echo 3. Click the running "Build Android APK" workflow.
    echo 4. When done (green checkmark), scroll down to "Artifacts"
    echo    and click "talking-companion-apk" to download your APK!
    echo ====================================================
) else (
    echo.
    echo [ERROR] Push failed. Make sure you entered the correct URL and signed in.
)

pause
