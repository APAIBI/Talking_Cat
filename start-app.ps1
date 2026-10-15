Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "       Starting Talking Buddies Companion...        " -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Cyan

$env:Path += ";C:\Program Files\nodejs"

if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Green
    & "C:\Program Files\nodejs\npm.cmd" install
}

Write-Host "[INFO] Launching Desktop Window App (Electron)..." -ForegroundColor Green
& "C:\Program Files\nodejs\npm.cmd" start
