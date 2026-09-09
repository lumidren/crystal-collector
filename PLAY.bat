@echo off
title Crystal Collector 2.0 Launcher
echo ========================================================
echo   ?? Crystal Collector 2.0 - Neon Cyber Odyssey
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
        echo [ERROR] Failed to install packages. Please check your internet connection.
        pause
        exit /b
    )
)

echo.
echo [2/2] Launching game in your web browser...
echo.
echo Opening: http://localhost:5173
echo Press Ctrl+C in this window anytime to stop the server.
echo.

start http://localhost:5173
call npm run dev
