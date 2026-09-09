@echo off
title Crystal Collector 2.0 Desktop Launcher
echo ========================================================
echo   ?? Crystal Collector 2.0 - Standalone Window
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this PC!
    echo.
    echo Please install Node.js from https://nodejs.org
    echo (Choose the recommended LTS version), then run this file again.
    echo.
    pause
    exit /b
)

if not exist "node_modules\" (
    echo [1/2] Installing dependencies for first-time setup...
    echo (This only takes a moment)
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install packages.
        pause
        exit /b
    )
)

echo.
echo [2/2] Launching Crystal Collector in desktop window...
echo.

call npm run app:dev
