@echo off
title D2 Hub - Post-Format Environment Setup
echo ========================================================
echo             D2 Hub - Setup After Format
echo ========================================================
echo.

echo [1/3] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ and rerun this script.
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js detected:
    node -v
)

echo.
echo [2/3] Checking Rust (Cargo) installation...
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Cargo (Rust) is not found in PATH.
    echo If you want to build or run the desktop app, install Rust from https://rustup.rs/
) else (
    echo [OK] Cargo detected:
    cargo --version
)

echo.
echo [3/3] Installing NPM dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install npm dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo              Setup Completed Successfully!
echo ========================================================
echo.
echo You can now run:
echo   - "npm run dev"        (for React web frontend)
echo   - "npm run tauri dev"  (for full Desktop App)
echo.
pause
