@echo off
title Push to GitHub for Cloud APK Build
echo ====================================================
echo        Push to GitHub - Cloud APK Builder
echo ====================================================
echo.

set PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%

set CURRENT_ORIGIN=
for /f "tokens=*" %%a in ('git config --get remote.origin.url 2^>nul') do set CURRENT_ORIGIN=%%a

if "%CURRENT_ORIGIN%" NEQ "" (
    echo Current repository URL: %CURRENT_ORIGIN%
    echo Press ENTER to use this URL, or type a new URL below:
    set /p REPO_URL="Repository URL [%CURRENT_ORIGIN%]: "
    if "%REPO_URL%"=="" set REPO_URL=%CURRENT_ORIGIN%
) else (
    echo Step 1: Go to https://github.com/new and create a new repository
    echo         (e.g., named "Talking_Cat").
    echo.
    set /p REPO_URL="Step 2: Paste your GitHub repository URL: "
)

if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Aborting.
    pause
    exit /b 1
)

echo.
echo [INFO] Updating remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo [INFO] Adding changes and pushing to GitHub...
git add .
git commit -m "Fix gradlew script and integrate setup-gradle GitHub Action" 2>nul
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================
    echo [SUCCESS] Code pushed to GitHub!
    echo.
    echo GitHub Actions has started building your APK automatically!
    echo 1. Open your repository: %REPO_URL%
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
